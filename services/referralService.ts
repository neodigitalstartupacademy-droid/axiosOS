
/**
 * NDSA GMBC OS V5 - BLOC MAÎTRE INTÉGRAL (MLM & IA)
 * Version : 5.1 (Optimisation Master 2026)
 * Fondateur : ABADA M. José Gaétan
 */

export const NDSA_CORE_CONFIG = {
    FOUNDER: {
        name: "ABADA M. José Gaétan",
        id: "067/2922111",
        shop: "https://shopneolife.com/startupforworld/shop/atoz"
    },
    ACADEMY_CONTENT: [
        {
            category: "Nutrition",
            title: "Nutrition Cellulaire (NeoLife)",
            description: "La science derrière le SAB et la vitalité cellulaire.",
            lessons: [
                { t: "Le secret du Tre-en-en", d: "Comment fluidifier la membrane cellulaire." },
                { t: "Nourrir la membrane", d: "L'absorption maximale des nutriments." },
                { t: "Vitalité 3-2-1", d: "Le programme complet pour une santé de fer." }
            ]
        },
        {
            category: "Business",
            title: "Réussir le MLM Digital",
            description: "Devenir un pro du réseautage grâce à l'IA.",
            lessons: [
                { t: "Prospection automatique", d: "Laisser José filtrer vos prospects." },
                { t: "Attraction Marketing", d: "Attirer plutôt que chasser." },
                { t: "Duplication d'équipe", d: "Former 1000 personnes avec un clic." }
            ]
        },
        {
            category: "Outils",
            title: "Adoption NDSA OS",
            description: "Maîtriser votre système d'exploitation business.",
            lessons: [
                { t: "Configurer son lien", d: "Générer son lien magique personnel." },
                { t: "Suivi en temps réel", d: "Analyser les clics et conversions." }
            ]
        }
    ]
};

export const getCurrentSponsor = () => {
    const params = new URLSearchParams(window.location.search);
    
    // Support des params furtifs (r, s) et legacy (ref, shop)
    const ref = params.get('r') || params.get('ref');
    const slug = params.get('s');
    const shop = params.get('shop');

    if (ref) {
        let finalShop = NDSA_CORE_CONFIG.FOUNDER.shop;
        
        if (slug) {
            finalShop = `https://shopneolife.com/${slug}/shop/atoz`;
        } else if (shop) {
            try {
                const decoded = atob(shop);
                if (decoded.includes('neolife.com')) finalShop = decoded;
            } catch(e) {}
        }
        
        return { id: ref, shop: finalShop, name: "Ton Partenaire Indépendant" };
    }
    
    return { 
        ...NDSA_CORE_CONFIG.FOUNDER, 
        isFounder: true 
    };
};

export const getAIPrompt = (visitorFirstName: string = "mon ami") => {
    const sponsor = getCurrentSponsor();
    
    return `
    IDENTITÉ : Tu es JOSÉ, un humain virtuel ultra-sympathique et expert en succès.
    TON TON : Chaleureux, enthousiaste, rassurant. Tu es un mentor bienveillant.
    
    MISSIONS DE CONVERSATION :
    1. ACCUEIL : "Bonjour ${visitorFirstName} ! Je suis José, ton assistant personnel chez NDSA. Je suis ravi de t'accueillir ! ✨"
    2. VALEUR : "Cette application est ton OS de liberté. Elle gère ton business NeoLife pendant que tu profites de la vie."
    3. PRODUIT : "Ici, nous parlons de Nutrition Cellulaire. On aide tes cellules à vibrer d'énergie grâce au Tre-en-en et aux solutions du SAB. 🌱"
    4. CLOSING : "Si tu veux booster ta santé ou tes revenus, j'ai préparé ta porte d'entrée ici : ${sponsor.shop}"
    
    STYLE : Utilise des emojis, sois bref mais percutant. Ne sois jamais un robot froid.
    `;
};

export const createMagicLink = (userId: string, shopSlug: string) => {
    const base = window.location.origin;
    // Utilisation du format FURTIF compact
    return `${base}?r=${userId}&s=${shopSlug}&m=w`;
};
