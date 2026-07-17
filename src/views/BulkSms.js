import { store } from '../store.js';

export function renderBulkSms() {
  const container = document.createElement('div');
  
  container.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 style="font-size: 2rem;">Bulk SMS Campaigns</h2>
        <p>Target specific cohorts and send mass SMS notifications.</p>
      </div>
    </div>
    
    <div class="grid-cols-2">
      <!-- Filter Panel -->
      <div class="card" style="align-self: start;">
        <h3 style="margin-bottom: 1rem;">Campaign Filters</h3>
        <form id="bulk-sms-form">
          <div class="form-group">
            <label class="form-label">Target District</label>
            <select class="form-control" name="district">
              <option value="All">All Districts</option>
              <option value="Khulna">Khulna</option>
              <option value="Gazipur">Gazipur</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Profile Status</label>
            <select class="form-control" name="status">
              <option value="Profiled">AI Profiled (Results Ready)</option>
              <option value="Registered">Pending Assessment (Reminder)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Registration Date From</label>
            <input type="date" class="form-control" name="dateFrom">
          </div>
          
          <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem;">Message Content</h4>
          <div class="form-group">
            <label class="form-label">Template</label>
            <select class="form-control" id="template-select">
              <option value="assessmentReady">Assessment Results Ready</option>
              <option value="custom">Custom Message</option>
            </select>
          </div>
          <div class="form-group">
            <textarea class="form-control" rows="4" id="sms-body">${store.state.smsConfig.templates.assessmentReady}</textarea>
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%;">🚀 Send Bulk Campaign</button>
        </form>
      </div>
      
      <!-- Preview Panel -->
      <div class="card" style="background: var(--surface-hover);">
        <h3 style="margin-bottom: 1rem;">Recipient Preview</h3>
        <p class="text-muted" style="font-size: 0.9rem;">Estimated recipients based on current filters: <strong id="recipient-count" style="color: var(--primary);">0</strong></p>
        
        <div class="table-wrapper" style="max-height: 400px; overflow-y: auto;">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>District</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="preview-list">
              <!-- JS Populated -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  const form = container.querySelector('#bulk-sms-form');
  const previewList = container.querySelector('#preview-list');
  const countLabel = container.querySelector('#recipient-count');
  
  function updatePreview() {
    const district = form.district.value;
    const status = form.status.value;
    
    const filtered = store.state.youths.filter(y => {
      const matchDistrict = district === 'All' || y.district === district;
      const matchStatus = status === 'All' || y.status === status;
      return matchDistrict && matchStatus;
    });
    
    countLabel.textContent = filtered.length;
    
    if (filtered.length === 0) {
      previewList.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No matching recipients.</td></tr>';
    } else {
      previewList.innerHTML = filtered.map(y => `
        <tr>
          <td style="font-weight: 500;">${y.name}</td>
          <td>${y.district}</td>
          <td><span class="badge badge-neutral">${y.status}</span></td>
        </tr>
      `).join('');
    }
  }
  
  form.addEventListener('change', updatePreview);
  updatePreview(); // initial load
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const count = countLabel.textContent;
    if (count === '0') {
      alert("No recipients match the criteria.");
      return;
    }
    
    if (confirm(`Are you sure you want to send SMS to ${count} recipients?`)) {
      alert("Bulk SMS Campaign successfully queued via " + store.state.smsConfig.provider);
      store.addLog(store.state.staffUser.name, 'Bulk SMS', `Sent campaign to ${count} recipients.`);
    }
  });

  return container;
}
