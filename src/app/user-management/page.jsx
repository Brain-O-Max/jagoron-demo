"use client";

import { useState } from 'react';
import { useStore } from '../../store.js';

export default function UserManagementPage() {
  const [state, setState, addLog] = useStore();

  const [currentView, setCurrentView] = useState('table'); // 'table' or 'form'
  const [uploadedPhotoURL, setUploadedPhotoURL] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState('Field Officer');
  const [org, setOrg] = useState('CARE Bangladesh');
  const [dob, setDob] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');

  // Access check
  if (state.staffUser?.role !== 'Admin') {
    return (
      <div className="card text-center" style={{ marginTop: '4rem' }}>
        <h2 style={{ color: 'var(--accent)' }}>Access Denied</h2>
        <p>You do not have permission to view User Management. (Requires Admin role)</p>
      </div>
    );
  }

  const handleAddUser = () => {
    setEditingUserId(null);
    setUploadedPhotoURL('');
    setName('');
    setEmail('');
    setMobile('');
    setDesignation('');
    setRole('Field Officer');
    setOrg('CARE Bangladesh');
    setDob('');
    setJoiningDate('');
    setLocation('');
    setAddress('');
    setCurrentView('form');
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setUploadedPhotoURL(user.photo || '');
    setName(user.name || '');
    setEmail(user.email || '');
    setMobile(user.mobile || '');
    setDesignation(user.designation || '');
    setRole(user.role || 'Field Officer');
    setOrg(user.org || 'CARE Bangladesh');
    setDob(user.dob || '');
    setJoiningDate(user.joiningDate || '');
    setLocation(user.location || '');
    setAddress(user.address || '');
    setCurrentView('form');
  };

  const handleDelete = (id, username) => {
    if (confirm(`Delete user ${username} entirely?`)) {
      const uIndex = state.staffUsers.findIndex(u => u.id === id);
      if (uIndex !== -1) {
        const updated = state.staffUsers.filter(u => u.id !== id);
        setState({ staffUsers: updated });
        addLog(state.staffUser.name, 'Manage Users', `Deleted user: ${username}`);
      }
    }
  };

  const handleStatusToggle = (id, username, currentStatus) => {
    const updated = state.staffUsers.map(u => {
      if (u.id === id) {
        const nextStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';
        addLog(state.staffUser.name, 'Manage Users', `${nextStatus === 'Disabled' ? 'Disabled' : 'Enabled'} user: ${username}`);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setState({ staffUsers: updated });
  };

  const handleResetPassword = (username) => {
    alert(`Password for ${username} has been reset to: 123456`);
    addLog(state.staffUser.name, 'Manage Users', `Reset password for: ${username}`);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedPhotoURL(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUserId) {
      // Edit User
      const updated = state.staffUsers.map(u => {
        if (u.id === editingUserId) {
          return {
            ...u,
            name,
            email,
            mobile,
            designation,
            role,
            org,
            dob,
            joiningDate,
            location,
            address,
            photo: uploadedPhotoURL
          };
        }
        return u;
      });
      setState({ staffUsers: updated });
      addLog(state.staffUser.name, 'Manage Users', `Updated user: ${name}`);
    } else {
      // Create User
      const newUser = {
        id: Date.now(),
        name,
        email,
        mobile,
        designation,
        role,
        org,
        dob,
        joiningDate,
        location,
        address,
        photo: uploadedPhotoURL,
        status: 'Active'
      };
      setState({ staffUsers: [...state.staffUsers, newUser] });
      addLog(state.staffUser.name, 'Manage Users', `Created new user: ${name}`);
    }

    setCurrentView('table');
  };

  return (
    <div>
      {currentView === 'table' ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 style={{ fontSize: '2rem' }}>User Management</h2>
              <p>Manage staff accounts, edit user details, and handle security credentials.</p>
            </div>
            <button className="btn btn-primary" onClick={handleAddUser}>+ Add New User</button>
          </div>
          
          <div className="card" style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)' }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>User Details</th>
                    <th>Role & Org</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.staffUsers.map(u => (
                    <tr key={u.id} style={u.status === 'Disabled' ? { opacity: 0.6, background: 'rgba(0,0,0,0.02)' } : {}}>
                      <td>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {u.photo ? (
                            <img src={u.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="User" />
                          ) : (
                            <span style={{ color: '#64748b', fontWeight: 'bold' }}>{u.name.charAt(0)}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.designation || 'Staff'}</div>
                      </td>
                      <td>
                        <div><span className={`badge ${u.role === 'Admin' ? 'badge-info' : 'badge-neutral'}`}>{u.role}</span></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{u.org}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        <div>📧 {u.email}</div>
                        <div>📱 {u.mobile || 'N/A'}</div>
                      </td>
                      <td><span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>{u.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button onClick={() => handleEdit(u)} className="btn btn-secondary" title="Edit User" style={{ padding: '0.2rem 0.5rem', fontSize: '1rem' }}>✏️</button>
                          <button onClick={() => handleResetPassword(u.name)} className="btn btn-secondary" title="Reset Password" style={{ padding: '0.2rem 0.5rem', fontSize: '1rem' }}>🔑</button>
                          <button onClick={() => handleStatusToggle(u.id, u.name, u.status)} className="btn btn-secondary" title={u.status === 'Active' ? 'Disable User' : 'Enable User'} style={{ padding: '0.2rem 0.5rem', fontSize: '1rem' }}>
                            {u.status === 'Active' ? '🚫' : '✅'}
                          </button>
                          <button onClick={() => handleDelete(u.id, u.name)} className="btn btn-secondary" title="Delete User" style={{ padding: '0.2rem 0.5rem', fontSize: '1rem' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* FORM VIEW */
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 style={{ fontSize: '2rem' }}>{editingUserId ? 'Edit User Profile' : 'Create New User'}</h2>
              <p>{editingUserId ? 'Update the staff account information.' : 'Provision a new staff account and assign an organizational role.'}</p>
            </div>
            <button className="btn btn-secondary" onClick={() => setCurrentView('table')}>&larr; Back to List</button>
          </div>
          
          <div className="card" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)', maxWidth: '900px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                
                {/* Left Side: Photo Upload */}
                <div style={{ width: '250px', flexShrink: 0, textAlign: 'center' }}>
                  <label className="form-label text-left w-full">User Photo (Optional)</label>
                  <label 
                    style={{ width: '100%', height: '250px', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                  >
                    {uploadedPhotoURL ? (
                      <img src={uploadedPhotoURL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar Preview" />
                    ) : (
                      <>
                        <div style={{ fontSize: '3rem', color: '#cbd5e1' }}>📸</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '1rem' }}>Click to Upload Photo</div>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                
                {/* Right Side: Details */}
                <div style={{ flex: 1 }}>
                  <div className="flex gap-4 mb-3">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Full Name *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mb-3">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Mobile *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={mobile} 
                        onChange={(e) => setMobile(e.target.value)} 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Designation</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={designation} 
                        onChange={(e) => setDesignation(e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mb-3">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">System Role *</label>
                      <select 
                        className="form-control" 
                        required 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                      >
                        {state.roles.map(r => (
                          <option key={r.name} value={r.name}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Organization Name</label>
                      <select 
                        className="form-control"
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                      >
                        <option>CARE Bangladesh</option>
                        <option>SOS Childrens Village</option>
                        <option>Donor Agency</option>
                        <option>Local YLO</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mb-3">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Date of Birth</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={dob} 
                        onChange={(e) => setDob(e.target.value)} 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Joining Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={joiningDate} 
                        onChange={(e) => setJoiningDate(e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <div className="form-group mb-3">
                    <label className="form-label">Location / Area</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                    />
                  </div>
                  
                  <div className="form-group mb-4">
                    <label className="form-label">Full Address</label>
                    <textarea 
                      className="form-control" 
                      rows="2"
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                    {editingUserId ? 'Save User Updates' : 'Create User Account'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
