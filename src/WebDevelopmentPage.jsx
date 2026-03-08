/**
 * WebDevelopmentPage – Web Dev Services
 * Hero, catalog (Apps, E‑commerce, API, Performance), and tech stack section.
 */
import { useEffect } from 'react';

// Tech stack content – edit here
const TECH_STACK = {
  title: 'Our Tech Stack',
  description: 'We leverage industry-leading technologies to build resilient applications that stand the test of time.',
  items: ['Node.js', 'Next.js', 'PostgreSQL', 'AWS / Vercel', 'Docker'],
  codeSnippet: {
    variable: 'project',
    properties: [
      { key: 'status', value: 'optimized' },
      { key: 'scalability', value: 'unlimited' },
      { key: 'delivery', value: 'on-time' },
    ],
    comment: 'Deploying to production...',
  },
};

export default function WebDevelopmentPage() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
        { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
      );
      document.querySelectorAll('.web-hero-text, .web-catalog-card, .web-tech-stack').forEach((el) => {
        el.classList.add('will-reveal', 'reveal-up');
        observer.observe(el);
      });
      return () => observer.disconnect();
    }
  }, []);

  return (
    <main className="web-dev-page">
      <section className="web-hero" aria-label="Web Development">
        <div className="web-hero-inner">
          <div className="web-hero-text">
            <h1 className="web-hero-title">
              <span className="web-bracket web-bracket-left" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square">
                  <path d="M 6 2 C 2 2 2 12 6 22" />
                </svg>
              </span>
              <span className="web-word">web</span>
              <span className="web-bracket web-bracket-right" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square">
                  <path d="M 18 2 C 22 2 22 12 18 22" />
                </svg>
              </span>
            </h1>
            <span className="web-pill">• ENGINEERING EXCELLENCE</span>
            <h2 className="web-hero-headline">
              Web <span className="web-accent">Development</span>
            </h2>
            <p className="web-hero-sub">
              We architect high-performance, scalable web solutions using modern stacks.
              <br />
              From complex enterprise applications to seamless API ecosystems, we build the future of the web.
            </p>
            <div className="web-hero-actions">
              <a href="#contacts" className="btn btn-primary web-order-btn">
                ORDER THIS SERVICE
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
              </a>
              <a href="#web-catalog" className="web-explore-link">
                Explore Sub-services
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="web-catalog" className="web-catalog">
        <div className="web-catalog-inner">
          <div className="web-catalog-grid">
            <article className="web-catalog-card">
              <div className="web-catalog-card-bg-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M9 21v-6h6v6" />
                </svg>
              </div>
              <div className="web-catalog-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="m22 6-10 7L2 6M12 13l10-7" />
                </svg>
              </div>
              <h3>Custom Web Applications</h3>
              <p className="web-catalog-desc">Tailored web applications built with modern frameworks. We deliver scalable, maintainable solutions that fit your business needs.</p>
              <div className="web-catalog-tags">
                <span>TYPESCRIPT</span>
                <span>MICROSERVICES</span>
                <span>EDGE RUNTIME</span>
              </div>
            </article>
            <article className="web-catalog-card">
              <div className="web-catalog-card-bg-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <div className="web-catalog-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <path d="M3 6h18M16 10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2" />
                </svg>
              </div>
              <h3>E-commerce Solutions</h3>
              <p className="web-catalog-desc">Full-featured online stores with secure payments, inventory management, and seamless customer experiences.</p>
              <div className="web-catalog-tags">
                <span>HEADLESS CMS</span>
                <span>STRIPE/ADYEN</span>
                <span>INVENTORY SYNC</span>
              </div>
            </article>
            <article className="web-catalog-card">
              <div className="web-catalog-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
              </div>
              <h3>API Integration</h3>
              <p className="web-catalog-desc">Connect your systems with robust APIs, webhooks, and authentication. GraphQL and REST solutions for seamless data flow.</p>
              <div className="web-catalog-tags">
                <span>GRAPHQL</span>
                <span>WEBHOOKS</span>
                <span>AUTH0/OAUTH</span>
              </div>
            </article>
            <article className="web-catalog-card">
              <div className="web-catalog-card-bg-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className="web-catalog-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3>Performance Optimization</h3>
              <p className="web-catalog-desc">Faster load times, better Core Web Vitals, and optimized assets. We ensure your site scores and converts at its best.</p>
              <div className="web-catalog-tags">
                <span>CORE WEB VITALS</span>
                <span>LIGHTHOUSE 100</span>
                <span>LAZY LOADING</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="web-tech-stack" aria-labelledby="tech-stack-heading">
        <div className="web-tech-stack-inner">
          <div className="web-tech-stack-content">
            <h2 id="tech-stack-heading" className="web-tech-stack-title">{TECH_STACK.title}</h2>
            <p className="web-tech-stack-desc">{TECH_STACK.description}</p>
            <ul className="web-tech-stack-list">
              {TECH_STACK.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="web-tech-stack-code" aria-hidden="true">
            <pre>
              <code>
                <span className="web-code-keyword">const</span> {TECH_STACK.codeSnippet.variable} = {'{'}<br />
                {TECH_STACK.codeSnippet.properties.map(({ key, value }, i) => (
                  <span key={key}>
                    {'  '}<span className="web-code-key">{key}</span>: <span className="web-code-string">'{value}'</span>{i < TECH_STACK.codeSnippet.properties.length - 1 ? ',' : ''}<br />
                  </span>
                ))}
                {'}'};<br />
                <span className="web-code-comment">// {TECH_STACK.codeSnippet.comment}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
