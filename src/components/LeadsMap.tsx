'use client';

import { useMemo, useState } from 'react';
import { USMap } from 'react-us-map';

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

const STATE_NAMES: Record<string, string> = {
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

const STATE_CODES: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAMES).map(([code, name]) => [name, code])
);

export default function LeadsMap({ leads, onStateSelect, selectedState }: LeadsMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const leadsByState = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const lead of leads) {
      const state = lead.attributes?.state?.toUpperCase();
      if (state && STATE_NAMES[state]) {
        counts[state] = (counts[state] || 0) + 1;
      }
    }
    return counts;
  }, [leads]);

  const maxCount = Math.max(...Object.values(leadsByState), 1);

  const getFill = (stateName: string) => {
    const code = STATE_CODES[stateName];
    if (!code) return '#e2e8f0';
    
    const count = leadsByState[code] || 0;
    const isSelected = selectedState === code;
    const isHovered = hoveredState === stateName;
    
    if (count === 0) {
      return isHovered ? '#cbd5e1' : '#e2e8f0';
    }
    
    if (isSelected) {
      return '#c9a86c';
    }
    
    const intensity = Math.min(count / maxCount, 1);
    const r = Math.round(139 + (201 - 139) * intensity);
    const g = Math.round(115 + (168 - 115) * intensity);
    const b = Math.round(85 + (108 - 85) * intensity);
    
    if (isHovered) {
      return `rgb(${Math.min(r + 20, 255)}, ${Math.min(g + 20, 255)}, ${Math.min(b + 20, 255)})`;
    }
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getStroke = (stateName: string) => {
    const code = STATE_CODES[stateName];
    if (selectedState === code) return '#1e2d3d';
    return '#94a3b8';
  };

  const getStrokeWidth = (stateName: string) => {
    const code = STATE_CODES[stateName];
    if (selectedState === code) return 2;
    return 0.5;
  };

  const handleClick = (stateName: string) => {
    const code = STATE_CODES[stateName];
    if (!code) return;
    
    if (selectedState === code) {
      onStateSelect?.(null);
    } else if (leadsByState[code] > 0) {
      onStateSelect?.(code);
    }
  };

  const totalLeads = leads.length;
  const statesWithLeads = Object.keys(leadsByState).length;

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">Leads by State</h3>
        <span className="rounded-full bg-[#8b7355]/10 px-3 py-1 text-sm font-medium text-[#8b7355]">
          {totalLeads} leads in {statesWithLeads} states
        </span>
      </div>

      {selectedState && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-[#c9a86c]/10 px-3 py-2">
          <span className="text-sm font-medium text-[#1e2d3d]">
            Showing: <strong>{STATE_NAMES[selectedState]}</strong> ({leadsByState[selectedState]} leads)
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

      <div className="relative aspect-[1.6] w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 p-2">
        <USMap
          fill={getFill}
          stroke={getStroke}
          strokeWidth={getStrokeWidth}
          onClick={handleClick}
          onMouseEnter={(stateName) => setHoveredState(stateName)}
          onMouseLeave={() => setHoveredState(null)}
          title={(stateName) => {
            const code = STATE_CODES[stateName];
            const count = code ? leadsByState[code] || 0 : 0;
            return `${stateName}: ${count} lead${count !== 1 ? 's' : ''}`;
          }}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#e2e8f0] border border-slate-300" />
            <span className="text-xs text-slate-500">No leads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#8b7355]" />
            <span className="text-xs text-slate-500">Few leads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#c9a86c]" />
            <span className="text-xs text-slate-500">Many leads</span>
          </div>
        </div>
        <p className="text-xs text-slate-400">Click a state to filter leads</p>
      </div>

      {/* Top states list */}
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
