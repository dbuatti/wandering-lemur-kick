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
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_ANON_KEY') || '',
    { global: { headers: { Authorization: authHeader } } }
  )

  try {
    const { ticket_id, title, description, comments, force_refresh = false } = await req.json()
    
    console.log("[analyze-ticket] Processing request for ticket:", ticket_id);

    // 1. Check if we already have a saved analysis and we're not forcing a refresh
    if (!force_refresh) {
      const { data: existingAnalysis } = await supabase
        .from('ticket_ai_analyses')
        .select('*')
        .eq('ticket_id', ticket_id)
        .single();

      if (existingAnalysis) {
        console.log("[analyze-ticket] Returning existing analysis for ticket:", ticket_id);
        return new Response(JSON.stringify(existingAnalysis), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    }

    // 2. Generate new analysis with Gemini
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const commentText = comments?.map((c: any) => `${c.is_internal ? '[Internal]' : '[Public]'} ${c.content}`).join("\n") || "No comments yet.";
    
    const prompt = `
      You are an expert IT Support Specialist and Security Auditor. 
      Analyze the following support ticket and provide a concise summary and a detailed technical solution.
      
      Ticket Title: ${title}
      Description: ${description}
      
      Activity Log:
      ${commentText}
      
      Return your response in JSON format with exactly these keys:
      {
        "summary": "A 1-2 sentence summary of the core problem",
        "solution": "A detailed, step-by-step technical solution formatted in Markdown. Use bolding, lists, and code blocks where appropriate for clarity.",
        "confidence": 0.95
      }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("[analyze-ticket] Gemini API error:", result);
      throw new Error("Failed to get response from Gemini");
    }

    const aiResponse = JSON.parse(result.candidates[0].content.parts[0].text);

    // 3. Persist the analysis to the database
    const { data: savedData, error: saveError } = await supabase
      .from('ticket_ai_analyses')
      .upsert({
        ticket_id,
        summary: aiResponse.summary,
        solution: aiResponse.solution,
        confidence: aiResponse.confidence,
        updated_at: new Date().toISOString()
      }, { onConflict: 'ticket_id' })
      .select()
      .single();

    if (saveError) {
      console.error("[analyze-ticket] Error saving analysis:", saveError);
      // We still return the AI response even if saving failed
      return new Response(JSON.stringify({ ...aiResponse, timestamp: new Date().toISOString() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    return new Response(JSON.stringify(savedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[analyze-ticket] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})