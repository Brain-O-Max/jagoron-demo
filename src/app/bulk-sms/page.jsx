"use client";

import { useState, useEffect } from 'react';
import { useStore } from '../../store.js';

export default function BulkSmsPage() {
  const [state, setState, addLog] = useStore();

  const [district, setDistrict] = useState('All');
  const [status, setStatus] = useState('Profiled');
  const [dateFrom, setDateFrom] = useState('');
  const [template, setTemplate] = useState('assessmentReady');
  const [smsBody, setSmsBody] = useState(state.smsConfig.templates.assessmentReady);
  const [recipients, setRecipients] = useState([]);

  // Recipient list preview calculation
  useEffect(() => {
    const filtered = state.youths.filter(y => {
      const matchDistrict = district === 'All' || y.district === district;
      
      let matchStatus = false;
      if (status === 'Profiled') {
        matchStatus = y.status === 'Profiled' || y.status === 'Assessed';
      } else if (status === 'Registered') {
        matchStatus = y.status === 'Registered' || y.status === 'Assessment Pending';
      } else {
        matchStatus = y.status === status;
      }
      
      return matchDistrict && matchStatus;
    });
    setRecipients(filtered);
  }, [district, status, state.youths]);

  const handleTemplateChange = (val) => {
    setTemplate(val);
    if (val === 'assessmentReady') {
      setSmsBody(state.smsConfig.templates.assessmentReady);
    } else {
      setSmsBody('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (recipients.length === 0) {
      alert("No recipients match the criteria.");
      return;
    }

    if (confirm(`Are you sure you want to send SMS to ${recipients.length} recipients?`)) {
      alert(`Bulk SMS Campaign successfully queued via ${state.smsConfig.provider}!`);
      
      // Update store for messages sent (set messageSent: true on all targets)
      const updatedYouths = state.youths.map(y => {
        const isTarget = recipients.some(r => r.id === y.id);
        if (isTarget && y.aiProfile) {
          return {
            ...y,
            aiProfile: {
              ...y.aiProfile,
              messageSent: true
            }
          };
        }
        return y;
      });

      setState({ youths: updatedYouths });
      addLog(state.staffUser?.name, 'Bulk SMS', `Sent campaign to ${recipients.length} recipients.`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontSize: '2rem' }}>Bulk SMS Campaigns</h2>
          <p>Target specific cohorts and send mass SMS notifications.</p>
        </div>
      </div>
      
      <div className="grid-cols-2 gap-4">
        {/* Filter Panel */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <h3 style={{ marginBottom: '1rem' }}>Campaign Filters</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Target District</label>
              <select 
                className="form-control" 
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="All">All Districts</option>
                <option value="Khulna">Khulna</option>
                <option value="Gazipur">Gazipur</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Profile Status</label>
              <select 
                className="form-control" 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Profiled">AI Profiled (Results Ready)</option>
                <option value="Registered">Pending Assessment (Reminder)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Registration Date From (Optional)</label>
              <input 
                type="date" 
                className="form-control" 
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Message Content</h4>
            <div className="form-group">
              <label className="form-label">Template</label>
              <select 
                className="form-control" 
                value={template}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                <option value="assessmentReady">Assessment Results Ready</option>
                <option value="custom">Custom Message</option>
              </select>
            </div>
            
            <div className="form-group">
              <textarea 
                className="form-control" 
                rows="4" 
                value={smsBody}
                onChange={(e) => setSmsBody(e.target.value)}
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>🚀 Send Bulk Campaign</button>
          </form>
        </div>
        
        {/* Preview Panel */}
        <div className="card" style={{ background: 'var(--surface-hover)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Recipient Preview</h3>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Estimated recipients based on current filters: <strong style={{ color: 'var(--primary)' }}>{recipients.length}</strong>
          </p>
          
          <div className="table-wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>District</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recipients.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">No matching recipients.</td>
                  </tr>
                ) : (
                  recipients.map(y => (
                    <tr key={y.id}>
                      <td style={{ fontWeight: 500 }}>{y.name}</td>
                      <td>{y.district}</td>
                      <td><span className="badge badge-neutral">{y.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
