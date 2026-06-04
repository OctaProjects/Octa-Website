import { useState } from 'react';
import { adminApi } from '../hubApi.js';
import { EMPTY_USER_FORM, USER_ROLES } from '../constants.js';
import { AdminField, AdminFormActions, AdminTable } from './AdminUi.jsx';

export default function AdminUsersTab({ users, currentUserId, busy, runAction }) {
  const [form, setForm] = useState(EMPTY_USER_FORM);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm(EMPTY_USER_FORM);
    setEditingId(null);
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setForm({
      email: user.email,
      password: '',
      name: user.name || '',
      role: user.role,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId) {
      const payload = {
        name: form.name || null,
        role: form.role,
      };
      runAction(async () => {
        await adminApi.users.update(editingId, payload);
        resetForm();
      });
      return;
    }

    runAction(async () => {
      await adminApi.users.create({
        email: form.email,
        password: form.password,
        name: form.name || null,
        role: form.role,
      });
      resetForm();
    });
  };

  return (
    <div className="hub-admin-panel">
      <form className="hub-admin-form" onSubmit={handleSubmit}>
        <h3 className="hub-admin-form-title">{editingId ? 'Edit user' : 'Add employee account'}</h3>
        <div className="hub-admin-form-grid">
          <AdminField label="Email">
            <input
              required
              type="email"
              disabled={Boolean(editingId)}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </AdminField>
          {!editingId ? (
            <AdminField label="Password">
              <input
                required
                type="password"
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </AdminField>
          ) : null}
          <AdminField label="Display name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </AdminField>
          <AdminField label="Role">
            <select
              value={form.role}
              disabled={editingId === currentUserId}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {USER_ROLES.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </AdminField>
        </div>
        <AdminFormActions
          busy={busy}
          submitLabel={editingId ? 'Save changes' : 'Create user'}
          showCancel={Boolean(editingId)}
          onCancel={resetForm}
        />
      </form>

      <AdminTable
        columns={[
          { key: 'email', label: 'Email' },
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'login', label: 'Last login' },
          { key: 'actions', label: 'Actions' },
        ]}
        rows={users.map((user) => (
          <tr key={user.id}>
            <td>{user.email}</td>
            <td>{user.name || '—'}</td>
            <td>{user.role}</td>
            <td className="hub-admin-nowrap">
              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
            </td>
            <td className="hub-admin-actions">
              <button type="button" className="hub-admin-link" onClick={() => startEdit(user)}>Edit</button>
            </td>
          </tr>
        ))}
      />
    </div>
  );
}
