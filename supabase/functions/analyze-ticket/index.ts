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
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }

  try {
    const { title, description, comments } = await req.json()
    console.log("[analyze-ticket] Analyzing ticket with Gemini:", title);

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const commentText = comments?.map((c: any) => `${c.is_internal ? '[Internal]' : '[Public]'} ${c.content}`).join("\n") || "No comments yet.";
    
    const prompt = `
      You are an expert IT Support Specialist and Security Auditor. 
      Analyze the following support ticket and provide a concise summary and a suggested technical solution.
      
      Ticket Title: ${title}
      Description: ${description}
      
      Activity Log:
      ${commentText}
      
      Return your response in JSON format with exactly these keys:
      {
        "summary": "A 1-2 sentence summary of the core problem",
        "solution": "A step-by-step technical solution or next steps",
        "confidence": 0.95
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
      console.error("[analyze-ticket] Gemini API error:", result);
      throw new Error("Failed to get response from Gemini");
    }

    const aiResponse = JSON.parse(result.candidates[0].content.parts[0].text);

    return new Response(JSON.stringify({
      ...aiResponse,
      timestamp: new Date().toISOString()
    }), {
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