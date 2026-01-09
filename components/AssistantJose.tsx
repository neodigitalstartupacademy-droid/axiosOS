
import React, { useState, useRef, useEffect } from 'react';
import { 
  generateJoseResponseStream, 
  analyzeClinicalData 
} from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { storageService } from '../services/storageService';
import { Message, Language, AIPersona, ReferralContext, DiagnosticReport, ClinicalData } from '../types'; 
import { SYSTEM_CONFIG, I18N as I18N_CONST } from '../constants';
import { 
  Send, Bot, Loader2, Play, Check, Settings2, Share2, Square, Download, UserCheck, CheckCheck, Copy, Zap, User, Camera, Image as ImageIcon, Sparkles, Activity, FileText, FlaskConical, AlertCircle, ShieldAlert, Mic, BrainCircuit
} from 'lucide-react';

interface AssistantJoseProps {
  language?: Language;
  currentSubscriberId?: string;
}

export const AssistantJose: React.FC<AssistantJoseProps> = ({ language = 'fr', currentSubscriberId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);
  const [referralContext, setReferralContext] = useState<ReferralContext | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const [persona] = useState<AIPersona>({
    name: "JOSÉ IMPERIUM",
    role: "Architecte en Chef de Restauration Biologique",
    philosophy: "Détecter l'anomalie au niveau moléculaire, restaurer via la nutrition cellulaire NeoLife.",
    tonality: "Autorité Stark, Bienveillance Expert, Direct et Futuriste.",
    coreValues: "Vérité des biomarqueurs, Standard Clinique SAB, Fidélisation prospect."
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = I18N_CONST[language as Language];

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });

    const params = new URLSearchParams(window.location.search);
    let refId = params.get('ref') || window.location.hash.split('ref=')[1]?.split('&')[0];
    const storedRef = refId || sessionStorage.getItem('ndsa_active_ref');
    
    if (storedRef && storedRef !== (currentSubscriberId || SYSTEM_CONFIG.founder.id)) {
      setReferralContext({ referrerId: storedRef, referrerName: `Leader ${storedRef}`, language: language as Language });
      sessionStorage.setItem('ndsa_active_ref', storedRef);
    }

    if (messages.length === 0) {
      setMessages([{ 
        id: 'welcome', 
        role: 'model', 
        parts: [{ text: `Salutations Leader. Je suis JOSÉ.\n\nMon scanner cognitif est prêt. Envoyez-moi un document médical ou posez-moi vos questions cliniques.` }], 
        timestamp: new Date(), 
        status: 'read' 
      }]);
    }
    return () => unsubVoice();
  }, [language, currentSubscriberId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const saveToBioLog = async (text: string, imageData?: string, clinicalData?: ClinicalData | null) => {
    if (!text.includes('[BIO-STATUS]') && !text.includes('Rapport') && !clinicalData) return;
    try {
      let compressedImage = imageData ? await storageService.compressImage(imageData) : undefined;
      const newReport: DiagnosticReport = {
        id: 'rep_' + Date.now(),
        date: new Date(),
        title: text.split('\n')[0].substring(0, 50) || "Analyse Biologique Stark",
        type: text.toLowerCase().includes('ordonnance') ? 'PRESCRIPTION' : 'BLOOD_WORK',
        summary: clinicalData?.analysis?.substring(0, 200) || text.substring(0, 200) + "...",
        fullContent: text,
        status: text.toLowerCase().includes('alerte') || (clinicalData?.risk_flags && clinicalData.risk_flags.length > 0) ? 'ALERT' : 'STABLE',
        image: compressedImage ? `data:image/jpeg;base64,${compressedImage}` : undefined,
        clinicalData: clinicalData || undefined
      };
      await storageService.saveReport(newReport);
    } catch (e) {}
  };

  const handleSend = async (medicalMode = false) => {
    if (!input.trim() && !selectedImage || isLoading) return;
    setIsScanning(medicalMode && !!selectedImage);
    const userMsgId = 'msg_' + Date.now();
    const promptPrefix = medicalMode ? "[ACTION: EXTRACTION BIO-CLINIQUE PRIORITAIRE] " : "";
    const userMsg: Message = { id: userMsgId, role: 'user', parts: [{ text: promptPrefix + (input || "[SCAN DOCUMENT]") }], timestamp: new Date(), status: 'sending' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const currentImg = selectedImage;
    setSelectedImage(null);
    try {
      let clinicalData = medicalMode && currentImg ? await analyzeClinicalData(currentImg) : null;
      const stream = await generateJoseResponseStream(userMsg.parts[0].text, messages, referralContext, language as Language, persona, currentSubscriberId, currentImg);
      setIsScanning(false);
      let aiMsgId = 'ai_' + Date.now();
      let fullText = "";
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date(), status: 'sending' }]);
      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }
      if (medicalMode || fullText.includes('[BIO-STATUS]')) await saveToBioLog(fullText, currentImg?.data, clinicalData);
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, status: 'read' } : m));
    } catch (error) {
      setIsScanning(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = (text: string, id: string) => {
    voiceService.play(text, `msg_${id}`, language as Language);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] glass-card rounded-[4rem] border border-white/10 overflow-hidden shadow-3xl relative animate-in fade-in duration-500">
      {isScanning && (
        <div className="absolute inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-500">
           <Activity size={100} className="text-[#00d4ff] animate-pulse" />
        </div>
      )}
      <div className="bg-slate-900/40 p-10 flex items-center justify-between border-b border-white/5 z-50">
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 bg-[#00d4ff]/10 rounded-2xl flex items-center justify-center border border-[#00d4ff]/20 relative">
            <Bot size={36} className={`text-[#00d4ff] ${isLoading ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h2 className="font-stark font-black text-2xl text-white tracking-tight italic uppercase leading-none">{persona.name}</h2>
            <p className="font-stark text-[10px] text-[#00d4ff] font-black uppercase tracking-[0.4em] mt-1 opacity-80">STARK COGNITIVE CORE</p>
          </div>
        </div>
        {isLoading && <div className="flex items-center gap-3 px-6 py-3 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-full animate-pulse"><BrainCircuit size={16} className="text-[#00d4ff]" /><span className="font-stark text-[10px] font-black text-[#00d4ff] uppercase tracking-widest">Thinking...</span></div>}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
            <div className="flex flex-col max-w-[85%]">
              <div className={`p-8 rounded-[2.5rem] border backdrop-blur-3xl shadow-3xl leading-relaxed ${msg.role === 'user' ? 'bg-[#00d4ff]/10 border-[#00d4ff]/30 text-white rounded-tr-none' : 'bg-slate-900/60 border-white/10 text-slate-200 rounded-tl-none'}`}>
                 <div className="text-[16px] font-medium whitespace-pre-line italic">{msg.parts[0].text}</div>
                 {msg.role === 'model' && (
                    <button onClick={() => handleSpeech(msg.parts[0].text, msg.id)} className={`mt-8 flex items-center gap-3 font-stark text-[11px] font-black uppercase tracking-widest transition-all ${activeSpeechKey === `msg_${msg.id}` ? 'text-[#00d4ff] animate-pulse' : 'text-slate-500 hover:text-white'}`}>
                      {activeSpeechKey === `msg_${msg.id}` ? <Square size={16} /> : <Play size={16} />} {activeSpeechKey === `msg_${msg.id}` ? 'Interrompre' : 'Audio José'}
                    </button>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-slate-900/60 border-t border-white/10 flex gap-6">
        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={e => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setSelectedImage({ data: (r.result as string).split(',')[1], mimeType: f.type }); r.readAsDataURL(f); } }} />
        <button onClick={() => fileInputRef.current?.click()} className="w-16 h-16 rounded-2xl bg-white/5 text-slate-500 hover:text-[#00d4ff] transition-all"><ImageIcon size={32} /></button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Posez votre question clinique..." className="flex-1 bg-transparent border-none px-6 py-4 text-white outline-none font-medium text-xl italic" />
        <button onClick={() => handleSend()} className="w-16 h-16 rounded-2xl bg-[#00d4ff] text-slate-950 flex items-center justify-center shadow-[0_0_30px_#00d4ff44] active:scale-90 transition-all"><Send size={32} /></button>
      </div>
    </div>
  );
};
