import { store } from '../store.js';

export function renderPreScreening() {
  const container = document.createElement('div');
  
  let selectedYouthId = null; // For the view modal
  let isProcessing = false;
  let processLogs = [];
  let searchQuery = '';
  
  function render() {
    let pendingYouths = store.state.youths.filter(y => y.status === 'Submitted' || y.status === 'Pre-screeing');
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      pendingYouths = pendingYouths.filter(y => 
        (y.name && y.name.toLowerCase().includes(q)) || 
        (y.phone && y.phone.includes(q)) ||
        (y.id && y.id.toString().includes(q))
      );
    }
    
    container.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 style="font-size: 2rem;">Pre-Screening ML Validation</h2>
          <p>Run the ML validation process to detect anomalies and duplicate entries before allowing assessments.</p>
        </div>
        <button id="btn-run-ml" class="btn btn-primary" style="background: var(--accent); border-color: var(--accent); padding: 0.75rem 1.5rem; font-weight: bold;" ${pendingYouths.length === 0 ? 'disabled' : ''}>
          🤖 Run ML Pre-Screening Process
        </button>
      </div>
      
      <div style="margin-bottom: 1.5rem; display: flex; max-width: 400px;">
        <input type="text" id="search-input" class="form-control" placeholder="Search by name, ID, or phone..." value="${searchQuery}" />
      </div>
      
      <div class="card">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style="width: 40px;"><input type="checkbox" id="check-all" /></th>
                <th>ID</th>
                <th>Name</th>
                <th>District</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${pendingYouths.length === 0 ? `<tr><td colspan="6" class="text-center text-muted py-4">No profiles pending validation.</td></tr>` : 
                pendingYouths.map(y => `
                  <tr>
                    <td><input type="checkbox" class="youth-checkbox" value="${y.id}" /></td>
                    <td style="font-weight: 500;">#${y.id.toString().padStart(4, '0')}</td>
                    <td style="font-weight: 500;">${y.name}</td>
                    <td>${y.district}</td>
                    <td><span class="badge badge-neutral">${y.status}</span></td>
                    <td>
                      <div class="flex gap-2">
                        <button class="btn btn-secondary btn-view" data-id="${y.id}" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">👁️ View Details</button>
                        <button class="btn btn-primary btn-approve" data-id="${y.id}" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background: var(--success); border-color: var(--success);">✓ Approve</button>
                      </div>
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Processing Overlay -->
      ${isProcessing ? `
        <div class="modal-overlay" style="display: flex; background: rgba(15, 23, 42, 0.95); z-index: 100;">
          <div class="modal-content" style="background: #020617; border: 1px solid #1e293b; color: #38bdf8; font-family: 'Courier New', Courier, monospace; width: 100%; max-width: 600px; padding: 2rem;">
            <h3 style="color: #fff; margin-bottom: 1.5rem; border-bottom: 1px solid #1e293b; padding-bottom: 1rem;">🤖 ML Validation Engine</h3>
            
            <div id="ml-logs-container" style="min-height: 200px; max-height: 300px; overflow-y: auto; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
              ${processLogs.map(log => `<div style="color: ${log.color || '#38bdf8'};">${log.text}</div>`).join('')}
            </div>
            
            <div id="processing-spinner" style="display: block;">
              <span class="spinner" style="width:14px;height:14px;border-width:2px;display:inline-block;margin-top:0.5rem;"></span>
              <span style="margin-left: 0.5rem; font-size: 0.85rem;">Processing data matrix...</span>
            </div>
            
            <div id="ml-close-btn-container" style="display: none;">
              <button class="btn btn-primary btn-close-processing" style="width: 100%; background: #10b981; border-color: #10b981;">Finish & Close</button>
            </div>
          </div>
        </div>
      ` : ''}
      
      <!-- Profile View Modal -->
      ${selectedYouthId && !isProcessing ? (() => {
        const y = pendingYouths.find(u => u.id === selectedYouthId);
        if (!y) return '';
        return `
          <div class="modal-overlay" style="display: flex;">
            <div class="modal-content" style="max-width: 500px;">
              <div class="flex justify-between items-center mb-4">
                <h3 style="margin: 0;">Profile Details: ${y.name}</h3>
                <button class="btn-icon close-modal">✕</button>
              </div>
              <div style="background: var(--surface-hover); padding: 1.5rem; border-radius: var(--radius-md);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div><span class="text-muted" style="font-size: 0.8rem; display: block;">Full Name</span> <strong>${y.name}</strong></div>
                  <div><span class="text-muted" style="font-size: 0.8rem; display: block;">Date of Birth</span> <strong>${y.dob || 'N/A'}</strong></div>
                  <div><span class="text-muted" style="font-size: 0.8rem; display: block;">Age</span> <strong>${y.age}</strong></div>
                  <div><span class="text-muted" style="font-size: 0.8rem; display: block;">Gender</span> <strong>${y.gender}</strong></div>
                  <div><span class="text-muted" style="font-size: 0.8rem; display: block;">District</span> <strong>${y.district}</strong></div>
                  <div><span class="text-muted" style="font-size: 0.8rem; display: block;">PWD Status</span> <strong>${y.pwd}</strong></div>
                </div>
              </div>
              <div class="flex gap-2" style="margin-top: 1.5rem; justify-content: flex-end;">
                <button class="btn btn-secondary close-modal">Close</button>
              </div>
            </div>
          </div>
        `;
      })() : ''}
    `;
    
    // Bind Events
    
    // Check all logic
    const checkAll = container.querySelector('#check-all');
    const checkboxes = container.querySelectorAll('.youth-checkbox');
    if (checkAll) {
      checkAll.addEventListener('change', (e) => {
        checkboxes.forEach(cb => cb.checked = e.target.checked);
      });
    }
    
    // Search logic
    const searchInput = container.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render(); // Immediately re-render with new filter
        const newInput = container.querySelector('#search-input');
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(newInput.value.length, newInput.value.length);
        }
      });
    }
    
    // Manual Approve logic
    container.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const y = pendingYouths.find(u => u.id === id);
        if (y.status === 'Submitted') {
          alert('Cannot approve. This profile is missing Assessment Data. Please complete the assessment first.');
          return;
        }
        
        if (confirm(`Manually approve ${y.name}?`)) {
          const updatedYouths = store.state.youths.map(u => u.id === id ? { ...u, status: 'Assessment Completed' } : u);
          store.setState({ youths: updatedYouths });
          store.addLog(store.state.staffUser?.name || 'System', 'Manual Approve', `Manually approved ${y.name}`);
        }
      });
    });
    
    // ML Processing Run
    const btnRunML = container.querySelector('#btn-run-ml');
    if (btnRunML) {
      btnRunML.addEventListener('click', async () => {
        const selectedIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => parseInt(cb.value));
        if (selectedIds.length === 0) {
          alert('Please select at least one profile to run the ML validation process.');
          return;
        }
        
        isProcessing = true;
        processLogs = [{ text: '> INIT ML Validation Sequence...' }];
        render(); // Initial render to show the modal
        
        const logsContainer = container.querySelector('#ml-logs-container');
        const spinner = container.querySelector('#processing-spinner');
        const closeBtnContainer = container.querySelector('#ml-close-btn-container');
        
        let approvedCount = 0;
        let rejectedCount = 0;
        
        const steps = [];
        steps.push({ text: '> Connecting to centralized beneficiary database...', delay: 300 });
        
        // Generate realistic logs for each selected profile
        const selectedProfiles = pendingYouths.filter(y => selectedIds.includes(y.id));
        
        // Find all already approved profiles to check against for duplicates
        const approvedProfiles = store.state.youths.filter(y => y.status !== 'Submitted' && y.status !== 'Pre-screeing');
        
        selectedProfiles.forEach(profile => {
          steps.push({ text: `> Analyzing profile: ${profile.name} (ID: #${profile.id})`, delay: 200 });
          
          let isDuplicate = false;
          if (profile.phone) {
            const dup = approvedProfiles.find(ap => ap.phone === profile.phone && ap.id !== profile.id);
            if (dup) {
              isDuplicate = true;
              steps.push({ text: `> CROSS-REF ERROR: Duplicate phone number ${profile.phone} found matching ID #${dup.id}.`, delay: 300, color: '#ef4444' });
            } else {
              steps.push({ text: `> Cross-referencing phone ${profile.phone || 'N/A'} for duplicates... No matches found.`, delay: 250 });
            }
          }
          
          if (isDuplicate) {
            steps.push({ 
              text: `> ERROR: Profile ${profile.name} rejected due to duplicate data.`, 
              delay: 300, 
              color: '#ef4444' 
            });
            // Mark it temporarily in object so we can use it in final update
            profile._failedValidation = true;
          } else if (profile.status === 'Submitted') {
            steps.push({ 
              text: `> ERROR: Profile ${profile.name} rejected. Reason: Missing Q&A Assessment Data.`, 
              delay: 300, 
              color: '#ef4444' 
            });
          } else {
            steps.push({ 
              text: `> SUCCESS: Profile ${profile.name} demographic & assessment data verified.`, 
              delay: 300, 
              color: '#10b981' 
            });
          }
        });
        
        steps.push({ text: '> Finalizing ML batch processing...', delay: 400, isFinal: true });
        
        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        
        try {
          for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            await delay(step.delay);
            
            // Append log dynamically to prevent whole UI from blinking
            const div = document.createElement('div');
            div.style.color = step.color || '#38bdf8';
            div.textContent = step.text;
            if (!logsContainer) throw new Error("logsContainer is null");
            logsContainer.appendChild(div);
            logsContainer.scrollTop = logsContainer.scrollHeight;
            
            if (step.isFinal) {
              // Perform data update
              const updatedYouths = store.state.youths.map(y => {
                if (selectedIds.includes(y.id)) {
                  const currentProfile = selectedProfiles.find(sp => sp.id === y.id);
                  if (y.status === 'Submitted' || (currentProfile && currentProfile._failedValidation)) {
                    rejectedCount++;
                    return y; // Do not approve, keep in current state
                  } else {
                    approvedCount++;
                    return { ...y, status: 'Assessment Completed' };
                  }
                }
                return y;
              });
              
              store.setState({ youths: updatedYouths });
              store.addLog(store.state.staffUser?.name || 'System', 'Pre-Screening ML', `Approved ${approvedCount}, Rejected ${rejectedCount}.`);
              
              const finalDiv = document.createElement('div');
              finalDiv.style.color = '#10b981';
              finalDiv.style.marginTop = '1rem';
              finalDiv.textContent = `> PROCESS COMPLETE. ${approvedCount} Approved. ${rejectedCount} Rejected.`;
              logsContainer.appendChild(finalDiv);
              
              if (spinner) spinner.style.display = 'none';
              if (closeBtnContainer) closeBtnContainer.style.display = 'block';
              
              // Bind the finish button
              const finishBtn = closeBtnContainer.querySelector('.btn-close-processing');
              if (finishBtn) {
                finishBtn.addEventListener('click', () => {
                  isProcessing = false;
                  processLogs = [];
                  render();
                });
              }
            }
          }
        } catch (err) {
          const errDiv = document.createElement('div');
          errDiv.style.color = 'red';
          errDiv.textContent = `JS ERROR: ${err.message}`;
          if (logsContainer) logsContainer.appendChild(errDiv);
          else alert(`JS ERROR: ${err.message}`);
        }
      });
    }
    
    const btnCloseProcessing = container.querySelector('.btn-close-processing');
    if (btnCloseProcessing) {
      btnCloseProcessing.addEventListener('click', () => {
        isProcessing = false;
        processLogs = [];
        render(); // This will refresh the table and they will disappear
      });
    }
    
    // View details
    container.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedYouthId = parseInt(e.target.dataset.id);
        render();
      });
    });
    
    // Modals
    container.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedYouthId = null;
        render();
      });
    });
  }

  // Handle store updates
  const unsubscribe = () => {};
  store.subscribe(() => {
    // Only re-render if we are not actively in the processing modal to prevent interruption
    if (!isProcessing) {
      // Don't call render directly here if it causes infinite loops in complex setups,
      // but simple UI it's fine.
    }
  });

  render();
  
  return container;
}
