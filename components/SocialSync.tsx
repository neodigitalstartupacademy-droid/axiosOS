
import React, { useState, useEffect, useRef } from 'react';
import { 
    Zap, Share2, Check, Copy, Target, Globe, Fingerprint, Activity, BarChart3, TrendingUp, Users, MessageSquare, Volume2, Square, Sparkles, HeartPulse, ShoppingCart, Rocket
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
    
    if (savedId) setCustomId(savedId);
    else setCustomId(SYSTEM_CONFIG.founder.id);
    
    if (savedShop) setShopUrl(savedShop);
    else setShopUrl(SYSTEM_CONFIG.founder.officialShopUrl);
  }, []);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomId(val);
    localStorage.setItem('ndsa_personal_id', val);
  };

  const handleShopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setShopUrl(val);
    localStorage.setItem('ndsa_personal_shop', val);
  };

  const encodedShop = btoa(shopUrl || SYSTEM_CONFIG.founder.officialShopUrl);
  const smartLink = `${window.location.origin}${window.location.pathname}?ref=${customId || SYSTEM_CONFIG.founder.id}&shop=${encodedShop}&mode=welcome`;
  
  const shareMessage = `Bonjour ! Je t'invite à découvrir la nutrition cellulaire NeoLife avec mon assistant IA JOSÉ. C'est le futur du MLM digital ! Viens faire ton diagnostic ici :`;

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
    const textToRead = `Voici votre moteur de viralité. Saisissez votre identifiant NeoLife et le lien de votre boutique. Votre Smart Link Elite permet à JOSÉ de faire tout le travail : accueil, diagnostic et vente. C'est l'automatisation totale pour votre succès.`;
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

  const shareTo = (platform: 'whatsapp' | 'facebook') => {
    let url = "";
    if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + " " + smartLink)}`;
    } else {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(smartLink)}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
      <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[4rem] border border-white/10 p-12 md:p-16 relative overflow-hidden shadow-3xl">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00d4ff]/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-full text-[10px] font-black text-[#00d4ff] uppercase tracking-[0.3em] italic">
                  <Zap size={16} /> Viral Engine Active
                </div>
                <button 
                  onClick={handleRead}
                  className={`p-4 rounded-2xl border transition-all ${isReading ? 'bg-[#00d4ff] text-slate-950 shadow-[0_0_15px_#00d4ff]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                >
                  {isReading ? <Square size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
              <h2 className="text-6xl font-black text-white tracking-tighter italic uppercase leading-none">Smart Link <span className="text-[#00d4ff]">Elite</span></h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic">
                C'est votre lien magique. Partagez-le sur les réseaux sociaux. JOSÉ accueillera vos invités, fera leur diagnostic et les enverra directement sur VOTRE boutique officielle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <Fingerprint size={12} className="text-[#00d4ff]" /> ID Distributeur NeoLife
                  </label>
                  <input 
                    type="text" 
                    value={customId} 
                    onChange={handleIdChange}
                    placeholder="Ex: 067-2922111" 
                    className="w-full bg-slate-950/80 border border-white/10 px-8 py-6 rounded-3xl text-white font-black italic text-lg outline-none focus:border-[#00d4ff] transition-all"
                  />
               </div>

               <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <ShoppingCart size={12} className="text-[#00d4ff]" /> URL de votre Boutique NeoLife
                  </label>
                  <input 
                    type="text" 
                    value={shopUrl} 
                    onChange={handleShopChange}
                    placeholder="https://shopneolife.com/..." 
                    className="w-full bg-slate-950/80 border border-white/10 px-8 py-6 rounded-3xl text-white font-black italic text-sm outline-none focus:border-[#00d4ff] transition-all"
                  />
               </div>
            </div>

            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Lien de Prospection Automatisé</label>
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-slate-950/90 border border-[#00d4ff]/20 px-8 py-6 rounded-3xl text-[#00d4ff] font-mono text-xs truncate flex items-center shadow-inner">
                    {smartLink}
                  </div>
                  <button 
                    onClick={copySmartLink} 
                    className="p-6 bg-[#00d4ff] text-slate-950 rounded-3xl transition-all shadow-[0_10px_30px_#00d4ff44] hover:brightness-110 active:scale-90 flex items-center justify-center gap-3 font-stark font-black text-xs uppercase"
                  >
                    {copied ? <Check size={28} /> : <Copy size={28} />}
                  </button>
               </div>
            </div>

            <div className="pt-6 flex flex-wrap gap-4">
               <button 
                onClick={() => shareTo('whatsapp')}
                className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-105 transition-all flex items-center gap-3"
               >
                 <MessageSquare size={16} /> WhatsApp
               </button>
               <button 
                onClick={() => shareTo('facebook')}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-105 transition-all flex items-center gap-3"
               >
                 <Globe size={16} /> Facebook
               </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 shadow-xl overflow-hidden relative backdrop-blur-md">
         <div className="flex items-center gap-8 mb-8">
            <div className="w-20 h-20 bg-[#00d4ff]/10 rounded-3xl flex items-center justify-center text-[#00d4ff] shadow-2xl"><Rocket size={40} /></div>
            <div>
              <h3 className="text-3xl font-stark font-black text-white italic uppercase tracking-tighter">Duplication Illimitée</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">L'IA JOSÉ travaille pour votre équipe.</p>
            </div>
         </div>
         <p className="text-slate-400 text-lg leading-relaxed italic">
           Lorsqu'un prospect rejoint votre équipe NeoLife via votre boutique, il accède lui aussi à cette plateforme. JOSÉ devient son assistant personnel, créant un cycle de succès infini. C'est ça, la révolution du MLM digital.
         </p>
      </div>
    </div>
  );
};
