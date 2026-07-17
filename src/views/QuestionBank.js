import { store } from '../store.js';

export function renderQuestionBank() {
  const container = document.createElement('div');
  
  function render() {
    container.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 style="font-size: 2rem;">Question Bank</h2>
          <p>Manage the Psychometric, Behavioral, and Aptitude questions.</p>
        </div>
        <button class="btn btn-primary" onclick="alert('Add question UI not in scope yet')">+ Add Question</button>
      </div>
      
      <div class="card">
        <div class="table-wrapper">
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
              ${store.state.questions.map(q => `
                <tr style="${q.disabled ? 'opacity: 0.6; background: var(--surface-hover);' : ''}">
                  <td style="font-weight: 500;">Q${q.id}</td>
                  <td><span class="badge badge-info">${q.type}</span></td>
                  <td>${q.text}</td>
                  <td style="font-size: 0.8rem; color: var(--text-muted);">
                    ${q.options.map((opt, i) => `<div>${String.fromCharCode(65+i)}. ${opt}</div>`).join('')}
                  </td>
                  <td>
                    ${q.disabled 
                      ? '<span class="badge badge-neutral">Disabled</span>' 
                      : '<span class="badge badge-success">Active</span>'
                    }
                  </td>
                  <td>
                    <button class="btn btn-secondary edit-btn" data-id="${q.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; margin-bottom: 0.2rem;">Edit</button>
                    <br>
                    <button class="btn btn-secondary toggle-btn" data-id="${q.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; color: ${q.disabled ? 'var(--secondary)' : 'var(--accent)'}; border-color: ${q.disabled ? 'var(--secondary)' : 'var(--accent)'};">
                      ${q.disabled ? 'Enable' : 'Disable'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Edit Modal Overlay -->
      <div id="qb-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content" style="max-width: 600px;">
          <h3 style="margin-bottom: 1rem;">Edit Question</h3>
          <form id="edit-qb-form">
            <input type="hidden" name="qId">
            <div class="form-group">
              <label class="form-label">Question Text</label>
              <textarea class="form-control" name="qText" rows="3" required></textarea>
            </div>
            
            <div class="grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Option A</label>
                <input type="text" class="form-control" name="optA" required>
              </div>
              <div class="form-group">
                <label class="form-label">Option B</label>
                <input type="text" class="form-control" name="optB" required>
              </div>
              <div class="form-group">
                <label class="form-label">Option C</label>
                <input type="text" class="form-control" name="optC" required>
              </div>
              <div class="form-group">
                <label class="form-label">Option D</label>
                <input type="text" class="form-control" name="optD" required>
              </div>
            </div>
            
            <div class="flex justify-end gap-4 mt-4">
              <button type="button" id="qb-cancel" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Modal Elements
    const modal = container.querySelector('#qb-modal');
    const form = container.querySelector('#edit-qb-form');
    const cancelBtn = container.querySelector('#qb-cancel');

    // Attach Event Listeners for Disable Toggle and Edit
    container.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const qIndex = store.state.questions.findIndex(q => q.id === id);
        if (qIndex !== -1) {
          store.state.questions[qIndex].disabled = !store.state.questions[qIndex].disabled;
          store.setState({ questions: [...store.state.questions] });
          store.addLog(store.state.staffUser.name, 'Question Bank', `Toggled status of Q${id}`);
          render();
        }
      });
    });

    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const q = store.state.questions.find(q => q.id === id);
        if (q) {
          form.qId.value = q.id;
          form.qText.value = q.text;
          form.optA.value = q.options[0] || '';
          form.optB.value = q.options[1] || '';
          form.optC.value = q.options[2] || '';
          form.optD.value = q.options[3] || '';
          modal.style.display = 'flex';
        }
      });
    });

    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const id = parseInt(fd.get('qId'));
      const qIndex = store.state.questions.findIndex(q => q.id === id);
      
      if (qIndex !== -1) {
        store.state.questions[qIndex].text = fd.get('qText');
        store.state.questions[qIndex].options = [
          fd.get('optA'),
          fd.get('optB'),
          fd.get('optC'),
          fd.get('optD')
        ];
        store.setState({ questions: [...store.state.questions] });
        store.addLog(store.state.staffUser.name, 'Question Bank', `Edited Question Q${id}`);
        modal.style.display = 'none';
        render();
      }
    });
  }

  render();
  return container;
}
