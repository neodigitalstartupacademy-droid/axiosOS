
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Fingerprint, Calendar, ShieldCheck, LogOut, Save, Camera, 
  Volume2, Square, Zap, Target, Heart, Cpu, Network, Sparkles, Loader2, Brain
} from 'lucide-react';
import { AuthUser, LeaderDNA, Language } from '../types';
import { voiceService } from '../services/voiceService';
import { generateDnaAnalysis } from '../services/geminiService';

interface ProfileViewProps {
  user: AuthUser;
  onUpdate: (user: AuthUser) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate, onLogout }) => {
  const [formData, setFormData] = useState<AuthUser>(user);
  const [isScanning, setIsScanning] = useState(false);
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);

  useEffect(() => {
    const unsub = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });
    return () => unsub();
  }, []);

  const handleDNAScan = async () => {
    setIsScanning(true);
    voiceService.play("Initialisation du scan neural de votre ADN de leader. Analyse des vecteurs d'influence et de stratégie en cours.", 'dna_scan_start');

    try {
      const prompt = `
        Tu es José, l'IA de la NDSA. Analyse l'utilisateur suivant pour définir son "Leader DNA".
        Nom: ${formData.name}
        Rôle: ${formData.role}
        ID NeoLife: ${formData.neoLifeId}

        Génère un profil de leader technique et puissant au format JSON strict avec les champs: 
        archetype, strategy (1-100), empathy (1-100), technical (1-100), influence (1-100), vision.
      `;

      const result = await generateDnaAnalysis(prompt);
      const dna = JSON.parse(result) as LeaderDNA;
      
      const updatedUser = { ...formData, dna };
      setFormData(updatedUser);
      onUpdate(updatedUser);
      
      voiceService.play(`Scan terminé. Archétype identifié : ${dna.archetype}. Votre vision : ${dna.vision}. Télémétrie synchronisée.`, 'dna_scan_complete');
    } catch (error) {
      console.error("DNA Scan failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRead = () => {
    voiceService.play(`Bienvenue sur votre Profil Leader, ${formData.name}. Ici, nous forgeons l'élite de la NDSA. Activez votre scan neural pour révéler votre véritable potentiel.`, 'profile_brief');
  };

  const StatBar = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2 text-slate-400">
          <Icon size={12} className={color} />
          <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-[10px] font-stark font-bold text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${color}`} 
          style={{ width: `${value}%`, boxShadow: `0 0 10px ${color}` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700 pb-20">
      <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[4rem] border border-blue-500/10 p-12 relative overflow-hidden shadow-3xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="relative group">
            <div className={`w-40 h-40 rounded-[3rem] border-4 overflow-hidden transition-all duration-500 ${formData.dna ? 'border-blue-500 shadow-[0_0_40px_rgba(0,212,255,0.3)]' : 'border-white/10'}`}>
              <img src={formData.avatar} className="w-full h-full object-cover" alt="Profile" />
            </div>
            {formData.dna && (
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-xl border-4 border-slate-950">
                <ShieldCheck size={24} />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">{formData.name}</h2>
              <button 
                onClick={handleRead} 
                className={`p-3 rounded-xl border transition-all ${activeSpeechKey === 'profile_brief' ? 'bg-blue-500 text-slate-950' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
              >
                {activeSpeechKey === 'profile_brief' ? <Square size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest italic">{formData.role}</span>
              <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{formData.neoLifeId}</span>
            </div>
          </div>

          <button 
            onClick={onLogout} 
            className="px-8 py-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="glass-card p-10 rounded-[3.5rem] border border-blue-500/10 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h3 className="font-stark text-xs font-black text-white uppercase tracking-widest leading-none">Neural DNA Analysis</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Souveraineté Digitale</p>
                </div>
              </div>
              <button 
                onClick={handleDNAScan}
                disabled={isScanning}
                className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-3 ${isScanning ? 'bg-white/5 text-slate-500' : 'bg-blue-500 text-slate-950 hover:brightness-110 shadow-lg shadow-blue-500/20'}`}
              >
                {isScanning ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                {formData.dna ? "Relancer le Scan" : "Lancer le Scan DNA"}
              </button>
            </div>

            {formData.dna ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 italic">Archétype Leader</p>
                   <h4 className="text-4xl font-black text-white italic tracking-tighter uppercase">{formData.dna.archetype}</h4>
                   <p className="text-slate-400 text-sm mt-3 italic leading-relaxed">"{formData.dna.vision}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <StatBar label="Stratégie" value={formData.dna.strategy} icon={Target} color="bg-blue-400" />
                  <StatBar label="Influence" value={formData.dna.influence} icon={Network} color="bg-purple-400" />
                  <StatBar label="Expertise" value={formData.dna.technical} icon={Cpu} color="bg-amber-400" />
                  <StatBar label="Empathie" value={formData.dna.empathy} icon={Heart} color="bg-emerald-400" />
                </div>
              </div>
            ) : (
              <div className="py-20 text-center space-y-6 opacity-40">
                <Brain size={64} className="mx-auto text-slate-700" />
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest italic">Analyse bio-metrique requise pour débloquer le profil leader.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="glass-card p-10 rounded-[3.5rem] border border-white/5 space-y-8">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Informations Système</h4>
              <div className="space-y-6">
                 <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <Mail className="text-blue-400" size={20} />
                    <div>
                       <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Canal de Com</p>
                       <p className="text-xs font-bold text-white">{formData.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <Calendar className="text-emerald-400" size={20} />
                    <div>
                       <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Activation Hub</p>
                       <p className="text-xs font-bold text-white">{new Date(formData.joinedDate).toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                 <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.5em] text-center italic">NDSA-LEADER-CERT-V8</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
