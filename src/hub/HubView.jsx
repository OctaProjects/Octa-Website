import { useMemo, useState } from 'react';
import logImg from '../assets/log-img.png';
import EmployeeHubAdminPanel from '../EmployeeHubAdminPanel.jsx';
import { HUB_SORT_OPTIONS } from './constants.js';
import { formatTimeAgo } from './formatTimeAgo.js';
import { groupBookmarksByCategory } from './groupBookmarks.js';
import { useEmployeeHubData } from './useEmployeeHubData.js';

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

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'resources', label: 'Resources', icon: 'resources' },
  { id: 'announcements', label: 'Announcements', icon: 'announcements' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

function NavIcon({ name }) {
  if (name === 'dashboard') {
    return <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />;
  }
  if (name === 'resources') {
    return <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />;
  }
  if (name === 'announcements') {
    return (
      <>
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }
  if (name === 'settings') {
    return (
      <>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }
  return (
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
  );
}

function HubSidebar({ activeNav, onNavChange, isAdmin, onLogout }) {
  return (
    <aside className="hub-sidebar">
      <nav className="hub-nav" aria-label="Employee Hub">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`hub-nav-item${activeNav === item.id ? ' is-active' : ''}`}
            onClick={() => onNavChange(item.id)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <NavIcon name={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
        {isAdmin ? (
          <button
            type="button"
            className={`hub-nav-item hub-nav-item--admin${activeNav === 'admin' ? ' is-active' : ''}`}
            onClick={() => onNavChange('admin')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <NavIcon name="admin" />
            </svg>
            Admin
          </button>
        ) : null}
      </nav>
      <button type="button" className="hub-logout" onClick={onLogout}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Logout
      </button>
    </aside>
  );
}

function HubTopbar({ displayName, deptLabel, isAdmin }) {
  const initial = displayName.charAt(0).toUpperCase();
  return (
    <header className="hub-topbar">
      <div className="hub-topbar-brand">
        <img src={logImg} alt="" className="hub-topbar-logo" />
        <span className="hub-topbar-title">Employee Hub</span>
      </div>
      <div className="hub-topbar-user">
        <button type="button" className="hub-bell" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" stroke="currentColor" strokeWidth="2" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="hub-user-meta">
          <span className="hub-user-name">
            {displayName}
            {isAdmin ? ' Administrator' : ''}
          </span>
          <span className="hub-user-dept">{deptLabel}</span>
        </div>
        <div className="hub-avatar" aria-hidden="true">{initial}</div>
      </div>
    </header>
  );
}

function HubToolbar({ search, onSearchChange, sort, onSortChange, displayName, roleLabel }) {
  const initial = displayName.charAt(0).toUpperCase();
  return (
    <div className="hub-toolbar">
      <div className="hub-toolbar-left">
        <div className="hub-search-wrap">
          <svg className="hub-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className="hub-search"
            placeholder="Search resources, tools, or documents..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <select className="hub-sort" value={sort} onChange={(e) => onSortChange(e.target.value)} aria-label="Sort resources">
          {HUB_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="hub-welcome-card">
        <div className="hub-avatar hub-avatar--lg" aria-hidden="true">{initial}</div>
        <div>
          <p className="hub-welcome-line">Welcome back, <strong>{displayName}</strong></p>
          <p className="hub-welcome-role">{roleLabel}</p>
        </div>
      </div>
    </div>
  );
}

function HubAnnouncementsSection({ announcements, showViewAll, onViewAll }) {
  return (
    <section className="hub-section">
      <div className="hub-section-head">
        <h2 className="hub-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" stroke="currentColor" strokeWidth="2" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Internal Announcements
        </h2>
        {showViewAll ? (
          <button type="button" className="hub-link" onClick={onViewAll}>View All</button>
        ) : null}
      </div>
      <div className="hub-announce-grid">
        {announcements.map((item) => (
          <article key={item.id} className="hub-announce-card">
            <div className="hub-announce-meta">
              <span className={`hub-tag ${item.tagClass}`}>{item.tag}</span>
              <span className="hub-announce-time">{formatTimeAgo(item.publishedAt)}</span>
            </div>
            <h3 className="hub-announce-title">{item.title}</h3>
            <p className="hub-announce-excerpt">{item.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HubResourcesSection({ groupedResources }) {
  return (
    <section className="hub-section">
      <div className="hub-section-head">
        <h2 className="hub-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          </svg>
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
  );
}

function HubSettingsSection({ user }) {
  return (
    <section className="hub-section hub-section--plain">
      <h2 className="hub-section-title">Settings</h2>
      <p className="hub-muted">Account: {user?.email}</p>
      <p className="hub-muted">Role: {user?.role}</p>
    </section>
  );
}

export default function HubView() {
  const hub = useEmployeeHubData();
  const [activeNav, setActiveNav] = useState('dashboard');

  const groupedResources = useMemo(
    () => groupBookmarksByCategory(hub.bookmarks),
    [hub.bookmarks],
  );

  const displayName = hub.user?.name || hub.user?.email?.split('@')[0] || 'Employee';
  const roleLabel = hub.user?.role === 'ADMIN' ? 'System Administrator' : 'Employee';
  const deptLabel = hub.user?.role === 'ADMIN' ? 'IT Dept' : 'Operations';

  if (hub.loading) {
    return (
      <div className="hub-layout hub-layout--loading">
        <p className="hub-loading">Loading Employee Hub…</p>
      </div>
    );
  }

  const showAnnouncements = activeNav === 'dashboard' || activeNav === 'announcements';
  const showResources = activeNav === 'dashboard' || activeNav === 'resources';

  return (
    <div className="hub-layout">
      <HubSidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        isAdmin={hub.isAdmin}
        onLogout={hub.logout}
      />

      <div className="hub-main">
        <HubTopbar displayName={displayName} deptLabel={deptLabel} isAdmin={hub.isAdmin} />

        <div className="hub-content">
          {activeNav !== 'admin' ? (
            <HubToolbar
              search={hub.search}
              onSearchChange={hub.setSearch}
              sort={hub.sort}
              onSortChange={hub.setSort}
              displayName={displayName}
              roleLabel={roleLabel}
            />
          ) : null}

          {activeNav === 'admin' && hub.isAdmin ? (
            <EmployeeHubAdminPanel
              currentUserId={hub.user?.id}
              onDataChange={hub.refreshHubData}
            />
          ) : null}

          {showAnnouncements ? (
            <HubAnnouncementsSection
              announcements={hub.announcements}
              showViewAll={activeNav === 'dashboard'}
              onViewAll={() => setActiveNav('announcements')}
            />
          ) : null}

          {showResources ? (
            <HubResourcesSection groupedResources={groupedResources} />
          ) : null}

          {activeNav === 'settings' ? (
            <HubSettingsSection user={hub.user} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
