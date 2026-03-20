import { business } from '@/config/business';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Areas We Serve — Find Your Page | ${business.name}`,
  description: `Select your situation (foreclosure, probate, divorce, inherited, bad tenants, repairs, vacant) and location. Get a specialized page for your area. California, Nevada, Arizona.`,
};

export default function AreasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
