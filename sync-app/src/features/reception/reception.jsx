import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Paperclip, 
  Mic, 
  Clock, 
  FileText, 
  MoreVertical, 
  Plus, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const Reception = () => {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  // Mock Data for MS Word Home Metaphor
  const recentFiles = [
    { id: 1, name: "Master_Services_Acme_v2.docx", type: "MSA", date: "2h ago", status: "Analyzed" },
    { id: 2, name: "Lease_Agreement_Level4.pdf", type: "Lease", date: "Yesterday", status: "Flagged" },
    { id: 3, name: "NDA_Standard_Template.docx", type: "NDA", date: "Jan 24", status: "Clean" },
    { id: 4, name: "Employment_Contract_JH.docx", type: "Employment", date: "Jan 20", status: "Analyzed" },
  ];

  const skeletons = [
    { title: "Blank Contract", description: "Start from scratch", icon: Plus },
    { title: "Standard NDA", description: "Unilateral/Mutual", icon: ShieldCheck },
    { title: "Marketing MSA", description: "Playbook 2025 v4.2", icon: Zap },
  ];

  const addLog = (msg) => {
    setTerminalLogs(prev => [...prev, `> ${msg}`]);
  };

  /**
   * SURGICAL INTAKE HANDLER
   * Triggers the Terminal Stream & Backend Handshake
   */
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setShowTerminal(true);
    setIsProcessing(true);
    setTerminalLogs([]);

    // 1. Simulation of Terminal Dissection Logs
    const steps = [
      `Initiating intake for: ${file.name}`,
      "Pillar C: Lossless Symbolic Ingestion started...",
      "Extracting Binary Stream...",
      "Mapping Document Object Model (DOM)...",
      "Generating DSD (Document Schema Definition) nodes...",
      "Syncing IDs with Structural Graph...",
      "Identifying Clause Coordinates..."
    ];

    for (const step of steps) {
      addLog(step);
      await new Promise(r => setTimeout(r, 600));
    }

    // 2. Actual Backend Call
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/ingest', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Dissection Failed');
      
      const data = await response.json();
      addLog("SUCCESS: DSD XML generated and anchored.");
      addLog("READY: Proceed to Drafting Engine for surgical redlining.");
    } catch (err) {
      addLog(`CRITICAL ERROR: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  return (
    <div className="h-full bg-[#F5F5F7] overflow-y-auto font-sans selection:bg-[#4F46E5]/10">
      
      {/* 1. TOP INTERROGATION CONSOLE (MS Word Search Meta) */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20 px-12 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-8">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="text-gray-300 group-focus-within:text-[#4F46E5] transition-colors" size={20} />
            </div>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Interrogate the legal memory or find a file..."
              className="w-full bg-gray-100/50 border border-transparent focus:bg-white focus:border-[#4F46E5]/20 focus:ring-4 focus:ring-[#4F46E5]/5 rounded-2xl py-4 pl-16 pr-32 text-gray-800 placeholder:text-gray-400 transition-all outline-none"
            />
            <div className="absolute inset-y-0 right-4 flex items-center gap-4">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".docx" />
              <button 
                onClick={() => fileInputRef.current.click()}
                className="p-2 text-gray-400 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-all"
              >
                <Paperclip size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-all">
                <Mic size={20} />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button className={`p-2 bg-[#4F46E5] text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform ${query ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-12 py-12 space-y-16 pb-32">
        
        {/* 2. DRAFTING SKELETONS (The 'New' Section) */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Initiate Drafting</h2>
            <button className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-widest hover:underline">View All Templates</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skeletons.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-400 group-hover:bg-[#4F46E5] group-hover:text-white transition-all">
                  <s.icon size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-xs text-gray-400 font-medium">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. RECENT CONTRACTS (The 'Home' Feed) */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Recent Intelligence</h2>
            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
              <span className="cursor-pointer hover:text-gray-900 transition-colors">Shared with me</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="cursor-pointer hover:text-gray-900 transition-colors">My Drafts</span>
            </div>
          </div>
          
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                  <th className="px-8 py-5">File Name</th>
                  <th className="px-6 py-5">Surgical Status</th>
                  <th className="px-6 py-5">Last Dissection</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-600">
                {recentFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:text-[#4F46E5] transition-colors">
                          <FileText size={18} />
                        </div>
                        <span className="group-hover:text-gray-900 transition-colors">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        file.status === 'Analyzed' ? 'bg-indigo-50 text-[#4F46E5]' : 
                        file.status === 'Flagged' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {file.status === 'Analyzed' ? <Zap size={10} /> : <CheckCircle2 size={10} />}
                        {file.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-400 text-xs tracking-tight">{file.date}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-gray-200/50 rounded-lg transition-all text-gray-300 hover:text-gray-600">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 4. REAL-TIME DISSECTION TERMINAL (Overlay) */}
      {showTerminal && (
        <div className="fixed bottom-12 right-12 w-96 z-50 animate-in slide-in-from-right-8 duration-500">
          <div className="bg-[#050505] rounded-3xl border border-white/10 shadow-2xl shadow-indigo-950/40 overflow-hidden">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Surgical Dissection</span>
              </div>
              <button onClick={() => setShowTerminal(false)} className="text-white/30 hover:text-white transition-colors">
                <Plus size={16} className="rotate-45" />
              </button>
            </div>
            <div 
              ref={scrollRef}
              className="p-6 h-64 overflow-y-auto font-mono text-[10px] leading-relaxed text-indigo-400/80 scrollbar-hide"
            >
              {terminalLogs.map((log, i) => (
                <div key={i} className="mb-1 opacity-0 animate-in fade-in slide-in-from-left-1 duration-300">
                  {log}
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-2 mt-2 text-white animate-pulse">
                  <span className="w-1.5 h-3 bg-[#4F46E5]"></span>
                  <span>AWAITING SCHEMA_HANDOFF...</span>
                </div>
              )}
            </div>
            {!isProcessing && (
              <div className="p-6 pt-0">
                <button className="w-full bg-[#4F46E5] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#4338CA] transition-all flex items-center justify-center gap-2 group">
                  Proceed to Drafting Engine
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Aesthetics */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slide-in-from-right { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slide-in-from-left { from { transform: translateX(-10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-in { animation: 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom; animation-delay: 0.1s; }
        .slide-in-from-right-8 { animation-name: slide-in-from-right; }
        .slide-in-from-left-1 { animation-name: slide-in-from-left; }
      `}</style>
    </div>
  );
};

export default Reception;