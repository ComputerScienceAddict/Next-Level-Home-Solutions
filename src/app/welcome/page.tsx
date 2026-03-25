'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { business } from '@/config/business';
import { requestBrowserLocation } from '@/lib/browser-geolocation';
import { SITE_HOUSES_BACKGROUND_URL } from '@/config/site-assets';
import { SEO_CITIES, SELLER_SITUATIONS } from '@/data/seo-targets';
import { useDetectArea } from '@/hooks/useDetectArea';
import { setHomeEntryCookieClient } from '@/lib/entry-cookie';
import { PREFERRED_CITY_KEY, PREFERRED_SITUATION_KEY } from '@/lib/user-prefs';

const STATE_TABS = [
  { code: 'AL' as const, label: 'Alabama' },
  { code: 'AZ' as const, label: 'Arizona' },
  { code: 'CA' as const, label: 'California' },
  { code: 'FL' as const, label: 'Florida' },
  { code: 'GA' as const, label: 'Georgia' },
  { code: 'KS' as const, label: 'Kansas' },
  { code: 'LA' as const, label: 'Louisiana' },
  { code: 'NJ' as const, label: 'New Jersey' },
  { code: 'NV' as const, label: 'Nevada' },
  { code: 'NY' as const, label: 'New York' },
  { code: 'OH' as const, label: 'Ohio' },
  { code: 'TX' as const, label: 'Texas' },
  { code: 'VA' as const, label: 'Virginia' },
];

type Step = 'location' | 'situation' | 'city';

/** Raw geo city strings sometimes use + for spaces (e.g. Vercel headers). */
function formatDetectedCityDisplay(raw: string): string {
  return raw.replace(/\+/g, ' ').trim();
}

export default function WelcomePage() {
  const [step, setStep] = useState<Step>('location');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsRequesting, setGpsRequesting] = useState(false);

  const { data: geo, loading: geoLoading } = useDetectArea({
    enabled: true,
    lat: gpsCoords?.lat,
    lng: gpsCoords?.lng,
  });

  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);
  const [locationTab, setLocationTab] = useState<string>('CA');
  const [citySearch, setCitySearch] = useState('');
  const geoCityApplied = useRef(false);

  const servedStates = useMemo(() => STATE_TABS.map((t) => t.code) as string[], []);

  useEffect(() => {
    requestBrowserLocation(15000).then((result) => {
      if (result.status === 'granted') {
        setGpsCoords({ lat: result.lat, lng: result.lng });
      }
    });
  }, []);

  useEffect(() => {
    if (geoCityApplied.current) return;
    if (geo && 'matched' in geo && geo.matched) {
      // Guide URL uses our SEO city (exact match or state hub). Copy still shows their detected city when approximate.
      setSelectedCitySlug(geo.city.slug);
      const st = geo.city.state;
      if (servedStates.includes(st)) setLocationTab(st);
      geoCityApplied.current = true;
    }
  }, [geo, servedStates]);

  const statesWithCities = useMemo(
    () => STATE_TABS.filter((s) => SEO_CITIES.some((c) => c.state === s.code)),
    []
  );

  const citiesInTab = useMemo(
    () => SEO_CITIES.filter((c) => c.state === locationTab),
    [locationTab]
  );

  const filteredCities = useMemo(() => {
    const q = citySearch.trim().toLowerCase();
    if (!q) return citiesInTab;
    return citiesInTab.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.county.toLowerCase().includes(q) ||
        c.zips.some((z) => z.includes(q))
    );
  }, [citiesInTab, citySearch]);

  useEffect(() => {
    setCitySearch('');
  }, [locationTab]);

  const savePrefs = (situation: string, citySlug: string) => {
    try {
      localStorage.setItem(PREFERRED_SITUATION_KEY, situation);
      localStorage.setItem(PREFERRED_CITY_KEY, citySlug);
    } catch {
      /* ignore */
    }
  };

  const goToDedicatedPage = (situation: string, citySlug: string) => {
    savePrefs(situation, citySlug);
    setHomeEntryCookieClient();
    window.location.assign(`/sell/${situation}/${citySlug}`);
  };

  const handlePickSituation = (slug: string) => {
    setSelectedSituation(slug);
    const cityFromGeo =
      geo && 'matched' in geo && geo.matched ? geo.city.slug : null;
    if (cityFromGeo) {
      setSelectedCitySlug(cityFromGeo);
      goToDedicatedPage(slug, cityFromGeo);
      return;
    }
    setStep('city');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePickCity = (citySlug: string) => {
    if (!selectedSituation) return;
    goToDedicatedPage(selectedSituation, citySlug);
  };

  const requestPreciseLocation = () => {
    setGpsRequesting(true);
    requestBrowserLocation(15000).then((result) => {
      setGpsRequesting(false);
      if (result.status === 'granted') {
        setGpsCoords({ lat: result.lat, lng: result.lng });
      }
    });
  };

  const goHome = () => {
    setHomeEntryCookieClient();
    window.location.assign('/');
  };

  const situationTitle = SELLER_SITUATIONS.find((s) => s.slug === selectedSituation)?.title ?? 'your situation';

  const locationReady = !geoLoading && geo !== null;
  const geoMatched = geo && 'matched' in geo && geo.matched;
  const geoStateLabel =
    geoMatched && 'city' in geo
      ? STATE_TABS.find((t) => t.code === geo.city.state)?.label ?? geo.city.state
      : '';

  /** City + state we believe the visitor is in (detected name when approximate; SEO city when exact). */
  const geoYourCityState =
    geoMatched && 'city' in geo
      ? geo.approximate && geo.detectedCityName
        ? `${formatDetectedCityDisplay(geo.detectedCityName)}, ${geo.city.state}`
        : `${geo.city.name}, ${geo.city.state}`
      : '';

  return (
    <section className="relative min-h-[calc(100dvh-4.5rem)] overflow-hidden py-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:min-h-[calc(100dvh-5rem)] sm:py-8 md:py-12">
      <div
        className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-[center_30%]"
        style={{ backgroundImage: `url("${SITE_HOUSES_BACKGROUND_URL}")` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a1612]/93 via-[#2a2520]/90 to-[#1e2d3d]/92"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(201,168,108,0.14) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-lg px-4 sm:px-5 md:max-w-2xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a86c]">
          Next Level Home Solutions
        </p>

        {/* Step 1: location */}
        {step === 'location' && (
          <>
            <h1 className="mt-4 text-center font-display text-[1.375rem] leading-snug text-white sm:mt-5 sm:text-2xl md:text-3xl">
              First, let&apos;s find your area
            </h1>
            <p className="mx-auto mt-3 max-w-md text-center text-[15px] leading-relaxed text-white/85 sm:text-sm md:text-base">
              We use a quick location check so the next step fits where you are. You can use your general area or
              turn on precise location for better accuracy.
            </p>

            <div className="mt-6 rounded-2xl border border-[#c9a86c]/25 bg-[#1a222c]/90 p-5 shadow-xl ring-1 ring-black/20 backdrop-blur-sm sm:mt-8 sm:p-6 md:p-8">
              {!locationReady && (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#c9a86c] border-t-transparent" />
                  <p className="mt-4 text-sm font-medium text-white/90">Looking up your area…</p>
                  <p className="mt-1 text-xs text-white/55">This usually takes a second or two.</p>
                </div>
              )}

              {locationReady && geoMatched && (
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#c9a86c]">Area found</p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {geo.approximate && !geo.detectedCityName
                      ? `Your location: ${geoStateLabel}`
                      : `Your location: ${geoYourCityState}`}
                  </p>
                  <p className="mt-2 text-sm text-white/65">
                    {geo.approximate
                      ? geo.detectedCityName
                        ? 'We’ll open your local guide next — if the area isn’t quite right, you can pick another city from the site.'
                        : 'We have your state but not your town yet — you’ll pick your city right after you choose what you need help with.'
                      : "After you tell us what you need help with, we'll open your personalized page for this area."}
                  </p>
                </div>
              )}

              {locationReady && !geoMatched && (
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-200/80">Area not pinned yet</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    We couldn&apos;t match you to a city automatically. That&apos;s okay — you&apos;ll pick your city
                    in one quick step after you choose what you need help with.
                  </p>
                </div>
              )}

              {locationReady && !gpsCoords && (
                <div className="mt-6 border-t border-white/10 pt-6">
                  <button
                    type="button"
                    onClick={requestPreciseLocation}
                    disabled={gpsRequesting}
                    className="touch-manipulation w-full min-h-[52px] rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 text-[15px] font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
                  >
                    {gpsRequesting ? 'Waiting for browser…' : 'Use precise location (optional)'}
                  </button>
                </div>
              )}

              {locationReady && (
                <button
                  type="button"
                  onClick={() => {
                    setStep('situation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="touch-manipulation mt-6 w-full min-h-[52px] rounded-xl bg-[#c9a86c] py-3.5 text-center text-[15px] font-bold uppercase tracking-wide text-[#1e2d3d] transition hover:bg-[#dfc08a] active:scale-[0.99]"
                >
                  Continue
                </button>
              )}
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={goHome}
                className="text-sm text-white/50 underline-offset-2 transition hover:text-white/80 hover:underline"
              >
                Skip and go to homepage
              </button>
            </div>
          </>
        )}

        {/* Step 2: situation */}
        {step === 'situation' && (
          <>
            <h1 className="mt-4 text-center font-display text-[1.375rem] leading-snug text-white sm:mt-5 sm:text-2xl md:text-3xl">
              What do you need help with?
            </h1>
            <p className="mx-auto mt-3 max-w-md text-center text-[15px] leading-relaxed text-white/85 sm:text-sm md:text-base">
              Choose the option that best describes your situation. We&apos;ll take you to a page built for you.
            </p>
            {geoMatched && !geo.approximate && (
              <p className="mx-auto mt-3 max-w-md text-center text-xs text-[#c9a86c]/90">
                Using your area:{' '}
                <strong className="text-[#f5e6c8]">
                  {geo.city.name}, {geo.city.state}
                </strong>
              </p>
            )}
            {geoMatched && geo.approximate && (
              <p className="mx-auto mt-3 max-w-md text-center text-xs text-[#c9a86c]/90">
                Your location:{' '}
                <strong className="text-[#f5e6c8]">
                  {geo.detectedCityName ? geoYourCityState : geoStateLabel}
                </strong>
                <span className="text-white/65">
                  {geo.detectedCityName
                    ? ' — we’ll open your guide right after this; change city anytime from the site if you need to.'
                    : ' — we couldn’t detect your town; choose your city next.'}
                </span>
              </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2">
              {SELLER_SITUATIONS.map((s) => {
                const popularHere =
                  geo &&
                  'matched' in geo &&
                  geo.matched &&
                  !geo.approximate &&
                  geo.popularSituations.some((p) => p.slug === s.slug);
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => handlePickSituation(s.slug)}
                    className="touch-manipulation min-h-[56px] rounded-2xl border border-[#6b5344]/80 bg-[#2a2520]/90 p-4 text-left shadow-md transition hover:border-[#c9a86c]/60 hover:bg-[#332920] active:scale-[0.99] sm:min-h-0 md:p-5"
                  >
                    <span className="font-display text-base font-semibold text-white md:text-lg">{s.title}</span>
                    {popularHere && (
                      <span className="ml-2 inline-block rounded bg-[#c9a86c]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#f5e6c8]">
                        Common near you
                      </span>
                    )}
                    <p className="mt-1.5 line-clamp-2 text-xs text-[#d4cfc4] md:text-sm">{s.shortLabel}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={() => {
                  setStep('location');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-sm font-medium text-[#c9a86c] underline-offset-2 hover:underline"
              >
                ← Back to location
              </button>
              <button
                type="button"
                onClick={goHome}
                className="text-sm text-white/50 underline-offset-2 transition hover:text-white/80 hover:underline"
              >
                Skip — homepage
              </button>
            </div>
          </>
        )}

        {/* Step 3: city (only if area wasn’t matched) */}
        {step === 'city' && selectedSituation && (
          <>
            <button
              type="button"
              onClick={() => {
                setStep('situation');
                setSelectedSituation(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mb-4 text-sm font-medium text-[#c9a86c] underline-offset-2 hover:underline"
            >
              ← Back
            </button>
            <h1 className="text-center font-display text-2xl leading-tight text-white md:text-3xl">
              Which city is the home in?
            </h1>
            <p className="mx-auto mt-3 max-w-md text-center text-sm text-white/80 md:text-base">
              You selected <span className="font-semibold text-[#c9a86c]">{situationTitle}</span>. Tap your city below
              and we&apos;ll open your guide and set this as your home area on the site.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#c9a86c]/20 bg-[#141c24]/95 shadow-2xl ring-1 ring-black/30">
              <div className="border-b border-white/10 bg-[#1e2d3d]/80 px-3 py-3 sm:px-4">
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[#c9a86c]/90 sm:text-left">
                  State
                </p>
                <div
                  role="tablist"
                  aria-label="Choose state"
                  className="mt-2 flex max-h-[100px] flex-wrap justify-center gap-1.5 overflow-y-auto sm:max-h-none sm:justify-start"
                >
                  {statesWithCities.map(({ code, label }) => {
                    const count = SEO_CITIES.filter((c) => c.state === code).length;
                    const active = locationTab === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setLocationTab(code)}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 sm:text-sm ${
                          active
                            ? 'bg-[#c9a86c] text-[#1e2d3d] shadow-md'
                            : 'border border-[#4a5568] bg-[#2d3748]/80 text-white/90 hover:border-[#c9a86c]/50'
                        }`}
                      >
                        {label}
                        <span className={`ml-0.5 text-[10px] font-normal opacity-80 ${active ? 'text-[#1e2d3d]/75' : ''}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#c9a86c]/80">
                    Search cities
                  </span>
                  <input
                    type="search"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Start typing a city name…"
                    className="w-full rounded-xl border border-[#4a5568] bg-[#1a202c] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#c9a86c] focus:outline-none focus:ring-2 focus:ring-[#c9a86c]/25"
                  />
                </label>

                <ul className="mt-4 grid max-h-[min(50dvh,380px)] grid-cols-1 gap-2 overflow-y-auto overscroll-contain pr-1 sm:max-h-[min(45vh,340px)] sm:grid-cols-2 [-webkit-overflow-scrolling:touch]">
                  {filteredCities.length === 0 ? (
                    <li className="col-span-full py-10 text-center text-sm text-white/45">No cities match that search.</li>
                  ) : (
                    filteredCities.map((c) => (
                      <li key={c.slug}>
                        <button
                          type="button"
                          onClick={() => handlePickCity(c.slug)}
                          className="flex w-full min-h-[52px] flex-col items-start justify-center rounded-xl border border-[#374151] bg-[#252f3d]/90 px-3 py-2.5 text-left transition hover:border-[#c9a86c]/50 hover:bg-[#2d3a4d] active:scale-[0.99]"
                        >
                          <span className="font-display text-sm font-semibold text-white">{c.name}</span>
                          <span className="text-[11px] text-white/45">
                            {c.state} · {c.county}
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <p className="mt-6 text-center">
              <Link href="/areas" className="text-sm text-white/45 underline-offset-2 hover:text-white/75 hover:underline">
                Browse all areas
              </Link>
            </p>
          </>
        )}

        <p className="mt-8 text-center text-xs text-white/40">
          <button
            type="button"
            onClick={() => {
              setHomeEntryCookieClient();
              window.location.assign('/');
            }}
            className="underline-offset-2 hover:text-white/65 hover:underline"
          >
            Skip and go to homepage
          </button>
          <span className="mx-2">·</span>
          <a href={business.phoneTel} className="underline-offset-2 hover:text-white/65 hover:underline">
            Call {business.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
