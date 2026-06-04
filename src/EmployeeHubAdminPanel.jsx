import { useCallback, useEffect, useState } from 'react';
import { ANNOUNCEMENT_TAG_PRESETS, formatTimeAgo } from './hubUtils.js';

const emptyBookmark = { title: '', url: '', description: '', categoryId: '', isActive: true };
const emptyAnnouncement = { title: '', excerpt: '', tag: 'System Update', tagClass: 'hub-tag--green', isActive: true };

async function api(path, options = {}) {
  const res = await fetch(path, { credentials: 'include', ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'request_failed');
  return data;
}

export default function EmployeeHubAdminPanel({ onDataChange }) {
  const [tab, setTab] = useState('bookmarks');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookmarkForm, setBookmarkForm] = useState(emptyBookmark);
  const [editingBookmarkId, setEditingBookmarkId] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncement);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);

  const loadAll = useCallback(async () => {
    const [bm, ann, lg, cats] = await Promise.all([
      api('/api/admin/bookmarks'),
      api('/api/admin/announcements'),
      api('/api/admin/logs?limit=80'),
      api('/api/categories'),
    ]);
    setBookmarks(bm.items || []);
    setAnnouncements(ann.items || []);
    setLogs(lg.items || []);
    setCategories(cats.items || []);
  }, []);

  useEffect(() => {
    loadAll().catch(() => setError('Could not load admin data.'));
  }, [loadAll]);

  const notifyParent = () => onDataChange?.();

  const runAction = async (fn) => {
    setError('');
    setBusy(true);
    try {
      await fn();
      await loadAll();
      notifyParent();
    } catch (e) {
      setError(e.message || 'Action failed.');
    } finally {
      setBusy(false);
    }
  };

  const saveBookmark = (e) => {
    e.preventDefault();
    const body = {
      title: bookmarkForm.title,
      url: bookmarkForm.url,
      description: bookmarkForm.description || null,
      categoryId: bookmarkForm.categoryId || null,
      isActive: bookmarkForm.isActive !== false,
    };
    runAction(async () => {
      if (editingBookmarkId) {
        await api(`/api/admin/bookmarks/${editingBookmarkId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        await api('/api/admin/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      setBookmarkForm(emptyBookmark);
      setEditingBookmarkId(null);
    });
  };

  const editBookmark = (item) => {
    setEditingBookmarkId(item.id);
    setBookmarkForm({
      title: item.title,
      url: item.url,
      description: item.description || '',
      categoryId: item.categoryId || '',
      isActive: item.isActive,
    });
  };

  const deleteBookmark = (id) => {
    if (!window.confirm('Hide this bookmark from the hub?')) return;
    runAction(() => api(`/api/admin/bookmarks/${id}`, { method: 'DELETE' }));
  };

  const saveAnnouncement = (e) => {
    e.preventDefault();
    const body = {
      title: announcementForm.title,
      excerpt: announcementForm.excerpt,
      tag: announcementForm.tag,
      tagClass: announcementForm.tagClass,
      isActive: announcementForm.isActive !== false,
    };
    runAction(async () => {
      if (editingAnnouncementId) {
        await api(`/api/admin/announcements/${editingAnnouncementId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        await api('/api/admin/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      setAnnouncementForm(emptyAnnouncement);
      setEditingAnnouncementId(null);
    });
  };

  const editAnnouncement = (item) => {
    setEditingAnnouncementId(item.id);
    setAnnouncementForm({
      title: item.title,
      excerpt: item.excerpt,
      tag: item.tag,
      tagClass: item.tagClass,
      isActive: item.isActive,
    });
  };

  const deleteAnnouncement = (id) => {
    if (!window.confirm('Hide this announcement from the hub?')) return;
    runAction(() => api(`/api/admin/announcements/${id}`, { method: 'DELETE' }));
  };

  const onTagPresetChange = (tag) => {
    const preset = ANNOUNCEMENT_TAG_PRESETS.find((p) => p.tag === tag);
    setAnnouncementForm((f) => ({
      ...f,
      tag,
      tagClass: preset?.tagClass || f.tagClass,
    }));
  };

  return (
    <section className="hub-section hub-admin">
      <div className="hub-section-head">
        <h2 className="hub-section-title">Administration</h2>
      </div>

      <div className="hub-admin-tabs" role="tablist" aria-label="Admin sections">
        {['bookmarks', 'announcements', 'logs'].map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={`hub-admin-tab${tab === t ? ' is-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'bookmarks' ? 'Bookmarks' : t === 'announcements' ? 'Announcements' : 'Audit logs'}
          </button>
        ))}
      </div>

      {error ? <p className="hub-admin-error" role="alert">{error}</p> : null}

      {tab === 'bookmarks' && (
        <div className="hub-admin-panel">
          <form className="hub-admin-form" onSubmit={saveBookmark}>
            <h3 className="hub-admin-form-title">{editingBookmarkId ? 'Edit bookmark' : 'Add bookmark'}</h3>
            <div className="hub-admin-form-grid">
              <label>
                Title
                <input required value={bookmarkForm.title} onChange={(e) => setBookmarkForm((f) => ({ ...f, title: e.target.value }))} />
              </label>
              <label>
                URL
                <input required type="url" value={bookmarkForm.url} onChange={(e) => setBookmarkForm((f) => ({ ...f, url: e.target.value }))} />
              </label>
              <label>
                Category
                <select value={bookmarkForm.categoryId} onChange={(e) => setBookmarkForm((f) => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label className="hub-admin-span2">
                Description
                <input value={bookmarkForm.description} onChange={(e) => setBookmarkForm((f) => ({ ...f, description: e.target.value }))} />
              </label>
              <label className="hub-admin-check">
                <input type="checkbox" checked={bookmarkForm.isActive !== false} onChange={(e) => setBookmarkForm((f) => ({ ...f, isActive: e.target.checked }))} />
                Visible on hub
              </label>
            </div>
            <div className="hub-admin-form-actions">
              <button type="submit" className="hub-admin-btn hub-admin-btn--primary" disabled={busy}>
                {editingBookmarkId ? 'Save changes' : 'Add bookmark'}
              </button>
              {editingBookmarkId ? (
                <button type="button" className="hub-admin-btn" disabled={busy} onClick={() => { setEditingBookmarkId(null); setBookmarkForm(emptyBookmark); }}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="hub-admin-table-wrap">
            <table className="hub-admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {bookmarks.map((b) => (
                  <tr key={b.id} className={!b.isActive ? 'is-inactive' : ''}>
                    <td>
                      <span className="hub-admin-cell-title">{b.title}</span>
                      <span className="hub-admin-cell-sub">{b.url}</span>
                    </td>
                    <td>{b.category?.name || '—'}</td>
                    <td>{b.isActive ? 'Active' : 'Hidden'}</td>
                    <td className="hub-admin-actions">
                      <button type="button" className="hub-admin-link" onClick={() => editBookmark(b)}>Edit</button>
                      {b.isActive ? (
                        <button type="button" className="hub-admin-link hub-admin-link--danger" onClick={() => deleteBookmark(b.id)}>Hide</button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'announcements' && (
        <div className="hub-admin-panel">
          <form className="hub-admin-form" onSubmit={saveAnnouncement}>
            <h3 className="hub-admin-form-title">{editingAnnouncementId ? 'Edit announcement' : 'Add announcement'}</h3>
            <div className="hub-admin-form-grid">
              <label>
                Tag
                <select value={announcementForm.tag} onChange={(e) => onTagPresetChange(e.target.value)}>
                  {ANNOUNCEMENT_TAG_PRESETS.map((p) => (
                    <option key={p.tag} value={p.tag}>{p.tag}</option>
                  ))}
                </select>
              </label>
              <label>
                Title
                <input required value={announcementForm.title} onChange={(e) => setAnnouncementForm((f) => ({ ...f, title: e.target.value }))} />
              </label>
              <label className="hub-admin-span2">
                Excerpt
                <textarea required rows={3} value={announcementForm.excerpt} onChange={(e) => setAnnouncementForm((f) => ({ ...f, excerpt: e.target.value }))} />
              </label>
              <label className="hub-admin-check">
                <input type="checkbox" checked={announcementForm.isActive !== false} onChange={(e) => setAnnouncementForm((f) => ({ ...f, isActive: e.target.checked }))} />
                Published on hub
              </label>
            </div>
            <div className="hub-admin-form-actions">
              <button type="submit" className="hub-admin-btn hub-admin-btn--primary" disabled={busy}>
                {editingAnnouncementId ? 'Save changes' : 'Publish'}
              </button>
              {editingAnnouncementId ? (
                <button type="button" className="hub-admin-btn" disabled={busy} onClick={() => { setEditingAnnouncementId(null); setAnnouncementForm(emptyAnnouncement); }}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="hub-admin-table-wrap">
            <table className="hub-admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tag</th>
                  <th>When</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {announcements.map((a) => (
                  <tr key={a.id} className={!a.isActive ? 'is-inactive' : ''}>
                    <td>{a.title}</td>
                    <td><span className={`hub-tag ${a.tagClass}`}>{a.tag}</span></td>
                    <td>{formatTimeAgo(a.publishedAt)}</td>
                    <td>{a.isActive ? 'Live' : 'Hidden'}</td>
                    <td className="hub-admin-actions">
                      <button type="button" className="hub-admin-link" onClick={() => editAnnouncement(a)}>Edit</button>
                      {a.isActive ? (
                        <button type="button" className="hub-admin-link hub-admin-link--danger" onClick={() => deleteAnnouncement(a.id)}>Hide</button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'logs' && (
        <div className="hub-admin-panel">
          <div className="hub-admin-table-wrap hub-admin-table-wrap--logs">
            <table className="hub-admin-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="hub-admin-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                    <td><code className="hub-admin-code">{log.action}</code></td>
                    <td>{log.actor?.email || '—'}</td>
                    <td className="hub-admin-log-meta">
                      {[log.entityType, log.entityId].filter(Boolean).join(' · ') || '—'}
                      {log.ip ? ` · ${log.ip}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
