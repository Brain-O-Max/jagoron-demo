import { store } from '../store.js';

export function renderReports() {
  const container = document.createElement('div');
  
  container.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 style="font-size: 2rem;">Reports & Data Export</h2>
        <p>Generate detailed cohort analysis and export data for M&E.</p>
      </div>
    </div>
    
    <div class="grid-cols-2 gap-4">
      <!-- Report Type 1 -->
      <div class="card">
        <h3 style="margin-bottom: 0.5rem; color: var(--primary-dark);">District-wise AI Match Report</h3>
        <p class="text-muted mb-4" style="font-size: 0.85rem;">Breakdown of AI-recommended pathways filtered by operational district.</p>
        <div class="flex gap-2">
          <select class="form-control" id="dist-filter" style="flex: 1;">
            <option value="All">All Districts</option>
            <option value="Khulna">Khulna</option>
            <option value="Gazipur">Gazipur</option>
          </select>
          <button class="btn btn-primary generate-pdf-btn" data-type="district">📥 View PDF</button>
        </div>
      </div>
      
      <!-- Report Type 2 -->
      <div class="card">
        <h3 style="margin-bottom: 0.5rem; color: var(--primary-dark);">Inclusion & Diversity Report</h3>
        <p class="text-muted mb-4" style="font-size: 0.85rem;">Metrics on Female participation, PWDs, and Ethnic minorities.</p>
        <div class="flex gap-2">
          <input type="month" id="inc-month" class="form-control" style="flex: 1;">
          <button class="btn btn-primary generate-pdf-btn" data-type="inclusion">📥 View PDF</button>
        </div>
      </div>
      
      <!-- Report Type 3 -->
      <div class="card">
        <h3 style="margin-bottom: 0.5rem; color: var(--primary-dark);">NEET Status Progression</h3>
        <p class="text-muted mb-4" style="font-size: 0.85rem;">Longitudinal data on youth transitioning from NEET to employed/training.</p>
        <div class="flex gap-2">
          <select class="form-control" id="neet-qtr" style="flex: 1;">
            <option>Q1 2026</option>
            <option>Q2 2026</option>
            <option>Q3 2026</option>
          </select>
          <button class="btn btn-primary generate-pdf-btn" data-type="neet">📥 View PDF</button>
        </div>
      </div>
      
      <!-- Report Type 4 -->
      <div class="card">
        <h3 style="margin-bottom: 0.5rem; color: var(--primary-dark);">Raw Data Dump (CSV)</h3>
        <p class="text-muted mb-4" style="font-size: 0.85rem;">Export the complete, raw dataset of registered youths for external analysis.</p>
        <div class="flex gap-2">
          <input type="date" class="form-control" title="Start Date" style="flex: 1;">
          <input type="date" class="form-control" title="End Date" style="flex: 1;">
          <button class="btn btn-secondary" onclick="alert('Downloading Raw Dataset CSV...')">📥 CSV</button>
        </div>
      </div>
    </div>
  `;

  // Dynamic PDF Window Logic
  container.querySelectorAll('.generate-pdf-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.target.dataset.type;
      
      const newWin = window.open('', '_blank', 'width=800,height=900');
      if (!newWin) {
        alert("Pop-up blocked! Please allow pop-ups for this site.");
        return;
      }
      
      const ts = new Date().toLocaleString();
      let title = '';
      let content = '';
      
      if (type === 'district') {
        const dist = container.querySelector('#dist-filter').value;
        title = `District AI Match Report: ${dist}`;
        content = `
          <h2>Distribution by Pathway</h2>
          <ul>
            <li>EV Maintenance: 32%</li>
            <li>Caregiving: 18%</li>
            <li>Retail: 25%</li>
            <li>RMG Trades: 15%</li>
            <li>Circular Economy: 10%</li>
          </ul>
        `;
      } else if (type === 'inclusion') {
        const mo = container.querySelector('#inc-month').value || 'All Time';
        title = `Inclusion & Diversity Report: ${mo}`;
        content = `
          <h2>Key Metrics</h2>
          <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">
            <tr><th>Metric</th><th>Achieved</th><th>Target</th></tr>
            <tr><td>Female Participation</td><td>52%</td><td>50%</td></tr>
            <tr><td>Persons with Disability</td><td>6%</td><td>5%</td></tr>
            <tr><td>Ethnic Minorities</td><td>12%</td><td>10%</td></tr>
          </table>
        `;
      } else if (type === 'neet') {
        const qtr = container.querySelector('#neet-qtr').value;
        title = `NEET Status Progression: ${qtr}`;
        content = `
          <h2>Status Transitions</h2>
          <p>Total youths transitioned from NEET to Employed/Training: <strong>1,250</strong></p>
          <p>Of which 60% are in wage employment and 40% in enterprise development.</p>
        `;
      }
      
      newWin.document.write(`
        <html>
          <head>
            <title>${title} - PDF Viewer</title>
            <style>
              body { font-family: 'Helvetica', Arial, sans-serif; padding: 2rem; color: #333; line-height: 1.6; }
              .header { border-bottom: 2px solid #0EA5E9; padding-bottom: 1rem; margin-bottom: 2rem; }
              h1 { color: #0284C7; margin: 0; }
              .meta { color: #666; font-size: 0.9rem; margin-top: 0.5rem; }
              .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 6rem; color: rgba(0,0,0,0.03); z-index: -1; white-space: nowrap; }
              .footer { margin-top: 4rem; padding-top: 1rem; border-top: 1px solid #ccc; font-size: 0.8rem; text-align: center; color: #888; }
            </style>
          </head>
          <body>
            <div class="watermark">JAGORON OFFICIAL</div>
            <div class="header">
              <h1>${title}</h1>
              <div class="meta">Generated by: ${store.state.staffUser.name} | Date: ${ts}</div>
            </div>
            
            <div class="content">
              ${content}
            </div>
            
            <div class="footer">
              Confidential Document - CARE Bangladesh & SOS Children's Villages JAGORON Project
            </div>
          </body>
        </html>
      `);
      newWin.document.close();
      
      store.addLog(store.state.staffUser.name, 'Data Export', `Generated PDF report: ${title}`);
    });
  });

  return container;
}
