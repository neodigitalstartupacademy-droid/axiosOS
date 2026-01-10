
import React, { useState, useEffect, useRef } from 'react';
import { 
    Zap, Share2, Check, Copy, Globe, Fingerprint, MessageSquare, Volume2, Square, ShoppingCart, Rocket, Linkedin, Instagram, Sparkles, ShieldCheck, Lock, ChevronRight, Share, Cpu, Target, Link as LinkIcon, Radio, Activity, ShieldAlert, Network
} from 'lucide-react';
import { SYSTEM_CONFIG } from '../constants';
import { generateJoseAudio, decodeBase64, decodeAudioData } from '../services/geminiService';

export const SocialSync: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [customId, setCustomId] = useState("");
  const [shopSlug, setShopSlug] = useState("");
  const [isReading, setIsReading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('ndsa_personal_id');
    const savedSlug = localStorage.getItem('ndsa_personal_slug');
    
    setCustomId(savedId || "");
    setShopSlug(savedSlug || "");
  }, []);

  // GÉNÉRATION DU LIEN FURTIF (PROTOCOL V2 - gmbcoreos.com/jose)
  const effectiveId = customId || SYSTEM_CONFIG.founder.id;
  const effectiveSlug = shopSlug || SYSTEM_CONFIG.founder.shop_slug;
  const smartLink = `https://${SYSTEM_CONFIG.officialDomain}/jose?r=${effectiveId}&s=${effectiveSlug}&m=w`;
  
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
    const textToRead = `Activation du Viral Sync Hub sur ${SYSTEM_CONFIG.officialDomain}. Votre moteur de propagation est prêt. Le protocole Stealth V2 masque automatiquement vos identifiants système. Chaque clic via votre lien personnalisé est une donnée sécurisée qui construit votre empire. Partagez votre influence dès maintenant.`;
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
    const shareMessage = `Découvre ton diagnostic de vitalité gratuit avec Coach JOSÉ. Analyse SAB et Loi des 37°C. Cliquez ici :`;
    let url = "";
    switch(platform) {
      case 'whatsapp': url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + " " + smartLink)}`; break;
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(smartLink)}`; break;
      case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(smartLink)}`; break;
      case 'instagram': navigator.clipboard.writeText(smartLink); alert("Lien Furtif copié ! Collez-le dans votre bio Instagram."); return;
    }
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="max-w-[1500px] mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
      
      {/* SECTION 1: HEADER & TELEMETRY */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-12 px-4">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
             <div className="px-5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-3">
                <Radio size={14} className="text-blue-400 animate-pulse" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Signal Status: Broadcast Ready</span>
             </div>
             <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-3">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Stealth V2 Active</span>
             </div>
          </div>
          <h2 className="text-7xl md:text-9xl font-black text-white italic uppercase tracking-tighter leading-none">
            Viral <span className="text-blue-500">Signal</span>
          </h2>
          <p className="text-slate-500 font-medium text-xl max-w-3xl italic leading-relaxed">
            Votre cockpit de distribution massive via <strong>{SYSTEM_CONFIG.officialDomain}/jose</strong>. Générez, masquez et propagez votre influence biologique sur les réseaux mondiaux.
          </p>
        </div>

        {/* SIMULATED RADAR COMPONENT */}
        <div className="w-full xl:w-[450px] aspect-[4/3] glass-card rounded-[3.5rem] p-8 flex flex-col items-center justify-center gap-8 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
           <div className="w-48 h-48 rounded-full border border-blue-500/20 relative flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-blue-500/5 rounded-full scale-110"></div>
              <div className="absolute inset-0 border-2 border-blue-500/5 rounded-full scale-125"></div>
              <div className="w-full h-[1px] bg-blue-500/40 absolute top-1/2 left-0 -rotate-45 origin-center animate-[spin_4s_linear_infinite]"></div>
              <Activity size={48} className="text-blue-500" />
           </div>
           <div className="text-center space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Propagation Network</p>
              <p className="text-3xl font-black text-white italic tracking-tighter">LIVE TELEMETRY</p>
           </div>
        </div>
      </div>

      {/* SECTION 2: THE CORE ENGINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: CONFIGURATION */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 rounded-[3rem] border border-white/5 bg-slate-900/40 space-y-12 h-full">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400"><Fingerprint size={24} /></div>
                 <div>
                    <h3 className="font-stark text-xs font-black text-white uppercase tracking-widest leading-none">Neural DNA</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Identifiants Système</p>
                 </div>
              </div>

              <div className="space-y-10">
                 <div className="space-y-4 group">
                    <div className="flex justify-between items-center px-2">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">ID Sponsor (r)</label>
                       <span className="text-[9px] text-blue-500 font-black uppercase">Verified</span>
                    </div>
                    <input 
                      type="text" 
                      value={customId} 
                      onChange={e => { setCustomId(e.target.value); localStorage.setItem('ndsa_personal_id', e.target.value); }}
                      className="w-full bg-black/40 border border-white/5 px-8 py-6 rounded-2xl text-white font-black italic text-xl outline-none focus:border-blue-500 transition-all shadow-inner"
                      placeholder="Ex: 067-2922111"
                    />
                 </div>
                 <div className="space-y-4 group">
                    <div className="flex justify-between items-center px-2">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Shop Slug (s)</label>
                       <span className="text-[9px] text-blue-500 font-black uppercase">Validated</span>
                    </div>
                    <input 
                      type="text" 
                      value={shopSlug} 
                      onChange={e => { setShopSlug(e.target.value); localStorage.setItem('ndsa_personal_slug', e.target.value); }}
                      className="w-full bg-black/40 border border-white/5 px-8 py-6 rounded-2xl text-white font-black italic text-xl outline-none focus:border-blue-500 transition-all shadow-inner"
                      placeholder="Ex: startupforworld"
                    />
                 </div>
              </div>

              <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl space-y-4">
                 <div className="flex items-center gap-3 text-blue-400">
                    <Lock size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Masking Logic Active</span>
                 </div>
                 <p className="text-[9px] text-slate-500 font-bold leading-relaxed italic uppercase">
                   Le protocole Stealth V2 sur <strong>gmbcoreos.com</strong> remplace les chaînes techniques pour éviter les bannissements publicitaires.
                 </p>
              </div>
           </div>
        </div>

        {/* RIGHT PANEL: LINK & PROPAGATION */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           {/* THE ARTIFACT */}
           <div className="flex-1 glass-card p-12 rounded-[3.5rem] border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent flex flex-col justify-center items-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[shimmer_3s_infinite]"></div>
              
              <div className="relative z-10 w-full space-y-12 text-center">
                 <div className="w-24 h-24 bg-blue-500 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-[0_0_60px_#3b82f644] animate-pulse">
                    <LinkIcon size={40} />
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Lien Intelligent Master</h4>
                    <div className="bg-black/80 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative group-hover:border-blue-500/30 transition-all">
                       <p className="text-2xl md:text-3xl font-mono text-blue-400 truncate tracking-tighter italic">
                          {smartLink}
                       </p>
                       <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-slate-950 text-[9px] font-black uppercase rounded-lg">
                          Secure Vector V7.1
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
                    <button 
                      onClick={copySmartLink}
                      className="w-full md:w-auto px-16 py-8 bg-white text-slate-950 rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-3xl group"
                    >
                      {copied ? <Check size={24} className="text-emerald-600" /> : <Copy size={24} />}
                      {copied ? "SIGNAL COPIÉ !" : "COPIER MON SIGNAL"}
                    </button>
                    <button 
                      onClick={handleRead}
                      className={`w-20 h-20 rounded-[1.5rem] border transition-all flex items-center justify-center ${isReading ? 'bg-blue-500 border-blue-500 text-slate-950' : 'bg-white/5 border-white/10 text-slate-500'}`}
                    >
                      {isReading ? <Square size={24} /> : <Volume2 size={24} />}
                    </button>
                 </div>
              </div>
           </div>

           {/* PROPAGATION DOCK */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { id: 'whatsapp', name: 'WhatsApp', color: 'bg-emerald-600', hover: 'hover:bg-emerald-500', icon: MessageSquare },
                { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', hover: 'hover:bg-blue-600', icon: Linkedin },
                { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', hover: 'hover:brightness-110', icon: Instagram },
                { id: 'facebook', name: 'Facebook', color: 'bg-blue-900', hover: 'hover:bg-blue-800', icon: Globe },
              ].map(p => (
                <button 
                  key={p.id} 
                  onClick={() => shareTo(p.id as any)}
                  className={`${p.color} ${p.hover} p-10 rounded-[3rem] text-white flex flex-col items-center justify-center gap-4 transition-all hover:-translate-y-2 shadow-2xl group`}
                >
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <p.icon size={28} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">{p.name}</span>
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* SECTION 3: FOOTER ACTIONS */}
      <div className="glass-card p-10 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] flex items-center justify-center text-amber-400">
               <Rocket size={36} />
            </div>
            <div>
               <h4 className="font-black text-white italic uppercase tracking-widest text-lg">Expansion Stratégique</h4>
               <p className="text-slate-500 text-sm mt-1 italic">
                 "Chaque clic sur <strong>gmbcoreos.com/jose</strong> est une porte ouverte vers la liberté biologique." — Coach José
               </p>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
               Guide Stealth V2
            </button>
            <button className="px-10 py-5 bg-blue-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:brightness-110 transition-all">
               Voir Mes Clics
            </button>
         </div>
      </div>

    </div>
  );
};
