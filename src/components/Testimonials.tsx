'use client';

import { Marquee } from '@/components/Marquee';

const testimonials = [
  { quote: "I don't know where to start when it came to selling my home. With falling behind on property taxes and my home needing some work, I came across Eric. He gave me the best cash offer for my home and he is very quick and very professional to work with. We closed in 2 weeks and everything went smoothly. I would highly recommend him!", author: 'Brandy' },
  { quote: 'I had a great experience with smooth communication throughout the process. It was quick, easy, and hassle-free. I highly recommend it.', author: 'Ignacio N. Zaragoza' },
  { quote: "Working with Next Level Home Solutions was an absolute game-changer! I needed to sell quickly due to a job relocation. They offered me a fair cash price, no repairs or hidden fees. Closed in a few weeks. Highly recommend!", author: 'Sarah T.' },
  { quote: "Next Level Home Solutions came through during a tough time. I had a vacant property and wanted to sell fast. Fair cash price, no hidden fees, no lengthy paperwork. Didn't have to make any repairs. The real deal!", author: 'Mark L.' },
  { quote: "Their team made everything easy. Patient, answered all my questions, gave me a great cash offer. Closing was fast. Trustworthy, no-stress way to sell.", author: 'Jessica R.' },
];

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  const initials = author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <figure className="relative h-full w-64 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-gray-950/[.1] bg-gray-950/[.01] p-4 transition hover:bg-gray-950/[.05]">
      <div className="flex flex-row items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2d3d] text-xs font-semibold text-white">
          {initials}
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-black">{author}</figcaption>
          <p className="text-xs font-medium text-gray-500">Happy homeowner</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm leading-relaxed text-gray-700">
        &ldquo;{quote}&rdquo;
      </blockquote>
    </figure>
  );
}

export default function Testimonials() {
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <section className="border-t border-black/10 py-16">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="font-display text-2xl text-black">What people say</h2>
      </div>
      <div className="relative mt-10 flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:25s]">
          {firstRow.map((t, i) => (
            <TestimonialCard key={i} quote={t.quote} author={t.author} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:25s]">
          {secondRow.map((t, i) => (
            <TestimonialCard key={i} quote={t.quote} author={t.author} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
