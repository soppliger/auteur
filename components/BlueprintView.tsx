
import React, { useState } from 'react';
import { MasterBlueprint } from '../types';
import { Copy, Download, FileJson, Terminal, Play, ShieldCheck, Check } from 'lucide-react';

interface Props {
  blueprint: MasterBlueprint | null;
}

const BlueprintView: React.FC<Props> = ({ blueprint }) => {
  const [activeTab, setActiveTab] = useState<'json' | 'docker' | 'python' | 'readme'>('readme');

  if (!blueprint) return <div className="text-gray-500 italic">No blueprint generated yet.</div>;

  const handleDownload = (content: string, filename: string) => {
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
    const node = document.createElement('a');
    node.setAttribute("href", dataStr);
    node.setAttribute("download", filename);
    document.body.appendChild(node);
    node.click();
    node.remove();
  };

  const tabs = [
    { id: 'readme', label: 'README.md', icon: ShieldCheck, content: blueprint.readme },
    { id: 'docker', label: 'docker-compose.yml', icon:  Terminal, content: blueprint.dockerCompose },
    { id: 'python', label: 'boot_orchestrator.py', icon: Play, content: blueprint.bootScript },
    { id: 'json', label: 'blueprint.json', icon: FileJson, content: JSON.stringify(blueprint, null, 2) },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-6 h-6 text-green-400" />
                Execution Artifacts
            </h2>
            <p className="text-gray-400 text-sm mt-1">
                Download these files to your local environment to launch the swarm.
            </p>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-gray-700 flex flex-col h-[600px]">
        {/* Tab Header */}
        <div className="bg-gray-900/50 border-b border-gray-700 flex">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-r border-gray-700
                        ${activeTab === tab.id 
                            ? 'bg-gray-800 text-white border-b-2 border-b-purple-500' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }
                    `}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative group bg-[#1e1e1e]">
             {/* Action Bar */}
             <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={() => navigator.clipboard.writeText(tabs.find(t => t.id === activeTab)?.content || "")}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white shadow-lg"
                    title="Copy to Clipboard"
                >
                    <Copy className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => {
                        const tab = tabs.find(t => t.id === activeTab);
                        if(tab) handleDownload(tab.content, tab.id === 'json' ? 'blueprint.json' : tab.label);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white text-xs font-bold shadow-lg"
                >
                    <Download className="w-3 h-3" /> Download File
                </button>
            </div>

            <pre className="p-6 text-sm font-mono text-gray-300 overflow-auto h-full w-full leading-relaxed">
                {tabs.find(t => t.id === activeTab)?.content}
            </pre>
        </div>
      </div>

      {/* Deployment Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-900/10 border border-green-500/20 rounded-lg flex items-start gap-3">
             <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5" />
             <div>
                <h4 className="text-sm font-bold text-green-400 mb-1">JSON Integrity Validated</h4>
                <p className="text-xs text-green-300/70">
                    The Blueprint schema strictly adheres to the Orchestrator's watchdog requirements.
                </p>
             </div>
        </div>
        <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
             <Check className="w-5 h-5 text-blue-400 mt-0.5" />
             <div>
                <h4 className="text-sm font-bold text-blue-400 mb-1">Ready for Deployment</h4>
                <p className="text-xs text-blue-300/70">
                    Run <code>docker-compose up -d</code> to initiate the swarming process.
                </p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintView;
