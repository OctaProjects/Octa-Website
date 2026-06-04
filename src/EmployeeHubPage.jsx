import { useCallback, useEffect, useMemo, useState } from 'react';
import logImg from './assets/log-img.png';
import EmployeeHubAdminPanel from './EmployeeHubAdminPanel.jsx';
import { formatTimeAgo } from './hubUtils.js';

const FALLBACK_ANNOUNCEMENTS = [
  {
    id: '1',
    tag: 'System Update',
    tagClass: 'hub-tag--green',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    title: 'Planned Maintenance: VDI Environments',
    excerpt: 'Scheduled maintenance for virtual desktop infrastructure will occur tonight from 11 PM to 2 AM. Please save your work.',
  },
  {
    id: '2',
    tag: 'Company News',
    tagClass: 'hub-tag--blue',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    title: 'Q3 Townhall Recording Available',
    excerpt: 'The recording of the quarterly townhall meeting is now available on the internal portal for all employees.',
  },
  {
    id: '3',
    tag: 'Security',
    tagClass: 'hub-tag--orange',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Mandatory Security Training',
    excerpt: 'All employees must complete the annual security awareness training module by the end of this month.',
  },
];

const FALLBACK_BOOKMARKS = [
  { id: 'z1', title: 'Zoho Mail', description: 'Corporate email access', url: 'https://mail.zoho.com', category: { name: 'ZOHO SUITE', sortOrder: 0 } },
  { id: 'z2', title: 'Zoho Desk', description: 'IT support ticketing', url: 'https://desk.zoho.com', category: { name: 'ZOHO SUITE', sortOrder: 0 } },
  { id: 'z3', title: 'Zoho Assist', description: 'Remote support sessions', url: 'https://assist.zoho.com', category: { name: 'ZOHO SUITE', sortOrder: 0 } },
  { id: 'c1', title: 'Atlassian', description: 'Knowledge base & wiki', url: '#', category: { name: 'CONFLUENCE', sortOrder: 1 } },
  { id: 'm1', title: 'Admin Center', description: 'User management portal', url: '#', category: { name: 'MICROSOFT SUITE', sortOrder: 2 } },
  { id: 'm2', title: 'Azure Portal', description: 'Cloud infrastructure', url: '#', category: { name: 'MICROSOFT SUITE', sortOrder: 2 } },
  { id: 'm3', title: 'VDI Access', description: 'Virtual desktop login', url: '#', category: { name: 'MICROSOFT SUITE', sortOrder: 2 } },
];

function BookmarkIcon() {
  return (
    <span className="hub-resource-icon" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function EmployeeHubPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('updatedAt_desc');
  const [bookmarks, setBookmarks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [hubNav, setHubNav] = useState('dashboard');
  const [dataVersion, setDataVersion] = useState(0);
  const isAdmin = user?.role === 'ADMIN';

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) {
        window.location.hash = '#employees-login';
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch {
      window.location.hash = '#employees-login';
      return null;
    }
  }, []);

  const loadBookmarks = useCallback(async (query, sortKey) => {
    const params = new URLSearchParams({ sort: sortKey });
    if (query.trim()) params.set('q', query.trim());
    const res = await fetch(`/api/bookmarks?${params}`, { credentials: 'include' });
    if (!res.ok) return FALLBACK_BOOKMARKS;
    const data = await res.json();
    return data.items?.length ? data.items : FALLBACK_BOOKMARKS;
  }, []);

  const loadAnnouncements = useCallback(async () => {
    try {
      const res = await fetch('/api/announcements?limit=12', { credentials: 'include' });
      if (!res.ok) return FALLBACK_ANNOUNCEMENTS;
      const data = await res.json();
      return data.items?.length ? data.items : FALLBACK_ANNOUNCEMENTS;
    } catch {
      return FALLBACK_ANNOUNCEMENTS;
    }
  }, []);

  const refreshHubData = useCallback(() => {
    setDataVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const u = await loadSession();
      if (cancelled) return;
      if (!u) return;
      setUser(u);
      const [items, ann] = await Promise.all([loadBookmarks('', sort), loadAnnouncements()]);
      if (!cancelled) {
        setBookmarks(items);
        setAnnouncements(ann);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadSession, loadBookmarks, loadAnnouncements, sort, dataVersion]);

  useEffect(() => {
    if (!user) return;
    const t = setTimeout(async () => {
      const items = await loadBookmarks(search, sort);
      setBookmarks(items);
    }, 280);
    return () => clearTimeout(t);
  }, [search, sort, user, loadBookmarks, dataVersion]);

  useEffect(() => {
    if (!user) return;
    loadAnnouncements().then(setAnnouncements);
  }, [user, loadAnnouncements, dataVersion]);

  const groupedResources = useMemo(() => {
    const map = new Map();
    for (const b of bookmarks) {
      const name = b.category?.name || 'OTHER';
      if (!map.has(name)) map.set(name, []);
      map.get(name).push(b);
    }
    return [...map.entries()].sort((a, b) => {
      const ao = a[1][0]?.category?.sortOrder ?? 99;
      const bo = b[1][0]?.category?.sortOrder ?? 99;
      return ao - bo;
    });
  }, [bookmarks]);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Employee';
  const roleLabel = user?.role === 'ADMIN' ? 'System Administrator' : 'Employee';
  const deptLabel = user?.role === 'ADMIN' ? 'IT Dept' : 'Operations';

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.hash = '#employees-login';
  };

  if (loading) {
    return (
      <div className="hub-layout hub-layout--loading">
        <p className="hub-loading">Loading Employee Hub…</p>
      </div>
    );
  }

  return (
    <div className="hub-layout">
      <aside className="hub-sidebar">
        <nav className="hub-nav" aria-label="Employee Hub">
          <button type="button" className={`hub-nav-item${hubNav === 'dashboard' ? ' is-active' : ''}`} onClick={() => setHubNav('dashboard')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
            Dashboard
          </button>
          <button type="button" className={`hub-nav-item${hubNav === 'resources' ? ' is-active' : ''}`} onClick={() => setHubNav('resources')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Resources
          </button>
          <button type="button" className={`hub-nav-item${hubNav === 'announcements' ? ' is-active' : ''}`} onClick={() => setHubNav('announcements')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Announcements
          </button>
          <button type="button" className={`hub-nav-item${hubNav === 'settings' ? ' is-active' : ''}`} onClick={() => setHubNav('settings')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Settings
          </button>
          {isAdmin ? (
            <button type="button" className={`hub-nav-item hub-nav-item--admin${hubNav === 'admin' ? ' is-active' : ''}`} onClick={() => setHubNav('admin')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" strokeWidth="2"/></svg>
              Admin
            </button>
          ) : null}
        </nav>
        <button type="button" className="hub-logout" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Logout
        </button>
      </aside>

      <div className="hub-main">
        <header className="hub-topbar">
          <div className="hub-topbar-brand">
            <img src={logImg} alt="" className="hub-topbar-logo" />
            <span className="hub-topbar-title">Employee Hub</span>
          </div>
          <div className="hub-topbar-user">
            <button type="button" className="hub-bell" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" stroke="currentColor" strokeWidth="2"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div className="hub-user-meta">
              <span className="hub-user-name">{displayName} {user?.role === 'ADMIN' ? 'Administrator' : ''}</span>
              <span className="hub-user-dept">{deptLabel}</span>
            </div>
            <div className="hub-avatar" aria-hidden="true">{displayName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <div className="hub-content">
          {hubNav !== 'admin' ? (
          <div className="hub-toolbar">
            <div className="hub-toolbar-left">
              <div className="hub-search-wrap">
                <svg className="hub-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="search"
                  className="hub-search"
                  placeholder="Search resources, tools, or documents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select className="hub-sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort resources">
                <option value="updatedAt_desc">Recently updated</option>
                <option value="name_asc">Name (A–Z)</option>
                <option value="name_desc">Name (Z–A)</option>
                <option value="createdAt_desc">Newest</option>
              </select>
            </div>
            <div className="hub-welcome-card">
              <div className="hub-avatar hub-avatar--lg" aria-hidden="true">{displayName.charAt(0).toUpperCase()}</div>
              <div>
                <p className="hub-welcome-line">Welcome back, <strong>{displayName}</strong></p>
                <p className="hub-welcome-role">{roleLabel}</p>
              </div>
            </div>
          </div>
          ) : null}

          {hubNav === 'admin' && isAdmin ? (
            <EmployeeHubAdminPanel onDataChange={refreshHubData} />
          ) : null}

          {(hubNav === 'dashboard' || hubNav === 'announcements') && (
            <section className="hub-section">
              <div className="hub-section-head">
                <h2 className="hub-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" stroke="currentColor" strokeWidth="2"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  Internal Announcements
                </h2>
                {hubNav === 'dashboard' ? (
                  <button type="button" className="hub-link" onClick={() => setHubNav('announcements')}>View All</button>
                ) : null}
              </div>
              <div className="hub-announce-grid">
                {announcements.map((a) => (
                  <article key={a.id} className="hub-announce-card">
                    <div className="hub-announce-meta">
                      <span className={`hub-tag ${a.tagClass}`}>{a.tag}</span>
                      <span className="hub-announce-time">{formatTimeAgo(a.publishedAt)}</span>
                    </div>
                    <h3 className="hub-announce-title">{a.title}</h3>
                    <p className="hub-announce-excerpt">{a.excerpt}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(hubNav === 'dashboard' || hubNav === 'resources') && (
            <section className="hub-section">
              <div className="hub-section-head">
                <h2 className="hub-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>
                  Quick Access Resources
                </h2>
              </div>
              <div className="hub-resources-grid">
                {groupedResources.map(([categoryName, items]) => (
                  <div key={categoryName} className="hub-resource-col">
                    <h3 className="hub-resource-cat">{categoryName}</h3>
                    <ul className="hub-resource-list">
                      {items.map((item) => (
                        <li key={item.id}>
                          <a href={item.url} className="hub-resource-card" target="_blank" rel="noopener noreferrer">
                            <BookmarkIcon />
                            <span className="hub-resource-text">
                              <span className="hub-resource-title">{item.title}</span>
                              <span className="hub-resource-desc">{item.description || item.url}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {hubNav === 'settings' && (
            <section className="hub-section hub-section--plain">
              <h2 className="hub-section-title">Settings</h2>
              <p className="hub-muted">Account: {user?.email}</p>
              <p className="hub-muted">Role: {user?.role}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
