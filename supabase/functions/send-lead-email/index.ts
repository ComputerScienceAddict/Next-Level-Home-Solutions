import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts"

const GMAIL_USER = Deno.env.get("GMAIL_ADDRESS")
const GMAIL_PASS = Deno.env.get("GMAIL_APP_PASSWORD")
const NOTIFY_EMAIL = "computergamer844@gmail.com"

serve(async (req) => {
  try {
    // 1. Get the data from the Supabase Webhook
    const payload = await req.json()
    const record = payload.record

    // 2. Setup the Gmail SMTP Client
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: GMAIL_USER!,
          password: GMAIL_PASS!,
        },
      },
    })

    // 3. Create a nice looking HTML body using your table's columns
    const emailHtml = `
      <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #333;">New ${record.form_type === 'offer' ? '💰 Offer' : '📩 Message'} Received</h2>
        <p><strong>From:</strong> ${record.name} (${record.email})</p>
        <p><strong>Phone:</strong> ${record.phone || 'Not provided'}</p>
        <p><strong>Address:</strong> ${record.address || ''} ${record.city || ''}, ${record.state || ''} ${record.zip || ''}</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p><strong>Subject:</strong> ${record.subject || 'No Subject'}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #ccc;">
          ${record.message || '—'}
        </blockquote>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999;">Source: ${record.source || 'website'} | ID: ${record.id}</p>
      </div>
    `

    // 4. Send the email
    await client.send({
      from: GMAIL_USER!,
      to: NOTIFY_EMAIL,
      subject: `[Lead Notification] ${record.form_type?.toUpperCase() || 'LEAD'}: ${record.name}`,
      html: emailHtml,
    })

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
})
