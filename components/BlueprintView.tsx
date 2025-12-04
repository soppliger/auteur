import React from 'react';
import { MasterBlueprint } from '../types';
import { Copy, Download, FileJson, BookOpen, Fingerprint } from 'lucide-react';

interface Props {
  blueprint: MasterBlueprint | null;
}

const BlueprintView: React.FC<Props> = ({ blueprint }) => {
  if (!blueprint) return <div className="text-gray-500 italic">No blueprint generated yet.</div>;

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blueprint, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${blueprint.title.replace(/\s+/g, '_').toLowerCase()}_master_plan.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileJson className="w-6 h-6 text-purple-400" />
                Master Blueprint
            </h2>
            <p className="text-gray-400 text-sm mt-1">
                Upload this file to the Orchestrator to begin automated production.
            </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <Download className="w-4 h-4" /> Export JSON
        </button>
      </div>

      {/* Series Bible Section */}
      <div className="glass-panel rounded-xl p-6 border border-purple-500/30 bg-purple-900/10">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Series Bible & Style Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="text-xs font-mono text-gray-500 uppercase mb-1">Visual Language</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{blueprint.seriesBible.visualLanguage}</p>
            </div>
            <div>
                <h4 className="text-xs font-mono text-gray-500 uppercase mb-1">Narrative Tone</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{blueprint.seriesBible.narrativeTone}</p>
            </div>
            <div className="md:col-span-2">
                <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">Recurring Motifs</h4>
                <div className="flex flex-wrap gap-2">
                    {blueprint.seriesBible.recurringMotifs.map((m, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-gray-400 flex items-center gap-1">
                            <Fingerprint className="w-3 h-3 text-purple-500" />
                            {m}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* JSON Viewer */}
      <div className="glass-panel rounded-xl p-0 overflow-hidden border border-gray-700">
        <div className="bg-gray-900/50 p-3 border-b border-gray-700 flex justify-between items-center">
             <span className="text-xs font-mono text-gray-400">master_plan.json</span>
             <button 
                onClick={() => navigator.clipboard.writeText(JSON.stringify(blueprint, null, 2))}
                className="text-gray-400 hover:text-white"
             >
                <Copy className="w-4 h-4" />
             </button>
        </div>
        <pre className="p-4 text-xs md:text-sm font-mono text-green-400 overflow-auto max-h-[400px] leading-relaxed">
          {JSON.stringify(blueprint, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default BlueprintView;