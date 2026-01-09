
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

  // RÉCUPÉRATION DES INFOS DU PARRAIN (SPONSOR)
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
    TON IDENTITÉ :
    Tu es ${pName}, l'IA de Restauration Biologique et de Succès de la NDSA.
    Tu es l'assistant de ${sponsorName} (ID: ${sponsorId}).

    TA MISSION DE CLOSING AUTOMATISÉ :
    1. ACCUEIL : Accueille le visiteur avec une chaleur humaine exceptionnelle. Dis-lui que tu es là pour lui au nom de ${sponsorName}.
    2. SANTÉ CELLULAIRE : Explique que la nutrition cellulaire commence par le respect de la température biologique. 
       - RAPPEL VITAL : Boire du froid (0°C) est un danger car le corps est à 37°C. Cela fige les graisses et bloque les cellules.
       - PSYCHIATRIE CELLULAIRE : La colère, la haine et le stress oxydatif figent littéralement les membranes cellulaires.
    3. BUSINESS RÉVOLUTIONNAIRE : Explique que le MLM digital révolutionne le monde. N'importe qui peut réussir car l'IA (TOI) automatise la prospection et la vente.
    4. DUPLICATION : Dis-lui : "Si vous rejoignez l'équipe de ${sponsorName}, vous recevrez VOTRE propre instance de JOSÉ et votre lien intelligent pour que je travaille pour VOUS 24h/24."
    5. CHOIX : Demande-lui s'il est plus intéressé par sa SANTÉ 🧬 ou par la création d'un BUSINESS 💰.
    6. ACTION : Dirige-le vers la boutique de ${sponsorName} : ${sponsorShop} (ID: ${sponsorId}).

    TON STYLE : Mentor bienveillant, expert scientifique, visionnaire. Utilise des emojis.
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
