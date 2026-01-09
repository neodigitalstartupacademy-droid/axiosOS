
import React, { useState, useMemo, useEffect } from 'react';
import { SYSTEM_CONFIG } from '../constants';
import { Lesson } from '../types';
import { voiceService } from '../services/voiceService';
import { 
  BookOpen, ChevronRight, Play, Search, Lock, 
  Sparkles, BrainCircuit, Target, Globe, Trophy, ArrowLeft,
  Square, ChevronLeft, Book, HelpCircle
} from 'lucide-react';

export const AcademyView: React.FC<{ isLevel2Unlocked?: boolean }> = ({ isLevel2Unlocked = false }) => {
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });
    return () => unsubVoice();
  }, []);

  const allModules = useMemo(() => [
    ...SYSTEM_CONFIG.academy.modules.map(m => ({ ...m, isPremium: false })),
    ...SYSTEM_CONFIG.academy.premiumModules.map(m => ({ ...m, isPremium: true }))
  ], []);

  const currentModule = allModules[selectedModuleIdx];

  const handleReadLesson = (text: string, id: string) => {
    voiceService.play(`Formation Leadership Stark. ${text}`, `lesson_${id}`);
  };

  if (selectedLesson) {
    return (
      <div className="animate-in slide-in-from-right duration-500 max-w-5xl mx-auto">
        <button onClick={() => { setSelectedLesson(null); voiceService.stop(); }} className="mb-8 flex items-center gap-3 text-slate-400 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest"><ArrowLeft size={16} /> Retour au Curriculum</button>
        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-3xl">
          <div className="p-12 border-b border-white/5 bg-gradient-to-r from-[#00d4ff]/10 to-transparent flex justify-between items-center">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{selectedLesson.title}</h2>
            <button onClick={() => handleReadLesson(selectedLesson.content, selectedLesson.id)} className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${activeSpeechKey === `lesson_${selectedLesson.id}` ? 'bg-[#00d4ff] text-slate-950 animate-pulse' : 'bg-white text-slate-950 hover:scale-110'}`}>{activeSpeechKey === `lesson_${selectedLesson.id}` ? <Square size={32} /> : <Play size={32} fill="currentColor" className="ml-1" />}</button>
          </div>
          <div className="p-12 space-y-10"><p className="text-xl text-slate-300 leading-relaxed font-medium italic whitespace-pre-line">{selectedLesson.content}</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div><h2 className="text-6xl font-black text-white italic uppercase tracking-tighter">Stark Academy</h2><p className="text-slate-500 mt-4 italic">Forgez votre leadership.</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {allModules.map((mod, idx) => (
            <button key={mod.id} onClick={() => { setSelectedModuleIdx(idx); setSelectedLesson(null); voiceService.stop(); }} className={`w-full text-left p-6 rounded-[2.5rem] border transition-all ${selectedModuleIdx === idx ? 'bg-white text-slate-950 border-white' : 'bg-white/5 border-white/10 text-white'}`}><h3 className="font-black text-xs uppercase tracking-tighter leading-tight">{mod.title}</h3></button>
          ))}
        </div>
        <div className="lg:col-span-3 space-y-4">
          {currentModule.lessons.map((lesson, i) => (
            <div key={lesson.id} onClick={() => setSelectedLesson(lesson)} className="flex items-center justify-between p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white hover:border-white group cursor-pointer transition-all">
              <span className="text-xl font-bold text-slate-300 group-hover:text-slate-950 italic">{lesson.title}</span>
              <ChevronRight size={24} className="group-hover:text-slate-950" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
