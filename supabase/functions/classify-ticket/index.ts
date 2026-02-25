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

  try {
    const { description } = await req.json()
    
    if (!description || description.length < 10) {
      return new Response(JSON.stringify({ error: "Description too short for analysis" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log("[classify-ticket] Analyzing description...");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompt = `
      You are an expert IT Support Dispatcher. Analyze the following raw IT support request description and extract structured data.
      
      Raw Description: "${description}"
      
      Available Categories: security, setup, optimization, recovery, other
      Available Priorities: low, medium, high, urgent
      
      Return your response in JSON format with exactly these keys:
      {
        "suggested_title": "A concise, professional title for the ticket",
        "suggested_category": "one of the available categories",
        "suggested_priority": "one of the available priorities",
        "suggested_tags": ["tag1", "tag2"],
        "formatted_description": "A cleaned up, professional version of the description, perhaps using bullet points if appropriate."
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
      console.error("[classify-ticket] Gemini API error:", result);
      throw new Error("Failed to get response from Gemini");
    }

    const aiResponse = JSON.parse(result.candidates[0].content.parts[0].text);

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[classify-ticket] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})