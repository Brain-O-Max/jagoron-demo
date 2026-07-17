import './style.css';
import { store } from './store.js';

// Views
import { renderLogin } from './views/Login.js';
import { renderGridHome } from './views/GridHome.js';
import { renderDonorDashboard } from './views/DonorDashboard.js';
import { renderDashboard } from './views/Dashboard.js';
import { renderRegistration } from './views/Registration.js';
import { renderBeneficiaryList } from './views/BeneficiaryList.js';
import { renderAssessmentEngine } from './views/AssessmentEngine.js';
import { renderAssessment } from './views/Assessment.js'; // The actual question UI
import { renderProcessing } from './views/Processing.js';
import { renderResults } from './views/Results.js';
import { renderFollowUp } from './views/FollowUp.js';
import { renderBulkSms } from './views/BulkSms.js';
import { renderQuestionBank } from './views/QuestionBank.js';
import { renderSystemIntegrations } from './views/SystemIntegrations.js';
import { renderSmsConfig } from './views/SmsConfig.js';
import { renderUserManagement } from './views/UserManagement.js';
import { renderRoleManagement } from './views/RoleManagement.js';
import { renderReports } from './views/Reports.js';
import { renderAuditLog } from './views/AuditLog.js';

// Components
import { renderSidebar } from './components/Sidebar.js';
import { renderTopbar } from './components/Topbar.js';

const app = document.querySelector('#app');

import { renderPreScreening } from './views/PreScreening.js';

export function navigateTo(path, params = {}) {
  // Update hash for browser history (basic SPA routing)
  window.history.pushState({}, '', '#' + path);
  
  app.innerHTML = '';
  
  if (!store.state.staffUser && path !== '/login') {
    path = '/login';
  }

  if (path === '/login') {
    app.appendChild(renderLogin());
    return;
  }

  const container = document.createElement('div');
  container.className = 'app-container';
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';
  
  if (store.state.appLayout === 'sidebar') {
    container.appendChild(renderSidebar());
    if (store.state.sidebarCollapsed) {
      mainContent.classList.add('collapsed');
    }
  } else {
    // In grid layout, main content takes full width
    mainContent.style.marginLeft = '0';
  }
  
  mainContent.appendChild(renderTopbar());
  
  const viewContainer = document.createElement('div');
  viewContainer.className = 'view-container';
  
  // Route matching
  switch(path) {
    case '/home':
      viewContainer.appendChild(renderGridHome());
      break;
    case '/donor-dashboard':
      viewContainer.appendChild(renderDonorDashboard());
      break;
    case '/dashboard':
      viewContainer.appendChild(renderDashboard());
      break;
    case '/beneficiaries':
      viewContainer.appendChild(renderBeneficiaryList());
      break;
    case '/register-youth':
      viewContainer.appendChild(renderRegistration(params));
      break;
    case '/pre-screening':
      viewContainer.appendChild(renderPreScreening());
      break;
    case '/assessment-engine':
      viewContainer.appendChild(renderAssessmentEngine());
      break;
    case '/assessment':
      viewContainer.appendChild(renderAssessment(params));
      break;
    case '/processing':
      viewContainer.appendChild(renderProcessing(params));
      break;
    case '/results':
      viewContainer.appendChild(renderResults(params));
      break;
    case '/follow-up':
      viewContainer.appendChild(renderFollowUp());
      break;
    case '/bulk-sms':
      viewContainer.appendChild(renderBulkSms());
      break;
    case '/question-bank':
      viewContainer.appendChild(renderQuestionBank());
      break;
    case '/system-integrations':
      viewContainer.appendChild(renderSystemIntegrations());
      break;
    case '/sms-config':
      viewContainer.appendChild(renderSmsConfig());
      break;
    case '/user-management':
      viewContainer.appendChild(renderUserManagement());
      break;
    case '/role-management':
      viewContainer.appendChild(renderRoleManagement());
      break;
    case '/reports':
      viewContainer.appendChild(renderReports());
      break;
    case '/audit-log':
      viewContainer.appendChild(renderAuditLog());
      break;
    default:
      viewContainer.appendChild(store.state.appLayout === 'grid' ? renderGridHome() : renderDashboard());
  }

  mainContent.appendChild(viewContainer);
  container.appendChild(mainContent);
  app.appendChild(container);
}

// Initial Load
window.addEventListener('popstate', () => {
  const hash = window.location.hash.replace('#', '') || (store.state.appLayout === 'grid' ? '/home' : '/dashboard');
  navigateTo(hash);
});

const startPath = window.location.hash.replace('#', '') || (store.state.appLayout === 'grid' ? '/home' : '/dashboard');
navigateTo(startPath);
