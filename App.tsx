
import React, { useState } from 'react';
import { ViewState, AgentPersona, CostItem, MasterBlueprint, SeriesBible, OrchestratorConfig, LogEntry } from './types';
import { generateAgentPersona, generateWorkflow, generateSeriesBible, generateOrchestratorConfig, generateExecutionArtifacts } from './services/geminiService';
import AgentCard from './components/AgentCard';
import CostBreakdown from './components/CostBreakdown';
import BlueprintView from './components/BlueprintView';
import WorkflowTimeline from './components/WorkflowTimeline';
import SystemArchitecture from './components/SystemArchitecture';
import GenerationProgress from './components/GenerationProgress';
import { Clapperboard, Users, Wallet, FileJson, Sparkles, Film, ArrowRight, Loader2, BookOpen, Cpu, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.SETUP);
  const [generationLogs, setGenerationLogs] = useState<LogEntry[]>([]);
  const [currentAction, setCurrentAction] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Data State
  const [topic, setTopic] = useState("Jupiter: The Storm Giant");
  const [style, setStyle] = useState("Hyper-realistic CGI mixed with AI Narrators");
  const [blueprint, setBlueprint] = useState<MasterBlueprint | null>(null);

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      setGenerationLogs(prev => [...prev, { timestamp: new Date(), message, type }]);
  };

  const handleGenerate = async () => {
    setView(ViewState.GENERATING);
    setError(null);
    setGenerationLogs([]);
    
    try {
        // 1. Generate Series Bible
        setCurrentAction("Synthesizing Narrative DNA...");
        addLog("Initializing secure connection to Gemini API...");
        addLog(`Requesting Series Bible for topic: "${topic}"...`);
        
        const bible: SeriesBible = await generateSeriesBible(topic, style);
        addLog(`Series Bible Established: "${bible.seriesTitle}"`, 'success');
        addLog(`Visual Language: ${bible.visualLanguage}`, 'info');

        // 2. Generate Orchestrator OS
        setCurrentAction("Booting Auteur-OS Kernel...");
        addLog("Designing Orchestrator Architecture and Memory Crystal Protocols...");
        const orchestrator: OrchestratorConfig = await generateOrchestratorConfig();
        addLog(`Orchestrator Configured: ${orchestrator.systemName} (${orchestrator.architecture})`, 'success');

        // 3. Generate Agents
        setCurrentAction("Recruiting Modular AI Crew...");
        addLog("Provisioning autonomous agent containers...");
        const roles = ["Director/Showrunner", "Lead Screenwriter", "Cinematographer (Veo)", "Sound & Narrator Designer", "Editor (FFmpeg)"];
        const agents: AgentPersona[] = [];
        
        for (const role of roles) {
            setCurrentAction(`Configuring Agent: ${role}...`);
            addLog(`Generating Persona & System Prompts for: ${role}...`);
            const agent = await generateAgentPersona(role, bible);
            agents.push(agent);
            addLog(`Agent Provisioned: ${agent.role} [${agent.model}]`, 'success');
        }

        // 4. Generate Workflow
        setCurrentAction("Designing Production Pipeline...");
        addLog("Mapping sequential production stages...");
        const workflow = await generateWorkflow(bible);
        addLog(`Pipeline Mapped: ${workflow.length} unique production stages`, 'success');

        // 5. Generate Execution Code (Docker/Python)
        setCurrentAction("Compiling Execution Artifacts...");
        addLog("Generating docker-compose.yml manifest...");
        addLog("Writing python bootloader scripts...");
        const artifacts = await generateExecutionArtifacts(orchestrator, agents);
        addLog("Execution Artifacts Compiled Successfully", 'success');

        // 6. Calculate Cost
        setCurrentAction("Optimizing Cost Schedule...");
        addLog("Calculating token budget and rendering costs...");
        
        const runtimeMinutes = 90;
        const estScenes = 60; 
        const avgShotLengthSec = 4;
        const costPerVeoSec = 0.08; 
        const costPer1kTokensPro = 0.0000025; 
        const costPer1kTokensFlash = 0.0000001; 
        
        const scriptTokens = 100000;
        const reasoningTokens = 500000; 
        const imageGenCount = estScenes * 3; 

        const budget: CostItem[] = [
            { 
                category: "Pre-Production", 
                description: "Gemini 3 Pro (Scripting & Research)", 
                unitCost: costPer1kTokensPro, 
                quantity: scriptTokens + reasoningTokens, 
                total: (scriptTokens + reasoningTokens) * costPer1kTokensPro 
            },
            { 
                category: "Orchestration", 
                description: "Gemini 2.5 Flash (Agent Coordination)", 
                unitCost: costPer1kTokensFlash, 
                quantity: 2000000, 
                total: 2000000 * costPer1kTokensFlash 
            },
            { 
                category: "Visuals", 
                description: "Veo 3.1 (Video Generation - 75% Coverage)", 
                unitCost: costPerVeoSec, 
                quantity: (runtimeMinutes * 60) * 0.75, 
                total: ((runtimeMinutes * 60) * 0.75) * costPerVeoSec 
            },
            { 
                category: "Visuals", 
                description: "Imagen 4 (Static Plates/Storyboards)", 
                unitCost: 0.04, 
                quantity: imageGenCount, 
                total: imageGenCount * 0.04 
            },
            { 
                category: "Audio", 
                description: "Neural TTS & SFX Generation", 
                unitCost: 0.002, 
                quantity: runtimeMinutes, 
                total: runtimeMinutes * 0.002 
            },
            { 
                category: "Infrastructure", 
                description: "Cloud Rendering/Storage (Fixed Est)", 
                unitCost: 5.00, 
                quantity: 1, 
                total: 5.00 
            },
        ];

        const masterPlan: MasterBlueprint = {
            title: bible.seriesTitle || topic,
            logline: `A ${bible.narrativeTone.toLowerCase()} exploration of ${topic}, visualized through ${bible.visualLanguage}.`,
            style: style,
            runtime: runtimeMinutes,
            seriesBible: bible,
            agents,
            workflow,
            budget,
            orchestrator,
            dockerCompose: artifacts.dockerCompose,
            bootScript: artifacts.bootScript,
            readme: artifacts.readme
        };

        setBlueprint(masterPlan);
        addLog("Initialization Complete. Launching Dashboard...", 'success');
        
        // Small delay so user can see "Complete"
        setTimeout(() => {
             setView(ViewState.JSON); 
        }, 1500);

    } catch (e: any) {
        console.error("Generation pipeline failed:", e);
        setError(e.message || "An unexpected error occurred during the generation process.");
        addLog(`FATAL ERROR: ${e.message}`, 'error');
        // Stay on GENERATING view but show error state (or allow user to go back)
        // For now, let's just let the log show the error.
        setTimeout(() => {
            setView(ViewState.SETUP); // Return to setup to retry
        }, 4000);
    }
  };

  const NavButton = ({ target, icon: Icon, label }: { target: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setView(target)}
      disabled={(!blueprint && target !== ViewState.SETUP) || view === ViewState.GENERATING}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all
        ${view === target 
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }
        ${(!blueprint && target !== ViewState.SETUP) || view === ViewState.GENERATING ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#030712] text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#030712] to-[#030712]">
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-lg">
                <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold font-['Space_Grotesk'] tracking-tight">
              Auteur<span className="text-purple-500">AI</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <NavButton target={ViewState.SETUP} icon={Sparkles} label="Setup" />
            <NavButton target={ViewState.SYSTEM} icon={Cpu} label="System" />
            <NavButton target={ViewState.AGENTS} icon={Users} label="Agents" />
            <NavButton target={ViewState.WORKFLOW} icon={Film} label="Workflow" />
            <NavButton target={ViewState.COST} icon={Wallet} label="Budget" />
            <NavButton target={ViewState.JSON} icon={FileJson} label="Execution" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* SETUP VIEW */}
        {view === ViewState.SETUP && (
          <div className="max-w-3xl mx-auto text-center space-y-12 animate-fadeIn">
            <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                Automated Cinema.
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Define your vision. Our swarm of Gemini agents will architect a complete documentary production plan, from script to screen.
                </p>
            </div>

            {error && (
                <div className="max-w-3xl mx-auto bg-red-900/20 border border-red-500/50 p-6 rounded-xl flex items-start gap-4 text-left shadow-lg shadow-red-900/20">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-red-400 mb-1 text-lg">Configuration Error</h4>
                        <p className="text-sm text-red-200/80 leading-relaxed font-mono break-words">{error}</p>
                    </div>
                </div>
            )}

            <div className="glass-panel p-8 rounded-2xl border border-purple-500/20 shadow-2xl shadow-purple-900/20 text-left space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Project Title & Subject</label>
                    <input 
                        id="projectTopic"
                        name="projectTopic"
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        autoComplete="off"
                        data-lpignore="true"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Visual & Narrative Style</label>
                    <input 
                        id="projectStyle"
                        name="projectStyle"
                        type="text" 
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        autoComplete="off"
                        data-lpignore="true"
                    />
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleGenerate}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all
                            bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-purple-500/25
                        `}
                    >
                        <Sparkles className="w-5 h-5" />
                        Initialize Autonomous Studio
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4">
                        Requires <code>VITE_API_KEY</code> in environment variables.
                    </p>
                </div>
            </div>
          </div>
        )}

        {/* GENERATING VIEW */}
        {view === ViewState.GENERATING && (
            <GenerationProgress logs={generationLogs} currentStep={currentAction} />
        )}

        {/* SYSTEM VIEW */}
        {view === ViewState.SYSTEM && blueprint && (
            <SystemArchitecture config={blueprint.orchestrator} />
        )}

        {/* AGENTS VIEW */}
        {view === ViewState.AGENTS && blueprint && (
          <div className="animate-fadeIn">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold font-['Space_Grotesk']">Production Crew</h2>
                    <p className="text-gray-400 mt-2">The specific AI persona prompts generated for your film.</p>
                </div>
                
                {/* Series Bible Badge */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <div className="text-xs">
                        <span className="block text-gray-500 uppercase font-bold">Series Style</span>
                        <span className="text-white font-mono">{blueprint.seriesBible.seriesTitle}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blueprint.agents.map((agent, idx) => (
                    <AgentCard key={idx} agent={agent} />
                ))}
            </div>
            <div className="flex justify-end mt-8">
                <button onClick={() => setView(ViewState.WORKFLOW)} className="flex items-center gap-2 text-purple-400 hover:text-white transition-colors">
                    View Workflow <ArrowRight className="w-4 h-4" />
                </button>
            </div>
          </div>
        )}

        {/* WORKFLOW VIEW */}
        {view === ViewState.WORKFLOW && blueprint && (
          <div className="animate-fadeIn">
             <div className="mb-8">
                <h2 className="text-3xl font-bold font-['Space_Grotesk']">Automation Pipeline</h2>
                <p className="text-gray-400 mt-2">The sequential execution steps for the Orchestrator.</p>
            </div>
            <WorkflowTimeline stages={blueprint.workflow} />
             <div className="flex justify-end mt-8">
                <button onClick={() => setView(ViewState.COST)} className="flex items-center gap-2 text-purple-400 hover:text-white transition-colors">
                    View Budget <ArrowRight className="w-4 h-4" />
                </button>
            </div>
          </div>
        )}

         {/* COST VIEW */}
         {view === ViewState.COST && blueprint && (
          <div className="animate-fadeIn">
             <div className="mb-8">
                <h2 className="text-3xl font-bold font-['Space_Grotesk']">Cost Schedule</h2>
                <p className="text-gray-400 mt-2">Estimated detailed budget for feature-length automated production.</p>
            </div>
            <CostBreakdown costs={blueprint.budget} />
             <div className="flex justify-end mt-8">
                <button onClick={() => setView(ViewState.JSON)} className="flex items-center gap-2 text-purple-400 hover:text-white transition-colors">
                    View Blueprint <ArrowRight className="w-4 h-4" />
                </button>
            </div>
          </div>
        )}

        {/* BLUEPRINT / EXECUTION VIEW */}
        {view === ViewState.JSON && blueprint && (
            <BlueprintView blueprint={blueprint} />
        )}

      </main>
    </div>
  );
};

export default App;
