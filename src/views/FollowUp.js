import { store } from '../store.js';

export function renderFollowUp() {
  const container = document.createElement('div');
  
  let selectedYouthId = null;
  
  function render() {
    // Get youths who have AI profiles
    const profiledYouths = store.state.youths.filter(y => y.status === 'Profiled' || y.status === 'Assessment Complete');
    
    // Calculate metrics
    let inTraining = 0, grants = 0, employed = 0;
    profiledYouths.forEach(y => {
      if (y.followUpHistory && y.followUpHistory.length > 0) {
        const latestStage = y.followUpHistory[0].stage; // assuming prepended
        if (latestStage.includes('Training')) inTraining++;
        if (latestStage.includes('Grant')) grants++;
        if (latestStage.includes('Employed') || latestStage.includes('Business')) employed++;
      }
    });
    
    container.innerHTML = `
      <style>
        .timeline { border-left: 2px solid var(--primary); padding-left: 1.5rem; margin-top: 1rem; position: relative; }
        .timeline-item { position: relative; margin-bottom: 1.5rem; }
        .timeline-item::before { content: ''; position: absolute; left: -1.8rem; top: 0.2rem; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); border: 2px solid white; }
        .timeline-date { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.25rem; }
        .timeline-stage { font-weight: 600; color: var(--text-main); }
        .timeline-remarks { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; background: var(--surface-hover); padding: 0.5rem; border-radius: 4px; }
      </style>
      
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 style="font-size: 2rem;">Progress Follow-up</h2>
          <p>Track longitudinal progress of youths after profiling.</p>
        </div>
        <button class="btn btn-secondary">Export Follow-up Data</button>
      </div>
      
      <div class="flex gap-4 mb-4">
        <div class="card metric-card" style="flex: 1; padding: 1rem; background: var(--primary-gradient);">
          <div class="flex justify-between items-center">
            <div class="metric-title">In Training</div>
            <div class="metric-value" style="font-size: 1.5rem; margin: 0;">${inTraining}</div>
          </div>
        </div>
        <div class="card metric-card" style="flex: 1; padding: 1rem; background: var(--secondary-gradient);">
          <div class="flex justify-between items-center">
            <div class="metric-title">Challenge Grants</div>
            <div class="metric-value" style="font-size: 1.5rem; margin: 0;">${grants}</div>
          </div>
        </div>
        <div class="card metric-card" style="flex: 1; padding: 1rem; background: var(--warning-gradient);">
          <div class="flex justify-between items-center">
            <div class="metric-title">Employed / Business</div>
            <div class="metric-value" style="font-size: 1.5rem; margin: 0;">${employed}</div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Post-Assessment Tracking</h3>
        
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Pathway Matched</th>
                <th>Current Stage</th>
                <th>Last Follow-up</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${profiledYouths.length === 0 ? `<tr><td colspan="5" class="text-center text-muted py-4">No profiled youth available for follow-up yet.</td></tr>` : 
                profiledYouths.map(y => {
                  const history = y.followUpHistory || [];
                  const latest = history.length > 0 ? history[0] : null;
                  
                  return `
                    <tr>
                      <td style="font-weight: 500;">${y.name}</td>
                      <td>${y.aiProfile ? y.aiProfile.pathway : 'Pending AI'}</td>
                      <td>
                        <span class="badge badge-neutral">${latest ? latest.stage : 'Awaiting Action'}</span>
                      </td>
                      <td class="text-muted" style="font-size: 0.85rem;">${latest ? new Date(latest.date).toLocaleDateString() : 'Never'}</td>
                      <td>
                        <button class="btn btn-primary log-btn" data-id="${y.id}" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">
                          📝 Log & View Timeline
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Modal -->
      ${selectedYouthId ? (() => {
        const y = profiledYouths.find(u => u.id === selectedYouthId);
        const history = y.followUpHistory || [];
        return `
          <div class="modal-overlay" style="display: flex;">
            <div class="modal-content" style="max-width: 600px;">
              <div class="flex justify-between items-center mb-4">
                <h3 style="margin: 0;">Progress Timeline: ${y.name}</h3>
                <button class="btn-icon close-modal">✕</button>
              </div>
              
              <div style="display: flex; gap: 2rem;">
                <!-- Left: Form -->
                <div style="flex: 1;">
                  <form id="followup-form">
                    <div class="form-group">
                      <label class="form-label">Interaction Date</label>
                      <input type="date" name="date" class="form-control" required value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Update Stage</label>
                      <select name="stage" class="form-control" required>
                        <option value="Referred to Training">Referred to Training</option>
                        <option value="In IBT Training">In IBT Training</option>
                        <option value="Apprenticeship">Apprenticeship</option>
                        <option value="Challenge Grant Received">Challenge Grant Received</option>
                        <option value="Employed">Employed</option>
                        <option value="Started Business">Started Business</option>
                        <option value="Dropped Out">Dropped Out</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Remarks / Notes</label>
                      <textarea name="remarks" class="form-control" rows="3" required placeholder="Details of the interaction..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Save Update</button>
                  </form>
                </div>
                
                <!-- Right: Timeline -->
                <div style="flex: 1; border-left: 1px solid var(--border-color); padding-left: 1.5rem;">
                  <h4 style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">Historical Timeline</h4>
                  <div class="timeline" style="max-height: 350px; overflow-y: auto;">
                    ${history.length === 0 ? '<div class="text-muted" style="font-size: 0.85rem;">No history logged yet.</div>' : ''}
                    ${history.map(h => `
                      <div class="timeline-item">
                        <div class="timeline-date">${new Date(h.date).toLocaleDateString()}</div>
                        <div class="timeline-stage">${h.stage}</div>
                        <div class="timeline-remarks">${h.remarks}</div>
                      </div>
                    `).join('')}
                    
                    <div class="timeline-item">
                      <div class="timeline-date">${new Date(y.id).toLocaleDateString()}</div>
                      <div class="timeline-stage">Registered in JAGORON</div>
                      <div class="timeline-remarks">Initial profiling completed.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      })() : ''}
    `;
    
    // Bind Events
    container.querySelectorAll('.log-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedYouthId = parseInt(btn.dataset.id);
        render();
      });
    });
    
    const closeBtn = container.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        selectedYouthId = null;
        render();
      });
    }
    
    const form = container.querySelector('#followup-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        
        const yIndex = store.state.youths.findIndex(u => u.id === selectedYouthId);
        if (yIndex !== -1) {
          const youth = store.state.youths[yIndex];
          if (!youth.followUpHistory) youth.followUpHistory = [];
          
          youth.followUpHistory.unshift({
            date: fd.get('date'),
            stage: fd.get('stage'),
            remarks: fd.get('remarks')
          });
          
          store.setState({ youths: [...store.state.youths] });
          store.addLog(store.state.staffUser?.name || 'System', 'Follow-up', `Updated progress for ${youth.name}`);
          selectedYouthId = null;
          render();
        }
      });
    }
  }
  
  render();
  return container;
}
