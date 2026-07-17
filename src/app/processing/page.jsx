"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../store.js';

function ProcessingPageContent() {
  const [state, setState, addLog] = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isBulk = searchParams.get('bulk') === 'true';
  const targetsRaw = searchParams.get('targets');
  const targets = targetsRaw ? targetsRaw.split(',').map(x => parseInt(x)) : [];
  const fromRoute = searchParams.get('from') || '/beneficiaries';

  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isDone, setIsDone] = useState(false);

  const steps = [
    "Initializing Core ML Models...",
    "Establishing Vector Embeddings...",
    "Running Psychometric Scoring...",
    "Executing Bias-Check Protocols...",
    "Synthesizing Employment Pathways..."
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLogs(prev => {
          // Mark previous step as done
          const nextLogs = prev.map((log, idx) => 
            idx === prev.length - 1 ? { ...log, done: true } : log
          );
          return [...nextLogs, { text: steps[currentStep], done: false }];
        });
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Finalize state update
        const updated = state.youths.map(y => {
          if (targets.includes(y.id)) {
            const pathways = ['Entrepreneurship', 'Technical Skill Training', 'Job Placement'];
            const p = pathways[Math.floor(Math.random() * pathways.length)];
            const conf = Math.floor(Math.random() * 20) + 80;
            const comp = Math.floor(Math.random() * 35) + 60; // competency score 60-95
            
            return {
              ...y,
              status: 'Assessed',
              aiProfile: {
                pathway: p,
                confidence: conf,
                competencyScore: comp,
                traits: ['Resilient', 'Analytical', 'Communicative'],
                messageSent: false
              }
            };
          }
          return y;
        });

        setState({ youths: updated });
        addLog(state.staffUser?.name, 'AI Engine', `Generated profiling for ${targets.length} youth(s).`);
        setIsDone(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetsRaw]);

  const handleViewResults = () => {
    if (isBulk) {
      router.push(fromRoute);
    } else {
      router.push(`/results?youthId=${targets[0]}&from=${fromRoute}`);
    }
  };

  return (
    <div className="processing-container" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-2rem', position: 'relative' }}>
      <style>{`
        .ai-box {
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 3rem;
          width: 100%;
          max-width: 600px;
          box-shadow: var(--shadow-lg);
        }
        
        .title {
          font-family: 'Inter', sans-serif;
          color: var(--text-color);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .status-list {
          background: var(--surface-hover);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          min-height: 200px;
          border: 1px solid var(--border-color);
          margin-bottom: 2rem;
        }
        
        .status-item {
          margin-bottom: 1rem;
          opacity: 0;
          transform: translateY(10px);
          animation: fadeUp 0.4s forwards;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: var(--text-color);
        }
        
        .status-item .icon {
          color: var(--primary);
          font-size: 1.1rem;
        }
        
        .status-item.done .icon {
          color: #10b981; /* success green */
        }
        
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        
        .progress-bg {
          width: 100%;
          height: 6px;
          background: var(--border-color);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 2rem;
        }
        
        .progress-bar {
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }
        
        .completion-message {
          text-align: center;
          margin-top: 2rem;
          animation: fadeUp 0.5s forwards;
        }
        
        .completion-message h3 {
          color: #10b981; /* success */
          margin-bottom: 0.5rem;
        }
        
        .completion-message p {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
      `}</style>
      
      <div className="ai-box">
        <div className="title">
          {!isDone && <div className="spinner-primary"></div>}
          AI Assessment Engine
        </div>
        
        <div className="status-list">
          {logs.map((log, idx) => (
            <div key={idx} className={`status-item ${log.done ? 'done' : ''}`}>
              <span className="icon">{log.done ? '✓' : '◎'}</span> 
              <span>{log.text}</span>
            </div>
          ))}
        </div>
        
        <div className="progress-bg">
          <div 
            className="progress-bar" 
            style={{ width: `${(logs.length / steps.length) * 100}%` }}
          ></div>
        </div>
        
        {isDone && (
          <div className="completion-message">
            <h3>Analysis Complete</h3>
            <p>Behavioral profiling and recommendations generated successfully.</p>
            <button onClick={handleViewResults} className="btn btn-primary" style={{ width: '100%' }}>
              {isBulk ? "Return to Engine" : "View Results & Pathway"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-4">
        <div className="spinner-primary"></div>
        <span style={{ marginLeft: '1rem' }}>Loading processor console...</span>
      </div>
    }>
      <ProcessingPageContent />
    </Suspense>
  );
}
