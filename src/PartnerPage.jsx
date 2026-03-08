/**
 * PartnerPage – Partner Sign-up
 * Partner registration form inside arc. Shows thank-you state after submit.
 */
import { useEffect, useState } from 'react';

export default function PartnerPage({ onSubmitLead }) {
  const [submitted, setSubmitted] = useState(false);

  // Set SVG arc path length for animation / تحديد طول مسار القوس
  useEffect(() => {
    const arcPaths = document.querySelectorAll('.arc path');
    arcPaths.forEach((path) => {
      if (typeof path.getTotalLength === 'function') {
        const length = Math.ceil(path.getTotalLength());
        path.style.setProperty('--arc-len', `${length}`);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Validate: empty = invalid, consent required
    const fields = ['name', 'company', 'email', 'phone', 'field'];
    fields.forEach((n) => {
      const el = form.elements.namedItem(n);
      if (el && typeof el.setCustomValidity === 'function') el.setCustomValidity('');
    });
    const consentEl = form.elements.namedItem('consent');
    if (consentEl && typeof consentEl.setCustomValidity === 'function') consentEl.setCustomValidity('');

    fields.forEach((n) => {
      const el = form.elements.namedItem(n);
      if (!el || typeof el.value !== 'string') return;
      if (el.value.trim().length === 0) {
        el.setCustomValidity('Required');
      }
    });

    if (consentEl && consentEl.type === 'checkbox' && !consentEl.checked) {
      consentEl.setCustomValidity('Required');
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    onSubmitLead?.(data);
    form.reset();
    setSubmitted(true);
  };

  return (
    <main className="partner-page">
      <section className="hero partner-section">
        <div className="container hero-inner">
          <div className="arc-wrap">
            <svg className="arc" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <filter id="glow-partner" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="arcG-partner" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#a8ff2f" />
                  <stop offset="1" stopColor="#8be626" />
                </linearGradient>
              </defs>
              <path
                d="M 120 320 A 380 380 0 0 1 880 320"
                stroke="url(#arcG-partner)"
                strokeWidth="18"
                fill="none"
                filter="url(#glow-partner)"
                strokeLinecap="round"
              />
            </svg>
            <div className="hero-text-inside-arc partner-form-wrap">
              {submitted ? (
                <section className="partner-submit" aria-live="polite">
                  <h2 className="partner-submit-title">
                    Thank you,
                    <br />
                    Stay alert with your email .
                  </h2>
                </section>
              ) : (
                <section id="contacts" className="section contacts form-section">
                  <div className="container">
                    <form className="contact-form" id="lead-form" onSubmit={handleSubmit}>
                      <div className="field">
                        <label htmlFor="name">Name</label>
                        <input id="name" name="name" type="text" required />
                      </div>
                      <div className="field">
                        <label htmlFor="company">Company Name</label>
                        <input id="company" name="company" type="text" required />
                      </div>
                      <div className="field">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" required />
                      </div>
                      <div className="field">
                        <label htmlFor="phone">Phone Number</label>
                        <input id="phone" name="phone" type="tel" required />
                      </div>
                      <div className="field">
                        <label htmlFor="field">Company Field</label>
                        <input id="field" name="field" type="text" required />
                      </div>
                      <label className="consent">
                        <input type="checkbox" id="consent" name="consent" required />
                        <span>I agree to receive emails about latest updates</span>
                      </label>
                      <button className="btn btn-primary btn-submit" type="submit">
                        Submit
                      </button>
                    </form>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section social-in-contacts">
        <div className="container">
          <div className="social-row">
            <a className="social-icon" href="mailto:info@octamesh.co" aria-label="Email">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </a>
            <a className="social-icon" href="tel:+201020300393" aria-label="Phone">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.48a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
            <a className="social-icon" href="https://wa.me/201020300393" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.52 3.49A11.79 11.79 0 0 0 12.07 1C6.08 1 1.2 5.82 1.2 11.76c0 2.09.55 4.1 1.6 5.88L1 23l5.52-1.77a11.9 11.9 0 0 0 5.55 1.4h.01c5.99 0 10.87-4.82 10.87-10.76 0-2.88-1.16-5.59-3.43-7.38z" />
                <path d="M8.86 7.95c-.2-.47-.41-.48-.6-.5H7.7c-.2 0-.5.07-.76.36s-1 1-1 2.44 1.02 2.83 1.16 3.03c.14.2 2.02 3.24 5 4.41 2.47.98 2.97.78 3.51.73.54-.05 1.73-.71 1.98-1.41.25-.7.25-1.31.18-1.44-.07-.13-.27-.2-.57-.35-.3-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.16-.2.31-.76.95-.94 1.15-.18.2-.35.23-.65.08-.3-.15-1.26-.47-2.4-1.5-.89-.78-1.49-1.73-1.67-2.03-.18-.3-.02-.47.13-.62.13-.13.3-.35.45-.53.15-.18.2-.3.31-.51.1-.2.05-.39-.03-.54-.08-.15-.63-1.56-.86-2.14z" />
              </svg>
            </a>
            <a className="social-icon" href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a className="social-icon" href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
