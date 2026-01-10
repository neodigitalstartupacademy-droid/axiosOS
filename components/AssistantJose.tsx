
import React, { useState, useRef, useEffect } from 'react';
import { generateJoseResponseStream } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { Message, Language, AIPersona, ReferralContext } from '../types'; 
import { SYSTEM_CONFIG, I18N as I18N_CONST } from '../constants';
import { ConversionNotification } from './ConversionNotification';
import { 
  Send, Bot, Play, Square, User, Image as ImageIcon, Microscope, Rocket, HelpCircle, 
  ChevronRight, Activity, Headphones, Sparkles, Zap, Brain, ThermometerSnowflake, Droplets, 
  Terminal, Cpu, ShieldCheck, BarChart3, Fingerprint, Layers, Download, FileText, HeartPulse, ShoppingCart, MessageCircle, Volume2, X, ExternalLink
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
  const [showLeadNotification, setShowLeadNotification] = useState(false);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  
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
    { label: "Bilan Vitalité", prompt: "Analyse mon terrain biologique (SAB) et mes membranes cellulaires.", icon: HeartPulse },
    { label: "Loi des 37°C", prompt: "Explique-moi l'impact de l'eau glacée sur ma biochimie à 37°C.", icon: ThermometerSnowflake },
    { label: "Stress Cellulaire", prompt: "Comment mes émotions figent-elles mes lipides membranaires ?", icon: Brain },
    { label: "Commander", prompt: "Où commander mon Trio de Relance chez mon conseiller ?", icon: ShoppingCart },
  ];

  useEffect(() => {
    const unsubVoice = voiceService.subscribe((isSpeaking, key) => {
      setActiveSpeechKey(isSpeaking ? key : null);
    });

    const activeRef = sessionStorage.getItem('ndsa_active_ref') || SYSTEM_CONFIG.founder.id;
    const activeSlug = sessionStorage.getItem('ndsa_active_slug') || SYSTEM_CONFIG.founder.shop_slug;
    const activeShop = sessionStorage.getItem('ndsa_active_shop') || SYSTEM_CONFIG.founder.officialShopUrl;

    setReferralContext({ 
      referrerId: activeRef, 
      referrerName: activeRef === SYSTEM_CONFIG.founder.id ? SYSTEM_CONFIG.founder.name : `Conseiller NDSA`, 
      language: language as Language,
      shopUrl: activeShop
    });

    const params = new URLSearchParams(window.location.search);
    const mode = params.get('m');

    if (messages.length === 0) {
      if (mode === 'w') {
        handleAutoWelcome(activeRef);
      } else {
        setMessages([{ 
          id: 'welcome', 
          role: 'model', 
          parts: [{ text: "Bonjour Leader. Je suis Coach José. Analyse biologique ou stratégie de réseau : sur quoi focalisons-nous votre puissance aujourd'hui ?" }], 
          timestamp: new Date(), 
          status: 'read' 
        }]);
      }
    }
    return () => unsubVoice();
  }, [language]);

  const handleAutoWelcome = async (refId: string) => {
    const welcomePrompt = `Bonjour ! Je suis José, votre expert en Bio-Sync. Bienvenue dans l'univers NDSA. Je suis prêt à scanner vos besoins biologiques immédiatement. Souhaitez-vous lancer le scan ?`;
    await handleSend(welcomePrompt, true);
  };

  const handleSend = async (text?: string, isAuto = false) => {
    const finalInput = text || input;
    if (!finalInput.trim() && !selectedImage || isLoading) return;
    
    voiceService.stop();
    const userMsgId = 'input_' + Date.now();
    if (!isAuto) {
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
        
        // Extraction des sources Google Search
        const chunks = (chunk as any).candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
            setGroundingSources(prev => [...prev, ...chunks]);
        }
      }
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, status: 'read' } : m));
      voiceService.play(fullText, `msg_${aiMsgId}`, language as Language);
      
      if (fullText.includes('boutique') || fullText.includes('http')) {
        setShowLeadNotification(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden font-sans">
      
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

        {/* BIO-PULSE VISUALIZER */}
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
      <main className="flex-1 flex flex-col relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-24 py-20 space-y-24 no-scrollbar scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-10 duration-700`}>
              <div className={`flex gap-10 w-full ${msg.role === 'user' ? 'max-w-[80%] flex-row-reverse' : 'max-w-full'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border mt-2 shadow-2xl ${msg.role === 'user' ? 'bg-slate-900 border-white/5' : 'bg-[#00d4ff]/10 border-[#00d4ff]/20'}`}>
                   {msg.role === 'user' ? <User size={24} className="text-slate-600" /> : <Bot size={28} className="text-[#00d4ff]" />}
                </div>

                <div className="flex flex-col space-y-8 w-full">
                  <div className={`text-2xl md:text-3xl font-light leading-[1.6] tracking-tight whitespace-pre-line ${msg.role === 'user' ? 'text-[#00d4ff]/80 italic text-right' : 'text-slate-100'}`}>
                    {msg.parts[0].text}
                  </div>
                  
                  {msg.role === 'model' && (
                    <div className="flex flex-wrap items-center gap-6">
                      <button 
                        onClick={() => voiceService.play(msg.parts[0].text, `msg_${msg.id}`, language as Language)} 
                        className={`flex items-center gap-4 px-6 py-3 rounded-xl border font-stark text-[10px] font-black uppercase tracking-[0.2em] transition-all ${voiceService.isCurrentlyReading(`msg_${msg.id}`) ? 'bg-[#00d4ff] text-slate-950 border-[#00d4ff]' : 'bg-white/5 border-white/10 text-slate-500'}`}
                      >
                        {voiceService.isCurrentlyReading(`msg_${msg.id}`) ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                        {voiceService.isCurrentlyReading(`msg_${msg.id}`) ? "SYNTHÈSE EN COURS" : "LIRE L'ANALYSE"}
                      </button>

                      {groundingSources.length > 0 && (
                          <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Sources:</span>
                              {groundingSources.slice(0, 3).map((s, idx) => (
                                  <a key={idx} href={s.web?.uri} target="_blank" className="p-2 bg-white/5 border border-white/10 rounded-lg text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all">
                                      <ExternalLink size={14} />
                                  </a>
                              ))}
                          </div>
                      )}
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
          <div className="h-[40vh]"></div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-8 z-40">
           <div className="glass-card rounded-[3rem] border border-white/10 p-5 shadow-3xl bg-slate-900/80 flex flex-col gap-5">
              <div className="flex gap-3 overflow-x-auto no-scrollbar px-2">
                 {suggestions.map((sug, i) => (
                   <button key={i} onClick={() => handleSend(sug.prompt)} className="shrink-0 px-6 py-3 bg-white/5 border border-white/5 rounded-full flex items-center gap-3 hover:bg-[#00d4ff]/10 transition-all">
                      <sug.icon size={12} className="text-slate-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{sug.label}</span>
                   </button>
                 ))}
              </div>

              <div className="flex items-center gap-5">
                <button onClick={() => fileInputRef.current?.click()} className="p-5 bg-white/5 border border-white/10 rounded-[2rem] text-slate-500 hover:text-[#00d4ff] transition-all">
                   <ImageIcon size={24} />
                </button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setSelectedImage({ data: (r.result as string).split(',')[1], mimeType: f.type }); r.readAsDataURL(f); } }} />
                
                <div className="flex-1 relative">
                  <textarea 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder="Symptôme, analyse de sang, question..." 
                    className="w-full bg-transparent border-none text-white placeholder-slate-700 outline-none font-medium text-xl italic resize-none py-4 leading-tight no-scrollbar"
                    rows={1}
                  />
                  {selectedImage && (
                    <div className="absolute -top-12 left-0 bg-[#00d4ff] text-slate-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase animate-bounce">
                       Image Chargée
                    </div>
                  )}
                </div>

                <button onClick={() => handleSend()} disabled={isLoading} className="w-16 h-16 bg-[#00d4ff] text-slate-950 rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
                   <Send size={24} />
                </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};
