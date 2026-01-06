import React, { useState } from 'react';
import { 
  MessageSquare, Search, FileText, LayoutDashboard, 
  Command, User, Menu 
} from 'lucide-react';

// Vertical Slice Imports
import Reception from './features/reception/reception';
import Draft from './features/draft/draft';

/**
 * MAIN APP ORCHESTRATOR
 * Role: The "Frame". Manages the Sidebar, Navigation State, and Layout Shell.
 * The Header has been removed to allow modules like Reception to be full-screen.
 */
const App = () => {
  const [activeSlice, setActiveSlice] = useState('Reception');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Finalized Sidebar Dimensions
  const sidebarWidth = isCollapsed ? 'w-28' : 'w-72';

  const navItems = [
    { id: 'Reception', icon: MessageSquare, label: 'Reception' },
    { id: 'Draft', icon: FileText, label: 'Drafting' },
    { id: 'Workflow', icon: Command, label: 'Workflows' },
    { id: 'Documents', icon: Search, label: 'Documents' },
    { id: 'Analytics', icon: LayoutDashboard, label: 'Analytics' },
  ];

  const renderContent = () => {
    switch (activeSlice) {
      case 'Reception': return <Reception />;
      case 'Draft': return <Draft />;
      default: return (
        <div className="h-full flex items-center justify-center bg-white">
          <p className="text-gray-300 font-black tracking-[0.3em] uppercase text-[10px] italic">
            Module {activeSlice} Offline
          </p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">
      {/* LUXURIOUS SIDEBAR - FINALIZED LOGIC */}
      <aside 
        className={`${sidebarWidth} h-full bg-[#050505] flex flex-col transition-all duration-500 ease-in-out z-30 shadow-2xl relative overflow-hidden`}
      >
        {/* Brand Accents (Glows) */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#BD3900] opacity-[0.22] blur-[110px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-20%] w-64 h-64 bg-[#BD3900] opacity-[0.1] blur-[90px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[-15%] w-80 h-80 bg-[#BD3900] opacity-[0.15] blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-48 h-48 bg-[#FF4D00] opacity-[0.08] blur-[80px] pointer-events-none"></div>

        {/* Header: Logo and Menu Toggle (Frozen Alignment) */}
        <div className="pt-12 pb-6 flex flex-col items-start px-10 relative z-10">
          <div className="h-24 flex items-center mb-4 transition-none -ml-7">
            <img 
              src="/Sync Logo.png" 
              alt="Logo" 
              className="h-24 w-auto object-contain shrink-0 max-w-none"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <div className="flex justify-start -ml-1"> 
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all group"
            >
              <Menu size={24} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-4 py-8 relative z-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSlice(item.id)}
              className={`w-full h-20 flex items-center rounded-xl transition-all duration-300 group relative overflow-hidden px-6 ${
                activeSlice === item.id 
                ? 'bg-[#BD3900] text-white shadow-lg shadow-orange-950/40' 
                : 'text-white/30 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={32} className={`shrink-0 transition-transform duration-300 ${activeSlice === item.id ? 'text-white' : 'group-hover:scale-110'}`} />
              {!isCollapsed && (
                <span className="ml-8 text-sm font-bold tracking-tight whitespace-nowrap transition-all duration-500">
                  {item.label}
                </span>
              )}
              {activeSlice === item.id && (
                <div className="absolute right-0 w-1.5 h-10 bg-white rounded-l-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Profile / Footer Section */}
        <div className="p-8 border-t border-white/5 bg-black/40 relative z-10 transition-all duration-500">
          <div className="flex items-center px-2">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
              <User size={32} className="text-white/60" />
            </div>
            {!isCollapsed && (
              <div className={`ml-6 overflow-hidden transition-all duration-500`}>
                <p className="text-xs font-black text-white uppercase tracking-wider whitespace-nowrap">Senior Counsel</p>
                <p className="text-[10px] text-white/30 font-bold uppercase whitespace-nowrap">Enterprise</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {/* GLOBAL HEADER REMOVED: 
          As per request, no common header exists. 
          Each module manages its own internal layout and spacing.
        */}

        {/* Feature Content Slot */}
        <div className="flex-1 overflow-auto relative">
          {renderContent()}
        </div>
      </main>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-left { from { transform: translateX(-10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-in { animation: 0.5s ease-out forwards; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-left-1 { animation-name: slide-in-from-left; }
      `}</style>
    </div>
  );
};

export default App;