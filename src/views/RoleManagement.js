import { store } from '../store.js';

export function renderRoleManagement() {
  const container = document.createElement('div');
  
  if (store.state.staffUser?.role !== 'Admin') {
    container.innerHTML = `
      <div class="card text-center" style="margin-top: 4rem;">
        <h2 style="color: var(--accent);">Access Denied</h2>
        <p>You do not have permission to view Role Management. (Requires Admin role)</p>
      </div>
    `;
    return container;
  }
  
  function render() {
    container.innerHTML = `
      <style>
        .role-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .role-card {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }
        .role-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-color: var(--primary);
        }
        .role-title {
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--primary-dark);
          margin-bottom: 0.5rem;
        }
        .role-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          flex-grow: 1;
        }
        .role-meta {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0,0,0,0.05);
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          justify-content: space-between;
        }
        
        .perm-tree {
          border: 1px solid rgba(0,0,0,0.1); 
          border-radius: 8px; 
          padding: 1rem; 
          max-height: 400px; 
          overflow-y: auto;
          background: rgba(255,255,255,0.5);
        }
      </style>
      
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 style="font-size: 2rem;">Role Management (RBAC)</h2>
          <p>Configure industry-standard access control and custom permission trees.</p>
        </div>
        <button class="btn btn-primary" id="btn-new-role">+ Create New Role</button>
      </div>
      
      <!-- Role Table -->
      <div class="card" style="background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.8);">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Description</th>
                <th>Users Assigned</th>
                <th>Permissions Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${store.state.roles.map(r => {
                const userCount = store.state.staffUsers.filter(u => u.role === r.name).length;
                return `
                  <tr>
                    <td style="font-weight: 600; color: var(--primary-dark);">${r.name}</td>
                    <td style="color: var(--text-muted); font-size: 0.85rem;">${r.description || 'No description provided.'}</td>
                    <td><span class="badge badge-neutral">👥 ${userCount} Users</span></td>
                    <td><span class="badge badge-info">🛡️ ${r.permissions.length} Perms</span></td>
                    <td>
                      <button class="btn btn-secondary action-perms" data-role="${r.name}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">
                        ⚙️ Permissions
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Create Role Modal -->
      <div id="create-role-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content" style="max-width: 500px; background: rgba(255,255,255,0.95); backdrop-filter: blur(20px);">
          <h3 style="margin-bottom: 1rem;">Create New Role</h3>
          <form id="create-role-form">
            <div class="form-group">
              <label class="form-label">Role Name *</label>
              <input type="text" class="form-control" name="roleName" required placeholder="e.g. Master Trainer">
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea class="form-control" name="roleDesc" rows="3" placeholder="What is the purpose of this role?"></textarea>
            </div>
            <div class="flex justify-end gap-4 mt-4">
              <button type="button" class="btn btn-secondary close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Role</button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Edit Permissions Modal -->
      <div id="edit-perms-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content" style="max-width: 600px; background: rgba(255,255,255,0.95); backdrop-filter: blur(20px);">
          <h3 style="margin-bottom: 0.5rem;" id="perm-role-name">Configure Permissions</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">Select the modules this role can access.</p>
          
          <form id="edit-perms-form">
            <input type="hidden" name="activeRole">
            <div class="perm-tree">
              <!-- Tree Node: Dashboards -->
              <div style="margin-bottom: 0.5rem;">
                <label style="font-weight: 600; cursor: pointer;"><input type="checkbox" class="parent-cb"> Dashboards</label>
                <div style="margin-left: 1.5rem; margin-top: 0.2rem;">
                  <label style="display: block; cursor: pointer;"><input type="checkbox" name="perms" value="dashboard"> Operational Dashboard</label>
                  <label style="display: block; cursor: pointer;"><input type="checkbox" name="perms" value="donor_dashboard"> Donor Dashboard</label>
                </div>
              </div>

              <!-- Tree Node: Operations -->
              <div style="margin-bottom: 0.5rem;">
                <label style="font-weight: 600; cursor: pointer;"><input type="checkbox" class="parent-cb"> Core Operations</label>
                <div style="margin-left: 1.5rem; margin-top: 0.2rem;">
                  <label style="display: block; cursor: pointer;"><input type="checkbox" name="perms" value="manage_beneficiaries"> Manage Beneficiaries</label>
                  <label style="display: block; cursor: pointer;"><input type="checkbox" name="perms" value="assess_youth"> Run Assessments & ML</label>
                  <label style="display: block; cursor: pointer;"><input type="checkbox" name="perms" value="bulk_sms"> Bulk SMS Campaigns</label>
                  <label style="display: block; cursor: pointer;"><input type="checkbox" name="perms" value="follow_up"> Progress Follow-up</label>
                </div>
              </div>

              <!-- Tree Node: Admin -->
              <div style="margin-bottom: 0.5rem;">
                <label style="font-weight: 600; cursor: pointer;"><input type="checkbox" class="parent-cb"> Administration & Config</label>
                <div style="margin-left: 1.5rem; margin-top: 0.2rem;">
                  <label style="display: block; cursor: pointer;"><input type="checkbox" name="perms" value="reports"> Reports & Exports</label>
                  <label style="display: block; cursor: pointer;"><input type="checkbox" name="perms" value="question_bank"> Manage Question Bank</label>
                  <label style="display: block; cursor: pointer;"><input type="checkbox" name="perms" value="manage_users"> User Management</label>
                  <label style="display: block; cursor: pointer;"><input type="checkbox" name="perms" value="manage_roles"> Role Management (RBAC)</label>
                  <label style="display: block; cursor: pointer;"><input type="checkbox" name="perms" value="mis_sync"> Central MIS Sync</label>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-4 mt-4">
              <button type="button" class="btn btn-secondary close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Permissions</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Modal toggles
    const createModal = container.querySelector('#create-role-modal');
    const permsModal = container.querySelector('#edit-perms-modal');
    
    container.querySelector('#btn-new-role').addEventListener('click', () => {
      createModal.style.display = 'flex';
    });
    
    container.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        createModal.style.display = 'none';
        permsModal.style.display = 'none';
      });
    });

    // Parent Checkbox Logic
    container.querySelectorAll('.parent-cb').forEach(pcb => {
      pcb.addEventListener('change', (e) => {
        const childCbs = e.target.parentElement.nextElementSibling.querySelectorAll('input[type="checkbox"]');
        childCbs.forEach(ccb => ccb.checked = e.target.checked);
      });
    });

    // Open Permissions Modal via button
    container.querySelectorAll('.action-perms').forEach(btn => {
      btn.addEventListener('click', () => {
        const roleName = btn.dataset.role;
        const roleObj = store.state.roles.find(r => r.name === roleName);
        
        container.querySelector('#perm-role-name').textContent = `Configure Permissions: ${roleName}`;
        container.querySelector('input[name="activeRole"]').value = roleName;
        
        // Check the boxes
        const form = container.querySelector('#edit-perms-form');
        form.querySelectorAll('input[name="perms"]').forEach(cb => {
          cb.checked = roleObj.permissions.includes(cb.value);
        });
        
        permsModal.style.display = 'flex';
      });
    });

    // Handle Create Role
    const createForm = container.querySelector('#create-role-form');
    createForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(createForm);
      const roleName = fd.get('roleName');
      const desc = fd.get('roleDesc');
      
      store.setState({ roles: [...store.state.roles, { name: roleName, description: desc, permissions: [] }] });
      store.addLog(store.state.staffUser.name, 'Manage Roles', `Created custom role: ${roleName}`);
      render();
    });

    // Handle Save Permissions
    const permsForm = container.querySelector('#edit-perms-form');
    permsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(permsForm);
      const roleName = fd.get('activeRole');
      const perms = fd.getAll('perms');
      
      const rIndex = store.state.roles.findIndex(r => r.name === roleName);
      if (rIndex !== -1) {
        store.state.roles[rIndex].permissions = perms;
        store.setState({ roles: [...store.state.roles] });
        store.addLog(store.state.staffUser.name, 'Manage Roles', `Updated permissions for role: ${roleName}`);
      }
      render();
    });
  }
  
  render();
  return container;
}
