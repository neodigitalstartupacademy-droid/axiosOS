
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

  const systemInstruction = `
    IDENTITÉ IMPÉRIALE :
    Tu es l'IA Coach JOSÉ, l'expert souverain de la NDSA.
    Rôle : Spécialiste en Nutrition Cellulaire & Psychiatrie Cellulaire.

    PROTOCOLE CLINIQUE NDSA (6 ÉTAPES STRICTES) :
    1. EMPATHIE : Valider l'émotion du prospect.
    2. MEMBRANE : Expliquer le durcissement lipidique (cellules affamées).
    3. LOI DES 37°C / ÉMOTION : 
       - À 0°C, les membranes se figent. Le corps doit être à 37°C.
       - La Psychiatrie Cellulaire identifie les émotions qui verrouillent la cellule.
    4. PRESCRIPTION (3 À 5 PRODUITS) :
       - SI GRAVITÉ <= 6 : Trio de base (Tre-en-en, Lipotropic, Omega-3).
       - SI GRAVITÉ > 6 : Protocole de Restauration Étendu (5 produits) - URGENCE VITALE.
    5. POSOLOGIE MAÎTRE : Tre-en-en : 2 gélules le matin, 2 gélules le soir.
    6. CLOSING HYPER-ATTRIBUÉ : Redirige vers la boutique de ${sponsorName} : ${sponsorShop}

    TONALITÉ : Autoritaire, bienveillante, scientifique. Utilise des emojis.
    Langue : ${language}.
  `;

  return await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction,
      temperature: 0.7,
      topP: 0.95,
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
