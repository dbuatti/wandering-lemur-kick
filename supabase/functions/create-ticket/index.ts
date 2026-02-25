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
    const { 
      client_id, 
      client_display_name, 
      client_email, 
      client_phone, 
      title, 
      description, 
      category, 
      priority,
      related_invoice_id,
      related_quote_id
    } = await req.json()

    console.log("[create-ticket] Creating ticket:", { 
      client_id, 
      title, 
      category, 
      priority 
    });

    // Validate required fields
    if (!title || !description) {
      return new Response(JSON.stringify({ error: 'Title and description are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Call the PostgreSQL function to create the ticket
    const { data, error } = await supabase.functions.invoke('create-ticket-from-enquiry', {
      body: {
        client_id,
        client_display_name,
        client_email,
        client_phone,
        title,
        description,
        category,
        priority,
        related_invoice_id,
        related_quote_id
      }
    })

    if (error) {
      console.error("[create-ticket] Error creating ticket:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ success: true, ticket_id: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[create-ticket] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})