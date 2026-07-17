"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useStore } from '../store.js';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';

export function ClientLayout({ children }) {
  const [state] = useStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if user is not authenticated and is not already on /login
    if (state.isInitialized && !state.staffUser && pathname !== '/login') {
      router.replace('/login');
    }
    // Redirect to home if user is authenticated and is on /login
    if (state.isInitialized && state.staffUser && pathname === '/login') {
      router.replace(state.appLayout === 'grid' ? '/home' : '/dashboard');
    }
  }, [state.staffUser, state.isInitialized, pathname, router, state.appLayout]);

  if (!state.isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#0b0f19', color: '#38bdf8' }}>
        <div className="spinner-primary"></div>
        <span style={{ marginLeft: '1rem', fontFamily: 'monospace' }}>Loading JAGORON Store...</span>
      </div>
    );
  }

  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      {state.appLayout === 'sidebar' && <Sidebar />}
      <div 
        className={`main-content ${state.appLayout === 'sidebar' && state.sidebarCollapsed ? 'collapsed' : ''}`}
        style={{ 
          marginLeft: state.appLayout === 'sidebar' ? (state.sidebarCollapsed ? '80px' : '280px') : '0',
          transition: 'margin-left 0.3s ease'
        }}
      >
        <Topbar />
        <main className="view-container">
          {children}
        </main>
      </div>
    </div>
  );
}
