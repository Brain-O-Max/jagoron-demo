"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store.js';

export default function BeneficiariesPage() {
  const [state, setState, addLog] = useStore();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // SMS Modal State
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [activeSmsId, setActiveSmsId] = useState(null);
  const [activeSmsName, setActiveSmsName] = useState('');
  const [smsTemplate, setSmsTemplate] = useState('assessmentReady');
  const [smsBody, setSmsBody] = useState('');

  const handleRegister = () => {
    router.push('/register-youth');
  };

  const handleStartAssessment = (id) => {
    setState({ currentYouthId: id });
    router.push(`/assessment?youthId=${id}`);
  };

  const handleViewProfile = (id) => {
    setState({ currentYouthId: id });
    router.push(`/results?youthId=${id}`);
  };

  const handleEditProfile = (id) => {
    router.push(`/register-youth?editId=${id}`);
  };

  const handleDeleteProfile = (id) => {
    if (confirm('Are you sure you want to permanently delete this beneficiary?')) {
      const updatedYouths = state.youths.filter(y => y.id !== id);
      setState({ youths: updatedYouths });
      addLog(state.staffUser?.name, 'Registration', `Deleted beneficiary ID #${id}`);
    }
  };

  const openSmsModal = (name, id) => {
    setActiveSmsId(id);
    setActiveSmsName(name);
    
    let tmpl = state.smsConfig.templates.assessmentReady;
    tmpl = tmpl.replace('{name}', name).replace('{pathway}', '[Recommended Pathway]');
    setSmsBody(tmpl);
    setSmsModalOpen(true);
  };

  const handleTemplateChange = (val) => {
    setSmsTemplate(val);
    if (val === 'assessmentReady') {
      let tmpl = state.smsConfig.templates.assessmentReady;
      tmpl = tmpl.replace('{name}', activeSmsName).replace('{pathway}', '[Recommended Pathway]');
      setSmsBody(tmpl);
    } else {
      setSmsBody('');
    }
  };

  const handleSendSms = () => {
    setSmsModalOpen(false);
    alert('SMS queued for delivery successfully!');
    addLog(state.staffUser?.name, 'SMS Sent', `Sent SMS campaign to: ${activeSmsName}`);
  };

  // Filter logic
  let filteredYouths = state.youths;

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredYouths = filteredYouths.filter(y => 
      (y.name && y.name.toLowerCase().includes(q)) || 
      (y.phone && y.phone.includes(q)) ||
      (y.id && y.id.toString().includes(q))
    );
  }

  if (districtFilter !== 'All Districts') {
    filteredYouths = filteredYouths.filter(y => y.district === districtFilter);
  }

  if (statusFilter !== 'All Statuses') {
    filteredYouths = filteredYouths.filter(y => {
      if (statusFilter === 'Assess Pending') return y.status === 'Assessment Pending';
      if (statusFilter === 'AI Processing Pending') return y.status === 'Assessment Completed';
      if (statusFilter === 'Assessed / Completed') return y.status === 'Assessed' || y.status === 'Profiled';
      return y.status === statusFilter;
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontSize: '2rem' }}>Beneficiary Management</h2>
          <p>Manage registrations, assessments, and notifications.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleRegister} className="btn btn-primary">+ Register New Youth</button>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by name or ID..." 
              style={{ paddingLeft: '2.5rem' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span style={{ position: 'absolute', left: '1rem', top: '0.75rem', color: 'var(--text-muted)' }}>🔍</span>
          </div>
          <div className="flex gap-2">
            <select 
              className="form-control" 
              style={{ width: 'auto' }}
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option>All Districts</option>
              <option>Khulna</option>
              <option>Gazipur</option>
            </select>
            <select 
              className="form-control" 
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Submitted</option>
              <option>Pre-screening</option>
              <option>Assess Pending</option>
              <option>AI Processing Pending</option>
              <option>Assessed / Completed</option>
            </select>
          </div>
        </div>
        
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>ID</th>
                <th>Name & Demographics</th>
                <th>District</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredYouths.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
                    No beneficiaries found.
                  </td>
                </tr>
              ) : (
                filteredYouths.map(youth => {
                  let statusBadge = '';
                  if (youth.status === 'Submitted') {
                    statusBadge = <span className="badge badge-neutral">Submitted</span>;
                  } else if (youth.status === 'Pre-screeing' || youth.status === 'Pre-screening') {
                    statusBadge = <span className="badge badge-neutral">Pre-screening</span>;
                  } else if (youth.status === 'Assessment Pending') {
                    statusBadge = <span className="badge badge-warning">Assess Pending</span>;
                  } else if (youth.status === 'Assessment Completed') {
                    statusBadge = <span className="badge badge-primary" style={{ background: 'var(--primary)', color: 'white' }}>AI Processing Pending</span>;
                  } else if (youth.status === 'Assessed' || youth.status === 'Profiled') {
                    statusBadge = <span className="badge badge-success">Assessed / Completed</span>;
                  } else {
                    statusBadge = <span className="badge badge-neutral">{youth.status}</span>;
                  }
                  
                  return (
                    <tr key={youth.id}>
                      <td><input type="checkbox" value={youth.id} /></td>
                      <td style={{ fontWeight: 500 }}>#{youth.id.toString().padStart(4, '0')}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{youth.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{youth.age} yrs • {youth.gender}</div>
                      </td>
                      <td>{youth.district}</td>
                      <td>{statusBadge}</td>
                      <td>
                        <div className="flex justify-center gap-2">
                          {youth.status === 'Submitted' && (
                            <button 
                              onClick={() => handleStartAssessment(youth.id)}
                              className="btn btn-primary start-btn" 
                              style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                            >
                              Take Assessment
                            </button>
                          )}
                          {['Assessment Completed', 'Profiled', 'Assessed'].includes(youth.status) && (
                            <button 
                              onClick={() => handleViewProfile(youth.id)}
                              className="btn btn-secondary view-btn" 
                              style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                            >
                              View Profile
                            </button>
                          )}
                          <button onClick={() => handleEditProfile(youth.id)} className="btn-icon edit-btn" title="Edit Profile">✏️</button>
                          <button onClick={() => handleDeleteProfile(youth.id)} className="btn-icon delete-btn" title="Delete Profile" style={{ color: '#ef4444' }}>🗑️</button>
                          <button onClick={() => openSmsModal(youth.name, youth.id)} className="btn-icon sms-btn" title="Send SMS">💬</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SMS Modal */}
      {smsModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content">
            <h3 style={{ marginBottom: '1rem' }}>Send SMS to {activeSmsName}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              The message will be queued and sent via {state.smsConfig.provider}.
            </p>
            
            <div className="form-group">
              <label className="form-label">Template</label>
              <select 
                className="form-control"
                value={smsTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                <option value="assessmentReady">Assessment Results Ready</option>
                <option value="custom">Custom Message</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Message Preview</label>
              <textarea 
                className="form-control" 
                rows="4"
                value={smsBody}
                onChange={(e) => setSmsBody(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setSmsModalOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSendSms} className="btn btn-primary">Send Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
