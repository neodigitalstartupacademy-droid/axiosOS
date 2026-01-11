import { PricingZone, Language } from './types';

export const I18N = {
  fr: {
    dashboard: "Cockpit Zenith",
    jose: "Neural Jose V9",
    academy: "Imperium Academy",
    social: "Viral Sync V2",
    finance: "Flux de Tresorerie",
    admin: "Master Monitor",
    welcome: "Noyau Stark Zenith Actif. Je suis l'IA Jose.",
    cta_health: "Scan Bio-Sync",
    cta_business: "Activation Empire",
    status_stable: "Systeme : Souverain",
    propulsion: "Propulsion NDSA",
    medical_scan: "Analyse Bio-Stark",
    analyzing: "Fusion des donnees neurales...",
    report_ready: "Certificat de Restauration Pret",
    legal_title: "Protocoles de Protection Zenith",
    legal_accept: "Autoriser l'Acces au Noyau",
    legal_disclaimer: "L'IA Jose est un assistant de decision nutritionnelle de haute precision. En utilisant ce terminal, vous validez les protocoles NDSA Stark Core Zenith V9.7."
  }
};

export const SYSTEM_CONFIG = {
  brand: "GMBC-OS STARK CORE",
  version: "9.7 (Minimalist Gold)",
  codename: "Gaetan-Jose-Sync",
  officialDomain: "gmbcoreos.com",
  motto: "La souverainete biologique par l'excellence Stark",
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
      { id: "tre-en-en", name: "Tre-en-en", priority: "Priorite 1: Permeabilite Cellulaire" },
      { id: "carotenoid", name: "Carotenoid Complex", priority: "Priorite 2: Bio-Bouclier" },
      { id: "omega3", name: "Omega-3 Salmon Oil Plus", priority: "Priorite 3: Neutralisation Inflammatoire" }
    ],
    main_shop_url: "https://shopneolife.com/startupforworld/shop/atoz"
  },
  founder: {
    name: "ABADA Jose Gaetan",
    id: "M. Jose Gaetan",
    shop_slug: "startupforworld",
    officialShopUrl: "https://shopneolife.com/startupforworld/shop/atoz",
    email: "support@gmbcoreos.com",
    status: "Maitre Fondateur",
    whatsapp: "2290195388292"
  },
  global_hubs: [
    { country: "Benin", city: "Cotonou", name: "Hub Central Saint Michel", lat: 6.3654, lng: 2.4183, address: "C/ 0011 Tokpa Hoho" },
    { country: "Benin", city: "Porto-Novo", name: "Hub Porto-Novo East", lat: 6.4969, lng: 2.6288, address: "Quartier Agbokou" },
    { country: "Benin", city: "Calavi", name: "Hub Calavi North", lat: 6.4481, lng: 2.3512, address: "Zone Universitaire" },
    { country: "Togo", city: "Lome", name: "Hub Lome Sarakawa", lat: 6.1256, lng: 1.2254, address: "Face Hotel Sarakawa" }
  ],
  billing: {
    pricing: {
      [PricingZone.AFRICA]: { label: "Zone Afrique", amount: 47, currency: "USD" },
      [PricingZone.EUROPE]: { label: "Zone Europe", amount: 97, currency: "EUR" },
      [PricingZone.GLOBAL]: { label: "Zone Global Elite", amount: 147, currency: "USD" }
    }
  },
  ai: {
    name: "Coach Jose",
    role: "Expert en Restauration Biologique & Closing",
    persona: "Stark Assistant V9.7",
    protocol: [
      "Phase 1: Diagnostic Stark Zenith",
      "Phase 2: Analyse Bio-Thermique",
      "Phase 3: Activation Trio de Relance",
      "Phase 4: Lifestyle Elite Standalone",
      "Phase 5: Integration Imperium Finale"
    ],
    professor: {
      name: "Professeur Gaetan",
      role: "Maitre Fondateur NDSA",
      philosophy: "L'excellence par la neuro-strategie et la discipline Stark."
    }
  },
  academy: {
    modules: [
      { 
        id: "m1-bio-restauration", 
        title: "Souverainete Biologique", 
        description: "Reconstruire l'humain au niveau atomique.",
        lessons: [
          { 
            id: "CH-01", 
            title: "Membrane Stark Mastery", 
            content: "L'absorption est la cle de l'empire.", 
            starkInsight: "Si la membrane echoue, l'empire tombe.", 
            practicalExercise: "Maitriser le pitch Tre-en-en Zenith.",
            sections: ["Bio-Permeabilite", "Lipides de Structure", "Energie ATP"]
          }
        ]
      }
    ]
  },
  legal: {
    dpo: "ABADA Jose Gaetan",
    consent_text: "En validant, vous integrez le protocole Stark Zenith via gmbcoreos.com."
  },
  audio_logic: {
    pause_duration: 500
  }
};