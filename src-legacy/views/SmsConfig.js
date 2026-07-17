import { store } from '../store.js';

export function renderSmsConfig() {
  const container = document.createElement('div');
  
  container.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 style="font-size: 2rem;">SMS Configuration</h2>
        <p>Manage SMS gateway settings and message templates.</p>
      </div>
      <button class="btn btn-primary" id="btn-save-sms">Save Configuration</button>
    </div>
    
    <div class="grid-cols-2">
      <!-- Gateway Config -->
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Gateway Settings</h3>
        <form>
          <div class="form-group">
            <label class="form-label">SMS Provider</label>
            <select class="form-control">
              <option ${store.state.smsConfig.provider === 'Twilio' ? 'selected' : ''}>Twilio</option>
              <option ${store.state.smsConfig.provider === 'Local Carrier' ? 'selected' : ''}>Local Carrier API</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">API Key / Token</label>
            <input type="password" class="form-control" value="${store.state.smsConfig.apiKey}">
          </div>
          <div class="form-group">
            <label class="form-label">Sender ID</label>
            <input type="text" class="form-control" value="JAGORON">
          </div>
        </form>
      </div>
      
      <!-- Templates -->
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Message Templates</h3>
        <form>
          <div class="form-group">
            <label class="form-label">Template: Assessment Ready (English)</label>
            <textarea class="form-control" rows="4">${store.state.smsConfig.templates.assessmentReady}</textarea>
            <small class="text-muted" style="margin-top: 0.5rem; display: block;">Variables: {name}, {pathway}</small>
          </div>
          <div class="form-group">
            <label class="form-label">Template: Follow-up Reminder (Bangla)</label>
            <textarea class="form-control" rows="3">আপনার পরবর্তী ট্রেনিং সেশন আগামীকাল। দয়া করে উপস্থিত থাকুন।</textarea>
          </div>
        </form>
      </div>
    </div>
  `;
  
  container.querySelector('#btn-save-sms').addEventListener('click', () => {
    alert("SMS Configuration saved successfully!");
    store.addLog(store.state.staffUser.name, 'Config Update', 'Updated SMS Gateway and Templates');
  });

  return container;
}
