import { store } from '../store.js';

export function renderAuditLog() {
  const container = document.createElement('div');
  
  if (store.state.staffUser?.role !== 'System Admin') {
    container.innerHTML = `
      <div class="card text-center" style="margin-top: 4rem;">
        <h2 style="color: var(--accent);">Access Denied</h2>
        <p>You do not have permission to view System Audit Logs. (Requires System Admin role)</p>
      </div>
    `;
    return container;
  }
  
  container.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 style="font-size: 2rem;">System Audit Trail</h2>
        <p>Immutable, timestamped history of actions performed across the entire JAGORON platform.</p>
      </div>
      <button class="btn btn-secondary" onclick="alert('Exporting Audit Trail to PDF...')">📥 Export Log (PDF)</button>
    </div>
    
    <div class="card">
      <div class="flex justify-between mb-4">
        <input type="text" class="form-control" placeholder="Search by user or action..." style="max-width: 300px;" id="audit-search">
        <select class="form-control" style="width: auto;" id="audit-filter">
          <option value="All">All Events</option>
          <option value="Security">Security</option>
          <option value="Data Export">Data Exports</option>
          <option value="Bulk SMS">SMS Sent</option>
          <option value="MIS Sync">MIS Sync</option>
        </select>
      </div>
      
      <div class="table-wrapper" style="max-height: 600px; overflow-y: auto;">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action Category</th>
              <th>Detailed Description</th>
            </tr>
          </thead>
          <tbody id="audit-tbody">
            <!-- JS populated -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  const tbody = container.querySelector('#audit-tbody');
  const searchInput = container.querySelector('#audit-search');
  const filterSelect = container.querySelector('#audit-filter');
  
  function renderLogs() {
    const term = searchInput.value.toLowerCase();
    const filter = filterSelect.value;
    
    const logs = store.state.auditLogs.filter(log => {
      const matchSearch = log.user.toLowerCase().includes(term) || log.action.toLowerCase().includes(term) || log.details.toLowerCase().includes(term);
      const matchFilter = filter === 'All' || log.action === filter;
      return matchSearch && matchFilter;
    });
    
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">No audit logs match your criteria.</td></tr>';
      return;
    }
    
    tbody.innerHTML = logs.map(log => `
      <tr>
        <td style="color: var(--text-muted); font-size: 0.85rem; white-space: nowrap;">${log.timestamp}</td>
        <td style="font-weight: 500;">${log.user}</td>
        <td>
          <span class="badge ${
            log.action === 'Security' ? 'badge-warning' : 
            log.action === 'MIS Sync' ? 'badge-info' : 
            log.action === 'Data Export' ? 'badge-success' : 'badge-neutral'
          }">${log.action}</span>
        </td>
        <td style="font-size: 0.9rem;">${log.details}</td>
      </tr>
    `).join('');
  }
  
  searchInput.addEventListener('input', renderLogs);
  filterSelect.addEventListener('change', renderLogs);
  
  // Initial render
  renderLogs();

  return container;
}
