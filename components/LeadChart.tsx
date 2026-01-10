
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const initialData = [
  { name: 'Lun', leads: 4, clicks: 12 },
  { name: 'Mar', leads: 7, clicks: 25 },
  { name: 'Mer', leads: 5, clicks: 18 },
  { name: 'Jeu', leads: 12, clicks: 40 },
  { name: 'Ven', leads: 9, clicks: 35 },
  { name: 'Sam', leads: 15, clicks: 55 },
  { name: 'Dim', leads: 20, clicks: 80 },
];

export const LeadChart: React.FC = () => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const last = newData[newData.length - 1];
        // Simulation d'activité réseau légère
        last.clicks += Math.floor(Math.random() * 3);
        if (Math.random() > 0.8) last.leads += 1;
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[550px] w-full glass-card p-14 rounded-[5rem] border border-white/5 flex flex-col min-w-0 shadow-3xl relative overflow-hidden group">
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#00d4ff]/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-[#00d4ff]/20 transition-all duration-[2s]"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 relative z-10 gap-6">
        <div>
          <h3 className="text-[11px] font-black text-[#00d4ff] uppercase tracking-[0.5em] italic mb-3">Live Telemetry</h3>
          <p className="text-4xl font-black text-white tracking-tighter uppercase italic">Bio-Sync Momentum</p>
        </div>
        <div className="flex gap-10">
           <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00d4ff] shadow-[0_0_15px_#00d4ff] animate-pulse"></div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Network Clicks</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399]"></div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Bio-Sync Leads</span>
           </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 11, fill: '#64748b', fontWeight: 900, fontFamily: 'Orbitron'}} 
              dy={25}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ stroke: 'rgba(0,212,255,0.2)', strokeWidth: 2 }}
              contentStyle={{ 
                backgroundColor: 'rgba(1,4,9,0.95)',
                borderRadius: '32px', 
                border: '1px solid rgba(0,212,255,0.3)', 
                boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                padding: '24px',
                backdropFilter: 'blur(20px)',
                color: '#fff',
                fontFamily: 'Inter'
              }}
            />
            <Area type="monotone" dataKey="clicks" stroke="#00d4ff" fillOpacity={1} fill="url(#colorClicks)" strokeWidth={3} animationDuration={1000} />
            <Area type="monotone" dataKey="leads" stroke="#10b981" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={4} animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
