import React from 'react';
import { FileText, Plus } from 'lucide-react';

const Draft = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-600/20 rounded-xl border border-orange-600/30">
            <FileText className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Drafting Engine</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Precision In-line Intelligence</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-sm font-bold transition-all shadow-lg shadow-orange-900/20">
          <Plus size={16} />
          New Skeleton Draft
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all cursor-pointer group">
          <h3 className="text-sm font-bold mb-2 group-hover:text-orange-500">Marketing MSA</h3>
          <p className="text-xs text-gray-500">Based on 2025 Playbook v4.2</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 border-dashed flex items-center justify-center text-gray-600 text-xs italic">
          More templates available in Playbook...
        </div>
      </div>
    </div>
  );
};

export default Draft;