'use client';

import { useState, useEffect } from 'react';

const videos = [
  'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1640079063845919%2F&show_text=false&width=267&t=0',
  'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1994224904811554%2F&show_text=false&width=267&t=0',
  'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F901974429055982%2F&show_text=false&width=267&t=0',
  'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2734595150210066%2F&show_text=false&width=267&t=0',
  'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F762057742871126%2F&show_text=false&width=267&t=0',
  'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2037547383751607%2F&show_text=false&width=267&t=0',
  'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1235659425064994%2F&show_text=false&width=358&t=0',
  'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F856210333631506%2F&show_text=false&width=267&t=0',
  'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F643716778707097%2F&show_text=false&width=267&t=0',
  'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F679949101854613%2F&show_text=false&width=267&t=0',
];

function getPerPage() {
  if (typeof window === 'undefined') return 3;
  return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
}

export default function Videos() {
  const [current, setCurrent] = useState(0);
  const [perPage, setPerPage] = useState(3); // SSR-safe default; updated after mount

  useEffect(() => {
    const update = () => setPerPage(getPerPage());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxPage = Math.max(0, Math.ceil(videos.length / perPage) - 1);
  const canPrev = current > 0;
  const canNext = current < maxPage;

  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));
  const goNext = () => setCurrent((c) => Math.min(maxPage, c + 1));

  const visible = videos.slice(current * perPage, current * perPage + perPage);

  return (
    <section className="border-t border-black/10 bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-[#8b7355]">See us in action</p>
        <h2 className="mt-2 font-display text-4xl text-black md:text-5xl">Videos</h2>
        <p className="mt-4 max-w-xl text-warmgray">
          Real stories from real homeowners. Hear how we&apos;ve helped people sell fast.
        </p>

        <div className="relative mt-12 flex items-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canPrev}
            aria-label="Previous videos"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-black/20 bg-white text-black transition hover:border-[#8b7355] hover:bg-[#8b7355] hover:text-white disabled:opacity-30 disabled:hover:border-black/20 disabled:hover:bg-white disabled:hover:text-black"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-1 justify-center gap-6 overflow-hidden">
            {visible.map((src, i) => (
              <div
                key={current * perPage + i}
                className="aspect-[9/16] w-full max-w-[220px] shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/5"
              >
                <iframe
                  src={src}
                  width="220"
                  height="391"
                  style={{ border: 'none', overflow: 'hidden', width: '100%', height: '100%', objectFit: 'cover' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title={`Customer video ${current * perPage + i + 1}`}
                  className="block h-full w-full"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={!canNext}
            aria-label="Next videos"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-black/20 bg-white text-black transition hover:border-[#8b7355] hover:bg-[#8b7355] hover:text-white disabled:opacity-30 disabled:hover:border-black/20 disabled:hover:bg-white disabled:hover:text-black"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: maxPage + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-2 rounded-full transition ${
                i === current ? 'w-8 bg-[#8b7355]' : 'w-2 bg-black/20 hover:bg-black/40'
              }`}
            />
          ))}
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          {current + 1} of {maxPage + 1}
        </p>
      </div>
    </section>
  );
}
