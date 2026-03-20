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
  { code: 'CA' as const, label: 'California' },
  { code: 'NV' as const, label: 'Nevada' },
  { code: 'AZ' as const, label: 'Arizona' },
];

export default function WelcomePage() {
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsState, setGpsState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const gpsRequested = useRef(false);
  
  const { data: geo, loading: geoLoading } = useDetectArea(gpsCoords?.lat, gpsCoords?.lng);
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);
  const [locationTab, setLocationTab] = useState<'CA' | 'NV' | 'AZ'>('CA');
  const [citySearch, setCitySearch] = useState('');
  const geoCityApplied = useRef(false);

  useEffect(() => {
    if (gpsRequested.current) return;
    gpsRequested.current = true;
    setGpsState('requesting');
    void requestBrowserLocation(12000).then((result) => {
      if (result.status === 'granted') {
        setGpsCoords({ lat: result.lat, lng: result.lng });
        setGpsState('granted');
      } else {
        setGpsState('denied');
      }
    });
  }, []);

  const statesWithCities = useMemo(
    () => STATE_TABS.filter((s) => SEO_CITIES.some((c) => c.state === s.code)),
    []
  );

  useEffect(() => {
    if (geoCityApplied.current) return;
    if (geo && 'matched' in geo && geo.matched) {
      setSelectedCitySlug(geo.city.slug);
      const st = geo.city.state;
      if (st === 'CA' || st === 'NV' || st === 'AZ') setLocationTab(st);
      geoCityApplied.current = true;
    }
  }, [geo]);

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

  const savePrefs = () => {
    if (selectedSituation) {
      try {
        localStorage.setItem(PREFERRED_SITUATION_KEY, selectedSituation);
      } catch {
        /* ignore */
      }
    }
    if (selectedCitySlug) {
      try {
        localStorage.setItem(PREFERRED_CITY_KEY, selectedCitySlug);
      } catch {
        /* ignore */
      }
    }
  };

  const goToHelpPage = () => {
    if (!selectedSituation || !selectedCitySlug) return;
    savePrefs();
    setHomeEntryCookieClient();
    window.location.assign(`/sell/${selectedSituation}/${selectedCitySlug}`);
  };

  const goHome = () => {
    savePrefs();
    setHomeEntryCookieClient();
    window.location.assign('/');
  };

  const canGetHelp = Boolean(selectedSituation && selectedCitySlug);
  const selectedCity = selectedCitySlug ? SEO_CITIES.find((c) => c.slug === selectedCitySlug) : null;

  return (
    <section className="relative min-h-[calc(100dvh-5rem)] overflow-hidden py-12 md:py-16">
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
      <div className="relative z-10 mx-auto max-w-5xl px-5">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a86c]">
          Next Level Home Solutions
        </p>
        <h1 className="mt-4 text-center font-display text-3xl leading-tight text-white md:text-4xl">
          Get help for your situation
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-white/80">
          <strong className="text-white/95">Step 1:</strong> What you&apos;re dealing with.{' '}
          <strong className="text-white/95">Step 2:</strong> Where the property is (or the closest city we serve).
          Then we&apos;ll open a page written for <em>that</em> problem in <em>that</em> area.
        </p>

        <div className="mx-auto mt-8 max-w-2xl rounded-xl border-2 border-[#8b7355]/50 bg-[#1e2d3d]/95 px-4 py-3 text-center text-sm text-[#f0ebe4] shadow-lg">
          {gpsState === 'requesting' && (
            <span className="text-[#c9a86c]/90">
              Asking for your location (browser prompt)—we find the nearest city we serve…
            </span>
          )}
          {geoLoading && gpsState === 'granted' && (
            <span className="text-[#c9a86c]/90">Got your location—finding nearest city we serve…</span>
          )}
          {!geoLoading && geo && 'matched' in geo && geo.matched && (
            <>
              <span className="font-semibold text-[#c9a86c]">
                {geo.approximate && geo.detectedCityName
                  ? `Near ${geo.detectedCityName}, ${geo.city.state}`
                  : `${geo.city.name}, ${geo.city.state}`}
              </span>
              <span> — we&apos;ve pre-selected {geo.city.name} below; change it if needed.</span>
            </>
          )}
          {!geoLoading && geo && (!('matched' in geo) || !geo.matched) && (
            <span className="text-[#d4cfc4]">
              {gpsState === 'denied'
                ? "Location access denied—pick your city manually below."
                : "We couldn't place your area automatically—pick your city manually below."}
            </span>
          )}
        </div>

        {/* Step 1: situation */}
        <h2 className="mt-12 text-center font-display text-xl font-semibold text-white md:text-2xl">
          1. What situation are you in?
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {SELLER_SITUATIONS.map((s) => {
            const popularHere =
              geo && 'matched' in geo && geo.matched && geo.popularSituations.some((p) => p.slug === s.slug);
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => setSelectedSituation(s.slug)}
                className={`rounded-xl border-2 p-4 text-left shadow-md transition duration-200 ${
                  selectedSituation === s.slug
                    ? 'border-[#c9a86c] bg-[#3d3228] shadow-[0_0_20px_rgba(201,168,108,0.15)] ring-2 ring-[#c9a86c]/25'
                    : 'border-[#6b5344] bg-[#2a2520] hover:border-[#c9a86c]/70 hover:bg-[#332920]'
                }`}
              >
                <span className="font-display text-lg font-semibold text-white">{s.title}</span>
                {popularHere && (
                  <span className="ml-2 inline-block rounded bg-[#c9a86c]/25 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#f5e6c8]">
                    Common near you
                  </span>
                )}
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#d4cfc4] sm:line-clamp-2">
                  {s.painSummary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Step 2: location — tabs + grid + search */}
        {selectedSituation && (
          <div className="mt-14 scroll-mt-24">
            <h2 className="text-center font-display text-xl font-semibold text-white md:text-2xl">
              2. Where&apos;s the property?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-[#d4cfc4]">
              Pick a state, then the city closest to you. Use search if the list is long.
            </p>

            <div className="mt-8 rounded-2xl border-2 border-[#8b7355]/45 bg-[#1a222c]/95 p-4 shadow-xl sm:p-6">
              <div
                role="tablist"
                aria-label="Choose state"
                className="flex flex-wrap justify-center gap-2 border-b border-[#6b5344]/50 pb-4 sm:justify-start"
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
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
                        active
                          ? 'bg-[#c9a86c] text-[#1e2d3d] shadow-md'
                          : 'border-2 border-[#6b5344] bg-[#2a2520] text-[#f0ebe4] hover:border-[#c9a86c]/60'
                      }`}
                    >
                      {label}
                      <span className={`ml-1.5 text-xs font-normal opacity-80 ${active ? 'text-[#1e2d3d]/80' : ''}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>

              <label className="mt-5 block">
                <span className="sr-only">Search cities</span>
                <input
                  type="search"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder={`Search ${STATE_TABS.find((s) => s.code === locationTab)?.label ?? ''} cities…`}
                  className="w-full rounded-xl border-2 border-[#6b5344] bg-[#2a2520] px-4 py-3 text-sm text-[#f0ebe4] placeholder:text-[#9a9088] focus:border-[#c9a86c] focus:outline-none focus:ring-2 focus:ring-[#c9a86c]/30"
                />
              </label>

              {selectedCity && (
                <p className="mt-4 rounded-lg bg-[#c9a86c]/15 px-3 py-2 text-center text-sm text-[#f5e6c8] sm:text-left">
                  <span className="text-[#c9a86c]">Selected:</span>{' '}
                  <strong>{selectedCity.name}</strong>, {selectedCity.state} · {selectedCity.county} County
                </p>
              )}

              <div className="mt-4 max-h-[min(52vh,420px)] overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]">
                {filteredCities.length === 0 ? (
                  <p className="py-8 text-center text-sm text-[#9a9088]">No cities match &quot;{citySearch}&quot;.</p>
                ) : (
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCities.map((c) => {
                      const selected = selectedCitySlug === c.slug;
                      return (
                        <li key={c.slug}>
                          <button
                            type="button"
                            onClick={() => setSelectedCitySlug(c.slug)}
                            className={`flex w-full min-h-[52px] flex-col items-start justify-center rounded-xl border-2 px-4 py-3 text-left transition ${
                              selected
                                ? 'border-[#c9a86c] bg-[#3d3228] shadow-[0_0_12px_rgba(201,168,108,0.12)]'
                                : 'border-[#6b5344] bg-[#2a2520] hover:border-[#c9a86c]/70 hover:bg-[#332920]'
                            }`}
                          >
                            <span className={`font-display text-base font-semibold ${selected ? 'text-[#f5e6c8]' : 'text-white'}`}>
                              {c.name}
                            </span>
                            <span className="mt-0.5 text-xs text-[#b8b0a6]">{c.county} County</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-10 sm:flex-row sm:flex-wrap sm:justify-center">
          <button
            type="button"
            disabled={!canGetHelp}
            onClick={goToHelpPage}
            className="w-full min-h-[52px] rounded-xl bg-[#c9a86c] px-8 py-3 text-center text-sm font-semibold uppercase tracking-wider text-[#1e2d3d] transition enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[280px]"
          >
            {canGetHelp && selectedCity
              ? `Get help — ${SELLER_SITUATIONS.find((s) => s.slug === selectedSituation)?.shortLabel ?? 'Help'} in ${selectedCity.name}`
              : 'Get help — open my page'}
          </button>
          <button
            type="button"
            onClick={goHome}
            className="w-full min-h-[48px] rounded-xl border-2 border-[#8b7355] bg-[#2a2520] px-6 py-3 text-center text-sm font-semibold text-[#f0ebe4] transition hover:border-[#c9a86c] hover:bg-[#332920] sm:w-auto"
          >
            Continue to homepage only
          </button>
        </div>

        {!canGetHelp && selectedSituation && !selectedCitySlug && (
          <p className="mt-4 text-center text-xs text-amber-200/80">Select a city above to open your help page.</p>
        )}

        <p className="mt-10 text-center text-xs text-white/45">
          <button
            type="button"
            onClick={() => {
              setHomeEntryCookieClient();
              window.location.assign('/');
            }}
            className="underline-offset-2 hover:text-white/70 hover:underline"
          >
            Skip and go to homepage
          </button>
          <span className="mx-2">·</span>
          <Link href="/areas" className="underline-offset-2 hover:text-white/70 hover:underline">
            Full areas picker
          </Link>
          <span className="mx-2">·</span>
          <a href={business.phoneTel} className="underline-offset-2 hover:text-white/70 hover:underline">
            Call {business.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
