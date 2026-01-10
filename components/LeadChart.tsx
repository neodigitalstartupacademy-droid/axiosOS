
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, TrendingUp, Cpu } from 'lucide-react';

const initialData = [
  { name: '08:00', activity: 65 },
  { name: '10:00', activity: 85 },
  { name: '12:00', activity: 70 },
  { name: '14:00', activity: 95 },
  { name: '16:00', activity: 80 },
  { name: '18:00', activity: 110 },
  { name: '20:00', activity: 130 },
];

export const LeadChart: React.FC = () => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const last = { ...newData[newData.length - 1] };
        last.activity += Math.floor(Math.random() * 10) - 5;
        if (last.activity < 0) last.activity = 10;
        newData[newData.length - 1] = last;
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[500px] w-full glass-card p-10 rounded-[3rem] border border-blue-500/20 flex flex-col relative overflow-hidden group">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00d4ff 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[#00d4ff]">
            <Activity size={18} className="animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] font-stark">Neural Telemetry Hub</h3>
          </div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Bio-Sync <span className="text-blue-500">Momentum</span></h2>
        </div>
        
        <div className="flex gap-8 mt-6 md:mt-0">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Efficiency</span>
              <span className="text-2xl font-stark font-black text-emerald-400">98.4%</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Core</span>
              <span className="text-2xl font-stark font-black text-blue-400">V8.0</span>
           </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 212, 255, 0.1)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fill: '#64748b', fontWeight: 900, fontFamily: 'Orbitron'}} 
              dy={15}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              cursor={{ stroke: '#00d4ff', strokeWidth: 1 }}
              contentStyle={{ 
                backgroundColor: 'rgba(2, 6, 23, 0.95)',
                borderRadius: '15px', 
                border: '1px solid rgba(0, 212, 255, 0.3)', 
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontFamily: 'Orbitron',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="activity" 
              stroke="#00d4ff" 
              fillOpacity={1} 
              fill="url(#colorActivity)" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#00d4ff', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#fff', stroke: '#00d4ff', strokeWidth: 2 }}
              animationDuration={1500} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
         {[
           { label: 'Latency', val: '14ms', icon: Zap, color: 'text-blue-400' },
           { label: 'Probability', val: '92%', icon: TrendingUp, color: 'text-emerald-400' },
           { label: 'Sync Rate', val: 'Global', icon: Cpu, color: 'text-purple-400' },
           { label: 'Stability', val: 'Secure', icon: Activity, color: 'text-amber-400' },
         ].map((item, i) => (
           <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
              <item.icon size={14} className={item.color} />
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{item.label}</p>
                <p className="text-xs font-stark font-bold text-white mt-1 uppercase">{item.val}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
