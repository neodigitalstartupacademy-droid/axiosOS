
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
import { MilestoneModal } from './components/MilestoneModal';
import { DiagnosticHistory } from './components/DiagnosticHistory';
import { LegalDisclaimer } from './components/LegalDisclaimer';
import { Language, AuthUser } from './types'; 
import { voiceService } from './services/voiceService';
import { getCurrentSponsor } from './services/referralService';
import { 
  LayoutDashboard, Bot, GraduationCap, Share2, Wallet, Menu,
  Zap, Settings, Layers, Cpu, Rocket, Volume2, Square, Clock, Trophy, ShieldCheck, User,
  ClipboardList, Globe, ShieldAlert, X, MousePointer2, Activity, Wifi, AudioLines
} from 'lucide-react';

type TabType = 'stats' | 'jose' | 'academy' | 'social' | 'finance' | 'admin' | 'profile' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [lang, setLang] = useState<Language>('fr');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const [isSpeakingGlobal, setIsSpeakingGlobal] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState(99.4);
  const [showLegal, setShowLegal] = useState(false);
  const [hasAcceptedLegal, setHasAcceptedLegal] = useState(false);
  const [activityFeed, setActivityFeed] = useState<{id: number, text: string, time: string}[]>([]);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [isLevel2Unlocked, setIsLevel2Unlocked] = useState(false);

  const t = I18N[lang];

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((isSpeaking) => {
      setIsSpeakingGlobal(isSpeaking);
    });

    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    const syncTimer = setInterval(() => setSyncStatus(prev => +(prev + (Math.random() * 0.05 - 0.025)).toFixed(2)), 3000);
    
    const activityItems = ["Prospect capturé à Abidjan", "Vente validée (+120 PV)", "Sync WhatsApp effectuée", "Bio-Scan complété", "Hub White Label en ligne"];
    const activityTimer = setInterval(() => {
      const newItem = {
        id: Date.now(),
        text: activityItems[Math.floor(Math.random() * activityItems.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setActivityFeed(prev => [newItem, ...prev.slice(0, 4)]);
    }, 8000);

    const savedSession = localStorage.getItem('ndsa_session');
    const legalAccepted = localStorage.getItem('ndsa_legal_accepted');
    
    if (new URLSearchParams(window.location.search).get('mode') === 'welcome') setActiveTab('jose');

    if (savedSession) {
      try {
        const user = JSON.parse(savedSession) as AuthUser;
        user.joinedDate = new Date(user.joinedDate);
        setCurrentUser(user);
        if (!localStorage.getItem(`ndsa_onboarding_${user.id}`)) setShowOnboarding(true);
      } catch (e) {}
    }

    if (legalAccepted === 'true') setHasAcceptedLegal(true);
    else setShowLegal(true);
    
    setIsAuthLoading(false);
    return () => { unsubVoice(); clearInterval(clockTimer); clearInterval(syncTimer); clearInterval(activityTimer); };
  }, []);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveTab('stats');
    if (!localStorage.getItem(`ndsa_onboarding_${user.id}`)) setShowOnboarding(true);
  };

  const readPageBrief = () => {
    let brief = "";
    switch(activeTab) {
      case 'stats': brief = "Interface Master activée. Vos vecteurs de croissance sont synchronisés."; break;
      case 'jose': brief = "Connexion établie avec Coach José. Prêt pour l'extraction bio-clinique."; break;
      case 'academy': brief = "Accès aux protocoles Stark. Forgez votre leadership."; break;
      case 'social': brief = "Moteur Social Sync prêt. Déployez votre viralité."; break;
      case 'finance': brief = "Audit financier en temps réel. Vos actifs sont sécurisés."; break;
      default: brief = `Système ${activeTab} opérationnel.`;
    }
    voiceService.play(brief, `brief_${activeTab}`, lang);
  };

  if (isAuthLoading) return null;
  if (showLegal) return <LegalDisclaimer language={lang} onAccept={() => { setHasAcceptedLegal(true); setShowLegal(false); localStorage.setItem('ndsa_legal_accepted', 'true'); }} />;
  if (!currentUser && new URLSearchParams(window.location.search).get('mode') !== 'welcome') return <AuthView onLogin={handleLogin} />;

  const myReferralLink = currentUser 
    ? `${window.location.origin}${window.location.pathname}?ref=${currentUser.neoLifeId}&mode=welcome`
    : `${window.location.origin}${window.location.pathname}?ref=${SYSTEM_CONFIG.founder.id}&mode=welcome`;

  return (
    <div className="min-h-screen flex font-sans antialiased text-white bg-slate-950 overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00d4ff]/10 blur-[150px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
         <div className="scanline"></div>
      </div>

      {/* Global Audio Indicator */}
      {isSpeakingGlobal && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[1000] bg-[#00d4ff]/20">
          <div className="h-full bg-[#00d4ff] animate-[shimmer_2s_infinite] shadow-[0_0_10px_#00d4ff]"></div>
          <div className="absolute top-2 right-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-4 py-1.5 rounded-full border border-[#00d4ff]/30">
            <AudioLines size={14} className="text-[#00d4ff] animate-pulse" />
            <span className="font-stark text-[9px] font-black text-[#00d4ff] uppercase tracking-widest">Neural Link Speaking</span>
          </div>
        </div>
      )}

      {showOnboarding && <OnboardingWizard onClose={() => setShowOnboarding(false)} />}
      {showNotification && <ConversionNotification prospectCountry="Côte d'Ivoire" healthFocus="Restauration Cellulaire" onClose={() => setShowNotification(false)} onSocialSync={() => setActiveTab('social')} />}
      {showMilestone && <MilestoneModal onClose={() => setShowMilestone(false)} onUnlock={() => setIsLevel2Unlocked(true)} />}

      <aside className={`fixed inset-y-0 left-0 w-80 glass-card z-50 transition-transform lg:translate-x-0 lg:static border-r border-white/5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-900 border border-[#00d4ff]/40 shadow-[0_0_30px_rgba(0,212,255,0.4)]"><Layers size={28} className="text-[#00d4ff]" /></div>
            <div>
              <h1 className="font-stark font-black text-lg tracking-tight uppercase leading-none">{SYSTEM_CONFIG.brand}</h1>
              <p className="font-stark text-[10px] text-[#00d4ff] font-bold tracking-[0.3em] uppercase mt-1">VER {SYSTEM_CONFIG.version}</p>
            </div>
          </div>
          <nav className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
            {[
              { id: 'stats', label: t.dashboard, icon: LayoutDashboard },
              { id: 'jose', label: t.jose, icon: Bot },
              { id: 'history', label: "Bio-Archives", icon: ClipboardList },
              { id: 'academy', label: t.academy, icon: GraduationCap },
              { id: 'social', label: t.social, icon: Share2 },
              { id: 'finance', label: t.finance, icon: Wallet },
              { id: 'profile', label: "Mon Profil", icon: User },
              ...(currentUser?.role === 'ADMIN' ? [{ id: 'admin', label: t.admin, icon: Settings }] : []),
            ].map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); voiceService.stop(); }} className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl text-[14px] font-bold transition-all uppercase tracking-tight ${activeTab === item.id ? 'bg-[#00d4ff] text-slate-950 shadow-[0_0_30px_#00d4ff44]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}><item.icon size={20} /> {item.label}</button>
            ))}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
               <div className="flex items-center justify-between mb-4">
                  <p className="font-stark text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Live Activity</p>
                  <Wifi size={12} className="text-emerald-500 animate-pulse" />
               </div>
               <div className="space-y-3">
                  {activityFeed.map(act => (
                    <div key={act.id} className="flex justify-between items-center gap-2 animate-in slide-in-from-left duration-300">
                      <p className="text-[10px] text-slate-400 font-medium truncate italic">{act.text}</p>
                      <span className="text-[9px] font-mono text-[#00d4ff]">{act.time}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className="h-28 glass-card border-b border-white/5 px-10 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button className="lg:hidden p-4 bg-white/5 border border-white/10 rounded-2xl" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <div className="hidden xl:flex items-center gap-6">
              <div className="flex flex-col">
                <p className="font-stark text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Neural-Link Stability</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-2 w-48 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-[#00d4ff] shadow-[0_0_15px_#00d4ff]" style={{ width: `${syncStatus}%` }}></div>
                  </div>
                  <span className="font-stark text-[11px] text-[#00d4ff] font-black italic">{syncStatus}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center bg-slate-900/50 border border-white/10 rounded-2xl p-1.5 shadow-inner">
                {(['fr', 'en', 'it', 'es'] as Language[]).map(l => (
                  <button key={l} onClick={() => { setLang(l); voiceService.stop(); }} className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase transition-all ${lang === l ? 'bg-[#00d4ff] text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>{l}</button>
                ))}
             </div>

             <button onClick={readPageBrief} className={`w-14 h-14 rounded-2xl border transition-all flex items-center justify-center ${isSpeakingGlobal ? 'bg-[#00d4ff] text-slate-950 shadow-[0_0_20px_#00d4ff]' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'}`}>
                {isSpeakingGlobal ? <Square size={22} /> : <Volume2 size={22} />}
             </button>
             <button onClick={() => setIsBoosting(true)} className="w-14 h-14 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-[#00d4ff] hover:text-slate-950 transition-all group flex items-center justify-center"><Zap size={22} /></button>
             <div onClick={() => setActiveTab('profile')} className="h-14 w-14 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden border-2 border-[#00d4ff]/40 shadow-[0_0_15px_#00d4ff44] hover:scale-110 transition-transform">
                <img src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`} alt="Avatar" className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        <div className="p-10 flex-1 overflow-y-auto no-scrollbar pb-32">
          {activeTab === 'stats' && <DashboardContent t={t} stats={{ prospects: 124, salesVolume: 5840, subscriptionMRR: 2150, commissions: 430, conversions: 18, activeAffiliates: 24 }} myReferralLink={myReferralLink} />}
          {activeTab === 'jose' && <AssistantJose language={lang} currentSubscriberId={currentUser?.neoLifeId} />}
          {activeTab === 'history' && <DiagnosticHistory />}
          {activeTab === 'academy' && <AcademyView isLevel2Unlocked={isLevel2Unlocked} />}
          {activeTab === 'social' && <SocialSync />}
          {activeTab === 'finance' && <FinanceView />}
          {activeTab === 'profile' && currentUser && <ProfileView user={currentUser} onUpdate={(u) => setCurrentUser(u)} onLogout={() => { localStorage.removeItem('ndsa_session'); setCurrentUser(null); voiceService.stop(); }} />}
          {activeTab === 'admin' && currentUser?.role === 'ADMIN' && <AdminMonitor stats={{ totalNetSaaS: 145200, aiEffectiveness: 98.5, orphanLeadsCount: 2450, totalActiveHubs: 42 }} />}
        </div>
      </main>
      
      {isBoosting && (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-[250] flex items-center justify-center text-white animate-in zoom-in duration-500">
           <div className="text-center space-y-12 p-20 bg-slate-900 rounded-[5rem] border border-[#00d4ff]/30 shadow-[0_0_100px_#00d4ff22] max-w-3xl">
              <Cpu size={100} className="text-[#00d4ff] mx-auto animate-[spin_10s_linear_infinite]" />
              <h3 className="font-stark text-7xl font-black uppercase tracking-tighter italic text-white leading-none">IMPERIUM SYNC</h3>
              <button onClick={() => setIsBoosting(false)} className="px-20 py-8 bg-[#00d4ff] text-slate-950 font-stark font-black rounded-3xl shadow-[0_0_40px_#00d4ff] hover:scale-110 transition-all uppercase tracking-widest text-lg italic">RECALIBRER</button>
           </div>
        </div>
      )}
      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
};

const DashboardContent = ({ t, stats, myReferralLink }: any) => (
    <div className="space-y-12 animate-in fade-in duration-1000">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <header>
            <h2 className="font-stark text-7xl font-black text-white tracking-tighter leading-none italic uppercase">{t.dashboard}</h2>
            <p className="text-slate-400 font-medium text-2xl mt-6 italic opacity-80">Architecture Mondiale de Restauration Biologique.</p>
          </header>
          <div className="flex items-center gap-8 glass-card p-8 rounded-[3.5rem] border border-[#00d4ff]/20 group hover:border-[#00d4ff]/60 transition-all shadow-3xl">
             <div className="text-right">
                <p className="font-stark text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Bio-Sync Fidelity</p>
                <p className="font-stark text-3xl font-black text-[#00d4ff] italic uppercase tracking-tighter">ELITE GRADE</p>
             </div>
             <div className="w-20 h-20 bg-[#00d4ff]/20 rounded-3xl flex items-center justify-center text-[#00d4ff] shadow-[0_0_40px_#00d4ff44] group-hover:scale-110 transition-transform"><ShieldCheck size={40} /></div>
          </div>
        </div>
        <section className="glass-card rounded-[5rem] p-16 md:p-24 text-white relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 group">
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-24">
              <div className="space-y-12 flex-1">
                 <h3 className="font-stark text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] italic uppercase">IMPERIUM <span className="text-[#00d4ff]">FLOW</span></h3>
                 <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 w-full bg-slate-950/80 border border-white/10 px-12 py-8 rounded-[3rem] font-mono text-[#00d4ff] text-lg truncate shadow-inner">{myReferralLink}</div>
                    <button onClick={() => { navigator.clipboard.writeText(myReferralLink); alert("Lien Magique Copié !"); }} className="p-8 bg-[#00d4ff] text-slate-950 rounded-[2.5rem] hover:brightness-110 transition-all flex items-center gap-4 shadow-[0_0_30px_#00d4ff] font-stark font-black text-xs uppercase tracking-widest"><Share2 size={28} /> <span>COPY</span></button>
                 </div>
              </div>
           </div>
        </section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
                { label: "Vecteurs Leads", value: stats.prospects, color: "text-[#00d4ff]", icon: Rocket },
                { label: "Volume MLM", value: `${stats.salesVolume} PV`, color: "text-emerald-400", icon: Layers },
                { label: "Dividendes SaaS", value: `$${stats.commissions}`, color: "text-amber-400", icon: Wallet },
                { label: "Conversion Rate", value: `${stats.conversions}%`, color: "text-rose-400", icon: Bot },
            ].map((stat, i) => (
                <div key={i} className="glass-card p-12 rounded-[4rem] border border-white/5 shadow-2xl relative group overflow-hidden hover:border-[#00d4ff]/40 transition-all">
                    <stat.icon size={44} className={`${stat.color} mb-8 relative z-10 group-hover:scale-125 transition-transform`} />
                    <p className="font-stark text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic relative z-10">{stat.label}</p>
                    <h3 className={`font-stark text-5xl font-black ${stat.color} mt-6 italic tracking-tighter relative z-10 tabular-nums`}>{stat.value}</h3>
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <LeadChart />
          <section className="glass-card p-16 rounded-[4.5rem] border border-white/10 flex flex-col justify-center relative overflow-hidden shadow-2xl">
             <h4 className="font-stark text-4xl font-black text-white italic mb-8 uppercase tracking-tight relative z-10">AI COGNITIVE HUB</h4>
             <p className="text-slate-400 text-2xl leading-relaxed italic relative z-10 opacity-80">L'IA JOSÉ traite des pétaoctets de données biologiques pour optimiser votre tunnel de conversion NeoLife.</p>
          </section>
        </div>
    </div>
);

export default App;
