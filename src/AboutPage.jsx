/**
 * AboutPage – About Us & Team
 * صفحة من نحن والفريق
 *
 * English: Company story, vision cards, team grid, and CTA.
 * العربية: قصة الشركة، بطاقات الرؤية، شبكة الفريق، وزر الحث على الإجراء.
 */
import aboutNotepadImg from './assets/about-notepad.png';
import aboutStoryImg from './assets/about-story.png';
import hossamImg from './assets/team/hossam.png';
import ammarImg from './assets/team/ammar.png';
import rahmaImg from './assets/team/rahma.png';

export default function AboutPage() {
  return (
    <div id="about" className="about-page">
      {/* Our Story: text left, notepad right / قصتنا: النص يسار، الدفتر يمين */}
      <section className="section about about-page-story">
        <div className="container">
          <h2 className="section-title">
            <span className="bullet"></span>About
          </h2>
          <div className="about-story-grid about-story-grid--notepad">
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
              <div className="about-media-card about-media-card--notepad about-media-card--mint">
                <div className="about-media-img" style={{ '--about-img': `url(${aboutNotepadImg})` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story – team photo left, Unified Force */}
      <section className="section about about-story-unified">
        <div className="container">
          <div className="about-story-grid about-story-grid--media-left">
            <div className="about-media" aria-hidden="true">
              <div className="about-media-card about-media-card--team about-media-card--caption-overlay">
                <div className="about-media-img" style={{ '--about-img': `url(${aboutStoryImg})` }} />
                <p className="about-media-caption">The birth of a unified force.</p>
              </div>
            </div>
            <div className="about-content">
              <p className="about-kicker">OUR STORY</p>
              <h2 className="about-heading">
                From Specialists to a <span className="vision-title">Unified Force.</span>
              </h2>
              <p className="about-lead">
                Born from the ambition of Egypt&apos;s brightest young minds, OCTA transitioned from a group of individual specialists into a powerhouse collective.
              </p>
              <p className="about-lead">
                We realized that while one freelancer can build a feature, a collective of elite masters can build an empire. We are a synergy of dedicated freelancers, each a master of our craft, coming together to deliver world-class digital solutions.
              </p>
              <div className="about-stats about-stats--unified">
                <div className="stat-card">
                  <div className="stat-number">5+</div>
                  <div className="stat-label">FREELANCERS</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">12+</div>
                  <div className="stat-label">PROJECTS DONE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="section about-vision" aria-label="Our vision">
        <div className="container">
          <p className="about-kicker about-kicker-center">OUR VISION</p>
          <h2 className="about-heading about-heading-center">
            Empowering the <span className="vision-title">Next Wave.</span>
          </h2>
          <div className="vision-grid">
            <div className="vision-card will-reveal reveal-up">
              <div className="vision-icon badge-it" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <h4>Global Integration</h4>
              <p>To bridge the gap between world-class Egyptian talent and global tech demands, ensuring our youth lead the digital frontier.</p>
            </div>
            <div className="vision-card will-reveal reveal-up">
              <div className="vision-icon badge-console" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V8h14v10z"/>
                </svg>
              </div>
              <h4>Technical Mastery</h4>
              <p>Continuous growth and specialization in emerging technologies like AI, Blockchain, and advanced Web Architectures.</p>
            </div>
            <div className="vision-card will-reveal reveal-up">
              <div className="vision-icon badge-design" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <h4>Community Spirit</h4>
              <p>Building a sustainable ecosystem for Egyptian freelancers to thrive, collaborate, and compete on the highest level.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="section team-v2" id="team" aria-label="Meet our team">
        <div className="container">
          <h2 className="section-title team-v2-title">
            <span className="bullet"></span>MEET OUR TEAM
          </h2>
          <p className="team-v2-subtitle">The minds behind the innovation at Octa</p>
          <div className="team-v2-grid">
            <div className="team-v2-card team-v2-card--photo will-reveal reveal-up">
              <img src={hossamImg} alt="Hossam Hassan" className="team-v2-img" loading="lazy" />
              <div className="team-v2-meta">
                <h3>Hossam Hassan</h3>
                <p className="team-v2-role">CO-FOUNDER &amp; CEO</p>
              </div>
            </div>
            <div className="team-v2-card team-v2-card--photo will-reveal reveal-up">
              <img src={ammarImg} alt="Ammar Tarek" className="team-v2-img" loading="lazy" />
              <div className="team-v2-meta">
                <h3>Ammar Tarek</h3>
                <p className="team-v2-role">SENIOR DESIGNER</p>
              </div>
            </div>
            <div className="team-v2-card team-v2-card--photo will-reveal reveal-up">
              <img src={rahmaImg} alt="Rahma Sameh" className="team-v2-img" loading="lazy" />
              <div className="team-v2-meta">
                <h3>Rahma Sameh</h3>
                <p className="team-v2-role">LEAD ARCHITECT</p>
              </div>
            </div>
            <a href="#partner" className="team-v2-card team-v2-card--join will-reveal reveal-up">
              <div className="team-join-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              <span className="team-join-text">Join OCTA</span>
              <span className="btn team-join-btn">Apply Now</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-callout" aria-label="Start a conversation">
        <div className="container">
          <div className="cta-panel will-reveal reveal-up">
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
    </div>
  );
}
