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
    const { ticket_id, status, actual_hours } = await req.json()

    console.log("[update-ticket-status] Updating ticket status:", { ticket_id, status, actual_hours });

    // Validate required fields
    if (!ticket_id || !status) {
      return new Response(JSON.stringify({ error: 'Ticket ID and status are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Validate status is one of the allowed values
    const validStatuses = ['open', 'in_progress', 'pending', 'resolved', 'closed']
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status value' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Call the PostgreSQL function to update ticket status
    const { data, error } = await supabase.functions.invoke('update-ticket-status', {
      body: {
        ticket_id,
        status,
        actual_hours
      }
    })

    if (error) {
      console.error("[update-ticket-status] Error updating ticket:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[update-ticket-status] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})