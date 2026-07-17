import { store } from '../store.js';

export function renderDashboard() {
  const container = document.createElement('div');
  
  // Total logic
  const total = store.state.youths.length;
  const profiled = store.state.youths.filter(y => y.status === 'Profiled').length;
  
  container.innerHTML = `
    <div class="mb-4">
      <h2 style="font-size: 2rem; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Analytics Overview</h2>
      <p>High-level snapshot of project JAGORON progress across districts.</p>
    </div>
    
    <!-- Top Metrics -->
    <div class="grid-cols-3 mb-4">
      <div class="card metric-card" style="background: var(--primary-gradient);">
        <div class="metric-title">Total Youth Enrolled</div>
        <div class="metric-value">${total || '0'}</div>
        <div style="font-size: 0.85rem; opacity: 0.9;">Across Khulna & Gazipur</div>
      </div>
      <div class="card metric-card" style="background: var(--secondary-gradient);">
        <div class="metric-title">AI Profiles Generated</div>
        <div class="metric-value">${profiled || '0'}</div>
        <div style="font-size: 0.85rem; opacity: 0.9;">Ready for employment/training</div>
      </div>
      <div class="card metric-card" style="background: var(--warning-gradient);">
        <div class="metric-title">SMS Notifications Sent</div>
        <div class="metric-value">${profiled || '0'}</div>
        <div style="font-size: 0.85rem; opacity: 0.9;">Results delivered via mobile</div>
      </div>
    </div>
    
    <!-- Charts Section -->
    <div class="grid-cols-2 mb-4">
      <!-- Sector Match Pie Chart -->
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Recommended Pathways Distribution</h3>
        <div class="chart-container">
          <canvas id="sectorChart"></canvas>
        </div>
      </div>
      
      <!-- District Distribution Bar Chart -->
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Enrollment by District</h3>
        <div class="chart-container">
          <canvas id="districtChart"></canvas>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h3 style="margin-bottom: 1rem;">Registration Trends (Monthly)</h3>
      <div class="chart-container" style="height: 250px;">
        <canvas id="trendChart"></canvas>
      </div>
    </div>
  `;
  
  // Render Charts after DOM injection
  setTimeout(() => {
    // 1. Sector Pie Chart (Mock data logic)
    const ctxPie = container.querySelector('#sectorChart').getContext('2d');
    new Chart(ctxPie, {
      type: 'doughnut',
      data: {
        labels: ['Retail', 'Caregiver', 'RMG Trades', 'EV Maint.', 'Circular Econ'],
        datasets: [{
          data: [25, 20, 15, 30, 10], // Mock percentage
          backgroundColor: ['#0EA5E9', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'right' }
        }
      }
    });

    // 2. District Bar Chart
    const ctxBar = container.querySelector('#districtChart').getContext('2d');
    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: ['Khulna', 'Gazipur'],
        datasets: [{
          label: 'Youth Enrolled',
          data: [total > 0 ? Math.floor(total * 0.6) : 320, total > 0 ? Math.ceil(total * 0.4) : 210],
          backgroundColor: '#38BDF8',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { display: false } },
          x: { grid: { display: false } }
        }
      }
    });

    // 3. Line Trend Chart
    const ctxLine = container.querySelector('#trendChart').getContext('2d');
    new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Registrations',
          data: [50, 120, 210, 310, 450, total > 0 ? total : 530],
          borderColor: '#0EA5E9',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true },
          x: { grid: { display: false } }
        }
      }
    });

  }, 0);

  return container;
}
