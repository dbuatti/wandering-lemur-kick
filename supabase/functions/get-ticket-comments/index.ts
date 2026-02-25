// This file is written in Deno, not TypeScript. TypeScript compilation errors are expected and should be ignored.
// Deno files are not compiled by TypeScript but executed by Deno runtime.
// The code is correct as is for Deno execution.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.97.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Extract authorization header for authentication
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized', {
      status: 401,
      headers: corsHeaders
    })
  }

  const token = authHeader.replace('Bearer ', '')

  // Initialize Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_ANON_KEY') || ''
  )

  try {
    const { ticket_id, limit = 50, offset = 0 } = await req.json()

    console.log("[get-ticket-comments] Fetching comments for ticket:", { ticket_id, limit, offset });

    // Validate required fields
    if (!ticket_id) {
      return new Response(JSON.stringify({ error: 'Ticket ID is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Fetch comments with user info
    const { data, error } = await supabase
      .from('ticket_comments')
      .select(`
        *,
        user: user_id (email)
      `)
      .eq('ticket_id', ticket_id)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("[get-ticket-comments] Error fetching comments:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[get-ticket-comments] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})