'use client';

import { useMemo } from 'react';

interface LeadLocation {
  city?: string;
  state?: string;
  count: number;
}

interface LeadsMapProps {
  leads: Array<{
    attributes: {
      city?: string;
      state?: string;
    };
  }>;
}

const STATE_COORDS: Record<string, { x: number; y: number }> = {
  AL: { x: 580, y: 380 },
  AK: { x: 150, y: 460 },
  AZ: { x: 200, y: 340 },
  AR: { x: 490, y: 340 },
  CA: { x: 100, y: 280 },
  CO: { x: 280, y: 280 },
  CT: { x: 720, y: 180 },
  DE: { x: 700, y: 230 },
  FL: { x: 640, y: 440 },
  GA: { x: 620, y: 380 },
  HI: { x: 250, y: 480 },
  ID: { x: 180, y: 160 },
  IL: { x: 520, y: 250 },
  IN: { x: 560, y: 250 },
  IA: { x: 470, y: 210 },
  KS: { x: 390, y: 280 },
  KY: { x: 580, y: 290 },
  LA: { x: 490, y: 410 },
  ME: { x: 750, y: 100 },
  MD: { x: 680, y: 240 },
  MA: { x: 730, y: 160 },
  MI: { x: 560, y: 180 },
  MN: { x: 450, y: 140 },
  MS: { x: 530, y: 380 },
  MO: { x: 480, y: 290 },
  MT: { x: 230, y: 110 },
  NE: { x: 380, y: 220 },
  NV: { x: 140, y: 240 },
  NH: { x: 730, y: 130 },
  NJ: { x: 710, y: 210 },
  NM: { x: 270, y: 360 },
  NY: { x: 690, y: 160 },
  NC: { x: 660, y: 310 },
  ND: { x: 380, y: 110 },
  OH: { x: 600, y: 240 },
  OK: { x: 400, y: 340 },
  OR: { x: 120, y: 140 },
  PA: { x: 670, y: 210 },
  RI: { x: 735, y: 170 },
  SC: { x: 650, y: 350 },
  SD: { x: 380, y: 160 },
  TN: { x: 560, y: 320 },
  TX: { x: 370, y: 410 },
  UT: { x: 210, y: 260 },
  VT: { x: 715, y: 120 },
  VA: { x: 660, y: 270 },
  WA: { x: 130, y: 80 },
  WV: { x: 630, y: 260 },
  WI: { x: 500, y: 160 },
  WY: { x: 280, y: 190 },
};

const CITY_COORDS: Record<string, { x: number; y: number }> = {
  'fresno-ca': { x: 95, y: 270 },
  'visalia-ca': { x: 100, y: 285 },
  'tulare-ca': { x: 102, y: 290 },
  'clovis-ca': { x: 100, y: 268 },
  'bakersfield-ca': { x: 105, y: 310 },
  'sacramento-ca': { x: 90, y: 235 },
  'stockton-ca': { x: 88, y: 248 },
  'modesto-ca': { x: 90, y: 255 },
  'las-vegas-nv': { x: 170, y: 305 },
  'reno-nv': { x: 130, y: 230 },
  'phoenix-az': { x: 210, y: 360 },
  'tucson-az': { x: 220, y: 385 },
  'miami-fl': { x: 675, y: 470 },
  'orlando-fl': { x: 660, y: 430 },
  'tampa-fl': { x: 640, y: 440 },
  'jacksonville-fl': { x: 650, y: 400 },
  'houston-tx': { x: 420, y: 420 },
  'dallas-tx': { x: 400, y: 370 },
  'san-antonio-tx': { x: 380, y: 430 },
  'austin-tx': { x: 385, y: 410 },
  'atlanta-ga': { x: 610, y: 360 },
  'columbus-oh': { x: 595, y: 250 },
  'cleveland-oh': { x: 600, y: 220 },
  'birmingham-al': { x: 565, y: 365 },
  'richmond-va': { x: 670, y: 275 },
  'new-york-ny': { x: 710, y: 185 },
  'buffalo-ny': { x: 665, y: 175 },
  'newark-nj': { x: 705, y: 200 },
  'new-orleans-la': { x: 510, y: 420 },
  'wichita-ks': { x: 400, y: 295 },
};

function normalizeCity(city: string, state: string): string {
  return `${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`;
}

export default function LeadsMap({ leads }: LeadsMapProps) {
  const locationGroups = useMemo(() => {
    const groups: Record<string, LeadLocation & { x: number; y: number }> = {};
    
    for (const lead of leads) {
      const city = lead.attributes?.city;
      const state = lead.attributes?.state;
      
      if (!state) continue;
      
      const stateUpper = state.toUpperCase();
      let coords: { x: number; y: number } | undefined;
      let key: string = stateUpper;
      
      if (city) {
        const cityKey = normalizeCity(city, stateUpper);
        const cityCoords = CITY_COORDS[cityKey];
        if (cityCoords) {
          coords = cityCoords;
          key = cityKey;
        }
      }
      
      if (!coords) {
        coords = STATE_COORDS[stateUpper];
      }
      
      if (!coords) continue;
      
      if (!groups[key]) {
        groups[key] = {
          city: city || undefined,
          state: stateUpper,
          count: 0,
          x: coords.x,
          y: coords.y,
        };
      }
      groups[key].count++;
    }
    
    return Object.values(groups);
  }, [leads]);

  const totalLeads = leads.length;

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">Leads by Location</h3>
        <span className="rounded-full bg-[#8b7355]/10 px-3 py-1 text-sm font-medium text-[#8b7355]">
          {totalLeads} total leads
        </span>
      </div>
      
      <div className="relative aspect-[1.6] w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100">
        <svg
          viewBox="0 0 800 500"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Simple US outline path */}
          <path
            d="M 60 100 
               C 60 80, 180 60, 280 80
               C 380 100, 450 80, 520 100
               C 590 120, 680 100, 750 140
               L 750 180
               C 730 160, 720 180, 710 200
               L 720 220
               C 700 240, 690 260, 700 280
               L 680 320
               C 660 340, 670 380, 650 400
               C 630 420, 660 450, 680 480
               L 620 480
               C 600 450, 580 420, 560 430
               C 540 440, 520 420, 500 430
               L 450 450
               C 420 460, 380 450, 350 460
               C 320 470, 280 450, 250 460
               L 200 450
               C 180 440, 150 420, 130 400
               L 100 380
               C 80 360, 60 340, 50 300
               L 50 200
               C 50 160, 60 120, 60 100
               Z"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          
          {/* State boundaries - simplified */}
          <path
            d="M 520 100 L 520 250 M 450 100 L 450 300 M 380 100 L 380 350
               M 280 100 L 280 400 M 180 100 L 180 400
               M 60 200 L 750 200 M 60 300 L 750 300 M 60 400 L 680 400"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          
          {/* Pins for each location */}
          {locationGroups.map((loc, i) => {
            const pinSize = Math.min(12 + loc.count * 2, 28);
            const isLarge = loc.count >= 5;
            
            return (
              <g key={i}>
                {/* Pin shadow */}
                <ellipse
                  cx={loc.x}
                  cy={loc.y + pinSize / 2 + 2}
                  rx={pinSize / 3}
                  ry={pinSize / 6}
                  fill="rgba(0,0,0,0.15)"
                />
                
                {/* Pin body */}
                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r={pinSize / 2}
                  fill={isLarge ? '#c9a86c' : '#8b7355'}
                  stroke="#fff"
                  strokeWidth="2"
                  className="drop-shadow-md"
                />
                
                {/* Count label */}
                <text
                  x={loc.x}
                  y={loc.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize={pinSize > 20 ? 11 : 9}
                  fontWeight="bold"
                >
                  {loc.count}
                </text>
                
                {/* City label for larger pins */}
                {loc.count >= 3 && loc.city && (
                  <text
                    x={loc.x}
                    y={loc.y + pinSize / 2 + 12}
                    textAnchor="middle"
                    fill="#1e2d3d"
                    fontSize="9"
                    fontWeight="500"
                    className="pointer-events-none"
                  >
                    {loc.city}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Legend */}
          <g transform="translate(20, 440)">
            <rect x="0" y="0" width="180" height="50" rx="6" fill="white" fillOpacity="0.9" stroke="#e2e8f0" />
            <circle cx="20" cy="18" r="6" fill="#8b7355" />
            <text x="32" y="22" fontSize="10" fill="#64748b">1-4 leads</text>
            <circle cx="20" cy="36" r="8" fill="#c9a86c" />
            <text x="32" y="40" fontSize="10" fill="#64748b">5+ leads</text>
            <text x="100" y="30" fontSize="10" fill="#94a3b8">Pin size = count</text>
          </g>
        </svg>
      </div>
      
      {/* Location summary below map */}
      {locationGroups.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {locationGroups
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map((loc, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: loc.count >= 5 ? '#c9a86c' : '#8b7355' }}
                />
                {loc.city || loc.state}: {loc.count}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
