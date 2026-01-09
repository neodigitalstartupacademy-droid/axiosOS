
import React, { useState, useEffect, useRef } from 'react';
import { 
    Zap, Share2, Check, Copy, Target, Globe, Fingerprint, Activity, BarChart3, TrendingUp, Users, MessageSquare, Volume2, Square, Sparkles, HeartPulse
} from 'lucide-react';
import { SYSTEM_CONFIG } from '../constants';
import { generateJoseAudio, decodeBase64, decodeAudioData } from '../services/geminiService';

export const SocialSync: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [customId, setCustomId] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [viralHealth, setViralHealth] = useState(88);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('ndsa_personal_id');
    if (savedId) setCustomId(savedId);
    else setCustomId(SYSTEM_CONFIG.founder.id);
  }, []);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomId(val);
    localStorage.setItem('ndsa_personal_id', val);
    // Dynamic health simulation
    setViralHealth(val ? 94 : 88);
  };

  const smartLink = `${window.location.origin}${window.location.pathname}?ref=${customId || SYSTEM_CONFIG.founder.id}&mode=welcome`;
  const inviteLink = `https://axioma-app.com/join?ref=${customId || SYSTEM_CONFIG.founder.id}`;
  const shareMessage = `J'utilise ${SYSTEM_CONFIG.brand} et l'IA ${SYSTEM_CONFIG.ai.name} pour ma santé cellulaire. Rejoins mon équipe !`;

  const stopAudio = () => {
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch (e) {}
      activeSourceRef.current = null;
    }
    setIsReading(false);
  };

  const handleRead = async () => {
    if (isReading) { stopAudio(); return; }
    setIsReading(true);
    const textToRead = `Bienvenue dans le Moteur de Viralité AXIOMA. Votre Smart Link Élite vous permet de capturer des prospects bio-numériques. Chaque clic redirige vers Coach ${SYSTEM_CONFIG.ai.name}. Partagez votre impact sur WhatsApp et Facebook.`;
    const base64 = await generateJoseAudio(textToRead);
    if (base64) {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
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

  const copySmartLink = () => {
    navigator.clipboard.writeText(smartLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTo = (platform: 'whatsapp' | 'facebook') => {
    let url = "";
    if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + " " + smartLink)}`;
    } else {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(smartLink)}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
      <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[4rem] border border-white/10 p-12 md:p-16 relative overflow-hidden shadow-3xl">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00d4ff]/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-full text-[11px] font-black text-[#00d4ff] uppercase tracking-[0.3em] italic">
                  <Zap size={16} /> Viral Engine Active
                </div>
                <button 
                  onClick={handleRead}
                  className={`p-4 rounded-2xl border transition-all ${isReading ? 'bg-[#00d4ff] text-slate-950 shadow-[0_0_15px_#00d4ff]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                >
                  {isReading ? <Square size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
              <h2 className="text-6xl font-black text-white tracking-tighter italic uppercase leading-none">Smart Link <span className="text-[#00d4ff]">Elite</span></h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic">
                Votre lien de capture bio-digital. Chaque clic injecte un nouveau prospect dans le scanner de {SYSTEM_CONFIG.ai.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <Fingerprint size={12} className="text-[#00d4ff]" /> Votre ID NeoLife / Hub
                  </label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={customId} 
                      onChange={handleIdChange}
                      placeholder="Ex: 067-2922111" 
                      className="w-full bg-slate-950/80 border border-white/10 px-8 py-6 rounded-3xl text-white font-black italic text-lg outline-none focus:border-[#00d4ff] transition-all shadow-inner"
                    />
                    <Sparkles size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-[#00d4ff] transition-colors" />
                  </div>
               </div>
               
               <div className="space-y-6 p-6 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-2">Viral Health Score</p>
                    <h4 className={`text-4xl font-black italic tracking-tighter ${viralHealth > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{viralHealth}%</h4>
                  </div>
                  <div className={`p-4 rounded-2xl ${viralHealth > 90 ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'} border border-current opacity-60 group-hover:opacity-100 transition-opacity`}>
                    <HeartPulse size={32} className={viralHealth > 90 ? 'animate-pulse' : ''} />
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Lien de Capture Universel</label>
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-slate-950/90 border border-[#00d4ff]/20 px-8 py-6 rounded-3xl text-[#00d4ff] font-mono text-xs truncate flex items-center shadow-inner group overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 w-1 bg-[#00d4ff] group-hover:w-full transition-all duration-700 opacity-5"></div>
                    {smartLink}
                  </div>
                  <button 
                    onClick={copySmartLink} 
                    className="p-6 bg-[#00d4ff] text-slate-950 rounded-3xl transition-all shadow-[0_10px_30px_#00d4ff44] hover:brightness-110 active:scale-90 flex items-center justify-center gap-3 font-stark font-black text-xs uppercase"
                  >
                    {copied ? <Check size={28} /> : <Copy size={28} />}
                    {copied && <span className="pr-2">Copié</span>}
                  </button>
               </div>
            </div>

            <div className="pt-6 flex flex-wrap gap-4">
               <button 
                onClick={() => shareTo('whatsapp')}
                className="px-8 py-4 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-3"
               >
                 <MessageSquare size={16} /> WhatsApp Sync
               </button>
               <button 
                onClick={() => shareTo('facebook')}
                className="px-8 py-4 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3"
               >
                 <Globe size={16} /> Facebook Viral
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 shadow-xl overflow-hidden relative backdrop-blur-md group">
         <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="text-3xl font-stark font-black text-white tracking-tight flex items-center gap-6 italic uppercase leading-none"><BarChart3 size={40} className="text-[#00d4ff]" /> Viral Dynamics</h3>
              <p className="text-slate-500 text-lg font-medium mt-4 italic opacity-80">Mesure de l'impact organique de vos partages Stark.</p>
            </div>
            <div className="px-6 py-3 bg-emerald-500/10 text-emerald-500 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-3">
              <TrendingUp size={16} className="animate-bounce" /> Optimization Active
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            {[
              { label: "Portée Totale", value: "14,250", icon: Users, color: "text-[#00d4ff]" },
              { label: "Engagement", value: "8.4%", icon: TrendingUp, color: "text-emerald-400" },
              { label: "Vitesse Virale", value: "STARK-1", icon: Zap, color: "text-amber-500" }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-8 hover:bg-white/5 transition-all group/item">
                <stat.icon size={36} className={`${stat.color} group-hover/item:scale-125 transition-transform duration-500`} />
                <div>
                  <p className="font-stark text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 italic">{stat.label}</p>
                  <h4 className="font-stark text-4xl font-black text-white italic tracking-tighter tabular-nums">{stat.value}</h4>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};
