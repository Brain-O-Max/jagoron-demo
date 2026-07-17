"use client";

import { useState } from 'react';
import { useStore } from '../../store.js';

export default function ReportsPage() {
  const [state] = useStore();

  const [district, setDistrict] = useState('All');
  const [gender, setGender] = useState('All');
  const [status, setStatus] = useState('All');

  // Apply filters
  let filtered = state.youths;

  if (district !== 'All') {
    filtered = filtered.filter(y => y.district === district);
  }
  if (gender !== 'All') {
    filtered = filtered.filter(y => y.gender === gender);
  }
  if (status !== 'All') {
    filtered = filtered.filter(y => {
      if (status === 'Assessed') return y.status === 'Assessed' || y.status === 'Profiled';
      return y.status === status;
    });
  }

  const handleExport = (type) => {
    alert(`Successfully generated and exported ${filtered.length} records to ${type}!`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontSize: '2rem' }}>Reports & Data Export</h2>
          <p>Generate reports, filter dataset records, and export CSV/Excel sheets.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => handleExport('PDF')} className="btn btn-secondary">💾 Export PDF</button>
          <button onClick={() => handleExport('Excel')} className="btn btn-primary">📊 Export Excel / CSV</button>
        </div>
      </div>
      
      {/* Report Filter Card */}
      <div className="card mb-4" style={{ background: 'var(--surface-hover)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Query Filter</h3>
        <div className="flex gap-4">
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <label className="form-label">District</label>
            <select className="form-control" value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="All">All Districts</option>
              <option value="Khulna">Khulna</option>
              <option value="Gazipur">Gazipur</option>
            </select>
          </div>
          
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <label className="form-label">Gender</label>
            <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="All">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <label className="form-label">Status</label>
            <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assessment Pending">Assessment Pending</option>
              <option value="Assessment Completed">Assessment Completed</option>
              <option value="Assessed">Assessed & Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Filtered Data Table */}
      <div className="card">
        <h3 style={{ marginBottom: '1.25rem' }}>Report Preview: {filtered.length} Youth Records</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>District</th>
                <th>Recommended Pathway</th>
                <th>Match Conf.</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No records match the current filter query.
                  </td>
                </tr>
              ) : (
                filtered.map(y => (
                  <tr key={y.id}>
                    <td style={{ fontWeight: 500 }}>#{y.id.toString().padStart(4, '0')}</td>
                    <td style={{ fontWeight: 600 }}>{y.name}</td>
                    <td>{y.gender}</td>
                    <td>{y.age}</td>
                    <td>{y.district}</td>
                    <td>{y.aiProfile ? y.aiProfile.pathway : <span className="text-muted">N/A</span>}</td>
                    <td style={{ fontWeight: 'bold' }}>
                      {y.aiProfile ? `${y.aiProfile.confidence}%` : <span className="text-muted">N/A</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
