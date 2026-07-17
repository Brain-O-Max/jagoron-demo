import { navigateTo } from '../main.js';
import { store } from '../store.js';

export function renderProcessing(params) {
  const targets = params.targets || []; // array of youth IDs
  const isBulk = params.bulk;
  const fromRoute = params.from || '/beneficiaries';
  
  const container = document.createElement('div');
  container.className = 'processing-container';
  
  container.innerHTML = `
    <style>
      .processing-container {
        min-height: calc(100vh - 120px);
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-color);
        margin: -2rem;
        position: relative;
      }
      
      .ai-box {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: 3rem;
        width: 100%;
        max-width: 600px;
        box-shadow: var(--shadow-lg);
      }
      
      .title {
        font-family: 'Inter', sans-serif;
        color: var(--text-color);
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      
      .spinner-primary {
        width: 24px;
        height: 24px;
        border: 3px solid rgba(14, 165, 233, 0.2);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin { 100% { transform: rotate(360deg); } }
      
      .status-list {
        background: var(--surface-hover);
        border-radius: var(--radius-md);
        padding: 1.5rem;
        min-height: 200px;
        border: 1px solid var(--border-color);
        margin-bottom: 2rem;
      }
      
      .status-item {
        margin-bottom: 1rem;
        opacity: 0;
        transform: translateY(10px);
        animation: fadeUp 0.4s forwards;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.95rem;
        color: var(--text-color);
      }
      
      .status-item .icon {
        color: var(--primary);
        font-size: 1.1rem;
      }
      
      .status-item.done .icon {
        color: var(--success);
      }
      
      @keyframes fadeUp {
        to { opacity: 1; transform: translateY(0); }
      }
      
      .progress-bg {
        width: 100%;
        height: 6px;
        background: var(--border-color);
        border-radius: 3px;
        overflow: hidden;
        margin-top: 2rem;
      }
      
      .progress-bar {
        height: 100%;
        background: var(--primary);
        width: 0%;
        transition: width 0.3s ease;
      }
      
      .completion-message {
        display: none;
        text-align: center;
        margin-top: 2rem;
        animation: fadeUp 0.5s forwards;
      }
      
      .completion-message h3 {
        color: var(--success);
        margin-bottom: 0.5rem;
      }
      
      .completion-message p {
        color: var(--text-muted);
        margin-bottom: 1.5rem;
      }
    </style>
    
    <div class="ai-box">
      <div class="title">
        <div class="spinner-primary" id="main-spinner"></div>
        AI Assessment Engine
      </div>
      
      <div class="status-list" id="term-content">
        <!-- Steps will appear here -->
      </div>
      
      <div class="progress-bg">
        <div class="progress-bar" id="progress-bar"></div>
      </div>
      
      <div class="completion-message" id="completion-message">
        <h3>Analysis Complete</h3>
        <p>Behavioral profiling and recommendations generated successfully.</p>
        <button id="btn-view-results" class="btn btn-primary" style="width: 100%;">View Results & Pathway</button>
      </div>
    </div>
  `;

  const termContent = container.querySelector('#term-content');
  const progressBar = container.querySelector('#progress-bar');
  
  const steps = [
    "Initializing Core ML Models...",
    "Establishing Vector Embeddings...",
    "Running Psychometric Scoring...",
    "Executing Bias-Check Protocols...",
    "Synthesizing Employment Pathways..."
  ];
  
  let currentStep = 0;
  
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      if (currentStep > 0 && termContent.children.length > 0) {
        const last = termContent.children[termContent.children.length - 1];
        last.classList.add('done');
        last.querySelector('.icon').textContent = '✓';
      }
      
      const div = document.createElement('div');
      div.className = 'status-item';
      div.innerHTML = `<span class="icon">◎</span> <span>${steps[currentStep]}</span>`;
      termContent.appendChild(div);
      
      const progress = ((currentStep + 1) / steps.length) * 100;
      progressBar.style.width = `${progress}%`;
      
      currentStep++;
    } else {
      clearInterval(interval);
      completeProcessing();
    }
  }, 1000);

  function completeProcessing() {
    if (termContent.children.length > 0) {
      const last = termContent.children[termContent.children.length - 1];
      last.classList.add('done');
      last.querySelector('.icon').textContent = '✓';
    }
    
    const btn = container.querySelector('#btn-view-results');
    const msg = container.querySelector('#completion-message');
    const spinner = container.querySelector('#main-spinner');
    
    msg.style.display = 'block';
    spinner.style.display = 'none';
    
    // Actually update the data
    const youths = store.state.youths;
    const updated = youths.map(y => {
      if (targets.includes(y.id)) {
        // Mock generation of AI Profile
        const profiles = ['Entrepreneurship', 'Technical Skill Training', 'Job Placement'];
        const p = profiles[Math.floor(Math.random() * profiles.length)];
        
        return {
          ...y,
          status: 'Assessed',
          aiProfile: {
            pathway: p,
            confidence: Math.floor(Math.random() * 20) + 80,
            traits: ['Resilient', 'Analytical', 'Communicative']
          }
        };
      }
      return y;
    });
    
    store.setState({ youths: updated });
    store.addLog(store.state.staffUser?.name || 'System', 'AI Engine', `Generated profiling for ${targets.length} youth(s).`);
    
    btn.addEventListener('click', () => {
      if (isBulk) {
        navigateTo(fromRoute);
      } else {
        navigateTo('/results', { youthId: targets[0], from: fromRoute });
      }
    });
  }

  return container;
}
