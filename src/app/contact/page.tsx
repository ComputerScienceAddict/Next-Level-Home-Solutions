import ContactForm from '@/components/ContactForm';
import FAQ from '@/components/FAQ';

export const metadata = {
  title: 'Contact Us | Next Level Home Solutions',
  description:
    'Contact Next Level Home Solutions for a fast, hassle-free cash offer. Facing foreclosure? We help homeowners sell quickly. Call or text 559-991-2190.',
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-black/10 py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h1 className="font-display text-4xl text-black">Contact</h1>
          <p className="mt-4 text-warmgray">
            Call, text, or send a message. We&apos;ll get back to you the same day.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-xl text-black">Get in touch</h2>
              <div className="mt-6 space-y-4 text-sm">
                <p>
                  <a href="tel:559-991-2190" className="font-medium text-gold hover:underline">559-991-2190</a>
                  <span className="text-warmgray"> — Call or text</span>
                </p>
                <p>
                  <a href="https://sites.google.com/view/nextlevelhomesolutions" target="_blank" rel="noopener noreferrer" className="font-medium text-gold hover:underline">
                    Get your cash offer online →
                  </a>
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-display text-xl text-black">Send a message</h2>
              <div className="mt-6">
                <ContactForm variant="message" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
    </>
  );
}
