import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Upload, 
  FileCheck, 
  Shield, 
  Loader2, 
  Info 
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  getAuth, 
  onAuthStateChanged 
} from 'firebase/auth';

// --- FIREBASE INITIALIZATION ---
// Note: In a production environment, this configuration should be centralized.
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

/**
 * FEATURE: WORKFLOW (The Governance Gate & Unwrapping Experience)
 * Purpose: Manages the firm's "Golden Playbook" and the initial standard-setting phase.
 * Steps: EMPTY -> EXTRACTING -> DISCOVERY -> ESTABLISHED
 * * @param {Function} onInitialized - Callback used to transition the main app view 
 * after the Playbook has been established.
 */
const Workflow = ({ onInitialized }) => {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState('LOADING'); // LOADING, EMPTY, EXTRACTING, DISCOVERY, ESTABLISHED
  const [extractedItems, setExtractedItems] = useState([]);
  const [playbook, setPlaybook] = useState([]);

  // Authenticate and track user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Listen to the Golden Playbook collection in real-time
  useEffect(() => {
    if (!user) return;
    
    // Rule 1: Strict pathing for multi-tenant isolation
    const playbookRef = collection(db, 'artifacts', appId, 'public', 'data', 'golden_playbook');
    
    return onSnapshot(playbookRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPlaybook(data);
      
      // Determination of the current UI phase based on data presence
      if (data.length > 0) {
        setStep('ESTABLISHED');
      } else if (step === 'LOADING') {
        setStep('EMPTY');
      }
    }, (err) => console.error("Playbook Retrieval Error:", err));
  }, [user, step]);

  /**
   * Action: Simulated Ingestion
   * This is where the frontend hands off to the Backend Surgical Extractor.
   */
  const handleInitialUpload = () => {
    setStep('EXTRACTING');
    
    // Simulation: AI extraction latency from the Blue Tokai negotiation draft
    setTimeout(() => {
      setExtractedItems([
        { id: 'rule_1', type: 'LOGIC', title: 'Termination Notice', content: 'Notice period shall not exceed 60 days.', reasoning: 'Extracted from negotiated win in Blue Tokai v1.1 draft.', approved: false },
        { id: 'rule_2', type: 'BOILERPLATE', title: 'Force Majeure Waiver', content: 'Tenant shall have a complete waiver from rent during government-mandated lockdowns.', reasoning: 'Identified as critical organizational risk stance.', approved: false },
        { id: 'rule_3', type: 'LOGIC', title: 'Lock-in Period', content: 'Minimum 36 months lock-in required for commercial retail leases.', reasoning: 'Calculated from lease term parameters.', approved: false }
      ]);
      setStep('DISCOVERY');
    }, 2800);
  };

  /**
   * Action: Human-in-the-Loop Approval
   */
  const toggleApproval = (id) => {
    setExtractedItems(prev => prev.map(item => 
      item.id === id ? { ...item, approved: !item.approved } : item
    ));
  };

  /**
   * Action: Commit to Cloud
   * Promotes "Blessings" into functional, firm-wide Golden Rules.
   */
  const finalizePlaybook = async () => {
    const approvedNodes = extractedItems.filter(i => i.approved);
    for (const node of approvedNodes) {
      const ref = doc(collection(db, 'artifacts', appId, 'public', 'data', 'golden_playbook'));
      await setDoc(ref, { 
        ...node, 
        status: 'approved', 
        createdAt: Date.now(),
        author: user.uid 
      });
    }
    // Step is automatically updated by the Firestore listener to 'ESTABLISHED'
  };

  // --- RENDERING LOGIC ---

  if (step === 'LOADING') {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#BD3900]" size={32} />
      </div>
    );
  }

  // Phase 1: Zero State
  if (step === 'EMPTY') {
    return (
      <div className="h-full bg-white flex items-center justify-center p-12">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#BD3900]/10 rounded-[24px] flex items-center justify-center text-[#BD3900] mx-auto mb-8">
            <Shield size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-4 text-gray-900 uppercase italic">Initialize Playbook</h2>
          <p className="text-sm text-gray-500 font-medium mb-10 leading-relaxed">
            Project Sync is currently offline. Upload your "Master Contract" to extract your firm's legal DNA and unlock the platform.
          </p>
          <button 
            onClick={handleInitialUpload}
            className="w-full bg-gray-900 text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
          >
            <Upload size={16} /> Upload Master Contract
          </button>
        </div>
      </div>
    );
  }

  // Phase 2: Processing
  if (step === 'EXTRACTING') {
    return (
      <div className="h-full bg-[#F5F5F7] flex flex-col items-center justify-center text-center p-12">
        <Sparkles className="text-[#BD3900] animate-pulse mb-6" size={48} />
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 leading-tight">Surgical Extraction</h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Mapping Logic Nodes & Boilerplate DNA...</p>
      </div>
    );
  }

  // Phase 3: Review Queue
  if (step === 'DISCOVERY') {
    return (
      <div className="h-full bg-[#F5F5F7] flex flex-col font-sans">
        <header className="h-20 bg-white border-b border-gray-200 px-12 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#BD3900] rounded-lg text-white"><FileCheck size={20} /></div>
            <h1 className="text-sm font-black uppercase tracking-widest">Review Mandates</h1>
          </div>
          <button onClick={finalizePlaybook} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-lg shadow-black/10">
            Bless Golden Playbook <ArrowRight size={14} />
          </button>
        </header>

        <main className="max-w-3xl mx-auto py-16 px-8 w-full space-y-6">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">AI identifies <span className="text-[#BD3900]">{extractedItems.length} standards.</span></h2>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Review and approve your firm's baseline mandates.</p>
          </div>

          {extractedItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleApproval(item.id)}
              className={`p-8 bg-white rounded-[32px] border-2 cursor-pointer transition-all duration-300 ${item.approved ? 'border-[#BD3900] shadow-xl' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${item.type === 'LOGIC' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{item.type}</span>
                <h4 className="font-black uppercase text-[11px] tracking-widest text-gray-900">{item.title}</h4>
              </div>
              <p className="text-sm text-gray-700 italic font-medium leading-relaxed mb-4">"{item.content}"</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <Zap size={12} className="text-[#BD3900]" /> {item.reasoning}
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  // Phase 4: Established Standard (Golden Playbook View)
  return (
    <div className="h-full bg-white overflow-y-auto font-sans">
      <nav className="h-24 px-12 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10"><Shield size={24} /></div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Golden Playbook</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Active Standards • Blue Tokai</p>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-12 py-16">
        <div className="space-y-4">
          {playbook.map((rule) => (
            <div key={rule.id} className="p-8 bg-white border border-gray-100 rounded-[32px] border-l-4 border-l-[#BD3900] shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">{rule.title}</h3>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest px-2 py-1 bg-gray-50 rounded">MANDATE</span>
              </div>
              <p className="text-sm text-gray-600 font-medium leading-relaxed italic bg-gray-50 p-6 rounded-2xl">"{rule.content}"</p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-gray-900 rounded-[40px] text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#BD3900] opacity-30 blur-3xl pointer-events-none group-hover:opacity-50 transition-all duration-700" />
          <div className="relative z-10">
            <h3 className="text-3xl font-black tracking-tight mb-4 uppercase italic">Standards Locked.</h3>
            <p className="text-white/50 text-sm font-medium mb-10 max-w-sm leading-relaxed">Your legal DNA is established. You can now redline incoming drafts or generate new instruments based on these mandates.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => onInitialized('Reception')} 
                className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
              >
                Start New Redline
              </button>
              <button 
                onClick={() => onInitialized('Draft')} 
                className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all"
              >
                Create Draft
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workflow;