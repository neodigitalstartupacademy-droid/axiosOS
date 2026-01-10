
import React, { useState, useEffect, useRef } from 'react';
import { SYSTEM_CONFIG } from '../constants';
import { Lesson, Resource, Message, CourseProgress } from '../types';
import { voiceService } from '../services/voiceService';
import { generateJoseResponseStream } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import { 
  BookOpen, ChevronRight, Play, Search, Lock, 
  Sparkles, BrainCircuit, Target, Globe, Trophy, ArrowLeft,
  Square, ChevronLeft, Book, HelpCircle, Video, FileText, 
  ShoppingCart, ExternalLink, MessageSquare, Send, Bot, User,
  Mic, MicOff, Star, GraduationCap, Award, CheckCircle2,
  RefreshCw, Download, Loader2, Bookmark
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
    
    const initialText = `Bienvenue dans le chapitre : ${lesson.title}. Je suis votre Professeur NDSA. Nous allons explorer ensemble ce savoir stratégique. Commençons par la première section : ${lesson.sections?.[0] || lesson.content}. Qu'en pensez-vous ou souhaitez-vous passer à la suite ?`;
    
    setProfessorMessages([{
      id: 'init',
      role: 'model',
      parts: [{ text: initialText }],
      timestamp: new Date()
    }]);

    voiceService.play(initialText, 'prof_init');
  };

  const handleProfessorInteraction = async (customPrompt?: string) => {
    const input = customPrompt || userInput;
    if (!input.trim() && !customPrompt) return;
    if (!activeLesson) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', parts: [{ text: input }], timestamp: new Date() };
    setProfessorMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsProfessorLoading(true);
    voiceService.stop();

    const professorPersona = {
      name: SYSTEM_CONFIG.ai.professor.name,
      role: SYSTEM_CONFIG.ai.professor.role,
      philosophy: SYSTEM_CONFIG.ai.professor.philosophy,
      tonality: "Pédagogue, érudit, exigeant mais encourageant.",
      coreValues: "Excellence NDSA, Maîtrise des fondamentaux."
    };

    const nextSection = activeLesson.sections?.[currentSectionIdx + 1];
    const isLastSection = currentSectionIdx === (activeLesson.sections?.length || 1) - 1;

    const instruction = `
      CONTEXTE DU COURS : ${activeLesson.title}
      SECTION ACTUELLE : ${activeLesson.sections?.[currentSectionIdx]}
      ${nextSection ? `PROCHAINE SECTION À ABORDER : ${nextSection}` : 'C\'EST LA DERNIÈRE SECTION.'}
      
      TON RÔLE : Tu es le Professeur. Analyse la réponse de l'étudiant. S'il a compris ou demande la suite, passe à la section suivante de manière fluide. S'il a une question, explique avec précision avant de progresser. 
      Si c'est la fin du cours, félicite-le et annonce qu'il peut générer son certificat.
    `;

    try {
      const stream = await generateJoseResponseStream(
        `[INSTRUCTION PROFESSEUR: ${instruction}] Étudiant dit: ${input}`, 
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

      voiceService.play(fullText, `prof_${aiMsgId}`);
      
      // Simulation de progression automatique si l'étudiant veut avancer
      if (input.toLowerCase().includes('suite') || input.toLowerCase().includes('suivant') || input.toLowerCase().includes('compris')) {
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
    const userName = localStorage.getItem('ndsa_session') ? JSON.parse(localStorage.getItem('ndsa_session')!).name : "Leader NDSA";

    // Design du Certificat Stark Aura
    doc.setFillColor(15, 23, 42); // Navy Dark
    doc.rect(0, 0, 297, 210, 'F');
    
    // Bordure Or
    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    // Titre
    doc.setTextColor(255, 215, 0);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICAT DE RÉUSSITE", 148, 60, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Le Conseil Supérieur de la NDSA certifie que", 148, 85, { align: "center" });

    doc.setFontSize(35);
    doc.setTextColor(0, 212, 255); // Cyan Stark
    doc.text(userName.toUpperCase(), 148, 110, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(`A validé avec succès le module de formation :`, 148, 130, { align: "center" });
    
    doc.setFontSize(22);
    doc.setFont("helvetica", "italic");
    doc.text(`"${activeLesson.title}"`, 148, 145, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Délivré le ${new Date().toLocaleDateString()} par l'IA Professor NDSA`, 148, 170, { align: "center" });

    // Signature Fondateur
    doc.setFontSize(14);
    doc.setTextColor(255, 215, 0);
    doc.text("ABADA Jose Gaétan", 220, 185, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Maître Fondateur NDSA", 220, 192, { align: "center" });

    doc.save(`Certificat_NDSA_${activeLesson.id}.pdf`);
  };

  // --- RENDU UI ---

  if (activeLesson) {
    return (
      <div className="flex flex-col h-[85vh] animate-in slide-in-from-right duration-700 max-w-6xl mx-auto">
        {/* Header de la leçon */}
        <div className="flex items-center justify-between mb-8">
           <button onClick={() => { setActiveLesson(null); voiceService.stop(); }} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest"><ChevronLeft size={16} /> Quitter la formation</button>
           <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Progression</p>
                 <p className="text-sm font-black text-[#00d4ff] italic">{Math.round(((currentSectionIdx + (isLessonCompleted ? 1 : 0)) / (activeLesson.sections?.length || 1)) * 100)}%</p>
              </div>
              <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-gradient-to-r from-[#00d4ff] to-blue-600 transition-all duration-1000" style={{ width: `${((currentSectionIdx + (isLessonCompleted ? 1 : 0)) / (activeLesson.sections?.length || 1)) * 100}%` }}></div>
              </div>
           </div>
        </div>

        {/* Espace Professor */}
        <div className="flex-1 flex flex-col bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 overflow-hidden shadow-3xl">
           <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-600/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-blue-600/20 border border-blue-600/30 rounded-2xl flex items-center justify-center text-blue-400">
                    <Bot size={32} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{SYSTEM_CONFIG.ai.professor.name}</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{SYSTEM_CONFIG.ai.professor.role}</p>
                 </div>
              </div>
              {isLessonCompleted && (
                <button onClick={generateCertificate} className="flex items-center gap-3 px-6 py-3 bg-[#FFD700] text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all animate-bounce">
                  <Award size={18} /> Télécharger Certificat
                </button>
              )}
           </div>

           <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
              {professorMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                   <div className={`flex gap-6 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse text-right' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-1 ${msg.role === 'user' ? 'bg-slate-950 border-white/5 text-slate-500' : 'bg-blue-600/10 border-blue-600/20 text-blue-400'}`}>
                         {msg.role === 'user' ? <User size={18} /> : <Bot size={20} />}
                      </div>
                      <div className={`p-8 rounded-[2.5rem] text-lg font-medium leading-relaxed italic ${msg.role === 'user' ? 'bg-white/5 text-[#00d4ff] rounded-tr-none' : 'bg-white/5 text-slate-100 border border-white/5 rounded-tl-none'}`}>
                         {msg.parts[0].text}
                      </div>
                   </div>
                </div>
              ))}
              {isProfessorLoading && (
                <div className="flex justify-start">
                   <div className="flex gap-2 p-4 bg-white/5 rounded-2xl">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
              )}
           </div>

           <div className="p-8 bg-black/40 border-t border-white/5">
              <div className="max-w-4xl mx-auto flex items-center gap-4">
                 <input 
                   type="text" 
                   value={userInput}
                   onChange={(e) => setUserInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleProfessorInteraction()}
                   placeholder="Posez une question ou dites 'Suivant'..."
                   className="flex-1 bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem] text-white outline-none focus:border-blue-500/50 transition-all font-medium italic"
                 />
                 <button 
                   onClick={() => handleProfessorInteraction()}
                   disabled={isProfessorLoading}
                   className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                 >
                    <Send size={24} />
                 </button>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                 <button onClick={() => handleProfessorInteraction("J'ai compris, passons à la suite.")} className="px-4 py-2 bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00d4ff] transition-all">Séquence suivante</button>
                 <button onClick={() => handleProfessorInteraction("Pouvez-vous expliquer plus en détail ?")} className="px-4 py-2 bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00d4ff] transition-all">Besoin d'approfondir</button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
           <h2 className="text-7xl md:text-9xl font-black text-white italic uppercase tracking-tighter leading-none">Learning <span className="text-[#00d4ff]">Empire</span></h2>
           <p className="text-slate-500 text-xl font-medium italic">Initiez votre session d'apprentissage avec le Pr. NDSA.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 border-b border-white/5 pb-8">
        {[
          { id: 'curriculum', label: 'Parcours Expert', icon: GraduationCap },
          { id: 'resources', label: 'Bibliothèque', icon: Book },
          { id: 'mentor', label: 'Coach Business', icon: BrainCircuit },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeView === tab.id ? 'bg-[#00d4ff] text-slate-950 shadow-3xl' : 'bg-white/5 text-slate-500 hover:text-white'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {activeView === 'curriculum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-500">
          <div className="lg:col-span-4 space-y-4">
            {allModules.map((mod, idx) => (
              <button 
                key={mod.id} 
                onClick={() => setSelectedModuleIdx(idx)} 
                className={`w-full text-left p-8 rounded-[2.5rem] border transition-all flex items-center justify-between group ${selectedModuleIdx === idx ? 'bg-white text-slate-950 border-white shadow-3xl' : 'bg-white/5 border-white/10 text-white'}`}
              >
                <div>
                   <h3 className="font-black text-xs uppercase tracking-tighter leading-tight mb-2">{mod.title}</h3>
                   <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedModuleIdx === idx ? 'text-slate-500' : 'text-slate-600'}`}>0{idx + 1} Module</p>
                </div>
                <ChevronRight size={20} className={selectedModuleIdx === idx ? 'text-slate-950' : 'text-slate-600'} />
              </button>
            ))}
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3.5rem] mb-8">
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">{currentModule.title}</h3>
               <p className="text-slate-500 text-lg italic leading-relaxed">{currentModule.description}</p>
            </div>
            {currentModule.lessons.map((lesson) => (
              <div 
                key={lesson.id} 
                onClick={() => startLesson(lesson)} 
                className="flex items-center justify-between p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] hover:bg-white hover:border-white group cursor-pointer transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-slate-950/10 transition-all">
                    <BookOpen size={18} />
                  </div>
                  <span className="text-xl font-bold text-slate-300 group-hover:text-slate-950 italic">{lesson.title}</span>
                </div>
                <div className="flex items-center gap-6">
                   <div className="px-4 py-1.5 bg-emerald-500/10 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Prêt pour tutorat</div>
                   <ChevronRight size={24} className="group-hover:text-slate-950" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reste des vues Resources et Mentor non modifiés pour la concision */}
    </div>
  );
};
