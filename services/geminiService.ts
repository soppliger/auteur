
import { GoogleGenAI, Type } from "@google/genai";
import { AgentPersona, ProductionStage, SeriesBible, OrchestratorConfig, MasterBlueprint } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSeriesBible = async (topic: string, style: string): Promise<SeriesBible> => {
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

    try {
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
        if (!text) throw new Error("No response for Bible");
        return JSON.parse(text) as SeriesBible;
    } catch (error) {
        console.error("Error generating bible", error);
        return {
            seriesTitle: topic,
            visualLanguage: "Cinematic, 8k, Unreal Engine 5 style",
            narrativeTone: "Authoritative and Wondrous",
            recurringMotifs: ["Slow motion planetary flybys", "Data visualization overlays"],
            episodicFormat: "Standard 3-Act Structure"
        };
    }
};

export const generateAgentPersona = async (role: string, bible: SeriesBible): Promise<AgentPersona> => {
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

  try {
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
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as AgentPersona;
  } catch (error) {
    console.error(`Error generating persona for ${role}:`, error);
    return {
      role,
      model: "gemini-2.5-flash",
      temperature: 0.7,
      systemPrompt: "You are an expert " + role,
      tools: ["PIP: standard-lib"],
      description: "Fallback generation.",
      contextConfig: {
          windowSize: 1000000,
          threshold: 0.4,
          migrationProcedure: "Standard 40% Flush: Save state.json, restart."
      }
    };
  }
};

export const generateWorkflow = async (bible: SeriesBible): Promise<ProductionStage[]> => {
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

    try {
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
        if (!text) throw new Error("No response");
        const stages = JSON.parse(text) as Omit<ProductionStage, 'status'>[];
        return stages.map(s => ({ ...s, status: 'pending' }));
    } catch (error) {
        console.error("Error generating workflow", error);
        return [];
    }
};

export const generateOrchestratorConfig = async (): Promise<OrchestratorConfig> => {
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

    try {
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
        if (!text) throw new Error("No response for Orchestrator");
        return JSON.parse(text) as OrchestratorConfig;
    } catch (error) {
        console.error("Error generating orchestrator", error);
        return {
            systemName: "Auteur-OS Kernel",
            architecture: "Docker Swarm",
            healthCheckPort: 8080,
            contextPolicy: {
                monitorFrequency: "10s",
                signalProtocol: "SIG_CTX_40",
                crystalSchema: "Standard",
                restorationProcess: "Hot-swap",
                errorHandling: "Validation failure triggers immediate rollback."
            },
            storageMounts: ["/data/crystals"]
        };
    }
};

export const generateExecutionArtifacts = async (orchestrator: OrchestratorConfig, agents: AgentPersona[]): Promise<{dockerCompose: string, bootScript: string, readme: string}> => {
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
    
    try {
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
        if (!text) throw new Error("No response for artifacts");
        return JSON.parse(text);
    } catch (e) {
        console.error(e);
        return {
            dockerCompose: "# Error generating docker-compose",
            bootScript: "# Error generating boot script",
            readme: "# Error generating readme"
        };
    }
}
