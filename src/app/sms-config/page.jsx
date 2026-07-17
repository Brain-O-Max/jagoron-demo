"use client";

import { useState } from 'react';
import { useStore } from '../../store.js';

export default function SmsConfigPage() {
  const [state, setState, addLog] = useStore();

  const [provider, setProvider] = useState(state.smsConfig.provider);
  const [apiKey, setApiKey] = useState(state.smsConfig.apiKey);
  const [senderId, setSenderId] = useState('JAGORON');
  const [templateReady, setTemplateReady] = useState(state.smsConfig.templates.assessmentReady);
  const [templateFollowUp, setTemplateFollowUp] = useState('আপনার পরবর্তী ট্রেনিং সেশন আগামীকাল। দয়া করে উপস্থিত থাকুন।');

  const handleSave = () => {
    setState({
      smsConfig: {
        provider: provider,
        apiKey: apiKey,
        templates: {
          assessmentReady: templateReady
        }
      }
    });

    alert("SMS Configuration saved successfully!");
    addLog(state.staffUser?.name, 'Config Update', 'Updated SMS Gateway and Templates');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ fontSize: '2rem' }}>SMS Configuration</h2>
          <p>Manage SMS gateway settings and message templates.</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary">Save Configuration</button>
      </div>
      
      <div className="grid-cols-2">
        {/* Gateway Config */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Gateway Settings</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label">SMS Provider</label>
              <select 
                className="form-control"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="Twilio">Twilio</option>
                <option value="Local Carrier">Local Carrier API</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">API Key / Token</label>
              <input 
                type="password" 
                className="form-control" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sender ID</label>
              <input 
                type="text" 
                className="form-control" 
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        {/* Templates */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Message Templates</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label">Template: Assessment Ready (English)</label>
              <textarea 
                className="form-control" 
                rows="4"
                value={templateReady}
                onChange={(e) => setTemplateReady(e.target.value)}
              ></textarea>
              <small className="text-muted" style={{ marginTop: '0.5rem', display: 'block' }}>Variables: {`{name}`}, {`{pathway}`}</small>
            </div>
            <div className="form-group">
              <label className="form-label">Template: Follow-up Reminder (Bangla)</label>
              <textarea 
                className="form-control" 
                rows="3"
                value={templateFollowUp}
                onChange={(e) => setTemplateFollowUp(e.target.value)}
              ></textarea>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
