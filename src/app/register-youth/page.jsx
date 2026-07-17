"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../store.js';

function RegistrationPageContent() {
  const [state, setState, addLog] = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get('editId') ? parseInt(searchParams.get('editId')) : null;
  const existingYouth = editId ? state.youths.find(y => y.id === editId) : null;

  // Form Field State
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [neetStatus, setNeetStatus] = useState('Unemployed');
  const [pwd, setPwd] = useState('No');
  const [minority, setMinority] = useState('No');
  const [consent, setConsent] = useState(false);

  // Load existing details if editing
  useEffect(() => {
    if (existingYouth) {
      setFullName(existingYouth.name || '');
      setDob(existingYouth.dob || '');
      setAge(existingYouth.age || '');
      setGender(existingYouth.gender || '');
      setPhone(existingYouth.phone || '');
      setDistrict(existingYouth.district || '');
      setNeetStatus(existingYouth.neetStatus || 'Unemployed');
      setPwd(existingYouth.pwd || 'No');
      setMinority(existingYouth.minority || 'No');
      setConsent(true); // Must have had consent to be registered
    }
  }, [existingYouth]);

  // DOB change to Age calculation
  const handleDobChange = (e) => {
    const val = e.target.value;
    setDob(val);
    const dobDate = new Date(val);
    if (!isNaN(dobDate)) {
      const diff_ms = Date.now() - dobDate.getTime();
      const age_dt = new Date(diff_ms); 
      const calculatedAge = Math.abs(age_dt.getUTCFullYear() - 1970);
      setAge(calculatedAge);
      
      if (calculatedAge < 15 || calculatedAge > 35) {
        alert("Warning: JAGORON project targets youth aged 15-35. Please verify the DOB.");
      }
    }
  };

  const handleBack = () => {
    router.push('/beneficiaries');
  };

  const handleSubmit = (e, actionType) => {
    e.preventDefault();

    if (!consent) {
      alert("Demographic profiling requires explicit consent.");
      return;
    }

    const youthId = existingYouth ? existingYouth.id : Date.now();

    const newYouth = {
      id: youthId,
      name: fullName,
      dob: dob,
      age: age,
      gender: gender,
      phone: phone,
      district: district,
      neetStatus: neetStatus,
      pwd: pwd,
      minority: minority,
      status: existingYouth ? existingYouth.status : 'Submitted',
      assessmentData: existingYouth ? existingYouth.assessmentData : null,
      aiProfile: existingYouth ? existingYouth.aiProfile : null
    };

    if (existingYouth) {
      const updatedYouths = state.youths.map(y => y.id === existingYouth.id ? newYouth : y);
      setState({ youths: updatedYouths });
      addLog(state.staffUser?.name, 'Registration', `Updated profile of: ${newYouth.name}`);
    } else {
      setState({ youths: [newYouth, ...state.youths] });
      addLog(state.staffUser?.name, 'Registration', `Registered new youth: ${newYouth.name}`);
    }

    alert('Profile saved successfully.');

    if (actionType === 'assess') {
      setState({ currentYouthId: youthId });
      router.push(`/assessment?youthId=${youthId}`);
    } else {
      router.push('/beneficiaries');
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-4 border-b" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0' }}>{existingYouth ? 'Edit Beneficiary Profile' : 'Beneficiary Registration'}</h2>
        <button onClick={handleBack} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>&larr; Back</button>
      </div>
      
      <form onSubmit={(e) => handleSubmit(e, e.nativeEvent.submitter?.value || 'save')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Section 1: Basic Details */}
          <div style={{ gridColumn: 'span 2' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>1. Demographic & Basic Details</h4>
          </div>
          
          <div className="form-group" style={{ margin: '0' }}>
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              placeholder="e.g. Rina Akter" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          
          <div className="form-group" style={{ margin: '0' }}>
            <label className="form-label">Date of Birth</label>
            <input 
              type="date" 
              className="form-control" 
              required 
              value={dob}
              onChange={handleDobChange}
            />
          </div>
          
          <div className="form-group" style={{ margin: '0' }}>
            <label className="form-label">Age (Auto-calculated)</label>
            <input 
              type="number" 
              className="form-control" 
              readOnly 
              placeholder="Calculated from DOB" 
              value={age}
            />
          </div>
          
          <div className="form-group" style={{ margin: '0' }}>
            <label className="form-label">Gender</label>
            <select 
              className="form-control" 
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group" style={{ margin: '0' }}>
            <label className="form-label">Phone Number</label>
            <input 
              type="tel" 
              className="form-control" 
              required 
              placeholder="+8801XXXXXXXXX" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div className="form-group" style={{ margin: '0' }}>
            <label className="form-label">District</label>
            <select 
              className="form-control" 
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">Select District</option>
              <option value="Khulna">Khulna</option>
              <option value="Gazipur">Gazipur</option>
            </select>
          </div>
          
          <div className="form-group" style={{ margin: '0' }}>
            <label className="form-label">Current Status (NEET)</label>
            <select 
              className="form-control" 
              required
              value={neetStatus}
              onChange={(e) => setNeetStatus(e.target.value)}
            >
              <option value="Unemployed">Unemployed</option>
              <option value="Not in Education">Not in Education</option>
              <option value="Not in Training">Not in Training</option>
            </select>
          </div>
          
          {/* Section 2: Inclusion Profiling */}
          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>2. Inclusion Profiling</h4>
          </div>
          
          <div className="form-group" style={{ gridColumn: 'span 2', margin: '0' }}>
            <label className="form-label">Does the youth identify as a Person with Disability (PWD)?</label>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="pwd" 
                  value="Yes" 
                  checked={pwd === 'Yes'}
                  onChange={() => setPwd('Yes')}
                  required 
                /> Yes
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="pwd" 
                  value="No" 
                  checked={pwd === 'No'}
                  onChange={() => setPwd('No')}
                  required 
                /> No
              </label>
            </div>
          </div>
          
          <div className="form-group" style={{ gridColumn: 'span 2', margin: '0' }}>
            <label className="form-label">Ethnic Minority Background?</label>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="minority" 
                  value="Yes" 
                  checked={minority === 'Yes'}
                  onChange={() => setMinority('Yes')}
                  required 
                /> Yes
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="minority" 
                  value="No" 
                  checked={minority === 'No'}
                  onChange={() => setMinority('No')}
                  required 
                /> No
              </label>
            </div>
          </div>

          {/* Section 3: Consent */}
          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>3. Data Privacy & Consent</h4>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', background: 'var(--surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <input 
                type="checkbox" 
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required 
                style={{ marginTop: '0.25rem' }} 
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                I confirm that the beneficiary has given explicit consent to collect, store, and process their demographic and assessment data for the purpose of the JAGORON project, in compliance with project privacy guidelines.
              </span>
            </label>
          </div>

        </div>
        
        <div className="flex justify-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button type="button" onClick={handleBack} className="btn btn-secondary">Cancel</button>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" value="save" className="btn btn-secondary" style={{ minWidth: '150px' }}>Save Profile</button>
            <button type="submit" value="assess" className="btn btn-primary" style={{ minWidth: '200px' }}>Save & Start Assessment</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-4">
        <div className="spinner-primary"></div>
        <span style={{ marginLeft: '1rem' }}>Loading registration form...</span>
      </div>
    }>
      <RegistrationPageContent />
    </Suspense>
  );
}
