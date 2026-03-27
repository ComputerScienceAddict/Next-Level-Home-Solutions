'use client';

import { useState } from 'react';

interface ContactFormProps {
  variant?: 'default' | 'compact' | 'message';
  title?: string;
  subtitle?: string;
  /** Shown in lead emails only (e.g. which foreclosure option they clicked). */
  leadContext?: string | null;
}

export default function ContactForm({
  variant = 'default',
  title = 'Get your offer',
  subtitle = 'Same day, no obligation. Or call/text 559-991-2190.',
  leadContext = null,
}: ContactFormProps) {
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();

    if (!name || !email) {
      setStatus('error');
      setErrorMsg('Please enter your name and email.');
      return;
    }
    if (variant !== 'message') {
      if (!agreed) {
        setStatus('error');
        setErrorMsg('Please check the box to agree to receive communications.');
        return;
      }
    } else {
      if (!fd.get('agree')) {
        setStatus('error');
        setErrorMsg('Please check the box to agree to the Terms and Privacy Policy.');
        return;
      }
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      // Build record from form data
      const record: Record<string, unknown> = {
        form_type: variant === 'message' ? 'message' : 'offer',
        name: String(fd.get('name')),
        email: String(fd.get('email')),
        phone: fd.get('phone') ? String(fd.get('phone')) : null,
        source: 'website',
      };

      if (variant === 'message') {
        record.subject = fd.get('subject') ? String(fd.get('subject')) : null;
        record.message = fd.get('message') ? String(fd.get('message')) : null;
        record.agreed_communications = true;
        record.agreed_terms = true;
      } else {
        record.address = fd.get('address') ? String(fd.get('address')) : null;
        record.city = fd.get('city') ? String(fd.get('city')) : null;
        record.state = fd.get('state') ? String(fd.get('state')) : null;
        record.zip = fd.get('zip') ? String(fd.get('zip')) : null;
        record.agreed_communications = agreed;
        if (leadContext?.trim()) {
          record.context_note = leadContext.trim();
        }
      }

      // 1. SEND EMAIL + SAVE (via Next.js API route – no Edge Function needed)
      const res = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);

      setStatus('success');
      setAgreed(false);
      form.reset();
    } catch (err) {
      setStatus('error');
      const msg =
        err instanceof Error
          ? err.message
          : (err as { context?: { body?: { error?: string } } })?.context?.body?.error
            ? String((err as { context: { body: { error: string } } }).context.body.error)
            : 'Something went wrong. Check console (F12) for details.';
      setErrorMsg(msg);
    }
  };

  if (variant === 'message') {
    return (
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <input type="text" name="name" required placeholder="Name" className="input-field input-premium" />
          <input type="email" name="email" required placeholder="Email" className="input-field input-premium" />
        </div>
        <input type="tel" name="phone" placeholder="Phone" className="input-field input-premium" />
        <input type="text" name="subject" placeholder="Subject" className="input-field input-premium" />
        <textarea name="message" rows={3} placeholder="Message" className="input-field input-premium resize-none" />
        <label className="flex items-start gap-3 cursor-pointer text-warmgray">
          <input type="checkbox" name="agree" required className="mt-1 h-4 w-4 shrink-0 rounded border-warmgray/40 text-[#8b7355] focus:ring-[#8b7355]/50" />
          <span className="text-[14px] leading-snug">I agree to the <a href="/terms-conditions" className="text-[#8b7355] hover:underline">Terms</a> and <a href="/privacy-policy" className="text-[#8b7355] hover:underline">Privacy Policy</a></span>
        </label>
        <div role="alert" className="rounded-xl px-4 py-3 text-sm font-medium" aria-live="polite">
          {status === 'success' && <p className="text-emerald-700">Message sent! We&apos;ll get back to you soon.</p>}
          {status === 'error' && <p className="text-red-600">{errorMsg}</p>}
          {status === 'loading' && <p className="text-warmgray animate-pulse">Sending…</p>}
        </div>
        <button type="submit" className="btn-premium w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <a href="tel:559-991-2190" className="text-sm text-warmgray/90 hover:text-[#8b7355] transition-colors">{subtitle}</a>
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="text" name="name" required placeholder="Name" className="input-field input-premium" />
        <input type="email" name="email" required placeholder="Email" className="input-field input-premium" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="tel" name="phone" placeholder="Phone" className="input-field input-premium" />
        <input type="text" name="address" placeholder="Property address" className="input-field input-premium" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <input type="text" name="city" placeholder="City" className="input-field input-premium" />
        <input type="text" name="state" placeholder="State" className="input-field input-premium" />
        <input type="text" name="zip" placeholder="Zip" className="input-field input-premium" />
      </div>
      <label className={`flex items-start gap-3 cursor-pointer ${status === 'error' && !agreed ? 'text-red-600' : 'text-warmgray'}`}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => { setAgreed(e.target.checked); setErrorMsg(''); }}
          className="mt-1 h-4 w-4 shrink-0 rounded border-warmgray/40 text-[#8b7355] focus:ring-[#8b7355]/50"
        />
        <span className="text-[14px] leading-snug">I agree to receive communications from Next Level Home Solutions</span>
      </label>
      <div role="alert" className="rounded-xl px-4 py-3 text-sm font-medium" aria-live="polite">
        {status === 'success' && <p className="text-emerald-700">Thanks! We&apos;ll be in touch soon.</p>}
        {status === 'error' && <p className="text-red-600">{errorMsg}</p>}
        {status === 'loading' && <p className="text-warmgray animate-pulse">Sending…</p>}
      </div>
      <button
        type="submit"
        className="btn-premium w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending…' : 'Get my offer'}
      </button>
    </form>
  );
}
