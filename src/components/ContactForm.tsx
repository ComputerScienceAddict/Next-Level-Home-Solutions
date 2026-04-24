'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();

    // Reset errors
    setFieldErrors({});
    setErrorMsg('');

    // Validate fields
    const errors: Record<string, string> = {};
    if (!name) errors.name = 'Name is required';
    if (!email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email';
    }
    if (phone && !validatePhone(phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (variant !== 'message') {
      if (!agreed) {
        errors.agree = 'Please agree to receive communications';
      }
    } else {
      if (!fd.get('agree')) {
        errors.agree = 'Please agree to the Terms and Privacy Policy';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus('error');
      setErrorMsg(Object.values(errors)[0]);
      return;
    }

    setStatus('loading');

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

      const res = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);

      if (variant === 'message') {
        setStatus('success');
        setAgreed(false);
        form.reset();
      } else {
        router.push('/get-offer/thank-you');
      }
    } catch (err) {
      setStatus('error');
      const msg =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again or call us directly.';
      setErrorMsg(msg);
    }
  };

  const inputBaseClass = "w-full border-b-2 bg-transparent px-0 py-3.5 text-black placeholder:text-black/40 focus:outline-none transition-all duration-200";
  const inputNormalClass = `${inputBaseClass} border-black/20 focus:border-gold-400`;
  const inputErrorClass = `${inputBaseClass} border-red-400 focus:border-red-500`;

  if (variant === 'message') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="relative">
            <input
              type="text"
              name="name"
              required
              placeholder="Name *"
              className={fieldErrors.name ? inputErrorClass : inputNormalClass}
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              placeholder="Email *"
              className={fieldErrors.email ? inputErrorClass : inputNormalClass}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
          </div>
        </div>
        <div className="relative">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className={fieldErrors.phone ? inputErrorClass : inputNormalClass}
          />
          {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
        </div>
        <input type="text" name="subject" placeholder="Subject" className={inputNormalClass} />
        <textarea
          name="message"
          rows={4}
          placeholder="Message"
          className={`${inputNormalClass} resize-none`}
        />
        <label className={`flex items-start gap-3 cursor-pointer transition-colors ${
          fieldErrors.agree ? 'text-red-600' : 'text-warmgray hover:text-black'
        }`}>
          <input
            type="checkbox"
            name="agree"
            required
            className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300 text-gold-400 focus:ring-gold-400 focus:ring-2 transition-all"
          />
          <span className="text-[14px] leading-snug">
            I agree to the{' '}
            <a href="/terms-conditions" className="font-medium text-gold-400 hover:text-gold-500 underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="font-medium text-gold-400 hover:text-gold-500 underline">
              Privacy Policy
            </a>
          </span>
        </label>
        {status !== 'idle' && (
          <div
            role="alert"
            className={`rounded-xl px-5 py-3.5 text-sm font-medium transition-all ${
              status === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : status === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
            }`}
            aria-live="polite"
          >
            {status === 'success' && (
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Message sent! We&apos;ll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-start gap-2">
                <svg className="h-5 w-5 shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errorMsg}
              </div>
            )}
            {status === 'loading' && (
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending your message…
              </div>
            )}
          </div>
        )}
        <button
          type="submit"
          className="btn-premium group inline-flex items-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending…
            </>
          ) : (
            <>
              Send message
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <p className="text-sm text-warmgray hover:text-gold-400 transition-colors">
        <a href="tel:559-991-2190">{subtitle}</a>
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="relative">
          <input
            type="text"
            name="name"
            required
            placeholder="Name *"
            className={fieldErrors.name ? inputErrorClass : inputNormalClass}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
        </div>
        <div className="relative">
          <input
            type="email"
            name="email"
            required
            placeholder="Email *"
            className={fieldErrors.email ? inputErrorClass : inputNormalClass}
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="relative">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className={fieldErrors.phone ? inputErrorClass : inputNormalClass}
          />
          {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
        </div>
        <input
          type="text"
          name="address"
          placeholder="Property address"
          className={inputNormalClass}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <input type="text" name="city" placeholder="City" className={inputNormalClass} />
        <input type="text" name="state" placeholder="State" className={inputNormalClass} />
        <input type="text" name="zip" placeholder="Zip" className={inputNormalClass} />
      </div>
      <label className={`flex items-start gap-3 cursor-pointer transition-colors ${
        fieldErrors.agree ? 'text-red-600' : 'text-warmgray hover:text-black'
      }`}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            setFieldErrors((prev) => ({ ...prev, agree: '' }));
            setErrorMsg('');
          }}
          className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300 text-gold-400 focus:ring-gold-400 focus:ring-2 transition-all"
        />
        <span className="text-[14px] leading-snug">
          I agree to receive communications from Next Level Home Solutions
        </span>
      </label>
      {status !== 'idle' && (
        <div
          role="alert"
          className={`rounded-xl px-5 py-3.5 text-sm font-medium transition-all ${
            status === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : status === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-gray-50 text-gray-600 border border-gray-200'
          }`}
          aria-live="polite"
        >
          {status === 'success' && (
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Thanks! We&apos;ll be in touch soon.
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-start gap-2">
              <svg className="h-5 w-5 shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errorMsg}
            </div>
          )}
          {status === 'loading' && (
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting your request…
            </div>
          )}
        </div>
      )}
      <button
        type="submit"
        className="btn-premium group inline-flex items-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending…
          </>
        ) : (
          <>
            Get my offer
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
