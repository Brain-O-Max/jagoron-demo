"use client";

import { useState } from 'react';
import { useStore } from '../../store.js';

export default function FollowUpPage() {
  const [state, setState, addLog] = useStore();

  const [selectedYouthId, setSelectedYouthId] = useState(null);
  
  // Modal Form State
  const [interactionDate, setInteractionDate] = useState(new Date().toISOString().split('T')[0]);
  const [stage, setStage] = useState('Referred to Training');
  const [remarks, setRemarks] = useState('');

  // Get youths who have AI profiles
  const profiledYouths = state.youths.filter(y => y.status === 'Profiled' || y.status === 'Assessed');

  // Calculate metrics
  let inTraining = 0, grants = 0, employed = 0;
  profiledYouths.forEach(y => {
    if (y.followUpHistory && y.followUpHistory.length > 0) {
      const latestStage = y.followUpHistory[0].stage; // assuming prepended
      if (latestStage.includes('Training')) inTraining++;
      if (latestStage.includes('Grant')) grants++;
      if (latestStage.includes('Employed') || latestStage.includes('Business')) employed++;
    }
  });

  const handleOpenTimeline = (id) => {
    setSelectedYouthId(id);
    setInteractionDate(new Date().toISOString().split('T')[0]);
    setStage('Referred to Training');
    setRemarks('');
  };

  const handleSaveUpdate = (e) => {
    e.preventDefault();

    const yIndex = state.youths.findIndex(u => u.id === selectedYouthId);
    if (yIndex !== -1) {
      const youth = state.youths[yIndex];
      const history = youth.followUpHistory || [];

      const newHistory = [
        {
          date: interactionDate,
          stage: stage,
          remarks: remarks
        },
        ...history
      ];

      const updatedYouths = state.youths.map((u, idx) => 
        idx === yIndex ? { ...u, followUpHistory: newHistory } : u
      );

      setState({ youths: updatedYouths });
      addLog(state.staffUser?.name, 'Follow-up', `Updated progress for ${youth.name}`);
      setSelectedYouthId(null);
    }
  };

  const activeYouth = selectedYouthId ? profiledYouths.find(u => u.id === selectedYouthId) : null;
  const historyList = activeYouth?.followUpHistory || [];

  return (
    <div>
      <style>{`
        .timeline { border-left: 2px solid var(--primary); padding-left: 1.5rem; margin-top: 1rem; position: relative; }
        .timeline-item { position: relative; margin-bottom: 1.5rem; }
        .timeline-item::before { content: ''; position: absolute; left: -1.8rem; top: 0.2rem; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); border: 2px solid white; }
        .timeline-date { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.25rem; }
        .timeline-stage { font-weight: 600; color: var(--text-main); }
        .timeline-remarks { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; background: var(--surface-hover); padding: 0.5rem; border-radius: 4px; }
      `}</style>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontSize: '2rem' }}>Progress Follow-up</h2>
          <p>Track longitudinal progress of youths after profiling.</p>
        </div>
        <button className="btn btn-secondary">Export Follow-up Data</button>
      </div>
      
      <div className="flex gap-4 mb-4">
        <div className="card metric-card" style={{ flex: 1, padding: '1rem', background: 'var(--primary-gradient)' }}>
          <div className="flex justify-between items-center">
            <div className="metric-title">In Training</div>
            <div className="metric-value" style={{ fontSize: '1.5rem', margin: 0 }}>{inTraining}</div>
          </div>
        </div>
        <div className="card metric-card" style={{ flex: 1, padding: '1rem', background: 'var(--secondary-gradient)' }}>
          <div className="flex justify-between items-center">
            <div className="metric-title">Challenge Grants</div>
            <div className="metric-value" style={{ fontSize: '1.5rem', margin: 0 }}>{grants}</div>
          </div>
        </div>
        <div className="card metric-card" style={{ flex: 1, padding: '1rem', background: 'var(--warning-gradient)' }}>
          <div className="flex justify-between items-center">
            <div className="metric-title">Employed / Business</div>
            <div className="metric-value" style={{ fontSize: '1.5rem', margin: 0 }}>{employed}</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Post-Assessment Tracking</h3>
        
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Pathway Matched</th>
                <th>Current Stage</th>
                <th>Last Follow-up</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {profiledYouths.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No profiled youth available for follow-up yet.
                  </td>
                </tr>
              ) : (
                profiledYouths.map(y => {
                  const history = y.followUpHistory || [];
                  const latest = history.length > 0 ? history[0] : null;
                  
                  return (
                    <tr key={y.id}>
                      <td style={{ fontWeight: 500 }}>{y.name}</td>
                      <td>{y.aiProfile ? y.aiProfile.pathway : 'Pending AI'}</td>
                      <td>
                        <span className="badge badge-neutral">{latest ? latest.stage : 'Awaiting Action'}</span>
                      </td>
                      <td className="text-muted" style={{ fontSize: '0.85rem' }}>{latest ? new Date(latest.date).toLocaleDateString() : 'Never'}</td>
                      <td>
                        <button 
                          onClick={() => handleOpenTimeline(y.id)}
                          className="btn btn-primary log-btn" 
                          style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          📝 Log & View Timeline
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal */}
      {activeYouth && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '750px', width: '90%' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ margin: 0 }}>Progress Timeline: {activeYouth.name}</h3>
              <button onClick={() => setSelectedYouthId(null)} className="btn-icon">✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Left: Form */}
              <div>
                <form onSubmit={handleSaveUpdate}>
                  <div className="form-group">
                    <label className="form-label">Interaction Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      required 
                      value={interactionDate}
                      onChange={(e) => setInteractionDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Update Stage</label>
                    <select 
                      className="form-control" 
                      required
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                    >
                      <option value="Referred to Training">Referred to Training</option>
                      <option value="In IBT Training">In IBT Training</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                      <option value="Challenge Grant Received">Challenge Grant Received</option>
                      <option value="Employed">Employed</option>
                      <option value="Started Business">Started Business</option>
                      <option value="Dropped Out">Dropped Out</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Remarks / Notes</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      required 
                      placeholder="Details of the interaction..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Update</button>
                </form>
              </div>
              
              {/* Right: Timeline */}
              <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Historical Timeline</h4>
                <div className="timeline" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {historyList.length === 0 ? <div className="text-muted" style={{ fontSize: '0.85rem' }}>No history logged yet.</div> : null}
                  {historyList.map((h, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-date">{new Date(h.date).toLocaleDateString()}</div>
                      <div className="timeline-stage">{h.stage}</div>
                      <div className="timeline-remarks">{h.remarks}</div>
                    </div>
                  ))}
                  
                  <div className="timeline-item">
                    <div className="timeline-date">{new Date(activeYouth.id).toLocaleDateString()}</div>
                    <div className="timeline-stage">Registered in JAGORON</div>
                    <div className="timeline-remarks">Initial profiling completed.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
