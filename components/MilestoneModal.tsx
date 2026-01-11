import React, { useState, useRef } from 'react';
import { Trophy, Award, ArrowRight, X, CheckCircle2, Volume2, Square, Sparkles } from 'lucide-react';
import { generateJoseAudio, decodeBase64, decodeAudioData } from '../services/geminiService';

export const MilestoneModal: React.FC<{onClose: () => void, onUnlock: () => void}> = ({ onClose, onUnlock }) => {
  const [isReading, setIsReading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleRead = async () => {
    if (isReading) { 
      if (activeSourceRef.current) activeSourceRef.current.stop();
      setIsReading(false);
      return;
    }
    setIsReading(true);
    const text = "Félicitations Leader ! Vous avez franchi le premier cap de l'Empire. Le niveau Silver est activé.";
    const base64 = await generateJoseAudio(text);
    if (base64) {
      if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decodeBase64(base64), audioContextRef.current, 24000, 1);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      activeSourceRef.current = source;
      source.start();
      source.onended = () => setIsReading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-2xl z-[500] flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="bg-white rounded-[4rem] w-full max-w-5xl overflow-hidden relative flex flex-col md:flex-row shadow-[0_0_100px_rgba(255,215,0,0.2)]">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-900 z-50"><X size={24} /></button>
        
        <div className="md:w-1/2 bg-slate-950 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent"></div>
           <div className="relative z-10 space-y-8">
              <div className="w-24 h-24 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-12">
                 <Trophy size={48} className="text-slate-950" />
              </div>
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Élite <span className="text-amber-500">Silver</span></h2>
              <div className="rounded-[2.5rem] border-4 border-amber-500/30 overflow-hidden shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop" alt="Certification" className="w-full h-auto" />
              </div>
              <button onClick={handleRead} className={`p-4 rounded-2xl shadow-xl transition-all ${isReading ? 'bg-blue-600' : 'bg-white/10'}`}>
                {isReading ? <Square size={20} /> : <Volume2 size={20} />}
              </button>
           </div>
        </div>

        <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center space-y-8">
           <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Cap des 10 Ventes Franchi !</h3>
           <p className="text-slate-600 text-lg italic leading-relaxed font-medium">
              "Votre système de duplication Stark est maintenant prouvé sur le terrain. Le Hub passe en mode Expansion."
           </p>
           <div className="bg-blue-50 p-8 rounded-[2.5rem] space-y-4">
              <li className="flex items-center gap-3 text-xs font-bold text-slate-700"><CheckCircle2 size={16} className="text-emerald-500" /> Module Level 2 Débloqué</li>
              <li className="flex items-center gap-3 text-xs font-bold text-slate-700"><CheckCircle2 size={16} className="text-emerald-500" /> Support IA Prioritaire</li>
           </div>
           <button onClick={() => { onUnlock(); onClose(); }} className="w-full py-6 bg-slate-950 text-white font-black rounded-3xl uppercase tracking-widest text-sm shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
              ACTIVER LEVEL 2 <ArrowRight size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};