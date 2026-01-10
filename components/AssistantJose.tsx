
import React, { useState, useRef, useEffect } from 'react';
import { generateJoseResponseStream } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { Message, Language, AIPersona, ReferralContext, NexusPhase } from '../types'; 
import { SYSTEM_CONFIG } from '../constants';
import { jsPDF } from 'jspdf';
import { 
  Send, Bot, Play, Square, User, Image as ImageIcon, Microscope, Rocket, 
  Activity, Cpu, ShieldCheck, Download, MessageCircle, Loader2, MapPin, Zap, Brain, Star,
  MessageSquare, Radio, ChevronRight, ShieldAlert, Sparkles, Network, Command, Shield, 
  Target, Fingerprint, EyeOff, HeartPulse, Terminal, Waves, ActivitySquare
} from 'lucide-react';

interface AssistantJoseProps {
  language?: Language;
  currentSubscriberId?: string;
  onConversionDetected?: (country: string, focus: string) => void;
}

export const AssistantJose: React.FC<AssistantJoseProps> = ({ language = 'fr', currentSubscriberId, onConversionDetected }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);
  const [referralContext, setReferralContext] = useState<ReferralContext | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [isFounderLink, setIsFounderLink] = useState(false);
  
  const [currentPhase, setCurrentPhase] = useState<NexusPhase>('welcome');
  const [showHumanBridge, setShowHumanBridge] = useState(false);
  const [engagementScore, setEngagementScore] = useState(0);
  const [confidenceIndex, setConfidenceIndex] = useState(100);
  const [neuralLatency, setNeuralLatency] = useState(12);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const interactionRef = useRef(false);

  const persona: AIPersona = {
    name: SYSTEM_CONFIG.ai.name,
    role: SYSTEM_CONFIG.ai.role,
    philosophy: "Restauration du terrain biologique via la Loi des 37°C et la Psychiatrie Cellulaire.",
    tonality: "Dominante, souveraine, scientifique et directe.",
    coreValues: "SAB Standard, Bio-Sync Protocol, Autonomous Execution."
  };

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });

    const activeRef = sessionStorage.getItem('ndsa_active_ref') || SYSTEM_CONFIG.founder.id;
    const activeShop = sessionStorage.getItem('ndsa_active_shop') || SYSTEM_CONFIG.founder.officialShopUrl;
    
    const founderFlag = activeRef === SYSTEM_CONFIG.founder.id || activeRef === "M. José Gaétan";
    setIsFounderLink(founderFlag);

    setReferralContext({ 
      referrerId: activeRef, 
      referrerName: founderFlag ? SYSTEM_CONFIG.founder.name : `Expert NDSA`, 
      language: language as Language,
      shopUrl: activeShop
    });

    if (messages.length === 0) {
      setTimeout(() => {
        const welcomeText = founderFlag 
          ? `[IMPERIUM_OS] Protocoles de souveraineté chargés. Bonjour Fondateur Gaétan. Votre assistance neurale est opérationnelle. Prêt pour l'expansion.`
          : `[BIO_SYNC_V8] Système stabilisé. Je suis Coach José. Analyse du terrain biologique en attente. Quelle mission lançons-nous ?`;
        
        setMessages([{ 
          id: 'welcome', 
          role: 'model', 
          parts: [{ text: welcomeText }], 
          timestamp: new Date(), 
          status: 'read' 
        }]);
      }, 500);
    }

    const latencyInterval = setInterval(() => {
      setNeuralLatency(Math.floor(Math.random() * (18 - 8 + 1)) + 8);
    }, 3000);

    return () => {
      unsubVoice();
      clearInterval(latencyInterval);
    };
  }, [language, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const finalInput = text || input;
    if (!finalInput.trim() && !selectedImage || isLoading) return;
    
    interactionRef.current = true;
    setEngagementScore(prev => prev + 1);
    voiceService.stop();

    const userMsgId = 'input_' + Date.now();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', parts: [{ text: finalInput || "[ANALYSE_VISUELLE]" }], timestamp: new Date(), status: 'read' }]);
    setInput('');
    setIsLoading(true);
    
    const startTime = Date.now();

    try {
      const stream = await generateJoseResponseStream(finalInput, messages, referralContext, language as Language, persona, currentSubscriberId, selectedImage);
      setSelectedImage(null);
      
      let aiMsgId = 'ai_' + Date.now();
      let fullText = "";
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date(), status: 'sending' }]);

      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }

      setNeuralLatency(Date.now() - startTime < 2000 ? 10 : 25);
      
      if (currentPhase === 'welcome') setCurrentPhase('diagnostic');
      if (engagementScore > 3) setCurrentPhase('path_selection');
      
      if (fullText.toLowerCase().includes("humain") || finalInput.toLowerCase().includes("vrai expert")) {
        setShowHumanBridge(true);
      }

      voiceService.play(fullText, `msg_${aiMsgId}`, language as Language);
    } catch (error) { 
        console.error(error); 
    } finally { 
        setIsLoading(false); 
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          data: (reader.result as string).split(',')[1],
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getSuggestions = () => {
    if (currentPhase === 'welcome') return [
      { label: "Scan Cellulaire", prompt: "Lance mon Bio-Scan immédiat.", icon: Microscope },
      { label: "Loi des 37°C", prompt: "Explique-moi la Loi des 37°C.", icon: Zap }
    ];
    return [
      { label: "Trio de Relance", prompt: "Pourquoi le Trio de Relance est-il la base ?", icon: HeartPulse },
      { label: "Opportunité", prompt: "Comment devenir un Ambassadeur NDSA ?", icon: Rocket }
    ];
  };

  return (
    <div className={`flex flex-col md:flex-row h-full rounded-t-[3rem] border-x border-t overflow-hidden relative transition-all duration-1000 ${isFounderLink ? 'bg-[#0a0a0a] border-amber-500/30' : 'bg-[#020617] border-blue-500/10'}`}>
      
      {/* Neural HUD Sidebar */}
      <aside className={`hidden xl:flex w-72 flex-col border-r p-8 gap-10 shrink-0 relative transition-all ${isFounderLink ? 'border-amber-500/20 bg-amber-950/5' : 'border-blue-500/10 bg-black/20'}`}>
        <div className="space-y-6">
           <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto relative ${isFounderLink ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' : 'bg-blue-500/10 border-blue-500/40 text-blue-400'}`}>
              <Brain size={32} className="animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping"></div>
           </div>
           <div className="text-center space-y-1">
              <h3 className="font-stark text-[8px] font-black uppercase tracking-[0.4em] opacity-50">Stark Neural Core</h3>
              <p className={`text-[9px] font-black uppercase tracking-widest ${isFounderLink ? 'text-amber-500' : 'text-blue-500'}`}>Sovereign Active</p>
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-slate-500">
                 <span className="flex items-center gap-2"><Fingerprint size={12} /> Sync Level</span>
                 <span className={isFounderLink ? 'text-amber-500' : 'text-blue-500'}>{confidenceIndex}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className={`h-full transition-all duration-1000 ${isFounderLink ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${confidenceIndex}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-slate-500">
                 <span className="flex items-center gap-2"><Terminal size={12} /> Latency</span>
                 <span className="text-emerald-500">{neuralLatency}ms</span>
              </div>
              <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-slate-500">
                 <span className="flex items-center gap-2"><Waves size={12} /> Engagement</span>
                 <span className="text-purple-400">{engagementScore}</span>
              </div>
           </div>

           <div className="p-5 rounded-2xl border border-white/5 bg-black/40 space-y-3">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">Mission Context</p>
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={10} className="text-emerald-500" />
                    <span className="text-[7px] font-black text-white uppercase truncate">{referralContext?.referrerName}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Target size={10} className="text-rose-500" />
                    <span className="text-[7px] font-black text-white uppercase">{currentPhase}</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="mt-auto space-y-2 opacity-50">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
              <EyeOff size={10} className="text-slate-400" />
              <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Privacy Shield v4</span>
           </div>
        </div>
      </aside>

      {/* Main Neural Display */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="h-14 px-8 border-b border-white/5 bg-black/20 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4">
              <div className="flex gap-1">
                 <span className="w-1 h-3 bg-blue-500/40 rounded-full"></span>
                 <span className="w-1 h-3 bg-blue-500/20 rounded-full animate-bounce"></span>
                 <span className="w-1 h-3 bg-blue-500/60 rounded-full"></span>
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Signal_Live: {isFounderLink ? 'IMPERIUM_GATEWAY' : 'GMBC_CORE_V8'}</span>
           </div>
           {showHumanBridge && (
             <a href="https://wa.me/2290195388292" target="_blank" className={`px-4 py-1.5 rounded-full border text-[7px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2 ${isFounderLink ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-white text-slate-900 border-white'}`}>
                <MessageCircle size={10} /> Expert Humain Requis
             </a>
           )}
        </div>

        {/* Scroll Zone */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-16 pt-10 pb-44 space-y-12 no-scrollbar scroll-smooth">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`flex gap-6 w-full ${msg.role === 'user' ? 'max-w-[85%] md:max-w-[70%] flex-row-reverse' : 'max-w-full'}`}>
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-1 shadow-2xl transition-all ${msg.role === 'user' ? 'bg-slate-900 border-white/10' : (isFounderLink ? 'bg-amber-500/10 border-amber-500/40' : 'bg-blue-500/10 border-blue-500/30')}`}>
                      {msg.role === 'user' ? <User size={18} className="text-slate-500" /> : <Bot size={20} className={isFounderLink ? 'text-amber-500' : 'text-blue-400'} />}
                   </div>
                   <div className="space-y-4 w-full">
                      <div className={`text-md md:text-lg font-light leading-relaxed tracking-tight whitespace-pre-line ${msg.role === 'user' ? 'text-blue-300 italic text-right' : 'text-slate-100'}`}>
                         {msg.parts[0].text}
                      </div>
                      {msg.role === 'model' && (
                        <div className="flex gap-2">
                           <button onClick={() => voiceService.play(msg.parts[0].text, msg.id, language as Language)} className={`px-4 py-1.5 rounded-xl border font-stark text-[8px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${voiceService.isCurrentlyReading(msg.id) ? (isFounderLink ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-blue-500 text-slate-950 border-blue-500') : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}>
                              {voiceService.isCurrentlyReading(msg.id) ? <Square size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                              {voiceService.isCurrentlyReading(msg.id) ? "Stop" : "Vocalize"}
                           </button>
                           <button onClick={() => {
                              const doc = new jsPDF();
                              doc.text(msg.parts[0].text, 10, 10);
                              doc.save(`Report_${msg.id}.pdf`);
                           }} className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Download size={14} /></button>
                        </div>
                      )}
                   </div>
                </div>
             </div>
           ))}
           {isLoading && (
              <div className="flex items-center gap-4 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 animate-pulse max-w-sm">
                 <Loader2 className={`animate-spin ${isFounderLink ? 'text-amber-500' : 'text-blue-500'}`} size={24} />
                 <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isFounderLink ? 'text-amber-400' : 'text-blue-400'}`}>Neural Synthesis</p>
                    <p className="text-[7px] text-slate-500 font-bold uppercase mt-1">Processing clinical vectors...</p>
                 </div>
              </div>
           )}
        </div>

        {/* Input Terminal */}
        <div className="absolute bottom-8 left-0 w-full px-4 md:px-10 pointer-events-none">
           <div className={`max-w-4xl mx-auto glass-card rounded-[2.5rem] p-3 pointer-events-auto border shadow-3xl flex flex-col gap-3 transition-all ${isFounderLink ? 'border-amber-500/30' : 'border-white/10'}`}>
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-2">
                 {getSuggestions().map((sug, i) => (
                    <button key={i} onClick={() => handleSend(sug.prompt)} className="shrink-0 px-4 py-2 bg-white/5 border border-white/5 rounded-full flex items-center gap-2 hover:bg-white/10 transition-all group">
                       <sug.icon size={10} className="text-slate-500 group-hover:text-blue-400" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">{sug.label}</span>
                    </button>
                 ))}
              </div>
              
              {selectedImage && (
                <div className="px-6 py-2 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mx-2">
                   <ImageIcon size={14} className="text-emerald-500" />
                   <span className="text-[9px] font-black text-emerald-400 uppercase">Image chargée pour Bio-Scan</span>
                   <button onClick={() => setSelectedImage(null)} className="ml-auto text-emerald-500"><Square size={10}/></button>
                </div>
              )}

              <div className="flex items-center gap-4 bg-black/60 rounded-[2rem] border border-white/5 p-1 px-6 focus-within:border-blue-500/40 transition-all">
                 <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-600 hover:text-blue-400 transition-all"><ImageIcon size={20}/></button>
                 <input type="file" ref={fileInputRef} hidden onChange={handleImageUpload} accept="image/*" />
                 <input 
                    type="text" 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Instancier commande Bio-Sync..." 
                    className="flex-1 bg-transparent border-none text-white outline-none font-medium text-sm md:text-md italic py-4 placeholder:text-slate-800"
                 />
                 <button onClick={() => handleSend()} disabled={isLoading} className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xl active:scale-95 transition-all shrink-0 ${isFounderLink ? 'bg-amber-500 text-slate-950' : 'stark-btn'}`}>
                    <Command size={20} />
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};
