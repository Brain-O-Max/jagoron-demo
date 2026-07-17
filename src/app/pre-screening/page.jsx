"use client";

import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store.js';

export default function PreScreeningPage() {
  const [state, setState, addLog] = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processLogs, setProcessLogs] = useState([]);
  const [showFinishBtn, setShowFinishBtn] = useState(false);
  const [selectedYouthId, setSelectedYouthId] = useState(null);

  const logsEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [processLogs]);

  const pendingYouths = state.youths.filter(y => y.status === 'Submitted' || y.status === 'Pre-screeing');

  const filteredYouths = searchQuery
    ? pendingYouths.filter(y => 
        (y.name && y.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (y.phone && y.phone.includes(searchQuery)) ||
        (y.id && y.id.toString().includes(searchQuery))
      )
    : pendingYouths;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredYouths.map(y => y.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(x => x !== id));
    }
  };

  const handleManualApprove = (youth) => {
    if (youth.status === 'Submitted') {
      alert('Cannot approve. This profile is missing Assessment Data. Please complete the assessment first.');
      return;
    }
    
    if (confirm(`Manually approve ${youth.name}?`)) {
      const updatedYouths = state.youths.map(u => 
        u.id === youth.id ? { ...u, status: 'Assessment Completed' } : u
      );
      setState({ youths: updatedYouths });
      addLog(state.staffUser?.name, 'Manual Approve', `Manually approved ${youth.name}`);
    }
  };

  const runMLValidation = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one profile to run the ML validation process.');
      return;
    }

    setIsProcessing(true);
    setShowFinishBtn(false);
    setProcessLogs([{ text: '> INIT ML Validation Sequence...' }]);

    const appendLog = (text, color = '#38bdf8') => {
      setProcessLogs(prev => [...prev, { text, color }]);
    };

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    await delay(300);
    appendLog('> Connecting to centralized beneficiary database...');
    
    const selectedProfiles = pendingYouths.filter(y => selectedIds.includes(y.id));
    const approvedProfiles = state.youths.filter(y => y.status !== 'Submitted' && y.status !== 'Pre-screeing');

    let approvedCount = 0;
    let rejectedCount = 0;

    const validationList = [];

    for (const profile of selectedProfiles) {
      await delay(200);
      appendLog(`> Analyzing profile: ${profile.name} (ID: #${profile.id})`);

      let isDuplicate = false;
      if (profile.phone) {
        const dup = approvedProfiles.find(ap => ap.phone === profile.phone && ap.id !== profile.id);
        if (dup) {
          isDuplicate = true;
          await delay(300);
          appendLog(`> CROSS-REF ERROR: Duplicate phone number ${profile.phone} found matching ID #${dup.id}.`, '#ef4444');
        } else {
          await delay(250);
          appendLog(`> Cross-referencing phone ${profile.phone || 'N/A'} for duplicates... No matches found.`);
        }
      }

      if (isDuplicate) {
        await delay(300);
        appendLog(`> ERROR: Profile ${profile.name} rejected due to duplicate data.`, '#ef4444');
        rejectedCount++;
        validationList.push({ id: profile.id, approve: false });
      } else if (profile.status === 'Submitted') {
        await delay(300);
        appendLog(`> ERROR: Profile ${profile.name} rejected. Reason: Missing Q&A Assessment Data.`, '#ef4444');
        rejectedCount++;
        validationList.push({ id: profile.id, approve: false });
      } else {
        await delay(300);
        appendLog(`> SUCCESS: Profile ${profile.name} demographic & assessment data verified.`, '#10b981');
        approvedCount++;
        validationList.push({ id: profile.id, approve: true });
      }
    }

    await delay(400);
    appendLog('> Finalizing ML batch processing...');
    
    // Perform data updates
    const updatedYouths = state.youths.map(y => {
      const decision = validationList.find(x => x.id === y.id);
      if (decision && decision.approve) {
        return { ...y, status: 'Assessment Completed' };
      }
      return y;
    });

    setState({ youths: updatedYouths });
    addLog(state.staffUser?.name, 'Pre-Screening ML', `Approved ${approvedCount}, Rejected ${rejectedCount}.`);

    await delay(300);
    appendLog(`> PROCESS COMPLETE. ${approvedCount} Approved. ${rejectedCount} Rejected.`, '#10b981');

    setShowFinishBtn(true);
    setSelectedIds([]);
  };

  const handleFinish = () => {
    setIsProcessing(false);
    setProcessLogs([]);
    setShowFinishBtn(false);
  };

  const activeYouthDetails = selectedYouthId ? pendingYouths.find(y => y.id === selectedYouthId) : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontSize: '2rem' }}>Pre-Screening ML Validation</h2>
          <p>Run the ML validation process to detect anomalies and duplicate entries before allowing assessments.</p>
        </div>
        <button 
          onClick={runMLValidation}
          className="btn btn-primary" 
          style={{ background: 'var(--accent)', borderColor: 'var(--accent)', padding: '0.75rem 1.5rem', fontWeight: 'bold' }}
          disabled={pendingYouths.length === 0}
        >
          🤖 Run ML Pre-Screening Process
        </button>
      </div>
      
      <div style={{ marginBottom: '1.5rem', display: 'flex', maxWidth: '400px' }}>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search by name, ID, or phone..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={filteredYouths.length > 0 && selectedIds.length === filteredYouths.length}
                  />
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>District</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredYouths.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No profiles pending validation.
                  </td>
                </tr>
              ) : (
                filteredYouths.map(y => (
                  <tr key={y.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        value={y.id}
                        checked={selectedIds.includes(y.id)}
                        onChange={(e) => handleSelectOne(y.id, e.target.checked)}
                      />
                    </td>
                    <td style={{ fontWeight: 500 }}>#{y.id.toString().padStart(4, '0')}</td>
                    <td style={{ fontWeight: 500 }}>{y.name}</td>
                    <td>{y.district}</td>
                    <td><span className="badge badge-neutral">{y.status}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedYouthId(y.id)}
                          className="btn btn-secondary btn-view" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          👁️ View Details
                        </button>
                        <button 
                          onClick={() => handleManualApprove(y)}
                          className="btn btn-primary btn-approve" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: 'var(--success)', borderColor: 'var(--success)' }}
                        >
                          ✓ Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Processing Console Modal */}
      {isProcessing && (
        <div className="modal-overlay" style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.95)', zIndex: 100 }}>
          <div className="modal-content" style={{ background: '#020617', border: '1px solid #1e293b', color: '#38bdf8', fontFamily: "'Courier New', Courier, monospace", width: '100%', maxWidth: '600px', padding: '2rem' }}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>🤖 ML Validation Engine</h3>
            
            <div style={{ minHeight: '200px', maxHeight: '300px', overflowY: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {processLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.color }}>{log.text}</div>
              ))}
              <div ref={logsEndRef} />
            </div>
            
            {!showFinishBtn ? (
              <div style={{ display: 'block' }}>
                <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', display: 'inline-block', marginTop: '0.5rem' }}></span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>Processing data matrix...</span>
              </div>
            ) : (
              <div>
                <button onClick={handleFinish} className="btn btn-primary" style={{ width: '100%', background: '#10b981', borderColor: '#10b981' }}>Finish & Close</button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Profile Details Modal */}
      {activeYouthDetails && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ margin: 0 }}>Profile Details: {activeYouthDetails.name}</h3>
              <button onClick={() => setSelectedYouthId(null)} className="btn-icon">✕</button>
            </div>
            <div style={{ background: 'var(--surface-hover)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>Full Name</span> <strong>{activeYouthDetails.name}</strong></div>
                <div><span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>Date of Birth</span> <strong>{activeYouthDetails.dob || 'N/A'}</strong></div>
                <div><span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>Age</span> <strong>{activeYouthDetails.age}</strong></div>
                <div><span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>Gender</span> <strong>{activeYouthDetails.gender}</strong></div>
                <div><span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>District</span> <strong>{activeYouthDetails.district}</strong></div>
                <div><span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>PWD Status</span> <strong>{activeYouthDetails.pwd}</strong></div>
              </div>
            </div>
            <div className="flex gap-2" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedYouthId(null)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
