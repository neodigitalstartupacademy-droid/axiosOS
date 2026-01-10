
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
  maintenance: {
    status: "Under_Maintenance",
    primary_link: "https://ndsa.app/jose",
    fallback_whatsapp: "https://wa.me/2290195388292",
    fallback_shop: "https://shopneolife.com/startupforworld/shop/atoz"
  },
  founder: {
    name: "ABADA Jose Gaétan",
    id: "M. José Gaétan",
    shop_slug: "startupforworld",
    officialShopUrl: "https://shopneolife.com/startupforworld/shop/atoz",
    email: "support@ndsa.app",
    status: "Maître Fondateur",
    whatsapp: "237699000000"
  },
  location_benin: {
    office_name: "NeoLife International Benin SARL",
    address: "C/ 0011 Tokpa Hoho, Derrière MTN, Saint Michel, Cotonou",
    map_url: "https://www.google.com/maps/search/?api=1&query=NeoLife+International+Benin+SARL+Cotonou",
    contacts: {
      corporate: "+2290120212003",
      ndsa_expert: "2290195388292", 
      display_expert: "+229 01 95 38 82 92"
    },
    hours: "Ouvert 24h/24 (Support en ligne)"
  },
  global_hubs: [
    { country: "Benin", city: "Cotonou", address: "C/ 0011 Tokpa Hoho, Saint Michel" },
    { country: "Togo", city: "Lomé", address: "Face Sortie l'Hôtel Sarakawa" },
    { country: "Côte d'Ivoire", city: "Abidjan", address: "Riviera Les Jardins" },
    { country: "Cameroun", city: "Douala", address: "Bonanjo" },
    { country: "Nigeria", city: "Lagos", address: "Gbagada Industrial Estate" },
    { country: "USA", city: "Fremont, CA", address: "Global HQ - NeoLife" }
  ],
  billing: {
    pricing: {
      [PricingZone.AFRICA]: { label: "Zone Afrique", amount: 47, currency: "USD" },
      [PricingZone.EUROPE]: { label: "Zone Europe", amount: 97, currency: "EUR" },
      [PricingZone.GLOBAL]: { label: "Zone Global Elite", amount: 147, currency: "USD" }
    }
  },
  manifesto: [
    { title: "L'EXCELLENCE CELLULAIRE", text: "Je ne proposerai jamais de solution superficielle. Je commencerai toujours par l'analyse de la Barrière Cellulaire, car je sais que sans une membrane souple et perméable, la nutrition est vaine." },
    { title: "L'INTÉGRITÉ ABSOLUE", text: "Je promets d'être honnête. Je ne vendrai pas de 'miracles', mais je restaurerai l'espoir par la science. Si je ne connais pas une réponse, je consulterai la base de données ou mes mentors." },
    { title: "LA RÈGLE D'OR", text: "Je traiterai chaque client avec la dignité qu'il mérite. Je ne verrai pas un 'lead', mais un être humain dont la santé et le bonheur dépendent de la justesse de mes conseils." },
    { title: "LA PROTECTION DU RÉSEAU (BIO-SYNC)", text: "Je respecte la structure qui me permet de grandir. Je m'engage à suivre le protocole Bio-Sync pour garantir un accompagnement premium, même en mon absence." },
    { title: "ÊTRE LE PRODUIT DU PRODUIT", text: "Ma propre vitalité est ma meilleure publicité. Je m'engage à cultiver ma santé, à consommer mon Trio de Relance et à rayonner les valeurs de NeoLife." },
    { title: "TRANSMETTRE LE FLAMBEAU", text: "Je ne garderai pas ce savoir pour moi. Je m'engage à former, à dupliquer et à aider chaque nouvel Ambassadeur à réussir sa Startup Nutritionnelle." }
  ],
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
            content: "Focus : Synergie des 3 piliers (Tre-en-en, Carotenoid, Omega-3). Certification : Spécialiste en Synergie Nutritionnelle.",
            sections: [
              "Ouvrir : Le rôle de base du Tre-en-en.",
              "Protéger : L'immunité boostée de 37% par le Carotenoid Complex (Étude USDA).",
              "Équilibrer : La force des acides gras Omega-3 pour le cœur et le cerveau.",
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
            starkInsight: "Détoxiquer sans ouvrir les membranes est une erreur fatale.",
            practicalExercise: "Planifier une cure de 7 jours."
          },
          {
            id: "CH-05",
            title: "Gestion du Poids & Glycémie",
            content: "Focus : Zone Brûle-Graisse (GR2). Certification : Conseiller en Équilibre Métabolique.",
            sections: [
              "L'Insuline : Le garde-barrière du stockage des graisses.",
              "Index Glycémique : Pourquoi le NeoLifeShake change tout.",
              "Acides Aminés : Les 22 composants essentiels.",
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
              "Validation : Quiz sur les lipides."
            ],
            starkInsight: "Un leader serein décide mieux. Nourrissez vos neurones.",
            practicalExercise: "Test de focus mental pré et post Omega-3."
          },
          {
            id: "CH-07",
            title: "Immunité & Protection",
            content: "Focus : Bouclier & Radicaux Libres. Certification : Gardien du Bouclier Biologique.",
            sections: [
              "Radicaux Libres : Les terroristes cellulaires.",
              "Antioxydants : La force de la preuve Carotenoid Complex.",
              "Prévention : Construire un bouclier indestructible.",
              "Validation : Qu'est-ce qu'un radical libre ?"
            ],
            starkInsight: "L'immunité est votre première ligne de défense contre le temps.",
            practicalExercise: "Expliquer l'étude USDA."
          },
          {
            id: "CH-08",
            title: "Santé Osseuse & Articulaire",
            content: "Focus : Charpente & Chélation. Certification : Spécialiste en Santé Structurelle.",
            sections: [
              "Chélation : L'absorption maximale sans irritation.",
              "Calcium & D3 : La clé de fixation.",
              "Mouvement : Soutenir les articulations.",
              "Validation : Utilité de la chélation."
            ],
            starkInsight: "Un empire solide repose sur une charpente sans faille.",
            practicalExercise: "Démonstration de solubilité minérale."
          },
          {
            id: "CH-09",
            title: "L'Art de la Consultation NDSA",
            content: "Focus : Protocole en 5 étapes. Certification : Consultant Certifié NDSA.",
            sections: [
              "Étape 1 : Analyse de la Barrière Cellulaire (Perméabilité).",
              "Étape 2 : Facteur Thermique (Loi des 37°C) & Émotionnel.",
              "Étape 3 : Prescription du Trio de Relance.",
              "Étape 4 : Posologie & Hygiène de vie.",
              "Étape 5 : Conclusion et Closing vers la boutique."
            ],
            starkInsight: "On ne vend pas, on prescrit une trajectoire de vie.",
            practicalExercise: "Simulation de consultation complète."
          },
          {
            id: "CH-10",
            title: "Ambassadeur & Expansion Mondiale",
            content: "Focus : Duplication & Manifeste. Certification : AMBASSADEUR ÉLITE NDSA.",
            sections: [
              "Éthique : Restaurer les fonctions, pas guérir (Posture Légale).",
              "Duplication : Être le produit du produit.",
              "Expansion : Les Hubs mondiaux (Bénin, Togo, CI, Nigeria, Cameroun, USA).",
              "Manifeste : Engagement solennel pour inverser la tendance mondiale."
            ],
            starkInsight: "Le Diamond est celui qui a aidé le plus de gens.",
            practicalExercise: "Accepter le Manifeste NDSA pour valider le titre d'Ambassadeur Élite."
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
