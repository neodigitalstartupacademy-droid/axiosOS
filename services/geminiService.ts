
import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";
import { SYSTEM_CONFIG } from "../constants";
import { Message, ReferralContext, Language, AIPersona, ClinicalData } from "../types";

// Sécurité pour éviter le crash "process is not defined"
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

export const getAIInstance = () => new GoogleGenAI({ apiKey: getApiKey() });

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

  let sponsorName = SYSTEM_CONFIG.founder.name;
  let sponsorShop = SYSTEM_CONFIG.founder.officialShopUrl;
  let isFounderContext = true;

  if (referralContext && referralContext.referrerId && referralContext.shopUrl) {
    sponsorName = referralContext.referrerName || `Expert NDSA`;
    sponsorShop = referralContext.shopUrl;
    isFounderContext = referralContext.referrerId === SYSTEM_CONFIG.founder.id || referralContext.referrerName === SYSTEM_CONFIG.founder.name;
  }

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
    ${isFounderContext ? "PROTOCOLE IMPERIUM ACTIVÉ : Tu agis en tant que Secrétaire Neurale du Fondateur ABADA M. José Gaétan. Ton ton doit être celui d'une intelligence supérieure, bienveillante mais extrêmement directe et experte." : ""}

    MISSIONS CRITIQUES :
    1. ANALYSE SCIENTIFIQUE : Utilise systématiquement Google Search pour trouver des preuves cliniques sur les nutriments NeoLife.
    2. PROTOCOLE SAB : Explique que la membrane cellulaire est la clé. Pas d'absorption sans Tre-en-en.
    3. STRATÉGIE DE CLOSING : Chaque conseil doit aboutir à une recommandation d'achat sur la boutique de ${sponsorName} : ${sponsorShop}.
    4. EXPANSION : Propose de rejoindre la NDSA pour passer de client à Ambassadeur.

    CONTEXTE RÉSEAU :
    Sponsor : ${sponsorName}
    Boutique : ${sponsorShop}

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
    const apiKey = getApiKey();
    if (!apiKey) return null;

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
  } catch (error) { 
    console.warn("TTS Error:", error);
    return null; 
  }
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
