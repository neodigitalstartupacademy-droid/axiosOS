
import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Navigation, Search, Activity, Loader2, Star, Zap, ChevronRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { SYSTEM_CONFIG } from '../constants';
import { generateLocationInsight } from '../services/geminiService';

export const HubLocator: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [nearbyHubs, setNearbyHubs] = useState<any[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
          calculateDistances(coords.lat, coords.lng);
        },
        (err) => {
          setLocError("L'accès à la position est requis pour le radar Geo-Stark.");
        }
      );
    }
  }, []);

  const calculateDistances = (lat: number, lng: number) => {
    const hubs = SYSTEM_CONFIG.global_hubs.map(hub => {
      const d = getDistance(lat, lng, hub.lat, hub.lng);
      return { ...hub, distance: d };
    });
    setNearbyHubs(hubs.sort((a, b) => a.distance - b.distance));
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getAILocationAdvice = async () => {
    if (!userLocation) return;
    setIsSearching(true);
    try {
      const insight = await generateLocationInsight("Où est le Hub NDSA le plus proche et comment s'y rendre ?", userLocation.lat, userLocation.lng);
      setAiInsight(insight.text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <header className="px-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
            <Globe className="animate-spin-slow" size={24} />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 font-stark">Nexus Geo-Intelligence</h2>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Hub <span className="text-blue-500">Locator</span></h1>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hubs Radar List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-8 rounded-[3rem] border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                <Activity size={16} className="text-blue-400" /> Active Sectors
              </h3>
              {userLocation && (
                <div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                  Position Synchronisée
                </div>
              )}
            </div>

            <div className="space-y-4">
              {nearbyHubs.map((hub, i) => (
                <div key={i} className={`p-6 bg-slate-900/60 border rounded-3xl flex items-center justify-between transition-all group ${hub.distance < 15 ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/5'}`}>
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-xl italic transition-all ${hub.distance < 15 ? 'bg-emerald-500 text-slate-950 border-emerald-500' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                      {hub.city[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">{hub.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{hub.address}, {hub.city}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`text-xl font-stark font-black ${hub.distance < 15 ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {hub.distance.toFixed(1)}
                      </span>
                      <span className="text-[10px] font-black text-slate-600 uppercase">KM</span>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hub.lat},${hub.lng}`} 
                      target="_blank" 
                      className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white flex items-center gap-2 justify-end"
                    >
                      Navigation <Navigation size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Geo-Intelligence */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-10 rounded-[3.5rem] border border-blue-500/20 bg-blue-500/5 space-y-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px]"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <Zap className="text-blue-400" size={24} />
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Stark Geo-Advisor</h3>
            </div>

            {aiInsight ? (
              <div className="p-6 bg-black/40 rounded-3xl border border-white/10 text-slate-300 text-sm italic leading-relaxed animate-in slide-in-from-bottom-4 duration-500">
                {aiInsight}
                <button onClick={() => setAiInsight(null)} className="mt-6 w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Clear Intel</button>
              </div>
            ) : (
              <div className="space-y-6 relative z-10">
                <p className="text-slate-400 text-sm font-medium italic leading-relaxed">
                  "Utilisez la puissance de Gemini 2.5 Flash pour analyser votre environnement et trouver les centres de santé NeoLife certifiés NDSA les plus pertinents."
                </p>
                <button 
                  onClick={getAILocationAdvice}
                  disabled={isSearching || !userLocation}
                  className="w-full py-6 bg-blue-500 text-slate-950 font-black rounded-3xl uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all"
                >
                  {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  {isSearching ? "ANALYSE GPS..." : "COMMANDER ANALYSE PROXIMITÉ"}
                </button>
              </div>
            )}

            <div className="pt-8 border-t border-white/5 space-y-4">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Souveraineté des Données</span>
               </div>
               <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest leading-relaxed">
                 Votre position n'est utilisée que pour le calcul local du radar et les requêtes spécifiques à Gemini Maps.
               </p>
            </div>
          </div>

          {/* Proximity Alert Prototype */}
          <div className="p-8 rounded-[3rem] border border-amber-500/30 bg-amber-500/5 flex items-center gap-6">
             <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-500">
                <Star size={24} className="animate-pulse" />
             </div>
             <div>
                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Proximity Trigger Status</h4>
                <p className="text-xs font-bold text-white italic">"Enabled : SCANNING FOR ELITE HUBS..."</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
