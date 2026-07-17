import { navigateTo } from '../main.js';
import { store } from '../store.js';

export function renderResults(params) {
  const youthId = parseInt(params.youthId);
  const fromRoute = params.from || '/beneficiaries';
  const youth = store.state.youths.find(y => y.id === youthId);
  
  if (!youth || !youth.aiProfile) {
    alert("Profile not found or AI processing not complete.");
    navigateTo('/beneficiaries');
    return document.createElement('div');
  }

  const container = document.createElement('div');
  
  container.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 style="margin: 0;">AI Profile Results: ${youth.name}</h2>
        <p style="margin: 0; color: var(--text-muted);">ID: #${youth.id.toString().padStart(4, '0')} | District: ${youth.district}</p>
      </div>
      <button id="btn-back" class="btn btn-secondary">&larr; Back</button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; margin-bottom: 2rem;">
      
      <!-- Left Column: Summary Card -->
      <div class="glass-card" style="text-align: center;">
        <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--primary-light); color: white; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.5rem auto; font-weight: bold;">
          ${youth.name.charAt(0)}
        </div>
        <h3 style="margin-bottom: 0.25rem;">${youth.name}</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">${youth.age} yrs | ${youth.gender} | ${youth.status}</p>
        
        <div style="background: var(--surface-hover); padding: 1rem; border-radius: var(--radius-md); text-align: left; margin-bottom: 1rem;">
          <p style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Overall Competency</p>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="flex: 1; background: var(--border-color); height: 8px; border-radius: 4px; overflow: hidden;">
              <div style="width: ${youth.aiProfile.competencyScore}%; background: var(--primary); height: 100%;"></div>
            </div>
            <span style="font-weight: 700; color: var(--primary-dark);">${youth.aiProfile.competencyScore}/100</span>
          </div>
        </div>
        
        <div style="background: var(--surface-hover); padding: 1rem; border-radius: var(--radius-md); text-align: left;">
          <p style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">System Actions</p>
          <p style="margin: 0; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem;">
            ${youth.aiProfile.messageSent ? '<span style="color: var(--success);">✅</span> SMS Results Sent to Youth' : '❌ SMS Not Sent'}
          </p>
        </div>
      </div>
      
      <!-- Right Column: AI Recommendations -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <div class="card" style="border-left: 4px solid var(--secondary);">
          <h3 style="color: var(--primary-dark); margin-bottom: 1rem;">Top Recommended Pathway</h3>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h2 style="margin: 0 0 0.5rem 0; color: var(--secondary); font-size: 1.8rem;">${youth.aiProfile.pathway}</h2>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem;">Based on psychometric and behavioral alignment with green economy and market demands.</p>
            </div>
            <div style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.5rem 1rem; border-radius: 20px; font-weight: 700;">
              ${youth.aiProfile.confidence}% Match
            </div>
          </div>
          
          <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--text-main);">Suggested Next Steps:</h4>
          <ul style="padding-left: 1.5rem; color: var(--text-muted); font-size: 0.9rem; margin: 0;">
            <li style="margin-bottom: 0.25rem;">Enroll in Industry-based Training (IBT) program for ${youth.aiProfile.pathway}.</li>
            <li style="margin-bottom: 0.25rem;">Refer to Youth Challenge Fund for entrepreneurial grants.</li>
            <li>Schedule 1-month follow-up assessment.</li>
          </ul>
        </div>
        
        <div class="card">
          <h3 style="margin-bottom: 1rem;">Alternative Pathways</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-md);">
              <h4 style="margin: 0 0 0.25rem 0;">Circular Economy & Waste Mgmt</h4>
              <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">Match: 75% | Green Economy Focus</p>
            </div>
            <div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-md);">
              <h4 style="margin: 0 0 0.25rem 0;">Domestic Care / Caregiver</h4>
              <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">Match: 62% | High Demand</p>
            </div>
          </div>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 1rem;">
          <button class="btn btn-secondary" onclick="window.print()">Print Report</button>
          <button class="btn btn-primary">Enroll Youth in Training &rarr;</button>
        </div>
        
      </div>
    </div>
  `;
  
  container.querySelector('#btn-back').addEventListener('click', () => {
    navigateTo(fromRoute);
  });

  return container;
}
