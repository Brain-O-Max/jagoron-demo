"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store.js';

export default function AssessmentEnginePage() {
  const [state] = useStore();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [selectedIds, setSelectedIds] = useState([]);

  // Filter youths who need assessment or processing
  let targetYouths = state.youths.filter(y => 
    y.status === 'Assessment Pending' || 
    y.status === 'Assessment Completed' || 
    y.status === 'Assessed' || 
    y.status === 'Profiled'
  );

  // Apply filters
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    targetYouths = targetYouths.filter(y => 
      (y.name && y.name.toLowerCase().includes(q)) || 
      (y.id && y.id.toString().includes(q))
    );
  }

  if (districtFilter !== 'All Districts') {
    targetYouths = targetYouths.filter(y => y.district === districtFilter);
  }

  if (statusFilter !== 'All Statuses') {
    if (statusFilter === 'Pending Assessment') {
      targetYouths = targetYouths.filter(y => y.status === 'Assessment Pending');
    } else if (statusFilter === 'Pending AI Processing') {
      targetYouths = targetYouths.filter(y => y.status === 'Assessment Completed');
    } else if (statusFilter === 'Assessed') {
      targetYouths = targetYouths.filter(y => y.status === 'Assessed' || y.status === 'Profiled');
    }
  }

  const pendingProcessing = targetYouths.filter(y => 
    y.status === 'Assessment Completed' || y.status === 'Assessed' || y.status === 'Profiled'
  );

  const handleSelectAll = (e) => {
    // Only select checkable items (status === 'Assessment Pending')
    const checkable = targetYouths.filter(y => y.status === 'Assessment Pending');
    if (e.target.checked) {
      setSelectedIds(checkable.map(y => y.id));
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

  const handleRunAllAi = () => {
    if (pendingProcessing.length > 0) {
      const targets = pendingProcessing.map(y => y.id);
      router.push(`/processing?bulk=true&targets=${targets.join(',')}&from=/assessment-engine`);
    }
  };

  const handleIndividualProcess = (id) => {
    router.push(`/processing?bulk=false&targets=${id}&from=/assessment-engine`);
  };

  const handleBulkAssess = () => {
    if (selectedIds.length > 0) {
      router.push(`/assessment?bulk=true&targets=${selectedIds.join(',')}`);
    }
  };

  const handleStartIndividualAssess = (id) => {
    router.push(`/assessment?youthId=${id}`);
  };

  const handleViewProfile = (id) => {
    router.push(`/results?youthId=${id}&from=/assessment-engine`);
  };

  const checkableProfiles = targetYouths.filter(y => y.status === 'Assessment Pending');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontSize: '2rem' }}>Assessment Engine</h2>
          <p>Run psychometric profiling and trigger AI Processing Engines.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkAssess}
              className="btn btn-primary" 
              style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}
            >
              📋 Bulk Assess Selected ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={handleRunAllAi}
            className="btn btn-primary" 
            disabled={pendingProcessing.length === 0}
            style={pendingProcessing.length === 0 ? { opacity: 0.5 } : {}}
          >
            🚀 Run AI Engine ({pendingProcessing.length} Available)
          </button>
        </div>
      </div>
      
      <div className="card mb-4" style={{ background: 'var(--surface-hover)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Filter Profiles</h3>
        <div className="flex gap-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search ID or Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="form-control"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            <option>All Districts</option>
            <option>Khulna</option>
            <option>Gazipur</option>
          </select>
          <select 
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Statuses</option>
            <option>Pending Assessment</option>
            <option>Pending AI Processing</option>
            <option>Assessed</option>
          </select>
        </div>
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
                    checked={checkableProfiles.length > 0 && selectedIds.length === checkableProfiles.length}
                  />
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>District</th>
                <th>Assessment Date</th>
                <th>Assessment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {targetYouths.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No profiles available.
                  </td>
                </tr>
              ) : (
                targetYouths.map(y => {
                  const dateStr = y.updatedAt ? new Date(y.updatedAt).toLocaleString() : new Date().toLocaleString();
                  
                  let actionBtn = null;
                  if (y.status === 'Assessment Pending') {
                    actionBtn = (
                      <button 
                        onClick={() => handleStartIndividualAssess(y.id)}
                        className="btn btn-primary start-btn" 
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        Start Q&A
                      </button>
                    );
                  } else if (y.status === 'Assessment Completed') {
                    actionBtn = (
                      <button 
                        onClick={() => handleIndividualProcess(y.id)}
                        className="btn btn-secondary process-btn" 
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: 'var(--accent)', borderColor: 'var(--accent)' }}
                      >
                        Run AI Engine
                      </button>
                    );
                  } else if (y.status === 'Assessed' || y.status === 'Profiled') {
                    actionBtn = (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewProfile(y.id)}
                          className="btn btn-secondary view-btn" 
                          style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          View Profile
                        </button>
                        <button 
                          onClick={() => handleIndividualProcess(y.id)}
                          className="btn btn-secondary process-btn" 
                          style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: 'var(--warning)', borderColor: 'var(--warning)' }}
                        >
                          Re-run AI
                        </button>
                      </div>
                    );
                  }

                  let badgeClass = 'badge-neutral';
                  if (y.status === 'Assessment Pending') badgeClass = 'badge-neutral';
                  if (y.status === 'Assessment Completed') badgeClass = 'badge-primary';
                  if (y.status === 'Assessed' || y.status === 'Profiled') badgeClass = 'badge-success';

                  return (
                    <tr key={y.id}>
                      <td>
                        {y.status === 'Assessment Pending' && (
                          <input 
                            type="checkbox" 
                            value={y.id}
                            checked={selectedIds.includes(y.id)}
                            onChange={(e) => handleSelectOne(y.id, e.target.checked)}
                          />
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>#{y.id.toString().padStart(4, '0')}</td>
                      <td>{y.name}</td>
                      <td>{y.district}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {y.status !== 'Assessment Pending' ? dateStr : 'Pending...'}
                      </td>
                      <td>
                        {badgeClass === 'badge-primary' ? (
                          <span className="badge badge-primary" style={{ background: 'var(--primary)', color: 'white' }}>
                            {y.status}
                          </span>
                        ) : (
                          <span className={`badge ${badgeClass}`}>{y.status}</span>
                        )}
                      </td>
                      <td>{actionBtn}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
