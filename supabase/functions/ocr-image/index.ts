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
    const { image_base64 } = await req.json()
    
    if (!image_base64) {
      return new Response(JSON.stringify({ error: "No image data provided" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log("[ocr-image] Analyzing image for text extraction...");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Extract the base64 data (remove data:image/xxx;base64, prefix if present)
    const base64Data = image_base64.split(',')[1] || image_base64;
    const mimeType = image_base64.split(';')[0].split(':')[1] || 'image/jpeg';

    const prompt = "Extract all text from this image. If it's a screenshot of a technical issue, an error message, or a handwritten note, transcribe it exactly as it appears. Return only the transcribed text, nothing else.";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }]
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("[ocr-image] Gemini API error:", result);
      throw new Error("Failed to get response from Gemini");
    }

    const extractedText = result.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ text: extractedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[ocr-image] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})