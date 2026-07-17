"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '../store.js';

export function Topbar() {
  const [state, setState, addLog] = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  const user = state.staffUser;

  // Toggle sidebar
  const handleToggleSidebar = () => {
    setState({ sidebarCollapsed: !state.sidebarCollapsed });
  };

  // Toggle layout between grid and sidebar
  const handleToggleLayout = () => {
    setDropdownOpen(false);
    const newLayout = state.appLayout === 'grid' ? 'sidebar' : 'grid';
    setState({ appLayout: newLayout });
    router.push(newLayout === 'grid' ? '/home' : '/dashboard');
  };

  const handleChangePassword = () => {
    setDropdownOpen(false);
    const newPwd = prompt("Enter new password:");
    if (newPwd) {
      alert("Password changed successfully.");
      addLog(user?.name, 'Security', 'Password changed');
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    addLog(user?.name, 'Logout', 'Session ended');
    setState({ staffUser: null });
    router.push('/login');
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        avatarRef.current && !avatarRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="topbar justify-between">
      <div className="flex items-center gap-4">
        {state.appLayout === 'grid' && pathname !== '/home' && (
          <button 
            className="btn btn-secondary" 
            onClick={() => router.push('/home')}
            style={{ padding: '0.4rem 0.8rem' }}
          >
            ← Home
          </button>
        )}
        
        {state.appLayout === 'sidebar' && (
          <button 
            className="btn-icon" 
            onClick={handleToggleSidebar}
            style={{ marginRight: '0.5rem' }}
          >
            ☰
          </button>
        )}
        
        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
          AI Enabled <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>Profile Assessment</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="btn-icon" style={{ position: 'relative' }} title="Notifications">
          🔔
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--accent)', width: '10px', height: '10px', borderRadius: '50%' }}></span>
        </button>
        
        <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user ? user.name : 'Staff'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user ? user.role : 'Officer'}</div>
        </div>

        <div style={{ position: 'relative' }}>
          <div 
            ref={avatarRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
          >
            {user ? user.name.charAt(0) : 'S'}
          </div>

          {dropdownOpen && (
            <div 
              ref={dropdownRef}
              className="card" 
              style={{ position: 'absolute', top: '50px', right: '0', width: '260px', padding: '0.5rem', zIndex: 50, boxShadow: 'var(--shadow-lg)', display: 'block', background: 'white' }}
            >
              <button 
                onClick={handleToggleLayout}
                className="btn btn-secondary" 
                style={{ width: '100%', textAlign: 'left', marginBottom: '0.5rem', border: 'none', justifyContent: 'flex-start', whiteSpace: 'nowrap' }}
              >
                {state.appLayout === 'grid' ? '📱 Switch to Sidebar Layout' : '🔲 Switch to Grid Layout'}
              </button>
              <button 
                onClick={handleChangePassword}
                className="btn btn-secondary" 
                style={{ width: '100%', textAlign: 'left', marginBottom: '0.5rem', border: 'none', justifyContent: 'flex-start', whiteSpace: 'nowrap' }}
              >
                🔑 Change Password
              </button>
              <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }}></div>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary" 
                style={{ width: '100%', textAlign: 'left', border: 'none', color: 'var(--accent)', justifyContent: 'flex-start', whiteSpace: 'nowrap' }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
