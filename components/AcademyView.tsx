
import React, { useState, useEffect, useRef } from 'react';
import { SYSTEM_CONFIG } from '../constants';
import { Lesson, Resource, Message } from '../types';
import { voiceService } from '../services/voiceService';
import { generateJoseResponseStream } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import { 
  BookOpen, ChevronRight, Play, Trophy, ArrowLeft,
  Square, ChevronLeft, Book, Video, Send, Bot, User,
  GraduationCap, Award, Download, Loader2, Star, CheckCircle2,
  BrainCircuit, Sparkles, BookMarked
} from 'lucide-react';

export const AcademyView: React.FC = () => {
  const [activeView, setActiveView] = useState<'curriculum' | 'resources' | 'mentor'>('curriculum');
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  // Interactive Professor State
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [professorMessages, setProfessorMessages] = useState<Message[]>([]);
  const [isProfessorLoading, setIsProfessorLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });
    return () => unsubVoice();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [professorMessages]);

  const allModules = SYSTEM_CONFIG.academy.modules;
  const currentModule = allModules[selectedModuleIdx];

  // --- LOGIQUE PROFESSEUR IA ---

  const startLesson = async (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentSectionIdx(0);
    setIsLessonCompleted(false);
    setProfessorMessages([]);
    
    const initialText = `Salutations Leader. Je suis le Professeur NDSA. Ravi de vous accompagner pour le chapitre : "${lesson.title}". Nous allons procéder par étapes. Voici le premier segment : \n\n ${lesson.sections?.[0] || lesson.content} \n\n Avez-vous des questions sur ce point ou souhaitez-vous passer à la suite ?`;
    
    const initMsg: Message = {
      id: 'init_' + Date.now(),
      role: 'model',
      parts: [{ text: initialText }],
      timestamp: new Date()
    };

    setProfessorMessages([initMsg]);
    voiceService.play(initialText, initMsg.id);
  };

  const handleProfessorInteraction = async (forceNext = false) => {
    const textToSend = forceNext ? "C'est compris, je souhaite passer à la suite." : userInput;
    if (!textToSend.trim() || !activeLesson) return;

    const userMsg: Message = { 
      id: 'user_' + Date.now(), 
      role: 'user', 
      parts: [{ text: textToSend }], 
      timestamp: new Date() 
    };
    
    setProfessorMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsProfessorLoading(true);
    voiceService.stop();

    const professorPersona = {
      name: SYSTEM_CONFIG.ai.professor.name,
      role: SYSTEM_CONFIG.ai.professor.role,
      philosophy: SYSTEM_CONFIG.ai.professor.philosophy,
      tonality: "Érudit, encourageant, exigeant sur la précision et très structuré.",
      coreValues: "Excellence, Rigueur scientifique, Leadership."
    };

    const isLastSection = currentSectionIdx === (activeLesson.sections?.length || 1) - 1;
    const nextSectionText = activeLesson.sections?.[currentSectionIdx + 1];

    const promptContext = `
      COURS ACTUEL : ${activeLesson.title}
      CONTENU ÉTUDIÉ : ${activeLesson.sections?.[currentSectionIdx]}
      EST-CE LA FIN ? ${isLastSection ? 'OUI' : 'NON'}
      ${nextSectionText ? `PROCHAINE SECTION SI VALIDÉE : ${nextSectionText}` : ''}

      INSTRUCTION : 
      1. Analyse si l'étudiant a compris ou s'il demande de progresser.
      2. Si oui, valide son acquis et délivre le segment suivant : "${nextSectionText || 'FÉLICITATIONS, VOUS AVEZ TERMINÉ LE CHAPITRE.'}"
      3. S'il a une question, réponds avec expertise avant de proposer la suite.
      4. Si c'est terminé, invite-le à télécharger son certificat.
    `;

    try {
      const stream = await generateJoseResponseStream(
        `[SYSTEM_TUTOR_MODE: ${promptContext}] Étudiant: ${textToSend}`, 
        professorMessages, 
        null, 
        'fr', 
        professorPersona
      );

      let aiMsgId = 'ai_' + Date.now();
      setProfessorMessages(prev => [...prev, { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date() }]);

      let fullText = "";
      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setProfessorMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }

      voiceService.play(fullText, aiMsgId);
      
      // Progression de l'index si l'IA a validé ou si on force
      if (forceNext || fullText.toLowerCase().includes('section suivante') || fullText.toLowerCase().includes('voici la suite')) {
        if (!isLastSection) {
          setCurrentSectionIdx(prev => prev + 1);
        } else {
          setIsLessonCompleted(true);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProfessorLoading(false);
    }
  };

  const generateCertificate = () => {
    if (!activeLesson) return;
    const doc = new jsPDF({ orientation: 'landscape' });
    const session = localStorage.getItem('ndsa_session');
    const userName = session ? JSON.parse(session).name : "Leader NDSA";

    // Design Master Elite
    doc.setFillColor(1, 4, 9); // Deep Dark
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setDrawColor(0, 212, 255, 0.1);
    for(let i=0; i<300; i+=20) {
      doc.line(i, 0, i, 210);
      doc.line(0, i, 297, i);
    }

    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 277, 190);

    doc.setTextColor(255, 215, 0);
    doc.setFontSize(45);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICAT D'EXCELLENCE", 148, 60, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("La Neo Digital Startup Academy atteste que", 148, 85, { align: "center" });

    doc.setFontSize(38);
    doc.setTextColor(0, 212, 255);
    doc.text(userName.toUpperCase(), 148, 115, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("A complété avec succès le chapitre spécialisé :", 148, 140, { align: "center" });
    
    doc.setFontSize(24);
    doc.setFont("helvetica", "italic");
    doc.text(`"${activeLesson.title.toUpperCase()}"`, 148, 155, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Délivré le ${new Date().toLocaleDateString()} par le Pr. NDSA Digital Engine`, 148, 185, { align: "center" });

    doc.setTextColor(255, 215, 0);
    doc.setFontSize(14);
    doc.text(SYSTEM_CONFIG.founder.name, 230, 185, { align: "center" });
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("Signature du Maître Fondateur", 230, 192, { align: "center" });

    doc.save(`NDSA_CERTIFICATE_${activeLesson.id}.pdf`);
  };

  if (activeLesson) {
    return (
      <div className="flex flex-col h-[85vh] animate-in slide-in-from-right duration-700 max-w-4xl mx-auto pb-6">
        <div className="flex items-center justify-between mb-4 px-4">
           <button onClick={() => { setActiveLesson(null); voiceService.stop(); }} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all uppercase text-[8px] font-black tracking-widest"><ChevronLeft size={12} /> Curriculum</button>
           
           <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                 <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">Status</p>
                 <p className="text-[10px] font-black text-[#00d4ff] italic">{Math.round(((currentSectionIdx + (isLessonCompleted ? 1 : 0)) / (activeLesson.sections?.length || 1)) * 100)}%</p>
              </div>
              <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden relative">
                 <div className="h-full bg-gradient-to-r from-[#00d4ff] to-blue-600 shadow-[0_0_8px_#00d4ff] transition-all duration-1000" style={{ width: `${((currentSectionIdx + (isLessonCompleted ? 1 : 0)) / (activeLesson.sections?.length || 1)) * 100}%` }}></div>
              </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col glass-card rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
           <div className="p-4 border-b border-white/5 bg-gradient-to-r from-blue-900/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                    <Bot size={20} />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-white italic uppercase tracking-tighter leading-none">{SYSTEM_CONFIG.ai.professor.name}</h3>
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{SYSTEM_CONFIG.ai.professor.role}</p>
                 </div>
              </div>
              {isLessonCompleted && (
                <button onClick={generateCertificate} className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-slate-950 rounded-lg font-black text-[8px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all animate-bounce">
                  <Award size={14} /> CERTIFICAT
                </button>
              )}
           </div>

           <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {professorMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                   <div className={`flex gap-4 w-full ${msg.role === 'user' ? 'max-w-[70%] flex-row-reverse text-right' : 'max-w-[80%]'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${msg.role === 'user' ? 'bg-slate-900 border-white/5 text-slate-500' : 'bg-blue-600/10 border-blue-600/20 text-blue-400'}`}>
                         {msg.role === 'user' ? <User size={14} /> : <Bot size={16} />}
                      </div>
                      <div className={`p-4 rounded-[1.2rem] text-[13px] font-medium leading-relaxed italic ${msg.role === 'user' ? 'bg-white/5 text-[#00d4ff] rounded-tr-none' : 'bg-slate-900/40 text-slate-200 border border-white/5 rounded-tl-none'}`}>
                         {msg.parts[0].text}
                         {msg.role === 'model' && msg.id.includes('ai_') && (
                           <button onClick={() => voiceService.play(msg.parts[0].text, msg.id)} className="mt-3 flex items-center gap-1.5 text-[7px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">
                             <Play size={8} fill="currentColor" /> RÉÉCOUTER
                           </button>
                         )}
                      </div>
                   </div>
                </div>
              ))}
              {isProfessorLoading && (
                <div className="flex justify-start">
                   <div className="flex gap-1 p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
              )}
           </div>

           <div className="p-4 bg-black/40 border-t border-white/5">
              <div className="max-w-2xl mx-auto flex items-center gap-3">
                 <input 
                   type="text" 
                   value={userInput}
                   onChange={(e) => setUserInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleProfessorInteraction()}
                   placeholder="Dites 'Suivant'..."
                   className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-blue-500/50 transition-all font-medium italic text-xs placeholder:text-slate-700"
                 />
                 <button 
                   onClick={() => handleProfessorInteraction()}
                   disabled={isProfessorLoading}
                   className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                 >
                    <Send size={18} />
                 </button>
              </div>
              <div className="flex justify-center gap-3 mt-3">
                 <button onClick={() => handleProfessorInteraction(true)} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-md text-[7px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00d4ff] transition-all">Séquence Suivante</button>
                 <button onClick={() => handleProfessorInteraction(false)} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-md text-[7px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00d4ff] transition-all">Précisions</button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-1000 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Learning <span className="text-[#00d4ff]">Empire</span></h2>
           <p className="text-slate-500 text-sm font-medium italic leading-none mt-1">Syllabus Bio-Sync V4 - Pr. NDSA.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'curriculum', label: 'Parcours Expert', icon: GraduationCap },
          { id: 'resources', label: 'Ressources', icon: Book },
          { id: 'mentor', label: 'Mentorat', icon: BrainCircuit },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeView === tab.id ? 'bg-[#00d4ff] text-slate-950 shadow-xl' : 'bg-white/5 text-slate-500 hover:text-white'}`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {activeView === 'curriculum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-700">
          <div className="lg:col-span-4 space-y-2">
            {allModules.map((mod, idx) => (
              <button 
                key={mod.id} 
                onClick={() => setSelectedModuleIdx(idx)} 
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${selectedModuleIdx === idx ? 'bg-white text-slate-950 border-white shadow-lg' : 'bg-white/5 border-white/10 text-white hover:border-white/20'}`}
              >
                <div>
                   <h3 className="font-black text-[9px] uppercase tracking-tighter leading-tight mb-0.5">{mod.title}</h3>
                   <p className={`text-[7px] font-bold uppercase tracking-widest ${selectedModuleIdx === idx ? 'text-slate-500' : 'text-slate-600'}`}>SÉQUENCE 0{idx + 1}</p>
                </div>
                <ChevronRight size={14} className={selectedModuleIdx === idx ? 'text-slate-950' : 'text-slate-600'} />
              </button>
            ))}
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-4 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><BookMarked size={60} /></div>
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1 relative z-10">{currentModule.title}</h3>
               <p className="text-slate-500 text-[13px] italic leading-relaxed relative z-10">{currentModule.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {currentModule.lessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  onClick={() => startLesson(lesson)} 
                  className="flex items-center justify-between p-6 bg-slate-900/40 border border-white/5 rounded-2xl hover:bg-white hover:border-white group cursor-pointer transition-all shadow-md"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-slate-950/10 transition-all">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <span className="text-base font-bold text-slate-300 group-hover:text-slate-950 italic">{lesson.title}</span>
                      <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-0.5 group-hover:text-slate-500">{lesson.sections?.length || 0} segments validés</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-[7px] font-black text-emerald-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all border border-emerald-500/20">Explorer</div>
                    <Play size={16} className="group-hover:text-slate-950" fill="currentColor" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
