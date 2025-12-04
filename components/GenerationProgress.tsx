
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, CheckCircle2, Loader2, Cpu, Database, Server, Film, ShieldCheck } from 'lucide-react';

interface Props {
  logs: LogEntry[];
  currentStep: string;
}

const GenerationProgress: React.FC<Props> = ({ logs, currentStep }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Determine progress roughly by log count or specific milestones
  // This is a visual approximation
  const progress = Math.min((logs.length / 12) * 100, 95); 

  const milestones = [
    { label: "Series DNA", icon: Database, active: logs.some(l => l.message.includes("Bible")) },
    { label: "Auteur-OS", icon: Server, active: logs.some(l => l.message.includes("Orchestrator")) },
    { label: "AI Crew", icon: Cpu, active: logs.some(l => l.message.includes("Agent")) },
    { label: "Pipeline", icon: Film, active: logs.some(l => l.message.includes("Workflow")) },
    { label: "Artifacts", icon: ShieldCheck, active: logs.some(l => l.message.includes("Artifacts")) },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-12">
      <div className="text-center space-y-4">
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full text-purple-300 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-mono font-bold tracking-wider">SYSTEM INITIALIZATION SEQUENCE</span>
         </div>
         <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-white">
            Constructing Autonomous Studio
         </h2>
         <p className="text-gray-400 max-w-xl mx-auto">
            Allocating neural resources, provisioning agent containers, and crystallizing production blueprints.
         </p>
      </div>

      {/* Progress Milestones */}
      <div className="flex justify-between items-center px-4 md:px-12 relative">
         <div className="absolute left-12 right-12 top-1/2 h-0.5 bg-gray-800 -z-10"></div>
         {milestones.map((m, idx) => (
             <div key={idx} className="flex flex-col items-center gap-2 bg-[#030712] p-2">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${m.active 
                        ? 'bg-purple-900/50 border-purple-500 text-purple-400 shadow-lg shadow-purple-900/50' 
                        : 'bg-gray-900 border-gray-800 text-gray-600'
                    }
                 `}>
                     {m.active ? <CheckCircle2 className="w-5 h-5" /> : <m.icon className="w-5 h-5" />}
                 </div>
                 <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300
                    ${m.active ? 'text-purple-400' : 'text-gray-600'}
                 `}>
                     {m.label}
                 </span>
             </div>
         ))}
      </div>

      {/* Terminal View */}
      <div className="glass-panel rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
        <div className="bg-gray-900/80 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-mono text-gray-400">root@auteur-ai:~/setup# tail -f initialization.log</span>
        </div>
        <div 
            ref={scrollRef}
            className="h-[400px] overflow-y-auto p-6 font-mono text-sm space-y-2 bg-[#0d1117]"
        >
            {logs.map((log, idx) => (
                <div key={idx} className={`flex gap-3 items-start animate-slideInLeft
                    ${log.type === 'error' ? 'text-red-400' : 
                      log.type === 'success' ? 'text-green-400' : 
                      log.type === 'warning' ? 'text-orange-400' : 'text-gray-300'}
                `}>
                    <span className="text-gray-600 flex-shrink-0">
                        [{log.timestamp.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]
                    </span>
                    <span className="break-words leading-relaxed">
                        {log.type === 'info' && <span className="text-blue-500 mr-2">ℹ</span>}
                        {log.type === 'success' && <span className="text-green-500 mr-2">✔</span>}
                        {log.type === 'warning' && <span className="text-orange-500 mr-2">⚠</span>}
                        {log.message}
                    </span>
                </div>
            ))}
            
            <div className="flex gap-2 items-center text-purple-400 animate-pulse mt-4">
                <span className="text-gray-600">
                    [{new Date().toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]
                </span>
                <span>_ {currentStep}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationProgress;
