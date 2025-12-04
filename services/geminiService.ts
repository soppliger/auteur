
import { GoogleGenAI, Type } from "@google/genai";
import { AgentPersona, ProductionStage, SeriesBible, OrchestratorConfig } from "../types";

// Safe environment variable access for client-side execution (Vercel/Vite/CRA)
const getApiKey = (): string => {
  try {
    // Check for process existence to avoid ReferenceError in strict browser environments
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
  } catch (e) {
    console.error("Error accessing environment variables:", e);
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

// Helper for exponential backoff retry
async function generateWithRetry<T>(
    operation: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    try {
        return await operation();
    } catch (error: any) {
        // If it's an API key error, fail immediately (don't retry)
        if (error.message?.includes('API key') || error.status === 401 || error.status === 403) {
            throw error;
        }
        if (retries <= 0) throw error;
        console.warn(`Generation failed, retrying in ${delayMs}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return generateWithRetry(operation, retries - 1, delayMs * 2);
    }
}

export const generateSeriesBible = async (topic: string, style: string): Promise<SeriesBible> => {
    if (!apiKey) throw new Error("API Key is missing. Please ensure 'API_KEY' is set in your Vercel Project Settings.");
    
    const model = 'gemini-2.5-flash';
    const prompt = `
        Create a "Series Bible" for an automated, AI-generated documentary series.
        Topic: ${topic}
        Style: ${style}
        
        The goal is a repeatable, modular system where a Director AI can maintain style across multiple episodes/films.
        Focus on "Hyper-realistic Narrators" combined with "High-End CGI".
        
        Return JSON with:
        - seriesTitle: Creative title for the series
        - visualLanguage: Specific prompts/keywords for Veo/Imagen (e.g., lighting, lens choice, color grading)
        - narrativeTone: Description of the voice/personality of the AI narrators.
        - recurringMotifs: List of 3 visual or audio elements present in every episode.
        - episodicFormat: Structure of a single episode (e.g., Cold Open -> Title -> Act 1...).
    `;

    return generateWithRetry(async () => {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        seriesTitle: { type: Type.STRING },
                        visualLanguage: { type: Type.STRING },
                        narrativeTone: { type: Type.STRING },
                        recurringMotifs: { type: Type.ARRAY, items: { type: Type.STRING } },
                        episodicFormat: { type: Type.STRING }
                    }
                }
            }
        });
        const text = response.text;
        if (!text) throw new Error("No text returned for Series Bible");
        return JSON.parse(text) as SeriesBible;
    });
};

export const generateAgentPersona = async (role: string, bible: SeriesBible): Promise<AgentPersona> => {
  if (!apiKey) throw new Error("API Key is missing. Please ensure 'API_KEY' is set in your Vercel Project Settings.");

  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Design an autonomous AI agent persona for the role of ${role} for the documentary series "${bible.seriesTitle}".
    
    CRITICAL: This agent must be instantiated in a Docker container.
    TOOLS: List REAL, PROVISIONABLE tools only. Use "MCP: [server_name]" for Model Context Protocol servers or "PIP: [package_name]" for Python libs.
    Examples: "MCP: filesystem", "MCP: google-search", "PIP: ffmpeg-python", "PIP: beautifulsoup4".
    
    MEMORY MANAGEMENT:
    Define strict rules for the "Memory Crystal" protocol (saving state at 40% context).
    
    Return JSON with:
    - role: string
    - model: Specific Gemini model (use 'gemini-3-pro-preview' for logic/writing, 'veo-3.1' for video).
    - temperature: number
    - systemPrompt: Expert-level prompt including memory protocol.
    - tools: array of strings (e.g., "MCP: fetch", "PIP: pandas").
    - description: responsibilities.
    - contextConfig: {
        windowSize: number,
        threshold: number (MUST be 0.4),
        migrationProcedure: string
      }
  `;

  return generateWithRetry(async () => {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            model: { type: Type.STRING },
            temperature: { type: Type.NUMBER },
            systemPrompt: { type: Type.STRING },
            tools: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            contextConfig: {
                type: Type.OBJECT,
                properties: {
                    windowSize: { type: Type.INTEGER },
                    threshold: { type: Type.NUMBER },
                    migrationProcedure: { type: Type.STRING }
                }
            }
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error(`No response for Agent: ${role}`);
    return JSON.parse(text) as AgentPersona;
  });
};

export const generateWorkflow = async (bible: SeriesBible): Promise<ProductionStage[]> => {
    if (!apiKey) throw new Error("API Key is missing. Please ensure 'API_KEY' is set in your Vercel Project Settings.");

    const model = 'gemini-2.5-flash';
    const prompt = `
      Outline a strict, step-by-step automated workflow to produce a feature-length documentary based on the Series Bible: "${bible.seriesTitle}".
      Step 1 is always "Orchestrator Validation of Blueprint".
      
      Identify 6 key sequential stages.
      
      Return JSON array of objects with:
      - step: integer
      - name: string
      - agentRole: string
      - description: string
    `;

    return generateWithRetry(async () => {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            step: { type: Type.INTEGER },
                            name: { type: Type.STRING },
                            agentRole: { type: Type.STRING },
                            description: { type: Type.STRING },
                        }
                    }
                }
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("No response for Workflow");
        const stages = JSON.parse(text) as Omit<ProductionStage, 'status'>[];
        return stages.map(s => ({ ...s, status: 'pending' }));
    });
};

export const generateOrchestratorConfig = async (): Promise<OrchestratorConfig> => {
    if (!apiKey) throw new Error("API Key is missing. Please ensure 'API_KEY' is set in your Vercel Project Settings.");

    const model = 'gemini-2.5-flash';
    const prompt = `
        Design the technical specification for the "Orchestrator Engine".
        
        CRITICAL: Include a JSON Watchdog that validates the blueprint schema before execution.
        
        Return JSON with:
        - systemName: string
        - architecture: string
        - healthCheckPort: integer (e.g., 8080)
        - contextPolicy: {
            monitorFrequency: string,
            signalProtocol: string,
            crystalSchema: string,
            restorationProcess: string,
            errorHandling: string (How to handle corrupt JSON or failed agents)
        }
        - storageMounts: array of strings
    `;

    return generateWithRetry(async () => {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        systemName: { type: Type.STRING },
                        architecture: { type: Type.STRING },
                        healthCheckPort: { type: Type.INTEGER },
                        contextPolicy: {
                            type: Type.OBJECT,
                            properties: {
                                monitorFrequency: { type: Type.STRING },
                                signalProtocol: { type: Type.STRING },
                                crystalSchema: { type: Type.STRING },
                                restorationProcess: { type: Type.STRING },
                                errorHandling: { type: Type.STRING }
                            }
                        },
                        storageMounts: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        const text = response.text;
        if (!text) throw new Error("No response for Orchestrator Config");
        return JSON.parse(text) as OrchestratorConfig;
    });
};

export const generateExecutionArtifacts = async (orchestrator: OrchestratorConfig, agents: AgentPersona[]): Promise<{dockerCompose: string, bootScript: string, readme: string}> => {
    if (!apiKey) throw new Error("API Key is missing. Please ensure 'API_KEY' is set in your Vercel Project Settings.");

    const model = 'gemini-2.5-flash';
    const prompt = `
        Create the ACTUAL execution code for this autonomous movie studio.
        
        System: ${orchestrator.systemName}
        Agents: ${agents.length} agents (${agents.map(a => a.role).join(', ')})
        
        Requirement 1: docker-compose.yml
        - Define services for each agent + the orchestrator.
        - Mount the './blueprint.json' to the orchestrator.
        - Ensure networking.
        
        Requirement 2: boot_orchestrator.py
        - Python script to be the entrypoint for the Orchestrator service.
        - MUST include a function 'validate_blueprint(json_data)' that checks if 'agents' list exists.
        - Start an infinite loop monitoring agent health on port ${orchestrator.healthCheckPort}.
        
        Requirement 3: README.md
        - Step-by-step instructions on how to run 'docker-compose up'.
        
        Return JSON with keys: dockerCompose, bootScript, readme.
    `;
    
    return generateWithRetry(async () => {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        dockerCompose: { type: Type.STRING },
                        bootScript: { type: Type.STRING },
                        readme: { type: Type.STRING }
                    }
                }
            }
        });
        const text = response.text;
        if (!text) throw new Error("No response for Execution Artifacts");
        return JSON.parse(text);
    });
}
