import { useEffect, useMemo, useState } from 'react';
import logImg from './assets/log-img.png';
import aboutNotepadImg from './assets/about-notepad.png';
import meetOurTeamImg from './assets/meet-our-team.png';
import PartnerPage from './PartnerPage.jsx';
import DesignPage from './DesignPage.jsx';
import WebDevelopmentPage from './WebDevelopmentPage.jsx';

export default function App() {
  const normalizePage = (hash) => {
    const h = String(hash || '').trim();
    const key = h.startsWith('#') ? h.slice(1) : h;
    const pageKey = key.toLowerCase();
    if (!pageKey || pageKey === 'home') return 'home';
    if (pageKey === 'partner') return 'partner';
    const allowed = new Set(['about', 'services', 'contacts', 'faqs', 'products', 'team', 'it-helpdesk', 'creative-design', 'web-development']);
    return allowed.has(pageKey) ? pageKey : 'home';
  };

  const year = useMemo(() => new Date().getFullYear(), []);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPartner, setShowPartner] = useState(false);
  const [page, setPage] = useState(() => normalizePage(window.location.hash));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState(() => {
    try {
      const saved = window.localStorage.getItem('octa_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'dark';
  });

  useEffect(() => {
    const onHash = () => {
      const nextPage = normalizePage(window.location.hash);
      setPage(nextPage);
      setShowPartner(nextPage === 'partner');
      if (nextPage !== 'home' && nextPage !== 'partner') setActiveSection((nextPage === 'creative-design' || nextPage === 'web-development') ? 'services' : nextPage);
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem('octa_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    // When switching page (including partner), scroll to top so content appears from the start.
    window.scrollTo({ top: 0, left: 0, behavior: page === 'home' ? 'auto' : 'smooth' });
  }, [page]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showPartner, page]);

  useEffect(() => {
    if (showPartner || page !== 'home') return;
    const sections = [
      { id: 'home', el: document.getElementById('home') },
      { id: 'about', el: document.getElementById('about') },
      { id: 'services', el: document.getElementById('services') },
      { id: 'contacts', el: document.getElementById('contacts') },
      { id: 'faqs', el: document.getElementById('faqs') },
    ].filter((s) => s.el);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || 'home');
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, [showPartner, page]);

  useEffect(() => {
    if (page !== 'services' && page !== 'contacts') return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelectorAll('.services-arc path, .contacts-arc path').forEach((path) => {
          if (path?.getTotalLength) path.style.setProperty('--arc-len', `${Math.ceil(path.getTotalLength())}`);
        });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [page]);

  useEffect(() => {
    const setArcLengths = () => {
      document.querySelectorAll('.arc path, .services-arc path, .contacts-arc path').forEach((path) => {
        if (path && typeof path.getTotalLength === 'function') {
          path.style.setProperty('--arc-len', `${Math.ceil(path.getTotalLength())}`);
        }
      });
    };
    setArcLengths();

    // Scroll-reveal animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let revealObserver = null;
    if (!prefersReducedMotion) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver?.unobserve(entry.target);
            }
          });
        },
        { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
      );
    }

    const addReveal = (selector, variant = 'reveal-up', stagger = 0, initialDelay = 0) => {
      const nodeList = document.querySelectorAll(selector);
      if (!nodeList) return;
      Array.from(nodeList).forEach((el, i) => {
        el.classList.add('will-reveal', variant);
        const delay = initialDelay + (stagger ? i * stagger : 0);
        if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
        if (prefersReducedMotion) {
          el.classList.add('is-visible');
        } else if (revealObserver) {
          revealObserver.observe(el);
        }
      });
    };

    addReveal('.arc-wrap', 'reveal-zoom', 0, 0);
    addReveal('.hero-title, .hero-sub', 'reveal-up', 80, 0);
    addReveal('.section-title', 'reveal-left', 80, 0);
    addReveal('.product-row .badge', 'reveal-up', 80, 100);
    addReveal('.team-v2-panel--image', 'reveal-up', 0, 0);
    addReveal('.services-arc-wrap, .services-hero-title, .services-hero-sub', 'reveal-up', 0, 0);
    addReveal('.service-card', 'reveal-up', 90, 0);
    addReveal('.cta-panel', 'reveal-up', 0, 0);
    addReveal('.about-media-card, .about-content, .about-points li', 'reveal-up', 70, 0);
    addReveal('.contacts-arc-wrap, .contacts-hero-title, .contacts-hero-sub', 'reveal-up', 0, 0);
    addReveal('.contact-form-card, .contact-card, .contact-map', 'reveal-up', 90, 0);
    addReveal('.social-row .social-icon', 'reveal-up', 60, 0);
    addReveal('.faq-item', 'reveal-up', 90, 0);

    return () => revealObserver?.disconnect();
  }, []);

  // Force dark theme by default; no light theme behavior

  // No accent switching state/effects

  const onSubmitLead = (data) => {
    // Basic client-side submit (no popup)
    console.log('Lead submitted:', data);
  };

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const isHomePage = page === 'home';
  const shouldShow = (id) => isHomePage || page === id;
  const isItHelpdeskPage = page === 'it-helpdesk';

  return (
    <>
      {isHomePage && !showPartner && (
        <div className="scroll-progress" role="progressbar" aria-valuenow={Math.round(scrollProgress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
        </div>
      )}
      <header className={`site-header${isScrolled ? ' scrolled' : ''}`}>
        <div className="container header-inner">
          <a href="#home" className="brand brand-flex" aria-label="Octa home">
            <img src={logImg} alt="Octa" className="brand-logo-img" />
          </a>
          <div className="header-actions">
            <nav className="nav">
              <a href="#home" className={activeSection === 'home' ? 'active' : ''}>Home</a>
              <a href="#about" className={activeSection === 'about' ? 'active' : ''}>About</a>
              <a href="#services" className={activeSection === 'services' || activeSection === 'it-helpdesk' || activeSection === 'creative-design' || activeSection === 'web-development' ? 'active' : ''}>Services</a>
              <a href="#contacts" className={activeSection === 'contacts' ? 'active' : ''}>Contacts</a>
              <a href="#faqs" className={activeSection === 'faqs' ? 'active' : ''}>FAQs</a>
            </nav>
          </div>
          <div className="header-right">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M21.64 13.65A8.1 8.1 0 0 1 10.35 2.36a.75.75 0 0 0-1-.9A9.75 9.75 0 1 0 22.54 14.7a.75.75 0 0 0-.9-1.05ZM12 20.25A8.25 8.25 0 0 1 8.08 4.76a9.6 9.6 0 0 0 11.16 11.16A8.22 8.22 0 0 1 12 20.25Z"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 18.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5Zm0-1.5a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5ZM12 2.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 2.5Zm0 16.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V20a.75.75 0 0 1 .75-.75ZM3.25 11.25h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5Zm16.5 0h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5ZM5.18 5.18a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L5.18 6.24a.75.75 0 0 1 0-1.06Zm11.52 11.52a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM18.82 5.18a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM7.3 16.7a.75.75 0 0 1 0 1.06L6.24 18.82a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0Z"
                  />
                </svg>
              )}
            </button>

            <a href="#partner" className="btn cta-partner">
              Become an Octa partner
            </a>
          </div>
        </div>
      </header>

      {showPartner ? (
        <div className="page-transition">
          <PartnerPage onSubmitLead={onSubmitLead} />
        </div>
      ) : page === 'creative-design' ? (
        <div className="page-transition">
          <DesignPage />
        </div>
      ) : page === 'web-development' ? (
        <div className="page-transition">
          <WebDevelopmentPage />
        </div>
      ) : (
      <main id="home">
        {isHomePage && (
        <section className="hero">
          <div className="container hero-inner">
            <div className="arc-wrap">
              <svg className="arc" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="arcG" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#a8ff2f" />
                    <stop offset="1" stopColor="#8be626" />
                  </linearGradient>
                </defs>
                <path
                  d="M 120 320 A 380 380 0 0 1 880 320"
                  stroke="url(#arcG)"
                  strokeWidth="18"
                  fill="none"
                  filter="url(#glow)"
                  strokeLinecap="round"
                />
              </svg>
              <div className="hero-text-inside-arc">
                <h1 className="hero-title">
              Always You Can<span className="dot"> .</span>
                </h1>
                <p className="hero-sub">
              Your Success Requires Sophisticated Technological Expertise. Don’t Be Held Back, Stay Competitive.
                </p>
              </div>
            </div>
          </div>
        </section>
        )}

        {shouldShow('products') && (
        <section id="products" className="section products">
          <div className="container">
            <h2 className="section-title">
              <span className="bullet"></span>Our products
            </h2>
            <div className="product-row">
              <div className="badge badge-it" title="it">
                it
              </div>
              <div className="badge badge-console" title="console">
                console
              </div>
              <div className="badge badge-design" title="design">
                design
              </div>
            </div>
          </div>
        </section>
        )}

        {shouldShow('team') && (
        <section className="section team-v2 team-v2-image" id="team">
          <div className="container">
            <div className="team-v2-panel team-v2-panel--image" aria-label="Meet our team">
              <img
                className="team-v2-image-img"
                src={meetOurTeamImg}
                alt="Meet our team"
                loading="lazy"
              />
            </div>
          </div>
        </section>
        )}

        {(isHomePage || page === 'team') && (
        <section className="section cta-callout" aria-label="Start a conversation">
          <div className="container">
            <div className="cta-panel">
              <h2 className="cta-title">Ready to Redefine Your Project?</h2>
              <p className="cta-subtitle">
                Harness the power of Egypt&apos;s finest freelancers. From specialized design to complex technical
                architecture, Always You Can with OCTA.
              </p>
              <a className="cta-button" href="#contacts">
                Start a Conversation
              </a>
            </div>
          </div>
        </section>
        )}

        {shouldShow('about') && (
        <section id="about" className="section about">
          <div className="container">
            <h2 className="section-title">
              <span className="bullet"></span>About
            </h2>
            <div className="about-story-grid">
              <div className="about-content">
                <p className="about-lead">
                  Welcome to our IT service company! We are a team of experienced professionals dedicated to providing top-quality IT support to small and mid-level businesses. Our team has a wide range of expertise, including network infrastructure, cloud services, network management, and light current. We are committed to staying up-to-date on the latest technologies and best practices, so that we can provide our clients with the most effective solutions for their needs.
                </p>
                <ol className="about-points about-points--numbered">
                  <li>Network design and deployment.</li>
                  <li>Cloud migration and management.</li>
                  <li>Security solutions.</li>
                  <li>Sound and VOIP solution.</li>
                  <li>IT support and maintenance.</li>
                  <li>Printing solutions.</li>
                </ol>
                <p className="about-lead">
                  We are passionate about helping our clients succeed and thrive in today&apos;s digital world. If you have any IT needs, don&apos;t hesitate to get in touch with us. We would be happy to discuss how we can support your business.
                </p>
                <a href="#about" className="btn btn-about-story">
                  Learn our story
                </a>
              </div>

              <div className="about-media" aria-hidden="true">
                <div className="about-media-card about-media-card--notepad">
                  <div className="about-media-img" style={{ '--about-img': `url(${aboutNotepadImg})` }} />
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {shouldShow('services') && (
        <section id="services" className="section services">
          {page === 'services' && (
            <div className="container services-hero">
              <div className="services-arc-wrap" aria-hidden="true">
                <svg className="services-arc" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <filter id="servicesGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="10" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="servicesArcG" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#a8ff2f" />
                      <stop offset="1" stopColor="#8be626" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 120 300 A 380 380 0 0 1 880 300"
                    stroke="url(#servicesArcG)"
                    strokeWidth="18"
                    fill="none"
                    filter="url(#servicesGlow)"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="services-hero-text">
                  <h1 className="services-hero-title">
                    Our <span className="accent">Services</span>.
                  </h1>
                  <p className="services-hero-sub">
                    Ready to elevate your digital presence? Reach out to our team of experts for sophisticated technological
                    expertise and design.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="container">
            <h2 className="section-title">
              <span className="bullet"></span>Services
            </h2>
            <div className="services-grid">
              <a href="#it-helpdesk" className="service-card service-card-link">
                <div className="service-card-icon service-card-icon--it" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      fill="currentColor"
                      d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16h-4.2l.7 2H16a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h1.9l.7-2H6.5A2.5 2.5 0 0 1 4 13.5v-7Z"
                    />
                  </svg>
                </div>
                <h3>IT Infrastructure &amp; Helpdesk</h3>
                <ul className="service-card-list">
                  <li><span className="service-bullet service-bullet--it" aria-hidden="true" />Cloud Management</li>
                  <li><span className="service-bullet service-bullet--it" aria-hidden="true" />Security Service</li>
                  <li><span className="service-bullet service-bullet--it" aria-hidden="true" />Manage Microsoft Azure Services</li>
                  <li><span className="service-bullet service-bullet--it" aria-hidden="true" />Monitoring Service</li>
                </ul>
              </a>

              <a href="#creative-design" className="service-card service-card-link">
                <div className="service-card-icon service-card-icon--design" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 2-2c0-.5-.2-1-.6-1.4-.3-.3-.4-.7-.3-1.1.1-.4.5-.7.9-.7h2.2A4.8 4.8 0 0 0 21 12.2C21 6.6 16.5 2 12 2Z"
                    />
                  </svg>
                </div>
                <h3>Creative Design Services</h3>
                <ul className="service-card-list">
                  <li><span className="service-bullet service-bullet--design" aria-hidden="true" />UX/UI Interface Design</li>
                  <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Brand Identity &amp; Logo</li>
                  <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Graphic Illustration</li>
                  <li><span className="service-bullet service-bullet--design" aria-hidden="true" />Printing Services</li>
                </ul>
              </a>

              <a href="#web-development" className="service-card service-card-link">
                <div className="service-card-icon service-card-icon--web" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      fill="currentColor"
                      d="M8.7 17.3a1 1 0 0 1 0-1.4L12.6 12 8.7 8.1a1 1 0 0 1 1.4-1.4l4.6 4.6a1 1 0 0 1 0 1.4l-4.6 4.6a1 1 0 0 1-1.4 0Z"
                    />
                  </svg>
                </div>
                <h3>Web Development</h3>
                <ul className="service-card-list">
                  <li><span className="service-bullet service-bullet--web" aria-hidden="true" />Custom Web Applications</li>
                  <li><span className="service-bullet service-bullet--web" aria-hidden="true" />E-commerce Solutions</li>
                  <li><span className="service-bullet service-bullet--web" aria-hidden="true" />API Integration</li>
                  <li><span className="service-bullet service-bullet--web" aria-hidden="true" />Performance Optimization</li>
                </ul>
              </a>
            </div>
          </div>
        </section>
        )}

        {shouldShow('contacts') && (
        <section id="contacts" className="section contacts form-section">
          {page === 'contacts' && (
            <div className="container contacts-hero">
              <div className="contacts-arc-wrap" aria-hidden="true">
                <svg className="contacts-arc" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <filter id="contactsGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="10" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="contactsArcG" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#a8ff2f" />
                      <stop offset="1" stopColor="#8be626" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 120 300 A 380 380 0 0 1 880 300"
                    stroke="url(#contactsArcG)"
                    strokeWidth="18"
                    fill="none"
                    filter="url(#contactsGlow)"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="contacts-hero-text">
                  <h1 className="contacts-hero-title">
                    Let&apos;s <span className="accent">Connect</span>.
                  </h1>
                  <p className="contacts-hero-sub">
                    Ready to elevate your digital presence? Reach out to our team of experts for sophisticated technological
                    expertise and design.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="container">
            <div className="contacts-grid">
              <div className="team-v2-panel contact-form-card">
                <h2 className="contact-form-title">
                  <span className="bullet"></span>Send us a message
                </h2>
                <form
                  className="contact-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    onSubmitLead(Object.fromEntries(fd.entries()));
                    e.currentTarget.reset();
                  }}
                >
                  <div className="contact-form-row">
                    <div className="field">
                      <label htmlFor="contact_name">Your Name</label>
                      <input id="contact_name" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="field">
                      <label htmlFor="contact_email">Email Address</label>
                      <input id="contact_email" name="email" type="email" placeholder="john@example.com" required />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="contact_subject">Subject</label>
                    <select id="contact_subject" name="subject" defaultValue="IT Consultation">
                      <option>IT Consultation</option>
                      <option>Web Development</option>
                      <option>Design</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="contact_message">Message</label>
                    <textarea id="contact_message" name="message" rows={4} placeholder="Tell us about your project..." required />
                  </div>

                  <button type="submit" className="btn btn-submit btn-primary contact-submit">
                    Send Message
                  </button>
                </form>
              </div>

              <div className="contact-right">
                <div className="contact-cards">
                  <a className="contact-card" href="https://wa.me/201020300393" target="_blank" rel="noopener noreferrer">
                    <span className="contact-card-icon contact-card-icon--wa" aria-hidden="true">✆</span>
                    <span className="contact-card-kicker">WHATSAPP</span>
                    <span className="contact-card-value">+20 10 20300393</span>
                  </a>
                  <a className="contact-card" href="tel:+201020300393">
                    <span className="contact-card-icon contact-card-icon--phone" aria-hidden="true">☎</span>
                    <span className="contact-card-kicker">PHONE</span>
                    <span className="contact-card-value">+20 10 20300393</span>
                  </a>
                  <a className="contact-card" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <span className="contact-card-icon contact-card-icon--fb" aria-hidden="true">◎</span>
                    <span className="contact-card-kicker">FACEBOOK</span>
                    <span className="contact-card-value">Octa.mesh</span>
                  </a>
                  <a className="contact-card" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <span className="contact-card-icon contact-card-icon--in" aria-hidden="true">in</span>
                    <span className="contact-card-kicker">LINKEDIN</span>
                    <span className="contact-card-value">OCTA MESH</span>
                  </a>
                </div>

                <div className="team-v2-panel contact-map">
                  <div className="contact-map-inner" aria-label="Location map">
                    <div className="contact-map-chip">
                      <div className="contact-map-pin" aria-hidden="true" />
                      <div className="contact-map-chip-text">
                        <div className="contact-map-chip-title">Tech District</div>
                        <div className="contact-map-chip-sub">CAIRO, DOKKI, EG 72241</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {shouldShow('faqs') && (
        <section id="faqs" className="section faqs">
          <div className="container">
            <div className="team-v2-panel faq-panel" aria-label="FAQs">
              <h2 className="section-title">
                <span className="bullet"></span>FAQs
              </h2>
              <div className="faq-list">
                <details className="faq-item">
                  <summary>How do I contact Octa?</summary>
                  <p>Use the Contacts section to reach us by email, phone, or WhatsApp.</p>
                </details>
                <details className="faq-item">
                  <summary>Do you work with small and mid-level businesses?</summary>
                  <p>Yes. We support teams of different sizes with IT, cloud, and design services.</p>
                </details>
                <details className="faq-item">
                  <summary>Can I become an Octa partner?</summary>
                  <p>Yes—click “Become an Octa partner” in the header to open the partner page.</p>
                </details>
              </div>
            </div>
          </div>
        </section>
        )}

        {isItHelpdeskPage && (
        <section id="it-helpdesk" className="section it-helpdesk-page">
          <div className="container">
            <div className="it-helpdesk-hero">
              <div className="it-helpdesk-hero-icon" aria-hidden="true">
                <span className="it-helpdesk-i">I</span>
                <span className="it-helpdesk-t">T</span>
              </div>
              <h1 className="it-helpdesk-title">IT Infrastructure &amp; Helpdesk</h1>
              <p className="it-helpdesk-subtitle">
                Reliable, scalable, and secure technology foundations designed to empower your enterprise growth and maintain operational continuity.
              </p>
              <div className="it-helpdesk-ctas">
                <a href="#contacts" className="btn-it-order">
                  ORDER THIS SERVICE
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </a>
                <button type="button" className="it-helpdesk-explore" onClick={() => window.location.hash = '#services'}>
                  Explore Sub-services
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="it-helpdesk-list">
              <article className="it-helpdesk-block">
                <div className="it-helpdesk-block-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96Z" /></svg>
                </div>
                <h3>Cloud Management</h3>
                <p>We architect and manage robust cloud environments tailored to your specific needs. From AWS to Azure solutions—our team ensures seamless migration, cost optimization, and high-performance scalability that evolves alongside your business demands.</p>
              </article>
              <article className="it-helpdesk-block">
                <div className="it-helpdesk-block-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" /></svg>
                </div>
                <h3>Security Service</h3>
                <p>Our proactive security approach protects your critical assets. We implement advanced firewalls, intrusion detection systems, and end-to-end encryption to safeguard your data against evolving cyber threats, ensuring compliance and peace of mind.</p>
              </article>
              <article className="it-helpdesk-block">
                <div className="it-helpdesk-block-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.65.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .32.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" /></svg>
                </div>
                <h3>Manage Microsoft Azure Services</h3>
                <p>Downtime isn&apos;t an option. Our dedicated helpdesk team provides around-the-clock support to resolve technical issues instantly. Whether it&apos;s hardware troubleshooting or software integration, we are your reliable partner in maintaining workflow efficiency.</p>
              </article>
              <article className="it-helpdesk-block">
                <div className="it-helpdesk-block-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M3.5 18.5L9.5 12.5l4 4L20.5 7v11H3.5z" /></svg>
                </div>
                <h3>Monitoring Service</h3>
                <p>Proactive monitoring and regular updates keep your servers running at peak performance. We handle patching, performance tuning, and backup management so your infrastructure remains stable, fast, and resilient under heavy workloads.</p>
              </article>
            </div>

            <div className="it-helpdesk-order-row">
              <a href="#contacts" className="btn-it-order">
                ORDER THIS SERVICE
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </a>
              <p className="it-helpdesk-assist">Need assistance? Talk to our team.</p>
            </div>

            <div className="it-helpdesk-custom-strip">
              <p className="it-helpdesk-custom-title">Need a custom enterprise solution?</p>
              <a href="#contacts" className="btn-it-expert">Talk to an Expert</a>
            </div>
          </div>
        </section>
        )}
      </main>
      )}

      <footer className="site-footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <a href="#home" className="footer-logo" aria-label="Octa home">
              <img src={logImg} alt="Octa" className="footer-logo-img" />
            </a>
            <p className="footer-tagline">
              Sophisticated technological expertise.
              <br />
              Don&apos;t be held back, stay competitive.
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Products</h3>
            <ul className="footer-list">
              <li>
                <span className="footer-dot footer-dot--it" aria-hidden="true" /> it
              </li>
              <li>
                <span className="footer-dot footer-dot--web" aria-hidden="true" /> web development
              </li>
              <li>
                <span className="footer-dot footer-dot--design" aria-hidden="true" /> design
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-list footer-links">
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#contacts">Contacts</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Follow Us</h3>
            <div className="footer-social">
              <a
                className="footer-social-btn"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M15 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7H9v-7a6 6 0 0 1 6-6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" />
                  <circle cx="4" cy="4" r="2" fill="currentColor" />
                </svg>
              </a>
              <a className="footer-social-btn" href="mailto:info@octamesh.co" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 4h16v16H4V4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m4 7 8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                className="footer-social-btn"
                href="https://github.com/D0NG0L"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <p className="footer-copyright">© {year} GFX Designs. All rights reserved.</p>
          <p className="footer-developer">Built by <a href="https://www.linkedin.com/in/rahma-sameh" target="_blank" rel="noopener noreferrer" className="footer-dev-link">Rahma Sameh</a> · <a href="mailto:rahma.sameh@octamesh.co" className="footer-dev-link">rahma.sameh@octamesh.co</a> · <a href="https://github.com/D0NG0L" target="_blank" rel="noopener noreferrer" className="footer-dev-link">GitHub</a></p>
        </div>
      </footer>
    </>
  );
}
