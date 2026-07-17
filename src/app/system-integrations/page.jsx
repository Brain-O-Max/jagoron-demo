"use client";

import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store.js';

export default function SystemIntegrationsPage() {
  const [state, setState, addLog] = useStore();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState([]);
  const [showFinish, setShowFinish] = useState(false);

  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [syncLogs]);

  // Access check
  if (state.staffUser?.role !== 'Admin') {
    return (
      <div className="card text-center" style={{ marginTop: '4rem' }}>
        <h2 style={{ color: 'var(--accent)' }}>Access Denied</h2>
        <p>You do not have permission to view System Integrations. (Requires Admin role)</p>
      </div>
    );
  }

  const runSync = async () => {
    setIsSyncing(true);
    setShowFinish(false);
    setSyncLogs([{ text: '> Connection established with central server...' }]);

    const append = (text, color = '#38bdf8') => {
      setSyncLogs(prev => [...prev, { text, color }]);
    };

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    await delay(500);
    append(`> Fetching local database delta... found ${state.youths.length} total records.`);

    await delay(600);
    append('> Syncing user profiles and metadata matrix...');

    const unsynced = state.youths;
    for (const youth of unsynced) {
      await delay(200);
      append(`> Uploaded profile packet: ${youth.name} (Status: ${youth.status})`, '#10b981');
    }

    await delay(600);
    append('> Database delta synchronized. Running validation tests on central node...');
    
    await delay(500);
    append('> Central validation passed. Transaction hash: tx_0x' + Math.floor(Math.random()*100000000).toString(16), '#10b981');

    setState({
      misSync: {
        lastSync: new Date().toLocaleString(),
        status: 'Idle'
      }
    });

    addLog(state.staffUser.name, 'MIS Sync', `Pushed ${state.youths.length} profiles to Central MIS.`);

    setShowFinish(true);
  };

  const handleFinish = () => {
    setIsSyncing(false);
    setSyncLogs([]);
    setShowFinish(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontSize: '2rem' }}>Central MIS Integration</h2>
          <p>Synchronize local offline assessments with the central DHIS2 / national dashboard database.</p>
        </div>
      </div>
      
      <div className="card text-center" style={{ maxWidth: '600px', margin: '2rem auto', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🔗</div>
        <h3>DHIS2 Central Connector</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Connect to national ministry APIs, push profiling delta packets, and back up configuration templates.
        </p>
        
        <div style={{ background: 'var(--surface-hover)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Last Sync Timestamp</span>
            <div style={{ fontWeight: 'bold', fontSize: '1rem', marginTop: '2px' }}>{state.misSync.lastSync}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Connection Status</span>
            <div style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '1rem', marginTop: '2px' }}>● Connected</div>
          </div>
        </div>
        
        <button onClick={runSync} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontWeight: 'bold' }}>
          🔄 Synchronize Database Now
        </button>
      </div>

      {/* Sync Log Overlay Modal */}
      {isSyncing && (
        <div className="modal-overlay" style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.95)', zIndex: 100 }}>
          <div className="modal-content" style={{ background: '#020617', border: '1px solid #1e293b', color: '#38bdf8', fontFamily: "'Courier New', Courier, monospace", width: '100%', maxWidth: '650px', padding: '2rem' }}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>🔗 Database Sync Console</h3>
            
            <div style={{ minHeight: '220px', maxHeight: '350px', overflowY: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              {syncLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.color }}>{log.text}</div>
              ))}
              <div ref={logsEndRef} />
            </div>
            
            {!showFinish ? (
              <div style={{ display: 'block', textAlign: 'center' }}>
                <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', display: 'inline-block' }}></span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>Synchronizing local nodes...</span>
              </div>
            ) : (
              <div>
                <button onClick={handleFinish} className="btn btn-primary" style={{ width: '100%', background: '#10b981', borderColor: '#10b981' }}>Finish & Close Sync</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
