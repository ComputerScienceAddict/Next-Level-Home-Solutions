'use client';

import { useMemo, useState, useEffect } from 'react';
import { feature } from 'topojson-client';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { SEO_CITIES } from '@/data/seo-targets';
import { normalizeStateCode } from '@/lib/geo-match';

const US_STATES_TOPO =
  'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

interface LeadsMapProps {
  leads: Array<{
    id: string;
    attributes: {
      _id: number;
      city?: string;
      state?: string;
      county?: string;
      address?: string;
      recordType?: string;
      saleStatus?: string;
      dateOfSale?: string;
    };
  }>;
  onStateSelect?: (state: string | null) => void;
  selectedState?: string | null;
}

export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

const NAME_TO_CODE = Object.fromEntries(
  Object.entries(STATE_NAMES).map(([code, name]) => [name, code])
) as Record<string, string>;

function stateCodeFromGeoName(name: string | undefined): string | null {
  if (!name) return null;
  return NAME_TO_CODE[name] ?? null;
}

/** Larger canvas = sharper map + room for state labels */
const MAP_W = 1100;
const MAP_H = 660;
const LABEL_FONT_PX = 13;

export default function LeadsMap({ leads, onStateSelect, selectedState }: LeadsMapProps) {
  const [fc, setFc] = useState<FeatureCollection<Geometry, { name?: string }> | null>(null);
  const [geoError, setGeoError] = useState(false);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(US_STATES_TOPO)
      .then((r) => r.json())
      .then((topo: { type: string; objects: { states: unknown } }) => {
        if (cancelled) return;
        const out = feature(topo, topo.objects.states) as FeatureCollection<
          Geometry,
          { name?: string }
        >;
        setFc(out);
      })
      .catch(() => {
        if (!cancelled) setGeoError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const statePaths = useMemo(() => {
    if (!fc?.features?.length) return [];
    const projection = geoAlbersUsa().fitSize([MAP_W, MAP_H], fc);
    const pathGen = geoPath(projection);
    const rows: { code: string; d: string; key: string; cx: number; cy: number }[] = [];
    fc.features.forEach((f: Feature<Geometry, { name?: string }>, i) => {
      const code = stateCodeFromGeoName(f.properties?.name);
      if (!code) return;
      const d = pathGen(f);
      if (!d) return;
      const c = pathGen.centroid(f);
      if (!Number.isFinite(c[0]) || !Number.isFinite(c[1])) return;
      rows.push({ code, d, key: `${code}-${i}`, cx: c[0], cy: c[1] });
    });
    return rows;
  }, [fc]);

  /** States where we have SEO / city pages configured */
  const servedStates = useMemo(
    () => new Set(SEO_CITIES.map((c) => c.state)),
    []
  );

  const leadsByState = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const lead of leads) {
      const code = normalizeStateCode(lead.attributes?.state);
      if (code && STATE_NAMES[code]) {
        counts[code] = (counts[code] || 0) + 1;
      }
    }
    return counts;
  }, [leads]);

  const maxCount = Math.max(...Object.values(leadsByState), 1);
  const totalLeads = leads.length;
  const statesWithLeads = Object.keys(leadsByState).length;

  const fillForCode = (code: string | null) => {
    if (!code) return '#e2e8f0';
    const count = leadsByState[code] || 0;
    const isSelected = selectedState === code;
    const isHovered = hoveredCode === code;
    const inServedMarket = servedStates.has(code);

    if (count === 0) {
      return isHovered ? '#cbd5e1' : '#e2e8f0';
    }
    if (isSelected) return '#c9a86c';

    // Leads in a state we cover with city pages → semi-red / rose
    if (inServedMarket) {
      const intensity = Math.min(count / maxCount, 1);
      const r = Math.round(252 - 35 * (1 - intensity));
      const g = Math.round(200 - 70 * (1 - intensity));
      const b = Math.round(200 - 70 * (1 - intensity));
      if (isHovered) {
        return `rgb(${Math.min(r + 15, 255)}, ${Math.max(g - 25, 120)}, ${Math.max(b - 25, 120)})`;
      }
      return `rgb(${r}, ${g}, ${b})`;
    }

    // Leads outside configured markets → brown scale
    const intensity = Math.min(count / maxCount, 1);
    const r = Math.round(139 + (201 - 139) * intensity);
    const g = Math.round(115 + (168 - 115) * intensity);
    const b = Math.round(85 + (108 - 85) * intensity);
    if (isHovered) {
      return `rgb(${Math.min(r + 20, 255)}, ${Math.min(g + 20, 255)}, ${Math.min(b + 20, 255)})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleClick = (code: string | null) => {
    if (!code) return;
    if (selectedState === code) {
      onStateSelect?.(null);
    } else {
      onStateSelect?.(code);
    }
  };

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">Leads by State</h3>
        {totalLeads > 0 ? (
          <span className="rounded-full bg-[#8b7355]/10 px-3 py-1 text-sm font-medium text-[#8b7355]">
            {totalLeads} leads in {statesWithLeads} states
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">
            Click a state to load
          </span>
        )}
      </div>

      {selectedState && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-[#c9a86c]/10 px-3 py-2">
          <span className="text-sm font-medium text-[#1e2d3d]">
            Showing: <strong>{STATE_NAMES[selectedState]}</strong> ({leadsByState[selectedState] ?? 0} leads)
          </span>
          <button
            type="button"
            onClick={() => onStateSelect?.(null)}
            className="text-sm font-medium text-[#8b7355] hover:text-[#6f5a42] hover:underline"
          >
            Show all states
          </button>
        </div>
      )}

      <div
        className="relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 p-2"
        style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
      >
        {geoError && (
          <p className="p-4 text-center text-sm text-red-600">Could not load map. Check your connection.</p>
        )}
        {!fc && !geoError && (
          <div className="flex h-full min-h-[200px] items-center justify-center">
            <div className="text-center text-sm text-slate-500">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-[#8b7355] border-t-transparent" />
              Loading map…
            </div>
          </div>
        )}
        {statePaths.length > 0 && (
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="h-auto w-full max-w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="United States map, click a state to select"
          >
            <g className="states">
              {statePaths.map(({ code, d, key }) => {
                const fill = fillForCode(code);
                const stroke = selectedState === code ? '#1e2d3d' : '#94a3b8';
                const sw = selectedState === code ? 1.25 : 0.5;
                return (
                  <path
                    key={key}
                    d={d}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={sw}
                    className="cursor-pointer outline-none transition-[fill,stroke-width] duration-200 ease-out"
                    style={{
                      strokeWidth: hoveredCode === code ? Math.max(sw, 1) : sw,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(code);
                    }}
                    onMouseEnter={() => setHoveredCode(code)}
                    onMouseLeave={() => setHoveredCode(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick(code);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${STATE_NAMES[code]}, ${leadsByState[code] ?? 0} leads`}
                  />
                );
              })}
            </g>
            <g className="pointer-events-none state-labels" aria-hidden>
              {statePaths.map(({ code, cx, cy, key }) => (
                <text
                  key={`lbl-${key}`}
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#1e2d3d"
                  stroke="#ffffff"
                  strokeWidth={3}
                  paintOrder="stroke fill"
                  style={{
                    fontSize: LABEL_FONT_PX,
                    fontWeight: 700,
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    letterSpacing: '0.04em',
                  }}
                >
                  {code}
                </text>
              ))}
            </g>
          </svg>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-slate-300 bg-[#e2e8f0]" />
            <span className="text-xs text-slate-500">No leads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-rose-200" />
            <span className="text-xs text-slate-500">Leads in your markets</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#8b7355]" />
            <span className="text-xs text-slate-500">Other states w/ leads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#c9a86c]" />
            <span className="text-xs text-slate-500">Selected</span>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          {totalLeads > 0 ? 'Click a state to filter leads' : 'Click any state to load leads'}
        </p>
      </div>

      {Object.keys(leadsByState).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(leadsByState)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([code, count]) => (
              <button
                key={code}
                type="button"
                onClick={() => onStateSelect?.(selectedState === code ? null : code)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                  selectedState === code
                    ? 'border-[#c9a86c] bg-[#c9a86c]/20 text-[#8b7355]'
                    : 'border-black/10 bg-slate-50 text-slate-700 hover:border-[#8b7355]/50 hover:bg-[#8b7355]/5'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: selectedState === code ? '#c9a86c' : '#8b7355',
                  }}
                />
                {STATE_NAMES[code]}: {count}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
