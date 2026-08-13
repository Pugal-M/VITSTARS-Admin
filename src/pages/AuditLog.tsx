
export default function AuditLog() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>System Audit Log</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Track all administrative actions and changes</p>
        </div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Admin</th>
                <th>Action Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>No recent audit logs available.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
