
import React from 'react';
import { Cpu, DollarSign, Activity, Terminal } from 'lucide-react';
import { AdminMonitorStats } from '../types';

interface AdminMonitorProps {
  stats: AdminMonitorStats;
}

export const AdminMonitor: React.FC<AdminMonitorProps> = ({ stats }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "SaaS Revenue", val: `$${stats.totalNetSaaS}`, icon: DollarSign, color: "text-emerald-500" },
          { label: "AI Efficiency", val: `${stats.aiEffectiveness}%`, icon: Cpu, color: "text-blue-500" },
          { label: "Orphan Leads", val: stats.orphanLeadsCount, icon: Activity, color: "text-rose-500" },
          { label: "Active Hubs", val: stats.totalActiveHubs, icon: Terminal, color: "text-amber-500" }
        ].map((s, i) => (
          <div key={i} className="glass-card p-10 rounded-3xl border border-white/5 space-y-4">
            <s.icon className={s.color} size={32} />
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
              <h4 className="text-3xl font-black font-stark">{s.val}</h4>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-card p-12 rounded-[3rem] border border-white/5">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">System Telemetry</h3>
        <div className="h-64 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700 animate-pulse">Monitoring Global Signal...</p>
        </div>
      </div>
    </div>
  );
};
