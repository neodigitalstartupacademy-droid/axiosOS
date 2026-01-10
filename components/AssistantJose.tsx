
import React, { useState, useRef, useEffect } from 'react';
import { generateJoseResponseStream } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { Message, Language, AIPersona, ReferralContext } from '../types'; 
import { SYSTEM_CONFIG, I18N as I18N_CONST } from '../constants';
import { jsPDF } from 'jspdf';
import { 
  Send, Bot, Play, Square, User, Image as ImageIcon, Microscope, Rocket, HelpCircle, 
  ChevronRight, Activity, Headphones, Sparkles, Zap, Brain, ThermometerSnowflake, Droplets, 
  Terminal, Cpu, ShieldCheck, BarChart3, Fingerprint, Layers, Download, FileText, HeartPulse, ShoppingCart, MessageCircle, Volume2, X, ExternalLink, Loader2
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
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  
  const persona: AIPersona = {
    name: SYSTEM_CONFIG.ai.name,
    role: SYSTEM_CONFIG.ai.role,
    philosophy: "Restauration du terrain biologique via la Loi des 37°C et la Psychiatrie Cellulaire.",
    tonality: "Souveraine, scientifique, autoritaire et empathique.",
    coreValues: "SAB Standard, Bio-Sync Protocol."
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    { label: "Analyse Membrane Cellulaire", prompt: "Analyse mes membranes cellulaires et mon terrain biologique (SAB).", icon: Microscope },
    { label: "Loi des 37°C", prompt: "Explique-moi l'impact de l'eau glacée sur ma biochimie à 37°C.", icon: ThermometerSnowflake },
    { label: "Stress Cellulaire", prompt: "Comment mes émotions figent-elles mes lipides membranaires ?", icon: Brain },
    { label: "Commander", prompt: "Où commander mon Trio de Relance chez mon conseiller ?", icon: ShoppingCart },
  ];

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });

    const activeRef = sessionStorage.getItem('ndsa_active_ref') || SYSTEM_CONFIG.founder.id;
    const activeShop = sessionStorage.getItem('ndsa_active_shop') || SYSTEM_CONFIG.founder.officialShopUrl;

    setReferralContext({ 
      referrerId: activeRef, 
      referrerName: activeRef === SYSTEM_CONFIG.founder.id ? SYSTEM_CONFIG.founder.name : `Conseiller NDSA`, 
      language: language as Language,
      shopUrl: activeShop
    });

    if (messages.length === 0) {
      setMessages([{ 
        id: 'welcome', 
        role: 'model', 
        parts: [{ text: "Bonjour Leader. Je suis Coach José. Analyse biologique ou stratégie de réseau : sur quoi focalisons-nous votre puissance aujourd'hui ?" }], 
        timestamp: new Date(), 
        status: 'read' 
      }]);
    }
    return () => unsubVoice();
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (text?: string, isAuto = false) => {
    const finalInput = text || input;
    if (!finalInput.trim() && !selectedImage || isLoading) return;
    
    voiceService.stop();
    const userMsgId = 'input_' + Date.now();
    
    // Si c'est un bouton de suggestion, on affiche le message de l'utilisateur
    if (text) {
      setMessages(prev => [...prev, { id: userMsgId, role: 'user', parts: [{ text: finalInput }], timestamp: new Date(), status: 'read' }]);
    } else if (!isAuto) {
      setMessages(prev => [...prev, { id: userMsgId, role: 'user', parts: [{ text: finalInput || "[SCAN IMAGE]" }], timestamp: new Date(), status: 'read' }]);
    }
    
    setInput('');
    setIsLoading(true);
    setGroundingSources([]);
    const currentImg = selectedImage;
    setSelectedImage(null);
    
    try {
      const stream = await generateJoseResponseStream(finalInput, isAuto ? [] : messages, referralContext, language as Language, persona, currentSubscriberId, currentImg);
      let aiMsgId = 'ai_' + Date.now();
      let fullText = "";
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date(), status: 'sending' }]);

      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
        const chunks = (chunk as any).candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) setGroundingSources(prev => [...prev, ...chunks]);
      }
      
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, status: 'read' } : m));
      
      // LECTURE AUTOMATIQUE DE L'ANALYSE
      voiceService.play(fullText, `msg_${aiMsgId}`, language as Language);
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async (message: Message) => {
    setIsExporting(message.id);
    try {
      const doc = new jsPDF();
      const margin = 20;
      let y = 30;

      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 50, 'F');
      
      doc.setTextColor(0, 212, 255); 
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("RAPPORT D'ANALYSE COACH JOSÉ", margin, 25);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("NEO DIGITAL STARTUP ACADEMY - PROTOCOLE BIOLOGIQUE", margin, 35);
      doc.text(`DATE : ${new Date().toLocaleDateString()} | SOURCE : GMBC-OS V7`, margin, 42);

      y = 70;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      const content = message.parts[0].text;
      const splitText = doc.splitTextToSize(content, 170);
      doc.text(splitText, margin, y);
      
      doc.save(`Analyse_NDSA_${Date.now()}.pdf`);
    } catch (e) {
      console.error("PDF Export failed", e);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="flex h-full bg-[#020617] text-white overflow-hidden font-sans relative">
      
      {/* SIDEBAR CLINIQUE */}
      <aside className="hidden xl:flex w-80 flex-col border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 gap-10 overflow-y-auto no-scrollbar">
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center shadow-3xl mx-auto">
            <Cpu className="text-[#00d4ff]" size={40} />
          </div>
          <div className="text-center">
            <h3 className="font-stark text-xs font-black tracking-[0.4em] uppercase">Neural Hub</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Bio-Sync Active</span>
            </div>
          </div>
        </div>

        <div className="h-32 bg-slate-900/50 rounded-3xl border border-white/5 p-4 flex items-end justify-center gap-1.5">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1 bg-[#00d4ff] rounded-full" style={{ 
                    height: `${20 + Math.random() * 60}%`,
                    animation: isLoading || activeSpeechKey ? `wave ${0.5 + Math.random()}s infinite ease-in-out` : 'none'
                }}></div>
            ))}
        </div>

        <div className="mt-auto space-y-6">
           {referralContext && (
               <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Conseiller Master</p>
                  <p className="text-sm font-black italic">{referralContext.referrerName}</p>
                  <a href={`https://wa.me/${SYSTEM_CONFIG.founder.whatsapp}`} target="_blank" className="w-full py-4 bg-emerald-500 text-slate-900 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                    <MessageCircle size={14} /> Expert Direct
                  </a>
               </div>
           )}
        </div>
      </aside>

      {/* NEXUS CENTRAL */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* ZONE DE MESSAGES */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto px-6 md:px-24 pt-10 pb-52 space-y-16 no-scrollbar scroll-smooth"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-10 duration-700`}>
              <div className={`flex gap-8 w-full ${msg.role === 'user' ? 'max-w-[80%] flex-row-reverse' : 'max-w-full'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border mt-1 shadow-2xl ${msg.role === 'user' ? 'bg-slate-900 border-white/5' : 'bg-[#00d4ff]/10 border-[#00d4ff]/20'}`}>
                   {msg.role === 'user' ? <User size={20} className="text-slate-600" /> : <Bot size={24} className="text-[#00d4ff]" />}
                </div>

                <div className="flex flex-col space-y-6 w-full">
                  <div className={`text-lg md:text-xl font-light leading-relaxed tracking-tight whitespace-pre-line ${msg.role === 'user' ? 'text-[#00d4ff]/80 italic text-right' : 'text-slate-100'}`}>
                    {msg.parts[0].text}
                  </div>
                  
                  {msg.role === 'model' && msg.parts[0].text.length > 0 && (
                    <div className="flex flex-wrap items-center gap-4">
                      <button 
                        onClick={() => voiceService.play(msg.parts[0].text, `msg_${msg.id}`, language as Language)} 
                        className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border font-stark text-[9px] font-black uppercase tracking-widest transition-all ${voiceService.isCurrentlyReading(`msg_${msg.id}`) ? 'bg-[#00d4ff] text-slate-950 border-[#00d4ff]' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                      >
                        {voiceService.isCurrentlyReading(`msg_${msg.id}`) ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                        {voiceService.isCurrentlyReading(`msg_${msg.id}`) ? "ARRÊTER" : "RÉÉCOUTER"}
                      </button>

                      <button 
                        onClick={() => handleExportPDF(msg)}
                        disabled={isExporting === msg.id}
                        className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-emerald-400 transition-all"
                      >
                        {isExporting === msg.id ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                        EXPORTER PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start py-4">
              <div className="flex gap-2 p-4 bg-white/5 rounded-2xl">
                <div className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* BARRE DE DIALOGUE FIXÉE (DOCK NEXUS) */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 pointer-events-none z-50">
           <div className="max-w-5xl mx-auto glass-card rounded-[2.5rem] border border-white/10 p-4 shadow-3xl bg-slate-900/95 backdrop-blur-3xl pointer-events-auto flex flex-col gap-4">
              
              {/* SUGGESTIONS */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-2">
                 {suggestions.map((sug, i) => (
                   <button 
                    key={i} 
                    onClick={() => handleSend(sug.prompt)} 
                    className="shrink-0 px-5 py-2.5 bg-white/5 border border-white/5 rounded-full flex items-center gap-3 hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]/40 transition-all group"
                   >
                      <sug.icon size={12} className="text-slate-500 group-hover:text-[#00d4ff]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">{sug.label}</span>
                   </button>
                 ))}
              </div>

              {/* INPUT */}
              <div className="flex items-center gap-4 bg-black/40 rounded-[2rem] border border-white/5 p-2 px-6 focus-within:border-[#00d4ff]/30 transition-all">
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="p-2 text-slate-500 hover:text-[#00d4ff] transition-all"
                >
                   <ImageIcon size={22} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="image/*" 
                  onChange={(e) => { 
                    const f = e.target.files?.[0]; 
                    if(f) { 
                      const r = new FileReader(); 
                      r.onloadend = () => setSelectedImage({ data: (r.result as string).split(',')[1], mimeType: f.type }); 
                      r.readAsDataURL(f); 
                    } 
                  }} 
                />
                
                <input 
                  type="text"
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Symptôme, analyse, question..." 
                  className="flex-1 bg-transparent border-none text-white placeholder-slate-800 outline-none font-medium text-lg italic py-4"
                />

                <button 
                  onClick={() => handleSend()} 
                  disabled={isLoading} 
                  className="w-14 h-14 bg-[#00d4ff] text-slate-950 rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                   <Send size={20} />
                </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};
