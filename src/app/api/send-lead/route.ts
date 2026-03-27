import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

/** Lead notification inboxes (both receive every form submission). */
const NOTIFY_EMAILS = ['computergamer844@gmail.com', 'eian.hernandez1414@gmail.com'];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(req: Request) {
  try {
    const { record } = await req.json();
    if (!record?.name || !record?.email) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_ADDRESS;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      return NextResponse.json(
        { error: 'Email not configured. Add GMAIL_ADDRESS and GMAIL_APP_PASSWORD to .env.local' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass },
    });

    const isOffer = record.form_type === 'offer';
    const addressLine =
      [record.address, record.city, record.state, record.zip].filter(Boolean).join(', ') || 'Not provided';
    const hasMessage = !!(record.message && String(record.message).trim());

    const name = escapeHtml(String(record.name));
    const emailRaw = String(record.email);
    const email = escapeHtml(emailRaw);
    const phone = escapeHtml(String(record.phone || 'Not provided'));
    const addrSafe = escapeHtml(addressLine);
    const subjectLine = record.subject ? escapeHtml(String(record.subject)) : '';
    const messageBody = hasMessage ? escapeHtml(String(record.message)).replace(/\n/g, '<br/>') : '';
    const sourceSafe = escapeHtml(String(record.source || 'website'));
    const contextNoteRaw = record.context_note ? String(record.context_note).trim() : '';
    const contextNote = contextNoteRaw ? escapeHtml(contextNoteRaw) : '';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 24px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #eef1f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(30,45,61,0.12); border: 1px solid #e2e8f0;">
    <tr>
      <td style="background: #1e2d3d; padding: 32px 28px;">
        <p style="margin: 0 0 6px; color: #c9a86c; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;">Next Level Home Solutions</p>
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25;">
          ${isOffer ? 'New cash-offer request' : 'New website inquiry'}
        </h1>
        <p style="margin: 10px 0 0; color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.5;">Use <strong style="color: #fff;">Reply</strong> in your email app to respond directly to this person.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 28px 32px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
          <tr>
            <td style="padding: 0 0 20px; border-bottom: 1px solid #edf2f7;">
              <p style="margin: 0 0 6px; color: #8b7355; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">Name</p>
              <p style="margin: 0; font-size: 17px; color: #1e2d3d; font-weight: 600;">${name}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0; border-bottom: 1px solid #edf2f7;">
              <p style="margin: 0 0 6px; color: #8b7355; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">Email</p>
              <p style="margin: 0; font-size: 15px;"><a href="mailto:${emailRaw.replace(/[<>"']/g, '')}" style="color: #2c5282; text-decoration: none; font-weight: 500;">${email}</a></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0; border-bottom: 1px solid #edf2f7;">
              <p style="margin: 0 0 6px; color: #8b7355; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">Phone</p>
              <p style="margin: 0; font-size: 15px; color: #1e2d3d;">${phone}</p>
            </td>
          </tr>
          ${contextNote ? `
          <tr>
            <td style="padding: 20px 0; border-bottom: 1px solid #edf2f7;">
              <p style="margin: 0 0 6px; color: #8b7355; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">What they asked about</p>
              <p style="margin: 0; font-size: 15px; color: #1e2d3d; line-height: 1.5;">${contextNote}</p>
            </td>
          </tr>
          ` : ''}
          ${isOffer ? `
          <tr>
            <td style="padding: 20px 0; border-bottom: 1px solid #edf2f7;">
              <p style="margin: 0 0 6px; color: #8b7355; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">Property</p>
              <p style="margin: 0; font-size: 15px; color: #1e2d3d; line-height: 1.5;">${addrSafe}</p>
            </td>
          </tr>
          ` : ''}
          ${hasMessage ? `
          <tr>
            <td style="padding: 20px 0 0;">
              <p style="margin: 0 0 6px; color: #8b7355; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">${record.subject ? 'Subject & message' : 'Message'}</p>
              ${record.subject ? `<p style="margin: 0 0 12px; font-size: 15px; color: #1e2d3d; font-weight: 600;">${subjectLine}</p>` : ''}
              <div style="margin: 0; padding: 18px 20px; background: #f7fafc; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 15px; color: #2d3748; line-height: 1.65;">${messageBody}</div>
            </td>
          </tr>
          ` : ''}
        </table>
        <p style="margin: 28px 0 0; padding-top: 20px; border-top: 1px solid #edf2f7; font-size: 12px; color: #a0aec0; text-align: center;">Submitted via ${sourceSafe} · ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    await transporter.sendMail({
      from: `"Next Level Home Solutions" <${gmailUser}>`,
      to: NOTIFY_EMAILS,
      replyTo: record.email,
      subject: `${isOffer ? '🏠 Offer' : '✉️ Contact'}: ${record.name}${contextNoteRaw ? ` · ${contextNoteRaw}` : ''} — Next Level Home Solutions`,
      html: emailHtml,
    });

    if (record.form_type === 'message' && record.email) {
      const autoReplyHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 24px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    <tr>
      <td style="background: linear-gradient(135deg, #1e2d3d 0%, #2a3d52 100%); padding: 24px 28px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 20px; font-weight: 600;">Thanks for reaching out</h1>
        <p style="margin: 6px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Next Level Home Solutions</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px;">
        <p style="margin: 0 0 16px; font-size: 15px; color: #333; line-height: 1.6;">Hi ${escapeHtml(String(record.name))},</p>
        <p style="margin: 0 0 20px; font-size: 15px; color: #333; line-height: 1.6;">We received your message and will get back to you soon—usually the same day.</p>
        <p style="margin: 0; font-size: 14px; color: #666;">Need to speak with us right away?</p>
        <p style="margin: 8px 0 0;"><a href="tel:559-991-2190" style="color: #8b7355; font-weight: 600; text-decoration: none;">559-991-2190</a> — Call or text</p>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim();
      await transporter.sendMail({
        from: gmailUser,
        to: record.email,
        subject: "We got your message — Next Level Home Solutions",
        html: autoReplyHtml,
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from('lead_submissions').insert({
        form_type: record.form_type || 'offer',
        name: record.name,
        email: record.email,
        phone: record.phone || null,
        address: record.address || null,
        city: record.city || null,
        state: record.state || null,
        zip: record.zip || null,
        subject: record.subject || null,
        message: record.message || null,
        agreed_communications: record.agreed_communications ?? true,
        agreed_terms: record.agreed_terms ?? false,
        source: record.source || 'website',
      });
      if (error) {
        console.error('Supabase insert error:', error);
        return NextResponse.json(
          { error: 'Email sent but failed to save to database: ' + error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: 'Success' });
  } catch (err) {
    console.error('Send lead error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to send' },
      { status: 500 }
    );
  }
}
