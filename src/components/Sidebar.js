import { navigateTo } from '../main.js';
import { store } from '../store.js';

// SVG Icon set for professional look
const icons = {
  Overview: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>',
  Beneficiaries: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
  PreScreening: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
  AssessmentEngine: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>',
  BulkSMS: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>',
  FollowUp: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>',
  QuestionBank: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>',
  SMSConfig: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
  Admin: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
  Reports: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
};

export function renderSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  
  if (store.state.sidebarCollapsed) {
    sidebar.classList.add('collapsed');
  }

  // Vibrant gradient background specifically for sidebar
  sidebar.style.background = 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)';
  sidebar.style.borderRight = '1px solid rgba(255,255,255,0.05)';
  sidebar.style.boxShadow = '4px 0 24px rgba(0,0,0,0.1)';

  const logo = document.createElement('div');
  logo.style.padding = '1.5rem 1.5rem 1.5rem 1.5rem';
  logo.innerHTML = `
    <h2 class="sidebar-text" style="color: white; margin: 0; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; display: flex; align-items: center; gap: 0.5rem;">
      <span style="color: #38bdf8;">✦</span> JAGORON
    </h2>
    <h2 class="sidebar-logo-text" style="color: #38bdf8; margin: 0; font-size: 1.8rem; display: none; text-align: center;">✦</h2>
  `;
  
  const navList = document.createElement('nav');
  navList.style.display = 'flex';
  navList.style.flexDirection = 'column';
  
  const userRole = store.state.staffUser?.role || 'Field Officer';
  
  const links = [
    { section: 'Overview' },
    { name: 'Dashboard', path: '/dashboard', icon: icons.Overview },
    
    { section: 'Operations' },
    { name: 'Beneficiaries', path: '/beneficiaries', icon: icons.Beneficiaries },
    { name: 'Pre-Screening', path: '/pre-screening', icon: icons.PreScreening },
    { name: 'Assessment Engine', path: '/assessment-engine', icon: icons.AssessmentEngine },
    { name: 'Bulk SMS', path: '/bulk-sms', icon: icons.BulkSMS },
    { name: 'Progress Follow-up', path: '/follow-up', icon: icons.FollowUp },
    
    { section: 'Configuration' },
    { name: 'Question Bank', path: '/question-bank', icon: icons.QuestionBank },
    { name: 'SMS Config', path: '/sms-config', icon: icons.SMSConfig },
  ];
  
  if (userRole === 'Admin') {
    links.push({ section: 'Administration' });
    links.push({ name: 'User Management', path: '/user-management', icon: icons.Beneficiaries });
    links.push({ name: 'Role Management', path: '/role-management', icon: icons.Admin });
    links.push({ name: 'Central MIS Sync', path: '/system-integrations', icon: icons.Overview });
    links.push({ name: 'Audit Log', path: '/audit-log', icon: icons.Reports });
  }

  links.push({ section: 'Reporting' });
  links.push({ name: 'Reports & Export', path: '/reports', icon: icons.Reports });
  
  links.forEach(link => {
    if (link.section) {
      const sec = document.createElement('div');
      sec.className = 'sidebar-section';
      sec.innerHTML = link.section;
      sec.style.padding = '1rem 1.5rem 0.2rem 1.5rem';
      sec.style.fontSize = '0.7rem';
      sec.style.textTransform = 'uppercase';
      sec.style.fontWeight = '700';
      sec.style.color = 'rgba(255,255,255,0.4)';
      sec.style.letterSpacing = '1px';
      navList.appendChild(sec);
      return;
    }

    const a = document.createElement('a');
    a.href = '#';
    a.title = link.name;
    a.className = 'nav-link';
    a.innerHTML = `<span class="sidebar-icon" style="margin-right: 0.75rem; display: inline-flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s;">${link.icon}</span> <span class="sidebar-text">${link.name}</span>`;
    a.style.padding = '0.5rem 1rem';
    a.style.margin = '0.15rem 0.75rem';
    a.style.display = 'flex';
    a.style.alignItems = 'center';
    a.style.fontWeight = '500';
    a.style.fontSize = '0.9rem';
    a.style.textDecoration = 'none';
    a.style.borderRadius = '8px';
    a.style.transition = 'all 0.2s ease';
    
    const currentHash = window.location.hash.replace('#', '') || '/dashboard';
    if (currentHash === link.path || currentHash.startsWith(link.path + '/')) {
      a.style.background = 'linear-gradient(90deg, rgba(14, 165, 233, 0.2) 0%, transparent 100%)';
      a.style.borderLeft = '3px solid #38bdf8';
      a.style.color = '#ffffff';
      a.style.fontWeight = '600';
      const icon = a.querySelector('.sidebar-icon');
      if (icon) {
        icon.style.opacity = '1';
        icon.style.color = '#38bdf8';
      }
    } else {
      a.style.color = '#94a3b8';
      a.style.borderLeft = '3px solid transparent';
    }
    
    a.addEventListener('mouseenter', () => {
      if (currentHash !== link.path && !currentHash.startsWith(link.path + '/')) {
        a.style.backgroundColor = 'rgba(255,255,255,0.05)';
        a.style.color = '#f1f5f9';
        const icon = a.querySelector('.sidebar-icon');
        if(icon) icon.style.opacity = '1';
      }
    });
    
    a.addEventListener('mouseleave', () => {
      if (currentHash !== link.path && !currentHash.startsWith(link.path + '/')) {
        a.style.backgroundColor = 'transparent';
        a.style.color = '#94a3b8';
        const icon = a.querySelector('.sidebar-icon');
        if(icon) icon.style.opacity = '0.7';
      }
    });
    
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.path);
    });
    
    navList.appendChild(a);
  });
  
  sidebar.appendChild(logo);
  
  const scrollWrapper = document.createElement('div');
  scrollWrapper.style.overflowY = 'auto';
  scrollWrapper.style.overflowX = 'hidden';
  scrollWrapper.style.flex = '1';
  scrollWrapper.style.paddingBottom = '1rem';
  
  scrollWrapper.style.cssText += `
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none;
    scrollbar-width: none;
  `;
  
  scrollWrapper.appendChild(navList);
  
  sidebar.appendChild(scrollWrapper);
  
  const profileChip = document.createElement('div');
  profileChip.className = 'sidebar-text';
  profileChip.style.padding = '1rem 1.5rem';
  profileChip.style.marginTop = 'auto';
  profileChip.style.borderTop = '1px solid rgba(255,255,255,0.05)';
  profileChip.style.display = 'flex';
  profileChip.style.alignItems = 'center';
  profileChip.style.gap = '0.75rem';
  
  const userName = store.state.staffUser?.name || 'Administrator';
  
  profileChip.innerHTML = `
    <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; flex-shrink: 0; font-size: 0.85rem;">
      ${userName.charAt(0)}
    </div>
    <div style="overflow: hidden;">
      <div style="color: #f8fafc; font-weight: 600; font-size: 0.85rem; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${userName}</div>
      <div style="color: #94a3b8; font-size: 0.75rem;">${userRole}</div>
    </div>
  `;
  
  sidebar.appendChild(profileChip);
  
  return sidebar;
}
