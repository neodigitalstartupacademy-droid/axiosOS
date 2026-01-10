
import React, { useState, useEffect, useRef } from 'react';
import { SYSTEM_CONFIG } from '../constants';
import { Lesson, Resource, Message } from '../types';
import { voiceService } from '../services/voiceService';
import { generateJoseAudio, decodeBase64, decodeAudioData, generateJoseResponseStream } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import { 
  BookOpen, ChevronRight, Play, Trophy, ArrowLeft,
  Square, ChevronLeft, Book, Video, Send, Bot, User,
  GraduationCap, Award, Download, Loader2, Star, CheckCircle2,
  BrainCircuit, Sparkles, BookMarked, ShieldCheck, Flame, Globe, MapPin, Edit3,
  Clock, History
} from 'lucide-react';

interface LessonProgress {
  currentSectionIdx: number;
  isCompleted: boolean;
  messages: Message[];
}

interface SavedProgress {
  lessons: Record<string, LessonProgress>;
  lastActiveLessonId: string | null;
}

export const AcademyView: React.FC = () => {
  const [activeView, setActiveView] = useState<'curriculum' | 'resources' | 'mentor'>('curriculum');
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [professorMessages, setProfessorMessages] = useState<Message[]>([]);
  const [isProfessorLoading, setIsProfessorLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);

  // Persistence State
  const [lessonsProgress, setLessonsProgress] = useState<Record<string, LessonProgress>>({});
  const [lastActiveLessonId, setLastActiveLessonId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Retrieve User ID for scoped storage
  const session = localStorage.getItem('ndsa_session');
  const userId = session ? JSON.parse(session).id : 'guest';
  const STORAGE_KEY = `ndsa_academy_progress_v2_${userId}`;

  // 1. Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: SavedProgress = JSON.parse(saved);
        setLessonsProgress(parsed.lessons || {});
        setLastActiveLessonId(parsed.lastActiveLessonId || null);
      } catch (e) {
        console.error("Erreur de chargement des progrès académiques", e);
      }
    }

    const unsubVoice = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });
    return () => unsubVoice();
  }, [userId]);

  // 2. Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [professorMessages]);

  const allModules = SYSTEM_CONFIG.academy.modules;
  const currentModule = allModules[selectedModuleIdx];

  const saveProgressToStorage = (updates: { lessons?: Record<string, Partial<LessonProgress>>; lastActiveLessonId?: string | null }) => {
    const currentSaved = localStorage.getItem(STORAGE_KEY);
    let existing: SavedProgress = { lessons: {}, lastActiveLessonId: null };
    if (currentSaved) {
      try {
        existing = JSON.parse(currentSaved);
      } catch (e) {}
    }

    // Merge lessons
    const newLessons = { ...existing.lessons };
    if (updates.lessons) {
      Object.entries(updates.lessons).forEach(([id, progress]) => {
        newLessons[id] = {
          ...existing.lessons[id],
          ...progress,
          messages: progress.messages !== undefined ? progress.messages : (existing.lessons[id]?.messages || [])
        } as LessonProgress;
      });
    }

    const merged: SavedProgress = {
      lessons: newLessons,
      lastActiveLessonId: updates.lastActiveLessonId !== undefined ? updates.lastActiveLessonId : existing.lastActiveLessonId
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setLessonsProgress(merged.lessons);
    setLastActiveLessonId(merged.lastActiveLessonId);
  };

  const startLesson = async (lesson: Lesson, resume = false) => {
    voiceService.stop();
    const saved = lessonsProgress[lesson.id];
    
    if (resume && saved && saved.messages.length > 0) {
      setActiveLesson(lesson);
      setCurrentSectionIdx(saved.currentSectionIdx);
      setProfessorMessages(saved.messages);
      setIsLessonCompleted(saved.isCompleted);
      setShowManifesto(false);
      
      saveProgressToStorage({ lastActiveLessonId: lesson.id });
    } else {
      const startIdx = 0;
      const completed = saved?.isCompleted || false;

      setActiveLesson(lesson);
      setCurrentSectionIdx(startIdx);
      setIsLessonCompleted(completed);
      setShowManifesto(false);
      
      const initialText = `Salutations Leader. Je suis le Professeur NDSA. Prêt pour le chapitre : "${lesson.title}" ? Voici le premier segment d'étude : \n\n ${lesson.sections?.[0] || lesson.content} \n\n Une question ou passons-nous à la suite ?`;
      
      const initMsg: Message = {
        id: 'init_' + Date.now(),
        role: 'model',
        parts: [{ text: initialText }],
        timestamp: new Date()
      };

      const initialMessages = [initMsg];
      setProfessorMessages(initialMessages);
      
      // Initial save
      saveProgressToStorage({ 
        lastActiveLessonId: lesson.id,
        lessons: { 
          [lesson.id]: { 
            currentSectionIdx: startIdx, 
            isCompleted: completed,
            messages: initialMessages
          } 
        }
      });

      voiceService.play(initialText, initMsg.id);
    }
  };

  const handleProfessorInteraction = async (forceNext = false) => {
    const textToSend = forceNext ? "Passons à la suite." : userInput;
    if (!textToSend.trim() || !activeLesson) return;

    const userMsg: Message = { id: 'user_' + Date.now(), role: 'user', parts: [{ text: textToSend }], timestamp: new Date() };
    const updatedMessagesWithUser = [...professorMessages, userMsg];
    setProfessorMessages(updatedMessagesWithUser);
    setUserInput('');
    setIsProfessorLoading(true);
    voiceService.stop();

    const sections = activeLesson.sections || [activeLesson.content];
    const isLastSection = currentSectionIdx === sections.length - 1;
    const nextSectionText = sections[currentSectionIdx + 1];

    try {
      const stream = await generateJoseResponseStream(`[ACADEMY_MODE] Cours: ${activeLesson.title}. Segment Actuel: ${sections[currentSectionIdx]}. Segment Suivant: ${nextSectionText || 'FIN DU COURS'}. Instruction: Si l'étudiant veut avancer, valide son acquis et donne le segment suivant.`, updatedMessagesWithUser, null, 'fr', {
        name: SYSTEM_CONFIG.ai.professor.name,
        role: SYSTEM_CONFIG.ai.professor.role,
        philosophy: SYSTEM_CONFIG.ai.professor.philosophy,
        tonality: "Érudit, direct, mentorat Stark.",
        coreValues: "Excellence NDSA."
      });

      let aiMsgId = 'ai_' + Date.now();
      let fullText = "";
      
      // Temporary AI message
      const tempAiMsg: Message = { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date() };
      setProfessorMessages(prev => [...prev, tempAiMsg]);

      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setProfessorMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }

      const finalMessages = [...updatedMessagesWithUser, { id: aiMsgId, role: 'model', parts: [{ text: fullText }], timestamp: new Date() }];
      voiceService.play(fullText, aiMsgId);
      
      const shouldAdvance = forceNext || 
        fullText.toLowerCase().includes('section suivante') || 
        fullText.toLowerCase().includes('passons à') || 
        fullText.toLowerCase().includes('segment suivant');

      let nextIdx = currentSectionIdx;
      let completed = isLessonCompleted;

      if (shouldAdvance) {
        if (!isLastSection) {
            nextIdx = currentSectionIdx + 1;
            setCurrentSectionIdx(nextIdx);
        } else {
            if (activeLesson.id === 'CH-10') {
              setShowManifesto(true);
            } else {
              completed = true;
              setIsLessonCompleted(true);
            }
        }
      }

      // Final save for this interaction
      saveProgressToStorage({ 
        lessons: { 
          [activeLesson.id]: { 
            currentSectionIdx: nextIdx, 
            isCompleted: completed,
            messages: finalMessages
          } 
        } 
      });

    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsProfessorLoading(false); 
    }
  };

  const generateCertificate = () => {
    if (!activeLesson) return;
    const sessionData = localStorage.getItem('ndsa_session');
    const userName = signatureName || (sessionData ? JSON.parse(sessionData).name : "Leader NDSA");

    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFillColor(1, 4, 9);
    doc.rect(0, 0, 297, 210, 'F');
    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    doc.setTextColor(255, 215, 0);
    doc.setFontSize(50);
    