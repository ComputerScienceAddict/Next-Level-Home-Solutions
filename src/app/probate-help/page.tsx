import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Probate Help | Next Level Home Solutions',
  description:
    'Inherited a property? We handle probate for you, pay probate costs, and guide you through the process. No out-of-pocket expenses. Call 559-991-2190.',
  openGraph: {
    title: 'Probate Help | We Handle Everything',
    description: 'Inherited a home? We handle probate, pay costs, and guide you. No out-of-pocket expenses.',
  },
};

const benefits = [
  { title: 'No out-of-pocket costs', desc: 'We handle probate and cover the costs for you.' },
  { title: 'We guide the process', desc: 'Inherited a property? We help you understand your options and walk you through every step.' },
  { title: 'Sell or keep it', desc: 'Whether you want to sell or keep the property, we can help you decide.' },
];

export default function ProbateHelpPage() {
  return (
    <>
      <section className="bg-[#2a2520] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a86c]">Inherited property?</p>
          <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl md:text-5xl">
            Probate Help &mdash; We&apos;ve Got You Covered
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Inheriting a home can be stressful. We help homeowners in probate navigate the process &mdash;
            and we can handle probate for you and pay the costs so you don&apos;t have to spend a dime.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <div className="grid gap-5 sm:grid-cols-3">
            {benefits.map((b, i) => (
              <div key={i} className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-warmgray">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-black/[0.02] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl text-black">Let&apos;s talk</h2>
              <p className="mt-4 text-warmgray">
                Tell us about your situation. We&apos;ll explain your options and how we can help &mdash;
                including handling probate and covering the costs.
              </p>
              <p className="mt-6">
                <a href="tel:559-991-2190" className="font-semibold text-[#8b7355] hover:underline">
                  559-991-2190
                </a>
                <span className="text-warmgray"> &mdash; Call or text</span>
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
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
