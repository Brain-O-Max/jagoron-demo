import { navigateTo } from '../main.js';
import { store } from '../store.js';

export function renderSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  
  if (store.state.sidebarCollapsed) {
    sidebar.classList.add('collapsed');
  }

  const logo = document.createElement('div');
  logo.style.padding = '1.5rem 1.5rem 2rem 1.5rem';
  logo.innerHTML = `
    <h2 class="sidebar-text" style="color: var(--text-main); margin: 0; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; display: flex; align-items: center; gap: 0.5rem;">
      <span style="color: var(--primary);">✦</span> JAGORON
    </h2>
    <h2 class="sidebar-logo-text" style="color: var(--primary); margin: 0; font-size: 1.8rem; display: none; text-align: center;">✦</h2>
  `;
  
  const navList = document.createElement('nav');
  navList.style.display = 'flex';
  navList.style.flexDirection = 'column';
  
  const userRole = store.state.staffUser?.role || 'Field Officer';
  
  const links = [
    { section: 'Overview' },
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    
    { section: 'Operations' },
    { name: 'Beneficiaries', path: '/beneficiaries', icon: '👥' },
    { name: 'Pre-Screening', path: '/pre-screening', icon: '🔍' },
    { name: 'Assessment Engine', path: '/assessment-engine', icon: '🧠' },
    { name: 'Bulk SMS', path: '/bulk-sms', icon: '💬' },
    { name: 'Progress Follow-up', path: '/follow-up', icon: '📈' },
    
    { section: 'Configuration' },
    { name: 'Question Bank', path: '/question-bank', icon: '📝' },
    { name: 'SMS Config', path: '/sms-config', icon: '⚙️' },
  ];
  
  if (userRole === 'Admin') {
    links.push({ section: 'Administration' });
    links.push({ name: 'User Management', path: '/user-management', icon: '👥' });
    links.push({ name: 'Role Management', path: '/role-management', icon: '🛡️' });
    links.push({ name: 'Central MIS Sync', path: '/system-integrations', icon: '🔗' });
    links.push({ name: 'Audit Log', path: '/audit-log', icon: '📜' });
  }

  // Reports at the bottom
  links.push({ section: 'Reporting' });
  links.push({ name: 'Reports & Export', path: '/reports', icon: '📑' });
  
  links.forEach(link => {
    if (link.section) {
      const sec = document.createElement('div');
      sec.className = 'sidebar-section';
      sec.innerHTML = link.section;
      sec.style.padding = '0.8rem 1.5rem 0.2rem 1.5rem';
      sec.style.fontSize = '0.7rem';
      sec.style.textTransform = 'uppercase';
      sec.style.fontWeight = '700';
      sec.style.color = '#94a3b8'; /* Slate 400 */
      sec.style.letterSpacing = '0.5px';
      navList.appendChild(sec);
      return;
    }

    const a = document.createElement('a');
    a.href = '#';
    a.title = link.name;
    a.className = 'nav-link';
    a.innerHTML = `<span class="sidebar-icon" style="margin-right: 0.75rem; font-size: 1.1rem; display: inline-block; filter: grayscale(20%); opacity: 0.9;">${link.icon}</span> <span class="sidebar-text">${link.name}</span>`;
    a.style.padding = '0.4rem 1rem';
    a.style.margin = '0 0.75rem';
    a.style.display = 'flex';
    a.style.alignItems = 'center';
    a.style.fontWeight = '500';
    a.style.fontSize = '0.9rem';
    a.style.textDecoration = 'none';
    a.style.borderRadius = '8px';
    a.style.transition = 'all 0.15s ease';
    
    // Check if current route
    const currentHash = window.location.hash.replace('#', '') || '/dashboard';
    if (currentHash === link.path || currentHash.startsWith(link.path + '/')) {
      a.style.backgroundColor = '#F1F5F9'; // Slate 100
      a.style.color = '#0F172A'; // Slate 900
      a.style.fontWeight = '600';
      // Remove grayscale from icon if active
      const icon = a.querySelector('.sidebar-icon');
      if (icon) {
        icon.style.filter = 'none';
        icon.style.opacity = '1';
      }
    } else {
      a.style.color = '#475569'; // Slate 600
    }
    
    a.addEventListener('mouseenter', () => {
      if (currentHash !== link.path && !currentHash.startsWith(link.path + '/')) {
        a.style.backgroundColor = '#F8FAFC'; // Slate 50
        a.style.color = '#0F172A'; // Slate 900
      }
    });
    
    a.addEventListener('mouseleave', () => {
      if (currentHash !== link.path && !currentHash.startsWith(link.path + '/')) {
        a.style.backgroundColor = 'transparent';
        a.style.color = '#475569';
      }
    });
    
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.path);
    });
    
    navList.appendChild(a);
  });
  
  sidebar.appendChild(logo);
  
  // Wrap navList in a scrollable div
  const scrollWrapper = document.createElement('div');
  scrollWrapper.style.overflowY = 'auto';
  scrollWrapper.style.overflowX = 'hidden';
  scrollWrapper.style.flex = '1';
  scrollWrapper.style.paddingBottom = '1rem';
  
  // Hide scrollbar completely for a seamless look
  scrollWrapper.style.cssText += `
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  `;
  
  scrollWrapper.appendChild(navList);
  
  sidebar.appendChild(scrollWrapper);
  
  // Add a user profile chip at the bottom
  const profileChip = document.createElement('div');
  profileChip.className = 'sidebar-text';
  profileChip.style.padding = '0.75rem 1.5rem';
  profileChip.style.marginTop = 'auto';
  profileChip.style.borderTop = '1px solid var(--border-color)';
  profileChip.style.display = 'flex';
  profileChip.style.alignItems = 'center';
  profileChip.style.gap = '0.75rem';
  profileChip.style.background = 'var(--surface-color)';
  
  const userName = store.state.staffUser?.name || 'Administrator';
  
  profileChip.innerHTML = `
    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; flex-shrink: 0; font-size: 0.85rem;">
      ${userName.charAt(0)}
    </div>
    <div style="overflow: hidden;">
      <div style="color: var(--text-main); font-weight: 600; font-size: 0.85rem; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${userName}</div>
      <div style="color: var(--text-muted); font-size: 0.75rem;">${userRole}</div>
    </div>
  `;
  
  sidebar.appendChild(profileChip);
  
  return sidebar;
}
