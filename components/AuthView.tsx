
import React, { useState } from 'react';
// Added missing 'Star' icon to the lucide-react imports
import { Fingerprint, Loader2, ShieldCheck, Zap, Layers, Volume2, Square, UserCheck, Lock, Star } from 'lucide-react';
import { AuthUser } from '../types';
import { SYSTEM_CONFIG } from '../constants';
import { generateJoseAudio, decodeBase64, decodeAudioData } from '../services/geminiService';
import { voiceService } from '../services/voiceService';

interface AuthViewProps {
  onLogin: (user: AuthUser, ultimate?: boolean) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const audioContextRef = React.useRef<AudioContext | null>(null);
  const activeSourceRef = React.useRef<AudioBufferSourceNode | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Identification requise.");
      return;
    }
    setIsScanning(true);
    setError('');
    
    // RECONNAISSANCE DU FONDATEUR PAR NOM OU EMAIL OU CLÉ MAÎTRE
    const inputEmail = email.toLowerCase();
    const isMasterKey = password === SYSTEM_CONFIG.security.master_key;
    const isFounder = inputEmail.includes('jose') || inputEmail.includes('gaetan') || inputEmail.includes('067-2922111') || inputEmail.includes('abada') || isMasterKey;

    setTimeout(async () => {
      if (isMasterKey) {
        // AUDIO FEEDBACK SPÉCIFIQUE
        await voiceService.play("Welcome back, Founder. System is at 100% capacity. Ultimate Imperium protocol initialized.", 'master_login');
      }

      const mockUser: AuthUser = {
        id: isFounder ? 'founder_root' : 'u_' + Math.random().toString(36).substring(7),
        name: isFounder ? SYSTEM_CONFIG.founder.name : email.split('@')[0],
        email: email,
        neoLifeId: isFounder ? SYSTEM_CONFIG.founder.id : 'MEMBER-' + Math.random().toString(36).substring(7),
        role: isFounder ? 'ADMIN' : 'LEADER',
        joinedDate: new Date(),
        avatar: isFounder ? "https://api.dicebear.com/7.x/avataaars/svg?seed=JoseGaetan" : `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        dna: isMasterKey ? {
          archetype: "Ultimate Imperium Founder",
          strategy: 100,
          empathy: 95,
          technical: 100,
          influence: 100,
          vision: "Restauration Biologique Mondiale via Stark Engine.",
          rank: 'ELITE_DIAMOND'
        } : undefined
      };
      
      localStorage.setItem('ndsa_session', JSON.stringify(mockUser));
      onLogin(mockUser, isMasterKey);
      setIsScanning(false);
    }, 2000);
  };

  const stopAudio = () => {
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch (e) {}
      activeSourceRef.current = null;
    }
    setIsReading(false);
  };

  const readGuide = async () => {
    if (isReading) { stopAudio(); return; }
    setIsReading(true);
    const text = "Système Imperium activé. Bienvenue sur le Hub NDSA GMBC OS. Fondateur Gaétan, veuillez synchroniser vos identifiants pour accéder au Cockpit de Direction.";
    const base64 = await generateJoseAudio(text);
    if (base64) {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decoded = decodeBase64(base64);
      const audioBuffer = await decodeAudioData(decoded, audioContextRef.current, 24000, 1);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      activeSourceRef.current = source;
      source.start();
      source.onended = () => setIsReading(false);
    } else { setIsReading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b1418] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_70%)] animate-pulse" aria-hidden="true"></div>
      
      <div className={`w-full max-w-xl rounded-[4rem] border p-12 md:p-16 shadow-3xl relative z-10 animate-in zoom-in-95 duration-700 transition-all ${password === SYSTEM_CONFIG.security.master_key ? 'gold-card border-amber-500/40 bg-amber-950/20' : 'bg-slate-900/40 backdrop-blur-3xl border-white/10'}`}>
        <button 
          onClick={readGuide}
          className={`absolute top-10 right-10 p-4 rounded-2xl border transition-all ${isReading ? 'bg-[#00d4ff] text-slate-950 shadow-[0_0_15px_#00d4ff]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
        >
          {isReading ? <Square size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="text-center space-y-8 mb-12">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden border transition-all ${password === SYSTEM_CONFIG.security.master_key ? 'bg-amber-500/20 border-amber-500/40 animate-bounce' : 'bg-[#00d4ff]/10 border-[#00d4ff]/20'}`}>
            {password === SYSTEM_CONFIG.security.master_key ? <Star size={44} className="text-amber-400" /> : <Layers size={44} className="text-[#00d4ff]" />}
          </div>
          <header>
            <h1 className={`text-4xl font-black italic uppercase tracking-tighter ${password === SYSTEM_CONFIG.security.master_key ? 'gold-text-shimmer' : 'text-white'}`}>{SYSTEM_CONFIG.brand}</h1>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] mt-2 italic ${password === SYSTEM_CONFIG.security.master_key ? 'text-amber-400' : 'text-[#00d4ff]'}`}>
                {password === SYSTEM_CONFIG.security.master_key ? 'ACCESS KEY DETECTED' : 'Terminal de Synchronisation Master'}
            </p>
          </header>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Identifiant / Email</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ABADA Jose ou Email"
              className={`w-full px-8 py-6 rounded-3xl font-bold outline-none transition-all border ${password === SYSTEM_CONFIG.security.master_key ? 'bg-black/60 border-amber-500/30 text-amber-200' : 'bg-slate-950 border-white/10 text-white focus:border-[#00d4ff]'}`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Clé de Cryptage (Master Key)</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-8 py-6 rounded-3xl font-bold outline-none transition-all border ${password === SYSTEM_CONFIG.security.master_key ? 'bg-black/60 border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(255,215,0,0.1)]' : 'bg-slate-950 border-white/10 text-white focus:border-[#00d4ff]'}`}
              required
            />
          </div>

          {error && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">{error}</p>}

          <button 
            type="submit" 
            disabled={isScanning}
            className={`w-full py-8 font-black rounded-[2.5rem] uppercase tracking-[0.5em] text-xs shadow-2xl flex items-center justify-center gap-4 hover:brightness-110 active:scale-95 transition-all ${password === SYSTEM_CONFIG.security.master_key ? 'ultimate-gold-btn text-black' : 'bg-[#00d4ff] text-slate-950'}`}
          >
            {isScanning ? <><Loader2 className="animate-spin" size={20} /> ACCÈS OMEGA...</> : <><UserCheck size={20} /> {password === SYSTEM_CONFIG.security.master_key ? 'INITIALIZE IMPERIUM' : 'SYNCHRONISER'}</>}
          </button>
        </form>
        
        <div className={`mt-10 p-5 rounded-2xl flex items-center gap-4 border ${password === SYSTEM_CONFIG.security.master_key ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/5'}`}>
           <ShieldCheck size={18} className={password === SYSTEM_CONFIG.security.master_key ? 'text-amber-400' : 'text-emerald-500'} />
           <p className={`text-[9px] font-bold uppercase tracking-widest leading-relaxed ${password === SYSTEM_CONFIG.security.master_key ? 'text-amber-200/60' : 'text-slate-500'}`}>
             {password === SYSTEM_CONFIG.security.master_key ? 'Security Layer: ULTIMATE_GOLD. Full Administrative Access granted.' : 'Le Cockpit de Direction est crypté. Accès exclusif via l\'identifiant Fondateur.'}
           </p>
        </div>
      </div>
    </div>
  );
};
