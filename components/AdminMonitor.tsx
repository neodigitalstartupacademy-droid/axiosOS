
import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, Users, DollarSign, TrendingUp, ShieldAlert, Cpu, Globe, Factory,
  X, Plus, Palette, Eye, Trash2, Server, Database, Unlink, Settings,
  Bot, RotateCw, Box, CheckCircle2, ShieldCheck, ChevronRight, Rocket,
  Layers, Sparkles, Terminal, Activity, PlusCircle, Fingerprint, Zap,
  Lock, Volume2, Square, Star, Globe2, ZapOff
} from 'lucide-react';
import { SYSTEM_CONFIG } from '../constants';
import { AdminMonitorStats, WhiteLabelInstance } from '../types';
import { generateJoseAudio } from '../services/geminiService';

interface AdminMonitorProps {
  stats: AdminMonitorStats;
}

export const AdminMonitor: React.FC<AdminMonitorStats> = ({ stats }) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'factory'>('monitor');
  const [showFactory, setShowFactory] = useState(false);
  const [factoryStep, setFactoryStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [instances, setInstances] = useState<WhiteLabelInstance[]>([]);
  const [isUltimate] = useState(localStorage.getItem('ndsa_ultimate_gold') === 'true');

  const [newClient, setNewClient] = useState<Partial<WhiteLabelInstance>>({
    clientName: '',
    industry: 'Santé & Bien-être',
    aiName: 'José',
    primaryColor: isUltimate ? '#FFD700' : '#00d4ff',
    status: 'ACTIVE'
  });

  useEffect(() => {
    const saved = localStorage.getItem('ndsa_white_label_instances');
    if (saved) setInstances(JSON.parse(saved));
  }, []);

  const handleDeploy = () => {
    if (!newClient.clientName) return;
    setIsDeploying(true);
    setTimeout(() => {
      const instance: WhiteLabelInstance = {
        ...(newClient as WhiteLabelInstance),
        id: `WL-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        deploymentDate: new Date(),
        status: 'ACTIVE',
        isLocked: false,
        royaltyRate: 40,
        setupFee: 1500,
        currency: 'USD',
        catalogType: 'neolife'
      };
      const updated = [instance, ...instances];
      setInstances(updated);
      localStorage.setItem('ndsa_white_label_instances', JSON.stringify(updated));
      setIsDeploying(false);
      setFactoryStep(3);
    }, 4000);
  };

  const GlobalMap = () => (
    <div className={`p-10 rounded-[3rem] border relative overflow-hidden group ${isUltimate ? 'gold-card border-amber-500/20' : 'bg-slate-950/40 border-white/5'}`}>
       <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <Globe2 className={isUltimate ? 'text-amber-500' : 'text-blue-500'} size={28} />
             <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Global Hub Load</h3>
          </div>
          <div className="flex gap-4">
             {['BENIN', 'TOGO', 'USA'].map(c => (
               <div key={c} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{c}</span>
               </div>
             ))}
          </div>
       </div>
       <div className="h-64 w-full bg-black/40 rounded-2xl border border-white/5 relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
          <Activity size={80} className={`${isUltimate ? 'text-amber-500' : 'text-blue-500'} opacity-20`} />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">Neural Network Active</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      {/* Factory Engine Overlay */}
      {showFactory && (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-[500] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
           <div className={`rounded-[4rem] border w-full max-w-4xl p-16 space-y-12 relative overflow-hidden ${isUltimate ? 'gold-card border-amber-500/30 bg-amber-950/20' : 'bg-slate-900 border-white/10'}`}>
              <button onClick={() => { setShowFactory(false); setFactoryStep(1); }} className="absolute top-10 right-10 p-4 text-slate-500 hover:text-white"><X size={24}/></button>
              
              {factoryStep === 1 && (
                <div className="space-y-10">
                   <div className="flex items-center gap-8">
                      <div className={`w-20 h-20 rounded-[2rem] border flex items-center justify-center ${isUltimate ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' : 'bg-blue-500/10 border-blue-500/40 text-blue-400'}`}><Rocket size={40} /></div>
                      <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Clone Master Hub</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nom du Nouveau Hub</label>
                         <input type="text" value={newClient.clientName} onChange={e => setNewClient({...newClient, clientName: e.target.value})} className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl text-white font-black italic outline-none focus:border-blue-500" placeholder="Ex: Elite Wellness Hub" />
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Identité IA</label>
                         <input type="text" value={newClient.aiName} onChange={e => setNewClient({...newClient, aiName: e.target.value})} className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl text-white font-black italic outline-none focus:border-blue-500" placeholder="Ex: José V8" />
                      </div>
                   </div>
                   <button onClick={() => setFactoryStep(2)} className="w-full py-6 bg-blue-500 text-slate-950 font-black rounded-2xl uppercase tracking-widest shadow-2xl">Paramètres ADN Suivant</button>
                </div>
              )}

              {factoryStep === 2 && (
                <div className="text-center space-y-10">
                   <div className="py-12 flex flex-col items-center gap-6">
                      {isDeploying ? (
                         <>
                            <div className="w-32 h-32 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xl font-black text-white italic uppercase animate-pulse">Clonage de l'instance en cours...</p>
                         </>
                      ) : (
                         <>
                            <ShieldCheck size={80} className="text-emerald-500" />
                            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Prêt pour le Déploiement</h3>
                            <button onClick={handleDeploy} className="px-12 py-6 bg-emerald-500 text-slate-950 font-black rounded-2xl uppercase tracking-widest shadow-3xl">Lancer Protocol Omega-7</button>
                         </>
                      )}
                   </div>
                </div>
              )}

              {factoryStep === 3 && (
                 <div className="text-center space-y-10 py-10">
                    <CheckCircle2 size={80} className="text-emerald-500 mx-auto" />
                    <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter">HUB DÉPLOYÉ</h3>
                    <button onClick={() => setShowFactory(false)} className="px-10 py-5 bg-white text-slate-950 font-black rounded-2xl uppercase tracking-widest">Voir Production</button>
                 </div>
              )}
           </div>
        </div>
      )}

      {/* Main Console Header */}
      <header className={`p-12 rounded-[4rem] border flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden ${isUltimate ? 'gold-card border-amber-500/30 bg-amber-950/20' : 'bg-slate-950/40 border-white/5'}`}>
         <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
               <ShieldAlert className={isUltimate ? 'text-amber-500' : 'text-blue-500'} size={24} />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] font-stark">Master Console v8.5</span>
            </div>
            <h2 className={`text-6xl font-black italic uppercase tracking-tighter leading-none ${isUltimate ? 'gold-text-shimmer' : 'text-white'}`}>High Command</h2>
            <div className="flex gap-4">
               <button onClick={() => setActiveTab('monitor')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'monitor' ? 'bg-blue-500 text-slate-950 shadow-2xl' : 'bg-white/5 text-slate-500'}`}>Monitoring</button>
               <button onClick={() => setActiveTab('factory')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'factory' ? 'bg-blue-500 text-slate-950 shadow-2xl' : 'bg-white/5 text-slate-500'}`}>Production Factory</button>
            </div>
         </div>
         <button onClick={() => setShowFactory(true)} className="px-12 py-6 bg-[#00d4ff] text-slate-950 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-3xl hover:scale-105 active:scale-95 transition-all">
            CREATE NEW OMEGA HUB
         </button>
      </header>

      {activeTab === 'monitor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                 {[
                   { label: "SaaS Revenue", val: `$${stats.totalNetSaaS.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400" },
                   { label: "AI Efficiency", val: `${stats.aiEffectiveness}%`, icon: Cpu, color: "text-blue-400" }
                 ].map((s, i) => (
                   <div key={i} className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-3">
                      <s.icon size={24} className={s.color} />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                      <h4 className="text-4xl font-stark font-black text-white italic">{s.val}</h4>
                   </div>
                 ))}
              </div>
              <GlobalMap />
           </div>
           <div className={`p-12 rounded-[4rem] border space-y-10 ${isUltimate ? 'gold-card border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center gap-4">
                 <Terminal size={24} className="text-amber-500" />
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">System Overrides</h3>
              </div>
              <div className="space-y-6">
                 {['GLOBAL_TELEMETRY_VIEW', 'REVENUE_MODERATION', 'AI_NEURAL_OVERRIDE'].map((p, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5">
                      <div className="flex items-center gap-4">
                         <Zap size={16} className="text-amber-400" />
                         <span className="text-xs font-black text-white uppercase tracking-widest">{p}</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase italic">Authorized</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {instances.map(inst => (
             <div key={inst.id} className="glass-card p-10 rounded-[3rem] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xl italic" style={{ color: inst.primaryColor }}>{inst.clientName[0]}</div>
                   <div className="flex gap-2">
                      <button className="p-3 bg-white/5 rounded-xl hover:bg-rose-500/20 text-rose-500 transition-all"><Trash2 size={16}/></button>
                      <button className="p-3 bg-white/5 rounded-xl hover:bg-blue-500/20 text-blue-400 transition-all"><Settings size={16}/></button>
                   </div>
                </div>
                <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter truncate">{inst.clientName}</h4>
                <div className="mt-4 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{inst.id} | {inst.status}</span>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};
