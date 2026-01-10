
import React, { useState, useRef, useEffect } from 'react';
import { generateJoseResponseStream } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { Message, Language, AIPersona, ReferralContext } from '../types'; 
import { SYSTEM_CONFIG, I18N as I18N_CONST } from '../constants';
import { jsPDF } from 'jspdf';
import { 
  Send, Bot, Play, Square, User, Image as ImageIcon, Microscope, FlaskConical, Rocket, HelpCircle, 
  ChevronRight, Activity, Headphones, Sparkles, Zap, Brain, ThermometerSnowflake, Droplets, 
  Terminal, Cpu, ShieldCheck, BarChart3, Fingerprint, Layers, Download, FileText, HeartPulse, ShoppingCart, MessageCircle, Volume2, X
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
  const [showLeadNotification, setShowLeadNotification] = useState(false);
  
  const persona: AIPersona = {
    name: SYSTEM_CONFIG.ai.name,
    role: SYSTEM_CONFIG.ai.role,
    philosophy: "Restauration du terrain biologique via la Loi des 37°C et la Psychiatrie Cellulaire.",
    tonality: "Empathique, scientifique, autoritaire et inclusif.",
    coreValues: "SAB Standard, Digital Builder Success."
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    { label: "Bilan Vitalité", prompt: "Je me sens épuisé. Peux-tu analyser mon terrain biologique selon le standard SAB de la NDSA ?", icon: HeartPulse },
    { label: "La Loi des 37°C", prompt: "Explique-moi pourquoi je ne dois plus boire d'eau glacée pour sauver mes cellules.", icon: ThermometerSnowflake },
    { label: "Psychiatrie Cellulaire", prompt: "Comment mes émotions bloquent-elles l'entrée des nutriments dans mes cellules ?", icon: Brain },
    { label: "Commander Protocole", prompt: "J'ai compris. Où puis-je acheter mon protocole de restauration ?", icon: ShoppingCart },
  ];

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });

    const params = new URLSearchParams(window.location.search);
    const mode = params.get('m') || params.get('mode');
    const refId = params.get('r') || params.get('ref');
    const slug = params.get('s');

    // TRAFFIC ROUTING LOGIC - PARAMÈTRES FURTIFS (ORPHAN RULE)
    const activeRef = refId || sessionStorage.getItem('ndsa_active_ref');
    const activeSlug = slug || sessionStorage.getItem('ndsa_active_slug');

    if (activeRef && activeSlug) {
      setReferralContext({ 
        referrerId: activeRef, 
        referrerName: activeRef === SYSTEM_CONFIG.founder.id ? SYSTEM_CONFIG.founder.name : `Leader ${activeRef}`, 
        language: language as Language,
        shopUrl: `https://shopneolife.com/${activeSlug}/shop/atoz`
      });
    } else {
      setReferralContext({
        referrerId: SYSTEM_CONFIG.founder.id,
        referrerName: SYSTEM_CONFIG.founder.name,
        shopUrl: SYSTEM_CONFIG.founder.officialShopUrl
      });
    }

    if (messages.length === 0) {
      if (mode === 'w' || mode === 'welcome') {
        handleAutoStart();
      } else {
        const welcomeText = `Bonjour ! Je suis José, l'IA de la NDSA. ✨\n\nJe suis ici pour restaurer votre vitalité cellulaire via le protocole SAB. Quel est votre focus santé ?`;
        setMessages([{ 
          id: 'welcome', 
          role: 'model', 
          parts: [{ text: welcomeText }], 
          timestamp: new Date(), 
          status: 'read' 
        }]);
      }
    }
    return () => unsubVoice();
  }, [language]);

  const handleAutoStart = async () => {
    setIsLoading(true);
    const aiMsgId = 'auto_' + Date.now();
    setMessages([{ id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date(), status: 'sending' }]);

    try {
      const triggerPrompt = "Initialise un accueil chaleureux. Présente-toi comme José, l'IA NDSA de M. ABADA Jose. Demande s'il est prêt pour son diagnostic bio-cellulaire.";
      const stream = await generateJoseResponseStream(triggerPrompt, [], referralContext, language as Language, persona, currentSubscriberId);
      
      let fullText = "";
      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, status: 'read' } : m));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading]);

  const handleSend = async (text?: string, medicalMode = false) => {
    const finalInput = text || input;
    if (!finalInput.trim() && !selectedImage || isLoading) return;
    
    voiceService.stop();
    setIsScanning(medicalMode && !!selectedImage);
    const userMsgId = 'input_' + Date.now();
    const userMsg: Message = { id: userMsgId, role: 'user', parts: [{ text: finalInput || "[ANALYSE IMAGE]" }], timestamp: new Date(), status: 'sending' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const currentImg = selectedImage;
    setSelectedImage(null);
    
    try {
      const stream = await generateJoseResponseStream(userMsg.parts[0].text, messages, referralContext, language as Language, persona, currentSubscriberId, currentImg);
      setIsScanning(false);
      let aiMsgId = 'ai_' + Date.now();
      let fullText = "";
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date(), status: 'sending' }]);

      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, status: 'read' } : m));
      
      // TRIGGER LEAD NOTIFICATION IF PROTOCOL DETECTED
      if (fullText.toLowerCase().includes('protocole') || fullText.toLowerCase().includes('trio')) {
        setTimeout(() => setShowLeadNotification(true), 3000);
      }
    } catch (error) {
      console.error(error);
      setIsScanning(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden font-sans">
      
      {/* 1. PANNEAU BIO-SYNC */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-black/20 backdrop-blur-3xl p-6 gap-8">
        <div className="flex flex-col items-center gap-4 py-6 border-b border-white/5">
          <div className="w-20 h-20 rounded-[2rem] bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center shadow-2xl">
            <Cpu className="text-[#00d4ff]" size={36} />
          </div>
          <div className="text-center">
            <h3 className="font-stark text-xs font-black tracking-[0.3em] uppercase">NDSA Bio-Sync</h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Status: Operational</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Membrane State</span>
                <span className="text-[10px] font-black text-[#00d4ff]">Fluid</span>
             </div>
             <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#00d4ff] w-[95%] shadow-[0_0_10px_#00d4ff]"></div>
             </div>
          </div>
        </div>

        <div className="mt-auto space-y-4">
           <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <p className="text-[9px] font-bold text-amber-500 leading-relaxed uppercase tracking-widest italic">
                "Tre-en-en : 2 gélules matin, 2 gélules soir."
              </p>
           </div>
           <div className="flex items-center gap-3 px-2">
              <Fingerprint size={14} className="text-slate-700" />
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">GMBC-OS-V7</span>
           </div>
        </div>
      </aside>

      {/* 2. CHAT PANEL */}
      <main className="flex-1 flex flex-col relative bg-gradient-to-b from-black/20 to-transparent">
        <div className="h-24 px-12 border-b border-white/5 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <div className={`w-3 h-3 rounded-full ${activeSpeechKey ? 'bg-[#00d4ff] animate-ping' : 'bg-slate-700'} shadow-[0_0_15px_#00d4ff]`}></div>
            <h2 className="font-stark text-sm font-black text-white uppercase tracking-[0.6em] italic">JOSÉ - EXPERT NDSA</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {referralContext && (
               <a 
                href={referralContext.shopUrl} 
                target="_blank" 
                className="flex items-center gap-3 px-6 py-2.5 bg-emerald-500 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
               >
                 <ShoppingCart size={16} /> Acheter chez {referralContext.referrerName}
               </a>
            )}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-24 py-16 space-y-24 no-scrollbar scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-8 duration-700`}>
              <div className={`flex gap-10 w-full ${msg.role === 'user' ? 'max-w-[75%] flex-row-reverse' : 'max-w-full'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border mt-2 shadow-2xl ${msg.role === 'user' ? 'bg-slate-900 border-white/5' : 'bg-[#00d4ff]/10 border-[#00d4ff]/20'}`}>
                   {msg.role === 'user' ? <User size={24} className="text-slate-600" /> : <Bot size={28} className="text-[#00d4ff]" />}
                </div>

                <div className="flex flex-col space-y-8 w-full">
                  <div className={`text-2xl md:text-3xl font-light leading-[1.7] tracking-tight whitespace-pre-line ${msg.role === 'user' ? 'text-[#00d4ff]/80 italic text-right' : 'text-slate-100'}`}>
                    {msg.parts[0].text}
                  </div>
                  
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => voiceService.play(msg.parts[0].text, `msg_${msg.id}`, language as Language)} 
                        className={`flex items-center gap-4 px-6 py-2.5 rounded-xl border font-stark text-[10px] font-black uppercase tracking-[0.2em] transition-all ${voiceService.isCurrentlyReading(`msg_${msg.id}`) ? 'bg-[#00d4ff] text-slate-950 border-[#00d4ff]' : 'bg-white/5 border-white/10 text-slate-500'}`}
                      >
                        {voiceService.isCurrentlyReading(`msg_${msg.id}`) ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                        {voiceService.isCurrentlyReading(`msg_${msg.id}`) ? "SPEAKING..." : "AUDIO"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start py-8">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div className="h-[40vh] pointer-events-none"></div>
        </div>

        {/* NOTIFICATION LEAD */}
        {showLeadNotification && (
          <div className="absolute top-32 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md animate-in slide-in-from-top duration-700">
             <div className="bg-white border-4 border-[#FFD700] rounded-3xl p-6 shadow-3xl text-slate-900 relative">
                <button onClick={() => setShowLeadNotification(false)} className="absolute top-4 right-4 text-slate-400"><X size={16} /></button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-500 text-white rounded-2xl animate-bounce"><Rocket size={24} /></div>
                  <h4 className="font-black uppercase tracking-tighter text-xl">🚀 Nouveau Lead !</h4>
                </div>
                <p className="text-sm font-medium italic mb-4">Un prospect vient de finir son diagnostic. Lien de votre boutique [Slug] utilisé.</p>
                <button onClick={() => setShowLeadNotification(false)} className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl">
                   <MessageCircle size={16} /> Suivi WhatsApp immédiat
                </button>
             </div>
          </div>
        )}

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-40">
           <div className="glass-card rounded-[3rem] border border-white/10 p-4 shadow-3xl bg-slate-900/60 flex flex-col gap-4">
              <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2 border-b border-white/5 mb-2">
                 {suggestions.map((sug, i) => (
                   <button key={i} onClick={() => handleSend(sug.prompt)} className="shrink-0 px-5 py-2.5 bg-white/5 border border-white/5 rounded-full flex items-center gap-3 hover:bg-[#00d4ff]/10 transition-all">
                      <sug.icon size={12} className="text-slate-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{sug.label}</span>
                   </button>
                 ))}
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => fileInputRef.current?.click()} className="p-5 bg-white/5 border border-white/10 rounded-[2rem] text-slate-500 hover:text-[#00d4ff] transition-all shrink-0">
                   <ImageIcon size={22} />
                </button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setSelectedImage({ data: (r.result as string).split(',')[1], mimeType: f.type }); r.readAsDataURL(f); } }} />
                
                <div className="flex-1 relative">
                  <textarea 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder="Posez votre question à Coach José..." 
                    className="w-full bg-transparent border-none text-white placeholder-slate-700 outline-none font-medium text-lg italic resize-none py-4 leading-tight no-scrollbar max-h-32"
                    rows={1}
                  />
                  {selectedImage && (
                    <div className="absolute -top-16 left-0 bg-[#00d4ff] text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 animate-bounce">
                       <ImageIcon size={12} /> Image prête pour analyse
                    </div>
                  )}
                </div>

                <button onClick={() => handleSend()} disabled={isLoading} className="w-16 h-16 bg-[#00d4ff] text-slate-950 rounded-[2rem] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all shrink-0">
                   <Send size={24} />
                </button>
              </div>
           </div>
        </div>

        <div className="h-40 bg-gradient-to-t from-[#020617] to-transparent absolute bottom-0 left-0 right-0 pointer-events-none z-10"></div>
      </main>
    </div>
  );
};
