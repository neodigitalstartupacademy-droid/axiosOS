import React, { useState, useEffect, Suspense } from 'react';
import { LayoutDashboard, Bot, GraduationCap, Share2, Wallet, User, MapPin, Terminal, Power, Zap, ShieldCheck, Globe, Loader2 } from 'lucide-react';
import { AssistantJose } from './components/AssistantJose';
import { AcademyView } from './components/AcademyView';
import { SocialSync } from './components/SocialSync';
import { FinanceView } from './components/FinanceView';
import { ProfileView } from './components/ProfileView';
import { HubLocator } from './components/HubLocator';
import { LeadChart } from './components/LeadChart';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ConversionNotification } from './components/ConversionNotification';
import { AuthView } from './components/AuthView';
import { AuthUser } from './types';
import { voiceService } from './services/voiceService';
import { referralService } from './services/referralService';
import { SYSTEM_CONFIG } from './constants';

type TabType = 'dashboard' | 'jose' | 'academy' | 'social' | 'finance' | 'admin' | 'profile' | 'hubs';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeConversion, setActiveConversion] = useState<{country: string, focus: string} | null>(null);

  useEffect(() => {
    // Initialisation rapide
    const context = referralService.captureReferral();
    if (context && !currentUser) {
      setActiveTab('jose'); 
    }

    const saved = localStorage.getItem('ndsa_session');
    if (saved) {
      const user = JSON.parse(saved);
      setCurrentUser(user);
      const onboardingDone = localStorage.getItem('ndsa_onboarding_done');
      if (!onboardingDone) setShowOnboarding(true);
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogin = (user: AuthUser, ultimate = false) => {
    setCurrentUser(user);
    localStorage.setItem('ndsa_session', JSON.stringify(user));
    const onboardingDone = localStorage.getItem('ndsa_onboarding_done');
    if (!onboardingDone) setShowOnboarding(true);
  };

  const handleLogout = () => {
    voiceService.stop();
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  if (isAuthLoading) return null;
  if (!currentUser && activeTab !== 'jose') return <AuthView onLogin={handleLogin} />;
  
  const NavItem = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button 
      onClick={() => { setActiveTab(id); setSidebarOpen(false); voiceService.stop(); }}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-none ${
        activeTab === id 
        ? 'bg-[#FFD700] text-black shadow-lg' 
        : 'text-slate-400 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span className="text-[10px] font-black uppercase tracking-widest font-stark">{label}</span>
    </button>
  );

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#020617] text-white">
      {showOnboarding && <OnboardingWizard onClose={() => setShowOnboarding(false)} />}
      
      {activeConversion && (
        <ConversionNotification 
          prospectCountry={activeConversion.country}
          healthFocus={activeConversion.focus}
          onClose={() => setActiveConversion(null)}
          onSocialSync={() => setActiveTab('social')}
        />
      )}

      <aside className={`fixed md:relative inset-y-0 left-0 w-64 h-full bg-[#0f172a] border-r border-white/5 flex flex-col z-[100] transition-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Zap size={28} className="text-amber-500" />
          </div>
          <h1 className="font-stark font-black text-lg text-[#FFD700] uppercase tracking-tighter">GMBC OS</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar py-4">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="jose" label="IA Jose" icon={Bot} />
          <NavItem id="hubs" label="Nexus Geo" icon={MapPin} />
          <NavItem id="academy" label="Academy" icon={GraduationCap} />
          <NavItem id="social" label="Viral Sync" icon={Share2} />
          <NavItem id="finance" label="Finances" icon={Wallet} />
          <NavItem id="profile" label="Profile" icon={User} />
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-3 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-[#FFD700]">
            <Power size={14} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#020617]">
        <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-[#020617] z-50">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-[#FFD700]">
               <LayoutDashboard size={20} />
             </button>
             <span className="hidden md:block text-[9px] font-black text-slate-500 uppercase tracking-widest">{SYSTEM_CONFIG.officialDomain}</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[8px] font-black text-amber-500 uppercase">
                Core Secured
             </div>
             {currentUser && (
               <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-white uppercase hidden sm:block">{currentUser.name}</span>
                  <img src={currentUser.avatar} className="w-8 h-8 rounded-lg border border-white/10" alt="AV" />
               </div>
             )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-10 pt-6 pb-20 no-scrollbar">
          <Suspense fallback={<Loader2 className="animate-spin text-[#FFD700] mx-auto mt-20" size={32} />}>
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                    <h3 className="text-xl font-stark font-black text-emerald-400 uppercase">Active</h3>
                  </div>
                  <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Hub</p>
                    <h3 className="text-xl font-stark font-black text-white uppercase">V9.7 Gold</h3>
                  </div>
                  <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Host</p>
                    <h3 className="text-xl font-stark font-black text-amber-500 uppercase">GMBCOREOS</h3>
                  </div>
                </div>
                <LeadChart />
              </div>
            )}
            {activeTab === 'jose' && <AssistantJose onConversionDetected={(c, f) => setActiveConversion({country: c, focus: f})} />}
            {activeTab === 'hubs' && <HubLocator />}
            {activeTab === 'academy' && <AcademyView user={currentUser} onUpdateUser={u => setCurrentUser(u)} />}
            {activeTab === 'social' && <SocialSync />}
            {activeTab === 'finance' && <FinanceView user={currentUser} />}
            {activeTab === 'profile' && currentUser && <ProfileView user={currentUser} onUpdate={setCurrentUser} onLogout={handleLogout} />}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default App;