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
    const { text } = await req.json()
    
    if (!text || text.length < 10) {
      return new Response(JSON.stringify({ error: "Text too short for analysis" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log("[extract-assets] Analyzing text for IT assets...");

    if (!GEMINI_API_KEY) {
      throw new Error("AI service not configured. Please set GEMINI_API_KEY.");
    }

    const prompt = `
      You are an expert IT Support Assistant. Extract structured IT assets from the following raw text (which may be an email thread or notes).
      
      Raw Text: "${text}"
      
      Identify:
      1. Devices (e.g., iMac, Laptop, MacBook, iPhone)
      2. Logins/Accounts (e.g., iCloud, System Password, Gmail)
      3. Passwords, hints, or recovery keys
      
      Return your response as a JSON object with a key "assets" containing an array of objects.
      Each asset object must have:
      {
        "name": "A clear title for the asset",
        "asset_type": "one of: device, login, software, other",
        "details": { 
          "password": "the password if found",
          "username": "the username if found",
          "model": "the device model if found",
          "notes": "any other relevant context"
        }
      }
      
      Return ONLY the JSON.
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
      console.error("[extract-assets] Gemini API error:", result);
      throw new Error("AI service error");
    }

    const aiResponse = JSON.parse(result.candidates[0].content.parts[0].text);

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[extract-assets] Internal error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})