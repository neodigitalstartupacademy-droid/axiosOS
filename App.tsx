
import React, { useState, useEffect } from 'react';
import { SYSTEM_CONFIG, I18N } from './constants';
import { AssistantJose } from './components/AssistantJose';
import { AcademyView } from './components/AcademyView';
import { SocialSync } from './components/SocialSync';
import { FinanceView } from './components/FinanceView';
import { AdminMonitor } from './components/AdminMonitor';
import { LeadChart } from './components/LeadChart';
import { AuthView } from './components/AuthView';
import { ProfileView } from './components/ProfileView';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ConversionNotification } from './components/ConversionNotification';
import { DiagnosticHistory } from './components/DiagnosticHistory';
import { LegalDisclaimer } from './components/LegalDisclaimer';
import { Language, AuthUser } from './types'; 
import { voiceService } from './services/voiceService';
import { 
  LayoutDashboard, Bot, GraduationCap, Share2, Wallet, Menu,
  Zap, Settings, Layers, Cpu, Rocket, Volume2, Square, Trophy, ShieldCheck, User,
  ClipboardList, Globe, Activity, Wifi, AudioLines, Sparkles, Diamond
} from 'lucide-react';

type TabType = 'stats' | 'jose' | 'academy' | 'social' | 'finance' | 'admin' | 'profile' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [lang, setLang] = useState<Language>('fr');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState(99.9998);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const t = I18N[lang];

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((speaking, key) => {
      setIsSpeaking(speaking);
      setActiveSpeechKey(key);
    });

    const syncTimer = setInterval(() => setSyncStatus(prev => +(prev + (Math.random() * 0.0001 - 0.00005)).toFixed(6)), 5000);
    
    const savedSession = localStorage.getItem('ndsa_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession) as AuthUser;
        setCurrentUser(user);
        if (!localStorage.getItem(`ndsa_onboarding_${user.id}`)) setShowOnboarding(true);
      } catch (e) {}
    }
    
    setIsAuthLoading(false);
    return () => { unsubVoice(); clearInterval(syncTimer); };
  }, []);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveTab('stats');
    if (!localStorage.getItem(`ndsa_onboarding_${user.id}`)) setShowOnboarding(true);
  };

  const readPageBrief = () => {
    let brief = "";
    switch(activeTab) {
      case 'stats': brief = "Commandant Brasfield, vos vecteurs de croissance NeoLife sont à leur apogée. Système Imperium stabilisé."; break;
      case 'jose': brief = "Terminal JOSÉ v6. Scan bio-moléculaire et détection thermique actifs."; break;
      case 'academy': brief = "Bio-Academy Brasfield. Maîtrisez les lois de la psychiatrie cellulaire."; break;
      case 'social': brief = "Moteur de viralité NDSA. Propagation de l'impact en cours."; break;
      case 'finance': brief = "Terminal Financier Diamond. Flux SaaS et MLM audités."; break;
      default: brief = `Système Stark Imperium opérationnel.`;
    }
    voiceService.play(brief, `brief_${activeTab}`, lang);
  };

  if (isAuthLoading) return null;
  if (!currentUser && new URLSearchParams(window.location.search).get('mode') !== 'welcome') return <AuthView onLogin={handleLogin} />;

  const myReferralLink = currentUser 
    ? `${window.location.origin}${window.location.pathname}?ref=${currentUser.neoLifeId}&mode=welcome`
    : `${window.location.origin}${window.location.pathname}?ref=${SYSTEM_CONFIG.founder.id}&mode=welcome`;

  return (
    <div className="min-h-screen flex font-sans antialiased text-white overflow-hidden selection:bg-[#00d4ff] selection:text-slate-900">
      
      {/* 2026 Neural Wave HUD - Futuristic Audio Feedback */}
      {isSpeaking && (
        <div className="fixed top-0 left-0 right-0 h-20 z-[2000] flex items-center justify-center pointer-events-none px-4">
          <div className="glass-card px-12 py-5 rounded-full border border-[#00d4ff]/60 flex items-center gap-8 animate-in slide-in-from-top duration-1000">
            <div className="flex items-end h-8 gap-1">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.05}s` }}></div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="font-stark text-[10px] font-black text-[#00d4ff] uppercase tracking-[0.4em]">Neural Stream Active</span>
              <span className="font-stark text-[8px] text-slate-500 uppercase tracking-widest">{activeSpeechKey}</span>
            </div>
          </div>
        </div>
      )}

      {showOnboarding && <OnboardingWizard onClose={() => setShowOnboarding(false)} />}
      {showNotification && <ConversionNotification prospectCountry="France" healthFocus="Psychiatrie Cellulaire" onClose={() => setShowNotification(false)} onSocialSync={() => setActiveTab('social')} />}

      {/* Stark Sidebar - Monolithic & Sleek */}
      <aside className={`fixed inset-y-0 left-0 w-80 glass-card z-50 transition-transform lg:translate-x-0 lg:static border-r border-white/5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 h-full flex flex-col">
          <div className="flex items-center gap-5 mb-20 px-2 group cursor-pointer">
            <div className="w-16 h-16 rounded-[2rem] flex items-center justify-center bg-gradient-to-br from-[#00d4ff] to-blue-900 shadow-[0_0_40px_#00d4ff33] border border-white/10 group-hover:scale-110 transition-transform">
              <Layers size={32} className="text-white" />
            </div>
            <div>
              <h1 className="font-stark font-black text-2xl tracking-tighter uppercase leading-none hologram-text">{SYSTEM_CONFIG.brand}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
                <p className="font-stark text-[11px] text-emerald-400 font-bold tracking-[0.2em] uppercase italic">IMPERIUM v6.0</p>
              </div>
            </div>
          </div>

          <nav className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
            {[
              { id: 'stats', label: t.dashboard, icon: LayoutDashboard },
              { id: 'jose', label: t.jose, icon: Bot },
              { id: 'history', label: "Bio-Archives", icon: ClipboardList },
              { id: 'academy', label: t.academy, icon: GraduationCap },
              { id: 'social', label: t.social, icon: Share2 },
              { id: 'finance', label: t.finance, icon: Wallet },
              { id: 'profile', label: "Command Profile", icon: User },
              ...(currentUser?.role === 'ADMIN' ? [{ id: 'admin', label: t.admin, icon: Settings }] : []),
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); voiceService.stop(); }} 
                className={`w-full flex items-center gap-6 px-8 py-6 rounded-[2.5rem] text-[13px] font-bold transition-all uppercase tracking-[0.2em] group ${activeTab === item.id ? 'bg-[#00d4ff] text-slate-900 font-black shadow-[0_0_40px_#00d4ff66]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon size={22} className={activeTab === item.id ? 'scale-110' : 'group-hover:scale-110 transition-transform'} /> 
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-12 pt-10 border-t border-white/5 space-y-6">
             <div className="p-8 bg-black/50 rounded-[3rem] border border-[#00d4ff]/20 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                   <p className="font-stark text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Core Stability</p>
                   <Wifi size={16} className="text-emerald-500" />
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5">
                   <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] rounded-full" style={{ width: `${syncStatus}%` }}></div>
                </div>
                <p className="font-stark text-[11px] text-emerald-400 font-black mt-3 text-right tabular-nums">{syncStatus}%</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Bridge Deck - Carbon & Light Architecture */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <header className="h-36 px-16 flex items-center justify-between relative bg-black/30 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
          <div className="flex items-center gap-10 relative z-10">
            <button className="lg:hidden p-5 bg-white/5 border border-white/10 rounded-2xl" onClick={() => setIsSidebarOpen(true)}><Menu size={28} /></button>
            <div className="hidden xl:flex flex-col">
              <p className="font-stark text-[11px] font-black text-[#00d4ff] uppercase tracking-[0.6em] italic mb-2">STARK INDUSTRIES PROTOCOL</p>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Command Master Hub</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-8 relative z-10">
             <div className="flex items-center bg-black/60 border border-white/10 rounded-[2rem] p-1.5 shadow-2xl backdrop-blur-3xl">
                {(['fr', 'en', 'it', 'es'] as Language[]).map(l => (
                  <button key={l} onClick={() => { setLang(l); voiceService.stop(); }} className={`px-7 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${lang === l ? 'bg-[#00d4ff] text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}>{l}</button>
                ))}
             </div>

             <button onClick={readPageBrief} className={`w-16 h-16 rounded-[1.8rem] border transition-all flex items-center justify-center ${activeSpeechKey?.startsWith('brief_') ? 'bg-[#00d4ff] text-slate-900 shadow-[0_0_30px_#00d4ff]' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:border-[#00d4ff]/60'}`}>
                {activeSpeechKey?.startsWith('brief_') ? <Square size={26} /> : <Volume2 size={26} />}
             </button>
             
             <div onClick={() => setActiveTab('profile')} className="h-16 w-16 rounded-[1.8rem] flex items-center justify-center cursor-pointer overflow-hidden border-2 border-[#00d4ff]/50 shadow-[0_0_25px_#00d4ff44] hover:scale-110 transition-transform group bg-slate-900">
                <img src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`} alt="Avatar" className="w-full h-full object-cover group-hover:brightness-125" />
             </div>
          </div>
        </header>

        <div className="p-16 flex-1 overflow-y-auto no-scrollbar pb-40">
          {activeTab === 'stats' && <DashboardContent t={t} stats={{ prospects: 124, salesVolume: 5840, subscriptionMRR: 2150, commissions: 430, conversions: 18, activeAffiliates: 24 }} myReferralLink={myReferralLink} />}
          {activeTab === 'jose' && <AssistantJose language={lang} currentSubscriberId={currentUser?.neoLifeId} />}
          {activeTab === 'history' && <DiagnosticHistory />}
          {activeTab === 'academy' && <AcademyView />}
          {activeTab === 'social' && <SocialSync />}
          {activeTab === 'finance' && <FinanceView />}
          {activeTab === 'profile' && currentUser && <ProfileView user={currentUser} onUpdate={(u) => setCurrentUser(u)} onLogout={() => { localStorage.removeItem('ndsa_session'); setCurrentUser(null); voiceService.stop(); }} />}
          {activeTab === 'admin' && currentUser?.role === 'ADMIN' && <AdminMonitor stats={{ totalNetSaaS: 145200, aiEffectiveness: 98.5, orphanLeadsCount: 2450, totalActiveHubs: 42 }} />}
        </div>
      </main>
    </div>
  );
};

const DashboardContent = ({ t, stats, myReferralLink }: any) => (
    <div className="space-y-20 animate-in fade-in duration-1000">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-16">
          <header className="space-y-8">
            <h2 className="font-stark text-9xl font-black text-white tracking-tighter leading-none italic uppercase drop-shadow-[0_0_30px_rgba(0,212,255,0.3)]">{t.dashboard}</h2>
            <div className="flex items-center gap-8">
              <span className="h-1.5 w-40 bg-gradient-to-r from-[#00d4ff] to-transparent"></span>
              <p className="text-slate-400 font-medium text-3xl italic opacity-90 uppercase tracking-[0.5em]">Executive Strategic Command</p>
            </div>
          </header>
          <div className="flex items-center gap-12 glass-card p-14 rounded-[5rem] border border-[#00d4ff]/40 shadow-[0_0_60px_rgba(0,212,255,0.15)] bg-black/40">
             <div className="text-right">
                <p className="font-stark text-[12px] font-black text-slate-500 uppercase tracking-widest italic opacity-70 mb-3">Rank Certification</p>
                <p className="font-stark text-5xl font-black text-[#FFD700] italic uppercase tracking-tighter flex items-center gap-5 drop-shadow-[0_0_15px_#FFD70066]">
                  <Diamond size={44} /> DIAMOND ELITE
                </p>
             </div>
             <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 shadow-[0_0_30px_#10b98144] border border-emerald-500/30"><ShieldCheck size={56} /></div>
          </div>
        </div>

        <section className="glass-card rounded-[6rem] p-24 md:p-32 text-white relative overflow-hidden group border-white/5 shadow-3xl">
           <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#00d4ff]/10 rounded-full blur-[200px] -mr-96 -mt-96 animate-pulse pointer-events-none"></div>
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-32">
              <div className="space-y-16 flex-1">
                 <h3 className="font-stark text-9xl font-black tracking-tighter leading-none italic uppercase leading-[0.85]">IMPERIUM <span className="text-[#00d4ff]">SYNC</span></h3>
                 <p className="text-slate-400 text-3xl font-medium max-w-4xl italic leading-relaxed opacity-95">L'architecture de conversion biomoléculaire par excellence. Propulsez votre vision NeoLife avec la puissance Stark.</p>
                 <div className="flex flex-col md:flex-row gap-8 items-center max-w-5xl">
                    <div className="flex-1 w-full bg-black/80 border border-white/10 px-12 py-8 rounded-[3rem] font-mono text-[#00d4ff] text-lg truncate shadow-inner">{myReferralLink}</div>
                    <button onClick={() => { navigator.clipboard.writeText(myReferralLink); alert("Neural link established."); }} className="p-10 stark-btn-glow rounded-[3rem] active:scale-95 transition-all"><Share2 size={36} /></button>
                 </div>
                 <button className="px-24 py-12 bg-white text-slate-900 font-stark font-black rounded-[4rem] uppercase tracking-[0.6em] text-sm shadow-[0_40px_80px_rgba(255,255,255,0.2)] flex items-center justify-center gap-10 hover:bg-[#00d4ff] transition-all italic group">
                    <Rocket size={40} className="group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform" /> {t.propulsion}
                 </button>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
                { label: "Vecteurs Prospects", value: stats.prospects, color: "text-[#00d4ff]", icon: Rocket, bg: "bg-blue-500/5" },
                { label: "Volume MLM (PV)", value: stats.salesVolume, color: "text-emerald-400", icon: Layers, bg: "bg-emerald-500/5" },
                { label: "Dividendes SaaS", value: `$${stats.commissions}`, color: "text-[#FFD700]", icon: Wallet, bg: "bg-amber-500/5" },
                { label: "Taux Conversion", value: `${stats.conversions}%`, color: "text-rose-400", icon: Bot, bg: "bg-rose-500/5" },
            ].map((stat, i) => (
                <div key={i} className={`glass-card p-14 rounded-[5rem] border border-white/10 relative group overflow-hidden ${stat.bg} hover:border-[#00d4ff]/50 shadow-2xl`}>
                    <stat.icon size={56} className={`${stat.color} mb-12 relative z-10 opacity-80 group-hover:scale-125 transition-transform duration-1000`} />
                    <p className="font-stark text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] italic relative z-10">{stat.label}</p>
                    <h3 className={`font-stark text-6xl font-black ${stat.color} mt-8 italic tracking-tighter relative z-10 tabular-nums`}>{stat.value}</h3>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <LeadChart />
          <section className="glass-card p-20 rounded-[6rem] flex flex-col justify-center relative overflow-hidden group shadow-3xl bg-black/40">
             <div className="absolute top-0 right-0 p-24 opacity-[0.04] group-hover:scale-110 transition-transform duration-[6s] pointer-events-none text-[#00d4ff]"><Cpu size={500} /></div>
             <h4 className="font-stark text-5xl font-black text-white italic mb-12 uppercase tracking-tight flex items-center gap-8"><Bot size={56} className="text-[#00d4ff] hologram-text" /> COGNITIVE CORE</h4>
             <p className="text-slate-400 text-3xl leading-relaxed italic opacity-95 max-w-2xl">L'IA JOSÉ automatise le closing clinique via l'analyse SAB 2.0. Votre réseau se densifie pendant que vous construisez votre héritage mondial.</p>
             <div className="mt-20 p-12 bg-black/60 rounded-[4rem] border border-[#00d4ff]/20 flex items-center justify-between group cursor-pointer hover:border-[#00d4ff]/60 transition-all shadow-inner">
                <div>
                   <p className="font-stark text-[11px] font-black text-slate-500 uppercase tracking-widest italic opacity-70 mb-3">Global Health Status</p>
                   <p className="font-stark text-3xl font-black text-emerald-400 italic uppercase tracking-[0.4em] drop-shadow-[0_0_10px_#10b98166]">SECURE & OPTIMIZED</p>
                </div>
                <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[0_0_40px_#10b98155] animate-pulse border border-emerald-500/30"><ShieldCheck size={48} /></div>
             </div>
          </section>
        </div>
    </div>
);

export default App;
