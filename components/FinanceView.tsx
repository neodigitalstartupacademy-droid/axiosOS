
import React, { useState, useRef, useEffect } from 'react';
import { SYSTEM_CONFIG } from '../constants';
import { PricingZone, AuthUser, UserRank } from '../types';
import { 
  Wallet, TrendingUp, Users, ArrowUpRight, DollarSign, ExternalLink, 
  ShieldCheck, Zap, Copy, Check, Briefcase, Globe, Activity, 
  Layers, Volume2, Square, Lock, Rocket, Target, Award
} from 'lucide-react';
import { generateJoseAudio, decodeBase64, decodeAudioData } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface FinanceViewProps {
  user?: AuthUser | null;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ user }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const rank: UserRank = user?.dna?.rank || 'NOVICE';
  const isAmbassador = rank === 'AMBASSADOR' || rank === 'ELITE_DIAMOND';

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
    const textToRead = isAmbassador 
      ? `Félicitations Ambassadeur. Votre portail financier Élite est actif. Vous avez désormais accès aux projections de bonus de profondeur et aux royalties SaaS sur votre réseau.`
      : `Portail financier Standard activé. Pour débloquer les projections d'Empire et les bonus d'Ambassadeur, terminez le module CH-10 de l'Academy NDSA.`;
    
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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Header based on Rank */}
      <div className={`p-8 rounded-[3rem] border transition-all relative overflow-hidden ${isAmbassador ? 'bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl shrink-0 ${isAmbassador ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
             {isAmbassador ? <Award size={40} /> : <Lock size={40} />}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                {isAmbassador ? 'Empire Projections : Élite' : 'Revenue Engine : Standard'}
              </h2>
              <button 
                onClick={handleRead}
                className={`p-3 rounded-2xl border transition-all ${isReading ? 'bg-blue-500 text-slate-950 shadow-lg animate-pulse' : 'bg-white/5 text-slate-500 hover:text-white border-white/10'}`}
              >
                {isReading ? <Square size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
            <p className="text-slate-400 font-medium text-lg mt-1 italic">
              {isAmbassador ? "Accès illimité aux calculateurs de royalties et bonus de duplication." : "Terminez l'Academy pour débloquer les projections d'Ambassadeur."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
              <Users size={24} />
            </div>
            <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">Digital SaaS</span>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">MRR Potentiel</p>
          <h3 className="text-3xl font-black text-white mt-2 font-stark">$1,280.00</h3>
          <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest">Calculé sur 10 Hubs Actifs</p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
              <Activity size={24} />
            </div>
            <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">MLM Volume</span>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Volume NeoLife (PV)</p>
          <h3 className="text-3xl font-black text-white mt-2 font-stark">4,500 PV</h3>
          <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest">Status : Directeur Émeraude</p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20">
              <TrendingUp size={24} />
            </div>
            <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">Bonus Pool</span>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Partage Profit NDSA</p>
          <h3 className="text-3xl font-black text-white mt-2 font-stark">3%</h3>
          <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest">Débloqué au rang Diamond</p>
        </div>

        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-slate-950 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
            <Wallet size={80} />
          </div>
          <div>
            <p className="text-slate-900 text-[10px] font-black uppercase tracking-[0.2em]">Empire Balance</p>
            <h3 className="text-4xl font-stark font-black text-slate-950 mt-2 italic">$4,520.00</h3>
          </div>
          <button className="mt-6 w-full py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl">
            Withdraw Profits
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SaaS Projection Section */}
        <div className="glass-card rounded-[3.5rem] border border-white/5 overflow-hidden flex flex-col">
          <div className="p-10 border-b border-white/5 flex items-center justify-between bg-blue-500/5">
            <div>
              <h3 className="font-black text-white text-xl italic uppercase tracking-tighter">Pôle Digital (SaaS)</h3>
              <p className="text-xs text-slate-500 mt-1 italic uppercase tracking-widest">Revenus des abonnements plateformes</p>
            </div>
            <ShieldCheck className="text-blue-500" size={28} />
          </div>
          <div className="p-10 space-y-8 flex-1">
            <div className="space-y-4">
              {Object.entries(SYSTEM_CONFIG.billing.pricing).map(([zone, data]) => (
                <div key={zone} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${zone === PricingZone.AFRICA ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]'}`}></div>
                    <div>
                      <h4 className="font-black text-white text-sm uppercase tracking-widest">{data.label}</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{zone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-stark font-black text-white italic">{data.amount} <span className="text-xs not-italic">{data.currency}</span></span>
                    <p className="text-[8px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">/ Month</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MLM & Rank Up Section */}
        <div className="glass-card rounded-[3.5rem] border border-white/5 overflow-hidden flex flex-col">
          <div className="p-10 bg-emerald-500/5 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-black text-white text-xl italic uppercase tracking-tighter">Pôle Produit (MLM)</h3>
              <p className="text-xs text-slate-500 mt-1 italic uppercase tracking-widest">Duplication & Volume NeoLife</p>
            </div>
            <Activity className="text-emerald-500" size={28} />
          </div>
          <div className="p-10 space-y-10 flex-1">
            {isAmbassador ? (
              <div className="p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] space-y-6 animate-in zoom-in-95 duration-700">
                <div className="flex items-center gap-4">
                  <Rocket className="text-emerald-400 animate-bounce" size={40} />
                  <div>
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Empire Projection Active</h4>
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Stratégie 3-Directs-Elite</p>
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bonus de Profondeur (L3)</span>
                      <span className="text-lg font-stark text-white font-black">+$2,450.00</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Royalties SaaS Network</span>
                      <span className="text-lg font-stark text-emerald-400 font-black">$840.00 / mo</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 opacity-60">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 mb-4 border border-white/10">
                  <Lock size={32} />
                </div>
                <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Projections Verrouillées</h4>
                <p className="text-slate-500 text-sm italic max-w-xs leading-relaxed">
                  Terminez l'Academy NDSA pour voir vos potentiels de gains en tant qu'Ambassadeur Élite.
                </p>
                <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-slate-950 transition-all">
                  Ouvrir l'Academy
                </button>
              </div>
            )}

            <div className="pt-8 border-t border-white/5">
               <div className="flex items-center gap-4 mb-4">
                  <Target size={16} className="text-amber-500" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Objectif : Diamond Imperium</p>
               </div>
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[45%] animate-pulse shadow-[0_0_10px_#f59e0b]"></div>
               </div>
               <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-2 text-right italic">4,500 PV / 10,000 PV</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
