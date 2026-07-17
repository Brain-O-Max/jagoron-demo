export const store = {
  state: {
    staffUser: JSON.parse(localStorage.getItem('jagoron_staffUser')) || null, // Current logged-in user
    appLayout: 'sidebar', // 'grid' | 'sidebar'
    sidebarCollapsed: false,
    
    // Admin Features: Users & Roles
    staffUsers: [
      { id: 1, name: 'Jane Doe', email: 'staff@care.org', password: 'password', mobile: '+8801711111111', designation: 'Field Officer', dob: '1992-05-15', joiningDate: '2025-01-01', location: 'Khulna', address: 'Khulna Sadar', org: 'CARE Bangladesh', role: 'Field Officer', region: 'Khulna', status: 'Active' },
      { id: 2, name: 'Admin User', email: 'admin@xyz.org', password: 'password', mobile: '+8801811111111', designation: 'Admin', dob: '1988-10-20', joiningDate: '2024-06-15', location: 'Dhaka', address: 'Banani', org: 'SOS Childrens Village', role: 'Admin', region: 'Global', status: 'Active' },
      { id: 3, name: 'Donor User', email: 'donor@usaid.gov', password: 'password', mobile: '+12025550198', designation: 'Project Funder', dob: '', joiningDate: '', location: 'Washington DC', address: '', org: 'Donor Agency', role: 'Donor', region: 'Global', status: 'Active' }
    ],
    roles: [
      { name: 'Admin', description: 'Full system access and configuration.', permissions: ['dashboard', 'assess_youth', 'bulk_sms', 'reports', 'question_bank', 'mis_sync', 'manage_users', 'manage_roles'] },
      { name: 'Program Manager', description: 'Oversees all project activities and aggregated M&E data.', permissions: ['dashboard', 'reports', 'bulk_sms'] },
      { name: 'MEAL', description: 'Monitoring, Evaluation, Accountability, and Learning lead.', permissions: ['dashboard', 'reports'] },
      { name: 'Partner MEAL', description: 'MEAL officer for specific partner NGOs.', permissions: ['dashboard', 'reports'] },
      { name: 'Project Officer', description: 'Manages field implementation and YLO coordination.', permissions: ['dashboard', 'assess_youth', 'reports'] },
      { name: 'Feild Facilitator', description: 'Direct youth engagement and profiling.', permissions: ['dashboard', 'assess_youth'] },
      { name: 'Donor', description: 'High-level impact tracking and reporting.', permissions: ['donor_dashboard', 'reports'] }
    ],

    // Beneficiaries
    youths: (JSON.parse(localStorage.getItem('jagoron_youths')) || []).map(y => {
      // Legacy status migration
      if (y.status === 'Pending Validation') return { ...y, status: 'Submitted' };
      if (y.status === 'Registered') return { ...y, status: 'Assessment Pending' };
      if (y.status === 'Assessment Complete') return { ...y, status: 'Assessment Completed' };
      return y;
    }), 
    
    // Track current view context
    currentYouthId: null, 

    // System Settings
    smsConfig: {
      provider: 'Twilio',
      apiKey: '****************',
      templates: {
        assessmentReady: "Hello {name}, your JAGORON profiling is ready. Your recommended pathway is {pathway}. Visit care.org/jagoron for more info."
      }
    },
    
    misSync: {
      lastSync: 'Never',
      status: 'Idle'
    },

    // Audit Log
    auditLogs: [
      { id: 1, timestamp: new Date(Date.now() - 86400000).toLocaleString(), user: 'System', action: 'System Initialization', details: 'Database seeded' },
      { id: 2, timestamp: new Date(Date.now() - 3600000).toLocaleString(), user: 'Jane Doe', action: 'Security', details: 'Logged into the system.' },
      { id: 3, timestamp: new Date(Date.now() - 1800000).toLocaleString(), user: 'Admin User', action: 'Pre-Screening ML', details: 'Approved 3 profiles, Rejected 0.' },
    ],

    // Sync Logs for Field Agents
    syncLogs: [
      { id: 101, user: 'Jane Doe', location: 'Khulna Sadar', device: 'Galaxy Tab A7', timestamp: new Date(Date.now() - 7200000).toLocaleString(), recordsSynced: 10, dataSize: '145 KB', duration: '2.4s', status: 'Success', details: 'Synced 10 new youth registrations including demographic and baseline assessment data. No data conflicts detected.' },
      { id: 102, user: 'Rahim Ali', location: 'Gazipur', device: 'Lenovo Tab M8', timestamp: new Date(Date.now() - 14400000).toLocaleString(), recordsSynced: 2, dataSize: '24 KB', duration: '0.8s', status: 'Success', details: 'Synced 2 updated profiles. Overwritten existing local data with server changes.' },
      { id: 103, user: 'Jane Doe', location: 'Khulna Sadar', device: 'Galaxy Tab A7', timestamp: new Date(Date.now() - 259200000).toLocaleString(), recordsSynced: 0, dataSize: '0 KB', duration: '15.0s', status: 'Failed (Network Error)', details: 'Connection timed out while attempting to reach the central MIS server. Payload size was 850 KB.' }
    ],

    // Enhanced Question Bank
    questions: [
      { id: 1, type: 'psychometric', text: 'How do you react when you see someone struggling with a difficult task?', options: ['Offer to help immediately', 'Wait to see if they ask', 'Assume they want to do it alone', 'Ignore it'], disabled: false },
      { id: 2, type: 'behavioral', text: 'If an elderly person is repeating the same question multiple times, you would:', options: ['Answer patiently every time', 'Kindly redirect the conversation', 'Show frustration', 'Walk away'], disabled: false },
      { id: 3, type: 'aptitude', text: 'A customer is very angry about a product defect. The best approach is to:', options: ['Listen calmly and apologize', 'Argue that it is not your fault', 'Call security', 'Give them a refund immediately without checking'], disabled: false },
      { id: 4, type: 'behavioral', text: 'You are trying to convince someone to buy a product. You focus mostly on:', options: ['How the product solves their problem', 'The technical specifications', 'The price being low', 'Talking as much as possible'], disabled: false },
      { id: 5, type: 'psychometric', text: 'When a machine breaks down, your first instinct is to:', options: ['Take it apart to see how it works', 'Read the manual carefully', 'Call a professional', 'Throw it away'], disabled: false },
      { id: 6, type: 'aptitude', text: 'If a sequence goes: 2, 6, 12, 20... what comes next?', options: ['30', '28', '24', '32'], disabled: false },
      { id: 7, type: 'behavioral', text: 'You see scattered plastic waste in a community area. What is your thought?', options: ['Organize a cleanup and recycling drive', 'Someone else will clean it', 'It is not my problem', 'Complain about it'], disabled: false },
      { id: 8, type: 'psychometric', text: 'How important is environmental sustainability to your daily decisions?', options: ['Extremely important', 'Somewhat important', 'Rarely think about it', 'Not important'], disabled: false },
      { id: 9, type: 'behavioral', text: 'If a team member is repeatedly making a small quality error, you would:', options: ['Show them the correct method and monitor', 'Do their work for them', 'Report them immediately', 'Ignore it if quota is met'], disabled: false },
      { id: 10, type: 'aptitude', text: 'You notice a tiny stitching error on 5 out of 100 garments. What is the acceptable action?', options: ['Reject and fix the 5 garments', 'Pass them all to meet deadline', 'Scrap the entire batch', 'Hide the errors'], disabled: false },
      { id: 11, type: 'psychometric', text: 'When facing a completely new, unpredictable challenge, you feel:', options: ['Excited and motivated', 'Anxious but willing to try', 'Prefer to stick to what I know', 'Overwhelmed'], disabled: false }
    ]
  },
  
  listeners: [],
  
  subscribe(listener) {
    this.listeners.push(listener);
  },
  
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  },
  
  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (newState.staffUser !== undefined) {
      if (newState.staffUser) {
        localStorage.setItem('jagoron_staffUser', JSON.stringify(newState.staffUser));
      } else {
        localStorage.removeItem('jagoron_staffUser');
      }
    }
    if (newState.youths !== undefined) {
      localStorage.setItem('jagoron_youths', JSON.stringify(newState.youths));
    }
    this.notify();
  },
  
  // Helper to add audit logs
  addLog(user, action, details) {
    const log = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      user: user,
      action: action,
      details: details
    };
    this.setState({ auditLogs: [log, ...this.state.auditLogs] });
  }
};
