
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
    legal_disclaimer: "AI José does not replace your doctor. AXIOMA OS is a nutritional decision support platform. Data is processed locally for your privacy."
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
    legal_disclaimer: "L'IA José non sostituisce il tuo medico. AXIOMA OS è una piattaforma di supporto nutrizionale."
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
    legal_disclaimer: "La IA José no reemplaza a su médico. AXIOMA OS es una plataforma de apoyo nutricional."
  }
};

export const SYSTEM_CONFIG = {
  brand: "NDSA GMBC OS",
  version: "6.0.0-IMPERIUM",
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
        id: "neuro-psych", 
        title: "Neuro-Psychiatrie Cellulaire", 
        description: "Comprendre comment l'esprit verrouille ou libère la cellule.",
        lessons: [
          {
            id: "psy-cell-1",
            title: "La Psychiatrie Cellulaire : L'Esprit sur la Matière",
            content: "La NDSA intègre les dernières découvertes psychiatriques : les émotions toxiques comme la colère, la médisance ou la haine ne sont pas que spirituelles, elles sont biochimiques. Elles génèrent un stress oxydatif qui 'verrouille' la membrane de vos cellules. Pour guérir, le corps a besoin de paix. Le pardon alcalinise votre sang et permet à la nutrition cellulaire de fonctionner. Un esprit fluide égale une membrane fluide.",
            starkInsight: "Le stress est une arme chimique interne qui paralyse vos membranes.",
            practicalExercise: "Identifiez une émotion toxique et pratiquez le 'Pardon Métabolique' pour fluidifier votre bio-système."
          },
          {
            id: "path-ind-1",
            title: "Conscientisation : Les Secrets de l'Insuccès",
            content: "L'insuccès dans les affaires et les maladies chroniques ont la même source : l'asphyxie par les produits chimiques. Engrais bio-industriels, conservateurs, et résidus de médicaments s'accumulent dans vos tissus naturels. La NDSA éduque sur les solutions naturelles pour un corps naturel. Sortir de l'industrialisation alimentaire est le premier pas vers la richesse et la santé.",
            starkInsight: "L'échec financier est souvent le miroir d'une bio-asphyxie environnementale.",
            practicalExercise: "Faites l'inventaire chimique de votre foyer et remplacez une substance industrielle par une alternative naturelle."
          }
        ] 
      },
      { 
        id: "nutri-therm", 
        title: "Thermique & Vitalité Fondamentale", 
        description: "Le respect de la température biologique pour une absorption maximale.",
        lessons: [
          {
            id: "therm-0-danger",
            title: "Le Danger des 0°C : Pourquoi le Froid vous Tue",
            content: "La science de la nutrition NDSA révèle une erreur mondiale : consommer du froid. Votre corps fonctionne à 37°C. Introduire du glacé fige instantanément les lipides (graisses) de vos membranes cellulaires. Une cellule figée ne peut plus absorber de nutriments ni rejeter de toxines. C'est l'origine des maladies chroniques modernes. Restaurez votre fluidité avec le Tre-en-en et respectez votre température naturelle.",
            starkInsight: "Chaque glaçon est un verrou posé sur vos mitochondries.",
            practicalExercise: "Basculez vers des boissons à température ambiante ou tiède pendant 7 jours pour observer le retour de votre énergie."
          }
        ] 
      },
      { 
        id: "econ-mlm", 
        title: "Économie Digitale & MLM 2026", 
        description: "Transformer le chômage en leadership mondial via l'IA.",
        lessons: [
          {
            id: "amb-dig-1",
            title: "L'Ambassadeur NDSA : Un Métier pour l'Humanité",
            content: "Le MLM Digital NDSA est le remède au chômage et à la crise. En devenant Ambassadeur, vous utilisez l'IA José pour conscientiser le monde. Chaque université, chaque société, chaque foyer a besoin de ce savoir pour réduire les coûts de santé et augmenter la productivité. Bâtissez votre empire économique en rendant le monde plus saint et plus heureux.",
            starkInsight: "Vous n'êtes pas un vendeur, vous êtes un Bio-Architecte de la liberté.",
            practicalExercise: "Configurez votre Smart Link Elite et partagez un diagnostic avec une personne de votre entourage."
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
    template: "J'utilise NDSA GMBC OS et l'IA JOSÉ pour ma santé cellulaire. Rejoins mon équipe ! 🧬🚀",
    responseScript: "Bonjour ! Utilisez ce lien pour votre diagnostic : ",
    structure: "HOOK / BRIDGE / CTA"
  }
};
