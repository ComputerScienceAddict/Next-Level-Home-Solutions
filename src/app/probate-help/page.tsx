import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

const benefits = [
  { title: 'No out-of-pocket probate costs', desc: 'We handle probate and cover the costs for you.' },
  { title: 'Probate the company', desc: 'We guide you through probate or handle it on your behalf.' },
  { title: 'Clear guidance', desc: 'Inherited a property? We help you understand your options.' },
  { title: 'Sell or stay', desc: 'Whether you want to sell or keep the property, we can help.' },
];

export const metadata = {
  title: 'Probate Help | Next Level Home Solutions',
  description:
    'Need probate help? We help homeowners in probate—handle probate for you, pay probate costs, and guide you through. No out-of-pocket expense. Call 559-991-2190.',
};

export default function ProbateHelpPage() {
  return (
    <>
      {/* Bulletin-board style background */}
      <section className="relative min-h-[40vh] bg-[#2a2520] py-20">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139,115,85,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative mx-auto max-w-5xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7355]">Inherited property?</p>
          <h1 className="mt-2 font-display text-4xl text-white md:text-5xl">
            Probate Help — We&apos;ve Got You Covered
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">
            Inheriting a home can be stressful. We help homeowners in probate navigate the process—and we can handle probate for you and pay the probate costs so you don&apos;t have to spend a dime.
          </p>
        </div>
      </section>

      {/* Pinned-card style content */}
      <section className="py-16 -mt-8">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Intro card */}
            <div
              className="relative rounded-lg border-2 border-[#8b7355]/30 bg-[#faf9f7] p-6 shadow-[4px_4px_0_rgba(30,45,61,0.08)]"
              style={{ transform: 'rotate(-0.5deg)' }}
            >
              <div className="absolute -top-2 left-6 h-3 w-8 rounded bg-[#8b7355]/40" />
              <h2 className="font-display text-xl font-semibold text-[#1e2d3d]">How it works</h2>
              <p className="mt-3 text-sm leading-relaxed text-warmgray">
                You inherit a property. Probate looms—and so do the costs. We step in: we can probate the company, handle the process, and pay probate for you. You get clarity and support without draining your savings.
              </p>
            </div>

            {/* Who it's for */}
            <div
              className="relative rounded-lg border-2 border-[#8b7355]/30 bg-[#faf9f7] p-6 shadow-[4px_4px_0_rgba(30,45,61,0.08)]"
              style={{ transform: 'rotate(0.5deg)' }}
            >
              <div className="absolute -top-2 right-6 h-3 w-8 rounded bg-[#8b7355]/40" />
              <h2 className="font-display text-xl font-semibold text-[#1e2d3d]">Who it&apos;s for</h2>
              <p className="mt-3 text-sm leading-relaxed text-warmgray">
                Executors, heirs, and beneficiaries who inherited a home and don&apos;t want to spend on probate or deal with the complexity alone. We take the burden off your plate.
              </p>
            </div>
          </div>

          {/* Benefits grid - bulletin cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="relative rounded-lg border-2 border-black/[0.08] bg-white p-6 shadow-[3px_3px_0_rgba(0,0,0,0.04)]"
                style={{ transform: i % 2 === 0 ? 'rotate(-0.3deg)' : 'rotate(0.3deg)' }}
              >
                <div className="absolute -top-1.5 left-8 h-2 w-6 rounded bg-[#8b7355]/30" />
                <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-warmgray">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="border-t border-black/10 bg-[#f8f7f5] py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl text-black">Let&apos;s talk</h2>
              <p className="mt-4 text-warmgray">
                Tell us about your situation. We&apos;ll explain your options and how we can help—including handling probate and covering the costs.
              </p>
              <p className="mt-6">
                <a href="tel:559-991-2190" className="font-semibold text-[#8b7355] hover:underline">
                  559-991-2190
                </a>
                <span className="text-warmgray"> — Call or text</span>
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#8b7355]/20 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1e2d3d] via-[#8b7355] to-[#1e2d3d]" />
              <h3 className="font-display text-xl text-black">Send a message</h3>
              <div className="mt-6">
                <ContactForm variant="message" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
