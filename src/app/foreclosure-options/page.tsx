import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'What Are My Options? | Foreclosure Help | Next Level Home Solutions',
  description:
    'Facing foreclosure? Learn all your options: reinstatement, loan modification, forbearance, Chapter 13, short sale, and cash sale. We help with every path. Call 559-991-2190.',
  openGraph: {
    title: 'What Are My Foreclosure Options?',
    description: 'Reinstatement, loan modification, Chapter 13, cash sale — know every option before you decide.',
  },
};

const options = [
  {
    number: '1',
    title: 'Reinstatement',
    description:
      'Pay the total amount you owe in back payments, late fees, and penalties in one lump sum to bring your mortgage current. This stops the foreclosure process immediately.',
    who: 'Homeowners who have the funds available (savings, family help, or a windfall) and want to keep their home.',
    timeframe: 'Must be done before a certain deadline set by your lender — usually before the sale date.',
  },
  {
    number: '2',
    title: 'Loan Modification',
    description:
      'Work with your lender to permanently change the terms of your mortgage — lower interest rate, extended repayment period, or reduced principal — so the monthly payment becomes affordable.',
    who: 'Homeowners who can afford a lower payment but fell behind due to a temporary hardship (job loss, medical bills, etc.).',
    timeframe: 'The application and approval process can take 30 to 90 days. You must show proof of income and hardship.',
  },
  {
    number: '3',
    title: 'Forbearance Agreement',
    description:
      'Your lender temporarily pauses or reduces your payments for a set period. After the forbearance ends, you repay the missed amount through a repayment plan or modification.',
    who: 'Homeowners going through a short-term hardship (medical emergency, temporary job loss) who expect their income to recover.',
    timeframe: 'Typically 3 to 12 months of reduced or paused payments.',
  },
  {
    number: '4',
    title: 'Chapter 13 Bankruptcy',
    description:
      'Filing Chapter 13 creates an automatic stay that halts the foreclosure. You then set up a 3-to-5-year repayment plan to catch up on missed payments while keeping your home.',
    who: 'Homeowners with steady income who need time to catch up but can\'t pay everything at once.',
    timeframe: 'The automatic stay takes effect immediately upon filing. The repayment plan lasts 3 to 5 years.',
  },
  {
    number: '5',
    title: 'Short Sale',
    description:
      'Sell your home for less than what you owe on the mortgage, with your lender\'s approval. The lender agrees to accept the lower amount and forgive the remaining balance.',
    who: 'Homeowners who owe more than the home is worth and cannot afford to keep it.',
    timeframe: 'Can take 2 to 6 months due to lender approval requirements.',
  },
  {
    number: '6',
    title: 'Cash Sale (Sell As-Is)',
    description:
      'Sell your home directly to a cash buyer like us. No repairs, no commissions, no waiting for bank approvals. You receive a fair cash offer, choose your closing date, and move forward — often in as little as 7 to 14 days.',
    who: 'Homeowners who need to act fast, want certainty, or simply want to move on without the stress of repairs, showings, or long timelines.',
    timeframe: 'We can close in as little as 7 days. You pick the date.',
    highlight: true,
  },
];

export default function ForeclosureOptionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#2a2520] py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a86c]">Foreclosure help</p>
          <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl md:text-5xl">
            What Are My Options?
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Facing foreclosure? Don&apos;t panic. You have more options than you might think.
            Every situation is different &mdash; the right path depends on your finances, your timeline,
            and what you want for your future. Here are the most common options available to you.
          </p>
        </div>
      </section>

      {/* Options list */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <div className="space-y-6">
            {options.map((opt) => (
              <div
                key={opt.number}
                className={`rounded-2xl border p-6 shadow-sm sm:p-8 ${
                  opt.highlight
                    ? 'border-[#c9a86c]/40 bg-gradient-to-br from-[#faf9f7] to-[#f5f0e8] ring-2 ring-[#c9a86c]/20'
                    : 'border-black/[0.08] bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold ${
                      opt.highlight
                        ? 'bg-[#c9a86c] text-[#1e2d3d]'
                        : 'bg-[#1e2d3d] text-white'
                    }`}
                  >
                    {opt.number}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-semibold text-[#1e2d3d] sm:text-2xl">
                      {opt.title}
                      {opt.highlight && (
                        <span className="ml-2 inline-block rounded-md bg-[#c9a86c]/20 px-2.5 py-0.5 align-middle text-xs font-bold uppercase tracking-wide text-[#8b7355]">
                          Most common
                        </span>
                      )}
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-warmgray">{opt.description}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-black/[0.03] p-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#8b7355]">Who it&apos;s for</p>
                        <p className="mt-1 text-sm text-warmgray">{opt.who}</p>
                      </div>
                      <div className="rounded-lg bg-black/[0.03] p-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#8b7355]">Timeframe</p>
                        <p className="mt-1 text-sm text-warmgray">{opt.timeframe}</p>
                      </div>
                    </div>
                    {opt.highlight && (
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <a
                          href="tel:559-991-2190"
                          className="touch-manipulation inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#c9a86c] px-6 py-3 text-sm font-bold text-[#1e2d3d] shadow-lg transition hover:bg-[#dfc08a] active:scale-[0.99]"
                        >
                          Call 559-991-2190
                        </a>
                        <Link
                          href="/get-offer"
                          className="touch-manipulation inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#8b7355] px-6 py-3 text-sm font-semibold text-[#8b7355] transition hover:bg-[#8b7355]/5 active:scale-[0.99]"
                        >
                          Get a cash offer online →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom explainer */}
      <section className="border-t border-black/10 bg-gradient-to-b from-[#1a1612] to-[#1e2d3d] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-2xl text-white sm:text-3xl">
                Not sure which option is right?
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/80 sm:text-base">
                Every situation is unique. The specific solutions available depend on your
                loan details, how far behind you are, and your current finances. We help homeowners
                explore every option &mdash; not just cash sales.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-white/80 sm:text-base">
                But most of the time, when homeowners come to us, a <strong className="text-white">cash sale</strong> is
                the fastest, simplest way to stop foreclosure and move forward. No repairs, no commissions,
                no waiting. We close on your timeline.
              </p>
              <p className="mt-6">
                <a href="tel:559-991-2190" className="text-lg font-semibold text-[#c9a86c] hover:underline">
                  559-991-2190
                </a>
                <span className="text-white/60"> &mdash; Call or text anytime. Free, confidential conversation.</span>
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-sm sm:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1e2d3d] via-[#c9a86c] to-[#1e2d3d]" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a86c]">Free, no obligation</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-white">Get your cash offer</h3>
              <p className="mt-2 text-sm text-white/70">Same day response. No fees. No pressure.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
