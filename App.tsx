
import React, { useState, useEffect } from 'react';
import { SYSTEM_CONFIG } from './constants';
import { AssistantJose } from './components/AssistantJose';
import { AcademyView } from './components/AcademyView';
import { SocialSync } from './components/SocialSync';
import { FinanceView } from './components/FinanceView';
import { AdminMonitor } from './components/AdminMonitor';
import { AuthView } from './components/AuthView';
import { ProfileView } from './components/ProfileView';
import { OnboardingWizard } from './components/OnboardingWizard';
import { DiagnosticHistory } from './components/DiagnosticHistory';
import { LeadChart } from './components/LeadChart';
import { ConversionNotification } from './components/ConversionNotification';
import { Language, AuthUser, UserRank } from './types'; 
import { voiceService } from './services/voiceService';
import { storageService } from './services/storageService';
import { 
  LayoutDashboard, Bot, GraduationCap, Share2, Wallet, Menu,
  User, ClipboardList, Cpu, Activity, Globe, Zap, ShieldCheck, Star, X
} from 'lucide-react';

type TabType = 'dashboard' | 'jose' | 'academy' | 'social' | 'finance' | 'admin' | 'profile' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [lang, setLang] = useState<Language>('fr');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [conversion, setConversion] = useState<{country: string, focus: string} | null>(null);
  const [isFounderSession, setIsFounderSession] = useState(false);
  const [isUltimateGold, setIsUltimateGold] = useState(false);
  const [isNexusActive, setIsNexusActive] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const currentOrigin = window.location.origin;
        const primaryOrigin = SYSTEM_CONFIG.routing.primary_domain;
        
        if (currentOrigin !== primaryOrigin) {
          console.warn(`[NEXUS_DOMAIN_AUDIT] Running on non-primary origin: ${currentOrigin}`);
        }

        const params = new URLSearchParams(window.location.search);
        const defaults = SYSTEM_CONFIG.routing.defaults;

        const sanitizeParam = (key: string, val: string | null): string => {
          if (!val || val === '...' || val.trim() === '') return (defaults as any)[key] || 'default';
          return val;
        };

        const r = sanitizeParam('r', params.get('r'));
        const s = sanitizeParam('s', params.get('s'));
        const m = sanitizeParam('m', params.get('m'));

        sessionStorage.setItem('ndsa_active_ref', r);
        sessionStorage.setItem('ndsa_active_slug', s);
        sessionStorage.setItem('ndsa_active_shop', `https://shopneolife.com/${s}/shop/atoz`);
        
        const isFounder = r === SYSTEM_CONFIG.founder.id || r === "M. José Gaétan";
        setIsFounderSession(isFounder);
        if (isFounder) document.body.classList.add('imperium-mode');
        
        if (m === 'w' || m === 'welcome') {
          setIsNexusActive(true);
          setActiveTab('jose');
        }

        const savedSession = localStorage.getItem('ndsa_session');
        const ultimateFlag = localStorage.getItem('ndsa_ultimate_gold') === 'true';
        
        if (ultimateFlag) {
          setIsUltimateGold(true);
          document.body.classList.add('ultimate-gold-mode');
        }

        if (savedSession) {
          const user = JSON.parse(savedSession) as AuthUser;
          const dna = await storageService.getItem('user_dna', user.id);
          const finalUser = dna ? { ...user, dna } : user;
          setCurrentUser(finalUser);
          if (!localStorage.getItem(`ndsa_onboarding_${user.id}`)) setShowOnboarding(true);
        }
      } catch (e) {
        console.error("Critical Init Error", e);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initApp();
  }, []);

  const handleLogin = (user: AuthUser, ultimate = false) => {
    setCurrentUser(user);
    if (ultimate) {
      setIsUltimateGold(true);
      setIsFounderSession(true);
      localStorage.setItem('ndsa_ultimate_gold', 'true');
      document.body.classList.add('ultimate-gold-mode', 'imperium-mode');
    }
    setActiveTab('dashboard');
    if (!localStorage.getItem(`ndsa_onboarding_${user.id}`)) setShowOnboarding(true);
  };

  const handleUpdateUser = async (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('ndsa_session', JSON.stringify(updatedUser));
    if (updatedUser.dna) {
        await storageService.saveItem('user_dna', { id: updatedUser.id, ...updatedUser.dna });
    }
  };

  if (isAuthLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020617] text-blue-500 font-stark">
        <Cpu className="animate-spin mb-4" size={48} />
        <p className="text-[10px] tracking-[0.5em] uppercase animate-pulse">Neural Core Booting...</p>
      </div>
    );
  }

  const isMasterFounder = currentUser?.neoLifeId === SYSTEM_CONFIG.founder.id || isUltimateGold;

  if (!currentUser) return <AuthView onLogin={handleLogin} />;

  return (
    <div className={`min-h-[100dvh] h-[100dvh] flex font-sans antialiased text-white overflow-hidden bg-[#020617] relative transition-all duration-1000 ${isUltimateGold ? 'selection:bg-amber-500 selection:text-black' : isFounderSession ? 'selection:bg-amber-500 selection:text-black' : 'selection:bg-blue-500 selection:text-white'}`}>
      
      {(isFounderSession || isUltimateGold) && (
        <div className={`absolute inset-0 pointer-events-none border-[8px] md:border-[12px] z-[200] animate-pulse ${isUltimateGold ? 'border-amber-500/20 shadow-[inset_0_0_100px_rgba(255,215,0,0.1)]' : 'border-amber-500/10'}`}></div>
      )}

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {(!isNexusActive || activeTab !== 'jose') && (
        <aside className={`fixed inset-y-0 left-0 w-72 md:w-80 glass-card z-[120] transition-transform lg:translate-x-0 lg:static border-r h-full flex flex-col shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isUltimateGold ? 'gold-card border-amber-500/30' : isFounderSession ? 'border-blue-500/10' : 'border-blue-500/10'}`}>
          <div className="p-8 h-full flex flex-col">
            <div className="flex flex-col items-center gap-6 mb-12 px-2 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.8rem] flex items-center justify-center border transition-transform relative ${isUltimateGold ? 'bg-amber-500/20 border-amber-500/50 shadow-[0_0_30px_rgba(255,215,0,0.4)]' : isFounderSession ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(255,215,0,0.2)]' : 'bg-blue-500/10 border-blue-500/30'} group-hover:scale-110`}>
                {isUltimateGold ? <Zap size={28} className="text-amber-400" /> : isFounderSession ? <Star size={28} className="text-amber-500" /> : <Cpu size={28} className="text-blue-400" />}
              </div>
              <div className="text-center">
                <h1 className={`font-stark font-black text-lg md:text-xl tracking-tighter uppercase leading-none ${isUltimateGold ? 'gold-text-shimmer' : isFounderSession ? 'text-amber-500' : 'text-white'}`}>STARK <span className={isFounderSession || isUltimateGold ? 'text-white' : 'text-blue-500'}>ENGINE</span></h1>
                <p className="font-stark text-[7px] font-bold tracking-[0.4em] uppercase mt-2 opacity-60 italic text-blue-400">
                   V8.5_NEURAL_CORE
                </p>
              </div>
            </div>
            
            <nav className="space-y-2 flex-1 overflow-y-auto no-scrollbar pr-1">
              {[
                { id: 'dashboard', label: "Telemetry Hub", icon: LayoutDashboard },
                { id: 'jose', label: "Neural Coach", icon: Bot },
                { id: 'academy', label: "Academy", icon: GraduationCap },
                { id: 'social', label: "Viral Sync", icon: Share2 },
                { id: 'history', label: "Bio-Logs", icon: ClipboardList },
                { id: 'finance', label: "Revenue", icon: Wallet },
                ...(isMasterFounder ? [{ id: 'admin', label: "High Command", icon: Zap }] : []),
                { id: 'profile', label: "Leader DNA", icon: User },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); voiceService.stop(); }} 
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-[9px] font-black transition-all uppercase tracking-[0.2em] ${activeTab === item.id ? (isUltimateGold ? 'bg-amber-600 text-slate-950 shadow-amber-500/40 shadow-xl' : isFounderSession ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 shadow-lg' : 'bg-blue-500 text-slate-950 shadow-lg') + ' scale-[1.02]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  <item.icon size={14} /> {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">
               <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isUltimateGold ? 'bg-amber-950/20 border-amber-500/30' : 'bg-white/5 border-white/5 group'}`}>
                  <div className={`w-8 h-8 rounded-lg bg-slate-900 border overflow-hidden shrink-0 ${isUltimateGold || isFounderSession ? 'border-amber-500/30' : 'border-white/10'}`}>
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-white truncate uppercase italic">{currentUser.name}</p>
                    <p className={`text-[7px] font-bold uppercase tracking-widest ${isUltimateGold ? 'text-amber-300' : isFounderSession ? 'text-amber-500' : 'text-blue-400'}`}>{currentUser.dna?.rank || 'NOVICE'}</p>
                  </div>
               </div>
            </div>
          </div>
        </aside>
      )}

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        
        {(!isNexusActive || activeTab !== 'jose') && (
          <header className={`h-20 px-6 md:px-10 flex items-center justify-between shrink-0 relative backdrop-blur-3xl border-b transition-all ${isUltimateGold ? 'bg-amber-950/20 border-amber-500/30' : isFounderSession ? 'bg-black/30 border-amber-500/20' : 'bg-black/30 border-blue-500/10'}`}>
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2.5 bg-white/5 border border-white/10 rounded-xl" onClick={() => setIsSidebarOpen(true)}><Menu size={18} /></button>
              <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Mission <span className={isUltimateGold || isFounderSession ? 'text-amber-500' : 'text-blue-500'}>Control</span></h2>
            </div>
            
            <div className="flex items-center gap-6">
               {(isFounderSession || isUltimateGold) && (
                 <div className={`hidden sm:flex items-center gap-3 px-4 py-2 border rounded-xl ${isUltimateGold ? 'bg-amber-500/20 border-amber-500' : 'bg-amber-500/10 border-amber-500/20'}`}>
                   <ShieldCheck size={14} className="text-amber-500" />
                   <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic">IMPERIUM</span>
                 </div>
               )}
               <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-xl p-0.5">
                  {(['fr', 'en', 'es'] as Language[]).map(l => (
                    <button key={l} onClick={() => { setLang(l); voiceService.stop(); }} className={`px-2 md:px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${lang === l ? (isUltimateGold || isFounderSession ? 'bg-amber-500 text-slate-950' : 'bg-blue-500 text-slate-950') : 'text-slate-500 hover:text-white'}`}>{l}</button>
                  ))}
               </div>
            </div>
          </header>
        )}

        <div className="flex-1 min-h-0 relative">
          <div className="h-full overflow-y-auto no-scrollbar scroll-smooth">
            <div className={`max-w-[1400px] mx-auto h-full ${activeTab !== 'jose' && activeTab !== 'academy' ? 'p-6 md:p-10 space-y-8' : ''}`}>
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { label: "Neural Integrity", val: "99.2%", icon: Cpu, color: isUltimateGold ? "text-amber-300" : "text-blue-400" },
                      { label: "Global Sync", val: "Active", icon: Globe, color: "text-emerald-400" },
                      { label: "Stark Protocol", val: currentUser.dna?.rank || "NOVICE", icon: ShieldCheck, color: "text-amber-500" },
                    ].map((stat, i) => (
                      <div key={i} className={`glass-card p-8 rounded-[2.5rem] flex items-center gap-6 ${isUltimateGold ? 'gold-card' : ''}`}>
                        <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${stat.color}`}>
                          <stat.icon size={24} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                          <p className="text-2xl font-stark font-black text-white mt-1 uppercase italic">{stat.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <LeadChart />
                </div>
              )}
              {activeTab === 'jose' && <AssistantJose language={lang} currentSubscriberId={currentUser?.neoLifeId} onConversionDetected={(c, f) => setConversion({country: c, focus: f})} />}
              {activeTab === 'academy' && <AcademyView user={currentUser} onUpdateUser={handleUpdateUser} />}
              {activeTab === 'social' && <SocialSync />}
              {activeTab === 'finance' && <FinanceView user={currentUser} />}
              {activeTab === 'profile' && currentUser && <ProfileView user={currentUser} onUpdate={handleUpdateUser} onLogout={() => { localStorage.removeItem('ndsa_session'); localStorage.removeItem('ndsa_ultimate_gold'); setCurrentUser(null); voiceService.stop(); window.location.reload(); }} />}
              {activeTab === 'history' && <DiagnosticHistory />}
              {activeTab === 'admin' && isMasterFounder && <AdminMonitor stats={{ totalNetSaaS: 125000, aiEffectiveness: 99.2, orphanLeadsCount: 1420, totalActiveHubs: 18 }} />}
            </div>
          </div>
        </div>
      </main>

      {showOnboarding && <OnboardingWizard onClose={() => setShowOnboarding(false)} />}
      {conversion && (
        <ConversionNotification 
          prospectCountry={conversion.country} 
          healthFocus={conversion.focus} 
          onClose={() => setConversion(null)} 
          onSocialSync={() => setActiveTab('social')} 
        />
      )}
    </div>
  );
};

export default App;
