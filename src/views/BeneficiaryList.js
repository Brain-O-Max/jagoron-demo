import { navigateTo } from '../main.js';
import { store } from '../store.js';

export function renderBeneficiaryList() {
  const container = document.createElement('div');
  
  let searchQuery = '';
  
  function render() {
    container.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 style="font-size: 2rem;">Beneficiary Management</h2>
        <p>Manage registrations, assessments, and notifications.</p>
      </div>
      <div class="flex gap-4">
        <button id="btn-register" class="btn btn-primary">+ Register New Youth</button>
      </div>
    </div>
    
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <div style="position: relative; width: 300px;">
          <input type="text" id="search-input" class="form-control" placeholder="Search by name or ID..." style="padding-left: 2.5rem;" value="${searchQuery}">
          <span style="position: absolute; left: 1rem; top: 0.75rem; color: var(--text-muted);">🔍</span>
        </div>
        <div class="flex gap-2">
          <select class="form-control" style="width: auto;">
            <option>All Districts</option>
            <option>Khulna</option>
            <option>Gazipur</option>
          </select>
          <select class="form-control" style="width: auto;">
            <option>All Statuses</option>
            <option>Submitted</option>
            <option>Pre-screeing</option>
            <option>Assessment Pending</option>
            <option>Assessment Completed</option>
            <option>Profiled</option>
          </select>
        </div>
      </div>
      
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox"></th>
              <th>ID</th>
              <th>Name & Demographics</th>
              <th>District</th>
              <th>Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody id="youth-table-body">
            <!-- Dynamic Content -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- SMS Modal -->
    <div id="sms-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
        <h3 id="sms-modal-title" style="margin-bottom: 1rem;">Send SMS</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">The message will be queued and sent via ${store.state.smsConfig.provider}.</p>
        
        <div class="form-group">
          <label class="form-label">Template</label>
          <select id="sms-template" class="form-control">
            <option value="assessmentReady">Assessment Results Ready</option>
            <option value="custom">Custom Message</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Message Preview</label>
          <textarea id="sms-body" class="form-control" rows="4"></textarea>
        </div>
        
        <div class="flex justify-end gap-4 mt-4">
          <button id="btn-cancel-sms" class="btn btn-secondary">Cancel</button>
          <button id="btn-send-sms" class="btn btn-primary">Send Message</button>
        </div>
      </div>
    </div>
  `;
  
  const tbody = container.querySelector('#youth-table-body');
  
  let filteredYouths = store.state.youths;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredYouths = filteredYouths.filter(y => 
      (y.name && y.name.toLowerCase().includes(q)) || 
      (y.phone && y.phone.includes(q)) ||
      (y.id && y.id.toString().includes(q))
    );
  }
  
  if (filteredYouths.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 3rem; color: var(--text-muted);">No beneficiaries found.</td></tr>`;
  } else {
    filteredYouths.forEach(youth => {
      const tr = document.createElement('tr');
      
      let statusBadge = '';
      if (youth.status === 'Submitted') statusBadge = `<span class="badge badge-neutral">Submitted</span>`;
      else if (youth.status === 'Pre-screeing') statusBadge = `<span class="badge badge-neutral">Pre-screeing</span>`;
      else if (youth.status === 'Assessment Pending') statusBadge = `<span class="badge badge-warning">Assess Pending</span>`;
      else if (youth.status === 'Assessment Completed') statusBadge = `<span class="badge badge-primary" style="background: var(--primary); color: white;">AI Processing Pending</span>`;
      else if (youth.status === 'Assessed' || youth.status === 'Profiled') statusBadge = `<span class="badge badge-success">Assessed / Completed</span>`;
      else statusBadge = `<span class="badge badge-neutral">${youth.status}</span>`;
      
      tr.innerHTML = `
        <td><input type="checkbox" value="${youth.id}"></td>
        <td style="font-weight: 500;">#${youth.id.toString().padStart(4, '0')}</td>
        <td>
          <div style="font-weight: 600;">${youth.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${youth.age} yrs • ${youth.gender}</div>
        </td>
        <td>${youth.district}</td>
        <td>${statusBadge}</td>
        <td>
          <div class="flex justify-center gap-2">
            ${youth.status === 'Submitted'
              ? `<button class="btn btn-primary start-btn" data-id="${youth.id}" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">Take Assessment</button>`
              : ''
            }
            ${['Assessment Completed', 'Profiled'].includes(youth.status) 
              ? `<button class="btn btn-secondary view-btn" data-id="${youth.id}" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">View Profile</button>`
              : ''
            }
            <button class="btn-icon edit-btn" data-id="${youth.id}" title="Edit Profile">✏️</button>
            <button class="btn-icon delete-btn" data-id="${youth.id}" title="Delete Profile" style="color: #ef4444;">🗑️</button>
            <button class="btn-icon sms-btn" data-id="${youth.id}" data-name="${youth.name}" title="Send SMS">💬</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  // Navigation Events
  container.querySelector('#btn-register').addEventListener('click', () => navigateTo('/register-youth'));
  
  // Table Action Delegation
  tbody.addEventListener('click', (e) => {
    const startBtn = e.target.closest('.start-btn');
    const viewBtn = e.target.closest('.view-btn');
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    const smsBtn = e.target.closest('.sms-btn');
    
    if (startBtn) {
      store.setState({ currentYouthId: parseInt(startBtn.dataset.id) });
      navigateTo('/assessment', { youthId: startBtn.dataset.id });
    } else if (viewBtn) {
      store.setState({ currentYouthId: parseInt(viewBtn.dataset.id) });
      navigateTo('/results', { youthId: viewBtn.dataset.id });
    } else if (editBtn) {
      navigateTo('/register-youth', { editId: editBtn.dataset.id });
    } else if (deleteBtn) {
      if(confirm('Are you sure you want to permanently delete this beneficiary?')) {
        const idToDelete = parseInt(deleteBtn.dataset.id);
        const updatedYouths = store.state.youths.filter(y => y.id !== idToDelete);
        store.setState({ youths: updatedYouths });
        render();
      }
    } else if (smsBtn) {
      openSmsModal(smsBtn.dataset.name, smsBtn.dataset.id);
    }
  });

  // SMS Modal Logic
  const modal = container.querySelector('#sms-modal');
  const txtBody = container.querySelector('#sms-body');
  let activeSmsId = null;
  
  function openSmsModal(name = 'Participants', id = null) {
    activeSmsId = id;
    container.querySelector('#sms-modal-title').textContent = `Send SMS to ${name}`;
    
    // Auto-fill template
    let tmpl = store.state.smsConfig.templates.assessmentReady;
    tmpl = tmpl.replace('{name}', name).replace('{pathway}', '[Recommended Pathway]');
    txtBody.value = tmpl;
    
    modal.style.display = 'flex';
  }

  
  container.querySelector('#btn-cancel-sms').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  container.querySelector('#btn-send-sms').addEventListener('click', () => {
    modal.style.display = 'none';
    alert('SMS queued for delivery successfully!');
    store.addLog(store.state.staffUser.name, 'SMS Sent', 'Sent SMS to participant(s)');
  });
  
  const searchInput = container.querySelector('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
      const newInput = container.querySelector('#search-input');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length);
      }
    });
  }
  
  } // end render()
  
  render();

  return container;
}
