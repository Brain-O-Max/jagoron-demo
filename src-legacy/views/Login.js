import { store } from '../store.js';
import { navigateTo } from '../main.js';

export function renderLogin() {
  const container = document.createElement('div');
  container.className = 'login-wrapper flex items-center justify-center';
  container.style.minHeight = '100vh';
  container.innerHTML = `
    <style>
      .login-wrapper {
        position: relative;
        overflow: hidden;
      }
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
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(2, 6, 23, 0.7)); /* Sober dark overlay */
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
    </style>
    <div class="bg-image"></div>
    <div class="bg-overlay"></div>
    <div class="login-content-layer" id="login-card-mount"></div>
  `;
  
  const card = document.createElement('div');
  card.className = 'glass-card text-center';
  card.style.width = '100%';
  card.style.maxWidth = '400px';
  card.style.margin = '2rem';
  card.style.background = 'rgba(255, 255, 255, 0.8)';
  card.style.backdropFilter = 'blur(16px)';
  card.style.border = '1px solid rgba(255, 255, 255, 0.5)';
  card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.1)';
  card.style.borderRadius = '24px';
  card.style.padding = '3rem 2rem';
  
  card.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <h1 style="font-size: 2.2rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #0EA5E9, #8B5CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800;">JAGORON</h1>
      <p style="color: #475569; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; font-size: 0.85rem;">Assessment Portal</p>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.5rem;">AI-Enabled Youth Profiling System</p>
    </div>
    
    <form id="login-form">
      <div class="form-group" style="text-align: left;">
        <label class="form-label" style="color: #475569;">Staff Email</label>
        <input type="email" class="form-control" name="email" required placeholder="staff@care.org" value="admin@xyz.org" style="background: rgba(255,255,255,0.9); border-color: #cbd5e1;" />
      </div>
      <div class="form-group" style="text-align: left;">
        <label class="form-label" style="color: #475569;">Password</label>
        <input type="password" class="form-control" name="password" required value="password" style="background: rgba(255,255,255,0.9); border-color: #cbd5e1;" />
      </div>
      <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; padding: 1rem; border-radius: 12px; font-weight: 600; background: linear-gradient(135deg, #0EA5E9, #2563EB); border: none; box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3);">Login to Portal</button>
    </form>
  `;
  
  const form = card.querySelector('#login-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailInput = form.email.value;
    // Find user in DB
    const foundUser = store.state.staffUsers.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
    
    if (foundUser) {
      if (foundUser.status === 'Disabled') {
        alert("This account has been disabled. Please contact your administrator.");
        return;
      }
      
      store.setState({
        staffUser: {
          name: foundUser.name,
          role: foundUser.role,
          region: foundUser.region || 'Global'
        }
      });
      navigateTo('/home');
    } else {
      alert("Invalid email credentials. Try admin@xyz.org");
    }
  });
  
  container.querySelector('#login-card-mount').appendChild(card);
  return container;
}
