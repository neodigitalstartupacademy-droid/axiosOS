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
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[350px] md:h-[500px] w-full glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-[#FFD700]/10 flex flex-col relative overflow-hidden group">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 relative z-10">
        <div className="space-y-1 md:space-y-2">
          <div className="flex items-center gap-3 text-[#FFD700]">
            <Activity size={16} className="animate-pulse" />
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] font-stark">Neural Sync Hub</h3>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter uppercase">Stark <span className="text-[#FFD700]">Momentum</span></h2>
        </div>
        
        <div className="flex gap-6 md:gap-8 mt-4 md:mt-0">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Efficiency</span>
              <span className="text-xl md:text-2xl font-stark font-black text-emerald-400">99.4%</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Core Version</span>
              <span className="text-xl md:text-2xl font-stark font-black text-[#FFD700]">V8.5</span>
           </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 215, 0, 0.05)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 8, fill: '#64748b', fontWeight: 900, fontFamily: 'Orbitron'}} 
              dy={10}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              cursor={{ stroke: '#FFD700', strokeWidth: 1 }}
              contentStyle={{ 
                backgroundColor: 'rgba(2, 6, 23, 0.95)',
                borderRadius: '12px', 
                border: '1px solid rgba(255, 215, 0, 0.2)', 
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontFamily: 'Orbitron',
                fontSize: '10px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="activity" 
              stroke="#FFD700" 
              fillOpacity={1} 
              fill="url(#colorActivity)" 
              strokeWidth={2} 
              dot={{ r: 3, fill: '#FFD700', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#fff', stroke: '#FFD700', strokeWidth: 2 }}
              animationDuration={1000} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 relative z-10">
         {[
           { label: 'Latency', val: '7ms', icon: Zap, color: 'text-[#FFD700]' },
           { label: 'Growth', val: '+12%', icon: TrendingUp, color: 'text-emerald-400' },
           { label: 'Sync', val: 'Global', icon: Cpu, color: 'text-blue-400' },
           { label: 'Status', val: 'Secure', icon: Activity, color: 'text-emerald-500' },
         ].map((item, i) => (
           <div key={i} className="p-2 md:p-3 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 transition-colors hover:bg-white/10">
              <item.icon size={12} className={item.color} />
              <div>
                <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{item.label}</p>
                <p className="text-[9px] md:text-xs font-stark font-bold text-white mt-1 uppercase">{item.val}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};