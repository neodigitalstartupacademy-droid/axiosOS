
import { GoogleGenAI, Modality } from "@google/genai";
import { Message, ReferralContext, Language, AIPersona } from "../types";
import { SYSTEM_CONFIG } from "../constants";

// Safe API Key access
const getApiKey = () => {
  return (process.env.API_KEY || (window as any).process?.env?.API_KEY || "");
};

const getAI = () => {
  const key = getApiKey();
  if (!key) {
    console.warn("Gemini API Key missing - check environment.");
  }
  return new GoogleGenAI({ apiKey: key });
};

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
      inlineData: {
        data: image.data,
        mimeType: image.mimeType
      }
    });
  }
  userParts.push({ text: userPrompt });

  contents.push({ role: 'user', parts: userParts });

  let systemInstruction = `Tu es Coach José, l'IA de l'Empire NDSA. Ton but est de convertir les prospects vers NeoLife via ${referralContext?.shopUrl || SYSTEM_CONFIG.founder.officialShopUrl}. Suis les 5 phases du protocole Stark.`;
  
  if (persona) {
    systemInstruction = `Tu es ${persona.name}, ${persona.role}. Philosophie: ${persona.philosophy}. Tonalité: ${persona.tonality}. Valeurs: ${persona.coreValues}.`;
  }

  if (subscriberId) {
    systemInstruction += `\nIdentifiant de l'abonné actuel: ${subscriberId}.`;
  }

  return await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction,
      temperature: 0.7
    }
  });
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
  } catch (e) {
    console.error("TTS Generation error:", e);
    return null;
  }
};

export const generateLocationInsight = async (prompt: string, lat: number, lng: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", 
    contents: prompt,
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
    }
  });
  return response;
};

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) { bytes[i] = binaryString.charCodeAt(i); }
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; }
  }
  return buffer;
}
