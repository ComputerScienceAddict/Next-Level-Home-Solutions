import Link from 'next/link';
import { business } from '@/config/business';

/** Fixed bottom bar on small screens — thumb-friendly CTAs on long local sell pages */
export default function SellMobileStickyCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[#c9a86c]/20 bg-[#141a22]/95 px-3 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:hidden"
      role="navigation"
      aria-label="Call or get an offer"
    >
      <a
        href={business.phoneTel}
        className="btn-premium flex min-h-[48px] flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-bold shadow-lg active:scale-[0.98]"
      >
        Call {business.phone}
      </a>
      <Link
        href="/get-offer"
        className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border-2 border-[#c9a86c]/50 bg-[#c9a86c]/15 px-4 py-3 text-center text-sm font-bold text-white backdrop-blur-sm transition active:scale-[0.98] hover:border-[#c9a86c] hover:bg-[#c9a86c]/25"
      >
        Cash offer
      </Link>
    </div>
  );
}
