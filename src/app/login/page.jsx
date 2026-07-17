"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store.js';

export default function LoginPage() {
  const [state, setState] = useStore();
  const router = useRouter();

  const [email, setEmail] = useState('admin@xyz.org');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e) => {
    e.preventDefault();

    const foundUser = state.staffUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (foundUser) {
      if (foundUser.status === 'Disabled') {
        alert("This account has been disabled. Please contact your administrator.");
        return;
      }

      setState({
        staffUser: {
          name: foundUser.name,
          role: foundUser.role,
          region: foundUser.region || 'Global'
        }
      });
      router.push(state.appLayout === 'grid' ? '/home' : '/dashboard');
    } else {
      alert("Invalid email credentials. Try admin@xyz.org");
    }
  };

  return (
    <div className="login-wrapper flex items-center justify-center" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .bg-image {
          position: absolute;
          top: -5%; left: -5%; right: -5%; bottom: -5%;
          background-image: url('/bg-login.png');
          background-size: cover;
          background-position: center;
          z-index: 0;
          animation: kenburns 20s infinite alternate ease-in-out;
        }
        .bg-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(2, 6, 23, 0.7));
          z-index: 1;
        }
        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1) rotate(1deg); }
        }
        .login-content-layer {
          position: relative;
          z-index: 2;
          width: 100%;
          display: flex;
          justify-content: center;
        }
      `}</style>
      <div className="bg-image"></div>
      <div className="bg-overlay"></div>
      <div className="login-content-layer">
        <div 
          className="glass-card text-center" 
          style={{
            width: '100%',
            maxWidth: '400px',
            margin: '2rem',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            borderRadius: '24px',
            padding: '3rem 2rem'
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>JAGORON</h1>
            <p style={{ color: '#475569', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Assessment Portal</p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>AI-Enabled Youth Profiling System</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label" style={{ color: '#475569' }}>Staff Email</label>
              <input 
                type="email" 
                className="form-control" 
                required 
                placeholder="staff@care.org" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.9)', borderColor: '#cbd5e1' }} 
              />
            </div>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label" style={{ color: '#475569' }}>Password</label>
              <input 
                type="password" 
                className="form-control" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.9)', borderColor: '#cbd5e1' }} 
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', fontWeight: 600, background: 'linear-gradient(135deg, #0EA5E9, #2563EB)', border: 'none', boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.3)' }}
            >
              Login to Portal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
