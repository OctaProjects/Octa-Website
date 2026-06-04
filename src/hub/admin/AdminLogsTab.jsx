export default function AdminLogsTab({ logs }) {
  if (!logs.length) {
    return <p className="hub-muted">No audit events yet.</p>;
  }

  return (
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
  );
}
