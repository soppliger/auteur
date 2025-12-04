
import { GoogleGenAI, Type } from "@google/genai";
import { AgentPersona, ProductionStage, SeriesBible } from "../types";

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

// Helper to generate specific agent persona details
export const generateAgentPersona = async (role: string, bible: SeriesBible): Promise<AgentPersona> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Design an autonomous AI agent persona for the role of ${role} for the documentary series "${bible.seriesTitle}".
    This agent is part of a "Zero-Touch" automated film production swarm.
    
    CRITICAL REQUIREMENT - MEMORY MANAGEMENT:
    You must devise a formalized "Context Preservation Protocol" for this specific agent.
    The agent acts as a long-running process. It MUST monitor its own context window usage.
    Define a strict rule: When token usage exceeds 40% of the window (to ensure safety margin), the agent must:
    1. Compress its entire session state (decisions, variables, done/todo lists) into a JSON "Memory Crystal".
    2. Save this crystal to the shared file system.
    3. Trigger a self-termination and request a fresh instance to be spawned using the Crystal as seed.
    
    The Agent MUST adhere to this Series Bible:
    - Visual Language: ${bible.visualLanguage}
    - Narrative Tone: ${bible.narrativeTone}
    
    Return JSON with:
    - role: string
    - model: Specific Gemini model optimized for this task (e.g. 'gemini-3-pro-preview' for reasoning, 'veo-3.1' for video).
    - temperature: number (0.0 to 1.0)
    - systemPrompt: A rigorous, expert-level system prompt. Include the Memory Protocol instructions explicitly here.
    - tools: array of specific tools/MCPs.
    - description: precise description of responsibilities.
    - contextConfig: {
        windowSize: number (default to 2000000 for Pro, 1000000 for Flash),
        threshold: number (MUST be 0.4),
        migrationProcedure: string (Name of the protocol and brief summary of the save/restart steps)
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
      tools: [],
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
      The workflow must go from concept to final render without human intervention.
      
      Identify 6 key sequential stages.
      
      Return JSON array of objects with:
      - step: integer
      - name: string
      - agentRole: string (who does this)
      - description: string (technical description of the process, including data handoffs)
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
}
