
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
  tools: string[];
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

export interface MasterBlueprint {
  title: string;
  logline: string;
  style: string;
  runtime: number;
  seriesBible: SeriesBible;
  agents: AgentPersona[];
  workflow: ProductionStage[];
  budget: CostItem[];
}

export enum ViewState {
  SETUP = 'SETUP',
  AGENTS = 'AGENTS',
  WORKFLOW = 'WORKFLOW',
  COST = 'COST',
  JSON = 'JSON'
}
