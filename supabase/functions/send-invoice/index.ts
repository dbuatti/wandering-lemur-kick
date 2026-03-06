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
    const senderEmail = settings?.company_email || "billing@danielebuatti.com"
    const isTaxInvoice = settings?.company_tax_status === 'GST Registered'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${businessName} <billing@danielebuatti.com>`,
        to: [client_email],
        subject: `${isTaxInvoice ? 'Tax Invoice' : 'Invoice'} ${invoice.number} from ${businessName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f7f9; }
              .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
              .header { background-color: #00022D; padding: 48px 40px; color: #ffffff; }
              .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; text-transform: uppercase; color: #3b82f6; }
              .header p { margin: 8px 0 0; opacity: 0.7; font-size: 14px; }
              .content { padding: 40px; }
              .greeting { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
              .label { color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
              .value { font-weight: 700; color: #0f172a; font-size: 16px; }
              .total-value { font-size: 28px; color: #3b82f6; }
              .button { display: inline-block; background-color: #3b82f6; color: #ffffff !important; padding: 18px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; text-align: center; transition: all 0.2s; }
              .footer { padding: 40px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px; }
              .security-note { font-size: 11px; color: #cbd5e1; margin-top: 24px; font-style: italic; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${businessName}</h1>
                <p>Professional IT Support & Security</p>
              </div>
              <div class="content">
                <div class="greeting">Hello,</div>
                <p>Please find your ${isTaxInvoice ? 'tax invoice' : 'invoice'} for recent professional services. You can view the full breakdown and payment instructions using the secure link below.</p>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; border-collapse: separate;">
                  <tr>
                    <td style="padding: 32px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td class="label" style="padding-bottom: 16px;">Invoice Number</td>
                          <td class="value" style="padding-bottom: 16px; text-align: right;">${invoice.number}</td>
                        </tr>
                        <tr>
                          <td class="label" style="padding-bottom: 16px;">Due Date</td>
                          <td class="value" style="padding-bottom: 16px; text-align: right;">${new Date(invoice.due_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                        </tr>
                        <tr>
                          <td class="label" style="padding-top: 16px; border-top: 1px solid #e2e8f0;">Amount Due</td>
                          <td class="value total-value" style="padding-top: 16px; text-align: right; border-top: 1px solid #e2e8f0;">$${invoice.total_amount.toFixed(2)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <div style="text-align: center; margin: 40px 0;">
                  <a href="${publicLink}" class="button">View & Pay Invoice</a>
                </div>

                <p style="font-size: 14px; color: #64748b;">If you have any questions regarding this invoice, please reply directly to this email.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
                <p>${senderEmail} &bull; Melbourne, AU</p>
                <div class="security-note">
                  This is a secure digital invoice sent via the Daniele Buatti Support Portal.
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    })

    const data = await res.json()
    
    if (!res.ok) throw new Error(JSON.stringify(data))

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