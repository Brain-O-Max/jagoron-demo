"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../store.js';

function ResultsPageContent() {
  const [state] = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const youthId = parseInt(searchParams.get('youthId'));
  const fromRoute = searchParams.get('from') || '/beneficiaries';
  const youth = state.youths.find(y => y.id === youthId);

  if (!youth || !youth.aiProfile) {
    return (
      <div className="card text-center" style={{ margin: '4rem auto', maxWidth: '500px' }}>
        <h2>Results Not Available</h2>
        <p>Profile not found or AI processing not complete yet.</p>
        <button onClick={() => router.push(fromRoute)} className="btn btn-primary mt-4">Go Back</button>
      </div>
    );
  }

  const handleBack = () => {
    router.push(fromRoute);
  };

  const handleEnroll = () => {
    alert("Successfully enrolled youth in recommended pathway!");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ margin: 0 }}>AI Profile Results: {youth.name}</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>ID: #{youth.id.toString().padStart(4, '0')} | District: {youth.district}</p>
        </div>
        <button onClick={handleBack} className="btn btn-secondary">&larr; Back</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Left Column: Summary Card */}
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem auto', fontWeight: 'bold' }}>
            {youth.name.charAt(0)}
          </div>
          <h3 style={{ marginBottom: '0.25rem' }}>{youth.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{youth.age} yrs | {youth.gender} | {youth.status}</p>
          
          <div style={{ background: 'var(--surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1rem' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Overall Competency</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, background: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${youth.aiProfile.competencyScore || 75}%`, background: 'var(--primary)', height: '100%' }}></div>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{youth.aiProfile.competencyScore || 75}/100</span>
            </div>
          </div>
          
          <div style={{ background: 'var(--surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>System Actions</p>
            <p style={{ margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {youth.aiProfile.messageSent ? (
                <><span style={{ color: 'var(--success)' }}>✅</span> SMS Results Sent to Youth</>
              ) : (
                <><span style={{ color: 'var(--warning)' }}>⚠️</span> SMS Not Sent Yet</>
              )}
            </p>
          </div>
        </div>
        
        {/* Right Column: AI Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Top Recommended Pathway</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--secondary)', fontSize: '1.8rem' }}>{youth.aiProfile.pathway}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>Based on psychometric and behavioral alignment with green economy and market demands.</p>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 700 }}>
                {youth.aiProfile.confidence}% Match
              </div>
            </div>
            
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Suggested Next Steps:</h4>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              <li style={{ marginBottom: '0.25rem' }}>Enroll in Industry-based Training (IBT) program for {youth.aiProfile.pathway}.</li>
              <li style={{ marginBottom: '0.25rem' }}>Refer to Youth Challenge Fund for entrepreneurial grants.</li>
              <li>Schedule 1-month follow-up assessment.</li>
            </ul>
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Alternative Pathways</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Circular Economy & Waste Mgmt</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Match: 75% | Green Economy Focus</p>
              </div>
              <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Domestic Care / Caregiver</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Match: 62% | High Demand</p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => window.print()}>Print Report</button>
            <button className="btn btn-primary" onClick={handleEnroll}>Enroll Youth in Training &rarr;</button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-4">
        <div className="spinner-primary"></div>
        <span style={{ marginLeft: '1rem' }}>Loading profiling results...</span>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}
