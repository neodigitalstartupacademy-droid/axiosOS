
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
  ClipboardList, Rocket, Sparkles, Cpu
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

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((speaking, key) => {
      setIsSpeaking(speaking);
      setActiveSpeechKey(key);
    });

    const params = new URLSearchParams(window.location.search);
    
    // NEXUS ROUTING : Capture des paramètres furtifs [r], [s], [m]
    const refId = params.get('r') || params.get('ref');
    const slug = params.get('s');
    const mode = params.get('m');
    
    // RÈGLE DES ORPHELINS : Fallback automatique vers ABADA Jose si paramètres manquants
    if (refId && slug) {
      sessionStorage.setItem('ndsa_active_ref', refId);
      sessionStorage.setItem('ndsa_active_slug', slug);
      sessionStorage.setItem('ndsa_active_shop', `https://shopneolife.com/${slug}/shop/atoz`);
    } else {
      // ATTRIBUTION AUTOMATIQUE AU FONDATEUR (ORPHAN PROTECTION)
      sessionStorage.setItem('ndsa_active_ref', SYSTEM_CONFIG.founder.id);
      sessionStorage.setItem('ndsa_active_slug', SYSTEM_CONFIG.founder.shop_slug);
      sessionStorage.setItem('ndsa_active_shop', SYSTEM_CONFIG.founder.officialShopUrl);
    }

    const savedSession = localStorage.getItem('ndsa_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession) as AuthUser;
        setCurrentUser(user);
        if (!localStorage.getItem(`ndsa_onboarding_${user.id}`)) setShowOnboarding(true);
      } catch (e) {}
    }
    
    // REDIRECTION AUTOMATIQUE JOSÉ : Déclenchée par r ou m=w
    if (mode === 'w' || refId) {
      setActiveTab('jose');
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

  const params = new URLSearchParams(window.location.search);
  const isPublicWelcome = params.get('m') === 'w' || params.get('r') !== null;
  const isMasterFounder = currentUser?.neoLifeId === SYSTEM_CONFIG.founder.id;

  // Accès public pour les prospects via le lien furtif /jose?r=...
  if (!currentUser && !isPublicWelcome) return <AuthView onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex font-sans antialiased text-white overflow-hidden bg-[#020617]">
      <aside className={`fixed inset-y-0 left-0 w-72 glass-card z-50 transition-transform lg:translate-x-0 lg:static border-r border-white/5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 h-full flex flex-col">
          <div className="flex flex-col items-center gap-6 mb-16 px-4 cursor-pointer" onClick={() => setActiveTab('jose')}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#00d4ff]/10 border border-[#00d4ff]/20 shadow-xl">
              <Bot size={32} className="text-[#00d4ff]" />
            </div>
            <div className="text-center">
              <h1 className="font-stark font-black text-xl tracking-tighter uppercase leading-none">{SYSTEM_CONFIG.brand}</h1>
              <p className="font-stark text-[8px] text-emerald-400 font-bold tracking-widest uppercase mt-2 opacity-50 italic">V7.1 IMPERIUM</p>
            </div>
          </div>
          <nav className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
            {[
              { id: 'jose', label: "Coach Jose", icon: Bot },
              { id: 'academy', label: "Academy", icon: GraduationCap },
              { id: 'social', label: "Social Sync", icon: Share2 },
              { id: 'history', label: "Archives", icon: ClipboardList },
              { id: 'finance', label: "Finance", icon: Wallet },
              ...(isMasterFounder ? [{ id: 'admin', label: "Admin Console", icon: LayoutDashboard }] : []),
              { id: 'profile', label: "Profile", icon: User },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); voiceService.stop(); }} 
                className={`w-full flex items-center gap-5 px-6 py-4 rounded-xl text-[11px] font-black transition-all uppercase tracking-widest ${activeTab === item.id ? 'bg-[#00d4ff] text-slate-900' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className="h-24 px-12 flex items-center justify-between relative bg-black/5 backdrop-blur-3xl border-b border-white/5">
          <div className="flex items-center gap-10">
            <button className="lg:hidden p-4 bg-white/5 border border-white/10 rounded-xl" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-5">NDSA HUB <Sparkles size={20} className="text-[#00d4ff]" /></h2>
          </div>
          <div className="flex items-center gap-8">
             <div className="flex items-center bg-black/20 border border-white/5 rounded-xl p-1">
                {(['fr', 'en', 'it', 'es'] as Language[]).map(l => (
                  <button key={l} onClick={() => { setLang(l); voiceService.stop(); }} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${lang === l ? 'bg-[#00d4ff] text-slate-900' : 'text-slate-500 hover:text-white'}`}>{l}</button>
                ))}
             </div>
             {currentUser && (
               <div onClick={() => setActiveTab('profile')} className="h-12 w-12 rounded-xl border border-[#00d4ff]/20 bg-slate-900 overflow-hidden cursor-pointer">
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
               </div>
             )}
          </div>
        </header>
        <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
          <div className="max-w-[1400px] mx-auto h-full">
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
