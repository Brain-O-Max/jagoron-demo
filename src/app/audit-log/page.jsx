"use client";

import { useState } from 'react';
import { useStore } from '../../store.js';

export default function AuditLogPage() {
  const [state] = useStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Access check
  if (state.staffUser?.role !== 'Admin') {
    return (
      <div className="card text-center" style={{ marginTop: '4rem' }}>
        <h2 style={{ color: 'var(--accent)' }}>Access Denied</h2>
        <p>You do not have permission to view Audit Log. (Requires Admin role)</p>
      </div>
    );
  }

  // Filter logs
  const filteredLogs = searchQuery
    ? state.auditLogs.filter(log => 
        (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : state.auditLogs;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontSize: '2rem' }}>Audit Log & Security Trail</h2>
          <p>Read-only access trace for compliance, edits, and configuration activities.</p>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Filter audit logs..." 
              style={{ paddingLeft: '2.5rem' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span style={{ position: 'absolute', left: '1rem', top: '0.75rem', color: 'var(--text-muted)' }}>🔍</span>
          </div>
        </div>
        
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Staff Account</th>
                <th>Action Category</th>
                <th>Operation Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td className="text-muted" style={{ fontSize: '0.85rem' }}>{log.timestamp}</td>
                  <td style={{ fontWeight: 500 }}>👤 {log.user}</td>
                  <td>
                    <span 
                      className={`badge ${
                        log.action === 'Security' || log.action === 'Manual Approve'
                          ? 'badge-warning' 
                          : log.action === 'Delete' || log.action === 'Disabled'
                            ? 'badge-neutral'
                            : 'badge-info'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
