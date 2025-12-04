
export interface ContextConfig {
  windowSize: number;
  threshold: number;
  migrationProcedure: string;
}

export interface AgentPersona {
  role: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  tools: string[]; // Specific MCP servers or Libraries
  description: string;
  contextConfig: ContextConfig;
}

export interface CostItem {
  category: string;
  description: string;
  unitCost: number;
  quantity: number;
  total: number;
}

export interface ProductionStage {
  step: number;
  name: string;
  agentRole: string;
  description: string;
  status: 'pending' | 'generating' | 'complete';
}

export interface SeriesBible {
    seriesTitle: string;
    visualLanguage: string;
    narrativeTone: string;
    recurringMotifs: string[];
    episodicFormat: string;
}

export interface ContextLifecyclePolicy {
    monitorFrequency: string;
    signalProtocol: string;
    crystalSchema: string;
    restorationProcess: string;
    errorHandling: string; // New: Strategy for invalid JSON/State
}

export interface OrchestratorConfig {
    systemName: string;
    architecture: string;
    healthCheckPort: number; // New: Monitoring port
    contextPolicy: ContextLifecyclePolicy;
    storageMounts: string[];
}

export interface MasterBlueprint {
  title: string;
  logline: string;
  style: string;
  runtime: number;
  seriesBible: SeriesBible;
  agents: AgentPersona[];
  workflow: ProductionStage[];
  budget: CostItem[];
  orchestrator: OrchestratorConfig;
  // Execution Artifacts
  dockerCompose: string;
  bootScript: string; 
  readme: string;
}

export enum ViewState {
  SETUP = 'SETUP',
  AGENTS = 'AGENTS',
  WORKFLOW = 'WORKFLOW',
  COST = 'COST',
  SYSTEM = 'SYSTEM',
  JSON = 'JSON'
}
