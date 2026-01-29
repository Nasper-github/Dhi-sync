import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, FileText, LayoutDashboard, 
  Command, User, Menu, ShieldAlert, Zap, 
  Clock, CheckCircle2, XCircle, Edit3, 
  Info, ArrowRight, Sparkles, Upload, 
  FileCheck, Shield, Loader2, Plus, 
  ShieldCheck, Paperclip, Mic, MoreVertical, ChevronRight, Terminal,
  AlertTriangle
} from 'lucide-react';

// Firebase imports
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// --- CONFIGURATION ---
// PASTE YOUR FORWARDED ADDRESS HERE (from the Ports tab, port 8000)
const BACKEND_URL = "https://urban-chainsaw-5wg9w6ppgjj3p7xv-8000.app.github.dev"; 

const firebaseConfig = {
  apiKey: "optional",
  authDomain: "optional",
  projectId: "optional",
  storageBucket: "optional",
  messagingSenderId: "optional",
  appId: "optional"
};

// Initialize Firebase
let db = null;
let auth = null;

try {
  if (firebaseConfig.apiKey !== "optional") {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

/**
 * FEATURE: WORKFLOW (The Unified Home & Intelligence Hub)
 */
const Workflow = ({ db, auth }) => {
  const [step, setStep] = useState('LOADING'); 
  const [playbook, setPlaybook] = useState([]);
  const [extractedItems, setExtractedItems] = useState([]);
  const [query, setQuery] = useState("");
  const [activeWorkflowTab, setActiveWorkflowTab] = useState('Interrogate'); 
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Sync Playbook State from Firestore
  useEffect(() => {
    if (!db || !auth?.currentUser) {
       setTimeout(() => { if (step === 'LOADING') setStep('EMPTY'); }, 1000);
       return;
    }
    const q = collection(db, 'golden_playbook');
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPlaybook(data);
      if (data.length > 0) setStep('ESTABLISHED');
      else if (step === 'LOADING') setStep('EMPTY');
    }, (err) => console.error("Firestore Error:", err));
  }, [db, auth?.currentUser]);

  const addLog = (msg) => setTerminalLogs(prev => [...prev, `> ${msg}`]);

  // Handle Initial Playbook Upload
  const onMasterFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setStep('EXTRACTING');
    setTerminalLogs([]);
    setIsProcessing(true);
    
    const formData = new FormData();
    formData.append('file', file);

    addLog(`Initiating surgical extraction for: ${file.name}`);
    addLog("Phase 1: Targeting Surgical Gateway...");

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/extract`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "SUCCESS") {
        setExtractedItems(data.mandates);
        
        // Check if the backend returned an error mandate list
        const hasError = data.mandates.some(m => m.id.startsWith('err') || m.title.toLowerCase().includes('error'));
        
        if (hasError) {
          addLog("SYSTEM ALERT: Backend logic failed. Review diagnostics.");
        } else {
          addLog(`Deconstruction Success: ${data.mandates.length} nodes mapped.`);
        }
        
        setTimeout(() => setStep('DISCOVERY'), 1200);
      }
    } catch (err) {
      addLog(`HANDSHAKE FAILED: ${err.message}`);
      addLog("Action Required: Check Port 8000 visibility is set to PUBLIC.");
      
      setTimeout(() => {
        setExtractedItems([
          { id: 'node_1', type: 'STRUCTURE', title: 'Connection Failure', content: 'The frontend could not reach the backend.', reasoning: err.message, isError: true }
        ]);
        setStep('DISCOVERY');
      }, 2500);
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizePlaybook = async () => {
    const approved = extractedItems.filter(i => i.approved);
    if (!db) {
      setPlaybook(approved.length > 0 ? approved : extractedItems); 
      setStep('ESTABLISHED');
      return;
    }
    for (const item of approved) {
      await setDoc(doc(collection(db, 'golden_playbook')), { ...item, status: 'approved', createdAt: Date.now() });
    }
  };

  // --- RENDERING MODES ---

  if (step === 'LOADING') return <div className="h-full bg-white flex items-center justify-center"><Loader2 className="animate-spin text-gray-200" size={32} /></div>;

  if (step === 'EMPTY') {
    return (
      <div className="h-full bg-white flex items-center justify-center p-12 font-sans">
        <div className="max-w-md w-full text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="w-20 h-20 bg-[#BD3900]/10 rounded-[24px] flex items-center justify-center text-[#BD3900] mx-auto mb-8 shadow-inner">
            <Shield size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-4 text-gray-900 uppercase italic">Initialize Playbook</h2>
          <p className="text-sm text-gray-500 font-medium mb-10 leading-relaxed">
            Deconstruct your "Gold Standard" contract to extract legal DNA and unlock the platform.
          </p>
          <input type="file" ref={fileInputRef} onChange={onMasterFileSelect} className="hidden" accept=".pdf,.docx" />
          <button onClick={() => fileInputRef.current.click()} className="w-full bg-gray-900 text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 active:scale-95"><Upload size={16} /> Upload Master Contract</button>
        </div>
      </div>
    );
  }

  if (step === 'EXTRACTING') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-[#F5F5F7] font-sans">
        <Sparkles className="text-[#BD3900] animate-pulse mb-6" size={48} />
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900">Surgical Deconstruction</h3>
        <div className="mt-8 w-full max-w-sm bg-black rounded-2xl p-6 text-left font-mono text-[10px] text-orange-500/80 shadow-2xl">
          {terminalLogs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
          {isProcessing && <div className="animate-pulse text-white mt-2">_ MAPPING_CONNECTIVE_TISSUE...</div>}
        </div>
      </div>
    );
  }

  if (step === 'DISCOVERY') {
    const isErrorState = extractedItems.some(m => m.id?.startsWith('err') || m.isError);

    return (
      <div className="h-full bg-[#F5F5F7] overflow-y-auto font-sans">
        <header className="h-20 bg-white border-b border-gray-200 px-12 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg text-white shadow-lg ${isErrorState ? 'bg-red-500' : 'bg-[#BD3900]'}`}>
              {isErrorState ? <AlertTriangle size={20} /> : <FileCheck size={20} />}
            </div>
            <h1 className="text-sm font-black uppercase tracking-widest">
              {isErrorState ? 'System Diagnostics' : 'Review Skeleton'}
            </h1>
          </div>
          {!isErrorState && (
            <button onClick={finalizePlaybook} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-lg active:scale-95">Bless Golden Playbook <ArrowRight size={14} /></button>
          )}
          {isErrorState && (
            <button onClick={() => setStep('EMPTY')} className="bg-white text-gray-900 border border-gray-200 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-3 active:scale-95">Try Again</button>
          )}
        </header>
        <main className="max-w-3xl mx-auto py-16 px-8 w-full space-y-6">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8">
            {isErrorState ? 'Surgical' : 'Mapped'} <span className={isErrorState ? 'text-red-500' : 'text-[#BD3900]'}>{extractedItems.length} {isErrorState ? 'errors found.' : 'structural nodes.'}</span>
          </h2>
          {extractedItems.map(item => (
            <div key={item.id} onClick={() => !isErrorState && setExtractedItems(prev => prev.map(i => i.id === item.id ? {...i, approved: !i.approved} : i))} className={`p-8 bg-white rounded-[32px] border-2 transition-all duration-500 ${item.approved ? 'border-[#BD3900] shadow-xl' : isErrorState ? 'border-red-100 opacity-100' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'} ${!isErrorState ? 'cursor-pointer' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${item.type === 'LOGIC' ? 'bg-blue-50 text-blue-600' : item.type === 'STRUCTURE' ? 'bg-gray-100 text-gray-400' : 'bg-purple-50 text-purple-600'}`}>{item.type}</span>
                <h4 className={`font-black uppercase text-[11px] tracking-widest ${isErrorState ? 'text-red-600' : 'text-gray-900'}`}>{item.title}</h4>
                {item.approved && <CheckCircle2 size={16} className="text-[#BD3900] ml-auto" />}
              </div>
              <p className={`text-sm italic font-medium leading-relaxed ${isErrorState ? 'text-red-900' : 'text-gray-700'}`}>"{item.content}"</p>
              
              {/* DIAGNOSTIC REASONING FIELD */}
              {item.reasoning && (
                <div className="mt-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Info size={12} className={isErrorState ? "text-red-400" : "text-[#BD3900]"} />
                    {isErrorState ? "Error Stack" : "AI Reasoning"}
                  </div>
                  <p className={`text-[10px] font-mono leading-relaxed bg-gray-50 p-4 rounded-xl ${isErrorState ? 'text-red-700' : 'text-gray-500'}`}>
                    {item.reasoning}
                  </p>
                </div>
              )}
            </div>
          ))}
        </main>
      </div>
    );
  }

  // --- ESTABLISHED HOME ---
  return (
    <div className="h-full bg-[#F5F5F7] overflow-hidden flex flex-col font-sans">
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-8 z-20">
        <div className="max-w-5xl mx-auto flex items-center gap-8">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-[#BD3900] transition-colors"><Search size={20} /></div>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Interrogate the legal memory..." className="w-full bg-gray-100/50 border border-transparent focus:bg-white focus:border-[#BD3900]/20 rounded-[24px] py-5 pl-16 pr-32 text-gray-800 outline-none transition-all shadow-sm" />
            <div className="absolute inset-y-0 right-4 flex items-center gap-2">
              <button className="p-2.5 text-gray-400 hover:text-[#BD3900] hover:bg-gray-100 rounded-xl transition-all"><Paperclip size={20} /></button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button className={`p-2.5 bg-[#BD3900] text-white rounded-xl shadow-lg transition-all transform ${query ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-gray-100 px-12 flex items-center justify-center">
        <div className="flex gap-8">
          {['Interrogate', 'Playbook'].map(tab => (
            <button key={tab} onClick={() => setActiveWorkflowTab(tab)} className={`py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeWorkflowTab === tab ? 'text-[#BD3900]' : 'text-gray-300 hover:text-gray-500'}`}>{tab}{activeWorkflowTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BD3900] rounded-full shadow-[0_0_10px_#BD3900]" />}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-5xl mx-auto">
          {activeWorkflowTab === 'Interrogate' ? (
            <div className="space-y-12 animate-in fade-in duration-500">
               <section>
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Recent Intelligence</h2>
                  <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <tbody className="text-sm font-medium text-gray-600">
                        <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group">
                          <td className="px-8 py-6 flex items-center gap-4">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-300 group-hover:text-[#BD3900] transition-colors"><FileText size={18} /></div>
                            <span className="font-bold text-gray-900">Master_Retail_v2.docx</span>
                          </td>
                          <td className="px-6 py-6"><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Anchored</span></td>
                          <td className="px-8 py-6 text-right text-gray-300 text-xs font-black uppercase">Established</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
               </section>
               <div className="p-10 bg-gray-900 rounded-[40px] text-white relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#BD3900] opacity-20 blur-3xl pointer-events-none group-hover:opacity-40 transition-all duration-1000" />
                 <h3 className="text-2xl font-black tracking-tight mb-3 italic uppercase italic">Drafting Engine Ready</h3>
                 <p className="text-white/40 text-xs font-medium mb-8 max-w-sm leading-relaxed">System is anchored to your Golden Standards. You can now redline incoming drafts against the skeleton.</p>
                 <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Start New Redline</button>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
              {playbook.map((rule) => (
                <div key={rule.id} className="p-8 bg-white border border-gray-100 rounded-[32px] border-l-4 border-l-[#BD3900] shadow-sm">
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-gray-50 rounded text-[8px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">{rule.type}</span>
                    <h3 className="font-black text-gray-900 uppercase text-[11px] tracking-widest">{rule.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed italic bg-gray-50 p-4 rounded-xl">"{rule.content}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeSlice, setActiveSlice] = useState('Workflow');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [playbookCount, setPlaybookCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) signInAnonymously(auth).catch(e => console.error(e));
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !user) return;
    const playbookRef = collection(db, 'golden_playbook');
    const unsubscribe = onSnapshot(playbookRef, (snapshot) => {
      setPlaybookCount(snapshot.docs.length);
    });
    return () => unsubscribe();
  }, [user]);

  const navItems = [
    { id: 'Workflow', icon: Command, label: 'Workflows' },
    { id: 'Draft', icon: FileText, label: 'Drafting' },
    { id: 'Documents', icon: LayoutDashboard, label: 'Documents' },
  ];

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden font-sans selection:bg-[#BD3900]/10">
      <aside className={`${isCollapsed ? 'w-24' : 'w-72'} h-full bg-[#050505] flex flex-col transition-all duration-500 z-30 relative overflow-hidden shadow-2xl`}>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#BD3900] opacity-[0.2] blur-[110px] pointer-events-none" />
        <div className="pt-12 pb-6 flex flex-col items-start px-10 relative z-10">
          <div className="h-16 flex items-center mb-6 -ml-2">
            <div className="p-2.5 bg-[#BD3900] rounded-xl shadow-lg"><ShieldCheck className="text-white" size={24} /></div>
            {!isCollapsed && <h1 className="ml-4 text-xl font-black text-white tracking-tighter uppercase italic">Sync</h1>}
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 text-white/30 hover:text-white transition-colors"><Menu size={24} /></button>
        </div>
        <nav className="flex-1 px-4 space-y-3 py-8 relative z-10">
          {navItems.map((item) => {
            const isLocked = item.id !== 'Workflow' && playbookCount === 0;
            return (
              <button key={item.id} disabled={isLocked} onClick={() => setActiveSlice(item.id)} className={`w-full h-16 flex items-center rounded-xl px-6 transition-all duration-300 relative ${activeSlice === item.id ? 'bg-[#BD3900] text-white shadow-xl shadow-orange-950/40' : isLocked ? 'opacity-20 cursor-not-allowed grayscale' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>
                <item.icon size={28} className="shrink-0" />
                {!isCollapsed && <span className="ml-6 text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>}
                {isLocked && !isCollapsed && <ShieldAlert size={14} className="ml-auto text-orange-500 animate-pulse" />}
              </button>
            );
          })}
        </nav>
        <div className="p-8 border-t border-white/5 bg-black/40 relative z-10">
          <div className="flex items-center px-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner"><User size={24} className="text-white/40" /></div>
            {!isCollapsed && (
              <div className="ml-4 overflow-hidden">
                <p className="text-[10px] font-black text-white uppercase tracking-wider whitespace-nowrap">Admin Scribe</p>
                <p className="text-[10px] text-white/20 font-bold uppercase whitespace-nowrap italic">Golden Access</p>
              </div>
            )}
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-white relative">
        {activeSlice === 'Workflow' && <Workflow db={db} auth={auth} />}
        {activeSlice !== 'Workflow' && <div className="h-full flex items-center justify-center"><h3 className="text-sm font-black uppercase tracking-widest text-gray-200">{activeSlice} Module Active</h3></div>}
      </main>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-in { animation: 0.6s ease-out forwards; }
        .fade-in { animation-name: fade-in; }
      `}</style>
    </div>
  );
};

export default App;