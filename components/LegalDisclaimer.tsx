
import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, FileText, ExternalLink, ShieldCheck, Volume2, Square } from 'lucide-react';
import { I18N, SYSTEM_CONFIG } from '../constants';
import { Language } from '../types';
import { voiceService } from '../services/voiceService';

interface LegalDisclaimerProps {
  language: Language;
  onAccept: () => void;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ language, onAccept }) => {
  const t = I18N[language];
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);

  useEffect(() => {
    const unsub = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });
    return () => unsub();
  }, []);

  const handleRead = () => {
    const textToRead = `${t.legal_title}. ${t.legal_disclaimer}. Veuillez accepter les protocoles de sécurité.`;
    voiceService.play(textToRead, 'legal_brief', language);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[1000] flex items-center justify-center p-6 backdrop-blur-3xl">
      <div className="w-full max-w-2xl bg-slate-900/80 border border-white/10 rounded-[3rem] p-12 md:p-16 shadow-3xl relative">
        <button onClick={handleRead} className={`absolute top-10 right-10 p-4 rounded-2xl border transition-all ${activeSpeechKey === 'legal_brief' ? 'bg-[#00d4ff] text-slate-950 animate-pulse' : 'bg-white/5 border-white/10 text-slate-400'}`}>
          {activeSpeechKey === 'legal_brief' ? <Square size={20} /> : <Volume2 size={20} />}
        </button>
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center text-amber-500"><ShieldAlert size={44} /></div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{t.legal_title}</h2>
            <p className="text-slate-400 text-lg font-medium italic leading-relaxed">{t.legal_disclaimer}</p>
          </div>
          <button onClick={() => { voiceService.stop(); onAccept(); }} className="w-full p-5 bg-[#00d4ff] text-slate-950 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all">
            {t.legal_accept} <CheckCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
