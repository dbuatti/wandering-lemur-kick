import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.97.0'

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
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_ANON_KEY') || '',
    { global: { headers: { Authorization: authHeader } } }
  )

  try {
    const body = await req.json().catch(() => ({}));
    const { status, priority, category, client_id, limit = 10, offset = 0 } = body;
    
    console.log("[get-tickets] Fetching tickets with filters:", { status, priority, category, client_id });

    let query = supabase
      .from('tickets')
      .select('*')
      .order('ticket_number', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') query = query.eq('status', status)
    if (priority && priority !== 'all') query = query.eq('priority', priority)
    if (category && category !== 'all') query = query.eq('category', category)
    if (client_id && client_id !== 'all') query = query.eq('client_id', client_id)

    const { data, error } = await query

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[get-tickets] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})