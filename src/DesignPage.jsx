import { useEffect } from 'react';

export default function DesignPage() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    const selectors = '.design-catalog-title, .design-card, .design-page .cta-panel';
    document.querySelectorAll(selectors).forEach((el) => {
      el.classList.add('will-reveal', 'reveal-up');
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="design-page">
      <section className="design-hero">
        <div className="container design-hero-inner">
          <div className="design-hero-text">
              <h1 className="design-hero-title">
                <span className="design-brackets">{'{'}</span> design <span className="design-brackets">{'}'}</span>
              </h1>
              <span className="design-pill">CREATIVE DIVISION</span>
              <h2 className="design-hero-headline">Elevate Your <span className="design-accent">Visual Identity</span>.</h2>
              <p className="design-hero-sub">
                We blend art with technology to create digital experiences that resonate. Our design team transforms complex ideas into intuitive visual narratives.
              </p>
              <div className="design-hero-actions">
                <a href="#contacts" className="btn btn-primary design-order-btn">
                  ORDER THIS SERVICE
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                </a>
                <a href="#design-catalog" className="design-explore-link">
                  Explore Sub-services
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </a>
              </div>
            </div>
        </div>
      </section>

      <section id="design-catalog" className="section design-catalog">
        <div className="container">
          <p className="design-catalog-kicker">SERVICE CATALOG</p>
          <h2 className="design-catalog-title">Comprehensive Design Solutions for Modern Brands</h2>
          <div className="design-grid">
            <article className="service-card design-card">
              <div className="service-card-icon service-card-icon--design" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm2 0v14h12V5H6zm2 2h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
                </svg>
              </div>
              <h3>UX/UI Interface Design</h3>
              <ul className="service-card-list">
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Websites</li>
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Apps</li>
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Dashboard</li>
              </ul>
            </article>
            <article className="service-card design-card">
              <div className="service-card-icon service-card-icon--design" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 2-2c0-.5-.2-1-.6-1.4-.3-.3-.4-.7-.3-1.1.1-.4.5-.7.9-.7h2.2A4.8 4.8 0 0 0 21 12.2C21 6.6 16.5 2 12 2Z" />
                </svg>
              </div>
              <h3>Brand Identity &amp; Logo</h3>
              <ul className="service-card-list">
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Logo Mark</li>
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Illustrations</li>
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Typography</li>
              </ul>
            </article>
            <article className="service-card design-card">
              <div className="service-card-icon service-card-icon--design" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <h3>Graphic Illustration</h3>
              <ul className="service-card-list">
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Digital</li>
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Vector</li>
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Concept Art</li>
              </ul>
            </article>
            <article className="service-card design-card">
              <div className="service-card-icon service-card-icon--design" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 16v-4h5.5l2.5 1.5V20H6zm12 0h-5.5v-8l2.5 1.5L18 12v8z" />
                </svg>
              </div>
              <h3>Printing &amp; Publication</h3>
              <ul className="service-card-list">
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Brochures</li>
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Books</li>
                <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Packaging</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section cta-callout design-cta" aria-label="Start your design journey">
        <div className="container">
          <div className="cta-panel design-cta-panel">
            <span className="design-cta-star" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
              </svg>
            </span>
            <h2 className="cta-title">Ready to start your <span className="design-cta-accent">design journey</span>?</h2>
            <p className="cta-subtitle">
              Join 150+ global partners who have scaled their business with our creative expertise.
            </p>
            <a className="cta-button design-cta-btn" href="#contacts">
              ORDER THIS SERVICE NOW
            </a>
            <p className="design-cta-note">Typical response time: Under 2 hours</p>
          </div>
        </div>
      </section>
    </main>
  );
}
