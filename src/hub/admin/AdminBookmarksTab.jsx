import { useState } from 'react';
import { adminApi } from '../hubApi.js';
import { EMPTY_BOOKMARK_FORM } from '../constants.js';
import { AdminField, AdminFormActions, AdminRowActions, AdminTable } from './AdminUi.jsx';

export default function AdminBookmarksTab({ bookmarks, categories, busy, runAction }) {
  const [form, setForm] = useState(EMPTY_BOOKMARK_FORM);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm(EMPTY_BOOKMARK_FORM);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      url: item.url,
      description: item.description || '',
      categoryId: item.categoryId || '',
      isActive: item.isActive,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      url: form.url,
      description: form.description || null,
      categoryId: form.categoryId || null,
      isActive: form.isActive !== false,
    };

    runAction(async () => {
      if (editingId) {
        await adminApi.bookmarks.update(editingId, payload);
      } else {
        await adminApi.bookmarks.create(payload);
      }
      resetForm();
    });
  };

  const hideBookmark = (id) => {
    if (!window.confirm('Hide this bookmark from the hub?')) return;
    runAction(() => adminApi.bookmarks.hide(id));
  };

  return (
    <div className="hub-admin-panel">
      <form className="hub-admin-form" onSubmit={handleSubmit}>
        <h3 className="hub-admin-form-title">{editingId ? 'Edit bookmark' : 'Add bookmark'}</h3>
        <div className="hub-admin-form-grid">
          <AdminField label="Title">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </AdminField>
          <AdminField label="URL">
            <input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </AdminField>
          <AdminField label="Category">
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">— None —</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Description" className="hub-admin-span2">
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </AdminField>
          <label className="hub-admin-check hub-admin-span2">
            <input
              type="checkbox"
              checked={form.isActive !== false}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Visible on hub
          </label>
        </div>
        <AdminFormActions
          busy={busy}
          submitLabel={editingId ? 'Save changes' : 'Add bookmark'}
          showCancel={Boolean(editingId)}
          onCancel={resetForm}
        />
      </form>

      <AdminTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'category', label: 'Category' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Actions', srOnly: true },
        ]}
        rows={bookmarks.map((bookmark) => (
          <tr key={bookmark.id} className={!bookmark.isActive ? 'is-inactive' : ''}>
            <td>
              <span className="hub-admin-cell-title">{bookmark.title}</span>
              <span className="hub-admin-cell-sub">{bookmark.url}</span>
            </td>
            <td>{bookmark.category?.name || '—'}</td>
            <td>{bookmark.isActive ? 'Active' : 'Hidden'}</td>
            <AdminRowActions
              onEdit={() => startEdit(bookmark)}
              onHide={() => hideBookmark(bookmark.id)}
              showHide={bookmark.isActive}
            />
          </tr>
        ))}
      />
    </div>
  );
}
