'use client';

import { useState } from 'react';

const faqs = [
  { q: 'What fees do you charge?', a: 'None. No commissions, repairs, fees, or closing costs. The offer you accept is what you get.' },
  { q: 'How quickly do you close?', a: "We work on your timeline. Typical is 30 days, but we can do faster or slower—whatever you need." },
  { q: 'When will I get an offer?', a: 'Within 8 hours of your request.' },
  { q: 'Do I have to clean or empty the property?', a: 'No. We buy AS IS. Leave what you don’t want.' },
  { q: 'Why Next Level Home Solutions?', a: "We focus on making the process smooth. Whether it's your first sale or your tenth, we handle the details so you don't have to." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 border-t-2 border-black/10 bg-black/5 py-20">
      <div className="mx-auto max-w-3xl px-5">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-[#8b7355]">Got questions?</p>
        <h2 className="mt-2 font-display text-4xl text-black md:text-5xl">FAQ</h2>
        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-black/[0.02]"
              >
                <span className="font-display text-lg font-semibold text-black">{faq.q}</span>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${open === i ? 'bg-black text-white' : 'bg-black/10 text-black'}`}>
                  {open === i ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
                    </svg>
                  )}
                </span>
              </button>
              {open === i && (
                <div className="border-t border-black/5 px-6 py-4">
                  <p className="font-display text-base leading-relaxed text-gray-600">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
