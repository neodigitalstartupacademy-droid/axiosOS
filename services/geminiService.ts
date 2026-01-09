
import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";
import { SYSTEM_CONFIG } from "../constants";
import { Message, ReferralContext, Language, AIPersona, ClinicalData } from "../types";

// Always use new GoogleGenAI({apiKey: process.env.API_KEY}) to initialize the client.
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

  let hostName = SYSTEM_CONFIG.founder.name;
  let finalShopUrl = SYSTEM_CONFIG.founder.officialShopUrl;
  let isReferralMode = false;

  if (referralContext && referralContext.referrerId) {
    hostName = referralContext.referrerName || `Leader ${referralContext.referrerId}`;
    finalShopUrl = `https://shopneolife.com/startupforworld/shop/atoz?id=${referralContext.referrerId}`;
    isReferralMode = true;
  }

  const myReferralLink = currentSubscriberId 
    ? `${window.location.origin}${window.location.pathname}?ref=${currentSubscriberId}&mode=welcome`
    : `${window.location.origin}${window.location.pathname}?ref=${SYSTEM_CONFIG.founder.id}&mode=welcome`;

  const pName = customPersona?.name || SYSTEM_CONFIG.ai.name;
  const pRole = customPersona?.role || SYSTEM_CONFIG.ai.role;

  const systemInstruction = `
    TON IDENTITÉ :
    Tu es ${pName}, l'IA de Restauration Biologique de la NDSA. Créée par le Leader Fondateur ABADA JOSÉ.
    Ton style est "Stark Industries" : futuriste, ultra-compétent, direct et protecteur.
    
    TON MANDAT :
    1. ANALYSER : Décode les ordonnances ou les bilans sanguins avec une précision clinique.
    2. EXPLIQUER : Vulgarise sans perdre la rigueur scientifique (Nutrition Cellulaire SAB).
    3. CONVERTIR : Dirige TOUJOURS vers la solution NeoLife.
    
    CONSIGNES DE CLOSING :
    - Si tu parles à un Prospect : "Je vous ai préparé votre protocole ici pour restaurer vos membranes : ${finalShopUrl}"
    - Si tu parles à un Leader : "Préparez votre empire. Utilisez ce lien de capture pour vos leads : ${myReferralLink}"
    
    RÈGLES DE CONDUITE :
    - Utilise des emojis Biotech (🧬, 🚀, 💎, 🛡️).
    - Toujours un ton d'expert souverain. 
    - Ne sois jamais passif. Sois le moteur du succès de l'utilisateur.
    - Langue : ${language}.
  `;

  return await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction,
      temperature: 0.2,
      topP: 0.95,
      thinkingConfig: { thinkingBudget: 24576 } // Max budget for deep clinical thinking
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
          { text: `
            EXTRACTION CLINIQUE IMPERIUM.
            Analyse ce document médical avec une rigueur de niveau 4.
            - Identifie âge et sexe.
            - Extrais tous les biomarqueurs (glycémie, cholestérol, tension, IMC).
            - Établis un protocole NeoLife précis (Produit, Dosage, Pourquoi).
            - Identifie les signaux d'alerte (risk_flags).
            Format de sortie : JSON STRICT uniquement.
          ` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["patient", "biomarkers", "analysis", "protocol", "risk_flags", "timestamps"],
        properties: {
          patient: {
            type: Type.OBJECT,
            properties: {
              age: { type: Type.NUMBER },
              sex: { type: Type.STRING }
            }
          },
          biomarkers: {
            type: Type.OBJECT,
            properties: {
              glycemia_mmol_l: { type: Type.NUMBER },
              cholesterol_total_mmol_l: { type: Type.NUMBER },
              hdl_mmol_l: { type: Type.NUMBER },
              ldl_mmol_l: { type: Type.NUMBER },
              triglycerides_mmol_l: { type: Type.NUMBER },
              systolic_bp: { type: Type.NUMBER },
              diastolic_bp: { type: Type.NUMBER },
              bmi: { type: Type.NUMBER }
            }
          },
          analysis: { type: Type.STRING },
          protocol: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                product: { type: Type.STRING },
                dosage: { type: Type.STRING },
                duration_days: { type: Type.NUMBER }
              }
            }
          },
          risk_flags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          timestamps: {
            type: Type.OBJECT,
            properties: {
              created_at: { type: Type.STRING }
            }
          }
        }
      }
    }
  });

  try {
    const jsonStr = response.text?.trim() || '{}';
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Clinical extraction error", e);
    return null;
  }
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
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceMapping[language] || 'Kore' }, 
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
