
import React, { useState, useEffect, useRef } from 'react';
import { 
    Zap, Share2, Check, Copy, Globe, Fingerprint, MessageSquare, Volume2, Square, ShoppingCart, Rocket, Linkedin, Instagram, Sparkles
} from 'lucide-react';
import { SYSTEM_CONFIG } from '../constants';
import { generateJoseAudio, decodeBase64, decodeAudioData } from '../services/geminiService';

export const SocialSync: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [customId, setCustomId] = useState("");
  const [shopUrl, setShopUrl] = useState("");
  const [isReading, setIsReading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('ndsa_personal_id');
    const savedShop = localStorage.getItem('ndsa_personal_shop');
    setCustomId(savedId || SYSTEM_CONFIG.founder.id);
    setShopUrl(savedShop || SYSTEM_CONFIG.founder.officialShopUrl);
  }, []);

  const encodedShop = btoa(shopUrl || SYSTEM_CONFIG.founder.officialShopUrl);
  const smartLink = `${window.location.origin}${window.location.pathname}?ref=${customId || SYSTEM_CONFIG.founder.id}&shop=${encodedShop}&mode=welcome`;
  
  const stopAudio = () => {
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch (e) {}
      activeSourceRef.current = null;
    }
    setIsReading(false);
  };

  const handleRead = async () => {
    if (isReading) { stopAudio(); return; }
    setIsReading(true);
    const textToRead = `Voici votre Social Link Engine v7. Propagez votre Aura digitale sur LinkedIn, Instagram et au-delà. JOSÉ s'occupe de la conversion.`;
    const base64 = await generateJoseAudio(textToRead);
    if (base64) {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
      const decoded = decodeBase64(base64);
      const audioBuffer = await decodeAudioData(decoded, audioContextRef.current, 24000, 1);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      activeSourceRef.current = source;
      source.start();
      source.onended = () => setIsReading(false);
    } else { setIsReading(false); }
  };

  const copySmartLink = () => {
    navigator.clipboard.writeText(smartLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTo = (platform: 'whatsapp' | 'facebook' | 'linkedin' | 'instagram') => {
    const shareMessage = `Bonjour ! Découvre la nutrition cellulaire NeoLife avec l'IA JOSÉ. C'est le futur du MLM digital ! Diagnostic ici :`;
    let url = "";
    switch(platform) {
      case 'whatsapp': url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + " " + smartLink)}`; break;
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(smartLink)}`; break;
      case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(smartLink)}`; break;
      case 'instagram': navigator.clipboard.writeText(smartLink); alert("Lien copié pour Instagram !"); return;
    }
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-40 animate-in fade-in duration-1000">
      <div className="bg-black/20 backdrop-blur-3xl rounded-[6rem] border border-white/5 p-20 md:p-24 relative overflow-hidden shadow-3xl">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00d4ff]/5 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col gap-24">
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-4 px-8 py-3.5 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-full text-[12px] font-black text-[#00d4ff] uppercase tracking-[0.5em] italic shadow-2xl">
                <Zap size={20} className="animate-pulse" /> Social Engine Active
              </div>
              <button onClick={handleRead} className={`w-20 h-20 rounded-[2rem] border transition-all flex items-center justify-center ${isReading ? 'bg-[#00d4ff] text-slate-950 animate-pulse' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                {isReading ? <Square size={28} /> : <Volume2 size={28} />}
              </button>
            </div>
            <h2 className="text-[9rem] font-black text-white tracking-tighter italic uppercase leading-[0.8] drop-shadow-2xl">AURA <span className="text-[#00d4ff]">LINK</span></h2>
            <p className="text-slate-400 text-3xl font-medium leading-relaxed max-w-4xl italic opacity-90">
              Diffusez votre impact bio-cellulaire. JOSÉ capture chaque clic et guide vos prospects vers la restauration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
             <div className="space-y-8">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] ml-6 flex items-center gap-4">
                  <Fingerprint size={16} className="text-[#00d4ff]" /> ID Distributeur
                </label>
                <input type="text" value={customId} onChange={e => { setCustomId(e.target.value); localStorage.setItem('ndsa_personal_id', e.target.value); }} className="w-full bg-black/40 border border-white/5 px-10 py-8 rounded-[3rem] text-white font-black italic text-2xl outline-none focus:border-[#00d4ff] transition-all shadow-inner" />
             </div>
             <div className="space-y-8">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] ml-6 flex items-center gap-4">
                  <ShoppingCart size={16} className="text-[#00d4ff]" /> Official Shop URL
                </label>
                <input type="text" value={shopUrl} onChange={e => { setShopUrl(e.target.value); localStorage.setItem('ndsa_personal_shop', e.target.value); }} className="w-full bg-black/40 border border-white/5 px-10 py-8 rounded-[3rem] text-white font-black italic text-xl outline-none focus:border-[#00d4ff] transition-all shadow-inner" />
             </div>
          </div>

          <div className="space-y-10">
             <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] ml-6">Smart Link Elite</label>
             <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex-1 bg-black/60 border border-[#00d4ff]/20 px-12 py-10 rounded-[3.5rem] text-[#00d4ff] font-mono text-lg truncate flex items-center shadow-inner tracking-tight">{smartLink}</div>
                <button onClick={copySmartLink} className="p-10 bg-[#00d4ff] text-slate-950 rounded-[3.5rem] transition-all shadow-[0_0_50px_#00d4ff44] hover:scale-110 active:scale-95 flex items-center justify-center gap-6">
                  {copied ? <Check size={44} /> : <Copy size={44} />}
                </button>
             </div>
          </div>

          <div className="pt-10 flex flex-wrap gap-8 justify-center lg:justify-start">
             {[
               { id: 'whatsapp', label: 'WhatsApp', color: 'bg-emerald-600', icon: MessageSquare },
               { id: 'linkedin', label: 'LinkedIn', color: 'bg-[#0077b5]', icon: Linkedin },
               { id: 'instagram', label: 'Instagram', color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', icon: Instagram },
               { id: 'facebook', label: 'Facebook', color: 'bg-blue-700', icon: Globe },
             ].map(plat => (
               <button key={plat.id} onClick={() => shareTo(plat.id as any)} className={`${plat.color} px-12 py-6 rounded-[2.5rem] text-white font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-110 transition-all flex items-center gap-5`}>
                 <plat.icon size={22} /> {plat.label}
               </button>
             ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white/5 p-24 rounded-[7rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
         <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-32 h-32 bg-[#00d4ff]/10 rounded-[3rem] flex items-center justify-center text-[#00d4ff] shadow-3xl group-hover:scale-110 transition-transform"><Rocket size={64} /></div>
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <h3 className="text-5xl font-stark font-black text-white italic uppercase tracking-tighter">Vecteur d'Expansion</h3>
              <p className="text-slate-400 text-3xl leading-relaxed italic opacity-90">
                Chaque partage renforce le maillage de votre empire. JOSÉ analyse les origines des flux pour optimiser vos futures campagnes de psychiatrie cellulaire.
              </p>
            </div>
            <Sparkles size={80} className="text-[#00d4ff] opacity-10 animate-pulse hidden lg:block" />
         </div>
      </div>
    </div>
  );
};
