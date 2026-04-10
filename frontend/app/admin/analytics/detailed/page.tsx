"use client"

import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  Users, 
  CreditCard, 
  Globe, 
  Shield, 
  Zap, 
  MoreHorizontal,
  Download,
  Filter,
  Layers,
  Activity,
  Maximize2,
  Cpu,
  Database,
  Globe2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function DetailedPlatformAnalytics() {
  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                 <Layers className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Granular Data Layer Analysis v4.0</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none italic">
             Data <span className="text-primary tracking-normal">Layers</span> Matrix
           </h1>
           <p className="text-muted-foreground text-sm mt-4 font-medium max-w-lg leading-relaxed italic opacity-80">
             Multi-dimensional telemetry across edge clusters, including shard-level revenue sharding and security vector analysis.
           </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <button className="h-14 px-8 bg-card border border-border rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground hover:shadow-xl transition-all shadow-sm active:scale-95">
              <Filter className="h-4 w-4 text-primary" />
              Advanced Filters
           </button>
           <button className="h-14 px-10 bg-primary hover:bg-emerald-600 text-primary-foreground rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
              <Maximize2 className="h-4 w-4" />
              Fullscreen
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: "Merchant Shard-01", status: "Active", throughput: "4.2 GB/s", mrr: "₹12.5M", color: "primary" },
           { label: "Merchant Shard-02", status: "Active", throughput: "3.8 GB/s", mrr: "₹11.2M", color: "primary" },
           { label: "Merchant Shard-03", status: "High Load", throughput: "6.1 GB/s", mrr: "₹18.4M", color: "orange" },
           { label: "Merchant Shard-04", status: "Active", throughput: "2.5 GB/s", mrr: "₹6.8M", color: "primary" },
         ].map((shard, i) => (
           <Card key={i} className="p-8 bg-card border-border/50 shadow-xl rounded-[2.5rem] hover:shadow-2xl hover:border-primary/30 transition-all group relative overflow-hidden">
              <div className="absolute right-0 top-0 p-6 opacity-[0.03] group-hover:rotate-12 transition-transform">
                 <Layers className="h-16 w-16 text-primary" />
              </div>
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="h-12 w-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Database className="h-6 w-6" />
                 </div>
                 <span className={cn(
                   "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm",
                   shard.status === 'High Load' ? "bg-orange-500 text-white" : "bg-emerald-500 text-white shadow-emerald-500/20"
                 )}>{shard.status}</span>
              </div>
              <h4 className="text-lg font-black text-foreground tracking-tighter uppercase mb-6 italic leading-none">{shard.label}</h4>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/20 relative z-10">
                 <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Throughput</p>
                    <p className="text-base font-black text-foreground tabular-nums tracking-tighter leading-none">{shard.throughput}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">MRR Shard</p>
                    <p className="text-base font-black text-primary italic leading-none">{shard.mrr}</p>
                 </div>
              </div>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Load Balance Chart */}
         <Card className="lg:col-span-8 p-12 bg-card border-border/50 shadow-2xl rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
               <Cpu className="h-48 w-48 text-primary" />
            </div>
            
            <div className="flex items-center justify-between mb-16 relative z-10">
               <div>
                  <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase italic leading-none mb-2">Platform Load Matrix</h3>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">Real-time mesh balancing across 12 kernel nodes.</p>
               </div>
               <div className="flex gap-6">
                  <div className="flex items-center gap-3">
                     <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_8px_rgba(5,148,103,1)]" />
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">PROD BUCKET</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="h-3 w-3 rounded-full bg-muted border border-border" />
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">STAGE BUCKET</span>
                  </div>
               </div>
            </div>

            <div className="h-[450px] flex items-center justify-around gap-4 px-10 relative z-10">
               {[65, 45, 80, 55, 30, 90, 70, 40, 60, 85, 50, 75].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-5 group cursor-help h-full justify-end">
                    <div className="w-full bg-muted border border-border rounded-full h-full relative overflow-hidden shadow-inner">
                       <div 
                        className={cn(
                          "absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 group-hover:opacity-100 opacity-60 shadow-lg",
                          h > 80 ? "bg-orange-500 shadow-orange-500/20" : "bg-primary shadow-primary/20"
                        )} 
                        style={{ height: `${h}%` }} 
                       >
                          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-t from-transparent to-white/20" />
                       </div>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity tracking-widest">N-0{i+1}</span>
                 </div>
               ))}
            </div>
         </Card>

         {/* Security Perimeter Hub */}
         <Card className="lg:col-span-4 p-10 bg-slate-950 border border-border shadow-[0_40px_80px_rgba(0,0,0,0.15)] rounded-[3rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent pointer-events-none" />
            <Globe2 className="absolute -bottom-16 -right-16 h-64 w-64 text-red-500 opacity-5 transition-transform group-hover:rotate-12 duration-1000" />
            
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4 mb-12 relative z-10">
               <Shield className="h-7 w-7 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
               Security Perimeter
            </h3>
            
            <div className="space-y-8 relative z-10">
               <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative shadow-2xl">
                  <Activity className="absolute top-6 right-6 h-6 w-6 text-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 opacity-60">DDoS Mitigation Layer</p>
                  <p className="text-3xl font-black text-white tracking-tighter italic">ACTIVE THREATS</p>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed font-medium">WAF layer filtering 12.4k malicious probes across Asian infrastructure clusters.</p>
               </div>

               <div className="space-y-5">
                  {[
                    { city: "Frankfurt", risk: "Low", load: "12%" },
                    { city: "Singapore", risk: "Medium", load: "45%" },
                    { city: "New York", risk: "Low", load: "08%" },
                  ].map((node, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{node.city} Shard</span>
                       <div className="flex items-center gap-5">
                          <span className={cn("text-[9px] font-black uppercase tracking-widest", node.risk === 'Medium' ? "text-orange-500" : "text-emerald-500")}>{node.risk} Risk</span>
                          <span className="text-xs font-black text-white tabular-nums">{node.load}</span>
                       </div>
                    </div>
                  ))}
               </div>

               <button className="w-full mt-6 h-14 rounded-2xl bg-white/5 text-white/60 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all border border-white/10 shadow-xl active:scale-95">Open Global Threat Map</button>
            </div>
         </Card>
      </div>
    </div>
  )
}
