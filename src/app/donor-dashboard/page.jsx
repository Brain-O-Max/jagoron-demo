"use client";

import { useStore } from '../../store.js';

export default function DonorDashboardPage() {
  const [state] = useStore();

  const totalEnrolled = state.youths.length || 7250;
  const femaleRatio = "52%";
  const pwdRatio = "6%";
  const employed = 3120;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)' }}>JAGORON Impact Dashboard</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>High-level transparency and impact metrics for Donor Stakeholders.</p>
      </div>
      
      {/* KPI Banner */}
      <div className="grid-cols-3 mb-4" style={{ gap: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary)', background: 'var(--surface-hover)' }}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: '600' }}>Total Youth Enrolled</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.5rem' }}>{totalEnrolled}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>↑ 14% vs Last Quarter</div>
        </div>
        <div className="card" style={{ borderTop: '4px solid var(--accent)', background: 'var(--surface-hover)' }}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: '600' }}>Female Participation</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.5rem' }}>{femaleRatio}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>Target: 50% (Exceeded)</div>
        </div>
        <div className="card" style={{ borderTop: '4px solid var(--secondary)', background: 'var(--surface-hover)' }}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: '600' }}>Successfully Placed</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.5rem' }}>{employed}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>In wage or self-employment</div>
        </div>
      </div>
      
      <div className="grid-cols-2 gap-4">
        {/* Sector Chart Placeholder */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Employment by Green Sector</h3>
          <div className="chart-container" style={{ height: '250px', display: 'flex', alignItems: 'center', justifycontent: 'center', background: '#f8fafc', borderRadius: '8px' }}>
            <p className="text-muted" style={{ margin: 'auto' }}>[Sector Distribution Chart]</p>
          </div>
        </div>
        
        {/* Geography Map Placeholder */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Geographical Reach</h3>
          <div className="chart-container" style={{ height: '250px', display: 'flex', alignItems: 'center', justifycontent: 'center', background: '#f8fafc', borderRadius: '8px' }}>
             <p className="text-muted" style={{ margin: 'auto' }}>[Khulna & Gazipur Heatmap]</p>
          </div>
        </div>
      </div>
      
      {/* Recent Milestones */}
      <div className="card mt-4">
        <h3 style={{ marginBottom: '1rem' }}>Project Milestones</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--primary)' }}>Q2 2026:</strong> Successfully launched the AI Profiling Assessment Engine across 15 YLOs.
          </li>
          <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--primary)' }}>Q1 2026:</strong> Initial enrollment phase completed. 52% female participation secured.
          </li>
          <li style={{ padding: '1rem 0' }}>
            <strong style={{ color: 'var(--primary)' }}>Project Launch:</strong> Consortium agreement signed between CARE and SOS Children's Villages.
          </li>
        </ul>
      </div>
    </div>
  );
}
