/**
 * Business profile — used for SEO templates and optional AI analysis.
 * Edit here to reflect your brand; pages pull from this automatically.
 */
export const business = {
  name: 'Next Level Home Solutions',
  tagline: 'Cash offers · Sell as-is · Close fast',
  phone: '559-991-2190',
  phoneTel: 'tel:559-991-2190',
  contactEmail: 'eian.hernandez1414@gmail.com',
  primaryMarket: 'Central California',
  states: ['CA'] as const,
  valueProps: [
    'Fair cash offers with no obligation',
    'We buy houses as-is—no repairs required',
    'No realtor commissions or listing fees',
    'Flexible closing timelines (as fast as 7 days when it makes sense)',
    'Local team that understands California markets',
  ],
  /** High-level description for AI / meta context */
  elevatorPitch:
    'Next Level Home Solutions buys houses directly from homeowners in Central and Northern California. We specialize in helping people who need to sell quickly or on difficult timelines—foreclosure risk, divorce, inherited homes, problem rentals, major repairs, and vacant properties.',
  sellerSituationsWeServe: [
    'Pre-foreclosure and foreclosure',
    'Divorce or separation',
    'Inherited or probate property',
    'Tired landlords and difficult tenants',
    'Homes needing major repairs',
    'Vacant or unused homes',
  ],
} as const;
