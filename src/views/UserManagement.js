import { store } from '../store.js';

export function renderUserManagement() {
  const container = document.createElement('div');
  
  if (store.state.staffUser?.role !== 'Admin') {
    container.innerHTML = `
      <div class="card text-center" style="margin-top: 4rem;">
        <h2 style="color: var(--accent);">Access Denied</h2>
        <p>You do not have permission to view User Management. (Requires Admin role)</p>
      </div>
    `;
    return container;
  }
  
  // State for toggling views
  let currentView = 'table'; // 'table' or 'form'
  let uploadedPhotoURL = '';
  let editingUserId = null;
  
  function render() {
    if (currentView === 'table') {
      container.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 style="font-size: 2rem;">User Management</h2>
            <p>Manage staff accounts, edit user details, and handle security credentials.</p>
          </div>
          <button class="btn btn-primary" id="btn-add-user">+ Add New User</button>
        </div>
        
        <div class="card" style="background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.8);">
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>User Details</th>
                  <th>Role & Org</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${store.state.staffUsers.map(u => `
                  <tr style="${u.status === 'Disabled' ? 'opacity: 0.6; background: rgba(0,0,0,0.02);' : ''}">
                    <td>
                      <div style="width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        ${u.photo ? `<img src="${u.photo}" style="width: 100%; height: 100%; object-fit: cover;">` : `<span style="color: #64748b; font-weight: bold;">${u.name.charAt(0)}</span>`}
                      </div>
                    </td>
                    <td>
                      <div style="font-weight: 600;">${u.name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${u.designation || 'Staff'}</div>
                    </td>
                    <td>
                      <div><span class="badge ${u.role === 'Admin' ? 'badge-info' : 'badge-neutral'}">${u.role}</span></div>
                      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${u.org}</div>
                    </td>
                    <td style="font-size: 0.85rem;">
                      <div>📧 ${u.email}</div>
                      <div>📱 ${u.mobile || 'N/A'}</div>
                    </td>
                    <td><span class="badge ${u.status === 'Active' ? 'badge-success' : 'badge-neutral'}">${u.status}</span></td>
                    <td>
                      <div style="display: flex; gap: 0.25rem;">
                        <button class="btn btn-secondary action-btn" data-action="edit" data-id="${u.id}" title="Edit User" style="padding: 0.2rem 0.5rem; font-size: 1rem;">✏️</button>
                        <button class="btn btn-secondary action-btn" data-action="reset" data-id="${u.id}" title="Reset Password" style="padding: 0.2rem 0.5rem; font-size: 1rem;">🔑</button>
                        <button class="btn btn-secondary action-btn" data-action="${u.status === 'Active' ? 'disable' : 'enable'}" data-id="${u.id}" title="${u.status === 'Active' ? 'Disable User' : 'Enable User'}" style="padding: 0.2rem 0.5rem; font-size: 1rem;">
                          ${u.status === 'Active' ? '🚫' : '✅'}
                        </button>
                        <button class="btn btn-secondary action-btn" data-action="delete" data-id="${u.id}" title="Delete User" style="padding: 0.2rem 0.5rem; font-size: 1rem;">🗑️</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      container.querySelector('#btn-add-user').addEventListener('click', () => {
        currentView = 'form';
        uploadedPhotoURL = '';
        editingUserId = null;
        render();
      });

      // Actions
      container.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const action = e.target.dataset.action;
          const id = parseInt(e.target.dataset.id);
          const uIndex = store.state.staffUsers.findIndex(u => u.id === id);
          if (uIndex === -1) return;
          
          const user = store.state.staffUsers[uIndex];

          if (action === 'edit') {
            currentView = 'form';
            editingUserId = user.id;
            uploadedPhotoURL = user.photo || '';
            render();
            
            // Populate form fields after rendering
            setTimeout(() => {
              const form = container.querySelector('#create-user-form');
              if (form) {
                form.name.value = user.name || '';
                form.email.value = user.email || '';
                form.mobile.value = user.mobile || '';
                form.designation.value = user.designation || '';
                form.role.value = user.role || '';
                form.org.value = user.org || '';
                form.dob.value = user.dob || '';
                form.joiningDate.value = user.joiningDate || '';
                form.location.value = user.location || '';
                form.address.value = user.address || '';
              }
            }, 0);
          } else if (action === 'delete') {
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
          }
        });
      });

    } else {
      // FORM VIEW
      container.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 style="font-size: 2rem;">${editingUserId ? 'Edit User Profile' : 'Create New User'}</h2>
            <p>${editingUserId ? 'Update the staff account information.' : 'Provision a new staff account and assign an organizational role.'}</p>
          </div>
          <button class="btn btn-secondary" id="btn-back">← Back to List</button>
        </div>
        
        <div class="card" style="background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.8); max-width: 900px; margin: 0 auto;">
          <form id="create-user-form">
            <div style="display: flex; gap: 2rem;">
              
              <!-- Left Side: Photo Upload -->
              <div style="width: 250px; flex-shrink: 0; text-align: center;">
                <label class="form-label text-left w-full">User Photo (Optional)</label>
                <div id="photo-drop" style="width: 100%; height: 250px; border: 2px dashed #cbd5e1; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; cursor: pointer; overflow: hidden; position: relative;">
                  ${uploadedPhotoURL 
                    ? `<img src="${uploadedPhotoURL}" style="width:100%; height:100%; object-fit: cover;">` 
                    : `<div style="font-size: 3rem; color: #cbd5e1;">📸</div><div style="color: #64748b; font-size: 0.85rem; margin-top: 1rem;">Click or Drag Photo</div>`
                  }
                </div>
                <input type="file" id="photo-input" accept="image/*" style="display: none;">
              </div>
              
              <!-- Right Side: Details -->
              <div style="flex: 1;">
                <div class="flex gap-4 mb-3">
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label">Full Name *</label>
                    <input type="text" class="form-control" name="name" required>
                  </div>
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label">Email Address *</label>
                    <input type="email" class="form-control" name="email" required>
                  </div>
                </div>
                
                <div class="flex gap-4 mb-3">
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label">Mobile *</label>
                    <input type="text" class="form-control" name="mobile" required>
                  </div>
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label">Designation</label>
                    <input type="text" class="form-control" name="designation">
                  </div>
                </div>

                <div class="flex gap-4 mb-3">
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label">System Role *</label>
                    <select class="form-control" name="role" required>
                      ${store.state.roles.map(r => `<option value="${r.name}">${r.name}</option>`).join('')}
                    </select>
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

                <div class="flex gap-4 mb-3">
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label">Date of Birth</label>
                    <input type="date" class="form-control" name="dob">
                  </div>
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label">Joining Date</label>
                    <input type="date" class="form-control" name="joiningDate">
                  </div>
                </div>

                <div class="form-group mb-3">
                  <label class="form-label">Location / Area</label>
                  <input type="text" class="form-control" name="location">
                </div>

                <div class="form-group mb-4">
                  <label class="form-label">Full Address</label>
                  <textarea class="form-control" name="address" rows="2"></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem;">
                  ${editingUserId ? 'Save User Updates' : 'Create User Account'}
                </button>
              </div>
            </div>
          </form>
        </div>
      `;

      container.querySelector('#btn-back').addEventListener('click', () => {
        currentView = 'table';
        editingUserId = null;
        render();
      });

      // Photo Upload Logic (Mocked with DataURL)
      const photoDrop = container.querySelector('#photo-drop');
      const photoInput = container.querySelector('#photo-input');
      
      photoDrop.addEventListener('click', () => photoInput.click());
      
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            uploadedPhotoURL = ev.target.result;
            render(); // Re-render to show image preview
          };
          reader.readAsDataURL(file);
        }
      });

      // Form Submit
      const form = container.querySelector('#create-user-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        
        if (editingUserId) {
          const uIndex = store.state.staffUsers.findIndex(u => u.id === editingUserId);
          if (uIndex !== -1) {
            const user = store.state.staffUsers[uIndex];
            user.name = fd.get('name');
            user.email = fd.get('email');
            user.mobile = fd.get('mobile');
            user.designation = fd.get('designation');
            user.dob = fd.get('dob');
            user.joiningDate = fd.get('joiningDate');
            user.location = fd.get('location');
            user.org = fd.get('org');
            user.address = fd.get('address');
            user.role = fd.get('role');
            user.photo = uploadedPhotoURL;
            store.setState({ staffUsers: [...store.state.staffUsers] });
            store.addLog(store.state.staffUser.name, 'Manage Users', `Updated user: ${user.name}`);
          }
        } else {
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
            photo: uploadedPhotoURL,
            status: 'Active'
          };
          store.setState({ staffUsers: [...store.state.staffUsers, newUser] });
          store.addLog(store.state.staffUser.name, 'Manage Users', `Created new user: ${newUser.name}`);
        }
        
        currentView = 'table';
        editingUserId = null;
        render();
      });
    }
  }
  
  render();
  return container;
}
