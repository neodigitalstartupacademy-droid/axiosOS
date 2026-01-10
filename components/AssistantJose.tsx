
import React, { useState, useRef, useEffect } from 'react';
import { generateJoseResponseStream } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { Message, Language, AIPersona, ReferralContext } from '../types'; 
import { SYSTEM_CONFIG, I18N as I18N_CONST } from '../constants';
import { jsPDF } from 'jspdf';
import { 
  Send, Bot, Play, Square, User, Image as ImageIcon, Microscope, Rocket, HelpCircle, 
  ChevronRight, Activity, Headphones, Sparkles, Zap, Brain, ThermometerSnowflake, Droplets, 
  Terminal, Cpu, ShieldCheck, BarChart3, Fingerprint, Layers, Download, FileText, HeartPulse, ShoppingCart, MessageCircle, Volume2, X, ExternalLink, Loader2, MapPin, Clock, PhoneCall, AlertCircle
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
    { label: "Analyse Cellulaire", prompt: "Effectue un scan de mon état cellulaire actuel.", icon: Microscope },
    { label: "Protocole SAB", prompt: "Explique-moi l'ouverture des membranes via Tre-en-en.", icon: ShieldCheck },
    { label: "Stratégie Diamond", prompt: "Comment dupliquer mon réseau en mode Imperium ?", icon: Rocket },
  ];

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });

    const activeRef = sessionStorage.getItem('ndsa_active_ref') || SYSTEM_CONFIG.founder.id;
    const activeShop = sessionStorage.getItem('ndsa_active_shop') || SYSTEM_CONFIG.founder.officialShopUrl;

    setReferralContext({ 
      referrerId: activeRef, 
      referrerName: activeRef === SYSTEM_CONFIG.founder.id ? SYSTEM_CONFIG.founder.name : `Expert NDSA`, 
      language: language as Language,
      shopUrl: activeShop
    });

    if (messages.length === 0) {
      setMessages([{ 
        id: 'welcome', 
        role: 'model', 
        parts: [{ text: "Système Activé. Je suis Coach José. Vos biomarqueurs sont prêts pour l'analyse. Sur quel pilier de puissance focalisons-nous votre empire aujourd'hui ?" }], 
        timestamp: new Date(), 
        status: 'read' 
      }]);
    }
    return () => unsubVoice();
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const finalInput = text || input;
    if (!finalInput.trim() && !selectedImage || isLoading) return;
    
    voiceService.stop();
    const userMsgId = 'input_' + Date.now();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', parts: [{ text: finalInput || "[INPUT SCAN]" }], timestamp: new Date(), status: 'read' }]);
    setInput('');
    setIsLoading(true);
    const currentImg = selectedImage;
    setSelectedImage(null);
    
    try {
      const stream = await generateJoseResponseStream(finalInput, messages, referralContext, language as Language, persona, currentSubscriberId, currentImg);
      let aiMsgId = 'ai_' + Date.now();
      let fullText = "";
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date(), status: 'sending' }]);

      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }
      voiceService.play(fullText, `msg_${aiMsgId}`, language as Language);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const handleExportPDF = async (message: Message) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(2, 6, 23); 
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(0, 212, 255); 
      doc.setFontSize(20);
      doc.text("STARK-SYSTEMS ANALYSIS REPORT", 20, 25);
      doc.setTextColor(0,0,0);
      const splitText = doc.splitTextToSize(message.parts[0].text, 170);
      doc.text(splitText, 20, 60);
      doc.save(`NDSA_Analysis_${Date.now()}.pdf`);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex h-full bg-slate-950 text-white overflow-hidden relative">
      <aside className="hidden xl:flex w-96 flex-col border-r border-blue-500/10 bg-black/20 p-8 gap-8 overflow-y-auto no-scrollbar">
        <div className="space-y-6">
          <div className="w-24 h-24 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.2)] mx-auto hologram-scan">
            <Cpu className="text-blue-400" size={44} />
          </div>
          <div className="text-center">
            <h3 className="font-stark text-xs font-black uppercase tracking-[0.4em]">Stark Neural Hub</h3>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">A.I. Presence: Active</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
           <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4 shadow-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3"><Activity size={14} className="text-blue-400" /> Bio-Sync Status</p>
              <div className="space-y-3">
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[85%]"></div>
                 </div>
                 <p className="text-[9px] text-slate-400 italic">Optimisation Cellulaire à 85% de la capacité nominale.</p>
              </div>
           </div>

           <div className="p-6 bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Mentor Hub</p>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              </div>
              <div className="space-y-1">
                 <p className="text-sm font-black text-white italic uppercase tracking-tighter leading-tight">{referralContext?.referrerName}</p>
                 <p className="text-[10px] text-emerald-400 font-bold tracking-widest">ONLINE READY</p>
              </div>
              <a href={SYSTEM_CONFIG.maintenance.fallback_whatsapp} target="_blank" className="w-full py-4 bg-white text-slate-950 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#00d4ff] transition-all shadow-xl">
                <MessageCircle size={16} /> Direct Link
              </a>
           </div>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5">
           <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.5em] text-center italic">NDSA-IMPERIUM-OS-V8</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative h-full">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-20 pt-12 pb-48 space-y-16 no-scrollbar scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-8 duration-700`}>
              <div className={`flex gap-8 w-full ${msg.role === 'user' ? 'max-w-[80%] flex-row-reverse' : 'max-w-full'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border mt-1 shadow-2xl transition-all ${msg.role === 'user' ? 'bg-slate-900 border-white/10' : 'bg-blue-500/10 border-blue-500/30'}`}>
                  {msg.role === 'user' ? <User size={20} className="text-slate-500" /> : <Bot size={24} className="text-blue-400" />}
                </div>
                <div className="flex flex-col space-y-6 w-full">
                  <div className={`text-lg font-light leading-relaxed tracking-tight whitespace-pre-line ${msg.role === 'user' ? 'text-blue-400 italic text-right' : 'text-slate-100'}`}>
                    {msg.parts[0].text}
                  </div>
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-4">
                      <button onClick={() => voiceService.play(msg.parts[0].text, `msg_${msg.id}`, language as Language)} className={`flex items-center gap-3 px-6 py-2.5 rounded-xl border font-stark text-[9px] font-black uppercase tracking-[0.2em] transition-all ${voiceService.isCurrentlyReading(`msg_${msg.id}`) ? 'bg-blue-500 text-slate-950 border-blue-500' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}>
                        {voiceService.isCurrentlyReading(`msg_${msg.id}`) ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                        {voiceService.isCurrentlyReading(`msg_${msg.id}`) ? "Deactivate" : "Vocalize Analysis"}
                      </button>
                      <button onClick={() => handleExportPDF(msg)} className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all">
                        <Download size={14} /> PDF Data
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 animate-pulse">
               <Loader2 className="animate-spin text-blue-500" size={24} />
               <div>
                  <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] italic">Neural Computation Engine</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Processing cellular biomarkers...</p>
               </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 pointer-events-none z-50">
           <div className="max-w-5xl mx-auto glass-card rounded-[3rem] border border-blue-500/20 p-4 shadow-[0_50px_100px_rgba(0,0,0,0.8)] pointer-events-auto flex flex-col gap-4">
              <div className="flex gap-3 overflow-x-auto no-scrollbar px-2">
                 {suggestions.map((sug, i) => (
                   <button key={i} onClick={() => handleSend(sug.prompt)} className="shrink-0 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group">
                      <sug.icon size={12} className="text-slate-500 group-hover:text-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">{sug.label}</span>
                   </button>
                 ))}
              </div>
              <div className="flex items-center gap-5 bg-black/40 rounded-[2.5rem] border border-white/5 p-2 px-8 focus-within:border-blue-500/50 transition-all shadow-inner">
                <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 hover:text-blue-400 transition-all"><ImageIcon size={22} /></button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" />
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                  placeholder="Ask Jose for a diagnostic scan..." 
                  className="flex-1 bg-transparent border-none text-white outline-none font-medium text-lg italic py-4 placeholder:text-slate-700" 
                />
                <button onClick={() => handleSend()} disabled={isLoading} className="w-14 h-14 stark-btn rounded-2xl flex items-center justify-center shadow-2xl active:scale-95 transition-all">
                  <Send size={24} />
                </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};
