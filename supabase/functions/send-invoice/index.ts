// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

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
    const { invoice_id, client_email, origin } = await req.json()

    console.log("[send-invoice] Sending invoice:", invoice_id, "to", client_email);

    // Fetch invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoice_id)
      .single()

    if (invoiceError || !invoice) throw new Error("Invoice not found")

    // Fetch sender settings
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .eq('owner_user_id', invoice.owner_user_id)
      .maybeSingle()

    const publicLink = `${origin}/invoice/view/${invoice.id}?token=${invoice.public_share_token}`
    const businessName = settings?.company_name || "Daniele Buatti IT"
    const senderEmail = settings?.company_email || "daniele.buatti@gmail.com"

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${businessName} <onboarding@resend.dev>`,
        to: [client_email],
        subject: `Invoice ${invoice.number} from ${businessName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h1 style="color: #2563eb; margin-bottom: 24px;">Invoice ${invoice.number}</h1>
            <p>Hello,</p>
            <p>Please find your invoice from <strong>${businessName}</strong> for professional IT services.</p>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #e2e8f0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #64748b;">Amount Due:</span>
                <strong style="font-size: 20px;">$${invoice.total_amount.toFixed(2)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Due Date:</span>
                <strong>${new Date(invoice.due_date).toLocaleDateString()}</strong>
              </div>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${publicLink}" style="background-color: #2563eb; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                View Invoice Online
              </a>
            </div>

            <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
              You can view the full breakdown, download a PDF version, and find payment instructions by clicking the button above.
            </p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
            
            <p style="font-size: 12px; color: #94a3b8;">
              Sent by ${businessName} Support Portal.<br />
              ${senderEmail}
            </p>
          </div>
        `,
      }),
    })

    const data = await res.json()
    
    if (!res.ok) throw new Error(JSON.stringify(data))

    // Update invoice status to 'sent' if it was 'draft'
    if (invoice.status === 'draft') {
      await supabase
        .from('invoices')
        .update({ status: 'sent' })
        .eq('id', invoice_id)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[send-invoice] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})