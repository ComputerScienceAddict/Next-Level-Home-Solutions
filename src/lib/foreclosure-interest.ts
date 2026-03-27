/** Slugs for `/get-offer?interest=` from the foreclosure options page. */
export const FORECLOSURE_INTEREST_LABELS: Record<string, string> = {
  reinstatement: 'Reinstatement',
  'loan-modification': 'Loan modification',
  forbearance: 'Forbearance agreement',
  'chapter-13-bankruptcy': 'Chapter 13 bankruptcy',
  'short-sale': 'Short sale',
  'cash-sale': 'Cash sale (sell as-is)',
};

export function labelForForeclosureInterest(slug: string | undefined): string | null {
  if (!slug) return null;
  return FORECLOSURE_INTEREST_LABELS[slug] ?? null;
}
