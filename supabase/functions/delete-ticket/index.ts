// @ts-nocheck
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

  // Create a service role client to bypass RLS for the deletion, 
  // but we will manually verify ownership first.
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  )

  try {
    const { ticket_id } = await req.json()
    console.log("[delete-ticket] Attempting to delete ticket:", ticket_id);

    if (!ticket_id) {
      return new Response(JSON.stringify({ error: 'Ticket ID is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 1. Get the user from the token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error("Could not verify user identity")
    }

    // 2. Verify ownership of the ticket
    const { data: ticket, error: fetchError } = await supabaseAdmin
      .from('tickets')
      .select('owner_user_id')
      .eq('id', ticket_id)
      .single()

    if (fetchError || !ticket) {
      return new Response(JSON.stringify({ error: 'Ticket not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    if (ticket.owner_user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'You do not have permission to delete this ticket' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      })
    }

    // 3. Delete associated comments first (to avoid foreign key constraint errors)
    const { error: commentsError } = await supabaseAdmin
      .from('ticket_comments')
      .delete()
      .eq('ticket_id', ticket_id)

    if (commentsError) {
      console.error("[delete-ticket] Error deleting comments:", commentsError);
      throw new Error("Failed to delete ticket comments")
    }

    // 4. Delete the ticket
    const { error: deleteError } = await supabaseAdmin
      .from('tickets')
      .delete()
      .eq('id', ticket_id)

    if (deleteError) throw deleteError

    console.log("[delete-ticket] Successfully deleted ticket and comments:", ticket_id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[delete-ticket] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})