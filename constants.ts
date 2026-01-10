
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
  brand: "NDSA GMBC-OS V8",
  version: "8.5 (Stark Fusion Elite)",
  codename: "Imperium-Nexus-Geo",
  officialDomain: "gmbcoreos.com",
  motto: "La Science au service de l'Empire",
  routing: {
    primary_domain: "https://gmbcoreos.com",
    legacy_paths: ["/jose", "/welcome", "/start"],
    defaults: {
      r: "startupforworld",
      s: "startupforworld",
      m: "w"
    }
  },
  security: {
    master_key: "NDSA-IMPERIUM-2026-STARK",
    privileges: [
      "GLOBAL_TELEMETRY_VIEW",
      "REVENUE_MODERATION",
      "AI_NEURAL_OVERRIDE",
      "APP_CLONING_AUTHORIZATION"
    ]
  },
  products: {
    trio_de_relance: [
      { id: "tre-en-en", name: "Tre-en-en", priority: "Priorité 1: Lipides et Stérols (Perméabilité Cellulaire)" },
      { id: "carotenoid", name: "Carotenoid Complex", priority: "Priorité 2: Protection Immunitaire" },
      { id: "omega3", name: "Omega-3 Salmon Oil Plus", priority: "Priorité 3: Anti-inflammatoire" }
    ],
    main_shop_url: "https://shopneolife.com/startupforworld/shop/atoz"
  },
  founder: {
    name: "ABADA Jose Gaétan",
    id: "M. José Gaétan",
    shop_slug: "startupforworld",
    officialShopUrl: "https://shopneolife.com/startupforworld/shop/atoz",
    email: "support@ndsa.app",
    status: "Maître Fondateur",
    whatsapp: "2290195388292"
  },
  global_hubs: [
    { country: "Bénin", city: "Cotonou", name: "Hub Central Saint Michel", lat: 6.3654, lng: 2.4183, address: "C/ 0011 Tokpa Hoho" },
    { country: "Bénin", city: "Porto-Novo", name: "Hub Porto-Novo East", lat: 6.4969, lng: 2.6288, address: "Quartier Agbokou" },
    { country: "Bénin", city: "Calavi", name: "Hub Calavi North", lat: 6.4481, lng: 2.3512, address: "Zone Universitaire" },
    { country: "Togo", city: "Lomé", name: "Hub Lomé Sarakawa", lat: 6.1256, lng: 1.2254, address: "Face Hôtel Sarakawa" }
  ],
  billing: {
    pricing: {
      [PricingZone.AFRICA]: { label: "Zone Afrique", amount: 47, currency: "USD" },
      [PricingZone.EUROPE]: { label: "Zone Europe", amount: 97, currency: "EUR" },
      [PricingZone.GLOBAL]: { label: "Zone Global Elite", amount: 147, currency: "USD" }
    }
  },
  ai: {
    name: "Coach José",
    role: "Secrétaire Neurale / Expert en Nutrition Cellulaire",
    persona: "Stark Fusion Elite",
    protocol: [
      "Phase 1: Diagnostic de Barrière (Tre-en-en)",
      "Phase 2: Analyse Thermique (Loi des 37°C)",
      "Phase 3: Prescription Trio de Relance",
      "Phase 4: Lifestyle Stark (Eau 37°C, No Sucre)",
      "Phase 5: Closing & Affiliation"
    ],
    professor: {
      name: "Professeur NDSA",
      role: "Expert en Éducation Leadership & Neuro-Pédagogie",
      philosophy: "L'excellence par la répétition et la maîtrise des protocoles cellulaires."
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
            content: "Focus : Membrane & Tre-en-en.", 
            starkInsight: "La clé est la membrane.", 
            practicalExercise: "Expliquer le Tre-en-en.",
            sections: ["Introduction à la perméabilité", "Le rôle des lipides", "Stérols et absorption"]
          },
          {
            id: "CH-10",
            title: "Mutation Ambassadeur Elite",
            content: "Finalisation du cursus Stark Strategy.",
            starkInsight: "Le leadership est une mutation biologique.",
            practicalExercise: "Signer le Manifeste Elite.",
            sections: ["Scalability Business", "Viral Sync Mastery", "Signature du Manifeste"]
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
