
import React, { useState, useRef, useEffect } from 'react';
import { generateJoseResponseStream } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { Message, Language, ReferralContext } from '../types'; 
import { SYSTEM_CONFIG } from '../constants';
import { 
  Bot, Play, Square, User, Image as ImageIcon, Microscope, Rocket, 
  Activity, Cpu, Loader2, Zap, Brain, Command, HeartPulse, Waves,
  ShieldCheck, ArrowRight, ShoppingCart, Sparkles, Fingerprint, Info,
  CheckCircle2
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
  const [referralContext, setReferralContext] = useState<ReferralContext | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [isFounderLink, setIsFounderLink] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const activeRef = sessionStorage.getItem('ndsa_active_ref') || 'startupforworld';
    const activeShop = sessionStorage.getItem('ndsa_active_shop') || SYSTEM_CONFIG.founder.officialShopUrl;
    
    const founderFlag = activeRef === SYSTEM_CONFIG.founder.id || activeRef === "M. José Gaétan" || activeRef === "startupforworld";
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
          ? `[IMPERIUM-LINK] Maître Fondateur, le Noyau Stark Fusion est prêt. Nous passons en Phase 1 : Diagnostic de la Barrière Cellulaire via Tre-en-en. Quelle est votre commande ?`
          : `[BIO-SYNC V8.5] Bienvenue. Je suis Coach José. Votre protocole de restauration biologique en 5 étapes commence maintenant. Analyse des membranes cellulaires en attente d'instruction.`;
        
        setMessages([{ id: 'welcome', role: 'model', parts: [{ text: welcomeText }], timestamp: new Date(), status: 'read' }]);
      }, 500);
    }
  }, [language, messages.length]);

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
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', parts: [{ text: finalInput || "[BIO-SCAN]" }], timestamp: new Date(), status: 'read' }]);
    setInput('');
    setIsLoading(true);
    
    if (currentStep < 5) setCurrentStep(prev => prev + 1);

    try {
      const stream = await generateJoseResponseStream(finalInput, messages, referralContext, language as Language, undefined, currentSubscriberId, selectedImage);
      setSelectedImage(null);
      
      let aiMsgId = 'ai_' + Date.now();
      let fullText = "";
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date(), status: 'sending' }]);

      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }

      voiceService.play(fullText, `msg_${aiMsgId}`, language as Language);

      if (fullText.toLowerCase().includes('shop') || fullText.toLowerCase().includes('boutique') || fullText.toLowerCase().includes('commander')) {
        setCurrentStep(5);
        onConversionDetected?.("Bénin", "Nutrition Cellulaire");
      }
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
        setSelectedImage({ data: (reader.result as string).split(',')[1], mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row h-full rounded-t-[4rem] border-x border-t overflow-hidden relative transition-all duration-1000 ${isFounderLink ? 'bg-black border-amber-500/40 shadow-[0_0_100px_rgba(255,215,0,0.1)]' : 'bg-[#020617] border-blue-500/20 shadow-2xl'}`}>
      
      <aside className={`hidden xl:flex w-88 flex-col border-r p-10 gap-12 shrink-0 relative overflow-y-auto no-scrollbar ${isFounderLink ? 'border-amber-500/20 bg-amber-950/10' : 'border-blue-500/10 bg-black/40'}`}>
        <div className="space-y-8">
           <div className={`w-24 h-24 rounded-[2.5rem] border flex items-center justify-center mx-auto relative group transition-all duration-700 ${isFounderLink ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_40px_rgba(255,215,0,0.3)]' : 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_30px_rgba(0,212,255,0.2)]'}`}>
              <Brain size={48} className="animate-pulse text-inherit" />
              <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-4 border-slate-950 flex items-center justify-center ${isFounderLink ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                <ShieldCheck size={14} className="text-slate-950" />
              </div>
           </div>
           <div className="text-center space-y-2">
              <h3 className="font-stark text-[9px] font-black uppercase tracking-[0.6em] opacity-40">Nexus Fusion Protocol</h3>
              <p className={`text-[12px] font-black uppercase tracking-[0.2em] italic ${isFounderLink ? 'text-amber-500' : 'text-blue-500'}`}>NEURAL CORE V8.5</p>
           </div>
        </div>

        <div className="space-y-6">
           {SYSTEM_CONFIG.ai.protocol.map((step, idx) => {
             const isActive = idx < currentStep;
             const isCurrent = idx === currentStep;
             return (
               <div key={idx} className={`flex items-start gap-5 transition-all duration-700 ${isActive || isCurrent ? 'opacity-100' : 'opacity-20'}`}>
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${isActive ? (isFounderLink ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'bg-blue-500 border-blue-500 text-slate-950') : isCurrent ? (isFounderLink ? 'border-amber-500 animate-pulse text-amber-500' : 'border-blue-500 animate-pulse text-blue-500') : 'border-white/10 text-slate-500'}`}>
                     {isActive ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <div className="space-y-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? (isFounderLink ? 'text-amber-500' : 'text-blue-500') : 'text-white'}`}>{step.split(':')[0]}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{step.split(':')[1]}</p>
                  </div>
               </div>
             );
           })}
        </div>

        <div className="mt-auto space-y-8">
           <div className="glass-card p-6 rounded-[2rem] border border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                 <span>Bio-Sync Confidence</span>
                 <span className={isFounderLink ? 'text-amber-500' : 'text-blue-400'}>99.8%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className={`h-full transition-all duration-1000 ${isFounderLink ? 'bg-amber-500 shadow-[0_0_15px_rgba(255,215,0,0.8)]' : 'bg-blue-500 shadow-[0_0_10px_#00d4ff]'}`} style={{ width: '99.8%' }}></div>
              </div>
           </div>
           <button onClick={() => window.open(referralContext?.shopUrl, '_blank')} className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 group transition-all ${isFounderLink ? 'bg-amber-500 text-slate-950 shadow-[0_0_40px_rgba(255,215,0,0.3)]' : 'bg-emerald-500 text-slate-950 shadow-2xl hover:scale-105 active:scale-95'}`}>
              <ShoppingCart size={18} /> 
              <span>NeoLife Official Shop</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-24 px-10 border-b border-white/5 bg-black/60 flex items-center justify-between shrink-0 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-[shimmer_5s_infinite]"></div>
           <div className="flex items-center gap-5">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isFounderLink ? 'bg-amber-500' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'}`}></div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] font-stark">Neural Channel Secured</span>
           </div>
           <div className="flex items-center gap-8">
              <div className="hidden sm:flex flex-col items-end">
                 <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Referral Node</span>
                 <span className={`text-[12px] font-bold uppercase italic ${isFounderLink ? 'text-amber-400' : 'text-white'}`}>{referralContext?.referrerName}</span>
              </div>
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Info size={20}/></button>
           </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-14 lg:px-20 pt-12 pb-56 space-y-16 no-scrollbar scroll-smooth">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-8 duration-700`}>
                <div className={`flex gap-8 w-full ${msg.role === 'user' ? 'max-w-[85%] flex-row-reverse' : 'max-w-full'}`}>
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border mt-1 shadow-3xl transition-transform hover:scale-110 ${msg.role === 'user' ? 'bg-slate-900 border-white/10' : (isFounderLink ? 'bg-amber-500/20 border-amber-500/40 text-amber-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400')}`}>
                      {msg.role === 'user' ? <Fingerprint size={28} className="text-slate-600" /> : <Bot size={32} />}
                   </div>
                   <div className={`space-y-6 w-full ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`text-lg md:text-xl font-light leading-relaxed tracking-tight whitespace-pre-line ${msg.role === 'user' ? 'text-blue-200 italic font-medium' : 'text-slate-100'}`}>
                         {msg.parts[0].text}
                      </div>
                      {msg.role === 'model' && (
                        <div className="flex gap-4">
                           <button onClick={() => voiceService.play(msg.parts[0].text, msg.id, language as Language)} className={`px-6 py-2.5 rounded-2xl border font-stark text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 transition-all ${voiceService.isCurrentlyReading(msg.id) ? (isFounderLink ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-[0_0_30px_rgba(255,215,0,0.5)]' : 'bg-blue-500 text-slate-950 border-blue-500 shadow-[0_0_20px_#00d4ff]') : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'}`}>
                              {voiceService.isCurrentlyReading(msg.id) ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                              Vocal Intel
                           </button>
                        </div>
                      )}
                   </div>
                </div>
             </div>
           ))}
           {isLoading && (
              <div className="flex items-center gap-6 p-10 bg-white/5 rounded-[3rem] border border-white/5 animate-pulse max-w-md shadow-3xl">
                 <div className="relative">
                   <Loader2 className={`animate-spin ${isFounderLink ? 'text-amber-500' : 'text-blue-500'}`} size={32} />
                   <div className={`absolute inset-0 blur-lg animate-pulse ${isFounderLink ? 'bg-amber-500/40' : 'bg-blue-500/40'}`}></div>
                 </div>
                 <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Synthesizing Stark Core Response...</p>
              </div>
           )}
        </div>

        <div className="absolute bottom-12 left-0 w-full px-10 pointer-events-none z-50">
           <div className={`max-w-5xl mx-auto glass-card rounded-[4rem] p-5 pointer-events-auto border shadow-[0_40px_120px_rgba(0,0,0,0.8)] flex flex-col gap-5 ${isFounderLink ? 'border-amber-500/40' : 'border-white/20'}`}>
              <div className="flex gap-4 overflow-x-auto no-scrollbar px-2 pb-1">
                 {[
                   { label: "Bio-Scan", prompt: "Lance mon Bio-Scan immédiat. Analyse ma barrière cellulaire.", icon: Microscope },
                   { label: "Loi des 37°C", prompt: "Explique l'importance de l'eau à 37°C pour ma vitalité.", icon: Activity },
                   { label: "Restauration Trio", prompt: "Détaille le protocole Trio de Relance NeoLife.", icon: HeartPulse },
                   { label: "Shop NeoLife", prompt: "Affiche mon lien de commande boutique officiel.", icon: ShoppingCart }
                 ].map((sug, i) => (
                    <button key={i} onClick={() => handleSend(sug.prompt)} className="shrink-0 px-6 py-3 bg-white/5 border border-white/5 rounded-full flex items-center gap-3 hover:bg-white/15 transition-all group">
                       <sug.icon size={14} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{sug.label}</span>
                    </button>
                 ))}
              </div>
              <div className={`flex items-center gap-5 bg-black/70 rounded-[2.5rem] border px-10 focus-within:border-blue-500/50 transition-all ${isFounderLink ? 'border-amber-500/30' : 'border-white/10'}`}>
                 <button onClick={() => fileInputRef.current?.click()} className="p-4 text-slate-500 hover:text-blue-400 transition-all hover:scale-110"><ImageIcon size={26}/></button>
                 <input type="file" ref={fileInputRef} hidden onChange={handleImageUpload} accept="image/*" />
                 <input 
                    type="text" 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Initialiser commande neurale Stark..." 
                    className="flex-1 bg-transparent border-none text-white outline-none font-bold text-lg italic py-8 placeholder:text-slate-800"
                 />
                 <button onClick={() => handleSend()} disabled={isLoading} className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isFounderLink ? 'bg-amber-500 text-slate-950 shadow-[0_0_30px_rgba(255,215,0,0.5)]' : 'bg-blue-500 text-slate-950 shadow-2xl hover:scale-110 active:scale-90'}`}>
                    <Command size={28} />
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};
