
import React, { useState, useEffect } from 'react';
import { SYSTEM_CONFIG, I18N } from './constants';
import { AssistantJose } from './components/AssistantJose';
import { AcademyView } from './components/AcademyView';
import { SocialSync } from './components/SocialSync';
import { FinanceView } from './components/FinanceView';
import { AdminMonitor } from './components/AdminMonitor';
import { AuthView } from './components/AuthView';
import { ProfileView } from './components/ProfileView';
import { OnboardingWizard } from './components/OnboardingWizard';
import { DiagnosticHistory } from './components/DiagnosticHistory';
import { Language, AuthUser } from './types'; 
import { voiceService } from './services/voiceService';
import { 
  LayoutDashboard, Bot, GraduationCap, Share2, Wallet, Menu,
  Layers, Volume2, Square, ShieldCheck, User,
  ClipboardList, Rocket, Sparkles, Cpu, AlertCircle, Radio, Activity
} from 'lucide-react';

type TabType = 'stats' | 'jose' | 'academy' | 'social' | 'finance' | 'admin' | 'profile' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('jose');
  const [lang, setLang] = useState<Language>('fr');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const unsubVoice = voiceService.subscribe(() => {});

    const params = new URLSearchParams(window.location.search);
    const refId = params.get('r');
    const slug = params.get('s');
    
    if (refId && slug) {
      sessionStorage.setItem('ndsa_active_ref', refId);
      sessionStorage.setItem('ndsa_active_slug', slug);
      sessionStorage.setItem('ndsa_active_shop', `https://shopneolife.com/${slug}/shop/atoz`);
      setActiveTab('jose');
    }

    const savedSession = localStorage.getItem('ndsa_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession) as AuthUser;
        setCurrentUser(user);
        if (!localStorage.getItem(`ndsa_onboarding_${user.id}`)) setShowOnboarding(true);
      } catch (e) {}
    }
    
    setIsAuthLoading(false);
    return () => unsubVoice();
  }, []);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveTab('jose');
    if (!localStorage.getItem(`ndsa_onboarding_${user.id}`)) setShowOnboarding(true);
  };

  if (isAuthLoading) return null;

  const isMasterFounder = currentUser?.neoLifeId === SYSTEM_CONFIG.founder.id;

  if (!currentUser) return <AuthView onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex font-sans antialiased text-white overflow-hidden bg-[#020617] relative">
      <aside className={`fixed inset-y-0 left-0 w-80 glass-card z-50 transition-transform lg:translate-x-0 lg:static border-r border-blue-500/10 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 h-full flex flex-col">
          <div className="flex flex-col items-center gap-8 mb-20 px-4 cursor-pointer group" onClick={() => setActiveTab('jose')}>
            <div className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center bg-blue-500/10 border border-blue-500/30 shadow-[0_0_30px_rgba(0,212,255,0.2)] group-hover:scale-110 transition-transform">
              <Cpu size={40} className="text-blue-400" />
            </div>
            <div className="text-center">
              <h1 className="font-stark font-black text-2xl tracking-tighter uppercase leading-none">STARK <span className="text-blue-500">ENGINE</span></h1>
              <p className="font-stark text-[8px] text-emerald-400 font-bold tracking-[0.6em] uppercase mt-3 opacity-60 italic">V8.0 FUSION</p>
            </div>
          </div>
          
          <nav className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
            {[
              { id: 'jose', label: "Neural Coach", icon: Bot },
              { id: 'academy', label: "Empire Academy", icon: GraduationCap },
              { id: 'social', label: "Viral Sync", icon: Share2 },
              { id: 'history', label: "Bio-Logs", icon: ClipboardList },
              { id: 'finance', label: "Revenue Flow", icon: Wallet },
              ...(isMasterFounder ? [{ id: 'admin', label: "Command Center", icon: LayoutDashboard }] : []),
              { id: 'profile', label: "Leader DNA", icon: User },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); voiceService.stop(); }} 
                className={`w-full flex items-center gap-6 px-8 py-5 rounded-2xl text-[11px] font-black transition-all uppercase tracking-[0.2em] ${activeTab === item.id ? 'bg-blue-500 text-slate-950 shadow-2xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-10 border-t border-white/5">
             <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 overflow-hidden shrink-0">
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-white truncate uppercase italic">{currentUser.name}</p>
                  <p className="text-[8px] text-blue-400 font-bold uppercase tracking-widest">{currentUser.role}</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className="h-28 px-12 flex items-center justify-between relative bg-black/30 backdrop-blur-3xl border-b border-blue-500/10">
          <div className="flex items-center gap-10">
            <button className="lg:hidden p-4 bg-white/5 border border-white/10 rounded-xl" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <div className="flex items-center gap-5">
               <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Mission <span className="text-blue-500">Control</span></h2>
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <Activity size={12} className="text-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Global Sync Active</span>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
             <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-2xl p-1 shadow-inner">
                {(['fr', 'en', 'es'] as Language[]).map(l => (
                  <button key={l} onClick={() => { setLang(l); voiceService.stop(); }} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lang === l ? 'bg-blue-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}>{l}</button>
                ))}
             </div>
             <div className="hidden md:flex flex-col items-end">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Stark System Time</p>
                <p className="text-lg font-stark font-black text-white italic">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
             </div>
          </div>
        </header>

        <div className="p-10 flex-1 overflow-y-auto no-scrollbar bg-[radial-gradient(circle_at_bottom_right,rgba(0,212,255,0.05),transparent_40%)]">
          <div className="max-w-[1600px] mx-auto h-full">
            {activeTab === 'jose' && <AssistantJose language={lang} currentSubscriberId={currentUser?.neoLifeId} />}
            {activeTab === 'academy' && <AcademyView />}
            {activeTab === 'social' && <SocialSync />}
            {activeTab === 'finance' && <FinanceView />}
            {activeTab === 'profile' && currentUser && <ProfileView user={currentUser} onUpdate={(u) => setCurrentUser(u)} onLogout={() => { localStorage.removeItem('ndsa_session'); setCurrentUser(null); voiceService.stop(); }} />}
            {activeTab === 'history' && <DiagnosticHistory />}
            {activeTab === 'admin' && isMasterFounder && <AdminMonitor stats={{ totalNetSaaS: 125000, aiEffectiveness: 99.2, orphanLeadsCount: 1420, totalActiveHubs: 18 }} />}
          </div>
        </div>
      </main>

      {showOnboarding && <OnboardingWizard onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default App;
