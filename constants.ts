
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
  version: "NDSA-GMBC-OS-V7.2-TUTOR",
  /* Fix: Added officialDomain for affiliate link generation */
  officialDomain: "ndsa.app",
  founder: {
    name: "ABADA Jose Gaétan",
    id: "067-2922111",
    shop_slug: "startupforworld",
    officialShopUrl: "https://shopneolife.com/startupforworld/shop/atoz",
    email: "support@ndsa.app",
    status: "Maître Fondateur",
    /* Fix: Added whatsapp contact for expert referral redirection */
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
      role: "Professeur Émérite de l'Academy",
      philosophy: "Maïeutique digitale et excellence MLM."
    }
  },
  academy: {
    modules: [
      { 
        id: "m1-leadership", 
        title: "Le Mental du Diamond", 
        description: "Devenir le leader que votre réseau attend.",
        lessons: [
          {
            id: "l1-mindset",
            title: "L'Art de l'Auto-Discipline",
            content: "Le succès en MLM NeoLife commence par la maîtrise de soi.",
            sections: [
              "Le concept de l'Entreprise de Soi : Pourquoi vous êtes votre propre PDG.",
              "La loi de la duplication mentale : Vos pensées deviennent votre réseau.",
              "Le DMO (Daily Method of Operation) : La routine des 1% de l'industrie.",
              "Évaluation Finale : Quiz de validation des acquis."
            ],
            starkInsight: "Votre chèque est le reflet exact de votre croissance personnelle.",
            practicalExercise: "Établissez votre DMO pour les 30 prochains jours."
          }
        ]
      },
      { 
        id: "m2-science", 
        title: "Bio-Science NeoLife", 
        description: "Maîtriser le SAB et la Nutrition Cellulaire.",
        lessons: [
          {
            id: "l2-sab",
            title: "Le Standard SAB",
            content: "Comprendre le Scientific Advisory Board.",
            sections: [
              "Origines du SAB : L'héritage du Dr. Arthur Furst.",
              "La différence NeoLife : Whole Food Nutrition vs Synthétique.",
              "Le Tre-en-en : La clé de la perméabilité membranaire.",
              "Validation : Cas pratique sur un conseil client."
            ],
            starkInsight: "On ne vend pas des vitamines, on restaure des fonctions biologiques.",
            practicalExercise: "Expliquez le Tre-en-en en 30 secondes à un inconnu."
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
