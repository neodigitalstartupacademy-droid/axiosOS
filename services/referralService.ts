import { SYSTEM_CONFIG } from '../constants';
import { ReferralContext } from '../types';

export const referralService = {
  // Encodage furtif (Base64 URL Safe)
  encodeSync(r: string, s: string): string {
    // Sanitisation : suppression des accents et espaces pour la sécurité URL
    const cleanR = r.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
    const cleanS = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
    const data = `${cleanR}|${cleanS}`;
    return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },

  // Decodage furtif
  decodeSync(sync: string): { r: string; s: string } | null {
    try {
      const base64 = sync.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(base64);
      const [r, s] = decoded.split('|');
      return { r, s };
    } catch (e) {
      return null;
    }
  },

  captureReferral(): ReferralContext | null {
    const params = new URLSearchParams(window.location.search);
    const sync = params.get('sync'); 
    
    // Support legacy and stealth
    let r = params.get('r');
    let s = params.get('s');

    if (sync) {
      const decoded = this.decodeSync(sync);
      if (decoded) {
        r = decoded.r;
        s = decoded.s;
      }
    }

    if (r) {
      const context: ReferralContext = {
        referrerId: r,
        referrerName: (r === SYSTEM_CONFIG.founder.id || r === "startupforworld" || r === "JoseGaetan") 
          ? SYSTEM_CONFIG.founder.name 
          : "Expert NDSA",
        shopUrl: s ? `https://shopneolife.com/${s}/shop/atoz` : SYSTEM_CONFIG.founder.officialShopUrl,
        language: 'fr'
      };
      
      sessionStorage.setItem('ndsa_active_ref', JSON.stringify(context));
      // Nettoyage de l'URL pour garder le mode furtif
      window.history.replaceState({}, '', window.location.pathname);
      return context;
    }

    const saved = sessionStorage.getItem('ndsa_active_ref');
    return saved ? JSON.parse(saved) : null;
  },

  getStoredReferral(): ReferralContext | null {
    const saved = sessionStorage.getItem('ndsa_active_ref');
    return saved ? JSON.parse(saved) : null;
  },

  generateStealthLink(r: string, s: string): string {
    const syncKey = this.encodeSync(r, s);
    return `https://${SYSTEM_CONFIG.officialDomain}/jose?sync=${syncKey}`;
  },

  async notifySponsor(leadName: string, focus: string) {
    const ref = this.getStoredReferral();
    if (!ref) return;
    console.log(`[STARK SYNC] Lead ${leadName} (Focus: ${focus}) associe au parrain ${ref.referrerId}`);
  }
};