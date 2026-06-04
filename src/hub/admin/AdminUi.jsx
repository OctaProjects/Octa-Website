export function AdminTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="hub-admin-tabs" role="tablist" aria-label="Admin sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`hub-admin-tab${activeTab === tab.id ? ' is-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function AdminError({ message }) {
  if (!message) return null;
  return <p className="hub-admin-error" role="alert">{message}</p>;
}

export function AdminField({ label, className = '', children }) {
  return (
    <label className={className}>
      {label}
      {children}
    </label>
  );
}

export function AdminFormActions({ busy, submitLabel, onCancel, showCancel }) {
  return (
    <div className="hub-admin-form-actions">
      <button type="submit" className="hub-admin-btn hub-admin-btn--primary" disabled={busy}>
        {submitLabel}
      </button>
      {showCancel ? (
        <button type="button" className="hub-admin-btn" disabled={busy} onClick={onCancel}>
          Cancel
        </button>
      ) : null}
    </div>
  );
}

export function AdminTable({ columns, rows, emptyMessage = 'No items yet.' }) {
  if (!rows.length) {
    return <p className="hub-muted">{emptyMessage}</p>;
  }

  return (
    <div className="hub-admin-table-wrap">
      <table className="hub-admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} aria-label={col.srOnly ? col.label : undefined}>
                {col.srOnly ? null : col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export function AdminRowActions({ onEdit, onHide, showHide }) {
  return (
    <td className="hub-admin-actions">
      <button type="button" className="hub-admin-link" onClick={onEdit}>Edit</button>
      {showHide ? (
        <button type="button" className="hub-admin-link hub-admin-link--danger" onClick={onHide}>Hide</button>
      ) : null}
    </td>
  );
}
