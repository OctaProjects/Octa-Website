import { useState } from 'react';
import { adminApi } from '../hubApi.js';
import { ANNOUNCEMENT_TAG_PRESETS, EMPTY_ANNOUNCEMENT_FORM } from '../constants.js';
import { formatTimeAgo } from '../formatTimeAgo.js';
import { AdminField, AdminFormActions, AdminRowActions, AdminTable } from './AdminUi.jsx';

export default function AdminAnnouncementsTab({ announcements, busy, runAction }) {
  const [form, setForm] = useState(EMPTY_ANNOUNCEMENT_FORM);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm(EMPTY_ANNOUNCEMENT_FORM);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      excerpt: item.excerpt,
      tag: item.tag,
      tagClass: item.tagClass,
      isActive: item.isActive,
    });
  };

  const onTagChange = (tag) => {
    const preset = ANNOUNCEMENT_TAG_PRESETS.find((entry) => entry.tag === tag);
    setForm((current) => ({
      ...current,
      tag,
      tagClass: preset?.tagClass || current.tagClass,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      tag: form.tag,
      tagClass: form.tagClass,
      isActive: form.isActive !== false,
    };

    runAction(async () => {
      if (editingId) {
        await adminApi.announcements.update(editingId, payload);
      } else {
        await adminApi.announcements.create(payload);
      }
      resetForm();
    });
  };

  const hideAnnouncement = (id) => {
    if (!window.confirm('Hide this announcement from the hub?')) return;
    runAction(() => adminApi.announcements.hide(id));
  };

  return (
    <div className="hub-admin-panel">
      <form className="hub-admin-form" onSubmit={handleSubmit}>
        <h3 className="hub-admin-form-title">{editingId ? 'Edit announcement' : 'Add announcement'}</h3>
        <div className="hub-admin-form-grid">
          <AdminField label="Tag">
            <select value={form.tag} onChange={(e) => onTagChange(e.target.value)}>
              {ANNOUNCEMENT_TAG_PRESETS.map((preset) => (
                <option key={preset.tag} value={preset.tag}>{preset.tag}</option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Title">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </AdminField>
          <AdminField label="Excerpt" className="hub-admin-span2">
            <textarea required rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </AdminField>
          <label className="hub-admin-check hub-admin-span2">
            <input
              type="checkbox"
              checked={form.isActive !== false}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Published on hub
          </label>
        </div>
        <AdminFormActions
          busy={busy}
          submitLabel={editingId ? 'Save changes' : 'Publish'}
          showCancel={Boolean(editingId)}
          onCancel={resetForm}
        />
      </form>

      <AdminTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'tag', label: 'Tag' },
          { key: 'when', label: 'When' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Actions', srOnly: true },
        ]}
        rows={announcements.map((item) => (
          <tr key={item.id} className={!item.isActive ? 'is-inactive' : ''}>
            <td>{item.title}</td>
            <td><span className={`hub-tag ${item.tagClass}`}>{item.tag}</span></td>
            <td>{formatTimeAgo(item.publishedAt)}</td>
            <td>{item.isActive ? 'Live' : 'Hidden'}</td>
            <AdminRowActions
              onEdit={() => startEdit(item)}
              onHide={() => hideAnnouncement(item.id)}
              showHide={item.isActive}
            />
          </tr>
        ))}
      />
    </div>
  );
}
