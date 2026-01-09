
import React, { useState, useRef, useEffect } from 'react';
import { generateJoseResponseStream, analyzeClinicalData } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { storageService } from '../services/storageService';
import { Message, Language, AIPersona, ReferralContext, DiagnosticReport } from '../types'; 
import { SYSTEM_CONFIG, I18N as I18N_CONST } from '../constants';
import { 
  Send, Bot, Loader2, Play, Square, User, Image as ImageIcon, Activity, FlaskConical, ShieldAlert, BrainCircuit, Microscope
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
  
  const persona: AIPersona = {
    name: "JOSÉ IMPERIUM 2026",
    role: "Architecte en Chef de Restauration Biologique",
    philosophy: "Analyse moléculaire NeoLife. Restauration de l'autorité cellulaire.",
    tonality: "Souverain Stark, Expert Clinique, Bienveillance Protectrice.",
    coreValues: "Standard SAB, Précision Biomédicale, Succès NeoLife."
  };

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
        parts: [{ text: `Protocole Imperium 2026 activé. Salutations Commandant.\n\nPrêt pour le bio-scan. Soumettez un document ou posez vos questions cliniques. Je décode votre architecture biologique.` }], 
        timestamp: new Date(), 
        status: 'read' 
      }]);
    }
    return () => unsubVoice();
  }, [language, currentSubscriberId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async (medicalMode = false) => {
    if (!input.trim() && !selectedImage || isLoading) return;
    setIsScanning(medicalMode && !!selectedImage);
    const userMsgId = 'ai_input_' + Date.now();
    const promptPrefix = medicalMode ? "[ACTION: EXTRACTION BIO-CLINIQUE PRIORITAIRE] " : "";
    
    const userMsg: Message = { id: userMsgId, role: 'user', parts: [{ text: promptPrefix + (input || "[SCAN DOCUMENT]") }], timestamp: new Date(), status: 'sending' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const currentImg = selectedImage;
    setSelectedImage(null);
    
    try {
      let clinicalData = null;
      if (medicalMode && currentImg) {
        clinicalData = await analyzeClinicalData(currentImg);
      }

      const stream = await generateJoseResponseStream(userMsg.parts[0].text, messages, referralContext, language as Language, persona, currentSubscriberId, currentImg);
      setIsScanning(false);
      let aiMsgId = 'ai_response_' + Date.now();
      let fullText = "";
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date(), status: 'sending' }]);

      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }

      if (medicalMode || fullText.includes('[BIO-STATUS]')) {
        let compressedImage = currentImg ? await storageService.compressImage(currentImg.data) : undefined;
        const newReport: DiagnosticReport = {
          id: 'rep_' + Date.now(),
          date: new Date(),
          title: fullText.split('\n')[0].substring(0, 50) || "Bio-Scan Stark Imperium",
          type: fullText.toLowerCase().includes('ordonnance') ? 'PRESCRIPTION' : 'BLOOD_WORK',
          summary: clinicalData?.analysis?.substring(0, 200) || fullText.substring(0, 200) + "...",
          fullContent: fullText,
          status: fullText.toLowerCase().includes('alerte') ? 'ALERT' : 'STABLE',
          image: compressedImage ? `data:image/jpeg;base64,${compressedImage}` : undefined,
          clinicalData: clinicalData || undefined
        };
        await storageService.saveReport(newReport);
      }

      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, status: 'read' } : m));
    } catch (error) {
      console.error(error);
      setIsScanning(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] glass-card rounded-[5rem] border border-white/10 overflow-hidden shadow-3xl relative animate-in fade-in duration-1000">
      
      {isScanning && (
        <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center">
           <div className="text-center space-y-12">
              <div className="relative inline-block">
                <Microscope size={120} className="text-[#00d4ff] mx-auto animate-pulse" />
                <div className="absolute inset-0 border-y-2 border-[#00d4ff] shadow-[0_0_40px_#00d4ff] animate-[scan_1.5s_ease-in-out_infinite]"></div>
              </div>
              <p className="font-stark text-[#00d4ff] font-black uppercase tracking-[0.8em] text-sm animate-pulse">Bio-Molecular Extraction v6.0...</p>
           </div>
        </div>
      )}

      <div className="bg-black/40 p-14 flex items-center justify-between border-b border-white/5 z-50 backdrop-blur-2xl">
        <div className="flex items-center gap-10">
          <div className="w-20 h-20 bg-[#00d4ff]/10 rounded-[2rem] flex items-center justify-center border border-[#00d4ff]/40 relative shadow-inner overflow-hidden group">
            <Bot size={44} className={`text-[#00d4ff] transition-transform duration-1000 ${isLoading ? 'scale-110 rotate-12' : ''}`} />
            {isLoading && <div className="absolute inset-0 border-2 border-[#00d4ff] animate-ping opacity-20"></div>}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00d4ff]/20 to-transparent"></div>
          </div>
          <div>
            <h2 className="font-stark font-black text-3xl text-white tracking-tighter italic uppercase leading-none">{persona.name}</h2>
            <p className="font-stark text-[11px] text-[#00d4ff] font-black uppercase tracking-[0.5em] mt-3 opacity-80">Cognitive Terminal Elite</p>
          </div>
        </div>
        <div className="flex items-center gap-10">
          {isLoading && (
             <div className="flex items-center gap-5 px-10 py-5 bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-full animate-pulse shadow-3xl">
                <BrainCircuit size={20} className="text-[#00d4ff] animate-spin" style={{ animationDuration: '3s' }} />
                <span className="font-stark text-[11px] font-black text-[#00d4ff] uppercase tracking-widest italic">Neural Link Computing...</span>
             </div>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-16 space-y-16 no-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-8 duration-500`}>
            <div className={`flex gap-8 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xl transition-transform hover:scale-110 ${msg.role === 'user' ? 'bg-slate-900 border-white/10' : 'bg-[#00d4ff]/20 border-[#00d4ff]/50'}`}>
                 {msg.role === 'user' ? <User size={28} className="text-white" /> : <Bot size={28} className="text-[#00d4ff]" />}
              </div>
              <div className="flex flex-col space-y-3">
                <div className={`p-10 rounded-[3.5rem] border backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] leading-relaxed ${msg.role === 'user' ? 'bg-[#00d4ff]/10 border-[#00d4ff]/40 text-white rounded-tr-none' : 'bg-black/40 border-white/10 text-slate-200 rounded-tl-none'}`}>
                   {msg.parts[0].text.includes('[BIO-STATUS]') && (
                     <div className="mb-10 p-10 bg-rose-500/10 border border-rose-500/30 rounded-[3rem] flex items-start gap-8">
                        <ShieldAlert size={36} className="text-rose-500 shrink-0" />
                        <p className="text-[13px] font-bold text-rose-500 uppercase leading-relaxed tracking-widest italic">
                           Alerte Bio-Scan : {SYSTEM_CONFIG.legal.medical_disclaimer}
                        </p>
                     </div>
                   )}
                   <div className="text-[19px] font-medium whitespace-pre-line italic opacity-95">
                      {msg.parts[0].text}
                   </div>
                   {msg.role === 'model' && (
                    <div className="flex items-center gap-10 mt-10 pt-10 border-t border-white/5">
                      <button onClick={() => voiceService.play(msg.parts[0].text, `msg_${msg.id}`, language as Language)} className={`flex items-center gap-5 font-stark text-[12px] font-black uppercase tracking-[0.4em] transition-all group ${activeSpeechKey === `msg_${msg.id}` ? 'text-[#00d4ff] animate-pulse' : 'text-slate-500 hover:text-white'}`}>
                        {activeSpeechKey === `msg_${msg.id}` ? <Square size={20} className="text-rose-500" /> : <Play size={20} className="group-hover:scale-110 transition-transform" />} 
                        {activeSpeechKey === `msg_${msg.id}` ? 'Terminate Sync' : 'Neural Voice Output'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-14 bg-black/60 border-t border-white/5 space-y-10 backdrop-blur-3xl">
        {selectedImage && (
          <div className="flex items-center gap-10 bg-[#00d4ff]/10 p-10 rounded-[3.5rem] w-fit border border-[#00d4ff]/40 shadow-3xl animate-in zoom-in duration-300">
            <div className="relative group">
              <img src={`data:image/jpeg;base64,${selectedImage.data}`} className="h-32 w-32 rounded-[2rem] object-cover border-4 border-[#00d4ff] shadow-2xl group-hover:scale-105 transition-transform" alt="Bio-Detect" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-[2rem]"></div>
            </div>
            <div className="space-y-5">
               <h4 className="font-stark text-sm font-black text-white uppercase tracking-widest">Bio-Signature Détectée</h4>
               <div className="flex gap-6">
                 <button onClick={() => handleSend(true)} className="px-12 py-6 stark-btn-glow rounded-2xl flex items-center gap-5 text-xs italic"><FlaskConical size={24} /> Déclencher Bio-Extraction</button>
                 <button onClick={() => setSelectedImage(null)} className="px-10 py-6 bg-white/5 border border-white/10 text-rose-500 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-rose-500/10">Annuler</button>
               </div>
            </div>
          </div>
        )}
        <div className="flex gap-8 max-w-6xl mx-auto bg-black border border-white/10 px-8 py-8 rounded-[4rem] focus-within:border-[#00d4ff]/60 transition-all shadow-3xl group">
          <button onClick={() => fileInputRef.current?.click()} className="w-16 h-16 rounded-2xl flex items-center justify-center text-slate-500 hover:text-[#00d4ff] hover:bg-white/5 transition-all"><ImageIcon size={32} /></button>
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setSelectedImage({ data: (r.result as string).split(',')[1], mimeType: f.type }); r.readAsDataURL(f); } }} />
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={`Soumettez votre requête biomoléculaire à JOSÉ...`} 
            className="flex-1 bg-transparent border-none px-8 py-4 text-white placeholder-slate-800 outline-none font-medium text-2xl italic tracking-tight"
          />
          <button onClick={() => handleSend()} disabled={isLoading || (!input.trim() && !selectedImage)} className="w-20 h-20 rounded-[2rem] bg-[#00d4ff] text-slate-900 flex items-center justify-center shadow-[0_0_30px_#00d4ff44] hover:brightness-125 disabled:opacity-20 transition-all active:scale-90"><Send size={40} /></button>
        </div>
      </div>

      <style>{`
        @keyframes scan { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }
      `}</style>
    </div>
  );
};
