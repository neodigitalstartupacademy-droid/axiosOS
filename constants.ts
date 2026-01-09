
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
    legal_disclaimer: "AXIOMA OS est une plateforme d'aide à la décision nutritionnelle. L'IA José n'est pas un médecin certifié. Les données sont traitées localement pour votre confidentialité."
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
    legal_disclaimer: "AXIOMA OS is a nutritional decision support platform. AI José is not a certified physician. Data is processed locally for your privacy."
  },
  it: {
    dashboard: "Cabina di Comando",
    jose: "Coach JOSÉ AI",
    academy: "Academy Leadership",
    social: "Motore Social Sync",
    finance: "Flussi e Commissioni",
    admin: "Master Console",
    welcome: "Buongiorno. Sono il Coach JOSÉ.",
    cta_health: "Diagnosi Salute",
    cta_business: "Startup Business",
    status_stable: "Bio-Sync: Stabile",
    propulsion: "Propulsa Successo",
    medical_scan: "Bio-Scan Medico",
    analyzing: "Analisi dati clinici...",
    report_ready: "Rapporto Restauro Pronto",
    legal_title: "Conformità Legale",
    legal_accept: "Accetta Protocolli di Sicurezza",
    legal_disclaimer: "AXIOMA OS è una piattaforma di supporto nutrizionale. L'IA José non è un medico certificato."
  },
  es: {
    dashboard: "Cabina de Mando",
    jose: "Coach JOSÉ AI",
    academy: "Academy Leadership",
    social: "Motor Social Sync",
    finance: "Flujos y Comisiones",
    admin: "Consola Maestra",
    welcome: "Hola. Soy el Coach JOSÉ.",
    cta_health: "Diagnóstico de Salud",
    cta_business: "Startup de Negocios",
    status_stable: "Bio-Sync: Estable",
    propulsion: "Propulsar Éxito",
    medical_scan: "Bio-Scan Médico",
    analyzing: "Analizando datos clínicos...",
    report_ready: "Informe de Restauración Listo",
    legal_title: "Cumplimiento Legal",
    legal_accept: "Aceptar Protocolos",
    legal_disclaimer: "AXIOMA OS es una plataforma de apoyo nutricional. IA José no es un médico."
  }
};

export const SYSTEM_CONFIG = {
  brand: "AXIOMA OS",
  version: "5.5.0-IMPERIUM",
  founder: {
    name: "Leader JOSÉ",
    id: "067-2922111",
    officialShopUrl: "https://shopneolife.com/startupforworld/shop/atoz",
    status: "Fondateur Visionnaire"
  },
  legal: {
    tos_url: "https://axioma-os.com/terms",
    privacy_url: "https://axioma-os.com/privacy",
    medical_disclaimer: "ATTENTION : JOSÉ est une IA d'analyse de données. En aucun cas ses rapports ne constituent une prescription médicale officielle. Consultez un professionnel de santé agréé pour toute décision médicale."
  },
  ai: {
    name: "JOSÉ",
    role: "Bio-Architecte & Expert en Nutrition Cellulaire",
    disclaimer: "⚠️ Je suis JOSÉ. Je décode vos bio-données. Consultez toujours un médecin pour un avis clinique officiel.",
  },
  ui: {
    backgroundGradient: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
    primaryColor: "#00d4ff",
    accentColor: "#fbbf24"
  },
  billing: {
    pricing: {
      [PricingZone.AFRICA]: { amount: 10, currency: "USD", label: "Plan Émergence" },
      [PricingZone.EUROPE]: { amount: 15, currency: "EUR", label: "Plan Excellence" },
      [PricingZone.GLOBAL]: { amount: 20, currency: "USD", label: "Plan Empire" }
    }
  },
  academy: {
    modules: [
      { 
        id: "m1", 
        title: "Science de la Restauration Cellulaire", 
        description: "Maîtrisez les fondements biologiques du SAB pour devenir une autorité en santé.",
        lessons: [
          {
            id: "m1-l1",
            title: "La membrane : porte d'entrée de la vie",
            content: "La nutrition cellulaire commence par la compréhension de la membrane lipidique. La technologie Tre-en-en restaure cette fluidité critique.",
            starkInsight: "Si la porte est verrouillée, la fête n'aura jamais lieu.",
            practicalExercise: "Analysez votre apport lipidique quotidien."
          }
        ] 
      }
    ],
    premiumModules: [
      { 
        id: "m3", 
        title: "Magnétisme Numérique AXIOMA", 
        description: "Utilisez l'IA pour générer des leads en dormant.",
        lessons: [] 
      }
    ]
  },
  socialViral: {
    template: "J'utilise AXIOMA OS et l'IA JOSÉ pour ma santé cellulaire. Rejoins mon équipe ! 🧬🚀",
    responseScript: "Bonjour ! Utilisez ce lien pour votre diagnostic : ",
    structure: "HOOK / BRIDGE / CTA"
  }
};
