import React from 'react';
import { ProductionStage } from '../types';
import { CheckCircle2, Circle, ArrowRight, Loader2 } from 'lucide-react';

interface Props {
  stages: ProductionStage[];
}

const WorkflowTimeline: React.FC<Props> = ({ stages }) => {
  return (
    <div className="glass-panel rounded-xl p-6 border border-gray-700 relative">
      <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-gray-800" /> {/* Vertical Line */}
      
      <div className="space-y-8 relative">
        {stages.map((stage, idx) => (
          <div key={idx} className="flex gap-6 group">
            <div className="relative z-10 flex-shrink-0 w-5 h-5 mt-1 rounded-full bg-gray-900 border-2 border-purple-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                  Step {stage.step}
                </span>
                <span className="h-px flex-1 bg-gray-800"></span>
                <span className="text-xs font-mono text-gray-500 px-2 py-0.5 bg-gray-900 rounded border border-gray-800">
                  {stage.agentRole}
                </span>
              </div>
              
              <h4 className="text-lg font-bold text-white mb-2">{stage.name}</h4>
              <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
                {stage.description}
              </p>
            </div>
          </div>
        ))}

        {stages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                No workflow generated yet. Start the setup process.
            </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowTimeline;