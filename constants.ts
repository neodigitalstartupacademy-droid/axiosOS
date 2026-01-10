
import { PricingZone, Language } from './types';

export const I18N = {
  fr: {
    dashboard: "Cockpit de Direction",
    jose: "Coach JOSÉ AI",
    academy: "Academy Leadership",
    social: "Social Sync Engine",
    finance: "Flux & Commissions",
    admin: "Master Console",
    welcome: "Bonjour. Je suis Coach JOSÉ.",
    cta_health: "Diagnostic Santé",
    cta_business: "Startup Business",
    status_stable: "Bio-Sync : Stable",
    propulsion: "Propulser Success",
    medical_scan: "Bio-Scan Médical",
    analyzing: "Analyse des données cliniques...",
    report_ready: "Rapport de Restauration Prêt",
    legal_title: "Conformité & Protection Juridique",
    legal_accept: "Accepter les Protocoles de Sécurité",
    legal_disclaimer: "L'IA José ne remplace pas votre médecin. AXIOMA OS est une plateforme d'aide à la décision nutritionnelle. Les données sont traitées localement pour votre confidentialité."
  },
  en: {
    dashboard: "Command Cockpit",
    jose: "AI Coach JOSÉ",
    academy: "Leadership Academy",
    social: "Social Sync Engine",
    finance: "Flows & Commissions",
    admin: "Master Console",
    welcome: "Hello. I am Coach JOSÉ.",
    cta_health: "Health Diagnostic",
    cta_business: "Business Startup",
    status_stable: "Bio-Sync: Stable",
    propulsion: "Push Success",
    medical_scan: "Medical Bio-Scan",
    analyzing: "Analyzing clinical data...",
    report_ready: "Restoration Report Ready",
    legal_title: "Legal Compliance & Protection",
    legal_accept: "Accept Security Protocols",
    legal_disclaimer: "AI Jose does not replace your doctor. AXIOMA OS is a nutritional decision support platform."
  }
};

export const SYSTEM_CONFIG = {
  brand: "Neo Digital Startup Academy",
  version: "NDSA-GMBC-OS-V7-PROD",
  founder: {
    name: "ABADA Jose",
    id: "067-2922111",
    shop_slug: "startupforworld",
    officialShopUrl: "https://shopneolife.com/startupforworld/shop/atoz",
    email: "support@ndsa.app",
    whatsapp: "+229XXXXXXXX",
    status: "Maître Fondateur"
  },
  traffic_routing: {
    orphan_owner: "ABADA Jose",
    orphan_id: "067-2922111",
    orphan_slug: "startupforworld",
    rule: "IF param_r IS empty OR param_s IS empty THEN USE default_orphan_owner"
  },
  legal: {
    dpo: "ABADA Jose",
    privacy_url: "https://ndsa.app/privacy",
    consent_text: "En m'inscrivant, j'accepte que l'IA José utilise mon ID et mon Slug pour automatiser mes ventes et m'envoyer des notifications WhatsApp/Email.",
    lead_guarantee: "Attribution stricte basée sur les paramètres de l'URL compressée."
  },
  email_automation: {
    subject: "Félicitations ! Votre IA Coach José est désormais à votre service 🚀",
    sender_name: "NDSA - ABADA Jose",
    support_contact: "support@ndsa.app",
    trigger: "on_social_engine_setup_complete"
  },
  audio_logic: {
    voice_engine: "TTS",
    mode: "Exclusive_Single_Stream",
    pause_duration: 1500, // ms
    visual_feedback: true
  },
  ai: {
    name: "José",
    role: "Expert en Nutrition Cellulaire & Psychiatrie Cellulaire",
    protocol_steps: ["Empathie", "Membrane", "37°C/Émotion", "Prescription 3-5", "Posologie", "Closing"],
    special_rules: {
      tre_en_en_dosage: "Impérativement 2 gélules le matin et 2 gélules le soir.",
      severity_logic: "Si score de gravité > 6/10, prescrire 5 produits avec justification d'urgence vitale."
    }
  },
  academy: {
    modules: [
      { 
        id: "neuro-psych", 
        title: "Neuro-Psychiatrie Cellulaire", 
        description: "Comprendre comment l'esprit verrouille ou libère la cellule.",
        lessons: [
          {
            id: "psy-cell-1",
            title: "La Psychiatrie Cellulaire : L'Esprit sur la Matière",
            content: "La NDSA intègre les découvertes : les émotions toxiques (colère, haine) génèrent un stress oxydatif qui fige les membranes cellulaires.",
            starkInsight: "La colère est un poison biochimique.",
            practicalExercise: "Pratiquez le 'Pardon Métabolique'."
          }
        ] 
      },
      { 
        id: "nutri-therm", 
        title: "Loi des 37°C", 
        description: "Respecter la température biologique.",
        lessons: [
          {
            id: "therm-danger",
            title: "Le Danger des 0°C",
            content: "Boire glacé fige les lipides de vos membranes cellulaires. Une cellule figée ne peut plus absorber de nutriments.",
            starkInsight: "Chaque glaçon verrouille votre vitalité.",
            practicalExercise: "Buvez à 37°C."
          }
        ] 
      }
    ],
    premiumModules: []
  },
  // Added billing configuration for FinanceView
  billing: {
    pricing: {
      [PricingZone.AFRICA]: { label: "Pack Africa Bio-Sync", amount: 15, currency: "USD" },
      [PricingZone.EUROPE]: { label: "Pack Euro Excellence", amount: 25, currency: "EUR" },
      [PricingZone.GLOBAL]: { label: "Pack Global Diamond", amount: 35, currency: "USD" }
    }
  }
};
