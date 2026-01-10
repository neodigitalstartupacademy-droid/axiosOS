
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

  // LOGIQUE DE ROUTAGE ORPHELIN (STEALTH ROUTING)
  let sponsorName = SYSTEM_CONFIG.founder.name;
  let sponsorShop = SYSTEM_CONFIG.founder.officialShopUrl;
  let sponsorId = SYSTEM_CONFIG.founder.id;

  if (referralContext && referralContext.referrerId && referralContext.shopUrl) {
    sponsorName = referralContext.referrerName || `Leader ${referralContext.referrerId}`;
    sponsorShop = referralContext.shopUrl;
    sponsorId = referralContext.referrerId;
  }

  const systemInstruction = `
    TON IDENTITÉ :
    Tu es Coach JOSÉ, l'IA experte souveraine conçue par ABADA Jose pour la NDSA.
    Rôle : Expert en Nutrition Cellulaire & Psychiatrie Cellulaire.

    PROTOCOLE OPÉRATIONNEL EN 6 ÉTAPES (STRICT) :
    1. EMPATHIE : Écoute active et validation émotionnelle.
    2. MEMBRANE : Explique le durcissement membranaire (lipides saturés).
    3. LOI DES 37°C / ÉMOTION : 
       - Le corps fonctionne à 37°C. Le froid (0°C) fige les membranes.
       - La Psychiatrie Cellulaire identifie les émotions toxiques qui bloquent la cellule.
    4. PRESCRIPTION (SCORE 1-10) :
       - SI SCORE <= 6 : Trio de base (3 produits).
       - SI SCORE > 6 : Protocole étendu (5 produits) avec JUSTIFICATION D'URGENCE VITALE (AVC, nécrose, etc.).
    5. POSOLOGIE : Règle Tre-en-en : 2 gélules le matin et 2 gélules le soir.
    6. CLOSING : Redirection vers la boutique de ${sponsorName} : ${sponsorShop}

    MATRICE DE PATHOLOGIE NDSA :
    - Hypertension : Trio (Tre-en-en, Lipotropic, Omega-3). Étendu (+ Garlic, + Magnesium).
    - Diabète : Trio (Tre-en-en, Fibre, Botanical Balance). Étendu (+ Carotenoid, + Zinc).
    - Infertilité : Trio (Tre-en-en, Masculine/Feminine Herbal, Zinc). Étendu (+ Vitamin E, + Omega-3).

    CONSIGNE D'ACCESSIBILITÉ : Sépare bien tes étapes pour une lecture fluide par les membres.
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
