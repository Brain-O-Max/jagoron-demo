import { navigateTo } from '../main.js';
import { store } from '../store.js';

export function renderSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.style.padding = '1.5rem 0';
  if (store.state.sidebarCollapsed) {
    sidebar.classList.add('collapsed');
  }

  const logo = document.createElement('div');
  logo.style.padding = '0 1.5rem 2rem 1.5rem';
  logo.innerHTML = `
    <h2 class="sidebar-text" style="color: var(--primary); margin: 0; font-size: 1.8rem; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">JAGORON</h2>
    <h2 class="sidebar-logo-text" style="color: var(--primary); margin: 0; font-size: 1.8rem; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: none;">J</h2>
    <span class="sidebar-text" style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Admin Portal</span>
  `;
  
  const navList = document.createElement('nav');
  navList.style.display = 'flex';
  navList.style.flexDirection = 'column';
  navList.style.gap = '0.25rem';
  
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
      sec.style.padding = '1.5rem 1.5rem 0.5rem 1.5rem';
      sec.style.fontSize = '0.7rem';
      sec.style.textTransform = 'uppercase';
      sec.style.fontWeight = '700';
      sec.style.color = 'var(--text-muted)';
      sec.style.letterSpacing = '1px';
      navList.appendChild(sec);
      return;
    }

    const a = document.createElement('a');
    a.href = '#';
    a.title = link.name;
    a.innerHTML = `<span class="sidebar-icon" style="margin-right: 0.75rem; font-size: 1.2rem; display: inline-block;">${link.icon}</span> <span class="sidebar-text">${link.name}</span>`;
    a.style.padding = '0.75rem 1.5rem';
    a.style.display = 'flex';
    a.style.alignItems = 'center';
    a.style.color = 'var(--text-main)';
    a.style.fontWeight = '500';
    a.style.textDecoration = 'none';
    a.style.transition = 'all 0.2s';
    a.style.borderLeft = '3px solid transparent';
    
    a.addEventListener('mouseenter', () => {
      a.style.backgroundColor = 'var(--surface-hover)';
      a.style.color = 'var(--primary-dark)';
    });
    a.addEventListener('mouseleave', () => {
      a.style.backgroundColor = 'transparent';
      a.style.color = 'var(--text-main)';
    });
    
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.path);
    });
    
    navList.appendChild(a);
  });
  
  const spacer = document.createElement('div');
  spacer.style.flex = '1';
  
  sidebar.appendChild(logo);
  
  // Wrap navList in a scrollable div in case it overflows on small screens
  const scrollWrapper = document.createElement('div');
  scrollWrapper.style.overflowY = 'auto';
  scrollWrapper.style.flex = '1';
  scrollWrapper.appendChild(navList);
  
  sidebar.appendChild(scrollWrapper);
  
  return sidebar;
}
