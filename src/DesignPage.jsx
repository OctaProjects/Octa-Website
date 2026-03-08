/**
 * DesignPage – Creative Design Services
 * Shows design hero, service catalog (UX, Brand, Illustration, Print), and CTA.
 */
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
                <span className="design-bracket design-bracket-left" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square">
                    <path d="M 6 2 C 2 2 2 12 6 22" />
                  </svg>
                </span>
                <span className="design-word">design</span>
                <span className="design-bracket design-bracket-right" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square">
                    <path d="M 18 2 C 22 2 22 12 18 22" />
                  </svg>
                </span>
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
            <article className="design-card design-card--ux">
              <div className="design-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <h3>UX/UI Interface Design</h3>
              <p className="design-card-desc">Crafting user-centric interfaces that balance stunning aesthetics with seamless functionality. We focus on conversion and user delight.</p>
              <div className="design-card-tags">
                <span>User Research</span>
                <span>Wireframing</span>
                <span>Prototyping</span>
              </div>
            </article>
            <article className="design-card design-card--brand">
              <div className="design-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>Brand Identity &amp; Logo</h3>
              <p className="design-card-desc">Building memorable brand signatures that speak volumes. From minimalist logos to comprehensive brand guidelines and voice.</p>
              <div className="design-card-tags">
                <span>Logo Suite</span>
                <span>Color Palette</span>
                <span>Typography</span>
              </div>
            </article>
            <article className="design-card design-card--illus">
              <div className="design-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                </svg>
              </div>
              <h3>Graphic Illustration</h3>
              <p className="design-card-desc">Custom artwork and isometric illustrations that give your brand a unique personality. Tailored assets for any digital or print media.</p>
              <div className="design-card-tags">
                <span>Vector Art</span>
                <span>Iconography</span>
                <span>Marketing Assets</span>
              </div>
            </article>
            <article className="design-card design-card--print">
              <div className="design-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <path d="M8 7h8M8 11h8" />
                </svg>
              </div>
              <h3>Printing &amp; Publication Services</h3>
              <p className="design-card-desc">High-end print solutions that bring your brand into the physical world. We handle everything from editorial layout to innovative packaging design.</p>
              <div className="design-card-tags">
                <span>Book Covers</span>
                <span>Brochures</span>
                <span>Business Cards</span>
                <span>Packaging Design</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section cta-callout design-cta" aria-label="Start your design journey">
        <div className="container">
          <div className="cta-panel design-cta-panel">
            <span className="design-cta-star" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" />
              </svg>
            </span>
            <h2 className="cta-title">Ready to start your<br /><span className="design-cta-accent">design journey</span>?</h2>
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
