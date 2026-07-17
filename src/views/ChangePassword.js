import { store } from '../store.js';
import { navigateTo } from '../main.js';

export function renderChangePassword() {
  const container = document.createElement('div');
  
  container.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 style="font-size: 2rem;">Change Password</h2>
        <p>Update your account security credentials.</p>
      </div>
    </div>
    
    <div class="card" style="max-width: 500px; margin: 0 auto; margin-top: 2rem;">
      <form id="change-password-form">
        <div class="form-group mb-4">
          <label class="form-label">Current Password</label>
          <input type="password" name="currentPassword" class="form-control" required />
        </div>
        
        <div class="form-group mb-4">
          <label class="form-label">New Password</label>
          <input type="password" name="newPassword" class="form-control" required minlength="6" />
          <span style="font-size: 0.75rem; color: var(--text-muted);">Must be at least 6 characters long.</span>
        </div>
        
        <div class="form-group mb-4">
          <label class="form-label">Repeat New Password</label>
          <input type="password" name="repeatPassword" class="form-control" required minlength="6" />
        </div>
        
        <div id="password-error" style="color: var(--accent); margin-bottom: 1rem; font-size: 0.85rem; display: none;"></div>
        <div id="password-success" style="color: var(--success); margin-bottom: 1rem; font-size: 0.85rem; display: none;"></div>
        
        <button type="submit" class="btn btn-primary" style="width: 100%;">Update Password</button>
      </form>
    </div>
  `;
  
  const form = container.querySelector('#change-password-form');
  const errorDiv = container.querySelector('#password-error');
  const successDiv = container.querySelector('#password-success');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    const currentPass = form.currentPassword.value;
    const newPass = form.newPassword.value;
    const repeatPass = form.repeatPassword.value;
    
    const user = store.state.staffUsers.find(u => u.name === store.state.staffUser.name);
    
    if (!user) {
      errorDiv.textContent = 'Critical Error: User not found.';
      errorDiv.style.display = 'block';
      return;
    }
    
    if (user.password !== currentPass) {
      errorDiv.textContent = 'Current password is incorrect.';
      errorDiv.style.display = 'block';
      return;
    }
    
    if (newPass !== repeatPass) {
      errorDiv.textContent = 'New passwords do not match.';
      errorDiv.style.display = 'block';
      return;
    }
    
    // Update password in global store
    const updatedUsers = store.state.staffUsers.map(u => 
      u.id === user.id ? { ...u, password: newPass } : u
    );
    
    store.setState({ staffUsers: updatedUsers });
    store.addLog(store.state.staffUser.name, 'Security', 'User changed their password.');
    
    successDiv.textContent = 'Password successfully updated!';
    successDiv.style.display = 'block';
    
    form.reset();
  });
  
  return container;
}
