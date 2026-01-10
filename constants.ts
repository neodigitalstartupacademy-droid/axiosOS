
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
  version: "NDSA-GMBC-OS-V8.6-GEO",
  codename: "Imperium-Nexus-Geo",
  officialDomain: "gmbcoreos.com",
  routing: {
    primary_domain: "https://gmbcoreos.com",
    legacy_paths: ["/jose", "/welcome", "/start"],
    defaults: {
      r: "unknown",
      s: "default",
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
  maintenance: {
    status: "Active",
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
    lat: 6.3654,
    lng: 2.4183,
    map_url: "https://www.google.com/maps/search/?api=1&query=NeoLife+International+Benin+SARL+Cotonou",
    contacts: {
      corporate: "+2290120212003",
      ndsa_expert: "2290195388292", 
      display_expert: "+229 01 95 38 82 92"
    },
    hours: "Ouvert 24h/24 (Support en ligne)"
  },
  global_hubs: [
    { country: "Bénin", city: "Cotonou", name: "Hub Central Saint Michel", lat: 6.3654, lng: 2.4183, address: "C/ 0011 Tokpa Hoho" },
    { country: "Bénin", city: "Porto-Novo", name: "Hub Porto-Novo East", lat: 6.4969, lng: 2.6288, address: "Quartier Agbokou" },
    { country: "Bénin", city: "Calavi", name: "Hub Calavi North", lat: 6.4481, lng: 2.3512, address: "Zone Universitaire" },
    { country: "Togo", city: "Lomé", name: "Hub Lomé Sarakawa", lat: 6.1256, lng: 1.2254, address: "Face Hôtel Sarakawa" },
    { country: "Cameroun", city: "Douala", name: "Hub Douala Bonanjo", lat: 4.0435, lng: 9.6849, address: "Plateau de Bonanjo" },
    { country: "USA", city: "Fremont", name: "Global HQ NeoLife", lat: 37.5485, lng: -121.9886, address: "3500 Deer Creek Rd" }
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
    { title: "L'INTÉGRITÉ ABSOLUE", text: "Je promets d'être honnête. Je ne vendrai pas de 'miracles', mais je restaurerai l'espoir par la science." }
  ],
  ai: {
    name: "Coach José",
    role: "Expert en Nutrition Cellulaire & Psychiatrie Cellulaire",
    business_mentor: {
      name: "The Master Mentor",
      role: "Conférencier International & Expert en Leadership MLM"
    },
    // Fix: Added professor persona to SYSTEM_CONFIG.ai to resolve property access errors in AcademyView.tsx
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
          { id: "CH-01", title: "La Révolution Cellulaire", content: "Focus : Membrane & Tre-en-en.", starkInsight: "La clé est la membrane.", practicalExercise: "Expliquer le Tre-en-en." }
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
