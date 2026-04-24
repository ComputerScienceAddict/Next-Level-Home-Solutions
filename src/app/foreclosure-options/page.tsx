import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

function OptionHelpActions({ interestSlug, cashOfferWording }: { interestSlug: string; cashOfferWording?: boolean }) {
  const href = `/get-offer?interest=${encodeURIComponent(interestSlug)}`;
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
      <a
        href="tel:559-991-2190"
        className="btn-gold touch-manipulation min-h-[50px]"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        Call 559-991-2190
      </a>
      <Link
        href={href}
        className="touch-manipulation inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border-2 border-gold-400/50 bg-white/5 px-6 py-3 text-sm font-semibold text-navy-600 backdrop-blur-sm transition-all duration-300 hover:border-gold-400 hover:bg-gold-400/10 active:scale-[0.99]"
      >
        {cashOfferWording ? 'Get a cash offer online' : 'Get help with this option'}
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </div>
  );
}

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
    interestSlug: 'reinstatement',
    title: 'Reinstatement',
    description:
      'Pay the total amount you owe in back payments, late fees, and penalties in one lump sum to bring your mortgage current. This stops the foreclosure process immediately.',
    who: 'Homeowners who have the funds available (savings, family help, or a windfall) and want to keep their home.',
    timeframe: 'Must be done before a certain deadline set by your lender — usually before the sale date.',
  },
  {
    number: '2',
    interestSlug: 'loan-modification',
    title: 'Loan Modification',
    description:
      'Work with your lender to permanently change the terms of your mortgage — lower interest rate, extended repayment period, or reduced principal — so the monthly payment becomes affordable.',
    who: 'Homeowners who can afford a lower payment but fell behind due to a temporary hardship (job loss, medical bills, etc.).',
    timeframe: 'The application and approval process can take 30 to 90 days. You must show proof of income and hardship.',
  },
  {
    number: '3',
    interestSlug: 'forbearance',
    title: 'Forbearance Agreement',
    description:
      'Your lender temporarily pauses or reduces your payments for a set period. After the forbearance ends, you repay the missed amount through a repayment plan or modification.',
    who: 'Homeowners going through a short-term hardship (medical emergency, temporary job loss) who expect their income to recover.',
    timeframe: 'Typically 3 to 12 months of reduced or paused payments.',
  },
  {
    number: '4',
    interestSlug: 'chapter-13-bankruptcy',
    title: 'Chapter 13 Bankruptcy',
    description:
      'Filing Chapter 13 creates an automatic stay that halts the foreclosure. You then set up a 3-to-5-year repayment plan to catch up on missed payments while keeping your home.',
    who: 'Homeowners with steady income who need time to catch up but can\'t pay everything at once.',
    timeframe: 'The automatic stay takes effect immediately upon filing. The repayment plan lasts 3 to 5 years.',
  },
  {
    number: '5',
    interestSlug: 'short-sale',
    title: 'Short Sale',
    description:
      'Sell your home for less than what you owe on the mortgage, with your lender\'s approval. The lender agrees to accept the lower amount and forgive the remaining balance.',
    who: 'Homeowners who owe more than the home is worth and cannot afford to keep it.',
    timeframe: 'Can take 2 to 6 months due to lender approval requirements.',
  },
  {
    number: '6',
    interestSlug: 'cash-sale',
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
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-700 via-navy-600 to-navy-700 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-300/10 via-transparent to-transparent opacity-50" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm ring-1 ring-white/20 animate-fade-in">
            <svg className="h-4 w-4 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-300">Foreclosure help</span>
          </div>
          <h1 className="mt-5 font-display text-[2.25rem] leading-tight text-white sm:text-5xl md:text-6xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            What Are My Options?
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Facing foreclosure? Don&apos;t panic. You have more options than you might think.
            Every situation is different &mdash; the right path depends on your finances, your timeline,
            and what you want for your future. Here are the most common options available to you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <a
              href="tel:559-991-2190"
              className="btn-gold"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call 559-991-2190
            </a>
            <Link
              href="/get-offer"
              className="touch-manipulation inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 active:scale-[0.99]"
            >
              Get Cash Offer
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Options list */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="space-y-8">
            {options.map((opt, index) => (
              <div
                key={opt.number}
                id={opt.interestSlug}
                className={`scroll-mt-24 group animate-fade-in-up ${
                  opt.highlight
                    ? 'card-premium relative overflow-hidden p-7 shadow-premium-lg ring-2 ring-gold-300/20 sm:p-9'
                    : 'card-premium p-7 sm:p-9'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {opt.highlight && (
                  <div className="absolute inset-0 bg-shimmer opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundSize: '1000px 100%' }} />
                )}
                <div className="relative flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-2xl font-bold shadow-md transition-transform group-hover:scale-110 sm:h-16 sm:w-16 sm:text-3xl" style={{
                    background: opt.highlight 
                      ? 'linear-gradient(135deg, #c9a86c 0%, #dfc08a 100%)' 
                      : 'linear-gradient(135deg, #1e2d3d 0%, #2a3d52 100%)',
                    color: opt.highlight ? '#1e2d3d' : '#fff'
                  }}>
                    {opt.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-2xl font-semibold text-navy-600 sm:text-3xl">
                        {opt.title}
                      </h2>
                      {opt.highlight && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-300/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-600 ring-1 ring-gold-300/30">
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Most common
                        </span>
                      )}
                    </div>
                    <p className="mt-4 text-[15.5px] leading-relaxed text-gray-700">{opt.description}</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-navy-600/5 to-navy-600/10 p-4 ring-1 ring-navy-600/10">
                        <svg className="h-5 w-5 shrink-0 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wider text-gold-600">Who it&apos;s for</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{opt.who}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-navy-600/5 to-navy-600/10 p-4 ring-1 ring-navy-600/10">
                        <svg className="h-5 w-5 shrink-0 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wider text-gold-600">Timeframe</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{opt.timeframe}</p>
                        </div>
                      </div>
                    </div>
                    <OptionHelpActions interestSlug={opt.interestSlug} cashOfferWording={!!opt.highlight} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom explainer */}
      <section className="section-divider border-t-2 bg-gradient-to-b from-white/95 to-offwhite/95 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="animate-fade-in-up">
              <h2 className="font-display text-3xl text-navy-600 sm:text-4xl">
                Not sure which option is right?
              </h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-gray-700 sm:text-base">
                Every situation is unique. The specific solutions available depend on your
                loan details, how far behind you are, and your current finances. We help homeowners
                explore every option &mdash; not just cash sales.
              </p>
              <p className="mt-4 text-[15.5px] leading-relaxed text-gray-700 sm:text-base">
                But most of the time, when homeowners come to us, a <strong className="font-semibold text-navy-600">cash sale</strong> is
                the fastest, simplest way to stop foreclosure and move forward. No repairs, no commissions,
                no waiting. We close on your timeline.
              </p>
              <div className="mt-8 flex items-start gap-4 rounded-xl bg-gold-300/10 p-5 ring-1 ring-gold-300/20">
                <svg className="h-6 w-6 shrink-0 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <p className="text-lg font-semibold text-navy-600">
                    <a href="tel:559-991-2190" className="hover:text-gold-400 transition-colors">559-991-2190</a>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Call or text anytime. Free, confidential conversation.</p>
                </div>
              </div>
            </div>
            <div className="card-premium group relative overflow-hidden p-7 shadow-premium-lg sm:p-9 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-premium" />
              <div className="absolute inset-0 bg-shimmer opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundSize: '1000px 100%' }} />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/10 px-3 py-1.5 ring-1 ring-gold-400/20">
                  <svg className="h-4 w-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Free, no obligation</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-navy-600">Get your cash offer</h3>
                <p className="mt-2 text-sm text-gray-600">Same day response. No fees. No pressure. Just a fair offer.</p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
