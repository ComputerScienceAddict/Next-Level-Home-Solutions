'use client';

import { useEffect } from 'react';

/** Fires the Google Ads "Request quote" conversion once when mounted (thank-you page only). */
export default function GoogleAdsQuoteConversion() {
  useEffect(() => {
    let done = false;
    const fire = () => {
      if (done) return;
      const gtag = (
        window as Window & { gtag?: (...args: unknown[]) => void }
      ).gtag;
      if (typeof gtag !== 'function') return;
      done = true;
      gtag('event', 'conversion', {
        send_to: 'AW-18044630783/8U1hCLux2Z4cEP_trJxD',
      });
    };
    fire();
    const id = window.setInterval(() => {
      fire();
      if (done) window.clearInterval(id);
    }, 50);
    return () => window.clearInterval(id);
  }, []);

  return null;
}
