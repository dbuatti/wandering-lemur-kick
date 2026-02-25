// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

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
      console.error("[classify-ticket] GEMINI_API_KEY is missing");
      return new Response(JSON.stringify({ error: "AI service not configured. Please set GEMINI_API_KEY." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
      return new Response(JSON.stringify({ error: "Gemini API error", details: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502,
      })
    }

    if (!result.candidates || !result.candidates[0]?.content?.parts?.[0]?.text) {
      console.error("[classify-ticket] Unexpected Gemini response format:", result);
      throw new Error("Invalid response from AI service");
    }

    const aiResponse = JSON.parse(result.candidates[0].content.parts[0].text);

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[classify-ticket] Internal error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})