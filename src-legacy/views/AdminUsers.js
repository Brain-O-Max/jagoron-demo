import { store } from '../store.js';

export function renderAdminUsers() {
  const container = document.createElement('div');
  
  if (store.state.staffUser?.role !== 'System Admin') {
    container.innerHTML = `
      <div class="card text-center" style="margin-top: 4rem;">
        <h2 style="color: var(--accent);">Access Denied</h2>
        <p>You do not have permission to view User Management. (Requires System Admin role)</p>
      </div>
    `;
    return container;
  }
  
  function render() {
    container.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 style="font-size: 2rem;">Users & Roles Administration</h2>
          <p>Create and manage system access, organizational users, and specific RBAC trees.</p>
        </div>
      </div>
      
      <div class="grid-cols-2 gap-4">
        <!-- Create User Form -->
        <div class="card">
          <h3 style="margin-bottom: 1rem;">Create New User</h3>
          <form id="create-user-form">
            <div class="flex gap-4 mb-2">
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Full Name *</label>
                <input type="text" class="form-control" name="name" required>
              </div>
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Mobile *</label>
                <input type="text" class="form-control" name="mobile" required>
              </div>
            </div>
            
            <div class="flex gap-4 mb-2">
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Email Address *</label>
                <input type="email" class="form-control" name="email" required>
              </div>
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Designation</label>
                <input type="text" class="form-control" name="designation">
              </div>
            </div>

            <div class="flex gap-4 mb-2">
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Date of Birth (Optional)</label>
                <input type="date" class="form-control" name="dob">
              </div>
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Joining Date (Optional)</label>
                <input type="date" class="form-control" name="joiningDate">
              </div>
            </div>

            <div class="flex gap-4 mb-2">
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Location / Area</label>
                <input type="text" class="form-control" name="location" required>
              </div>
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Organization Name</label>
                <select class="form-control" name="org">
                  <option>CARE Bangladesh</option>
                  <option>SOS Childrens Village</option>
                  <option>Donor Agency</option>
                  <option>Local YLO</option>
                </select>
              </div>
            </div>

            <div class="form-group mb-2">
              <label class="form-label">Address</label>
              <textarea class="form-control" name="address" rows="2"></textarea>
            </div>
            
            <div class="form-group mb-4">
              <label class="form-label">System Role *</label>
              <select class="form-control" name="role">
                ${store.state.roles.map(r => `<option>${r.name}</option>`).join('')}
              </select>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">Create User</button>
          </form>
        </div>
        
        <!-- Create Role Form -->
        <div class="card">
          <h3 style="margin-bottom: 1rem;">Create Custom Role</h3>
          <form id="create-role-form">
            <div class="form-group">
              <label class="form-label">Role Name *</label>
              <input type="text" class="form-control" name="roleName" placeholder="e.g. Area Coordinator" required>
            </div>
            <div class="form-group">
              <label class="form-label">Role Permissions (Tree Format)</label>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; max-height: 380px; overflow-y: auto;">
                
                <!-- Tree Node: Dashboards -->
                <div style="margin-bottom: 0.5rem;">
                  <label style="font-weight: 600;"><input type="checkbox" class="parent-cb"> Dashboards</label>
                  <div style="margin-left: 1.5rem; margin-top: 0.2rem;">
                    <label style="display: block;"><input type="checkbox" name="perms" value="operational_dashboard"> Operational Dashboard</label>
                    <label style="display: block;"><input type="checkbox" name="perms" value="donor_dashboard"> Donor Dashboard</label>
                  </div>
                </div>

                <!-- Tree Node: Operations -->
                <div style="margin-bottom: 0.5rem;">
                  <label style="font-weight: 600;"><input type="checkbox" class="parent-cb"> Core Operations</label>
                  <div style="margin-left: 1.5rem; margin-top: 0.2rem;">
                    <label style="display: block;"><input type="checkbox" name="perms" value="manage_beneficiaries"> Manage Beneficiaries</label>
                    <label style="display: block;"><input type="checkbox" name="perms" value="run_assessment"> Run Assessments & ML</label>
                    <label style="display: block;"><input type="checkbox" name="perms" value="bulk_sms"> Bulk SMS Campaigns</label>
                    <label style="display: block;"><input type="checkbox" name="perms" value="follow_up"> Progress Follow-up</label>
                  </div>
                </div>

                <!-- Tree Node: Admin -->
                <div style="margin-bottom: 0.5rem;">
                  <label style="font-weight: 600;"><input type="checkbox" class="parent-cb"> Administration & Config</label>
                  <div style="margin-left: 1.5rem; margin-top: 0.2rem;">
                    <label style="display: block;"><input type="checkbox" name="perms" value="reports"> Reports & Exports</label>
                    <label style="display: block;"><input type="checkbox" name="perms" value="question_bank"> Manage Question Bank</label>
                    <label style="display: block;"><input type="checkbox" name="perms" value="manage_users"> Users & Roles (RBAC)</label>
                    <label style="display: block;"><input type="checkbox" name="perms" value="mis_sync"> Central MIS Sync</label>
                  </div>
                </div>

              </div>
            </div>
            <button type="submit" class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">Save Custom Role</button>
          </form>
        </div>
      </div>
      
      <div class="card mt-4">
        <h3 style="margin-bottom: 1rem;">Active User Directory</h3>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role & Org</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${store.state.staffUsers.map(u => `
                <tr style="${u.status === 'Disabled' ? 'opacity: 0.6; background: var(--surface-hover);' : ''}">
                  <td>
                    <div style="font-weight: 600;">${u.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${u.designation || 'Staff'}</div>
                  </td>
                  <td>
                    <div><span class="badge ${u.role === 'System Admin' ? 'badge-info' : 'badge-neutral'}">${u.role}</span></div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${u.org}</div>
                  </td>
                  <td style="font-size: 0.85rem;">
                    <div>📧 ${u.email}</div>
                    <div>📱 ${u.mobile || 'N/A'}</div>
                  </td>
                  <td><span class="badge ${u.status === 'Active' ? 'badge-success' : 'badge-neutral'}">${u.status}</span></td>
                  <td>
                    <button class="btn btn-secondary action-btn" data-action="edit" data-id="${u.id}" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; margin-bottom: 2px;">Edit</button>
                    <button class="btn btn-secondary action-btn" data-action="reset" data-id="${u.id}" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; margin-bottom: 2px;">Reset Pwd</button>
                    <br>
                    <button class="btn btn-secondary action-btn" data-action="${u.status === 'Active' ? 'disable' : 'enable'}" data-id="${u.id}" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; color: var(--warning); border-color: var(--warning);">
                      ${u.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                    <button class="btn btn-secondary action-btn" data-action="delete" data-id="${u.id}" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; color: var(--accent); border-color: var(--accent);">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Tree Checkbox Logic
    const parentCbs = container.querySelectorAll('.parent-cb');
    parentCbs.forEach(pcb => {
      pcb.addEventListener('change', (e) => {
        const childCbs = e.target.parentElement.nextElementSibling.querySelectorAll('input[type="checkbox"]');
        childCbs.forEach(ccb => ccb.checked = e.target.checked);
      });
    });

    // Form Submissions
    const userForm = container.querySelector('#create-user-form');
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(userForm);
      const newUser = {
        id: Date.now(),
        name: fd.get('name'),
        email: fd.get('email'),
        mobile: fd.get('mobile'),
        designation: fd.get('designation'),
        dob: fd.get('dob'),
        joiningDate: fd.get('joiningDate'),
        location: fd.get('location'),
        org: fd.get('org'),
        address: fd.get('address'),
        role: fd.get('role'),
        status: 'Active'
      };
      
      store.setState({ staffUsers: [...store.state.staffUsers, newUser] });
      store.addLog(store.state.staffUser.name, 'Manage Users', `Created new user: ${newUser.name}`);
      render(); // Re-render local view
    });

    const roleForm = container.querySelector('#create-role-form');
    roleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(roleForm);
      const perms = fd.getAll('perms');
      const roleName = fd.get('roleName');
      
      store.setState({ roles: [...store.state.roles, { name: roleName, permissions: perms }] });
      store.addLog(store.state.staffUser.name, 'Manage Roles', `Created custom role: ${roleName}`);
      render(); // Re-render local view to show in dropdown
    });

    // Action Delegation
    container.addEventListener('click', (e) => {
      if (!e.target.classList.contains('action-btn')) return;
      
      const action = e.target.dataset.action;
      const id = parseInt(e.target.dataset.id);
      const uIndex = store.state.staffUsers.findIndex(u => u.id === id);
      if (uIndex === -1) return;
      
      const user = store.state.staffUsers[uIndex];

      if (action === 'delete') {
        if (confirm(`Delete user ${user.name} entirely?`)) {
          store.state.staffUsers.splice(uIndex, 1);
          store.setState({ staffUsers: [...store.state.staffUsers] });
          store.addLog(store.state.staffUser.name, 'Manage Users', `Deleted user: ${user.name}`);
          render();
        }
      } else if (action === 'disable' || action === 'enable') {
        user.status = action === 'disable' ? 'Disabled' : 'Active';
        store.setState({ staffUsers: [...store.state.staffUsers] });
        store.addLog(store.state.staffUser.name, 'Manage Users', `${action}d user: ${user.name}`);
        render();
      } else if (action === 'reset') {
        alert(`Password for ${user.name} has been reset to: 123456`);
        store.addLog(store.state.staffUser.name, 'Manage Users', `Reset password for: ${user.name}`);
      } else if (action === 'edit') {
        alert("Edit user form functionality (would populate form up top)");
      }
    });
  }
  
  render();
  return container;
}
