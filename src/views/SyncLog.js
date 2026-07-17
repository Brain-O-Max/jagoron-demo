import { store } from '../store.js';

export function renderSyncLog() {
  const container = document.createElement('div');
  
  if (store.state.staffUser?.role !== 'System Admin' && store.state.staffUser?.role !== 'Admin') {
    container.innerHTML = `
      <div class="card text-center" style="margin-top: 4rem;">
        <h2 style="color: var(--accent);">Access Denied</h2>
        <p>You do not have permission to view Sync Logs.</p>
      </div>
    `;
    return container;
  }
  
  container.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 style="font-size: 2rem;">Device Synchronization Logs</h2>
        <p>Track offline data synced from field agents' mobile devices to the central MIS.</p>
      </div>
      <button id="btn-trigger-sync" class="btn btn-primary" style="display: flex; align-items: center; gap: 0.5rem;" title="Simulates a field device connecting to the server to push cached records.">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        Trigger Manual Sync
      </button>
    </div>
    
    <div class="card">
      <div class="flex gap-4 mb-4">
        <input type="text" id="sync-search" class="form-control" placeholder="Search by user or device..." style="flex: 1;" />
        <select id="sync-status-filter" class="form-control" style="width: 200px;">
          <option value="All">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </select>
      </div>
      
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>User</th>
              <th>Location</th>
              <th>Device</th>
              <th>Records Synced</th>
              <th>Data Size</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="sync-tbody">
            <!-- Rendered by JS -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Sync Details -->
    <div id="sync-modal" style="display: none; position: fixed; inset: 0; background: rgba(15,23,42,0.8); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div class="card" style="width: 90%; max-width: 600px; padding: 2rem; position: relative;">
        <button id="close-modal" style="position: absolute; top: 1rem; right: 1.5rem; background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>
        <h3 style="margin-bottom: 1.5rem; font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Sync Details
        </h3>
        <div id="sync-modal-content" style="font-size: 0.95rem; line-height: 1.6; color: var(--text-main); background: var(--surface-hover); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-color);">
          <!-- Content dynamically populated -->
        </div>
      </div>
    </div>
  `;
  
  const tbody = container.querySelector('#sync-tbody');
  const searchInput = container.querySelector('#sync-search');
  const statusFilter = container.querySelector('#sync-status-filter');
  const triggerBtn = container.querySelector('#btn-trigger-sync');
  
  const modal = container.querySelector('#sync-modal');
  const modalClose = container.querySelector('#close-modal');
  const modalContent = container.querySelector('#sync-modal-content');

  modalClose.addEventListener('click', () => { modal.style.display = 'none'; });
  modal.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });

  function renderLogs() {
    const q = searchInput.value.toLowerCase();
    const sFilter = statusFilter.value;
    
    let logs = store.state.syncLogs || [];
    
    logs = logs.filter(log => {
      const matchSearch = log.user.toLowerCase().includes(q) || log.device.toLowerCase().includes(q) || (log.location && log.location.toLowerCase().includes(q));
      const matchStatus = sFilter === 'All' || log.status.includes(sFilter);
      return matchSearch && matchStatus;
    });
    
    // Sort by newest first based on timestamp (for simplicity, we assume they are added sequentially and ID increments)
    logs = [...logs].sort((a, b) => b.id - a.id);
    
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted py-4">No sync logs found.</td></tr>';
      return;
    }
    
    tbody.innerHTML = '';
    logs.forEach(log => {
      const isSuccess = log.status.includes('Success');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-size: 0.85rem; color: var(--text-muted);">#${log.id}</td>
        <td style="font-size: 0.85rem;">${log.timestamp}</td>
        <td style="font-weight: 500;">${log.user}</td>
        <td>${log.location || 'N/A'}</td>
        <td>${log.device}</td>
        <td class="text-center"><span class="badge badge-info" style="font-size:0.8rem;">${log.recordsSynced || 0}</span></td>
        <td style="font-size: 0.85rem;">${log.dataSize || '0 KB'}</td>
        <td style="font-size: 0.85rem;">${log.duration || '0.0s'}</td>
        <td>
          <span class="badge ${isSuccess ? 'badge-success' : 'badge-warning'}">${log.status}</span>
        </td>
        <td>
          <button class="btn btn-secondary btn-view-details" data-id="${log.id}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">View Details</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Attach event listeners for View Details
    container.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const targetLog = store.state.syncLogs.find(l => l.id === id);
        if (targetLog) {
          modalContent.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
              <div><strong>Sync ID:</strong> #${targetLog.id}</div>
              <div><strong>Status:</strong> ${targetLog.status}</div>
              <div><strong>User:</strong> ${targetLog.user}</div>
              <div><strong>Location:</strong> ${targetLog.location || 'Unknown'}</div>
              <div><strong>Device:</strong> ${targetLog.device}</div>
              <div><strong>Timestamp:</strong> ${targetLog.timestamp}</div>
            </div>
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--primary);">Data Metrics:</strong><br/>
              Records Processed: ${targetLog.recordsSynced || 0} (combined profiles & assessments)<br/>
              Payload Size: ${targetLog.dataSize || '0 KB'}<br/>
              Processing Time: ${targetLog.duration || '0.0s'}
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.85rem; color: #cbd5e1; border: 1px solid #334155;">
              <strong>System Log Details:</strong><br/>
              ${targetLog.details || 'No detailed log provided for this transaction.'}
            </div>
          `;
          modal.style.display = 'flex';
        }
      });
    });
  }
  
  searchInput.addEventListener('input', renderLogs);
  statusFilter.addEventListener('change', renderLogs);
  
  triggerBtn.addEventListener('click', () => {
    triggerBtn.disabled = true;
    triggerBtn.innerHTML = '⏳ Syncing...';
    
    setTimeout(() => {
      const records = Math.floor(Math.random() * 20);
      const size = Math.floor(records * 12.5) + Math.floor(Math.random() * 10);
      
      const newLog = {
        id: Date.now(),
        user: store.state.staffUser?.name || 'Admin',
        location: store.state.staffUser?.region || 'Global',
        device: 'Web Client / Manual Sync',
        timestamp: new Date().toLocaleString(),
        recordsSynced: records,
        dataSize: size + ' KB',
        duration: (Math.random() * 3 + 0.5).toFixed(1) + 's',
        status: 'Success',
        details: 'Manual sync triggered by administrator. Uploaded pending local caches to Central MIS successfully.'
      };
      
      const updatedLogs = [...(store.state.syncLogs || []), newLog];
      store.setState({ syncLogs: updatedLogs });
      store.addLog(store.state.staffUser?.name || 'System', 'MIS Sync', 'Triggered manual offline data sync.');
      
      renderLogs();
      triggerBtn.disabled = false;
      triggerBtn.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        Trigger Manual Sync
      `;
    }, 1500);
  });
  
  renderLogs();
  
  return container;
}
