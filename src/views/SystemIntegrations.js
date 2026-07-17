import { store } from '../store.js';

export function renderSystemIntegrations() {
  const container = document.createElement('div');
  
  if (store.state.staffUser?.role !== 'System Admin') {
    container.innerHTML = `
      <div class="card text-center" style="margin-top: 4rem;">
        <h2 style="color: var(--accent);">Access Denied</h2>
        <p>You do not have permission to view System Integrations. (Requires System Admin role)</p>
      </div>
    `;
    return container;
  }
  
  const unpushedProfiles = store.state.youths.filter(y => y.status === 'Profiled').length; // Mock logic
  
  container.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 style="font-size: 2rem;">Central MIS Integration</h2>
        <p>Sync AI assessment profiles to the centralized CARE/SOS database.</p>
      </div>
    </div>
    
    <div class="grid-cols-2">
      <!-- Sync Status -->
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Sync Status</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
            <span style="font-weight: 500;">API Connection</span> 
            <span class="badge badge-success">● Connected</span>
          </li>
          <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
            <span style="font-weight: 500;">Last Sync</span> 
            <span class="text-muted" id="last-sync-time">${store.state.misSync.lastSync}</span>
          </li>
          <li style="padding: 0.75rem 0; display: flex; justify-content: space-between;">
            <span style="font-weight: 500;">Pending Profiles to Push</span> 
            <span class="badge badge-warning" id="pending-count">${unpushedProfiles}</span>
          </li>
        </ul>
        
        <button id="btn-sync-mis" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;" ${unpushedProfiles === 0 ? 'disabled style="opacity:0.5;"' : ''}>
          🔄 Push Data to Central MIS
        </button>
      </div>
      
      <!-- API Configuration -->
      <div class="card">
        <h3 style="margin-bottom: 1rem;">API Configuration</h3>
        <form>
          <div class="form-group">
            <label class="form-label">Endpoint URL</label>
            <input type="url" class="form-control" value="https://api.care.org/jagoron/v1/sync">
          </div>
          <div class="form-group">
            <label class="form-label">Authentication Token (Bearer)</label>
            <input type="password" class="form-control" value="************">
          </div>
          <div class="form-group">
            <label class="form-label">Retry Policy</label>
            <select class="form-control">
              <option>Retry 3 times with exponential backoff</option>
              <option>No retry, fail immediately</option>
            </select>
          </div>
          <button type="button" class="btn btn-secondary" onclick="alert('API Settings Saved')">Save Configuration</button>
        </form>
      </div>
    </div>
  `;
  
  const syncBtn = container.querySelector('#btn-sync-mis');
  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      const originalText = syncBtn.innerHTML;
      syncBtn.innerHTML = '🔄 Syncing...';
      syncBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        const timestamp = new Date().toLocaleString();
        store.setState({ 
          misSync: { lastSync: timestamp, status: 'Success' }
        });
        store.addLog(store.state.staffUser.name, 'MIS Sync', `Successfully pushed ${unpushedProfiles} profiles to Central DB`);
        
        container.querySelector('#last-sync-time').textContent = timestamp;
        container.querySelector('#pending-count').textContent = '0';
        syncBtn.innerHTML = '✅ Synced Successfully';
      }, 1500);
    });
  }

  return container;
}
