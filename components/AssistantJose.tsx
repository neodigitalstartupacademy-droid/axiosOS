import React, { useState, useRef, useEffect } from 'react';
import { generateJoseResponseStream, generateStarkVisual, generateJoseAudio, decodeBase64, decodeAudioData } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { referralService } from '../services/referralService';
import { Message, Language, ReferralContext } from '../types'; 
import { SYSTEM_CONFIG } from '../constants';
import { 
  Bot, Play, Square, Image as ImageIcon, Microscope, Activity, 
  Loader2, Zap, Brain, Command, HeartPulse, ShieldCheck, 
  ShoppingCart, Sparkles, Fingerprint, Info, CheckCircle2, Wand2, Star, Volume2
} from 'lucide-react';

export const AssistantJose: React.FC<{language?: Language, onConversionDetected?: (c: string, f: string) => void}> = ({ language = 'fr', onConversionDetected }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [referralContext, setReferralContext] = useState<ReferralContext | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const context = referralService.getStoredReferral();
    setReferralContext(context);

    if (messages.length === 0) {
      const welcomeText = context 
        ? `[STARK SYNC] Bienvenue ! Je suis Coach Jose. Votre Expert NDSA ${context.referrerName} m'a demande de preparer votre diagnostic de restauration biologique. Par quoi commencons-nous ?`
        : `[ZENITH V9.5] Bonjour ! Je suis Jose. Pret pour votre diagnostic de souverainete biologique ? Commencons par analyser vos priorites de sante.`;
      
      setMessages([{ 
        id: 'welcome', 
        role: 'model', 
        parts: [{ text: welcomeText }], 
        timestamp: new Date() 
      }]);
      voiceService.play(welcomeText, 'welcome');
    }
  }, [messages.length]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, isGeneratingImage]);

  const handleSend = async (text?: string) => {
    const finalInput = text || input;
    if (!finalInput.trim() && !selectedImage || isLoading) return;
    
    voiceService.stop();
    setMessages(prev => [...prev, { id: 'in_'+Date.now(), role: 'user', parts: [{ text: finalInput || "[ANALYSE VISUELLE]" }], timestamp: new Date() }]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await generateJoseResponseStream(finalInput, messages, referralContext, language as Language);
      let fullText = "";
      const aiMsgId = 'ai_'+Date.now();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', parts: [{ text: "" }], timestamp: new Date() }]);

      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, parts: [{ text: fullText }] } : m));
      }
      
      // LOGIQUE DE CLOSING INTELLIGENTE
      if (fullText.toLowerCase().includes("commander") || fullText.toLowerCase().includes("boutique") || fullText.toLowerCase().includes("neolife")) {
        onConversionDetected?.("Lead Sync", "Closing en cours");
        referralService.notifySponsor("Visiteur Actif", "Closing via Jose");
      }

      voiceService.play(fullText, aiMsgId);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[85vh] rounded-[3rem] border border-white/5 bg-[#020617] overflow-hidden relative shadow-3xl">
      {/* Visual Indicator of Connection */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full z-20">
         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
         <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Signal Furtif Certifie ASCII</span>
      </div>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-12 pt-16 pb-48 space-y-12 no-scrollbar">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                <div className={`flex gap-6 w-full ${msg.role === 'user' ? 'max-w-[80%] flex-row-reverse' : 'max-w-full'}`}>
                   <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-blue-500/10 border-blue-500/20'}`}>
                      {msg.role === 'user' ? <Fingerprint size={24} className="text-slate-500" /> : <Bot size={24} className="text-blue-400" />}
                   </div>
                   <div className="space-y-4">
                      {msg.image && (
                        <div className="rounded-3xl border-4 border-amber-500/30 overflow-hidden shadow-2xl max-w-lg">
                           <img src={msg.image} alt="Stark Visual" className="w-full h-auto" />
                        </div>
                      )}
                      <div className={`p-6 rounded-3xl ${msg.role === 'user' ? 'bg-blue-600/10 border border-blue-500/20' : 'bg-slate-900/40 border border-white/5'}`}>
                        <p className={`text-lg leading-relaxed ${msg.role === 'user' ? 'text-blue-300 italic' : 'text-slate-100'}`}>{msg.parts[0].text}</p>
                        {msg.role === 'model' && (
                          <div className="mt-4 flex items-center gap-4">
                             <button onClick={() => voiceService.play(msg.parts[0].text, msg.id)} className={`p-2 rounded-lg transition-all ${voiceService.isCurrentlyReading(msg.id) ? 'bg-blue-500 text-slate-900' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
                                {voiceService.isCurrentlyReading(msg.id) ? <Square size={14} /> : <Volume2 size={14} />}
                             </button>
                             {referralContext?.shopUrl && (msg.parts[0].text.toLowerCase().includes("neolife") || msg.parts[0].text.toLowerCase().includes("boutique")) && (
                               <a href={referralContext.shopUrl} target="_blank" className="flex items-center gap-2 px-4 py-1.5 bg-amber-500 text-slate-950 rounded-lg text-[9px] font-black uppercase tracking-widest hover:brightness-110">
                                 Acces Boutique <ShoppingCart size={12} />
                               </a>
                             )}
                          </div>
                        )}
                      </div>
                   </div>
                </div>
             </div>
           ))}
           {isLoading && (
              <div className="flex items-center gap-4 p-6 bg-blue-500/10 rounded-3xl border border-blue-500/20 animate-pulse max-w-sm">
                 <Loader2 className="animate-spin text-blue-500" size={24} />
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Analyse Neurale V9.5...</p>
              </div>
           )}
        </div>

        <div className="absolute bottom-8 left-0 w-full px-6 md:px-12 pointer-events-none">
           <div className="max-w-4xl mx-auto glass-card rounded-[2.5rem] p-4 pointer-events-auto shadow-2xl border border-white/10 flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-black/60 rounded-2xl border border-white/5 px-6">
                 <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 hover:text-blue-400"><ImageIcon size={22}/></button>
                 <input type="file" ref={fileInputRef} hidden onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const r = new FileReader();
                      r.onload = () => setSelectedImage({ data: (r.result as string).split(',')[1], mimeType: file.type });
                      r.readAsDataURL(file);
                    }
                 }} />
                 <input 
                    type="text" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Posez votre question a Jose..." 
                    className="flex-1 bg-transparent border-none text-white outline-none font-bold text-lg py-6 italic"
                 />
                 <div className="flex gap-2">
                    <button onClick={handleSend} className="w-12 h-12 bg-blue-500 text-black rounded-xl flex items-center justify-center hover:scale-110 transition-all">
                       <Command size={20} />
                    </button>
                 </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                 <div className="flex items-center gap-2">
                    <Star size={10} className="text-amber-500 fill-current" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Standard Bio-Stark V9.5</span>
                 </div>
                 {referralContext && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                       <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Sponsor: {referralContext.referrerName}</span>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};