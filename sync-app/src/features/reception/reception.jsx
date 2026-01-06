import React, { useState } from 'react';
import { Search, Mic, ArrowRight } from 'lucide-react';

/**
 * RECEPTION SLICE
 * Role: The "Canvas". Manages the search environment and AI intake personality.
 * Design: Sophisticated Apple-style light aesthetic.
 */
const Reception = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="relative h-full w-full overflow-hidden flex items-center justify-center bg-[#F5F5F7]">
      {/* BACKGROUND: Apple Studio Lighting */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#FFFFFF_0%,_#F5F5F7_100%)]"></div>
        {/* Extremely subtle brand warmth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#BD3900] opacity-[0.02] blur-[140px] rounded-full pointer-events-none"></div>
      </div>

      {/* SEARCH CONSOLE LAYER */}
      <div className="relative z-10 w-full max-w-2xl px-6 animate-in fade-in zoom-in duration-1000">
        <div className="flex flex-col items-center space-y-12">
          
          {/* MINIMALIST SEARCH INTERFACE (The Interrogator) */}
          <div className="w-full relative group">
            {/* Soft focus shadow when interacting */}
            <div className="absolute -inset-4 bg-black/5 opacity-0 blur-[40px] rounded-full pointer-events-none transition-opacity duration-700 group-focus-within:opacity-100"></div>
            
            <div className="relative flex items-center bg-white/70 backdrop-blur-2xl rounded-[32px] px-8 py-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-white transition-all duration-700 focus-within:bg-white focus-within:border-[#BD3900]/20 focus-within:shadow-[0_0_50px_rgba(189,57,0,0.08)]">
              <Search className="text-black/15 mr-5 shrink-0 transition-colors duration-500 group-focus-within:text-[#BD3900]" size={24} />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="How can I help you?"
                className="flex-1 bg-transparent border-none outline-none text-gray-900 text-xl placeholder:text-black/20 placeholder:font-light font-light tracking-wide selection:bg-[#BD3900]/10"
                autoFocus
              />
              <div className="flex items-center gap-6 text-black/20 shrink-0">
                <Mic size={22} className="cursor-pointer hover:text-[#BD3900] transition-colors duration-300" />
                <div className="h-8 w-px bg-black/[0.05]"></div>
                <button 
                  disabled={!query}
                  className={`flex items-center justify-center transition-all duration-700 transform ${
                    query ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-6 scale-90 pointer-events-none'
                  }`}
                >
                  <div className="p-2.5 bg-[#BD3900] rounded-full shadow-lg shadow-orange-900/20 hover:bg-[#D44000] active:scale-95 transition-all">
                    <ArrowRight size={22} className="text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* SYSTEM STATUS PULSE */}
          <div className="flex flex-col items-center gap-6">
             <div className="flex items-center gap-4 px-4 py-2 bg-black/[0.02] rounded-full border border-black/[0.03]">
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-4 w-4 rounded-full bg-[#BD3900] opacity-20 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BD3900]"></span>
                </div>
                <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.8em] translate-x-[0.4em] select-none">
                  Surgical Interrogation Active
                </p>
             </div>
             
             {/* QUICK ACTION CHIPS */}
             <div className={`flex gap-5 pt-2 transition-all duration-1000 delay-500 ${query ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                <span className="text-[10px] font-bold text-black/30 border border-black/5 px-4 py-2 rounded-full uppercase tracking-widest hover:border-[#BD3900]/20 hover:bg-white hover:text-[#BD3900] shadow-sm transition-all cursor-pointer bg-white/40">
                  Open Recent Leases
                </span>
                <span className="text-[10px] font-bold text-black/30 border border-black/5 px-4 py-2 rounded-full uppercase tracking-widest hover:border-[#BD3900]/20 hover:bg-white hover:text-[#BD3900] shadow-sm transition-all cursor-pointer bg-white/40">
                  NDA Status Check
                </span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Noise Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <style>{`
        @keyframes zoom-in { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .zoom-in { animation: zoom-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Reception;