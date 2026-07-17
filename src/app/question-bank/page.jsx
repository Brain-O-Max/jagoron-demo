"use client";

import { useState } from 'react';
import { useStore } from '../../store.js';

export default function QuestionBankPage() {
  const [state, setState, addLog] = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [activeQId, setActiveQId] = useState('');
  const [activeQText, setActiveQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');

  const handleToggle = (id) => {
    const qIndex = state.questions.findIndex(q => q.id === id);
    if (qIndex !== -1) {
      const updatedQuestions = [...state.questions];
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        disabled: !updatedQuestions[qIndex].disabled
      };
      setState({ questions: updatedQuestions });
      addLog(state.staffUser?.name, 'Question Bank', `Toggled status of Q${id}`);
    }
  };

  const handleEdit = (q) => {
    setActiveQId(q.id);
    setActiveQText(q.text);
    setOptA(q.options[0] || '');
    setOptB(q.options[1] || '');
    setOptC(q.options[2] || '');
    setOptD(q.options[3] || '');
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const qIndex = state.questions.findIndex(q => q.id === activeQId);
    if (qIndex !== -1) {
      const updatedQuestions = [...state.questions];
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        text: activeQText,
        options: [optA, optB, optC, optD]
      };
      
      setState({ questions: updatedQuestions });
      addLog(state.staffUser?.name, 'Question Bank', `Edited Question Q${activeQId}`);
      setModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontSize: '2rem' }}>Question Bank</h2>
          <p>Manage the Psychometric, Behavioral, and Aptitude questions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert("Add question UI not in scope yet")}>+ Add Question</button>
      </div>
      
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Question Text</th>
                <th>Options</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.questions.map(q => (
                <tr key={q.id} style={q.disabled ? { opacity: 0.6, background: 'var(--surface-hover)' } : {}}>
                  <td style={{ fontWeight: 500 }}>Q{q.id}</td>
                  <td><span className="badge badge-info">{q.type}</span></td>
                  <td>{q.text}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {q.options.map((opt, idx) => (
                      <div key={idx}>{String.fromCharCode(65 + idx)}. {opt}</div>
                    ))}
                  </td>
                  <td>
                    {q.disabled ? (
                      <span className="badge badge-neutral">Disabled</span>
                    ) : (
                      <span className="badge badge-success">Active</span>
                    )}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEdit(q)}
                      className="btn btn-secondary edit-btn" 
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', marginBottom: '0.2rem' }}
                    >
                      Edit
                    </button>
                    <br />
                    <button 
                      onClick={() => handleToggle(q.id)}
                      className="btn btn-secondary toggle-btn" 
                      style={{ 
                        padding: '0.2rem 0.5rem', 
                        fontSize: '0.75rem', 
                        color: q.disabled ? 'var(--secondary)' : 'var(--accent)', 
                        borderColor: q.disabled ? 'var(--secondary)' : 'var(--accent)' 
                      }}
                    >
                      {q.disabled ? 'Enable' : 'Disable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Modal Overlay */}
      {modalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Edit Question</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Question Text</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  required
                  value={activeQText}
                  onChange={(e) => setActiveQText(e.target.value)}
                ></textarea>
              </div>
              
              <div className="grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Option A</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Option B</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Option C</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Option D</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
