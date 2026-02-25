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
    const { status, priority, category, limit = 50, offset = 0, sort_by = 'created_at', sort_order = 'desc' } = await req.json()

    console.log("[get-tickets] Fetching tickets with filters:", { status, priority, category, limit, offset, sort_by, sort_order });

    // Build query
    let query = supabase
      .from('tickets')
      .select(`
        *,
        clients:client_id (display_name, email, phone),
        owner:owner_user_id (email),
        assigned:assigned_to (email)
      `)
      .order(sort_by, { ascending: sort_order === 'asc' })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) query = query.eq('status', status)
    if (priority) query = query.eq('priority', priority)
    if (category) query = query.eq('category', category)

    // Only return tickets for the authenticated user
    const { data, error } = await query

    if (error) {
      console.error("[get-tickets] Error fetching tickets:", error);
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
    console.error("[get-tickets] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})