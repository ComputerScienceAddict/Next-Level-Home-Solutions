/**
 * SEO targeting: seller situations × cities/zips for programmatic pages.
 * Expand cities/zips as you grow—sitemap and routes generate automatically.
 */

export type SellerSituation = {
  slug: string;
  title: string;
  shortLabel: string;
  searchTerms: string[];
  painSummary: string;
  howWeHelp: string[];
};

export type SeoCity = {
  slug: string;
  name: string;
  state: string;
  county: string;
  /** Representative ZIPs for copy + schema (not every zip—add over time) */
  zips: string[];
  /** Situations common in this area (for "popular in this area" sorting) */
  popularSituations?: string[];
};

export const SELLER_SITUATIONS: SellerSituation[] = [
  {
    slug: 'foreclosure',
    title: 'Facing foreclosure',
    shortLabel: 'Foreclosure',
    searchTerms: ['stop foreclosure', 'sell before foreclosure', 'pre-foreclosure help'],
    painSummary:
      'If you are behind on payments or received a notice of default, time matters. Selling for cash can help you exit on your terms and avoid a foreclosure on your record when that is the right path.',
    howWeHelp: [
      'We review your timeline and explain options in plain language.',
      'We can make a cash offer so you can pay off the loan and move forward.',
      'Closing can often align with what your situation requires.',
    ],
  },
  {
    slug: 'divorce',
    title: 'Selling during divorce',
    shortLabel: 'Divorce',
    searchTerms: ['sell house divorce', 'split equity fast', 'sell marital home cash'],
    painSummary:
      'Dividing a home during divorce is stressful. A fast, certain sale can reduce conflict and help both parties move on with clear numbers.',
    howWeHelp: [
      'One straightforward cash buyer—fewer moving parts than a long listing.',
      'We buy as-is so you are not fighting over repair bids.',
      'Flexible timing to align with your agreement or court schedule.',
    ],
  },
  {
    slug: 'inherited-property',
    title: 'Inherited property',
    shortLabel: 'Inherited',
    searchTerms: ['sell inherited house', 'probate property buyer', 'inherited home cash'],
    painSummary:
      'Inherited homes often come with taxes, repairs, and family logistics. We buy properties in as-is condition so heirs can liquidate fairly and simply.',
    howWeHelp: [
      'We work with many sellers who inherited a home they do not want to maintain.',
      'No need to list and wait—we can make a direct offer.',
      'We are used to properties that need cleanup or updates.',
    ],
  },
  {
    slug: 'bad-tenants-rental',
    title: 'Rental property & bad tenants',
    shortLabel: 'Bad tenants',
    searchTerms: ['sell rental with tenants', 'tired landlord', 'sell tenant occupied'],
    painSummary:
      'Problem tenants, non-payment, or eviction fatigue push many landlords to sell. We purchase rental situations and help you exit the landlord role.',
    howWeHelp: [
      'We buy properties with tenants in place when that fits the deal.',
      'Skip months of showings and retail buyer drama.',
      'Move from landlord stress to a clear closing date.',
    ],
  },
  {
    slug: 'house-needs-repairs',
    title: 'House needs major repairs',
    shortLabel: 'Repairs',
    searchTerms: ['sell house as is', 'fixer upper buyer', 'sell house needs work'],
    painSummary:
      'Foundation, roof, mold, or years of deferred maintenance scare off traditional buyers. We purchase homes in any condition so you are not paying out of pocket to list.',
    howWeHelp: [
      'No repair requests from us—we factor condition into our offer.',
      'Avoid contractor roulette before you sell.',
      'Sell as-is and let us handle the project after closing.',
    ],
  },
  {
    slug: 'vacant-house',
    title: 'Vacant house',
    shortLabel: 'Vacant',
    searchTerms: ['sell vacant house', 'empty house cash buyer', 'vacant property'],
    painSummary:
      'Vacant homes cost money—taxes, insurance, vandalism risk, and worry. Selling quickly puts cash in your pocket and ends the carrying costs.',
    howWeHelp: [
      'We buy vacant homes throughout our service area.',
      'No staging or curb-appeal projects required.',
      'Close and stop paying for an empty property.',
    ],
  },
];

/** Major cities across Central/Northern CA service footprint (expand anytime) */
export const SEO_CITIES: SeoCity[] = [
  { slug: 'fresno-ca', name: 'Fresno', state: 'CA', county: 'Fresno', zips: ['93710', '93711', '93720', '93722', '93727'], popularSituations: ['foreclosure', 'inherited-property', 'house-needs-repairs'] },
  { slug: 'clovis-ca', name: 'Clovis', state: 'CA', county: 'Fresno', zips: ['93611', '93612', '93619'] },
  { slug: 'visalia-ca', name: 'Visalia', state: 'CA', county: 'Tulare', zips: ['93277', '93291', '93292'], popularSituations: ['foreclosure', 'inherited-property', 'house-needs-repairs'] },
  { slug: 'tulare-ca', name: 'Tulare', state: 'CA', county: 'Tulare', zips: ['93274', '93275'] },
  { slug: 'porterville-ca', name: 'Porterville', state: 'CA', county: 'Tulare', zips: ['93257'] },
  { slug: 'dinuba-ca', name: 'Dinuba', state: 'CA', county: 'Tulare', zips: ['93618'] },
  { slug: 'farmersville-ca', name: 'Farmersville', state: 'CA', county: 'Tulare', zips: ['93223'] },
  { slug: 'woodlake-ca', name: 'Woodlake', state: 'CA', county: 'Tulare', zips: ['93286'] },
  { slug: 'earlimart-ca', name: 'Earlimart', state: 'CA', county: 'Tulare', zips: ['93219'] },
  { slug: 'goshen-ca', name: 'Goshen', state: 'CA', county: 'Tulare', zips: ['93227'] },
  { slug: 'pixley-ca', name: 'Pixley', state: 'CA', county: 'Tulare', zips: ['93256'] },
  { slug: 'strathmore-ca', name: 'Strathmore', state: 'CA', county: 'Tulare', zips: ['93267'] },
  { slug: 'tipton-ca', name: 'Tipton', state: 'CA', county: 'Tulare', zips: ['93272'] },
  { slug: 'hanford-ca', name: 'Hanford', state: 'CA', county: 'Kings', zips: ['93230'], popularSituations: ['foreclosure', 'inherited-property', 'vacant-house'] },
  { slug: 'corcoran-ca', name: 'Corcoran', state: 'CA', county: 'Kings', zips: ['93212'] },
  { slug: 'lemoore-ca', name: 'Lemoore', state: 'CA', county: 'Kings', zips: ['93245', '93246'] },
  { slug: 'avenal-ca', name: 'Avenal', state: 'CA', county: 'Kings', zips: ['93204'] },
  { slug: 'armona-ca', name: 'Armona', state: 'CA', county: 'Kings', zips: ['93202'] },
  { slug: 'stratford-ca', name: 'Stratford', state: 'CA', county: 'Kings', zips: ['93266'] },
  { slug: 'kettleman-city-ca', name: 'Kettleman City', state: 'CA', county: 'Kings', zips: ['93239'] },
  { slug: 'bakersfield-ca', name: 'Bakersfield', state: 'CA', county: 'Kern', zips: ['93301', '93308', '93309', '93311'], popularSituations: ['foreclosure', 'vacant-house', 'bad-tenants-rental'] },
  { slug: 'madera-ca', name: 'Madera', state: 'CA', county: 'Madera', zips: ['93637', '93638'] },
  { slug: 'merced-ca', name: 'Merced', state: 'CA', county: 'Merced', zips: ['95340', '95348'] },
  { slug: 'modesto-ca', name: 'Modesto', state: 'CA', county: 'Stanislaus', zips: ['95350', '95355', '95356'] },
  { slug: 'stockton-ca', name: 'Stockton', state: 'CA', county: 'San Joaquin', zips: ['95202', '95207', '95209', '95219'] },
  { slug: 'sacramento-ca', name: 'Sacramento', state: 'CA', county: 'Sacramento', zips: ['95814', '95816', '95819', '95825', '95831'], popularSituations: ['divorce', 'inherited-property', 'vacant-house'] },
  { slug: 'roseville-ca', name: 'Roseville', state: 'CA', county: 'Placer', zips: ['95661', '95678'] },
  { slug: 'elk-grove-ca', name: 'Elk Grove', state: 'CA', county: 'Sacramento', zips: ['95624', '95757'] },
  { slug: 'davis-ca', name: 'Davis', state: 'CA', county: 'Yolo', zips: ['95616', '95618'] },
  { slug: 'woodland-ca', name: 'Woodland', state: 'CA', county: 'Yolo', zips: ['95695', '95776'] },
  { slug: 'vacaville-ca', name: 'Vacaville', state: 'CA', county: 'Solano', zips: ['95687', '95688'] },
  { slug: 'fairfield-ca', name: 'Fairfield', state: 'CA', county: 'Solano', zips: ['94533', '94534'] },
  { slug: 'salinas-ca', name: 'Salinas', state: 'CA', county: 'Monterey', zips: ['93901', '93905', '93906'] },
  { slug: 'hollister-ca', name: 'Hollister', state: 'CA', county: 'San Benito', zips: ['95023'] },
  { slug: 'santa-cruz-ca', name: 'Santa Cruz', state: 'CA', county: 'Santa Cruz', zips: ['95060', '95062', '95065'] },
  { slug: 'turlock-ca', name: 'Turlock', state: 'CA', county: 'Stanislaus', zips: ['95380', '95382'] },
  { slug: 'tracy-ca', name: 'Tracy', state: 'CA', county: 'San Joaquin', zips: ['95376', '95377'] },
  { slug: 'manteca-ca', name: 'Manteca', state: 'CA', county: 'San Joaquin', zips: ['95336', '95337'] },
  { slug: 'lodi-ca', name: 'Lodi', state: 'CA', county: 'San Joaquin', zips: ['95240', '95242'] },
  { slug: 'reedley-ca', name: 'Reedley', state: 'CA', county: 'Fresno', zips: ['93654'] },
  { slug: 'selma-ca', name: 'Selma', state: 'CA', county: 'Fresno', zips: ['93662'] },
  { slug: 'sanger-ca', name: 'Sanger', state: 'CA', county: 'Fresno', zips: ['93657'] },
  { slug: 'exeter-ca', name: 'Exeter', state: 'CA', county: 'Tulare', zips: ['93221'] },
  { slug: 'lindsay-ca', name: 'Lindsay', state: 'CA', county: 'Tulare', zips: ['93247'] },
  // Out-of-state (NV, AZ) — per client request
  { slug: 'reno-nv', name: 'Reno', state: 'NV', county: 'Washoe', zips: ['89501', '89502', '89503'], popularSituations: ['foreclosure', 'vacant-house', 'house-needs-repairs'] },
  { slug: 'las-vegas-nv', name: 'Las Vegas', state: 'NV', county: 'Clark', zips: ['89101', '89102', '89107', '89128'], popularSituations: ['foreclosure', 'divorce', 'vacant-house'] },
  { slug: 'henderson-nv', name: 'Henderson', state: 'NV', county: 'Clark', zips: ['89002', '89011', '89012'], popularSituations: ['foreclosure', 'inherited-property', 'vacant-house'] },
  { slug: 'phoenix-az', name: 'Phoenix', state: 'AZ', county: 'Maricopa', zips: ['85001', '85003', '85004', '85006', '85008'], popularSituations: ['foreclosure', 'divorce', 'bad-tenants-rental'] },
  { slug: 'mesa-az', name: 'Mesa', state: 'AZ', county: 'Maricopa', zips: ['85201', '85203', '85204'], popularSituations: ['foreclosure', 'inherited-property', 'vacant-house'] },
  { slug: 'tucson-az', name: 'Tucson', state: 'AZ', county: 'Pima', zips: ['85701', '85704', '85705', '85710'], popularSituations: ['foreclosure', 'divorce', 'house-needs-repairs'] },
  { slug: 'scottsdale-az', name: 'Scottsdale', state: 'AZ', county: 'Maricopa', zips: ['85250', '85251', '85254'] },
  // Florida
  { slug: 'miami-fl', name: 'Miami', state: 'FL', county: 'Miami-Dade', zips: ['33101', '33125', '33126', '33130', '33131'], popularSituations: ['foreclosure', 'vacant-house', 'inherited-property'] },
  { slug: 'orlando-fl', name: 'Orlando', state: 'FL', county: 'Orange', zips: ['32801', '32803', '32804', '32806'], popularSituations: ['foreclosure', 'divorce', 'vacant-house'] },
  { slug: 'tampa-fl', name: 'Tampa', state: 'FL', county: 'Hillsborough', zips: ['33602', '33605', '33609', '33612'], popularSituations: ['foreclosure', 'inherited-property', 'bad-tenants-rental'] },
  { slug: 'jacksonville-fl', name: 'Jacksonville', state: 'FL', county: 'Duval', zips: ['32202', '32204', '32205', '32206'] },
  { slug: 'fort-lauderdale-fl', name: 'Fort Lauderdale', state: 'FL', county: 'Broward', zips: ['33301', '33304', '33308'] },
  // Texas
  { slug: 'houston-tx', name: 'Houston', state: 'TX', county: 'Harris', zips: ['77002', '77003', '77004', '77005', '77006'], popularSituations: ['foreclosure', 'vacant-house', 'house-needs-repairs'] },
  { slug: 'dallas-tx', name: 'Dallas', state: 'TX', county: 'Dallas', zips: ['75201', '75204', '75206', '75214', '75218'], popularSituations: ['foreclosure', 'divorce', 'inherited-property'] },
  { slug: 'san-antonio-tx', name: 'San Antonio', state: 'TX', county: 'Bexar', zips: ['78202', '78205', '78207', '78209'], popularSituations: ['foreclosure', 'vacant-house', 'bad-tenants-rental'] },
  { slug: 'austin-tx', name: 'Austin', state: 'TX', county: 'Travis', zips: ['78701', '78702', '78703', '78704'], popularSituations: ['foreclosure', 'divorce', 'inherited-property'] },
  { slug: 'fort-worth-tx', name: 'Fort Worth', state: 'TX', county: 'Tarrant', zips: ['76102', '76103', '76104'] },
  // Georgia
  { slug: 'atlanta-ga', name: 'Atlanta', state: 'GA', county: 'Fulton', zips: ['30303', '30305', '30306', '30308', '30309'], popularSituations: ['foreclosure', 'divorce', 'vacant-house'] },
  { slug: 'augusta-ga', name: 'Augusta', state: 'GA', county: 'Richmond', zips: ['30901', '30904', '30906'] },
  { slug: 'savannah-ga', name: 'Savannah', state: 'GA', county: 'Chatham', zips: ['31401', '31404', '31405'] },
  // Ohio
  { slug: 'columbus-oh', name: 'Columbus', state: 'OH', county: 'Franklin', zips: ['43201', '43202', '43203', '43204'], popularSituations: ['foreclosure', 'inherited-property', 'vacant-house'] },
  { slug: 'cleveland-oh', name: 'Cleveland', state: 'OH', county: 'Cuyahoga', zips: ['44102', '44103', '44105', '44106'], popularSituations: ['foreclosure', 'house-needs-repairs', 'vacant-house'] },
  { slug: 'cincinnati-oh', name: 'Cincinnati', state: 'OH', county: 'Hamilton', zips: ['45202', '45203', '45204', '45206'] },
  // Alabama
  { slug: 'birmingham-al', name: 'Birmingham', state: 'AL', county: 'Jefferson', zips: ['35203', '35204', '35205', '35211'], popularSituations: ['foreclosure', 'inherited-property', 'house-needs-repairs'] },
  { slug: 'huntsville-al', name: 'Huntsville', state: 'AL', county: 'Madison', zips: ['35801', '35802', '35803'] },
  { slug: 'montgomery-al', name: 'Montgomery', state: 'AL', county: 'Montgomery', zips: ['36104', '36105', '36106'] },
  { slug: 'mobile-al', name: 'Mobile', state: 'AL', county: 'Mobile', zips: ['36602', '36603', '36604'] },
  // Virginia
  { slug: 'richmond-va', name: 'Richmond', state: 'VA', county: 'Richmond City', zips: ['23219', '23220', '23221', '23222'], popularSituations: ['foreclosure', 'inherited-property', 'vacant-house'] },
  { slug: 'virginia-beach-va', name: 'Virginia Beach', state: 'VA', county: 'Virginia Beach', zips: ['23451', '23452', '23454'] },
  { slug: 'norfolk-va', name: 'Norfolk', state: 'VA', county: 'Norfolk', zips: ['23502', '23503', '23504'] },
  // New York
  { slug: 'new-york-ny', name: 'New York', state: 'NY', county: 'New York', zips: ['10001', '10002', '10003', '10011'], popularSituations: ['foreclosure', 'divorce', 'inherited-property'] },
  { slug: 'buffalo-ny', name: 'Buffalo', state: 'NY', county: 'Erie', zips: ['14201', '14202', '14203'], popularSituations: ['foreclosure', 'house-needs-repairs', 'vacant-house'] },
  { slug: 'rochester-ny', name: 'Rochester', state: 'NY', county: 'Monroe', zips: ['14604', '14605', '14607'] },
  { slug: 'albany-ny', name: 'Albany', state: 'NY', county: 'Albany', zips: ['12202', '12205', '12206'] },
  // New Jersey
  { slug: 'newark-nj', name: 'Newark', state: 'NJ', county: 'Essex', zips: ['07102', '07103', '07104'], popularSituations: ['foreclosure', 'inherited-property', 'vacant-house'] },
  { slug: 'jersey-city-nj', name: 'Jersey City', state: 'NJ', county: 'Hudson', zips: ['07302', '07304', '07305'] },
  { slug: 'trenton-nj', name: 'Trenton', state: 'NJ', county: 'Mercer', zips: ['08608', '08609', '08610'] },
  { slug: 'camden-nj', name: 'Camden', state: 'NJ', county: 'Camden', zips: ['08102', '08103', '08104'] },
  // Louisiana
  { slug: 'new-orleans-la', name: 'New Orleans', state: 'LA', county: 'Orleans', zips: ['70112', '70113', '70115', '70116'], popularSituations: ['foreclosure', 'inherited-property', 'vacant-house'] },
  { slug: 'baton-rouge-la', name: 'Baton Rouge', state: 'LA', county: 'East Baton Rouge', zips: ['70801', '70802', '70806'] },
  { slug: 'shreveport-la', name: 'Shreveport', state: 'LA', county: 'Caddo', zips: ['71101', '71103', '71104'] },
  // Kansas
  { slug: 'wichita-ks', name: 'Wichita', state: 'KS', county: 'Sedgwick', zips: ['67202', '67203', '67204'], popularSituations: ['foreclosure', 'inherited-property', 'vacant-house'] },
  { slug: 'kansas-city-ks', name: 'Kansas City', state: 'KS', county: 'Wyandotte', zips: ['66101', '66102', '66104'] },
  { slug: 'overland-park-ks', name: 'Overland Park', state: 'KS', county: 'Johnson', zips: ['66204', '66210', '66211'] },
];

export function getSituationBySlug(slug: string): SellerSituation | undefined {
  return SELLER_SITUATIONS.find((s) => s.slug === slug);
}

export function getCityBySlug(slug: string): SeoCity | undefined {
  return SEO_CITIES.find((c) => c.slug === slug);
}

export function getAllSeoStaticParams(): { situation: string; city: string }[] {
  const params: { situation: string; city: string }[] = [];
  for (const s of SELLER_SITUATIONS) {
    for (const c of SEO_CITIES) {
      params.push({ situation: s.slug, city: c.slug });
    }
  }
  return params;
}
