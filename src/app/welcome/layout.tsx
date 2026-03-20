import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome | Next Level Home Solutions',
  description: 'Tell us your situation so we can point you to the right help.',
  robots: { index: false, follow: true },
};

/** Welcome is a focused step before the homepage — no extra chrome */
export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return <div className="welcome-gate min-h-[calc(100dvh-5rem)]">{children}</div>;
}
