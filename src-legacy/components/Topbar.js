import { store } from '../store.js';
import { navigateTo } from '../main.js';

export function renderTopbar() {
  const topbar = document.createElement('header');
  topbar.className = 'topbar justify-between';
  
  const left = document.createElement('div');
  left.className = 'flex items-center gap-4';
  
  if (store.state.appLayout === 'grid' && window.location.hash !== '#/home' && window.location.hash !== '') {
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.innerHTML = '← Home';
    backBtn.style.padding = '0.4rem 0.8rem';
    backBtn.onclick = () => navigateTo('/home');
    left.appendChild(backBtn);
  }
  
  if (store.state.appLayout === 'sidebar') {
    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.className = 'btn-icon';
    hamburgerBtn.innerHTML = '☰';
    hamburgerBtn.style.marginRight = '0.5rem';
    hamburgerBtn.onclick = () => {
      store.setState({ sidebarCollapsed: !store.state.sidebarCollapsed });
      navigateTo(window.location.hash.slice(1) || '/dashboard'); // re-render layout
    };
    left.appendChild(hamburgerBtn);
  }
  
  const title = document.createElement('span');
  title.style.fontWeight = '600';
  title.style.fontSize = '1.1rem';
  title.innerHTML = `AI Enabled <span style="color:var(--text-muted);font-weight:400;">Profile Assessment</span>`;
  left.appendChild(title);
  
  const right = document.createElement('div');
  right.className = 'flex items-center gap-4';
  
  const user = store.state.staffUser;
  
  right.innerHTML = `
    <button class="btn-icon" style="position:relative;" title="Notifications">
      🔔
      <span style="position:absolute; top: -2px; right: -2px; background: var(--accent); width: 10px; height: 10px; border-radius: 50%;"></span>
    </button>
    <div style="text-align: right; margin-left: 1rem;">
      <div style="font-size: 0.9rem; font-weight: 600;">${user ? user.name : 'Staff'}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted);">${user ? user.role : 'Officer'}</div>
    </div>
    
    <div style="position: relative;">
      <div id="profile-avatar" style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-gradient); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; box-shadow: var(--shadow-sm);">
        ${user ? user.name.charAt(0) : 'S'}
      </div>
      
      <!-- Dropdown -->
      <div id="profile-dropdown" class="card" style="display: none; position: absolute; top: 50px; right: 0; width: 260px; padding: 0.5rem; z-index: 50; box-shadow: var(--shadow-lg);">
        <button id="toggle-layout" class="btn btn-secondary" style="width: 100%; text-align: left; margin-bottom: 0.5rem; border: none; justify-content: flex-start; white-space: nowrap;">
          ${store.state.appLayout === 'grid' ? '📱 Switch to Sidebar Layout' : '🔲 Switch to Grid Layout'}
        </button>
        <button id="change-pwd" class="btn btn-secondary" style="width: 100%; text-align: left; margin-bottom: 0.5rem; border: none; justify-content: flex-start; white-space: nowrap;">
          🔑 Change Password
        </button>
        <div style="border-top: 1px solid var(--border-color); margin: 0.5rem 0;"></div>
        <button id="logout-btn" class="btn btn-secondary" style="width: 100%; text-align: left; border: none; color: var(--accent); justify-content: flex-start; white-space: nowrap;">
          🚪 Logout
        </button>
      </div>
    </div>
  `;
  
  topbar.appendChild(left);
  topbar.appendChild(right);
  
  // Interactions
  const avatar = topbar.querySelector('#profile-avatar');
  const dropdown = topbar.querySelector('#profile-dropdown');
  
  avatar.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  });
  
  topbar.querySelector('#toggle-layout').addEventListener('click', () => {
    const newLayout = store.state.appLayout === 'grid' ? 'sidebar' : 'grid';
    store.setState({ appLayout: newLayout });
    navigateTo(newLayout === 'grid' ? '/home' : '/dashboard');
  });
  
  topbar.querySelector('#change-pwd').addEventListener('click', () => {
    dropdown.style.display = 'none';
    const newPwd = prompt("Enter new password:");
    if (newPwd) {
      alert("Password changed successfully.");
      store.addLog(user.name, 'Security', 'Password changed');
    }
  });
  
  topbar.querySelector('#logout-btn').addEventListener('click', () => {
    store.addLog(user.name, 'Logout', 'Session ended');
    store.setState({ staffUser: null });
    navigateTo('/login');
  });
  
  // Close dropdown if clicked outside
  document.addEventListener('click', (e) => {
    if (!avatar.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });

  return topbar;
}
