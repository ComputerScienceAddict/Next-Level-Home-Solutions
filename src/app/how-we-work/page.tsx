import ContactForm from '@/components/ContactForm';

const benefits = [
  { title: 'No showings', desc: 'Nobody walking through your home.' },
  { title: 'Your timeline', desc: 'Close in 30 days, faster, or later—your call.' },
  { title: 'Less paperwork', desc: 'AS-IS offer, fewer contingencies.' },
  { title: '100% cash', desc: 'No appraisals or financing delays.' },
  { title: 'No agent fees', desc: 'No commissions. What we offer is what you get.' },
  { title: 'No repairs', desc: 'We buy as-is. Leave it how it is.' },
];

export const metadata = {
  title: 'How We Work | Next Level Home Solutions',
  description:
    'Learn how Next Level Home Solutions makes selling your home simple. Cash offers, sell as-is, close in as little as 7 days. No commissions, no showings. Call 559-991-2190.',
  openGraph: {
    title: 'How We Work | Next Level Home Solutions',
    description: 'Simple 3-step process: Submit details, get a cash offer same day, close on your timeline. No commissions, no repairs needed.',
  },
};

export default function HowWeWorkPage() {
  return (
    <>
      <section className="border-b border-black/10 py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h1 className="font-display text-4xl text-black">How we work</h1>
          <p className="mt-4 text-warmgray">
            Submit details. Get an offer. Close when you want.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl text-black">The process</h2>
              <ol className="mt-6 space-y-4 text-warmgray">
                <li><span className="font-medium text-black">1.</span> You send us your property address and a few details.</li>
                <li><span className="font-medium text-black">2.</span> We evaluate and send you an AS-IS cash offer the same day.</li>
                <li><span className="font-medium text-black">3.</span> You accept. We close on your timeline—typically 30 days.</li>
              </ol>
            </div>
            <div>
              <h2 className="font-display text-2xl text-black">Why sell to us</h2>
              <ul className="mt-6 space-y-4">
                {benefits.map((b, i) => (
                  <li key={i}>
                    <span className="font-medium text-black">{b.title}</span> — {b.desc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 py-16">
        <div className="mx-auto max-w-xl px-5">
          <h2 className="font-display text-2xl text-black">Get your offer</h2>
          <div className="mt-6">
            <ContactForm subtitle="Same day, no obligation. Or call/text 559-991-2190." />
          </div>
        </div>
      </section>
    </>
  );
}
