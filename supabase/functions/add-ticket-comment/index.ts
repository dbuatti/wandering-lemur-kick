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
    const { ticket_id, content, is_internal } = await req.json()

    console.log("[add-ticket-comment] Adding comment to ticket:", { ticket_id, is_internal });

    if (!ticket_id || !content) {
      return new Response(JSON.stringify({ error: 'Ticket ID and content are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Insert directly into the table
    const { data, error } = await supabase
      .from('ticket_comments')
      .insert([{
        ticket_id,
        content,
        is_internal: !!is_internal
      }])
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ success: true, comment_id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[add-ticket-comment] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})