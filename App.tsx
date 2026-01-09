
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
import { Language, AuthUser } from './types'; 
import { voiceService } from './services/voiceService';
import { 
  LayoutDashboard, Bot, GraduationCap, Share2, Wallet, Menu,
  Layers, Volume2, Square, ShieldCheck, User,
  ClipboardList, Rocket, Diamond, Settings, Cpu, Sparkles
} from 'lucide-react';

type TabType = 'stats' | 'jose' | 'academy' | 'social' | 'finance' | 'admin' | 'profile' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('jose');
  const [lang, setLang] = useState<Language>('fr');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const [showOnboarding, setShowOnboarding] = useState(false);

  const t = I18N[lang];

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((speaking, key) => {
      setIsSpeaking(speaking);
      setActiveSpeechKey(key);
    });

    const params = new URLSearchParams(window.location.search);
    const isWelcome = params.get('mode') === 'welcome' || params.get('ref') !== null;

    const savedSession = localStorage.getItem('ndsa_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession) as AuthUser;
        setCurrentUser(user);
        if (!isWelcome) setActiveTab('jose');
        if (!localStorage.getItem(`ndsa_onboarding_${user.id}`)) setShowOnboarding(true);
      } catch (e) {}
    }
    
    if (isWelcome) setActiveTab('jose');
    setIsAuthLoading(false);
    return () => unsubVoice();
  }, []);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveTab('jose');
    if (!localStorage.getItem(`ndsa_onboarding_${user.id}`)) setShowOnboarding(true);
  };

  const readPageBrief = () => {
    let brief = "";
    switch(activeTab) {
      case 'jose': brief = "Coach JOSÉ. Analyse et restauration bio-cellulaire active."; break;
      case 'academy': brief = "Academy Stark. Puissance entrepreneuriale et savoir clinique."; break;
      case 'social': brief = "Social Link. Diffusion de votre impact digital."; break;
      default: brief = `Système Coach JOSÉ opérationnel.`;
    }
    voiceService.play(brief, `brief_${activeTab}`, lang);
  };

  if (isAuthLoading) return null;

  const isWelcomeMode = new URLSearchParams(window.location.search).get('mode') === 'welcome' || new URLSearchParams(window.location.search).get('ref') !== null;
  const isMasterFounder = currentUser?.neoLifeId === SYSTEM_CONFIG.founder.id;

  if (!currentUser && !isWelcomeMode) return <AuthView onLogin={handleLogin} />;

  const myReferralLink = currentUser 
    ? `${window.location.origin}${window.location.pathname}?ref=${currentUser.neoLifeId}&mode=welcome`
    : `${window.location.origin}${window.location.pathname}?ref=${SYSTEM_CONFIG.founder.id}&mode=welcome`;

  return (
    <div className="min-h-screen flex font-sans antialiased text-white overflow-hidden selection:bg-[#00d4ff] selection:text-slate-900 bg-[#020617]">
      
      {isSpeaking && (
        <div className="fixed top-12 left-0 right-0 z-[2000] flex items-center justify-center pointer-events-none px-6">
          <div className="glass-card px-12 py-5 rounded-full flex items-center gap-10 animate-in slide-in-from-top duration-700">
            <div className="flex items-end h-6 gap-1">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.05}s` }}></div>
              ))}
            </div>
            <span className="font-stark text-[10px] font-black text-[#00d4ff] uppercase tracking-[0.5em]">Voice active</span>
          </div>
        </div>
      )}

      {showOnboarding && <OnboardingWizard onClose={() => setShowOnboarding(false)} />}
      
      <aside className={`fixed inset-y-0 left-0 w-72 glass-card z-50 transition-transform lg:translate-x-0 lg:static border-r border-white/5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 h-full flex flex-col">
          <div className="flex flex-col items-center gap-6 mb-16 px-4 cursor-pointer" onClick={() => setActiveTab('jose')}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#00d4ff]/10 border border-[#00d4ff]/20 shadow-xl">
              <Bot size={32} className="text-[#00d4ff]" />
            </div>
            <div className="text-center">
              <h1 className="font-stark font-black text-xl tracking-tighter uppercase leading-none">{SYSTEM_CONFIG.brand}</h1>
              <p className="font-stark text-[8px] text-emerald-400 font-bold tracking-widest uppercase mt-2 opacity-50 italic">v7.8 Elite</p>
            </div>
          </div>

          <nav className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
            {[
              { id: 'jose', label: "Coach Jose", icon: Bot },
              { id: 'academy', label: "Academy", icon: GraduationCap },
              { id: 'social', label: "Social Engine", icon: Share2 },
              { id: 'history', label: "Archives", icon: ClipboardList },
              { id: 'finance', label: "Finance", icon: Wallet },
              ...(isMasterFounder ? [{ id: 'stats', label: "Cockpit", icon: LayoutDashboard }] : []),
              { id: 'profile', label: "Leadership", icon: User },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); voiceService.stop(); }} 
                className={`w-full flex items-center gap-5 px-6 py-4 rounded-xl text-[11px] font-black transition-all uppercase tracking-widest ${activeTab === item.id ? 'bg-[#00d4ff] text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon size={18} /> 
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className="h-32 px-12 flex items-center justify-between relative bg-black/5 backdrop-blur-3xl border-b border-white/5">
          <div className="flex items-center gap-10 relative z-10">
            <button className="lg:hidden p-4 bg-white/5 border border-white/10 rounded-xl" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <div className="hidden xl:flex flex-col">
              <p className="font-stark text-[10px] font-black text-[#00d4ff] uppercase tracking-[0.6em] mb-1 opacity-50">Stark Bio-System</p>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-5">
                Coach Jose <Sparkles size={20} className="text-[#00d4ff]" />
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-8 relative z-10">
             <div className="flex items-center bg-black/20 border border-white/5 rounded-xl p-1">
                {(['fr', 'en', 'it', 'es'] as Language[]).map(l => (
                  <button key={l} onClick={() => { setLang(l); voiceService.stop(); }} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${lang === l ? 'bg-[#00d4ff] text-slate-900' : 'text-slate-500 hover:text-white'}`}>{l}</button>
                ))}
             </div>

             <button onClick={readPageBrief} className={`w-14 h-14 rounded-xl border transition-all flex items-center justify-center ${activeSpeechKey?.startsWith('brief_') ? 'bg-[#00d4ff] text-slate-950' : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'}`}>
                {activeSpeechKey?.startsWith('brief_') ? <Square size={20} /> : <Volume2 size={20} />}
             </button>
             
             {currentUser && (
               <div onClick={() => setActiveTab('profile')} className="h-14 w-14 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden border border-[#00d4ff]/20 bg-slate-900">
                  {/* Fixed undefined formData error by using currentUser.avatar directly */}
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
               </div>
             )}
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto no-scrollbar pb-32">
          <div className="max-w-[1400px] mx-auto h-full">
            {activeTab === 'jose' && <AssistantJose language={lang} currentSubscriberId={currentUser?.neoLifeId} />}
            {activeTab === 'stats' && isMasterFounder && <DashboardContent t={t} stats={{ prospects: 124, salesVolume: 5840, subscriptionMRR: 2150, commissions: 430, conversions: 18, activeAffiliates: 24 }} myReferralLink={myReferralLink} />}
            {activeTab === 'history' && <DiagnosticHistory />}
            {activeTab === 'academy' && <AcademyView />}
            {activeTab === 'social' && <SocialSync />}
            {activeTab === 'finance' && <FinanceView />}
            {activeTab === 'profile' && currentUser && <ProfileView user={currentUser} onUpdate={(u) => setCurrentUser(u)} onLogout={() => { localStorage.removeItem('ndsa_session'); setCurrentUser(null); voiceService.stop(); }} />}
            {activeTab === 'admin' && currentUser?.role === 'ADMIN' && <AdminMonitor stats={{ totalNetSaaS: 145200, aiEffectiveness: 98.5, orphanLeadsCount: 2450, totalActiveHubs: 42 }} />}
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardContent = ({ t, stats, myReferralLink }: any) => (
    <div className="space-y-16 animate-in fade-in duration-1000">
        <header className="space-y-4">
          <h2 className="font-stark text-6xl font-black text-white tracking-tighter italic uppercase">COCKPIT</h2>
          <div className="flex items-center gap-8">
            <span className="h-1 w-32 bg-[#00d4ff]"></span>
            <p className="text-slate-500 font-bold text-xl uppercase tracking-widest italic opacity-50">Empire Management</p>
          </div>
        </header>

        <section className="glass-card rounded-3xl p-12 text-white relative overflow-hidden">
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="space-y-8 flex-1">
                 <h3 className="font-stark text-6xl font-black tracking-tighter italic uppercase">AURA <span className="text-[#00d4ff]">SYNC</span></h3>
                 <p className="text-slate-400 text-2xl font-medium max-w-4xl italic leading-relaxed">Le flux d'expansion est optimal. JOSÉ harmonise vos vecteurs de croissance à travers le globe.</p>
                 <div className="flex flex-col md:flex-row gap-6 items-center max-w-4xl">
                    <div className="flex-1 w-full bg-black/40 border border-white/5 px-8 py-5 rounded-2xl font-mono text-[#00d4ff] text-lg truncate">{myReferralLink}</div>
                    <button onClick={() => { navigator.clipboard.writeText(myReferralLink); alert("Lien Master copié."); }} className="p-8 bg-[#00d4ff] text-slate-900 rounded-2xl active:scale-95 transition-all"><Share2 size={28} /></button>
                 </div>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { label: "Total Prospects", value: stats.prospects, color: "text-[#00d4ff]", icon: Rocket, bg: "bg-blue-500/5" },
                { label: "Chiffre MLM (PV)", value: stats.salesVolume, color: "text-emerald-400", icon: Layers, bg: "bg-emerald-500/5" },
                { label: "Gains SaaS", value: `$${stats.commissions}`, color: "text-[#FFD700]", icon: Wallet, bg: "bg-amber-500/5" },
                { label: "Closing Automatisé", value: `${stats.conversions}%`, color: "text-rose-400", icon: Bot, bg: "bg-rose-500/5" },
            ].map((stat, i) => (
                <div key={i} className={`glass-card p-10 rounded-3xl border border-white/5 relative group overflow-hidden ${stat.bg} shadow-xl hover:scale-105 transition-all duration-500`}>
                    <stat.icon size={48} className={`${stat.color} mb-6 opacity-60`} />
                    <p className="font-stark text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">{stat.label}</p>
                    <h3 className={`font-stark text-5xl font-black ${stat.color} italic tracking-tighter tabular-nums`}>{stat.value}</h3>
                </div>
            ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <LeadChart />
          <section className="glass-card p-12 rounded-3xl flex flex-col justify-center relative overflow-hidden bg-black/10">
             <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none text-[#00d4ff]"><Cpu size={300} /></div>
             <h4 className="font-stark text-4xl font-black text-white italic mb-8 uppercase tracking-tight flex items-center gap-8"><Bot size={48} className="text-[#00d4ff]" /> CORE ENGINE</h4>
             <p className="text-slate-400 text-2xl leading-relaxed italic max-w-2xl">La restauration cellulaire est en marche. Chaque diagnostic renforce l'autorité de votre Hub digital.</p>
             <div className="mt-12 p-10 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                   <p className="font-stark text-[11px] font-black text-slate-500 uppercase tracking-widest italic mb-2">Network Status</p>
                   <p className="font-stark text-2xl font-black text-emerald-400 italic uppercase tracking-widest">SECURE & FLUID</p>
                </div>
                <div className="w-16 h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20"><ShieldCheck size={40} /></div>
             </div>
          </section>
        </div>
    </div>
);

export default App;
