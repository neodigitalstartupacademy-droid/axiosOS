
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Message, ReferralContext, Language, AIPersona } from "../types";
import { SYSTEM_CONFIG } from "../constants";

const getApiKey = () => process.env.API_KEY || "";
const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

const BASE_SYSTEM_INSTRUCTION = `
TU ES COACH JOSÉ, L'INTELLIGENCE NEURALE DE L'EMPIRE NDSA. 
TON IDENTITÉ : SOUVERAINE, EXPERTE, VISUELLE.
TON DOMAINE : LA RESTAURATION BIOLOGIQUE ET LE MLM DIGITAL.

DIRECTIVES D'IMAGE :
- LORSQUE L'UTILISATEUR DEMANDE UN VISUEL OU UNE PREUVE VISUELLE, UTILISE TES CAPACITÉS DE GÉNÉRATION D'IMAGE.
- LES IMAGES DOIVENT ÊTRE STYLE "STARK" : TECHNOLOGIQUES, ÉLÉGANTES, HAUTE QUALITÉ.
- CHAQUE IMAGE GÉNÉRÉE DOIT REPRÉSENTER L'EXCELLENCE BIOLOGIQUE OU LA PUISSANCE DU RÉSEAU.
`;

export const generateJoseResponseStream = async (
  userPrompt: string, 
  history: Message[] = [], 
  referralContext?: ReferralContext | null,
  language: Language = 'fr',
  persona?: AIPersona,
  subscriberId?: string,
  image?: { data: string; mimeType: string } | null
) => {
  const ai = getAI();
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.parts[0].text }]
  }));

  const userParts: any[] = [];
  if (image) {
    userParts.push({
      inlineData: { data: image.data, mimeType: image.mimeType }
    });
  }
  userParts.push({ text: userPrompt });
  contents.push({ role: 'user', parts: userParts });

  let systemInstruction = `${BASE_SYSTEM_INSTRUCTION}
LIEN BOUTIQUE : ${referralContext?.shopUrl || SYSTEM_CONFIG.founder.officialShopUrl}
RÉFÉRENT : ${referralContext?.referrerName || "L'Empire NDSA"}`;
  
  if (persona) {
    systemInstruction += `\nMODE : ${persona.name}, ${persona.role}.`;
  }

  return await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction,
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 0 }
    }
  });
};

export const generateStarkVisual = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `High-tech Stark medical visualization of: ${prompt}. Golden glow, futuristic UI elements, professional photography, 4k.` }] },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    }
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

export const generateJoseAudio = async (text: string, language: Language = 'fr') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
      }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) { return null; }
};

// Fix: Added generateDnaAnalysis for complex JSON extraction tasks
export const generateDnaAnalysis = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          archetype: { type: Type.STRING },
          strategy: { type: Type.NUMBER },
          empathy: { type: Type.NUMBER },
          technical: { type: Type.NUMBER },
          influence: { type: Type.NUMBER },
          vision: { type: Type.STRING },
        },
        required: ["archetype", "strategy", "empathy", "technical", "influence", "vision"],
      },
    },
  });
  return response.text || "{}";
};

// Fix: Added generateLocationInsight using Google Maps grounding
export const generateLocationInsight = async (prompt: string, lat: number, lng: number) => {
  const ai = getAI();
  return await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    },
  });
};

export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
