"use client"

import { 
  Box, 
  Cpu, 
  Database, 
  Globe, 
  Zap, 
  Shield, 
  Terminal, 
  Activity, 
  Settings, 
  Server, 
  Network, 
  Lock,
  RefreshCw,
  Plus,
  Search,
  ChevronRight,
  MoreVertical,
  Layers,
  Container,
  ArrowRight,
  CheckCircle,
  CircleAlert,
  CircleX,
  CircleHelp,
  CircleCheckBig
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"

export default function InfrastructurePage() {
  const [activeRegion, setActiveRegion] = useState("all")

  const nodes = [
    { id: "EDGE-INDIA-01", type: "Core Cluster", status: "Healthy", load: "42%", uptime: "99.99%", region: "asia-south" },
    { id: "EDGE-USA-04", type: "Delivery Shard", status: "Healthy", load: "12%", uptime: "100%", region: "us-east" },
    { id: "EDGE-EU-02", type: "Analytics Node", status: "Degraded", load: "88%", uptime: "98.5%", region: "eu-central" },
    { id: "EDGE-INDIA-02", type: "AI Scanner V3", status: "Healthy", load: "24%", uptime: "99.99%", region: "asia-south" },
  ]

  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                 <Globe className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Global Infrastructure Layer v8.2</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-[0.8] mb-2">
             EDGE <span className="text-primary italic">CONTROL</span> MATRIX
           </h1>
           <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-60 leading-relaxed max-w-xl">
             Autonomous management for 4,200+ global edge nodes and core server sharding protocols.
           </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="h-14 px-8 bg-card border border-border rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground hover:shadow-xl transition-all shadow-sm active:scale-95">
            <RefreshCw className="h-4 w-4 text-primary" />
            Synchronize Mesh
          </button>
          <button className="h-14 px-10 bg-primary hover:bg-emerald-600 text-primary-foreground rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center gap-3 transition-all hover:-translate-y-1 active:translate-y-0">
            <Plus className="h-5 w-5" />
            Provision Shard
          </button>
        </div>
      </div>

      {/* Real-time Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Active Containers", value: "1,242", sub: "+12 vs Last Hour", icon: Container, color: "primary" },
          { label: "Transit Bandwidth", value: "42.5 GB/s", sub: "Peak Efficiency", icon: Network, color: "blue" },
          { label: "AI Inference TTL", value: "12ms", sub: "Global Average", icon: Zap, color: "orange" },
          { label: "Mesh Integrity", value: "100%", sub: "Verified Clusters", icon: Shield, color: "emerald" },
        ].map((stat, i) => (
          <Card key={i} className="p-8 bg-card border-border/50 rounded-[2rem] shadow-xl group hover:shadow-2xl hover:border-primary/20 transition-all relative overflow-hidden">
            <div className="absolute right-0 top-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform">
               <stat.icon className="h-20 w-20 text-primary" />
            </div>
            
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg",
                stat.color === 'primary' ? "bg-primary text-primary-foreground shadow-primary/20" :
                stat.color === 'blue' ? "bg-blue-500 text-white shadow-blue-500/20" :
                stat.color === 'orange' ? "bg-orange-500 text-white shadow-orange-500/20" : "bg-emerald-500 text-white shadow-emerald-500/20"
              )}>
                <stat.icon className="h-7 w-7" />
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60 italic">{stat.label}</p>
              <h3 className="text-4xl font-black text-foreground tracking-tighter tabular-nums leading-none">{stat.value}</h3>
              <div className="flex items-center gap-2 mt-3">
                 <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">{stat.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Node Distribution Table */}
        <Card className="lg:col-span-2 bg-card border-border/50 shadow-2xl rounded-[3rem] overflow-hidden">
           <div className="p-10 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 bg-muted/20">
              <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase flex items-center gap-4 italic leading-none">
                 <Server className="h-7 w-7 text-primary" />
                 Global Fleet Shards
              </h3>
              <div className="flex bg-muted p-1 border border-border rounded-xl shadow-inner">
                 {["all", "asia-south", "us-east", "eu-central"].map(r => (
                    <button key={r} onClick={() => setActiveRegion(r)} className={cn("px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", activeRegion === r ? "bg-card text-primary shadow-lg border border-border" : "text-muted-foreground hover:text-foreground")}>{r === 'all' ? 'All' : r.replace('-', ' ')}</button>
                 ))}
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-muted/30 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                       <th className="px-10 py-6">IDENTIFIER</th>
                       <th className="px-8 py-6">SERVICE CLASSIFICATION</th>
                       <th className="px-8 py-6">LOAD MATRIX</th>
                       <th className="px-8 py-6">UPTIME</th>
                       <th className="px-10 py-6 text-right">STATUS</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/30">
                    {nodes.filter(n => activeRegion === 'all' || n.region === activeRegion).map((node, i) => (
                       <tr key={i} className="hover:bg-muted/40 transition-all group cursor-pointer">
                          <td className="px-10 py-8 text-xs font-black text-foreground tracking-widest uppercase italic">{node.id}</td>
                          <td className="px-8 py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{node.type}</td>
                          <td className="px-8 py-8">
                             <div className="flex items-center gap-4">
                                <span className="text-[11px] font-black tabular-nums text-foreground">{node.load}</span>
                                <div className="w-24 h-2 bg-muted border border-border rounded-full overflow-hidden shadow-inner">
                                   <motion.div initial={{width: 0}} animate={{width: node.load}} className={cn("h-full rounded-full transition-all duration-1000", parseInt(node.load) > 80 ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]" : "bg-primary shadow-[0_0_10px_rgba(5,148,103,0.4)]")} />
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-8 text-xs font-bold text-muted-foreground italic">{node.uptime} Status</td>
                          <td className="px-10 py-8 text-right">
                             <span className={cn(
                                "text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm",
                                node.status === 'Healthy' ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-orange-500 text-white shadow-orange-500/20"
                             )}>
                                {node.status}
                             </span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>

        {/* Configuration Matrix */}
        <Card className="p-10 bg-card border-border/50 shadow-2xl rounded-[3rem] flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 transition-transform">
              <Settings className="h-48 w-48 text-primary" />
           </div>
           
           <div className="space-y-2 mb-10 relative z-10">
              <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase flex items-center gap-4 italic leading-none">
                <Settings className="h-7 w-7 text-primary" />
                Edge Config
              </h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60 italic">Live Runtime Variables</p>
           </div>
           
           <div className="space-y-4 flex-1 relative z-10">
              {[
                 { key: "API_CLUSTER_SHARD", val: "sh-4029-x", secure: true },
                 { key: "AI_INFERENCE_MODEL", val: "mana-vision-v4", secure: false },
                 { key: "EDGE_CACHE_TTL", val: "3600ms", secure: false },
                 { key: "DB_REPLICA_COUNT", val: "12", secure: false },
                 { key: "LOG_AGGREGATOR", val: "fluent-bit-01", secure: true },
              ].map((cfg, i) => (
                 <div key={i} className="p-5 rounded-2xl bg-muted/40 border border-border/50 group hover:bg-card hover:border-primary/30 transition-all flex items-center justify-between shadow-sm">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">{cfg.key}</span>
                       <span className={cn("text-xs font-black tracking-tight", cfg.secure ? "text-primary" : "text-foreground")}>{cfg.secure ? "••••••••••••" : cfg.val}</span>
                    </div>
                    {cfg.secure ? <Lock className="h-4 w-4 text-primary opacity-50" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                 </div>
              ))}
           </div>

           <button className="w-full mt-12 py-5 bg-primary hover:bg-emerald-600 text-primary-foreground rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:translate-y-0 relative z-10">
              Deploy Matrix Changes
           </button>
        </Card>
      </div>

      {/* Terminal View */}
      <Card className="bg-slate-950 border border-border shadow-2xl rounded-[3rem] overflow-hidden">
         <div className="px-10 py-6 border-b border-border/30 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
               <Terminal className="h-5 w-5 text-primary shadow-[0_0_10px_rgba(5,148,103,1)]" />
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Platform Kernel Stream</span>
            </div>
            <div className="flex gap-2">
               <div className="h-2.5 w-2.5 rounded-full bg-red-500/30 border border-red-500/50" />
               <div className="h-2.5 w-2.5 rounded-full bg-orange-500/30 border border-orange-500/50" />
               <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
         </div>
         <div className="p-10 font-mono text-[11px] space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
            <p className="text-emerald-500/80 font-bold leading-relaxed tracking-tight flex gap-4"><span className="text-slate-600 shrink-0 uppercase">[10:45:22]</span> [SYSTEM] Initialization of Edge Node INDIA-01 complete. All services nominal.</p>
            <p className="text-slate-400 leading-relaxed tracking-tight flex gap-4"><span className="text-slate-600 shrink-0 uppercase">[10:44:10]</span> [KERNEL] Sharding strategy updated: Weighted Distribution across 12 zones.</p>
            <p className="text-slate-400 leading-relaxed tracking-tight flex gap-4"><span className="text-slate-600 shrink-0 uppercase">[10:42:01]</span> [NETWORK] Latency spike detected in Cluster EU-02 (Region: eu-central). Self-healing initiated.</p>
            <p className="text-orange-400/80 font-bold leading-relaxed tracking-tight flex gap-4"><span className="text-slate-600 shrink-0 uppercase">[10:40:15]</span> [WARN] High memory utilization in AI Inference Matrix (Shard-Node: INDIA-02).</p>
            <p className="text-slate-400 leading-relaxed tracking-tight flex gap-4"><span className="text-slate-600 shrink-0 uppercase">[10:38:55]</span> [AUTH] RSA-4096 Key rotation sequence successfully completed. Next rotation in 48h.</p>
            <p className="text-emerald-400 font-black leading-relaxed tracking-tight mt-6 uppercase tracking-widest animate-pulse flex items-center gap-2">
               <CheckCircle className="h-4 w-4" /> Global status: All systems nominal. traffic sharding active.
            </p>
            <div className="h-4 w-2 bg-primary/80 animate-pulse mt-4" />
         </div>
      </Card>
    </div>
  )
}
