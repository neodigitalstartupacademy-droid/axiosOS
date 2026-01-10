
import React, { useState, useRef, useEffect } from 'react';
import { generateJoseResponseStream } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { Message, Language, AIPersona, ReferralContext } from '../types'; 
import { SYSTEM_CONFIG, I18N as I18N_CONST } from '../constants';
import { jsPDF } from 'jspdf';
import { 
  Send, Bot, Play, Square, User, Image as ImageIcon, Microscope, FlaskConical, Rocket, HelpCircle, 
  ChevronRight, Activity, Headphones, Sparkles, Zap, Brain, ThermometerSnowflake, Droplets, 
  Terminal, Cpu, ShieldCheck, BarChart3, Fingerprint, Layers, Download, FileText
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

  const suggestions = [
    { label: "Protocole de nutrition celullaire", prompt: "Explique-moi le Protocole de Nutrition Cellulaire NDSA étape par étape pour restaurer ma vitalité.", icon: FlaskConical },
    { label: "Opportunité digital", prompt: "Comment l'opportunité digitale NDSA peut-elle transformer mes revenus et mon futur ?", icon: Rocket },
    { label: "loi 37 degré", prompt: "Explique-moi l'importance vitale de la loi des 37 degrés et le danger des boissons glacées pour mes cellules.", icon: ThermometerSnowflake },
    { label: "MLM Digital", prompt: "Comment fonctionne le MLM Digital avec l'IA José et le partenariat NeoLife ?", icon: Zap },
  ];

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
      const welcomeText = `Protocoles de Restauration Biologique initialisés. Je suis JOSÉ, votre interface neurale de succès. ✨\n\nPrêt pour la synchronisation cellulaire ?`;
      setMessages([{ 
        id: 'welcome', 
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
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading]);

  const handleExportConversation = () => {
    if (messages.length === 0) return;

    const doc = new jsPDF();
    const margin = 20;
    let y = 30;

    // Header Stark Design
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(0, 212, 255); 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("JOSÉ IMPERIUM 2026", margin, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("ARCHIVE DE RESTAURATION BIOLOGIQUE - NDSA", margin, 32);
    doc.setFont("helvetica", "italic");
    doc.text(`SESSION : ${new Date().toLocaleString()} | ID : ${currentSubscriberId || 'GUEST'}`, margin, 38);

    y = 65;
    messages.forEach((msg) => {
        const isUser = msg.role === 'user';
        
        // Role Tag
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(isUser ? 100 : 0, 100, isUser ? 255 : 255);
        doc.text(isUser ? "UTILISATEUR :" : "JOSÉ IMPERIUM :", margin, y);
        y += 6;

        // Content
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(11);
        const splitText = doc.splitTextToSize(msg.parts[0].text, 170);
        
        if (y + (splitText.length * 6) > 280) {
            doc.addPage();
            y = 20;
        }
        
        doc.text(splitText, margin, y);
        y += (splitText.length * 6) + 12;
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Propulsé par NDSA GMBC OS - Protection AXIOMA. Page ${i} sur ${pageCount}`, margin, 285);
    }

    doc.save(`Rapport_NDSA_${Date.now()}.pdf`);
  };

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
    } catch (error) {
      console.error(error);
      setIsScanning(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden font-sans">
      
      {/* 1. PANNEAU DE GAUCHE : BIO-SYNC TELEMETRY */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-black/20 backdrop-blur-3xl p-6 gap-8">
        <div className="flex flex-col items-center gap-4 py-6 border-b border-white/5">
          <div className="w-20 h-20 rounded-[2rem] bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.1)]">
            <Cpu className="text-[#00d4ff]" size={36} />
          </div>
          <div className="text-center">
            <h3 className="font-stark text-xs font-black tracking-[0.3em] uppercase">Core Bio-Sync</h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Status: Stable</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cell Absorption</span>
                <span className="text-[10px] font-black text-[#00d4ff]">98.4%</span>
             </div>
             <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#00d4ff] w-[98%] shadow-[0_0_10px_#00d4ff]"></div>
             </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Duplication</span>
                <span className="text-[10px] font-black text-emerald-400">Active</span>
             </div>
             <div className="flex gap-1 h-8 items-end justify-center">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 bg-emerald-500/30 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                ))}
             </div>
          </div>
        </div>

        <div className="mt-auto space-y-4">
           <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <p className="text-[9px] font-bold text-amber-500 leading-relaxed uppercase tracking-widest italic">
                "La Loi des 37°C est votre bouclier biologique. Ne le brisez jamais."
              </p>
           </div>
           <div className="flex items-center gap-3 px-2">
              <Fingerprint size={14} className="text-slate-700" />
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">v7.8.0-IMPERIUM</span>
           </div>
        </div>
      </aside>

      {/* 2. NEXUS CENTRAL : CHAT IMMERSIF */}
      <main className="flex-1 flex flex-col relative bg-gradient-to-b from-black/20 to-transparent">
        
        {/* HEADER DE LECTURE */}
        <div className="h-24 px-12 border-b border-white/5 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <div className="w-3 h-3 rounded-full bg-[#00d4ff] animate-pulse shadow-[0_0_15px_#00d4ff]"></div>
            <h2 className="font-stark text-sm font-black text-white uppercase tracking-[0.6em] italic">Neural Nexus</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {messages.length > 0 && (
              <button 
                onClick={handleExportConversation}
                className="flex items-center gap-3 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]/30 transition-all group"
              >
                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> 
                Export Session
              </button>
            )}

            {activeSpeechKey && (
              <div className="flex items-center gap-6 animate-in slide-in-from-top duration-500">
                <div className="flex items-end gap-1 h-5">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-0.5 bg-[#00d4ff] rounded-full animate-[wave_1s_infinite_ease-in-out]" style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
                <button onClick={() => voiceService.stop()} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">
                  <Square size={14} fill="currentColor" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ZONE DE LECTURE */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-24 py-16 space-y-24 no-scrollbar scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-8 duration-700`}>
              <div className={`flex gap-10 w-full ${msg.role === 'user' ? 'max-w-[75%] flex-row-reverse' : 'max-w-full'}`}>
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border mt-2 shadow-2xl transition-all duration-500 ${msg.role === 'user' ? 'bg-slate-900 border-white/5' : 'bg-[#00d4ff]/10 border-[#00d4ff]/20 shadow-[#00d4ff]/10'}`}>
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
                        className={`flex items-center gap-4 px-6 py-2.5 rounded-xl border font-stark text-[10px] font-black uppercase tracking-[0.2em] transition-all ${voiceService.isCurrentlyReading(`msg_${msg.id}`) ? 'bg-[#00d4ff] text-slate-950 border-[#00d4ff] shadow-lg' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'}`}
                      >
                        {voiceService.isCurrentlyReading(`msg_${msg.id}`) ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                        {voiceService.isCurrentlyReading(`msg_${msg.id}`) ? "SYNTHÈSE..." : "AUDIO"}
                      </button>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start py-8">
              <div className="flex gap-10 items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#00d4ff]/5 border border-[#00d4ff]/20 flex items-center justify-center animate-pulse"><Bot size={24} className="text-[#00d4ff]/30" /></div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div className="h-[40vh] pointer-events-none"></div>
        </div>

        {/* DOCK NEURAL FLOTTANT */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-40">
           <div className="glass-card rounded-[3rem] border border-white/10 p-4 shadow-3xl bg-slate-900/60 flex flex-col gap-4">
              
              {/* SUGGESTIONS CHIPS */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2 border-b border-white/5 mb-2">
                 {suggestions.map((sug, i) => (
                   <button key={i} onClick={() => handleSend(sug.prompt)} className="shrink-0 px-5 py-2.5 bg-white/5 border border-white/5 rounded-full flex items-center gap-3 hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]/30 transition-all group">
                      <sug.icon size={12} className="text-slate-500 group-hover:text-[#00d4ff]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">{sug.label}</span>
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
                    placeholder="Échangez avec Coach JOSÉ..." 
                    className="w-full bg-transparent border-none text-white placeholder-slate-700 outline-none font-medium text-lg italic resize-none py-4 leading-tight no-scrollbar max-h-32"
                    rows={1}
                  />
                  {selectedImage && (
                    <div className="absolute -top-16 left-0 bg-[#00d4ff] text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 animate-bounce">
                       <ImageIcon size={12} /> Image prête
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

      {/* 3. PILIER DE COMMANDE (DROITE) */}
      <aside className="hidden xl:flex w-96 flex-col border-l border-white/5 bg-slate-900/40 backdrop-blur-3xl p-10 gap-10 overflow-y-auto no-scrollbar shadow-[-20px_0_50px_rgba(0,0,0,0.3)]">
        
        <div className="space-y-6">
           <h3 className="font-stark text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] italic px-2">Active Protocols</h3>
           <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Protocole NDSA', icon: FlaskConical, color: 'text-emerald-400', bg: 'bg-emerald-500/10', intent: 'protocol' },
                { label: 'Expansion Empire', icon: Rocket, color: 'text-blue-400', bg: 'bg-blue-500/10', intent: 'business' },
                { label: 'Bio-Psychiatrie', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10', intent: 'general' }
              ].map((tool, i) => (
                <button key={i} onClick={() => handleSend(SYSTEM_CONFIG.academy.modules[0].lessons[0].content)} className={`w-full p-6 ${tool.bg} border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-[#00d4ff]/30 hover:scale-102 transition-all shadow-xl`}>
                   <div className="flex items-center gap-5">
                      <tool.icon size={20} className={tool.color} />
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{tool.label}</span>
                   </div>
                   <ChevronRight size={16} className="text-slate-800 group-hover:text-white" />
                </button>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="font-stark text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] italic px-2">Neural Terminal</h3>
           <div className="bg-black/40 rounded-[3rem] p-8 border border-white/5 space-y-6">
              <div className="flex items-center gap-4 text-emerald-500">
                 <ShieldCheck size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Axioma Secured</span>
              </div>
              <p className="text-[11px] text-slate-500 italic leading-relaxed font-medium">
                Toutes les données cliniques sont traitées via le noyau neural chiffré. Vos bio-logs sont stockés localement.
              </p>
              <div className="h-px bg-white/5"></div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Activity size={14} className="text-[#00d4ff]" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sponsor Connection</span>
                 </div>
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
           </div>
        </div>

        {referralContext && (
           <div className="mt-auto bg-[#00d4ff]/5 p-6 rounded-[2.5rem] border border-[#00d4ff]/20 flex items-center justify-between shadow-inner group">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-[#00d4ff] shrink-0 border border-white/5"><User size={20} /></div>
                <div className="truncate">
                   <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Referrer Account</p>
                   <p className="text-[10px] font-black text-white italic truncate tracking-tight">{referralContext.referrerName}</p>
                </div>
              </div>
              <Sparkles size={16} className="text-[#00d4ff]/20 group-hover:text-[#00d4ff] transition-all" />
           </div>
        )}
      </aside>

      {/* OVERLAY DE SCAN */}
      {isScanning && (
        <div className="absolute inset-0 z-[500] bg-black/95 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-1000">
           <div className="text-center space-y-16">
              <div className="relative inline-block">
                <Microscope size={160} className="text-[#00d4ff] mx-auto animate-pulse" />
                <div className="absolute inset-x-0 -bottom-10 h-2 bg-[#00d4ff] shadow-[0_0_80px_#00d4ff] animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
              <p className="font-stark text-[#00d4ff] font-black uppercase tracking-[1.5em] text-sm animate-pulse italic">Neural Analysis Active...</p>
           </div>
        </div>
      )}
    </div>
  );
};
