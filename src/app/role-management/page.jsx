"use client";

import { useState } from 'react';
import { useStore } from '../../store.js';

export default function RoleManagementPage() {
  const [state, setState, addLog] = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [activeRoleName, setActiveRoleName] = useState('');
  const [activePermissions, setActivePermissions] = useState([]);

  // Access check
  if (state.staffUser?.role !== 'Admin') {
    return (
      <div className="card text-center" style={{ marginTop: '4rem' }}>
        <h2 style={{ color: 'var(--accent)' }}>Access Denied</h2>
        <p>You do not have permission to view Role Management. (Requires Admin role)</p>
      </div>
    );
  }

  // All available permissions in system
  const availablePermissions = [
    { key: 'dashboard', label: 'Overview Dashboard' },
    { key: 'donor_dashboard', label: 'Donor Impact Dashboard' },
    { key: 'assess_youth', label: 'Assess & Register Youth' },
    { key: 'bulk_sms', label: 'Gateway Configuration & Bulk SMS' },
    { key: 'reports', label: 'Export Reports & Aggregations' },
    { key: 'question_bank', label: 'Dynamic Question Bank Management' },
    { key: 'mis_sync', label: 'Central MIS DB Integrations' },
    { key: 'manage_users', label: 'User Account Management' },
    { key: 'manage_roles', label: 'Role & Permissions Console' }
  ];

  const handleEditPermissions = (role) => {
    setActiveRoleName(role.name);
    setActivePermissions(role.permissions || []);
    setModalOpen(true);
  };

  const handleCheckboxChange = (key, checked) => {
    if (checked) {
      setActivePermissions([...activePermissions, key]);
    } else {
      setActivePermissions(activePermissions.filter(x => x !== key));
    }
  };

  const handleSavePermissions = (e) => {
    e.preventDefault();

    const updatedRoles = state.roles.map(r => 
      r.name === activeRoleName ? { ...r, permissions: activePermissions } : r
    );

    setState({ roles: updatedRoles });
    addLog(state.staffUser.name, 'Manage Roles', `Modified permissions for role: ${activeRoleName}`);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontSize: '2rem' }}>Role & Permission Management</h2>
          <p>Define global user roles, customize permissions matrices, and restrict views.</p>
        </div>
      </div>
      
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Description</th>
                <th>Assigned Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.roles.map(r => (
                <tr key={r.name}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.description}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {r.permissions.map(perm => (
                        <span key={perm} className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {perm.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEditPermissions(r)}
                      className="btn btn-secondary edit-btn" 
                      style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      🛡️ Edit Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Permissions Modal */}
      {modalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Edit Permissions: {activeRoleName}</h3>
            
            <form onSubmit={handleSavePermissions}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {availablePermissions.map(p => {
                  const isChecked = activePermissions.includes(p.key);
                  return (
                    <label key={p.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => handleCheckboxChange(p.key, e.target.checked)}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <span style={{ fontSize: '0.95rem', fontWeight: isChecked ? '600' : '400' }}>{p.label}</span>
                    </label>
                  );
                })}
              </div>
              
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Permissions Matrix</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
