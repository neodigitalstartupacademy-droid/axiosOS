import React, { useState, useEffect, useRef } from 'react';
import { 
    Zap, Share2, Check, Copy, Globe, Fingerprint, MessageSquare, Volume2, Square, ShoppingCart, Rocket, Linkedin, Instagram, Sparkles, ShieldCheck, Lock, ChevronRight, Share, Cpu, Target, Link as LinkIcon, Radio, Activity, ShieldAlert, Network, Loader2, ExternalLink, RefreshCw
} from 'lucide-react';
import { SYSTEM_CONFIG } from '../constants';
import { generateJoseAudio, decodeBase64, decodeAudioData } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { referralService } from '../services/referralService';

export const SocialSync: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customId, setCustomId] = useState("");
  const [shopSlug, setShopSlug] = useState("");
  const [isReading, setIsReading] = useState(false);
  
  useEffect(() => {
    const savedId = localStorage.getItem('ndsa_personal_id');
    const savedSlug = localStorage.getItem('ndsa_personal_slug');
    setCustomId(savedId || "");
    setShopSlug(savedSlug || "");
  }, []);

  const effectiveId = customId || SYSTEM_CONFIG.founder.id;
  const effectiveSlug = shopSlug || SYSTEM_CONFIG.founder.shop_slug;
  const stealthLink = referralService.generateStealthLink(effectiveId, effectiveSlug);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    localStorage.setItem('ndsa_personal_id', customId);
    localStorage.setItem('ndsa_personal_slug', shopSlug);
    setTimeout(() => {
        setIsGenerating(false);
        voiceService.play("Lien furtif encodé. Votre signal est maintenant indétectable par les filtres de spam.", 'gen_link');
    }, 1200);
  };

  const copyStealthLink = () => {
    navigator.clipboard.writeText(stealthLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTo = (platform: 'whatsapp' | 'facebook' | 'linkedin' | 'instagram') => {
    const shareMessage = `Active ton diagnostic de restauration biologique 4K avec Coach JOSÉ ici :`;
    let url = "";
    switch(platform) {
      case 'whatsapp': url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + " " + stealthLink)}`; break;
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(stealthLink)}`; break;
      case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(stealthLink)}`; break;
      case 'instagram': navigator.clipboard.writeText(stealthLink); alert("Lien Furtif copié ! Collez-le dans votre bio."); return;
    }
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-16 animate-in fade-in duration-1000">
      <div className="flex flex-col xl:flex-row justify-between items-start gap-8 px-4">
        <div className="space-y-4 flex-1">
          <div className="flex flex-wrap items-center gap-3">
             <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2">
                <Radio size={12} className="text-blue-400 animate-pulse" />
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Stealth Core V9.3</span>
             </div>
             <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Zero-Spam Filter</span>
             </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
            Viral <span className="text-blue-500">Sync</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl italic leading-relaxed">
            Générez des liens **furtifs** qui convertissent vos contacts en leads qualifiés sans être bloqués par les réseaux sociaux.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
           <div className="glass-card p-8 rounded-3xl border border-white/5 bg-slate-900/40 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400"><Fingerprint size={20} /></div>
                 <div>
                    <h3 className="font-stark text-[10px] font-black text-white uppercase tracking-widest leading-none">Identité Sync</h3>
                    <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">Séquençage URL</p>
                 </div>
              </div>
              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">ID NeoLife</label>
                    <input type="text" value={customId} onChange={e => setCustomId(e.target.value)} className="w-full bg-black/40 border border-white/10 px-6 py-4 rounded-xl text-white font-black italic text-lg outline-none focus:border-blue-500 transition-all" placeholder="Ex: 067-2922111"/>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Slug Boutique</label>
                    <input type="text" value={shopSlug} onChange={e => setShopSlug(e.target.value)} className="w-full bg-black/40 border border-white/10 px-6 py-4 rounded-xl text-white font-black italic text-lg outline-none focus:border-blue-500 transition-all" placeholder="Ex: startupforworld"/>
                 </div>
                 <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-5 bg-blue-500 text-slate-950 font-black rounded-xl uppercase tracking-widest text-[10px] shadow-xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all">
                   {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                   {isGenerating ? "Encodage Furtif..." : "Synchroniser le Signal"}
                 </button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="flex-1 glass-card p-8 rounded-[2.5rem] border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent flex flex-col justify-center items-center relative overflow-hidden group">
              <div className="relative z-10 w-full space-y-8 text-center">
                 <div className="w-16 h-16 bg-blue-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                    <LinkIcon size={28} />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Signal Furtif Certifié</h4>
                    <div className="bg-black/60 p-6 md:p-8 rounded-3xl border border-white/5 shadow-inner relative group-hover:border-blue-500/30 transition-all overflow-hidden max-w-full">
                       <p className="text-lg md:text-2xl font-mono text-blue-400 truncate tracking-tighter italic">
                          {stealthLink}
                       </p>
                    </div>
                 </div>
                 <div className="flex items-center justify-center gap-4 pt-2">
                    <button onClick={copyStealthLink} className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl">
                      {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                      {copied ? "SIGNAL COPIÉ" : "COPIER LE LIEN FURTIF"}
                    </button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'whatsapp', name: 'WhatsApp', color: 'bg-emerald-600', hover: 'hover:bg-emerald-500', icon: MessageSquare },
                { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', hover: 'hover:bg-blue-600', icon: Linkedin },
                { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', hover: 'hover:brightness-110', icon: Instagram },
                { id: 'facebook', name: 'Facebook', color: 'bg-blue-900', hover: 'hover:bg-blue-800', icon: Globe },
              ].map(p => (
                <button key={p.id} onClick={() => shareTo(p.id as any)} className={`${p.color} ${p.hover} p-6 rounded-3xl text-white flex flex-col items-center justify-center gap-3 transition-all hover:-translate-y-1 shadow-lg group`}>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <p.icon size={20} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{p.name}</span>
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};