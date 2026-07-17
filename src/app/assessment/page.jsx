"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../store.js';

function AssessmentPageContent() {
  const [state, setState, addLog] = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isBulk = searchParams.get('bulk') === 'true';
  const targetIdsRaw = searchParams.get('targets');
  const targetIds = targetIdsRaw ? targetIdsRaw.split(',').map(x => parseInt(x)) : [];
  const singleYouthId = searchParams.get('youthId') ? parseInt(searchParams.get('youthId')) : null;

  const questions = state.questions;

  // --- BULK ASSESSMENT STATE ---
  const bulkYouths = state.youths.filter(y => targetIds.includes(y.id));
  const [bulkAnswers, setBulkAnswers] = useState({}); // format: { [youthId]: { [qId]: answer } }

  const handleBulkSelectChange = (youthId, qId, val) => {
    setBulkAnswers(prev => ({
      ...prev,
      [youthId]: {
        ...prev[youthId],
        [qId]: val
      }
    }));
  };

  const handleSaveBulk = () => {
    let allValid = true;
    
    // Check if everything is filled
    bulkYouths.forEach(y => {
      questions.forEach(q => {
        if (!bulkAnswers[y.id]?.[q.id]) {
          allValid = false;
        }
      });
    });

    if (!allValid) {
      if (!confirm("Some questions are left unanswered. Save anyway?")) {
        return;
      }
    }

    const updatedYouths = state.youths.map(y => {
      if (targetIds.includes(y.id)) {
        // Change status to Pre-screeing (which is the spelling check in pre-screening tab)
        const newStatus = y.status === 'Submitted' ? 'Pre-screeing' : 'Assessment Completed';
        return { 
          ...y, 
          status: newStatus, 
          assessmentData: bulkAnswers[y.id] || {} 
        };
      }
      return y;
    });

    setState({ youths: updatedYouths });
    addLog(state.staffUser?.name, 'Bulk Assessment', `Completed assessments for ${targetIds.length} profiles.`);
    
    alert(`Successfully saved assessments for ${targetIds.length} beneficiaries!`);
    router.push('/assessment-engine');
  };

  // --- SINGLE ASSESSMENT STATE ---
  const singleYouth = state.youths.find(y => y.id === singleYouthId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [singleAnswers, setSingleAnswers] = useState({});
  const [selectedValue, setSelectedValue] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Sync selected radio option with current index answers
  useEffect(() => {
    if (questions[currentIndex]) {
      setSelectedValue(singleAnswers[questions[currentIndex].id] || '');
    }
  }, [currentIndex, questions, singleAnswers]);

  const handleOptionChange = (qId, val) => {
    setSelectedValue(val);
    setSingleAnswers(prev => ({
      ...prev,
      [qId]: val
    }));
  };

  const handleNext = () => {
    const q = questions[currentIndex];
    if (!singleAnswers[q.id]) {
      alert("Please select an answer.");
      return;
    }
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished
      const updatedYouths = state.youths.map(y => {
        if (y.id === singleYouthId) {
          const newStatus = y.status === 'Submitted' ? 'Pre-screeing' : 'Assessment Completed';
          return { 
            ...y, 
            status: newStatus, 
            assessmentData: singleAnswers 
          };
        }
        return y;
      });
      setState({ youths: updatedYouths });
      addLog(state.staffUser?.name, 'Assessment', `Completed assessment for: ${singleYouth.name}`);
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCancel = () => {
    router.push('/assessment-engine');
  };

  // Render Bulk Mode
  if (isBulk) {
    if (bulkYouths.length === 0) {
      return (
        <div className="card text-center" style={{ margin: '4rem auto', maxWidth: '500px' }}>
          <h2>No Profiles Selected</h2>
          <p>No beneficiaries found for bulk assessment.</p>
          <button onClick={handleCancel} className="btn btn-primary mt-4">Return to Engine</button>
        </div>
      );
    }

    return (
      <div className="glass-card" style={{ maxWidth: '100%', margin: '0 auto' }}>
        <div className="flex justify-between items-center mb-4 border-b" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ margin: '0' }}>Bulk Assessment Data Entry</h2>
            <p style={{ margin: '0', fontSize: '0.85rem' }}>Rapid entry mode for {bulkYouths.length} profiles.</p>
          </div>
          <button onClick={handleCancel} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Cancel Bulk</button>
        </div>
        
        <div className="table-wrapper" style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          <table style={{ minWidth: `${questions.length * 200 + 180}px` }}>
            <thead>
              <tr>
                <th style={{ position: 'sticky', left: 0, background: '#f8fafc', zIndex: 2, width: '180px' }}>Youth Name</th>
                {questions.map((q, i) => (
                  <th key={q.id}>Q{i+1}: {q.text.substring(0, 40)}...</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bulkYouths.map(y => (
                <tr key={y.id}>
                  <td style={{ position: 'sticky', left: 0, background: 'white', zIndex: 1, fontWeight: '500' }}>
                    #{y.id.toString().padStart(4, '0')}<br />
                    {y.name}
                  </td>
                  {questions.map(q => (
                    <td key={q.id}>
                      <select 
                        className="form-control"
                        value={bulkAnswers[y.id]?.[q.id] || ''}
                        onChange={(e) => handleBulkSelectChange(y.id, q.id, e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        {q.options.map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button onClick={handleSaveBulk} className="btn btn-primary" style={{ minWidth: '200px' }}>Save & Submit All Assessments</button>
        </div>
      </div>
    );
  }

  // Render Single Mode
  if (!singleYouth) {
    return (
      <div className="card text-center" style={{ margin: '4rem auto', maxWidth: '500px' }}>
        <h2>Invalid Target</h2>
        <p>No beneficiary target selected for assessment.</p>
        <button onClick={handleCancel} className="btn btn-primary mt-4">Return to Engine</button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="glass-card text-center" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2>Assessment Completed</h2>
        <p>Data collected for {singleYouth.name}. Ready for AI Pre-screening and Behavioral Profiling.</p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button onClick={() => router.push('/beneficiaries')} className="btn btn-secondary">Save & Return to List</button>
          <button onClick={() => router.push('/register-youth')} className="btn btn-primary">Add New Youth Profile</button>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const progress = Math.round((currentIndex / questions.length) * 100);

  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-4 border-b" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: '0' }}>Assessment: {singleYouth.name}</h2>
          <p style={{ margin: '0', fontSize: '0.85rem' }}>Staff Guided Assessment - Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <button onClick={handleCancel} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Cancel Assessment</button>
      </div>
      
      {/* Progress Bar */}
      <div style={{ background: 'var(--border-color)', height: '8px', borderRadius: '4px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, background: 'var(--primary)', height: '100%', transition: 'width 0.3s ease' }}></div>
      </div>
      
      {/* Accessibility Helpers */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <span style={{ background: 'var(--surface-hover)', padding: '0.3rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Type: {q?.type?.toUpperCase()}</span>
        <button className="btn btn-secondary" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', border: 'none', background: '#FEF3C7', color: '#D97706' }}>
          🔊 Play Bangla Audio Placeholder
        </button>
      </div>
      
      {q && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{q.text}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {q.options.map((opt, i) => {
              const isSelected = selectedValue === opt;
              return (
                <label 
                  key={i} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '1rem', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-md)', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                    backgroundColor: isSelected ? 'rgba(15, 118, 110, 0.05)' : 'transparent'
                  }}
                >
                  <input 
                    type="radio" 
                    name={`q${q.id}`} 
                    value={opt} 
                    checked={isSelected}
                    onChange={() => handleOptionChange(q.id, opt)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontWeight: 500 }}>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="flex justify-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <button 
          onClick={handlePrev} 
          className="btn btn-secondary" 
          disabled={currentIndex === 0}
          style={currentIndex === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          &larr; Previous
        </button>
        <button onClick={handleNext} className="btn btn-primary">
          {currentIndex + 1 === questions.length ? "Finish & Submit" : "Next Question &rarr;"}
        </button>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-4">
        <div className="spinner-primary"></div>
        <span style={{ marginLeft: '1rem' }}>Loading assessment module...</span>
      </div>
    }>
      <AssessmentPageContent />
    </Suspense>
  );
}
