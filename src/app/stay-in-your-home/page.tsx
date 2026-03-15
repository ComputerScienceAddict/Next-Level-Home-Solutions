import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

const options = [
  { title: 'Loan modification', desc: 'Work with your lender to adjust the terms of your loan so you can afford the payments.' },
  { title: 'Forbearance & payment plans', desc: 'Temporary pause or reduced payments while you get back on track.' },
  { title: 'Refinancing', desc: 'Explore refinancing options that may lower your monthly payment or improve your rate.' },
  { title: 'Working with your lender', desc: 'We can help you navigate alternatives directly with your bank or servicer.' },
  { title: 'Avoiding foreclosure', desc: 'Stay in your home while we explore every option to prevent foreclosure.' },
];

export const metadata = {
  title: 'Stay in Your Home | Next Level Home Solutions',
  description:
    'Don\'t want to sell? You have options. Loan modification, forbearance, refinancing, and more. We help homeowners stay in their homes. Call 559-991-2190.',
};

export default function StayInYourHomePage() {
  return (
    <>
      <section className="border-b border-black/10 py-16">
        <div className="mx-auto max-w-5xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7355]">Solutions when selling isn&apos;t right</p>
          <h1 className="mt-2 font-display text-4xl text-black md:text-5xl">
            Don&apos;t Want to Sell? You Have Options.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-warmgray">
            Selling isn&apos;t for everyone. If you want to stay in your home, we can help you explore alternatives—loan modifications, forbearance, refinancing, and more.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-display text-2xl text-black">What we can help with</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {options.map((opt, i) => (
              <div
                key={i}
                className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm"
              >
                <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">{opt.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-warmgray">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 py-16 bg-black/[0.02]">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl text-black">Get in touch</h2>
              <p className="mt-4 text-warmgray">
                Tell us your situation. We&apos;ll walk you through your options and help you decide the best path forward—no pressure, no obligation.
              </p>
              <p className="mt-6">
                <a href="tel:559-991-2190" className="font-semibold text-[#8b7355] hover:underline">
                  559-991-2190
                </a>
                <span className="text-warmgray"> — Call or text anytime</span>
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1e2d3d] via-[#8b7355] to-[#1e2d3d]" />
              <h3 className="font-display text-xl text-black">Send us a message</h3>
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
