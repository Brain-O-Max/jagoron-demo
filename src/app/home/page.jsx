"use client";

import { useRouter } from 'next/navigation';
import { useStore } from '../../store.js';

export default function GridHomePage() {
  const [state] = useStore();
  const router = useRouter();

  const handleNav = (path) => {
    router.push(path);
  };

  const name = state.staffUser?.name.split(' ')[0] || 'User';
  const totalProfiles = state.youths.length;

  return (
    <div className="grid-home-container" style={{ minHeight: '100vh', margin: '-2rem', padding: '3rem', position: 'relative', overflow: 'hidden', backgroundColor: '#0b0f19', color: '#f1f5f9' }}>
      <style>{`
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
        
        .glass-card-grid {
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
        .glass-card-grid::before {
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
        
        .glass-card-grid:hover {
          transform: translateY(-8px) scale(1.02);
          background: rgba(30, 41, 59, 0.6);
          box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 20px 40px -10px rgba(0, 0, 0, 0.7);
        }
        
        .glass-card-grid:hover::before {
          opacity: 1;
        }
        
        .icon-wrapper-grid {
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
        
        .glass-card-grid:hover .icon-wrapper-grid {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .card-content-grid {
          flex: 1;
          position: relative;
          z-index: 1;
        }
        
        .card-title-grid {
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 0.4rem;
          font-size: 1.15rem;
          letter-spacing: -0.2px;
        }
        
        .card-desc-grid {
          color: #94a3b8;
          font-size: 0.85rem;
          line-height: 1.5;
          margin: 0;
        }
        
        .status-dot-grid {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 12px #10b981;
        }
        
        .card-arrow-grid {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          color: rgba(255,255,255,0.2);
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateX(-10px);
        }
        
        .glass-card-grid:hover .card-arrow-grid {
          opacity: 1;
          transform: translateX(0);
          color: rgba(255,255,255,0.8);
        }
        
        /* Specific Icon Glows based on data-color */
        .glass-card-grid[data-color="blue"] .icon-wrapper-grid { box-shadow: inset 0 0 20px rgba(14, 165, 233, 0.2); }
        .glass-card-grid[data-color="purple"] .icon-wrapper-grid { box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.2); }
        .glass-card-grid[data-color="green"] .icon-wrapper-grid { box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.2); }
        .glass-card-grid[data-color="orange"] .icon-wrapper-grid { box-shadow: inset 0 0 20px rgba(249, 115, 22, 0.2); }
        .glass-card-grid[data-color="rose"] .icon-wrapper-grid { box-shadow: inset 0 0 20px rgba(244, 63, 94, 0.2); }
      `}</style>
      
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="grid-content-wrapper">
        <header className="glass-header">
          <div>
            <h1 className="greeting-title">Welcome back, {name}</h1>
            <div className="greeting-subtitle">Here's what's happening with the JAGORON AI Engine today.</div>
          </div>
          <div className="quick-stats">
            <div className="stat-badge">
              <span className="status-dot-grid"></span>
              System Online
            </div>
            <div className="stat-badge">
              <span>👥</span>
              {totalProfiles} Profiles
            </div>
          </div>
        </header>

        <section className="category-section">
          <h2 className="category-title">🎯 Core Operations</h2>
          <div className="glass-grid">
            <div className="glass-card-grid" onClick={() => handleNav('/beneficiaries')} data-color="blue">
              <div className="icon-wrapper-grid">👥</div>
              <div className="card-content-grid">
                <div className="card-title-grid">Beneficiaries</div>
                <p className="card-desc-grid">Register new youth, capture demographics, and manage profile information.</p>
              </div>
              <div className="card-arrow-grid">→</div>
            </div>

            <div className="glass-card-grid" onClick={() => handleNav('/pre-screening')} data-color="orange">
              <div className="icon-wrapper-grid">🔍</div>
              <div className="card-content-grid">
                <div className="card-title-grid">Pre-Screening Validation</div>
                <p className="card-desc-grid">Review and approve new profiles before running the AI assessment.</p>
              </div>
              <div className="card-arrow-grid">→</div>
            </div>
            
            <div className="glass-card-grid" onClick={() => handleNav('/assessment-engine')} data-color="purple">
              <div className="icon-wrapper-grid">🧠</div>
              <div className="card-content-grid">
                <div className="card-title-grid">Assessment Engine</div>
                <p className="card-desc-grid">Execute psychometric modeling and trigger AI pathway algorithms.</p>
              </div>
              <div className="card-arrow-grid">→</div>
            </div>
            
            <div className="glass-card-grid" onClick={() => handleNav('/follow-up')} data-color="green">
              <div className="icon-wrapper-grid">📈</div>
              <div className="card-content-grid">
                <div className="card-title-grid">Progress Follow-up</div>
                <p className="card-desc-grid">Log interventions, map timelines, and track employment success.</p>
              </div>
              <div className="card-arrow-grid">→</div>
            </div>
          </div>
        </section>

        <section className="category-section">
          <h2 className="category-title">⚙️ AI Configuration & Admin</h2>
          <div className="glass-grid">
            <div className="glass-card-grid" onClick={() => handleNav('/question-bank')} data-color="orange">
              <div className="icon-wrapper-grid">📝</div>
              <div className="card-content-grid">
                <div className="card-title-grid">Dynamic Question Bank</div>
                <p className="card-desc-grid">Configure logic jumps and manage the AI psychometric questions.</p>
              </div>
              <div className="card-arrow-grid">→</div>
            </div>
            
            <div className="glass-card-grid" onClick={() => handleNav('/bulk-sms')} data-color="blue">
              <div className="icon-wrapper-grid">💬</div>
              <div className="card-content-grid">
                <div className="card-title-grid">Comms & SMS Sync</div>
                <p className="card-desc-grid">Push automated SMS alerts to beneficiaries regarding their AI profiles.</p>
              </div>
              <div className="card-arrow-grid">→</div>
            </div>
            
            <div className="glass-card-grid" onClick={() => handleNav('/reports')} data-color="rose">
              <div className="icon-wrapper-grid">📑</div>
              <div className="card-content-grid">
                <div className="card-title-grid">Analytics & Reporting</div>
                <p className="card-desc-grid">Export high-level data models and generate comprehensive MIS reports.</p>
              </div>
              <div className="card-arrow-grid">→</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
