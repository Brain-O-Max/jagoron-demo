import { store } from '../store.js';

export function renderDonorDashboard() {
  const container = document.createElement('div');
  
  // High-level Mock Metrics for Donors
  const totalEnrolled = store.state.youths.length || 7250;
  const femaleRatio = "52%";
  const pwdRatio = "6%";
  const employed = 3120;
  
  container.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <h2 style="font-size: 2.2rem; color: var(--primary-dark);">JAGORON Impact Dashboard</h2>
      <p style="font-size: 1.1rem; color: var(--text-muted);">High-level transparency and impact metrics for Donor Stakeholders.</p>
    </div>
    
    <!-- KPI Banner -->
    <div class="grid-cols-3 mb-4" style="gap: 2rem;">
      <div class="card" style="border-top: 4px solid var(--primary); background: var(--surface-hover);">
        <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 600;">Total Youth Enrolled</div>
        <div style="font-size: 2.5rem; font-weight: 700; color: var(--text-main); margin-top: 0.5rem;">${totalEnrolled}</div>
        <div style="font-size: 0.9rem; color: var(--secondary); margin-top: 0.5rem;">↑ 14% vs Last Quarter</div>
      </div>
      <div class="card" style="border-top: 4px solid var(--accent); background: var(--surface-hover);">
        <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 600;">Female Participation</div>
        <div style="font-size: 2.5rem; font-weight: 700; color: var(--text-main); margin-top: 0.5rem;">${femaleRatio}</div>
        <div style="font-size: 0.9rem; color: var(--secondary); margin-top: 0.5rem;">Target: 50% (Exceeded)</div>
      </div>
      <div class="card" style="border-top: 4px solid var(--secondary); background: var(--surface-hover);">
        <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 600;">Successfully Placed</div>
        <div style="font-size: 2.5rem; font-weight: 700; color: var(--text-main); margin-top: 0.5rem;">${employed}</div>
        <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">In wage or self-employment</div>
      </div>
    </div>
    
    <div class="grid-cols-2 gap-4">
      <!-- Sector Chart Placeholder -->
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Employment by Green Sector</h3>
        <div class="chart-container" style="height: 250px; display: flex; align-items: center; justify-content: center; background: #f8fafc; border-radius: 8px;">
          <p class="text-muted">[Sector Distribution Chart]</p>
        </div>
      </div>
      
      <!-- Geography Map Placeholder -->
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Geographical Reach</h3>
        <div class="chart-container" style="height: 250px; display: flex; align-items: center; justify-content: center; background: #f8fafc; border-radius: 8px;">
           <p class="text-muted">[Khulna & Gazipur Heatmap]</p>
        </div>
      </div>
    </div>
    
    <!-- Recent Milestones -->
    <div class="card mt-4">
      <h3 style="margin-bottom: 1rem;">Project Milestones</h3>
      <ul style="list-style: none; padding: 0;">
        <li style="padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
          <strong style="color: var(--primary);">Q2 2026:</strong> Successfully launched the AI Profiling Assessment Engine across 15 YLOs.
        </li>
        <li style="padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
          <strong style="color: var(--primary);">Q1 2026:</strong> Initial enrollment phase completed. 52% female participation secured.
        </li>
        <li style="padding: 1rem 0;">
          <strong style="color: var(--primary);">Project Launch:</strong> Consortium agreement signed between CARE and SOS Children's Villages.
        </li>
      </ul>
    </div>
  `;

  return container;
}
