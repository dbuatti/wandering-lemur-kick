// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.97.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_ANON_KEY') || '',
    { global: { headers: { Authorization: authHeader } } }
  )

  try {
    const { email_text } = await req.json()
    
    if (!email_text || email_text.length < 20) {
      return new Response(JSON.stringify({ error: "Email text too short for analysis" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log("[process-email-chain] Fetching context for AI analysis...");

    // Fetch active tickets and clients for context
    const [ticketsRes, clientsRes] = await Promise.all([
      supabase.from('tickets').select('id, ticket_number, title, status, client_display_name').neq('status', 'closed').order('updated_at', { ascending: false }).limit(30),
      supabase.from('clients').select('id, display_name, email').order('display_name', { ascending: true })
    ]);

    const existingTickets = ticketsRes.data || [];
    const existingClients = clientsRes.data || [];

    if (!GEMINI_API_KEY) {
      throw new Error("AI service not configured. Please set GEMINI_API_KEY.");
    }

    const prompt = `
      You are an expert IT Support Dispatcher. Analyze the following email chain and compare it against the list of existing active tickets.
      
      Email Chain:
      """
      ${email_text}
      """
      
      Existing Active Tickets:
      ${JSON.stringify(existingTickets.map(t => ({ id: t.id, number: t.ticket_number, title: t.title, client: t.client_display_name })))}
      
      Existing Clients:
      ${JSON.stringify(existingClients.map(c => ({ id: c.id, name: c.display_name, email: c.email })))}
      
      Your task:
      1. Determine if this email is an update to an EXISTING ticket or a NEW request.
      2. If it's an update, identify the ticket ID.
      3. If it's a new request, suggest ticket details and try to match it to an existing client by name or email found in the chain.
      
      Return your response in JSON format with exactly these keys:
      {
        "action": "create" | "update" | "none",
        "confidence": 0.0 to 1.0,
        "reasoning": "Brief explanation of why you chose this action",
        "ticket_id": "The UUID of the existing ticket if action is 'update', otherwise null",
        "suggested_ticket": {
          "title": "Concise professional title",
          "description": "Cleaned up summary of the request",
          "priority": "low" | "medium" | "high" | "urgent",
          "category": "security" | "setup" | "optimization" | "recovery" | "other",
          "client_id": "The UUID of the matched client if found, otherwise null",
          "client_name": "The name of the client identified from the email"
        },
        "suggested_update": {
          "content": "A professional summary of the new information to be added as a comment",
          "is_internal": false
        }
      }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("[process-email-chain] Gemini API error:", result);
      throw new Error("AI service error");
    }

    const aiResponse = JSON.parse(result.candidates[0].content.parts[0].text);

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[process-email-chain] Internal error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})