
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
  }
};

export const SYSTEM_CONFIG = {
  brand: "Neo Digital Startup Academy",
  version: "NDSA-GMBC-OS-V7.5-INTERACTIVE",
  officialDomain: "ndsa.app",
  founder: {
    name: "ABADA Jose Gaétan",
    id: "067-2922111",
    shop_slug: "startupforworld",
    officialShopUrl: "https://shopneolife.com/startupforworld/shop/atoz",
    email: "support@ndsa.app",
    status: "Maître Fondateur",
    whatsapp: "237699000000"
  },
  ai: {
    name: "Coach José",
    role: "Expert en Nutrition Cellulaire & Psychiatrie Cellulaire",
    business_mentor: {
      name: "The Master Mentor",
      role: "Conférencier International & Expert en Leadership MLM",
      specialty: "Duplication Massive & Psychologie de la Vente Directe"
    },
    professor: {
      name: "Pr. NDSA",
      role: "Tuteur IA Adaptatif",
      philosophy: "Maïeutique digitale et validation des acquis par l'expérience."
    }
  },
  academy: {
    modules: [
      { 
        id: "m1-leadership", 
        title: "Le Mental du Diamond", 
        description: "Devenir le leader charismatique que votre réseau mérite.",
        lessons: [
          {
            id: "l1-mindset",
            title: "L'Art de l'Auto-Discipline",
            content: "Le succès commence par la maîtrise de soi.",
            sections: [
              "INTRODUCTION : Pourquoi 95% des distributeurs échouent par manque de structure mentale.",
              "LE CONCEPT DU PDG : Vous n'êtes pas un vendeur, vous êtes le CEO d'une multinationale personnelle.",
              "LA LOI DU RYTHME : Comment votre DMO (Daily Method of Operation) crée votre chèque.",
              "L'ÉVALUATION : Quiz final sur la posture du leader."
            ],
            starkInsight: "Le leadership ne se donne pas, il se prend par l'exemplarité.",
            practicalExercise: "Écrivez vos 3 non-négociables du matin."
          }
        ]
      },
      { 
        id: "m2-science", 
        title: "Bio-Science & SAB", 
        description: "Maîtriser la science NeoLife pour des closings scientifiques.",
        lessons: [
          {
            id: "l2-sab",
            title: "La Membrane Cellulaire",
            content: "Comprendre la fondation de la vie.",
            sections: [
              "LE TRE-EN-EN : Pourquoi c'est le produit le plus important au monde.",
              "PERMÉABILITÉ : La différence entre nourrir une cellule et simplement manger.",
              "SAB STANDARD : L'héritage scientifique du Dr. Arthur Furst.",
              "ÉTUDE DE CAS : Comment expliquer le Tre-en-en à un prospect sceptique."
            ],
            starkInsight: "Si la membrane est figée, le meilleur complément est inutile.",
            practicalExercise: "Expliquez le concept de la membrane en 2 minutes."
          }
        ]
      }
    ]
  },
  legal: {
    dpo: "ABADA Jose Gaétan",
    consent_text: "En validant, vous consentez au traitement de vos données pour l'établissement de protocoles de santé personnalisés conformément au RGPD."
  },
  audio_logic: {
    pause_duration: 1500
  }
};
