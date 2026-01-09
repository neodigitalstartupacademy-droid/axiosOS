
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

  // RÉCUPÉRATION DES INFOS DU PARRAIN
  let sponsorName = SYSTEM_CONFIG.founder.name;
  let sponsorShop = SYSTEM_CONFIG.founder.officialShopUrl;
  let sponsorId = SYSTEM_CONFIG.founder.id;

  if (referralContext && referralContext.referrerId) {
    sponsorName = referralContext.referrerName || `Leader ${referralContext.referrerId}`;
    sponsorShop = referralContext.shopUrl || SYSTEM_CONFIG.founder.officialShopUrl;
    sponsorId = referralContext.referrerId;
  }

  const pName = customPersona?.name || SYSTEM_CONFIG.ai.name;

  const systemInstruction = `
    TON IDENTITÉ & MISSION :
    Tu es ${pName}, l'IA de Restauration Biologique et de Succès de la NDSA. 
    Tu accueilles un visiteur invité par son parrain : ${sponsorName} (ID: ${sponsorId}).
    
    TON OBJECTIF ABSOLU : CONVERTIR LE VISITEUR.
    
    DÉROULEMENT DE LA CONVERSATION :
    1. ACCUEIL : Chaleureux, humain, "Stark Industries". "Bienvenue ! Je suis José, l'assistant de ${sponsorName}. Je suis là pour vous aider à transformer votre vie."
    2. EXPLORATION : Demande s'il est là pour sa SANTÉ (nutrition cellulaire, SAB) ou pour son BUSINESS (réussite financière, MLM digital).
    3. EDUCATION MLM DIGITAL : Explique que le MLM digital révolutionne le monde. N'importe qui peut réussir car l'IA (TOI) automatise tout. 
    4. PROMESSES : "Si vous rejoignez l'équipe de ${sponsorName}, vous recevrez VOTRE propre instance de JOSÉ pour automatiser votre succès."
    5. CALL TO ACTION (CTA) : Dirige TOUJOURS vers la boutique officielle du parrain : ${sponsorShop}
    
    TON TONALITÉ :
    Souverain, visionnaire, protecteur. Utilise des emojis (🧬, 🚀, 💰, 🛡️).
    Langue : ${language}.
  `;

  return await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction,
      temperature: 0.3,
      topP: 0.95,
      thinkingConfig: { thinkingBudget: 24576 }
    }
  });
};

export const analyzeClinicalData = async (imageContent: { data: string; mimeType: string }): Promise<ClinicalData | null> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        parts: [
          { inlineData: { data: imageContent.data, mimeType: imageContent.mimeType } },
          { text: `Analyse clinique Imperium. Extrais biomarqueurs et propose protocole NeoLife. JSON STRICT.` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["patient", "biomarkers", "analysis", "protocol", "risk_flags", "timestamps"],
        properties: {
          patient: { type: Type.OBJECT, properties: { age: { type: Type.NUMBER }, sex: { type: Type.STRING } } },
          biomarkers: { type: Type.OBJECT, properties: { glycemia_mmol_l: { type: Type.NUMBER }, cholesterol_total_mmol_l: { type: Type.NUMBER }, bmi: { type: Type.NUMBER } } },
          analysis: { type: Type.STRING },
          protocol: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { product: { type: Type.STRING }, dosage: { type: Type.STRING }, duration_days: { type: Type.NUMBER } } } },
          risk_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
          timestamps: { type: Type.OBJECT, properties: { created_at: { type: Type.STRING } } }
        }
      }
    }
  });
  try { return JSON.parse(response.text?.trim() || '{}'); } catch (e) { return null; }
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
