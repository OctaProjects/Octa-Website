import { useState } from 'react';
import { adminApi } from '../hubApi.js';
import { EMPTY_CATEGORY_FORM } from '../constants.js';
import { AdminField, AdminFormActions, AdminTable } from './AdminUi.jsx';

export default function AdminCategoriesTab({ categories, busy, runAction }) {
  const [form, setForm] = useState(EMPTY_CATEGORY_FORM);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm(EMPTY_CATEGORY_FORM);
    setEditingId(null);
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setForm({ name: category.name, sortOrder: category.sortOrder });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      name: form.name,
      sortOrder: Number(form.sortOrder) || 0,
    };

    runAction(async () => {
      if (editingId) {
        await adminApi.categories.update(editingId, payload);
      } else {
        await adminApi.categories.create(payload);
      }
      resetForm();
    });
  };

  const removeCategory = (id) => {
    if (!window.confirm('Delete this category? Bookmarks must be moved first.')) return;
    runAction(() => adminApi.categories.remove(id));
  };

  return (
    <div className="hub-admin-panel">
      <form className="hub-admin-form" onSubmit={handleSubmit}>
        <h3 className="hub-admin-form-title">{editingId ? 'Edit category' : 'Add category'}</h3>
        <div className="hub-admin-form-grid">
          <AdminField label="Name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </AdminField>
          <AdminField label="Sort order">
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
          </AdminField>
        </div>
        <AdminFormActions
          busy={busy}
          submitLabel={editingId ? 'Save changes' : 'Add category'}
          showCancel={Boolean(editingId)}
          onCancel={resetForm}
        />
      </form>

      <AdminTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'order', label: 'Order' },
          { key: 'actions', label: 'Actions' },
        ]}
        rows={categories.map((category) => (
          <tr key={category.id}>
            <td>{category.name}</td>
            <td>{category.sortOrder}</td>
            <td className="hub-admin-actions">
              <button type="button" className="hub-admin-link" onClick={() => startEdit(category)}>Edit</button>
              <button type="button" className="hub-admin-link hub-admin-link--danger" onClick={() => removeCategory(category.id)}>Delete</button>
            </td>
          </tr>
        ))}
      />
    </div>
  );
}
