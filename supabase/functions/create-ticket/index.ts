// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.97.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
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

    const body = await req.json()
    console.log("[create-ticket] Creating ticket for:", body.client_display_name);

    const ticketData = {
      client_id: body.client_id,
      client_display_name: body.client_display_name,
      client_email: body.client_email,
      client_phone: body.client_phone,
      title: body.title,
      description: body.description,
      priority: body.priority || 'medium',
      category: body.category || 'other',
      service_tier: body.service_tier || 'optimization',
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

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[create-ticket] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})