import { navigateTo } from '../main.js';
import { store } from '../store.js';

export function renderRegistration(params = {}) {
  const container = document.createElement('div');
  container.className = 'glass-card';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  
  container.innerHTML = `
    <div class="flex justify-between items-center mb-4 border-b" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 2rem;">
      <h2 style="margin: 0;">Beneficiary Registration</h2>
      <button id="btn-back" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">&larr; Back</button>
    </div>
    
    <form id="registration-form">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        
        <!-- Section 1: Basic Details -->
        <div style="grid-column: span 2;">
          <h4 style="color: var(--primary); margin-bottom: 1rem;">1. Demographic & Basic Details</h4>
        </div>
        
        <div class="form-group" style="margin: 0;">
          <label class="form-label">Full Name</label>
          <input type="text" name="fullName" class="form-control" required placeholder="e.g. Rina Akter" />
        </div>
        
        <div class="form-group" style="margin: 0;">
          <label class="form-label">Date of Birth</label>
          <input type="date" name="dob" id="dob-input" class="form-control" required />
        </div>
        
        <div class="form-group" style="margin: 0;">
          <label class="form-label">Age (Auto-calculated)</label>
          <input type="number" name="age" id="age-input" class="form-control" readonly placeholder="Calculated from DOB" />
        </div>
        
        <div class="form-group" style="margin: 0;">
          <label class="form-label">Gender</label>
          <select name="gender" class="form-control" required>
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div class="form-group" style="margin: 0;">
          <label class="form-label">Phone Number</label>
          <input type="tel" name="phone" class="form-control" required placeholder="+8801XXXXXXXXX" />
        </div>
        
        <div class="form-group" style="margin: 0;">
          <label class="form-label">District</label>
          <select name="district" class="form-control" required>
            <option value="">Select District</option>
            <option value="Khulna">Khulna</option>
            <option value="Gazipur">Gazipur</option>
          </select>
        </div>
        
        <div class="form-group" style="margin: 0;">
          <label class="form-label">Current Status (NEET)</label>
          <select name="status" class="form-control" required>
            <option value="Unemployed">Unemployed</option>
            <option value="Not in Education">Not in Education</option>
            <option value="Not in Training">Not in Training</option>
          </select>
        </div>
        
        <!-- Section 2: Inclusion Profiling -->
        <div style="grid-column: span 2; margin-top: 1rem;">
          <h4 style="color: var(--primary); margin-bottom: 1rem;">2. Inclusion Profiling</h4>
        </div>
        
        <div class="form-group" style="grid-column: span 2; margin: 0;">
          <label class="form-label">Does the youth identify as a Person with Disability (PWD)?</label>
          <div style="display: flex; gap: 2rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="radio" name="pwd" value="Yes" required> Yes
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="radio" name="pwd" value="No" checked required> No
            </label>
          </div>
        </div>
        
        <div class="form-group" style="grid-column: span 2; margin: 0;">
          <label class="form-label">Ethnic Minority Background?</label>
          <div style="display: flex; gap: 2rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="radio" name="minority" value="Yes" required> Yes
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="radio" name="minority" value="No" checked required> No
            </label>
          </div>
        </div>

        <!-- Section 3: Consent -->
        <div style="grid-column: span 2; margin-top: 1rem;">
          <h4 style="color: var(--primary); margin-bottom: 1rem;">3. Data Privacy & Consent</h4>
          <label style="display: flex; align-items: flex-start; gap: 0.75rem; cursor: pointer; background: var(--surface-hover); padding: 1rem; border-radius: var(--radius-md);">
            <input type="checkbox" name="consent" required style="margin-top: 0.25rem;">
            <span style="font-size: 0.9rem; color: var(--text-muted);">
              I confirm that the beneficiary has given explicit consent to collect, store, and process their demographic and assessment data for the purpose of the JAGORON project, in compliance with project privacy guidelines.
            </span>
          </label>
        </div>

      </div>
      
      <div class="flex justify-between" style="border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
        <button type="button" id="btn-cancel" class="btn btn-secondary">Cancel</button>
        <div style="display: flex; gap: 1rem;">
          <button type="submit" name="action" value="save" class="btn btn-secondary" style="min-width: 150px;">Save Profile</button>
          <button type="submit" name="action" value="assess" class="btn btn-primary" style="min-width: 200px;">Save & Start Assessment</button>
        </div>
      </div>
    </form>
  `;
  
  container.querySelector('#btn-back').addEventListener('click', () => navigateTo('/beneficiaries'));
  container.querySelector('#btn-cancel').addEventListener('click', () => navigateTo('/beneficiaries'));
  
  // DOB to Age Calculation
  container.querySelector('#dob-input').addEventListener('change', (e) => {
    const dob = new Date(e.target.value);
    if (!isNaN(dob)) {
      const diff_ms = Date.now() - dob.getTime();
      const age_dt = new Date(diff_ms); 
      const age = Math.abs(age_dt.getUTCFullYear() - 1970);
      container.querySelector('#age-input').value = age;
      
      if (age < 15 || age > 35) {
        alert("Warning: JAGORON project targets youth aged 15-35. Please verify the DOB.");
      }
    }
  });
  
  // Pre-fill form if editing
  const editId = params.editId ? parseInt(params.editId) : null;
  const existingYouth = editId ? store.state.youths.find(y => y.id === editId) : null;
  
  if (existingYouth) {
    container.querySelector('h2').textContent = 'Edit Beneficiary Profile';
    container.querySelector('input[name="fullName"]').value = existingYouth.name || '';
    container.querySelector('input[name="dob"]').value = existingYouth.dob || '';
    container.querySelector('input[name="age"]').value = existingYouth.age || '';
    container.querySelector('select[name="gender"]').value = existingYouth.gender || '';
    // if phone exists, fill it
    const phoneInput = container.querySelector('input[name="phone"]');
    if (phoneInput && existingYouth.phone) phoneInput.value = existingYouth.phone;
    container.querySelector('select[name="district"]').value = existingYouth.district || '';
    
    // Status (NEET) in form vs youth.status: 
    const neetSelect = container.querySelector('select[name="status"]');
    if (neetSelect && existingYouth.neetStatus) neetSelect.value = existingYouth.neetStatus;
  }
  
  container.querySelector('#registration-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const submitter = e.submitter; // The button that was clicked
    
    const newYouth = {
      id: existingYouth ? existingYouth.id : Date.now(),
      name: formData.get('fullName'),
      dob: formData.get('dob'),
      age: formData.get('age'),
      gender: formData.get('gender'),
      phone: formData.get('phone'),
      district: formData.get('district'),
      neetStatus: formData.get('status'),
      pwd: formData.get('pwd'),
      status: existingYouth ? existingYouth.status : 'Submitted',
      assessmentData: existingYouth ? existingYouth.assessmentData : null,
      aiProfile: existingYouth ? existingYouth.aiProfile : null
    };
    
    if (existingYouth) {
      const updatedYouths = store.state.youths.map(y => y.id === existingYouth.id ? newYouth : y);
      store.setState({ youths: updatedYouths });
      store.addLog(store.state.staffUser?.name || 'System', 'Registration', `Updated ${newYouth.name}`);
    } else {
      store.setState({ youths: [newYouth, ...store.state.youths] });
      store.addLog(store.state.staffUser?.name || 'System', 'Registration', `Registered ${newYouth.name}`);
    }
    
    // Check which button was clicked
    if (submitter.value === 'assess') {
      store.setState({ currentYouthId: newYouth.id });
      navigateTo('/assessment', { youthId: newYouth.id });
    } else {
      // Just save
      if (!existingYouth) {
        e.target.reset();
        container.querySelector('#age-input').value = '';
      }
      alert('Profile saved successfully.');
      navigateTo('/beneficiaries');
    }
  });

  return container;
}
