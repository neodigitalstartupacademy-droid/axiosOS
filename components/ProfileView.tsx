
import React, { useState, useEffect } from 'react';
import { User, Mail, Fingerprint, Calendar, ShieldCheck, LogOut, Save, Camera, Volume2, Square } from 'lucide-react';
import { AuthUser } from '../types';
import { voiceService } from '../services/voiceService';

interface ProfileViewProps {
  user: AuthUser;
  onUpdate: (user: AuthUser) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate, onLogout }) => {
  const [formData, setFormData] = useState<AuthUser>(user);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);

  useEffect(() => {
    const unsub = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });
    return () => unsub();
  }, []);

  const handleRead = () => {
    voiceService.play(`Bienvenue sur votre Profil Leader. Vous pouvez modifier votre identité NeoLife ici.`, 'profile_brief');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 p-10 overflow-hidden relative shadow-3xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <img src={formData.avatar} className="w-32 h-32 rounded-[2.5rem] border-4 border-[#00d4ff]/20" />
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{formData.name}</h2>
              <button onClick={handleRead} className={`p-2 rounded-xl border transition-all ${activeSpeechKey === 'profile_brief' ? 'bg-[#00d4ff] text-slate-950 animate-pulse' : 'bg-white/5 text-slate-400'}`}>
                {activeSpeechKey === 'profile_brief' ? <Square size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>
          <button onClick={onLogout} className="px-6 py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"><LogOut size={18} /> Déconnexion</button>
        </div>
      </div>
    </div>
  );
};
