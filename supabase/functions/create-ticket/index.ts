// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'No authorization header' }), { 
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
    const body = await req.json()
    console.log("[create-ticket] Creating ticket for:", body.client_display_name);

    // Explicitly map fields to ensure we don't send extra data that might crash the insert
    const ticketData = {
      client_id: body.client_id,
      client_display_name: body.client_display_name,
      client_email: body.client_email,
      client_phone: body.client_phone,
      title: body.title,
      description: body.description,
      priority: body.priority || 'medium',
      category: body.category || 'other',
      estimated_hours: body.estimated_hours,
      tags: body.tags || [],
      attachments: body.attachments || [],
      status: 'open',
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert([ticketData])
      .select()
      .single()

    if (error) {
      console.error("[create-ticket] Database error:", error);
      throw error;
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[create-ticket] Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})