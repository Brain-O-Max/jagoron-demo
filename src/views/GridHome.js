import { navigateTo } from '../main.js';
import { store } from '../store.js';

export function renderGridHome() {
  const container = document.createElement('div');
  container.className = 'grid-home-container';
  
  // Enforce a full bleed background
  container.style.minHeight = '100vh';
  container.style.margin = '-2rem'; // Counteract the #app-content padding
  container.style.padding = '3rem';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  
  // AI-Themed Ultra-Premium Glassmorphism & Animated Mesh Background
  container.innerHTML = `
    <style>
      .grid-home-container {
        background-color: #0b0f19; /* Deep tech dark */
        font-family: 'Inter', -apple-system, sans-serif;
        color: #f1f5f9;
        z-index: 1;
      }
      
      /* Animated glowing orbs for AI feel */
      .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.5;
        z-index: 0;
        animation: float 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .orb-1 { width: 400px; height: 400px; background: rgba(14, 165, 233, 0.4); top: -100px; left: -100px; }
      .orb-2 { width: 500px; height: 500px; background: rgba(139, 92, 246, 0.3); bottom: -150px; right: -100px; animation-delay: -5s; }
      .orb-3 { width: 300px; height: 300px; background: rgba(16, 185, 129, 0.3); top: 40%; left: 40%; animation-delay: -10s; }
      
      @keyframes float {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(50px, 50px) scale(1.1); }
      }

      /* Base layout wrapper */
      .grid-content-wrapper {
        position: relative;
        z-index: 2;
        max-width: 1400px;
        margin: 0 auto;
      }
      
      .glass-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 3.5rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .greeting-title {
        font-size: 2.5rem; 
        color: #ffffff;
        font-weight: 800;
        margin-bottom: 0.5rem;
        letter-spacing: -0.5px;
        text-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
      }
      
      .greeting-subtitle {
        color: #94a3b8; 
        font-size: 1.15rem;
        font-weight: 500;
      }
      
      .quick-stats {
        display: flex;
        gap: 1.5rem;
      }
      
      .stat-badge {
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.75rem 1.25rem;
        border-radius: 16px;
        font-size: 0.95rem;
        font-weight: 600;
        color: #e2e8f0;
        box-shadow: 0 4px 20px -1px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      
      .category-section {
        margin-bottom: 3.5rem;
      }
      
      .category-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #cbd5e1;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .category-title::after {
        content: '';
        height: 1px;
        flex: 1;
        background: linear-gradient(to right, rgba(255, 255, 255, 0.1), transparent);
      }
      
      .glass-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 1.5rem;
      }
      
      .glass-card {
        background: rgba(30, 41, 59, 0.4);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 24px;
        padding: 1.75rem;
        display: flex;
        align-items: flex-start;
        gap: 1.25rem;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        position: relative;
        overflow: hidden;
      }
      
      /* Magical glowing border on hover */
      .glass-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        border-radius: 24px;
        padding: 2px;
        background: linear-gradient(135deg, rgba(14, 165, 233, 0.8), rgba(139, 92, 246, 0.8));
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      
      .glass-card:hover {
        transform: translateY(-8px) scale(1.02);
        background: rgba(30, 41, 59, 0.6);
        box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 20px 40px -10px rgba(0, 0, 0, 0.7);
      }
      
      .glass-card:hover::before {
        opacity: 1;
      }
      
      .icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
        flex-shrink: 0;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
        z-index: 1;
      }
      
      .glass-card:hover .icon-wrapper {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .card-content {
        flex: 1;
        position: relative;
        z-index: 1;
      }
      
      .card-title {
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 0.4rem;
        font-size: 1.15rem;
        letter-spacing: -0.2px;
      }
      
      .card-desc {
        color: #94a3b8;
        font-size: 0.85rem;
        line-height: 1.5;
        margin: 0;
      }
      
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 12px #10b981;
      }
      
      .card-arrow {
        position: absolute;
        bottom: 1.5rem;
        right: 1.5rem;
        color: rgba(255,255,255,0.2);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateX(-10px);
      }
      
      .glass-card:hover .card-arrow {
        opacity: 1;
        transform: translateX(0);
        color: rgba(255,255,255,0.8);
      }
      
      /* Specific Icon Glows based on data-color */
      .glass-card[data-color="blue"] .icon-wrapper { box-shadow: inset 0 0 20px rgba(14, 165, 233, 0.2); }
      .glass-card[data-color="purple"] .icon-wrapper { box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.2); }
      .glass-card[data-color="green"] .icon-wrapper { box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.2); }
      .glass-card[data-color="orange"] .icon-wrapper { box-shadow: inset 0 0 20px rgba(249, 115, 22, 0.2); }
      .glass-card[data-color="rose"] .icon-wrapper { box-shadow: inset 0 0 20px rgba(244, 63, 94, 0.2); }
    </style>
    
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <div class="grid-content-wrapper">
      <header class="glass-header">
        <div>
          <h1 class="greeting-title">Welcome back, ${store.state.staffUser?.name.split(' ')[0] || 'User'}</h1>
          <div class="greeting-subtitle">Here's what's happening with the JAGORON AI Engine today.</div>
        </div>
        <div class="quick-stats">
          <div class="stat-badge">
            <span class="status-dot"></span>
            System Online
          </div>
          <div class="stat-badge">
            <span>👥</span>
            ${store.state.youths.length} Profiles
          </div>
        </div>
      </header>

      <section class="category-section">
        <h2 class="category-title">🎯 Core Operations</h2>
        <div class="glass-grid">
          <div class="glass-card nav-card" data-path="/beneficiaries" data-color="blue">
            <div class="icon-wrapper">👥</div>
            <div class="card-content">
              <div class="card-title">Beneficiaries</div>
              <p class="card-desc">Register new youth, capture demographics, and manage profile information.</p>
            </div>
            <div class="card-arrow">→</div>
          </div>
          <div class="glass-card nav-card" data-path="/pre-screening" data-color="orange">
            <div class="icon-wrapper">🔍</div>
            <div class="card-content">
              <div class="card-title">Pre-Screening Validation</div>
              <p class="card-desc">Review and approve new profiles before running the AI assessment.</p>
            </div>
            <div class="card-arrow">→</div>
          </div>
          <div class="glass-card nav-card" data-path="/assessment-engine" data-color="purple">
            <div class="icon-wrapper">🧠</div>
            <div class="card-content">
              <div class="card-title">Assessment Engine</div>
              <p class="card-desc">Execute psychometric modeling and trigger AI pathway algorithms.</p>
            </div>
            <div class="card-arrow">→</div>
          </div>
          <div class="glass-card nav-card" data-path="/follow-up" data-color="green">
            <div class="icon-wrapper">📈</div>
            <div class="card-content">
              <div class="card-title">Progress Follow-up</div>
              <p class="card-desc">Log interventions, map timelines, and track employment success.</p>
            </div>
            <div class="card-arrow">→</div>
          </div>
        </div>
      </section>

      <section class="category-section">
        <h2 class="category-title">⚙️ AI Configuration & Admin</h2>
        <div class="glass-grid">
          <div class="glass-card nav-card" data-path="/question-bank" data-color="orange">
            <div class="icon-wrapper">📝</div>
            <div class="card-content">
              <div class="card-title">Dynamic Question Bank</div>
              <p class="card-desc">Configure logic jumps and manage the AI psychometric questions.</p>
            </div>
            <div class="card-arrow">→</div>
          </div>
          <div class="glass-card nav-card" data-path="/bulk-sms" data-color="blue">
            <div class="icon-wrapper">💬</div>
            <div class="card-content">
              <div class="card-title">Comms & SMS Sync</div>
              <p class="card-desc">Push automated SMS alerts to beneficiaries regarding their AI profiles.</p>
            </div>
            <div class="card-arrow">→</div>
          </div>
          <div class="glass-card nav-card" data-path="/reports" data-color="rose">
            <div class="icon-wrapper">📑</div>
            <div class="card-content">
              <div class="card-title">Analytics & Reporting</div>
              <p class="card-desc">Export high-level data models and generate comprehensive MIS reports.</p>
            </div>
            <div class="card-arrow">→</div>
          </div>
        </div>
      </section>
    </div>
  `;

  // Binding Navigation
  const cards = container.querySelectorAll('.nav-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const path = card.getAttribute('data-path');
      if (path) {
        navigateTo(path);
      }
    });
  });

  return container;
}
