import { navigateTo } from '../main.js';
import { store } from '../store.js';

export function renderAssessment(params) {
  if (params.bulk && params.targets && params.targets.length > 0) {
    return renderBulkAssessment(params.targets);
  }
  return renderSingleAssessment(parseInt(params.youthId));
}

function renderBulkAssessment(targetIds) {
  const container = document.createElement('div');
  container.className = 'glass-card';
  container.style.maxWidth = '100%';
  container.style.margin = '0 auto';
  
  const youths = store.state.youths.filter(y => targetIds.includes(y.id));
  const questions = store.state.questions;
  
  if (youths.length === 0) {
    alert("No youths found for bulk assessment.");
    navigateTo('/assessment-engine');
    return container;
  }

  container.innerHTML = `
    <div class="flex justify-between items-center mb-4 border-b" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 2rem;">
      <div>
        <h2 style="margin: 0;">Bulk Assessment Data Entry</h2>
        <p style="margin: 0; font-size: 0.85rem;">Rapid entry mode for ${youths.length} profiles.</p>
      </div>
      <button id="btn-cancel" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">Cancel Bulk</button>
    </div>
    
    <div class="table-wrapper" style="overflow-x: auto; margin-bottom: 2rem;">
      <table id="bulk-assess-table" style="min-width: ${questions.length * 200 + 150}px;">
        <thead>
          <tr>
            <th style="position: sticky; left: 0; background: var(--surface); z-index: 2; width: 150px;">Youth Name</th>
            ${questions.map((q, i) => `<th>Q${i+1}: ${q.text.substring(0, 40)}...</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${youths.map(y => `
            <tr>
              <td style="position: sticky; left: 0; background: var(--surface); z-index: 1; font-weight: 500;">
                #${y.id.toString().padStart(4, '0')}<br>
                ${y.name}
              </td>
              ${questions.map(q => `
                <td>
                  <select class="form-control bulk-select" data-youth="${y.id}" data-q="${q.id}">
                    <option value="">-- Select --</option>
                    ${q.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                  </select>
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="flex justify-end" style="border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
      <button id="btn-save-bulk" class="btn btn-primary" style="min-width: 200px;">Save & Submit All Assessments</button>
    </div>
  `;
  
  container.querySelector('#btn-cancel').addEventListener('click', () => navigateTo('/assessment-engine'));
  
  container.querySelector('#btn-save-bulk').addEventListener('click', () => {
    // Validate if any are completely empty? We can just save whatever is filled or enforce 100% completion
    let allValid = true;
    const selects = container.querySelectorAll('.bulk-select');
    selects.forEach(sel => {
      if (!sel.value) allValid = false;
      else {
        sel.style.borderColor = 'var(--border-color)';
      }
    });
    
    if (!allValid) {
      if(!confirm("Some questions are left unanswered. Save anyway?")) {
        return;
      }
    }
    
    // Group answers by youth
    const collectedData = {};
    youths.forEach(y => collectedData[y.id] = {});
    
    selects.forEach(sel => {
      if (sel.value) {
        collectedData[sel.dataset.youth][sel.dataset.q] = sel.value;
      }
    });
    
    // Update store
    const updatedYouths = store.state.youths.map(y => {
      if (targetIds.includes(y.id)) {
        const newStatus = y.status === 'Submitted' ? 'Pre-screeing' : 'Assessment Completed';
        return { ...y, status: newStatus, assessmentData: collectedData[y.id] || {} };
      }
      return y;
    });
    
    store.setState({ youths: updatedYouths });
    store.addLog(store.state.staffUser?.name || 'System', 'Bulk Assessment', `Completed assessments for ${targetIds.length} profiles.`);
    
    alert(`Successfully saved assessments for ${targetIds.length} beneficiaries!`);
    navigateTo('/assessment-engine');
  });
  
  return container;
}


function renderSingleAssessment(youthId) {
  const youth = store.state.youths.find(y => y.id === youthId);
  
  if (!youth) {
    alert("Youth not found.");
    navigateTo('/dashboard');
    return document.createElement('div');
  }

  const questions = store.state.questions;
  let currentIndex = 0;
  const answers = {};

  const container = document.createElement('div');
  container.className = 'glass-card';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  
  function renderQuestion() {
    if (currentIndex >= questions.length) {
      return renderCompletion();
    }
    
    const q = questions[currentIndex];
    const progress = Math.round((currentIndex / questions.length) * 100);
    
    container.innerHTML = `
      <div class="flex justify-between items-center mb-4 border-b" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 2rem;">
        <div>
          <h2 style="margin: 0;">Assessment: ${youth.name}</h2>
          <p style="margin: 0; font-size: 0.85rem;">Staff Guided Assessment - Question ${currentIndex + 1} of ${questions.length}</p>
        </div>
        <button id="btn-cancel" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">Cancel Assessment</button>
      </div>
      
      <!-- Progress Bar -->
      <div style="background: var(--border-color); height: 8px; border-radius: 4px; margin-bottom: 2rem; overflow: hidden;">
        <div style="width: ${progress}%; background: var(--primary); height: 100%; transition: width 0.3s ease;"></div>
      </div>
      
      <!-- Accessibility / Low Literacy Helpers for Staff -->
      <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
        <span style="background: var(--surface-hover); padding: 0.3rem 0.6rem; border-radius: 12px; font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Type: ${q.type.toUpperCase()}</span>
        <button class="btn btn-secondary" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; border: none; background: #FEF3C7; color: #D97706;">
          🔊 Play Bangla Audio Placeholder
        </button>
      </div>
      
      <div style="margin-bottom: 2rem;">
        <h3 style="font-size: 1.25rem; color: var(--text-main); margin-bottom: 1.5rem; line-height: 1.6;">${q.text}</h3>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${q.options.map((opt, i) => `
            <label style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;" class="option-label">
              <input type="radio" name="q${q.id}" value="${opt}" style="transform: scale(1.2);">
              <span style="font-weight: 500;">${opt}</span>
            </label>
          `).join('')}
        </div>
      </div>
      
      <div class="flex justify-between" style="border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
        <button id="btn-prev" class="btn btn-secondary" ${currentIndex === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>&larr; Previous</button>
        <button id="btn-next" class="btn btn-primary">Next Question &rarr;</button>
      </div>
    `;
    
    // Add interactions
    container.querySelector('#btn-cancel').addEventListener('click', () => navigateTo('/assessment-engine'));
    
    container.querySelector('#btn-prev').addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
      }
    });
    
    container.querySelector('#btn-next').addEventListener('click', () => {
      const selected = container.querySelector(`input[name="q${q.id}"]:checked`);
      if (!selected) {
        alert("Please select an answer.");
        return;
      }
      answers[q.id] = selected.value;
      currentIndex++;
      renderQuestion();
    });
    
    // Styling selected labels
    const labels = container.querySelectorAll('.option-label');
    labels.forEach(label => {
      label.addEventListener('click', () => {
        labels.forEach(l => {
          l.style.borderColor = 'var(--border-color)';
          l.style.backgroundColor = 'transparent';
        });
        label.style.borderColor = 'var(--primary)';
        label.style.backgroundColor = 'rgba(15, 118, 110, 0.05)';
      });
    });
  }
  
  function renderCompletion() {
    container.innerHTML = `
      <div class="text-center" style="padding: 3rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
        <h2>Assessment Completed</h2>
        <p>Data collected for ${youth.name}. Ready for AI Pre-screening and Behavioral Profiling.</p>
        
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
          <button id="btn-back-dash" class="btn btn-secondary">Save & Return to List</button>
          <button id="btn-process-now" class="btn btn-primary">Add New Youth Profile</button>
        </div>
      </div>
    `;
    
    // Update store status
    const updatedYouths = store.state.youths.map(y => {
      if (y.id === youthId) {
        const newStatus = y.status === 'Submitted' ? 'Pre-screeing' : 'Assessment Completed';
        return { ...y, status: newStatus, assessmentData: answers };
      }
      return y;
    });
    store.setState({ youths: updatedYouths });
    
    container.querySelector('#btn-back-dash').addEventListener('click', () => navigateTo('/beneficiaries'));
    container.querySelector('#btn-process-now').addEventListener('click', () => {
      navigateTo('/register-youth');
    });
  }

  // Initial render
  renderQuestion();
  
  return container;
}
