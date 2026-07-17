import { navigateTo } from '../main.js';
import { store } from '../store.js';

export function renderAssessmentEngine() {
  const container = document.createElement('div');
  
  let searchQuery = '';
  let districtFilter = 'All Districts';
  let statusFilter = 'All Statuses';
  
  function render() {
    // Filter youths who need assessment or processing
    let targetYouths = store.state.youths.filter(y => 
      y.status === 'Assessment Pending' || 
      y.status === 'Assessment Completed' || 
      y.status === 'Assessed' || 
      y.status === 'Profiled' // fallback for older states
    );
    
    // Apply filters
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      targetYouths = targetYouths.filter(y => 
        (y.name && y.name.toLowerCase().includes(q)) || 
        (y.id && y.id.toString().includes(q))
      );
    }
    
    if (districtFilter !== 'All Districts') {
      targetYouths = targetYouths.filter(y => y.district === districtFilter);
    }
    
    if (statusFilter !== 'All Statuses') {
      if (statusFilter === 'Pending Assessment') {
        targetYouths = targetYouths.filter(y => y.status === 'Assessment Pending');
      } else if (statusFilter === 'Pending AI Processing') {
        targetYouths = targetYouths.filter(y => y.status === 'Assessment Completed');
      } else if (statusFilter === 'Assessed') {
        targetYouths = targetYouths.filter(y => y.status === 'Assessed' || y.status === 'Profiled');
      }
    }
    
    const pendingProcessing = targetYouths.filter(y => y.status === 'Assessment Completed' || y.status === 'Assessed' || y.status === 'Profiled');
    
    container.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 style="font-size: 2rem;">Assessment Engine</h2>
          <p>Run psychometric profiling and trigger AI Processing Engines.</p>
        </div>
        <div style="display: flex; gap: 1rem;">
          <button id="btn-bulk-assess" class="btn btn-primary" style="background: var(--accent); border-color: var(--accent); display: none;">
            📋 Bulk Assess Selected (0)
          </button>
          <button id="btn-run-all" class="btn btn-primary" ${pendingProcessing.length === 0 ? 'disabled style="opacity:0.5"' : ''}>
            🚀 Run AI Engine (${pendingProcessing.length} Available)
          </button>
        </div>
      </div>
      
      <div class="card mb-4" style="background: var(--surface-hover);">
        <h3 style="margin-bottom: 1rem;">Filter Profiles</h3>
        <div class="flex gap-4">
          <input type="text" id="search-input" class="form-control" placeholder="Search ID or Name..." value="${searchQuery}">
          <select id="district-filter" class="form-control">
            <option ${districtFilter === 'All Districts' ? 'selected' : ''}>All Districts</option>
            <option ${districtFilter === 'Khulna' ? 'selected' : ''}>Khulna</option>
            <option ${districtFilter === 'Gazipur' ? 'selected' : ''}>Gazipur</option>
          </select>
          <select id="status-filter" class="form-control">
            <option ${statusFilter === 'All Statuses' ? 'selected' : ''}>All Statuses</option>
            <option ${statusFilter === 'Pending Assessment' ? 'selected' : ''}>Pending Assessment</option>
            <option ${statusFilter === 'Pending AI Processing' ? 'selected' : ''}>Pending AI Processing</option>
            <option ${statusFilter === 'Assessed' ? 'selected' : ''}>Assessed</option>
          </select>
        </div>
      </div>
      
      <div class="card">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style="width: 40px;"><input type="checkbox" id="check-all-assess" /></th>
                <th>ID</th>
                <th>Name</th>
                <th>District</th>
                <th>Assessment Date</th>
                <th>Assessment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="engine-table">
              <!-- Content -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    const tbody = container.querySelector('#engine-table');
  
  if (targetYouths.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No profiles available.</td></tr>';
  } else {
    targetYouths.forEach(y => {
      const tr = document.createElement('tr');
      // Format the date or provide a fallback if it was just registered without a date
      const dateStr = y.updatedAt ? new Date(y.updatedAt).toLocaleString() : new Date().toLocaleString();
      
      let actionBtn = '';
      if (y.status === 'Assessment Pending') {
        actionBtn = `<button class="btn btn-primary start-btn" data-id="${y.id}" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">Start Q&A</button>`;
      } else if (y.status === 'Assessment Completed') {
        actionBtn = `<button class="btn btn-secondary process-btn" data-id="${y.id}" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; color: var(--accent); border-color: var(--accent);">Run AI Engine</button>`;
      } else if (y.status === 'Assessed' || y.status === 'Profiled') {
        actionBtn = `
          <div class="flex gap-2">
            <button class="btn btn-secondary view-btn" data-id="${y.id}" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">View Profile</button>
            <button class="btn btn-secondary process-btn" data-id="${y.id}" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; color: var(--warning); border-color: var(--warning);">Re-run AI</button>
          </div>
        `;
      }

      let badgeClass = 'badge-neutral';
      if (y.status === 'Assessment Pending') badgeClass = 'badge-neutral';
      if (y.status === 'Assessment Completed') badgeClass = 'badge-primary" style="background: var(--primary); color: white;"';
      if (y.status === 'Assessed' || y.status === 'Profiled') badgeClass = 'badge-success';

      tr.innerHTML = `
        <td>${y.status === 'Assessment Pending' ? `<input type="checkbox" class="assess-checkbox" value="${y.id}" />` : ''}</td>
        <td style="font-weight: 500;">#${y.id.toString().padStart(4, '0')}</td>
        <td>${y.name}</td>
        <td>${y.district}</td>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${y.status !== 'Assessment Pending' ? dateStr : 'Pending...'}</td>
        <td><span class="badge ${badgeClass}">${y.status}</span></td>
        <td>${actionBtn}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  // Filter Event Listeners
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
  
  const districtFilterEl = container.querySelector('#district-filter');
  if (districtFilterEl) {
    districtFilterEl.addEventListener('change', (e) => {
      districtFilter = e.target.value;
      render();
    });
  }
  
  const statusFilterEl = container.querySelector('#status-filter');
  if (statusFilterEl) {
    statusFilterEl.addEventListener('change', (e) => {
      statusFilter = e.target.value;
      render();
    });
  }
  
  container.querySelector('#btn-run-all').addEventListener('click', () => {
    if (pendingProcessing.length > 0) {
      navigateTo('/processing', { bulk: true, targets: pendingProcessing.map(y => y.id), from: '/assessment-engine' });
    }
  });
  
  // Bulk Assess Logic
  const checkAll = container.querySelector('#check-all-assess');
  const checkboxes = container.querySelectorAll('.assess-checkbox');
  const btnBulkAssess = container.querySelector('#btn-bulk-assess');
  
  function updateBulkAssessBtn() {
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    if (checkedCount > 0) {
      btnBulkAssess.style.display = 'block';
      btnBulkAssess.innerText = `📋 Bulk Assess Selected (${checkedCount})`;
    } else {
      btnBulkAssess.style.display = 'none';
    }
  }

  if (checkAll) {
    checkAll.addEventListener('change', (e) => {
      checkboxes.forEach(cb => cb.checked = e.target.checked);
      updateBulkAssessBtn();
    });
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateBulkAssessBtn));
  
  if (btnBulkAssess) {
    btnBulkAssess.addEventListener('click', () => {
      const selectedIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => parseInt(cb.value));
      if (selectedIds.length > 0) {
        navigateTo('/assessment', { bulk: true, targets: selectedIds });
      }
    });
  }

  // Individual start logic
  container.querySelectorAll('.start-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      navigateTo('/assessment', { youthId: id });
    });
  });

  tbody.addEventListener('click', (e) => {
    const processBtn = e.target.closest('.process-btn');
    const viewBtn = e.target.closest('.view-btn');
    
    if (processBtn) {
      navigateTo('/processing', { bulk: false, targets: [parseInt(processBtn.dataset.id)], from: '/assessment-engine' });
    } else if (viewBtn) {
      navigateTo('/results', { youthId: viewBtn.dataset.id, from: '/assessment-engine' });
    }
  });

  } // end render()
  
  render();

  return container;
}
