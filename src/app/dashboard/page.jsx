"use client";

import { useEffect, useRef } from 'react';
import { useStore } from '../../store.js';
import Chart from 'chart.js/auto';

export default function DashboardPage() {
  const [state] = useStore();

  const sectorChartRef = useRef(null);
  const districtChartRef = useRef(null);
  const trendChartRef = useRef(null);

  const total = state.youths.length;
  const profiled = state.youths.filter(y => y.status === 'Profiled' || y.status === 'Assessed').length;

  useEffect(() => {
    let sectorChartInstance = null;
    let districtChartInstance = null;
    let trendChartInstance = null;

    // 1. Sector Doughnut Chart
    if (sectorChartRef.current) {
      sectorChartInstance = new Chart(sectorChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Retail', 'Caregiver', 'RMG Trades', 'EV Maint.', 'Circular Econ'],
          datasets: [{
            data: [25, 20, 15, 30, 10],
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
    }

    // 2. District Bar Chart
    if (districtChartRef.current) {
      districtChartInstance = new Chart(districtChartRef.current, {
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
    }

    // 3. Line Trend Chart
    if (trendChartRef.current) {
      trendChartInstance = new Chart(trendChartRef.current, {
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
    }

    // Cleanup on unmount to destroy chart instances
    return () => {
      if (sectorChartInstance) sectorChartInstance.destroy();
      if (districtChartInstance) districtChartInstance.destroy();
      if (trendChartInstance) trendChartInstance.destroy();
    };
  }, [total]);

  return (
    <div>
      <div className="mb-4">
        <h2 style={{ fontSize: '2rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analytics Overview</h2>
        <p>High-level snapshot of project JAGORON progress across districts.</p>
      </div>
      
      {/* Top Metrics */}
      <div className="grid-cols-3 mb-4">
        <div className="card metric-card" style={{ background: 'var(--primary-gradient)' }}>
          <div className="metric-title">Total Youth Enrolled</div>
          <div className="metric-value">{total || '0'}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Across Khulna & Gazipur</div>
        </div>
        <div className="card metric-card" style={{ background: 'var(--secondary-gradient)' }}>
          <div className="metric-title">AI Profiles Generated</div>
          <div className="metric-value">{profiled || '0'}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Ready for employment/training</div>
        </div>
        <div className="card metric-card" style={{ background: 'var(--warning-gradient)' }}>
          <div className="metric-title">SMS Notifications Sent</div>
          <div className="metric-value">{profiled || '0'}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Results delivered via mobile</div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid-cols-2 mb-4">
        {/* Sector Match Pie Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Recommended Pathways Distribution</h3>
          <div className="chart-container">
            <canvas ref={sectorChartRef}></canvas>
          </div>
        </div>
        
        {/* District Distribution Bar Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Enrollment by District</h3>
          <div className="chart-container">
            <canvas ref={districtChartRef}></canvas>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Registration Trends (Monthly)</h3>
        <div className="chart-container" style={{ height: '250px' }}>
          <canvas ref={trendChartRef}></canvas>
        </div>
      </div>
    </div>
  );
}
