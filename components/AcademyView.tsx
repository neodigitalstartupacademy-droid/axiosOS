import React, { useState, useEffect, useRef } from 'react';
import { SYSTEM_CONFIG } from '../constants';
import { Lesson, Message, AuthUser } from '../types';
import { voiceService } from '../services/voiceService';
import { generateJoseResponseStream } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { jsPDF } from 'jspdf';
import { 
  BookOpen, ChevronRight, Play, Trophy, ArrowLeft,
  Square, ChevronLeft, Book, Video, Send, Bot, User,
  GraduationCap, Award, Download, Loader2, Star, CheckCircle2,
  BrainCircuit, Sparkles, BookMarked, ShieldCheck, Flame, Globe, MapPin, Edit3,
  Clock, History, Dna
} from 'lucide-react';

interface LessonProgress {
  currentSectionIdx: number;
  isCompleted: boolean;
  messages: Message[];
}

interface AcademyViewProps {
  user?: AuthUser | null;
  onUpdateUser?: (user: AuthUser) => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({ user, onUpdateUser }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [professorMessages, setProfessorMessages] = useState<Message[]>([]);
  const [isProfessorLoading, setIsProfessorLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [lessonsProgress, setLessonsProgress] = useState<Record<string, LessonProgress>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const userId = user?.id || 'guest';

  useEffect(() => {
    storageService.getItem('academy_progress', userId).then(saved => {
        if (saved) setLessonsProgress(saved.lessons || {});
    });
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [professorMessages]);

  const allModules = SYSTEM_CONFIG.academy.modules;

  const startLesson = async (lesson: Lesson) => {
    voiceService.stop();
    const saved = lessonsProgress[lesson.id];
    
    if (saved && saved.messages.length > 0) {
      setActiveLesson(lesson);
      setCurrentSectionIdx(saved.currentSectionIdx);
      setProfessorMessages(saved.messages);
      setIsLessonCompleted(saved.isCompleted);
    } else {
      setActiveLesson(lesson);
      setCurrentSectionIdx(0);
      setIsLessonCompleted(false);
      
      const welcomeText = `Bonjour Leader. Ici le Professeur Gaetan. Je supervise personnellement votre formation. Commencons le module "${lesson.title}". Voici votre premier pilier de connaissance : \n\n ${lesson.sections?.[0] || lesson.content}`;
      const initMsg: Message = { id: 'init_' + Date.now(), role: 'model', parts: [{ text: welcomeText }], timestamp: new Date() };
      setProfessorMessages([initMsg]);
      voiceService.play(welcomeText, initMsg.id);
    }
  };

  const handleInteraction = async () => {
    if (!userInput.trim() || !activeLesson) return;
    const userMsg: Message = { id: 'u_' + Date.now(), role: 'user', parts: [{ text: userInput }], timestamp: new Date() };
    setProfessorMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsProfessorLoading(true);

    try {
      const stream = await generateJoseResponseStream(`[ACADEMY_MODE] Cours: ${activeLesson.title}. Segment: ${activeLesson.sections?.[currentSectionIdx]}`, professorMessages, null, 'fr', {
        name: SYSTEM_CONFIG.ai.professor.name,
        role: SYSTEM_CONFIG.ai.professor.role,
        philosophy: SYSTEM_CONFIG.ai.professor.philosophy,
        tonality: "Erudit, strategique, autoritaire mais bienveillant.",
        coreValues: "Vision NDSA, Discipline Stark."
      });

      let fullText = "";
      const aiMsgId = 'ai_' + Date.now();
      setProfessorMessages(prev => [...prev, { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date() }]);

      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setProfessorMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }

      voiceService.play(fullText, aiMsgId);
    } catch (e) { console.error(e); } finally { setIsProfessorLoading(false); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {!activeLesson ? (
        <div className="space-y-10">
          <header className="px-6 space-y-4">
             <div className="flex items-center gap-3">
                <ShieldCheck className="text-amber-500" size={32} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 font-stark">Protocole Gaetan Active</h2>
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">Academy <span className="text-amber-500">Gaetan</span></h1>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            {allModules.map(module => (
              <div key={module.id} className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-8 group hover:border-amber-500/30 transition-all">
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{module.title}</h3>
                      <p className="text-slate-500 text-sm italic">{module.description}</p>
                   </div>
                   <Award className="text-amber-500 group-hover:scale-110 transition-transform" size={32} />
                </div>
                <div className="space-y-3">
                   {module.lessons.map(lesson => (
                     <button key={lesson.id} onClick={() => startLesson(lesson)} className="w-full p-6 bg-slate-900/60 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-amber-500/10 transition-all group/btn">
                        <div className="flex items-center gap-5">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs border ${lessonsProgress[lesson.id]?.isCompleted ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-800 text-slate-500 border-white/10'}`}>
                              {lessonsProgress[lesson.id]?.isCompleted ? <CheckCircle2 size={20} /> : lesson.id}
                           </div>
                           <span className="font-black uppercase tracking-widest text-[11px] text-white">{lesson.title}</span>
                        </div>
                        <ChevronRight size={18} className="text-slate-700 group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[85vh] bg-[#020617] rounded-[3rem] border border-amber-500/20 overflow-hidden relative animate-in zoom-in-95 duration-500">
           <header className="h-20 px-10 border-b border-white/10 flex items-center justify-between bg-black/40">
              <button onClick={() => { voiceService.stop(); setActiveLesson(null); }} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
                 <ArrowLeft size={16} /> Retour au Hub
              </button>
              <div className="text-center">
                 <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Enseignement de Gaetan</p>
                 <h4 className="text-sm font-black text-white italic uppercase tracking-tighter">{activeLesson.title}</h4>
              </div>
              <div className="flex gap-1.5">
                 {(activeLesson.sections || [1,2,3]).map((_, i) => (
                    <div key={i} className={`w-8 h-1 rounded-full transition-all duration-700 ${i <= currentSectionIdx ? 'bg-amber-500 shadow-[0_0_10px_#FFD700]' : 'bg-white/5'}`}></div>
                 ))}
              </div>
           </header>

           <main className="flex-1 flex flex-col relative overflow-hidden">
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 md:px-20 pt-12 pb-44 space-y-12 no-scrollbar scroll-smooth">
                 {professorMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                       <div className={`flex gap-6 w-full ${msg.role === 'user' ? 'max-w-[75%] flex-row-reverse' : 'max-w-full'}`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border mt-1 ${msg.role === 'user' ? 'bg-slate-900 border-white/10' : 'bg-amber-500/10 border-amber-500/30'}`}>
                             {msg.role === 'user' ? <User size={20} className="text-slate-600" /> : <Star size={24} className="text-amber-500" />}
                          </div>
                          <div className="space-y-4 w-full">
                             <div className={`text-lg font-light leading-relaxed tracking-tight whitespace-pre-line ${msg.role === 'user' ? 'text-amber-300 italic text-right' : 'text-slate-100'}`}>
                                {msg.parts[0].text}
                             </div>
                             {msg.role === 'model' && (
                               <button onClick={() => voiceService.play(msg.parts[0].text, msg.id)} className={`px-5 py-2 rounded-xl border font-stark text-[8px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${voiceService.isCurrentlyReading(msg.id) ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}>
                                  {voiceService.isCurrentlyReading(msg.id) ? <Square size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                                  {voiceService.isCurrentlyReading(msg.id) ? "Stop" : "Vocaliser Gaetan"}
                                </button>
                             )}
                          </div>
                       </div>
                    </div>
                 ))}
                 {isProfessorLoading && (
                    <div className="flex items-center gap-4 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 animate-pulse max-w-sm">
                       <Loader2 className="animate-spin text-amber-500" size={24} />
                       <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] italic">Analyse Strategique de Gaetan...</p>
                    </div>
                 )}
              </div>

              <div className="absolute bottom-10 left-0 w-full px-10 pointer-events-none">
                 <div className="max-w-4xl mx-auto glass-card rounded-[2.5rem] p-3 pointer-events-auto border border-white/10 shadow-3xl">
                    <div className="flex items-center gap-5 bg-black/60 rounded-[2rem] border border-white/5 px-8 focus-within:border-amber-500/50 transition-all">
                       <input 
                          type="text" 
                          value={userInput} 
                          onChange={e => setUserInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleInteraction()}
                          placeholder="Repondre au Professeur Gaetan..." 
                          className="flex-1 bg-transparent border-none text-white outline-none font-medium text-lg italic py-5 placeholder:text-slate-800"
                       />
                       <button onClick={handleInteraction} disabled={isProfessorLoading} className="w-14 h-14 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-2xl active:scale-95 transition-all">
                          <Send size={24} />
                       </button>
                    </div>
                 </div>
              </div>
           </main>
        </div>
      )}
    </div>
  );
};