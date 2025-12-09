
import { GoogleGenAI, Type } from "@google/genai";
import { AgentPersona, ProductionStage, SeriesBible, OrchestratorConfig, ContextConfig } from "../types";

// Safe environment variable access for client-side execution (Vercel/Vite/CRA)
const getApiKey = (): string => {
  let key = '';
  
  try {
    // 1. Check standard Node/CRA process.env
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      key = process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error
  }

  if (!key) {
    try {
        // 2. Check Vite standard import.meta.env (Needs VITE_ prefix usually)
        // @ts-ignore
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            // @ts-ignore
            key = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY || '';
        }
    } catch (e) {
        // Ignore error
    }
  }

  return key;
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey: apiKey || 'fallback_to_force_error_if_empty' }); // Don't crash init, crash call

// --- STATIC PLATFORM LOGIC ---
// As per requirements, System Architecture and Context Protocols are now 
// built-in platform logic, not generated AI content.

const STATIC_CONTEXT_CONFIG: ContextConfig = {
    windowSize: 2000000,
    threshold: 0.4,
    migrationProcedure: "Standard Auteur-OS 'Memory Crystal' Protocol (Lempel-Ziv-Welch Compression + Vector Embedding)"
};

const STATIC_ORCHESTRATOR_CONFIG: OrchestratorConfig = {
    systemName: "Auteur-OS Core v3.1",
    architecture: "Event-Driven Microservices Swarm (Docker/K8s)",
    healthCheckPort: 8080,
    contextPolicy: {
        monitorFrequency: "Continuous (100ms Polling)",
        signalProtocol: "SIG_CTX_SATURATION (Signal 30)",
        crystalSchema: "Auteur_Memory_Crystal_v2.schema.json",
        restorationProcess: "Container Rehydration from Vector Store",
        errorHandling: "Automatic Circuit Breaking & Last-Good-State Rollback"
    },
    storageMounts: [
        "/var/lib/auteur/crystals",
        "/var/lib/auteur/logs",
        "/var/lib/auteur/output"
    ]
};

// -----------------------------

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
        // Check for 400 (Bad Request - typically Invalid Key) or 401/403
        if (error.toString().includes('API key') || error.status === 400 || error.status === 401 || error.status === 403) {
            throw error;
        }
        // Specific check for JSON syntax errors (often caused by truncation or markdown)
        if (error instanceof SyntaxError) {
             console.warn("JSON Parse Error caught, retrying...", error);
        } else if (retries <= 0) {
            throw error;
        }

        if (retries <= 0) throw error;
        console.warn(`Generation failed, retrying in ${delayMs}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return generateWithRetry(operation, retries - 1, delayMs * 2);
    }
}

// Validation Helper
const validateKeyOrThrow = () => {
    if (!apiKey) {
        throw new Error(
            "API Key is missing. On Vercel, you MUST name your environment variable 'VITE_API_KEY' (with the prefix) for it to be accessible in the browser. Please update your Project Settings and Redeploy."
        );
    }
};

const safeJsonParse = (text: string) => {
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanText);
};

export const generateSeriesBible = async (topic: string, style: string): Promise<SeriesBible> => {
    validateKeyOrThrow();
    
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
        return safeJsonParse(text) as SeriesBible;
    });
};

export const generateAgentPersona = async (role: string, bible: SeriesBible): Promise<AgentPersona> => {
  validateKeyOrThrow();

  const model = 'gemini-2.5-flash';
  
  // NOTE: We do NOT ask the AI to generate Context Config anymore.
  // It is injected from the static platform logic below.
  const prompt = `
    Design an autonomous AI agent persona for the role of ${role} for the documentary series "${bible.seriesTitle}".
    
    CRITICAL: This agent must be instantiated in a Docker container.
    TOOLS: List REAL, PROVISIONABLE tools only. Use "MCP: [server_name]" for Model Context Protocol servers or "PIP: [package_name]" for Python libs.
    Examples: "MCP: filesystem", "MCP: google-search", "PIP: ffmpeg-python", "PIP: beautifulsoup4".
    
    Return JSON with:
    - role: string
    - model: Specific Gemini model (use 'gemini-3-pro-preview' for logic/writing, 'veo-3.1' for video).
    - temperature: number
    - systemPrompt: Expert-level prompt outlining their specific duties.
    - tools: array of strings.
    - description: Short description of responsibilities.
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
            // contextConfig removed from schema, injected manually
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error(`No response for Agent: ${role}`);
    
    const partialAgent = safeJsonParse(text);
    
    // Inject Platform Logic
    return {
        ...partialAgent,
        contextConfig: STATIC_CONTEXT_CONFIG
    } as AgentPersona;
  });
};

export const generateWorkflow = async (bible: SeriesBible): Promise<ProductionStage[]> => {
    validateKeyOrThrow();

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
        const stages = safeJsonParse(text) as Omit<ProductionStage, 'status'>[];
        return stages.map(s => ({ ...s, status: 'pending' }));
    });
};

export const generateOrchestratorConfig = async (): Promise<OrchestratorConfig> => {
    // Platform Logic: The Orchestrator architecture is now static and robust.
    // No API call required, removing the "booting" delay.
    // We wrap in a short timeout just to allow the UI to show the step briefly.
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(STATIC_ORCHESTRATOR_CONFIG);
        }, 800); 
    });
};

export const generateExecutionArtifacts = async (orchestrator: OrchestratorConfig, agents: AgentPersona[]): Promise<{dockerCompose: string, bootScript: string, readme: string}> => {
    validateKeyOrThrow();

    const model = 'gemini-2.5-flash';
    // Optimized prompt to keep output concise and avoid token limits
    const prompt = `
        Create the ACTUAL execution code for this autonomous movie studio.
        
        System: ${orchestrator.systemName}
        Agents: ${agents.length} agents
        
        Requirement 1: docker-compose.yml
        - Define services for each agent + orchestrator.
        - Mount './blueprint.json' to orchestrator.
        - Use "image: python:3.9-slim" for simplicity.
        
        Requirement 2: boot_orchestrator.py
        - Python script entrypoint.
        - Function 'validate_blueprint(json_data)' checking 'agents' list.
        - Infinite loop on port ${orchestrator.healthCheckPort}.
        
        Requirement 3: README.md
        - VERY CONCISE instructions (max 10 lines) on how to run 'docker-compose up'.
        
        Return JSON with keys: dockerCompose, bootScript, readme.
        IMPORTANT: Escape all newlines in the JSON strings.
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
        return safeJsonParse(text);
    });
}
