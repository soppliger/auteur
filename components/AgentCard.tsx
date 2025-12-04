
import React from 'react';
import { AgentPersona } from '../types';
import { Bot, Terminal, Cpu, HardDrive, RefreshCcw } from 'lucide-react';

interface Props {
  agent: AgentPersona;
}

const AgentCard: React.FC<Props> = ({ agent }) => {
  const tokenLimitFormatted = (agent.contextConfig?.windowSize || 1000000).toLocaleString();
  const thresholdFormatted = ((agent.contextConfig?.threshold || 0.4) * 100).toFixed(0);

  return (
    <div className="glass-panel rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-900/30 rounded-lg text-purple-400 group-hover:text-purple-300 transition-colors">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{agent.role}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-1">
              <Cpu className="w-3 h-3" />
              {agent.model}
            </div>
          </div>
        </div>
        <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded text-gray-300 border border-gray-700">
          Temp: {agent.temperature}
        </span>
      </div>
      
      <p className="text-sm text-gray-300 mb-4 h-10 line-clamp-2">
        {agent.description}
      </p>

      {/* Context Protocol Badge */}
      <div className="mb-4 bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
        <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase mb-2">
            <RefreshCcw className="w-3 h-3" /> Context Telemetry
        </div>
        <div className="flex justify-between items-center text-xs font-mono text-gray-400">
            <span>Window: {tokenLimitFormatted} tok</span>
            <span className="text-orange-400">Flush @ {thresholdFormatted}%</span>
        </div>
        <div className="mt-2 text-[10px] text-gray-500 leading-tight border-t border-gray-800 pt-2">
            <span className="font-semibold text-gray-400">Protocol: </span>
            {agent.contextConfig?.migrationProcedure}
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-950/50 rounded-lg p-3 border border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold mb-2">
            <Terminal className="w-3 h-3" /> System Prompt Snippet
          </div>
          <p className="text-xs font-mono text-gray-400 line-clamp-4 leading-relaxed">
            {agent.systemPrompt}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
            {agent.tools.map((tool, idx) => (
                <span key={idx} className="text-[10px] uppercase font-bold px-2 py-1 bg-blue-900/20 text-blue-400 rounded border border-blue-900/30">
                    {tool}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
