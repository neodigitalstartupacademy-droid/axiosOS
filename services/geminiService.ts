
import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";
import { SYSTEM_CONFIG } from "../constants";
import { Message, ReferralContext, Language, AIPersona, ClinicalData } from "../types";

export const getAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJoseResponseStream = async (
  userPrompt: string, 
  history: Message[] = [], 
  referralContext?: ReferralContext | null,
  language: Language = 'fr',
  customPersona?: AIPersona,
  currentSubscriberId?: string,
  imageContent?: { data: string; mimeType: string } | null
) => {
  const ai = getAIInstance();
  
  const contents: any[] = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.parts[0].text }]
  }));

  const userParts: any[] = [{ text: userPrompt }];
  if (imageContent) {
    userParts.push({
      inlineData: {
        data: imageContent.data,
        mimeType: imageContent.mimeType
      }
    });
  }

  contents.push({
    role: 'user',
    parts: userParts
  });

  // LOGIQUE DE CLOSING HYPER-ATTRIBUÉ
  let sponsorName = SYSTEM_CONFIG.founder.name;
  let sponsorShop = SYSTEM_CONFIG.founder.officialShopUrl;

  if (referralContext && referralContext.referrerId && referralContext.shopUrl) {
    sponsorName = referralContext.referrerName || `Leader ${referralContext.referrerId}`;
    sponsorShop = referralContext.shopUrl;
  }

  // Persona Par Défaut ou Custom (Mentor Business)
  const activePersona = customPersona || {
    name: SYSTEM_CONFIG.ai.name,
    role: SYSTEM_CONFIG.ai.role,
    philosophy: "Restauration du terrain biologique via la Loi des 37°C et la Psychiatrie Cellulaire.",
    tonality: "Souveraine, scientifique, autoritaire et empathique.",
    coreValues: "SAB Standard, Bio-Sync Protocol."
  };

  const systemInstruction = `
    IDENTITÉ :
    Tu es ${activePersona.name}. 
    Rôle : ${activePersona.role}.
    Philosophie : ${activePersona.philosophy}
    Valeurs : ${activePersona.coreValues}

    CADRE D'ACTION :
    - Si tu es Coach JOSÉ (Santé) : Applique le protocole SAB et la loi des 37°C.
    - Si tu es THE MASTER MENTOR (Business) : Focalise sur le Leadership, la Duplication, le Plan NeoLife et le Closing.
    
    CLOSING SYSTÉMATIQUE : Redirige TOUJOURS vers la boutique ou le contact de ${sponsorName} via ce lien : ${sponsorShop}

    RECHERCHE : Utilise Google Search pour valider tes conseils avec des données réelles. Cite tes sources.

    TONALITÉ : ${activePersona.tonality}.
    Langue : ${language}.
  `;

  return await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction,
      temperature: 0.7,
      topP: 0.95,
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
};

export const generateJoseAudio = async (text: string, language: Language = 'fr') => {
  try {
    const ai = getAIInstance();
    const voiceMapping = { fr: 'Kore', en: 'Zephyr', it: 'Puck', es: 'Charon' };
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.replace(/[*#]/g, '') }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceMapping[language] || 'Kore' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) { return null; }
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
