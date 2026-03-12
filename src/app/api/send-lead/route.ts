import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const NOTIFY_EMAIL = 'computergamer844@gmail.com';

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
    const addressLine = [record.address, record.city, record.state, record.zip].filter(Boolean).join(', ') || 'Not provided';
    const hasMessage = !!(record.message && String(record.message).trim());

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 24px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1e2d3d 0%, #2a3d52 100%); padding: 28px 32px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 22px; font-weight: 600; letter-spacing: -0.02em;">
          ${isOffer ? '💰 New Offer' : '📩 New Message'}
        </h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Next Level Home Solutions</p>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 32px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
              <span style="color: #8b7355; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">Contact</span>
              <p style="margin: 4px 0 0; font-size: 16px; color: #1e2d3d; font-weight: 500;">${record.name}</p>
              <p style="margin: 2px 0 0; font-size: 14px; color: #666;"><a href="mailto:${record.email}" style="color: #8b7355; text-decoration: none;">${record.email}</a></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
              <span style="color: #8b7355; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">Phone</span>
              <p style="margin: 4px 0 0; font-size: 15px; color: #1e2d3d;">${record.phone || 'Not provided'}</p>
            </td>
          </tr>
          ${isOffer ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
              <span style="color: #8b7355; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">Property Address</span>
              <p style="margin: 4px 0 0; font-size: 15px; color: #1e2d3d;">${addressLine}</p>
            </td>
          </tr>
          ` : ''}
          ${hasMessage ? `
          <tr>
            <td style="padding: 12px 0;">
              <span style="color: #8b7355; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">${record.subject ? 'Subject' : 'Message'}</span>
              ${record.subject ? `<p style="margin: 4px 0 8px; font-size: 14px; color: #333;">${record.subject}</p>` : ''}
              <p style="margin: 0; padding: 16px; background: #f8f7f5; border-radius: 8px; border-left: 4px solid #8b7355; font-size: 14px; color: #444; line-height: 1.6;">${record.message}</p>
            </td>
          </tr>
          ` : ''}
        </table>
        <p style="margin: 24px 0 0; font-size: 11px; color: #aaa;">From ${record.source || 'website'}</p>
        <a href="mailto:${record.email}?subject=Re: Your inquiry with Next Level Home Solutions" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #8b7355; color: #fff !important; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px;">Reply to lead</a>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    await transporter.sendMail({
      from: gmailUser,
      to: NOTIFY_EMAIL,
      subject: `[Lead Notification] ${(record.form_type || 'LEAD').toUpperCase()}: ${record.name}`,
      html: emailHtml,
    });

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
