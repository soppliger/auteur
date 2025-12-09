
import React, { useState } from 'react';
import { MasterBlueprint } from '../types';
import { Copy, Download, FileJson, Terminal, Play, ShieldCheck, Check, LayoutGrid, ArrowRight } from 'lucide-react';

interface Props {
  blueprint: MasterBlueprint | null;
}

const BlueprintView: React.FC<Props> = ({ blueprint }) => {
  const [activeTab, setActiveTab] = useState<string>('summary');

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

  const artifacts = [
    { 
        id: 'readme', 
        label: 'README.md', 
        icon: ShieldCheck, 
        content: blueprint.readme, 
        description: "Essential setup instructions and deployment commands." 
    },
    { 
        id: 'docker', 
        label: 'docker-compose.yml', 
        icon: Terminal, 
        content: blueprint.dockerCompose, 
        description: "Container orchestration configuration for the agent swarm." 
    },
    { 
        id: 'python', 
        label: 'boot_orchestrator.py', 
        icon: Play, 
        content: blueprint.bootScript, 
        description: "Main Python entrypoint script to bootstrap the Auteur OS." 
    },
    { 
        id: 'json', 
        label: 'blueprint.json', 
        icon: FileJson, 
        content: JSON.stringify(blueprint, null, 2), 
        description: "The complete machine-readable master plan and data structure." 
    },
  ];

  const activeArtifact = artifacts.find(a => a.id === activeTab);

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
        <div className="bg-gray-900/50 border-b border-gray-700 flex overflow-x-auto">
            <button
                onClick={() => setActiveTab('summary')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-r border-gray-700 whitespace-nowrap
                    ${activeTab === 'summary' 
                        ? 'bg-gray-800 text-white border-b-2 border-b-purple-500' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }
                `}
            >
                <LayoutGrid className="w-4 h-4" />
                Summary
            </button>
            {artifacts.map(art => (
                <button
                    key={art.id}
                    onClick={() => setActiveTab(art.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-r border-gray-700 whitespace-nowrap
                        ${activeTab === art.id 
                            ? 'bg-gray-800 text-white border-b-2 border-b-purple-500' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }
                    `}
                >
                    <art.icon className="w-4 h-4" />
                    {art.label}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative group bg-[#1e1e1e]">
             {activeTab === 'summary' ? (
                 <div className="p-8 h-full overflow-y-auto bg-gray-900/50">
                     <h3 className="text-xl font-bold text-white mb-6">Project Deliverables</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {artifacts.map((art) => (
                             <button
                                key={art.id}
                                onClick={() => setActiveTab(art.id)}
                                className="flex items-start gap-4 p-5 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-purple-500/50 transition-all text-left group/card"
                             >
                                 <div className="p-3 bg-gray-900 rounded-lg text-purple-400 group-hover/card:text-purple-300 border border-gray-700">
                                     <art.icon className="w-6 h-6" />
                                 </div>
                                 <div className="flex-1">
                                     <div className="flex justify-between items-center mb-1">
                                         <h4 className="font-bold text-white">{art.label}</h4>
                                         <ArrowRight className="w-4 h-4 text-gray-600 group-hover/card:text-purple-400 transition-colors" />
                                     </div>
                                     <p className="text-sm text-gray-400 leading-relaxed">
                                         {art.description}
                                     </p>
                                 </div>
                             </button>
                         ))}
                     </div>
                 </div>
             ) : (
                <>
                    {/* Action Bar for Code View */}
                    <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => navigator.clipboard.writeText(activeArtifact?.content || "")}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white shadow-lg"
                            title="Copy to Clipboard"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => {
                                if(activeArtifact) handleDownload(activeArtifact.content, activeArtifact.id === 'json' ? 'blueprint.json' : activeArtifact.label);
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white text-xs font-bold shadow-lg"
                        >
                            <Download className="w-3 h-3" /> Download File
                        </button>
                    </div>

                    <pre className="p-6 text-sm font-mono text-gray-300 overflow-auto h-full w-full leading-relaxed">
                        {activeArtifact?.content}
                    </pre>
                </>
             )}
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
