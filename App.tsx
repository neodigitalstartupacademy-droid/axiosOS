
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
import { HubLocator } from './components/HubLocator';
import { Language, AuthUser, UserRank } from './types'; 
import { voiceService } from './services/voiceService';
import { storageService } from './services/storageService';
import { 
  LayoutDashboard, Bot, GraduationCap, Share2, Wallet, Menu,
  User, ClipboardList, Cpu, Activity, Globe, Zap, ShieldCheck, Star, X, MapPin,
  Settings, Terminal, Box, Radio
} from 'lucide-react';

type TabType = 'dashboard' | 'jose' | 'academy' | 'social' | 'finance' | 'admin' | 'profile' | 'history' | 'hubs';

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
        const params = new URLSearchParams(window.location.search);
        const r = params.get('r') || 'unknown';
        const s = params.get('s') || 'default';
        const m = params.get('m') || 'w';

        sessionStorage.setItem('ndsa_active_ref', r);
        sessionStorage.setItem('ndsa_active_slug', s);
        sessionStorage.setItem('ndsa_active_shop', `https://shopneolife.com/${s}/shop/atoz`);
        
        const isFounder = r === SYSTEM_CONFIG.founder.id || r === "M. José Gaétan";
        setIsFounderSession(isFounder);
        
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
        setTimeout(() => setIsAuthLoading(false), 1500); // Simulate neural link stabilization
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
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020617] text-blue-500 font-stark animate-in fade-in duration-1000">
        <div className="relative">
          <Cpu className="animate-spin mb-8" size={64} />
          <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse"></div>
        </div>
        <div className="space-y-2 text-center">
          <p className="text-[12px] tracking-[0.8em] uppercase animate-pulse font-black">Neural Core Booting</p>
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
             <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { width: 0%; transform: translateX(-100%); }
            50% { width: 100%; transform: translateX(0); }
            100% { width: 0%; transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  const isMasterFounder = currentUser?.neoLifeId === SYSTEM_CONFIG.founder.id || isUltimateGold;

  if (!currentUser) return <AuthView onLogin={handleLogin} />;

  return (
    <div className={`min-h-[100dvh] h-[100dvh] flex font-sans antialiased text-white overflow-hidden relative transition-all duration-1000 ${isUltimateGold ? 'selection:bg-amber-500 selection:text-black' : 'selection:bg-blue-500'}`}>
      
      {/* HUD LINES DECORATION */}
      <div className="hud-line top-10 left-0 w-full"></div>
      <div className="hud-line bottom-10 left-0 w-full"></div>
      <div className="hud-line left-10 top-0 h-full w-[1px]"></div>
      <div className="hud-line right-10 top-0 h-full w-[1px]"></div>

      {/* IMPERIUM BORDER */}
      {(isFounderSession || isUltimateGold) && (
        <div className={`absolute inset-0 pointer-events-none border-[2px] md:border-[4px] z-[200] animate-pulse ${isUltimateGold ? 'border-amber-500/30' : 'border-blue-500/20'}`}></div>
      )}

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* COMMAND CENTER SIDEBAR */}
      {(!isNexusActive || activeTab !== 'jose') && (
        <aside className={`fixed inset-y-0 left-0 w-72 md:w-80 glass-card z-[120] transition-all duration-500 lg:translate-x-0 lg:static border-r h-full flex flex-col shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isUltimateGold ? 'gold-card border-amber-500/30' : 'border-blue-500/10'}`}>
          <div className="p-8 h-full flex flex-col">
            <div className="flex flex-col items-center gap-6 mb-12 px-2 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
              <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center border transition-all duration-500 relative ${isUltimateGold ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_40px_rgba(255,215,0,0.3)]' : 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_rgba(0,212,255,0.2)]'} group-hover:scale-110 group-hover:rotate-12`}>
                {isUltimateGold ? <Zap size={32} className="text-amber-400" /> : <Box size={32} className="text-blue-400" />}
              </div>
              <div className="text-center">
                <h1 className={`font-stark font-black text-xl tracking-tighter uppercase leading-none ${isUltimateGold ? 'gold-text-shimmer' : 'text-white'}`}>STARK <span className={isUltimateGold ? 'text-white' : 'text-blue-500'}>OS</span></h1>
                <div className="flex items-center justify-center gap-2 mt-2 opacity-60">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
                  <p className="font-stark text-[8px] font-bold tracking-[0.4em] uppercase text-blue-400 italic">CORE_SYNC_V8.6</p>
                </div>
              </div>
            </div>
            
            <nav className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1">
              {[
                { id: 'dashboard', label: "Command Center", icon: LayoutDashboard },
                { id: 'jose', label: "Neural Advisor", icon: Bot },
                { id: 'hubs', label: "Geo-Nexus", icon: MapPin },
                { id: 'academy', label: "Knowledge Base", icon: GraduationCap },
                { id: 'social', label: "Viral Network", icon: Share2 },
                { id: 'history', label: "Biological Logs", icon: ClipboardList },
                { id: 'finance', label: "Revenue Flux", icon: Wallet },
                ...(isMasterFounder ? [{ id: 'admin', label: "Imperium High", icon: Terminal }] : []),
                { id: 'profile', label: "Identity DNA", icon: User },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); voiceService.stop(); }} 
                  className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em] group relative overflow-hidden ${activeTab === item.id ? (isUltimateGold ? 'bg-amber-500 text-slate-950 shadow-2xl' : 'bg-blue-500 text-slate-950 shadow-xl') : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  <item.icon size={16} className={`${activeTab === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} /> 
                  <span className="relative z-10">{item.label}</span>
                  {activeTab === item.id && <div className="absolute right-0 top-0 h-full w-1 bg-white/40"></div>}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">
               <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isUltimateGold ? 'bg-amber-950/20 border-amber-500/30' : 'bg-white/5 border-white/5 group hover:bg-white/10'}`}>
                  <div className={`w-10 h-10 rounded-xl bg-slate-900 border overflow-hidden shrink-0 ${isUltimateGold ? 'border-amber-500/30' : 'border-white/10'}`}>
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-white truncate uppercase italic">{currentUser.name}</p>
                    <p className={`text-[7px] font-bold uppercase tracking-widest mt-0.5 ${isUltimateGold ? 'text-amber-400' : 'text-blue-500'}`}>{currentUser.dna?.rank || 'OPERATIVE'}</p>
                  </div>
               </div>
            </div>
          </div>
        </aside>
      )}

      {/* MAIN HUD AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        
        {(!isNexusActive || activeTab !== 'jose') && (
          <header className={`h-24 px-8 md:px-12 flex items-center justify-between shrink-0 relative backdrop-blur-3xl border-b transition-all ${isUltimateGold ? 'bg-amber-950/20 border-amber-500/30' : 'bg-black/40 border-blue-500/10'}`}>
            <div className="flex items-center gap-6">
              <button className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Mission <span className={isUltimateGold ? 'text-amber-500' : 'text-blue-500'}>Control</span></h2>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sector: {activeTab.toUpperCase()}</span>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
               <div className="hidden xl:flex items-center gap-6 pr-6 border-r border-white/10">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Network Load</p>
                    <p className="text-xs font-stark font-black text-emerald-400">OPTIMAL</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Neural Latency</p>
                    <p className="text-xs font-stark font-black text-blue-400">12ms</p>
                  </div>
               </div>

               <div className="flex items-center gap-6">
                 {(isFounderSession || isUltimateGold) && (
                   <div className={`hidden sm:flex items-center gap-3 px-5 py-2.5 border rounded-2xl ${isUltimateGold ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'bg-amber-500/10 border-amber-500/20'}`}>
                     <ShieldCheck size={16} className="text-amber-500" />
                     <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">IMPERIUM</span>
                   </div>
                 )}
                 <div className="flex items-center bg-slate-950/90 border border-white/10 rounded-2xl p-1">
                    {(['fr', 'en', 'es'] as Language[]).map(l => (
                      <button key={l} onClick={() => { setLang(l); voiceService.stop(); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lang === l ? (isUltimateGold ? 'bg-amber-500 text-slate-950' : 'bg-blue-500 text-slate-950') : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{l}</button>
                    ))}
                 </div>
               </div>
            </div>
          </header>
        )}

        {/* CONTENT STAGE */}
        <div className="flex-1 min-h-0 relative">
          <div className="h-full overflow-y-auto no-scrollbar scroll-smooth">
            <div className={`max-w-[1500px] mx-auto h-full ${activeTab !== 'jose' && activeTab !== 'academy' && activeTab !== 'hubs' ? 'p-8 md:p-14 space-y-12' : ''}`}>
              {activeTab === 'dashboard' && (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-1000">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      { label: "Neural Core Health", val: "99.2%", icon: Cpu, color: isUltimateGold ? "text-amber-400" : "text-blue-400" },
                      { label: "Viral Reach", val: "Active", icon: Globe, color: "text-emerald-400" },
                      { label: "Operative DNA", val: currentUser.dna?.rank || "NOVICE", icon: ShieldCheck, color: "text-amber-500" },
                    ].map((stat, i) => (
                      <div key={i} className={`glass-card p-10 rounded-[3rem] flex items-center gap-8 group hover:-translate-y-2 transition-all duration-500 ${isUltimateGold ? 'gold-card' : ''}`}>
                        <div className={`w-16 h-16 rounded-[1.8rem] bg-white/5 border border-white/5 flex items-center justify-center transition-all group-hover:rotate-6 ${stat.color}`}>
                          <stat.icon size={28} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                          <p className="text-3xl font-stark font-black text-white mt-2 uppercase italic tracking-tighter">{stat.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <LeadChart />
                  
                  {/* BOTTOM DASHBOARD HUD */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                           <Terminal size={18} className="text-blue-500" />
                           <h3 className="text-sm font-black text-white uppercase tracking-widest">System Feed</h3>
                        </div>
                        <div className="space-y-3">
                           {[
                             { t: "Neural link established with Hub Cotonou", s: "SUCCESS", c: "text-emerald-500" },
                             { t: "Biometric report generated for 12 prospects", s: "ACTIVE", c: "text-blue-500" },
                             { t: "Imperium Layer active on mobile node", s: "SECURE", c: "text-amber-500" }
                           ].map((log, i) => (
                             <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 text-[10px]">
                                <span className="text-slate-400 font-medium italic">{log.t}</span>
                                <span className={`font-black uppercase tracking-widest ${log.c}`}>{log.s}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="glass-card p-10 rounded-[3rem] border border-white/5 flex flex-col justify-center items-center text-center space-y-4">
                        <Radio size={32} className="text-blue-500 animate-pulse" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Global Synchronization</p>
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">100% Core Alignment</h4>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
                           <div className="h-full bg-blue-500 w-full shadow-[0_0_15px_rgba(0,212,255,0.6)]"></div>
                        </div>
                     </div>
                  </div>
                </div>
              )}
              {activeTab === 'jose' && <AssistantJose language={lang} currentSubscriberId={currentUser?.neoLifeId} onConversionDetected={(c, f) => setConversion({country: c, focus: f})} />}
              {activeTab === 'hubs' && <HubLocator />}
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
