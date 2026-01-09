
import React, { useState, useRef, useEffect } from 'react';
import { generateJoseResponseStream } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { Message, Language, AIPersona, ReferralContext } from '../types'; 
import { SYSTEM_CONFIG, I18N as I18N_CONST } from '../constants';
import { 
  Send, Bot, Play, Square, User, Image as ImageIcon, Microscope, FlaskConical, Rocket, HelpCircle, ChevronRight, Activity, Headphones, Sparkles
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
    philosophy: "Protocole NDSA. Restauration de l'autorité cellulaire.",
    tonality: "Souverain Stark, Expert Clinique, Bienveillance Protectrice.",
    coreValues: "Standard SAB, Précision Biomédicale, Succès NeoLife."
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });

    const params = new URLSearchParams(window.location.search);
    let refId = params.get('ref');
    const activeRef = refId || sessionStorage.getItem('ndsa_active_ref');
    if (activeRef) {
      setReferralContext({ 
        referrerId: activeRef, 
        referrerName: `Leader ${activeRef}`, 
        language: language as Language 
      });
    }

    if (messages.length === 0) {
      const welcomeId = 'welcome';
      let welcomeText = `Bonjour ! Je suis JOSÉ, votre assistant neural NDSA. ✨\n\nPrêt pour l'application du Protocole de Nutrition Cellulaire. Comment puis-je vous aider aujourd'hui ?`;
      
      setMessages([{ 
        id: welcomeId, 
        role: 'model', 
        parts: [{ text: welcomeText }], 
        timestamp: new Date(), 
        status: 'read' 
      }]);
    }
    return () => unsubVoice();
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading]);

  const handleSend = async (text?: string, medicalMode = false) => {
    const finalInput = text || input;
    if (!finalInput.trim() && !selectedImage || isLoading) return;
    
    voiceService.stop();
    setIsScanning(medicalMode && !!selectedImage);
    const userMsgId = 'ai_input_' + Date.now();
    const userMsg: Message = { id: userMsgId, role: 'user', parts: [{ text: finalInput || "[SCAN DOCUMENT]" }], timestamp: new Date(), status: 'sending' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const currentImg = selectedImage;
    setSelectedImage(null);
    
    try {
      const stream = await generateJoseResponseStream(userMsg.parts[0].text, messages, referralContext, language as Language, persona, currentSubscriberId, currentImg);
      setIsScanning(false);
      let aiMsgId = 'ai_response_' + Date.now();
      let fullText = "";
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date(), status: 'sending' }]);

      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, status: 'read' } : m));
    } catch (error) {
      console.error(error);
      setIsScanning(false);
    } finally {
      setIsLoading(false);
    }
  };

  const simulate = (intent: 'protocol' | 'business' | 'general') => {
    let prompt = "";
    switch(intent) {
      case 'protocol': prompt = "Explique-moi le Protocole de Nutrition Cellulaire NDSA étape par étape."; break;
      case 'business': prompt = "Comment devenir Ambassadeur NDSA et automatiser mon succès ?"; break;
      case 'general': prompt = "Qu'est-ce que la Psychiatrie Cellulaire et pourquoi la colère verrouille mes cellules ?"; break;
    }
    handleSend(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] relative overflow-hidden font-sans">
      
      {/* BANDEROLE JOSÉ IMPERIUM (HEADER) */}
      <div className="w-full h-24 bg-slate-900 border-b border-[#00d4ff]/20 flex items-center justify-between px-12 relative z-[100] shadow-[0_15px_50px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
         <div className="flex items-center gap-6">
            <div className="w-3 h-3 rounded-full bg-[#00d4ff] animate-pulse shadow-[0_0_20px_#00d4ff]"></div>
            <span className="font-stark text-sm font-black text-white uppercase tracking-[1em] italic">JOSÉ IMPERIUM 2026</span>
         </div>

         {/* LECTEUR VOCAL CENTRALISÉ DANS LA BANDEROLE DU HAUT */}
         {activeSpeechKey ? (
           <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-10 px-12 py-3.5 bg-[#00d4ff]/10 rounded-full border border-[#00d4ff]/30 animate-in slide-in-from-top duration-500 backdrop-blur-xl">
              <div className="flex items-end gap-1.5 h-6">
                 {[...Array(15)].map((_, i) => (
                    <div key={i} className="w-0.5 bg-[#00d4ff] rounded-full animate-[wave_1s_infinite_ease-in-out]" style={{ animationDelay: `${i * 0.08}s` }}></div>
                 ))}
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-[11px] font-black text-[#00d4ff] uppercase tracking-[0.4em] italic animate-pulse">Lecture Active</span>
                 <button 
                  onClick={() => voiceService.stop()} 
                  className="p-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all shadow-xl"
                  aria-label="Stop audio"
                >
                  <Square size={16} fill="currentColor" />
                </button>
              </div>
           </div>
         ) : (
           <div className="flex items-center gap-5 px-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Status: Bio-Sync Secure</span>
              <Activity size={18} className="text-emerald-500 animate-pulse" />
           </div>
         )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* COLONNE GAUCHE : LECTEUR IMMERSIF (MANUSCRIT FLUIDE) */}
        <div className="flex-[2.8] flex flex-col relative bg-black/5">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 md:p-28 space-y-28 no-scrollbar scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-12 duration-700`}>
                <div className={`flex gap-12 w-full ${msg.role === 'user' ? 'max-w-[65%] flex-row-reverse' : 'max-w-full'}`}>
                  
                  {/* Avatar minimaliste */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border mt-2 shadow-2xl transition-all ${msg.role === 'user' ? 'bg-slate-900 border-white/5' : 'bg-[#00d4ff]/10 border-[#00d4ff]/30 shadow-[#00d4ff]/10'}`}>
                     {msg.role === 'user' ? <User size={24} className="text-slate-500" /> : <Bot size={26} className="text-[#00d4ff]" />}
                  </div>

                  <div className="flex flex-col space-y-8 w-full">
                    <div className="relative">
                       <div className={`text-2xl md:text-3xl font-medium whitespace-pre-line leading-[1.6] tracking-tight ${msg.role === 'user' ? 'text-[#00d4ff]/80 italic text-right' : 'text-slate-100'}`}>
                          {msg.parts[0].text}
                       </div>
                       
                       {msg.role === 'model' && (
                        <div className="mt-12 flex items-center gap-8">
                          <button 
                            onClick={() => voiceService.play(msg.parts[0].text, `msg_${msg.id}`, language as Language)} 
                            className={`flex items-center gap-4 px-8 py-3.5 rounded-2xl border-2 font-stark text-[11px] font-black uppercase tracking-[0.3em] transition-all ${voiceService.isCurrentlyReading(`msg_${msg.id}`) ? 'bg-[#00d4ff] text-slate-950 border-[#00d4ff] shadow-[0_0_30px_rgba(0,212,255,0.4)] scale-105' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/40'}`}
                          >
                            <Play size={16} fill="currentColor" /> ACTIVER L'AUDIO
                          </button>
                          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                          <Sparkles size={20} className="text-slate-800" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start py-10">
                <div className="flex gap-12 items-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#00d4ff]/5 border border-[#00d4ff]/20 flex items-center justify-center"><Bot size={26} className="text-[#00d4ff]/40 animate-pulse" /></div>
                  <div className="flex gap-3">
                    <div className="w-3 h-3 bg-[#00d4ff] rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-[#00d4ff] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-3 h-3 bg-[#00d4ff] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}

            {/* ESPACE LIBÉRÉ EN BAS : Lecture fluide jusqu'en bas */}
            <div className="h-[70vh] pointer-events-none"></div>
          </div>
          
          <div className="h-60 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent absolute bottom-0 left-0 right-0 pointer-events-none z-10"></div>
        </div>

        {/* COLONNE DROITE : CONSOLE DE COMMANDE (INPUT RELOCALISÉ) */}
        <div className="flex-1 bg-slate-900/60 p-12 flex flex-col gap-12 border-l border-white/5 relative z-20 backdrop-blur-3xl overflow-y-auto no-scrollbar shadow-[-20px_0_50px_rgba(0,0,0,0.4)]">
          
          <div className="space-y-8">
             <div className="flex items-center gap-5 px-3">
                <div className="p-4 bg-[#00d4ff]/10 rounded-2xl text-[#00d4ff] shadow-[0_0_30px_rgba(0,212,255,0.2)]"><Headphones size={28} /></div>
                <div>
                   <h3 className="font-stark text-sm font-black text-white uppercase tracking-[0.5em] italic leading-none">Command Console</h3>
                   <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 italic">Neural Interfacing v7.5</p>
                </div>
             </div>

             <div className="bg-black/50 p-10 rounded-[4rem] border border-white/10 shadow-inner space-y-10 relative group">
                <div className="absolute top-8 left-10 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.4em] ml-6 italic">"Échangez avec le Coach JOSÉ..."</p>
                
                <textarea 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Saisissez votre question ici..." 
                  className="w-full h-64 bg-transparent border-none text-white placeholder-slate-800 outline-none font-medium text-2xl italic tracking-tight resize-none leading-relaxed"
                />
                
                <div className="flex gap-5">
                   <button onClick={() => fileInputRef.current?.click()} className="p-6 bg-white/5 border border-white/10 rounded-3xl text-slate-500 hover:text-[#00d4ff] hover:bg-white/10 transition-all shadow-xl"><ImageIcon size={28} /></button>
                   <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setSelectedImage({ data: (r.result as string).split(',')[1], mimeType: f.type }); r.readAsDataURL(f); } }} />
                   <button onClick={() => handleSend()} disabled={isLoading} className="flex-1 py-6 bg-[#00d4ff] text-slate-900 rounded-3xl font-black uppercase tracking-[0.4em] text-[13px] flex items-center justify-center gap-5 shadow-[0_20px_60px_rgba(0,212,255,0.3)] hover:brightness-110 active:scale-[0.98] transition-all">
                      ENVOYER <Send size={20} />
                   </button>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <h3 className="font-stark text-[12px] font-black text-slate-600 uppercase tracking-[0.6em] italic ml-8">Neural Protocols</h3>
             <div className="flex flex-col gap-5">
                {[
                  { id: 'protocol', label: 'Protocole NDSA', icon: FlaskConical, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { id: 'business', label: 'Expansion Empire', icon: Rocket, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { id: 'general', label: 'Psychiatrie Cellulaire', icon: HelpCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' }
                ].map(intent => (
                  <button key={intent.id} onClick={() => simulate(intent.id as any)} className={`w-full px-10 py-6 ${intent.bg} border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-[#00d4ff]/30 hover:scale-102 transition-all shadow-2xl`}>
                    <span className={`flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.4em] ${intent.color}`}><intent.icon size={20} /> {intent.label}</span>
                    <ChevronRight size={18} className="text-slate-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
             </div>
          </div>

          {referralContext && (
             <div className="mt-auto pt-10 border-t border-white/10">
                <div className="px-8 py-5 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between shadow-inner">
                   <div className="flex items-center gap-5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]"></div>
                      <p className="text-[11px] font-black text-white italic tracking-tight truncate max-w-[160px]">{referralContext.referrerName}</p>
                   </div>
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Neural Link active</span>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* OVERLAY D'ANALYSE (BIO-SCAN) */}
      {isScanning && (
        <div className="absolute inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-700">
           <div className="text-center space-y-16">
              <div className="relative inline-block">
                <Microscope size={140} className="text-[#00d4ff] mx-auto animate-pulse" />
                <div className="absolute inset-x-0 -bottom-8 h-1.5 bg-[#00d4ff] shadow-[0_0_60px_#00d4ff] animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
              <p className="font-stark text-[#00d4ff] font-black uppercase tracking-[1.4em] text-sm animate-pulse">Bio-Scan v12.0 Analysis in progress...</p>
           </div>
        </div>
      )}
    </div>
  );
};
