import { useEffect, useMemo, useState } from 'react';
import logImg from './assets/log-img.png';
import aboutStoryImg from './assets/about-story.png';
import teamHossam from './assets/team/hossam.png';
import teamAmmar from './assets/team/ammar.png';
import teamRahma from './assets/team/rahma.png';
import PartnerPage from './PartnerPage.jsx';

export default function App() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPartner, setShowPartner] = useState(false);
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
    const onHash = () => setShowPartner(window.location.hash === '#partner');
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
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showPartner]);

  useEffect(() => {
    if (showPartner) return;
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
  }, [showPartner]);

  useEffect(() => {
    // Arc stroke length variable
    const arcPath = document.querySelector('.arc path');
    if (arcPath && typeof arcPath.getTotalLength === 'function') {
      const length = Math.ceil(arcPath.getTotalLength());
      arcPath.style.setProperty('--arc-len', `${length}`);
    }

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
    addReveal('.team-v2-grid .team-v2-card', 'reveal-up', 90, 80);
    addReveal('.service-row', 'reveal-up', 120, 0);
    addReveal('.about p, .about-list li', 'reveal-up', 40, 0);
    addReveal('.social-row .social-icon', 'reveal-up', 60, 0);

    return () => revealObserver?.disconnect();
  }, []);

  // Force dark theme by default; no light theme behavior

  // No accent switching state/effects

  const onSubmitLead = (data) => {
    // Basic client-side submit (no popup)
    console.log('Lead submitted:', data);
  };

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <>
      {!showPartner && (
        <div className="scroll-progress" role="progressbar" aria-valuenow={Math.round(scrollProgress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
        </div>
      )}
      <header className={`site-header${isScrolled ? ' scrolled' : ''}`}>
        <div className="container header-inner">
          <a href="#" className="brand brand-flex" aria-label="Octa home">
            <img src={logImg} alt="Octa" className="brand-logo-img" />
          </a>
          <div className="header-actions">
            <nav className="nav">
              <a href="#" className={activeSection === 'home' ? 'active' : ''}>Home</a>
              <a href="#about" className={activeSection === 'about' ? 'active' : ''}>About</a>
              <a href="#services" className={activeSection === 'services' ? 'active' : ''}>Services</a>
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
      ) : (
      <main id="home">
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
                    <stop offset="0" stopColor="#ccff33" />
                    <stop offset="1" stopColor="#a3ff30" />
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

        <section className="section products">
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

        <section id="about" className="section about">
          <div className="container">
            <h2 className="section-title">
              <span className="bullet"></span>About
            </h2>
            <div className="about-story-grid">
              <div className="about-media" aria-hidden="true">
                <div className="about-media-card">
                  <div
                    className="about-media-img"
                    style={{ '--about-img': `url(${aboutStoryImg})` }}
                  />
                  <div className="about-media-caption">The birth of a unified force.</div>
                </div>
              </div>

              <div className="about-content">
                <p className="about-kicker">OUR STORY</p>
                <h3 className="about-heading">
                  From Specialists to a <span className="accent">Unified Force.</span>
                </h3>
                <p className="about-lead">
                  We unify specialists across IT, cloud, and design to deliver consistent outcomes—fast execution,
                  reliable support, and measurable impact.
                </p>
                <ul className="about-points">
                  <li>Consistent delivery with a single accountable team.</li>
                  <li>Clear communication, timelines, and transparent reporting.</li>
                  <li>Security-first mindset across every engagement.</li>
                </ul>

                <div className="about-stats">
                  <div className="stat-card">
                    <div className="stat-number">5+</div>
                    <div className="stat-label">Years experience</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">12+</div>
                    <div className="stat-label">Projects delivered</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-vision">
              <p className="about-kicker about-kicker-center">OUR VISION</p>
              <h3 className="about-heading about-heading-center">
                <span className="vision-highlight">Empowering the</span>{' '}
                <span className="vision-title">Next Wave.</span>
              </h3>
              <div className="vision-grid">
                <div className="vision-card">
                  <div className="vision-icon badge-it" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
                      <path
                        fill="currentColor"
                        d="M14.8 3.6c.5.1.8.6.7 1.1l-.4 1.7 3.2 3.2 1.7-.4c.5-.1 1 .2 1.1.7l.6 2.8c.1.4-.1.9-.5 1.1l-1.6.8a4 4 0 0 1-1.6 4.6l-1 .6-3.5-3.5-3.5-3.5.6-1A4 4 0 0 1 10 4.6l.8-1.6c.2-.4.7-.6 1.1-.5l2.9.6ZM8.8 12.2l3 3-3.6 4.8c-.2.3-.5.5-.9.5H4.5c-.6 0-1-.4-1-1v-2.8c0-.4.2-.7.5-.9l4.8-3.6Z"
                      />
                    </svg>
                  </div>
                  <h4>Global Integration</h4>
                  <p>
                    To bridge the gap between world-class Egyptian talent and global tech demands, ensuring our youth lead
                    the digital frontier.
                  </p>
                </div>
                <div className="vision-card">
                  <div className="vision-icon badge-console" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
                      <path
                        fill="currentColor"
                        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16h-4.2l.7 2H16a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h1.9l.7-2H6.5A2.5 2.5 0 0 1 4 13.5v-7Zm2.5-.5a.5.5 0 0 0-.5.5v7c0 .3.2.5.5.5h11a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-11Z"
                      />
                    </svg>
                  </div>
                  <h4>Technical Mastery</h4>
                  <p>
                    Continuous growth and specialization in emerging technologies like AI, Blockchain, and advanced Web
                    Architectures.
                  </p>
                </div>
                <div className="vision-card">
                  <div className="vision-icon badge-design" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
                      <path
                        fill="currentColor"
                        d="M16 11a4 4 0 0 1 4 4v4a1 1 0 1 1-2 0v-4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a1 1 0 1 1-2 0v-4a4 4 0 0 1 4-4h8Zm-4-8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
                      />
                    </svg>
                  </div>
                  <h4>Community Spirit</h4>
                  <p>
                    Building a sustainable ecosystem for Egyptian freelancers to thrive, collaborate, and compete on the
                    highest level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section team-v2" id="team">
          <div className="container">
            <div className="team-v2-panel">
              <h2 className="section-title team-v2-title">
                <span className="bullet"></span>MEET OUR TEAM
              </h2>
              <p className="team-v2-subtitle">The minds behind the innovation at Octa.</p>

              <div className="team-v2-grid">
                <article className="team-v2-card team-v2-card--photo">
                  <img className="team-v2-img" src={teamHossam} alt="Hossam Hassan" loading="lazy" />
                  <div className="team-v2-meta">
                    <h3>Hossam Hassan</h3>
                    <p className="team-v2-role">CEO FOUNDER &amp; IT MANAGER</p>
                  </div>
                </article>

                <article className="team-v2-card team-v2-card--photo">
                  <img className="team-v2-img" src={teamAmmar} alt="Ammar Tarek" loading="lazy" />
                  <div className="team-v2-meta">
                    <h3>Ammar Tarek</h3>
                    <p className="team-v2-role">CREATIVE DIRECTOR</p>
                  </div>
                </article>

                <article className="team-v2-card team-v2-card--photo">
                  <img className="team-v2-img" src={teamRahma} alt="Rahma Sameh" loading="lazy" />
                  <div className="team-v2-meta">
                    <h3>Rahma Sameh</h3>
                    <p className="team-v2-role">WEB DEVELOPER</p>
                  </div>
                </article>

                <article className="team-v2-card team-v2-card--join">
                  <div className="team-v2-plus" aria-hidden="true">+</div>
                  <h3>Join OCTA</h3>
                  <p className="team-v2-join-sub">Are you an elite freelancer?</p>
                  <a className="team-v2-apply" href="#contacts">
                    APPLY NOW
                  </a>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section services">
          <div className="container">
            <h2 className="section-title">
              <span className="bullet"></span>Services
            </h2>

            <div className="service-row">
              <div className="service-content">
                <h3>1. Helpdesk Support</h3>
                <p>
                  Helpdesk support is a service that provides technical assistance to customers or end users. It’s often
                  the first point of contact for users who need help with their computer systems, software, or other
                  technical issues. Customers can contact the helpdesk to report issues, request assistance with technical
                  problems, or ask questions about how to use a particular product or service.
                </p>
              </div>
              <div className="service-icon badge-it" aria-hidden="true">
                it
              </div>
            </div>

            <div className="service-row">
              <div className="service-content">
                <h3>2. Network and System Administration</h3>
                <p>
                  Network administrators design, implement, and maintain secure computer networks, configuring hardware
                  and software, managing user accounts and permissions, and monitoring/optimizing performance. System
                  administrators maintain servers, applications, and operating systems while enforcing security and
                  backup policies.
                </p>
              </div>
              <div className="service-icon badge-it" aria-hidden="true">
                it
              </div>
            </div>

            <div className="service-row">
              <div className="service-content">
                <h3>3. Cloud migration and management</h3>
                <p>
                  We assess, plan, and migrate applications and data from on‑prem environments to the cloud. Post‑migration
                  we handle cost optimization, visibility, security baselines, and reliability.
                </p>
              </div>
              <div className="service-icon badge-console" aria-hidden="true">
                console
              </div>
            </div>

            <div className="service-row">
              <div className="service-content">
                <h3>Cloud Console</h3>
                <p>
                  A centralized platform to manage, monitor, and optimize your cloud resources: role‑based access,
                  automation pipelines, observability, and cost control. Whether you’re deploying apps, managing
                  workloads, or analyzing data, Cloud Console simplifies operations while ensuring scalability and
                  security.
                </p>
              </div>
              <div className="service-icon badge-console" aria-hidden="true">
                console
              </div>
            </div>

            <div className="service-row">
              <div className="service-content">
                <h3>Octa Design</h3>
                <p>
                  We craft stunning and user‑friendly digital experiences tailored to your brand: websites, social media
                  graphics, logo ing, and brand identity systems. From landing pages to full brand refreshes, we turn ideas
                  into beautiful, practical interfaces.
                </p>
              </div>
              <div className="service-icon badge-design" aria-hidden="true">
                design
              </div>
            </div>

          </div>
        </section>

        <section id="contacts" className="section contacts form-section">
          <div className="container">
            <h2 className="section-title">
              <span className="bullet"></span>Contacts
            </h2>
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
      )}

      <footer className="site-footer">
        <div className="container footer-inner">
          <p className="footer-credit">
            © <span>{year}</span> Octa. Built by{' '}
            <a
              href="https://www.linkedin.com/in/rahma-sameh/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Rahma Sameh
            </a>{' '}
            · <a href="mailto:rahma.sameh@octamesh.co">rahma.sameh@octamesh.co</a>
          </p>
        </div>
      </footer>
    </>
  );
}
