
import React from 'react';
import { OrchestratorConfig } from '../types';
import { Server, Activity, Database, RefreshCw, Cpu, GitBranch, ShieldAlert } from 'lucide-react';

interface Props {
  config: OrchestratorConfig;
}

const SystemArchitecture: React.FC<Props> = ({ config }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-6 h-6 text-blue-400" />
                {config.systemName}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
                Autonomous Production Operating System
            </p>
        </div>
        <div className="px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded text-xs font-mono text-blue-300">
            {config.architecture}
        </div>
      </div>

      {/* The Context Loop Visualization */}
      <div className="glass-panel p-8 rounded-xl border border-gray-700 relative overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-green-400" />
            Autonomous Context Migration Loop
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            {/* Step 1: Monitor */}
            <div className="flex-1 p-4 bg-gray-900/80 rounded-lg border border-gray-600 text-center w-full">
                <div className="flex justify-center mb-3">
                    <Activity className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">1. Monitoring</h4>
                <p className="text-xs text-gray-400 font-mono">
                    Check: {config.contextPolicy.monitorFrequency}
                </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center text-gray-600">
                <div className="h-0.5 w-8 bg-gray-600"></div>
                <div className="w-2 h-2 border-t-2 border-r-2 border-gray-600 rotate-45"></div>
            </div>

            {/* Step 2: Signal */}
            <div className="flex-1 p-4 bg-gray-900/80 rounded-lg border border-orange-500/50 text-center w-full relative">
                <div className="absolute -top-3 -right-3 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    40%
                </div>
                <div className="flex justify-center mb-3">
                    <Server className="w-8 h-8 text-orange-400" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">2. Threshold Signal</h4>
                <p className="text-xs text-gray-400 font-mono">
                    Protocol: {config.contextPolicy.signalProtocol}
                </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center text-gray-600">
                <div className="h-0.5 w-8 bg-gray-600"></div>
                <div className="w-2 h-2 border-t-2 border-r-2 border-gray-600 rotate-45"></div>
            </div>

            {/* Step 3: Crystal */}
            <div className="flex-1 p-4 bg-gray-900/80 rounded-lg border border-purple-500/50 text-center w-full">
                <div className="flex justify-center mb-3">
                    <Database className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">3. Crystal Saved</h4>
                <p className="text-xs text-gray-400 font-mono line-clamp-1">
                    Schema: {config.contextPolicy.crystalSchema}
                </p>
            </div>

            {/* Arrow */}
             <div className="hidden md:flex items-center text-gray-600">
                <div className="h-0.5 w-8 bg-gray-600"></div>
                <div className="w-2 h-2 border-t-2 border-r-2 border-gray-600 rotate-45"></div>
            </div>

             {/* Step 4: Respawn */}
             <div className="flex-1 p-4 bg-gray-900/80 rounded-lg border border-green-500/50 text-center w-full">
                <div className="flex justify-center mb-3">
                    <GitBranch className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">4. Respawn</h4>
                <p className="text-xs text-gray-400 font-mono line-clamp-2">
                    {config.contextPolicy.restorationProcess}
                </p>
            </div>
        </div>

        {/* Background Visuals */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/10 via-purple-500/20 to-green-500/10 -z-0"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-gray-700">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Storage Mounts</h4>
            <div className="space-y-2">
                {config.storageMounts.map((mount, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-900 rounded border border-gray-800 font-mono text-xs text-gray-300">
                        <HardDriveIcon />
                        {mount}
                    </div>
                ))}
            </div>
        </div>
         <div className="glass-panel p-6 rounded-xl border border-red-900/30 bg-red-900/5">
            <h4 className="text-sm font-bold text-red-400 uppercase mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Watchdog & Monitoring
            </h4>
            <div className="text-xs text-gray-400 space-y-3 font-mono leading-relaxed">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span>Health Check Port:</span>
                    <span className="text-white">{config.healthCheckPort}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span>Error Strategy:</span>
                    <span className="text-red-300 text-right max-w-[200px]">{config.contextPolicy.errorHandling}</span>
                </div>
                <div className="p-2 bg-black/40 rounded border border-gray-800 text-gray-500 italic">
                    "Validating JSON schema integrity before agent instantiation..."
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const HardDriveIcon = () => (
    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
)

export default SystemArchitecture;
