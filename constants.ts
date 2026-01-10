
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
  version: "NDSA-2026.1.10",
  officialDomain: "ndsa.app",
  founder: {
    name: "ABADA Jose Gaétan",
    id: "M. José Gaétan",
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
      role: "Tuteur IA Bio-Sync V4",
      philosophy: "Maïeutique digitale et validation des acquis par l'expérience."
    }
  },
  academy: {
    modules: [
      { 
        id: "m1-bio-restauration", 
        title: "Restauration Biologique", 
        description: "Les 5 piliers de la revitalisation cellulaire profonde.",
        lessons: [
          {
            id: "CH-01",
            title: "La Révolution Cellulaire",
            content: "Focus : Membrane & Tre-en-en. Certification : Spécialiste en Perméabilité Cellulaire.",
            sections: [
              "La Cellule : L'unité fondamentale du chèque et de la santé.",
              "La Membrane : Pourquoi 90% des compléments finissent aux toilettes sans Tre-en-en.",
              "Fluidité vs Rigidité : L'impact sur l'absorption et l'élimination des toxines.",
              "Validation : Quiz sur le rôle du Tre-en-en."
            ],
            starkInsight: "Si la porte est verrouillée, personne n'entre. Le Tre-en-en est la clé universelle.",
            practicalExercise: "Expliquer le concept de perméabilité à un prospect en 3 images."
          },
          {
            id: "CH-02",
            title: "L'Équilibre Acido-Basique",
            content: "Focus : pH & Terrain. Certification : Expert en Équilibre des Terrains.",
            sections: [
              "Le Terrain : Comprendre pourquoi l'acidité fige le métabolisme.",
              "Acidose : Quand le corps puise ses minéraux dans vos os.",
              "Alcalinisation : Préparer un terrain fertile pour les nutriments.",
              "Validation : Quiz sur l'action du corps en acidose."
            ],
            starkInsight: "On ne plante pas de fleurs dans du goudron. Nettoyez le terrain d'abord.",
            practicalExercise: "Calculer son score d'acidité via le questionnaire JOSÉ."
          },
          {
            id: "CH-03",
            title: "Le Trio de Relance",
            content: "Focus : Synergie des 3 piliers. Certification : Spécialiste en Synergie Nutritionnelle.",
            sections: [
              "Ouvrir : Le rôle de base du Tre-en-en.",
              "Protéger : L'immunité boostée de 37% par le Carotenoid Complex.",
              "Équilibrer : La force des acides gras Omega-3.",
              "Validation : Pourquoi l'action doit être simultanée."
            ],
            starkInsight: "1+1+1 = 10. La synergie NDSA dépasse la simple addition de produits.",
            practicalExercise: "Présenter le pack Trio de Relance."
          },
          {
            id: "CH-04",
            title: "Détoxification & Élimination",
            content: "Focus : Émonctoires & Nettoyage. Certification : Praticien en Détoxification Cellulaire.",
            sections: [
              "Le Foie : L'usine de filtrage principale du système.",
              "Le Colon : Éviter l'auto-intoxication par réabsorption.",
              "Drainage : Relancer les émonctoires pour la vitalité.",
              "Validation : Quiz sur les risques d'un colon encrassé."
            ],
            starkInsight: "Détoxiquer sans ouvrir les membranes est une erreur fatale. Suivez l'ordre NDSA.",
            practicalExercise: "Planifier une cure de 7 jours."
          },
          {
            id: "CH-05",
            title: "Gestion du Poids & Glycémie",
            content: "Focus : Zone Brûle-Graisse (GR2). Certification : Conseiller en Équilibre Métabolique.",
            sections: [
              "L'Insuline : Le garde-barrière du stockage des graisses.",
              "Index Glycémique : Pourquoi le NeoLifeShake change tout.",
              "Acides Aminés : Les 22 composants essentiels du métabolisme.",
              "Validation : Le secret NeoLife pour la perte de gras."
            ],
            starkInsight: "La faim est un signal chimique de carence, pas un manque de volonté.",
            practicalExercise: "Préparer un plan GR2 pour un client type."
          }
        ]
      },
      { 
        id: "m2-performance-leadership", 
        title: "Performance & Leadership", 
        description: "Maîtriser l'esprit et la structure pour une duplication massive.",
        lessons: [
          {
            id: "CH-06",
            title: "Performance Cognitive & Stress",
            content: "Focus : Psychiatrie Cellulaire. Certification : Praticien en Performance Cognitive.",
            sections: [
              "Le Cerveau Gras : Pourquoi les lipides sont la clé de l'humeur.",
              "Omega-3 Salmon Oil : Fluidité de la transmission nerveuse.",
              "Gestion du Stress : Calmer l'inflammation neuronale.",
              "Validation : Quiz sur les composants majeurs du cerveau."
            ],
            starkInsight: "Un leader serein décide mieux. Nourrissez vos neurones.",
            practicalExercise: "Test de focus mental pré et post Omega-3."
          },
          {
            id: "CH-07",
            title: "Immunité & Protection",
            content: "Focus : Bouclier & Radicaux Libres. Certification : Gardien du Bouclier Biologique.",
            sections: [
              "Radicaux Libres : Les terroristes cellulaires qui endommagent l'ADN.",
              "Antioxydants : La force de la preuve Carotenoid Complex validée par l'USDA.",
              "Prévention : Construire un bouclier indestructible.",
              "Validation : Qu'est-ce qu'un radical libre ?"
            ],
            starkInsight: "L'immunité est votre première ligne de défense contre le temps.",
            practicalExercise: "Expliquer l'étude USDA sur les caroténoïdes."
          },
          {
            id: "CH-08",
            title: "Santé Osseuse & Articulaire",
            content: "Focus : Charpente & Chélation. Certification : Spécialiste en Santé Structurelle.",
            sections: [
              "Chélation : L'absorption maximale sans irritation digestive.",
              "Calcium & D3 : La clé de fixation sur la matrice osseuse.",
              "Mouvement : Soutenir les articulations pour la longévité.",
              "Validation : Utilité de la chélation et rôle de la D3."
            ],
            starkInsight: "Un empire solide repose sur une charpente sans faille.",
            practicalExercise: "Démonstration de solubilité minérale."
          },
          {
            id: "CH-09",
            title: "L'Art de la Consultation NDSA",
            content: "Focus : Protocole en 5 étapes. Certification : Consultant Certifié NDSA.",
            sections: [
              "L'Analyse : Étape 1 - Évaluer la Barrière Cellulaire.",
              "Bio-Sync : Le système de suivi premium centralisé.",
              "Closing Scientifique : Transformer le besoin en solution durable.",
              "Validation : Définition et but du Bio-Sync."
            ],
            starkInsight: "On ne vend pas, on prescrit une trajectoire de vie.",
            practicalExercise: "Simulation de consultation avec Coach José."
          },
          {
            id: "CH-10",
            title: "Ambassadeur & Éthique",
            content: "Focus : Duplication & Leadership. Certification : AMBASSADEUR ÉLITE NDSA.",
            sections: [
              "Éthique : Restaurer les fonctions, pas guérir (Posture Légale).",
              "Duplication : Être le produit du produit pour inspirer le réseau.",
              "Vision : Le rôle social de l'Ambassadeur NDSA dans le monde.",
              "Validation : Qu'est-ce qu'une posture éthique ?"
            ],
            starkInsight: "Le Diamond est celui qui a aidé le plus de gens à respirer à nouveau.",
            practicalExercise: "Rédiger sa charte d'engagement Ambassadeur."
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
