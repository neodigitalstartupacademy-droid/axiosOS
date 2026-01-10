
import React, { useState, useEffect, Suspense } from 'react';
import { LayoutDashboard, Bot, GraduationCap, Share2, Wallet, Menu, User, ClipboardList, Cpu, Globe, Zap, ShieldCheck, MapPin, Terminal, Box, Sparkles, Loader2 } from 'lucide-react';
import { SYSTEM_CONFIG } from './constants';
import { AssistantJose } from './components/AssistantJose';
import { AcademyView } from './components/AcademyView';
import { SocialSync } from './components/SocialSync';
import { FinanceView } from './components/FinanceView';
import { AdminMonitor } from './components/AdminMonitor';
import { AuthView } from './components/AuthView';
import { ProfileView } from './components/ProfileView';
import { HubLocator } from './components/HubLocator';
import { LeadChart } from './components/LeadChart';
import { DiagnosticHistory } from './components/DiagnosticHistory';
import { AuthUser, Language } from './types';
import { voiceService } from './services/voiceService';

type TabType = 'dashboard' | 'jose' | 'academy' | 'social' | 'finance' | 'admin' | 'profile' | 'history' | 'hubs';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isUltimateGold, setIsUltimateGold] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('ndsa_session');
    if (saved) {
      const user = JSON.parse(saved);
      setCurrentUser(user);
      if (localStorage.getItem('ndsa_ultimate_gold') === 'true') setIsUltimateGold(true);
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogin = (user: AuthUser, ultimate = false) => {
    setCurrentUser(user);
    if (ultimate) {
      setIsUltimateGold(true);
      localStorage.setItem('ndsa_ultimate_gold', 'true');
      document.body.classList.add('ultimate-gold-mode');
    }
    localStorage.setItem('ndsa_session', JSON.stringify(user));
  };

  if (isAuthLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020617] text-blue-500 font-stark">
      <Cpu className="animate-spin mb-4" size={64} />
      <p className="tracking-[0.5em] animate-pulse">BOOTING STARK OS...</p>
    </div>
  );

  if (!currentUser) return <AuthView onLogin={handleLogin} />;

  return (
    <div className={`h-screen flex overflow-hidden ${isUltimateGold ? 'ultimate-gold-mode' : ''}`}>
      {isUltimateGold && <div className="gold-aura"></div>}
      
      {/* SIDEBAR */}
      <aside className={`w-72 lg:w-80 h-full glass-card border-r transition-all z-[100] flex flex-col ${isUltimateGold ? 'gold-card' : 'border-white/5'}`}>
        <div className="p-8 space-y-12">
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${isUltimateGold ? 'border-amber-500 bg-amber-500/10' : 'border-blue-500/20 bg-blue-500/5'}`}>
              <Box size={32} className={isUltimateGold ? 'text-amber-500' : 'text-blue-500'} />
            </div>
            <h1 className={`font-stark font-black text-xl uppercase tracking-tighter ${isUltimateGold ? 'gold-text-shimmer' : ''}`}>STARK OS</h1>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: "Command Center", icon: LayoutDashboard },
              { id: 'jose', label: "Neural Advisor", icon: Bot },
              { id: 'hubs', label: "Geo-Nexus", icon: MapPin },
              { id: 'academy', label: "Stark Academy", icon: GraduationCap },
              { id: 'social', label: "Viral Network", icon: Share2 },
              { id: 'finance', label: "Revenue Flux", icon: Wallet },
              { id: 'profile', label: "Identity DNA", icon: User },
              ...(currentUser.role === 'ADMIN' ? [{ id: 'admin', label: "High Command", icon: Terminal }] : [])
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id as TabType); voiceService.stop(); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? (isUltimateGold ? 'bg-amber-500 text-black' : 'bg-blue-500 text-black') : 'text-slate-500 hover:bg-white/5'}`}
              >
                <item.icon size={16} /> {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-24 px-10 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/20">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Mission <span className={isUltimateGold ? 'text-amber-500' : 'text-blue-500'}>{activeTab}</span></h2>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${isUltimateGold ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-white/10 text-slate-500'}`}>
              {currentUser.dna?.rank || 'OPERATIVE'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10">
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            {activeTab === 'dashboard' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-10 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Core</p>
                    <h3 className="text-3xl font-stark font-black">99.9%</h3>
                  </div>
                  <div className="glass-card p-10 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Viral Reach</p>
                    <h3 className="text-3xl font-stark font-black text-emerald-500">Global</h3>
                  </div>
                  <div className="glass-card p-10 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sync Status</p>
                    <h3 className="text-3xl font-stark font-black text-blue-500">Stable</h3>
                  </div>
                </div>
                <LeadChart />
              </div>
            )}
            {activeTab === 'jose' && <AssistantJose />}
            {activeTab === 'hubs' && <HubLocator />}
            {activeTab === 'academy' && <AcademyView user={currentUser} />}
            {activeTab === 'social' && <SocialSync />}
            {activeTab === 'finance' && <FinanceView user={currentUser} />}
            {activeTab === 'profile' && <ProfileView user={currentUser} onUpdate={(u) => setCurrentUser(u)} onLogout={() => { localStorage.clear(); window.location.reload(); }} />}
            {activeTab === 'admin' && <AdminMonitor stats={{ totalNetSaaS: 125000, aiEffectiveness: 99.2, orphanLeadsCount: 1420, totalActiveHubs: 18 }} />}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default App;
