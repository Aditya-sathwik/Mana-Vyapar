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
  Container
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
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <Globe className="h-3 w-3 animate-pulse" />
            Global Edge Network v8.1
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
            Infrastructure <span className="text-primary italic">Control</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">
            Management layer for global edge nodes and core server clusters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-12 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all">
            <RefreshCw className="h-4 w-4" />
            Force Sync
          </button>
          <button className="h-12 px-6 bg-primary hover:bg-emerald-600 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 font-bold">
            <Plus className="h-4 w-4" />
            Provision Node
          </button>
        </div>
      </div>

      {/* Real-time Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Containers", value: "1,242", sub: "+12 vs Last Hour", icon: Container, color: "primary" },
          { label: "Total Bandwidth", value: "42.5 GB/s", sub: "Peak Efficiency", icon: Network, color: "blue" },
          { label: "AI Inference Latency", value: "12ms", sub: "Node Distribution", icon: Zap, color: "orange" },
          { label: "Security Clearance", value: "100%", sub: "Verified Nodes", icon: Shield, color: "emerald" },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-white dark:bg-[#09090b] border-slate-200 dark:border-slate-800 group hover:border-primary/50 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center",
                stat.color === 'primary' ? "bg-primary/10 text-primary" :
                stat.color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                stat.color === 'orange' ? "bg-orange-500/10 text-orange-500" : "bg-emerald-500/10 text-emerald-500"
              )}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{stat.value}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Node Distribution Table */}
        <Card className="lg:col-span-2 bg-white dark:bg-[#09090b] border-slate-200 dark:border-slate-800 overflow-hidden">
           <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                 <Server className="h-5 w-5 text-primary" />
                 Global Shards
              </h3>
              <div className="flex gap-2">
                 {["all", "asia-south", "us-east", "eu-central"].map(r => (
                    <button key={r} onClick={() => setActiveRegion(r)} className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all", activeRegion === r ? "bg-primary text-black" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900")}>{r === 'all' ? 'All' : r.replace('-', ' ')}</button>
                 ))}
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-900">
                       <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Node ID</th>
                       <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                       <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Load</th>
                       <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Uptime</th>
                       <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {nodes.filter(n => activeRegion === 'all' || n.region === activeRegion).map((node, i) => (
                       <tr key={i} className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group cursor-pointer">
                          <td className="px-8 py-5 text-xs font-black text-slate-900 dark:text-white">{node.id}</td>
                          <td className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{node.type}</td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <span className="text-xs font-black tabular-nums">{node.load}</span>
                                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                   <motion.div initial={{width: 0}} animate={{width: node.load}} className={cn("h-full rounded-full", parseInt(node.load) > 80 ? "bg-orange-500" : "bg-primary")} />
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-xs font-black text-slate-600 dark:text-slate-400">{node.uptime}</td>
                          <td className="px-8 py-5">
                             <span className={cn(
                                "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
                                node.status === 'Healthy' ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
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
        <Card className="p-8 bg-white dark:bg-[#09090b] border-slate-200 dark:border-slate-800 flex flex-col">
           <div className="space-y-1 mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                Edge Config
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Runtime environment variables</p>
           </div>
           
           <div className="space-y-4 flex-1">
              {[
                 { key: "API_CLUSTER_SHARD", val: "sh-4029-x", secure: true },
                 { key: "AI_INFERENCE_MODEL", val: "mana-vision-v4", secure: false },
                 { key: "EDGE_CACHE_TTL", val: "3600ms", secure: false },
                 { key: "DB_REPLICA_COUNT", val: "12", secure: false },
                 { key: "LOG_AGGREGATOR", val: "fluent-bit-01", secure: true },
              ].map((cfg, i) => (
                 <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group hover:border-primary/30 transition-all flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{cfg.key}</span>
                       <span className="text-xs font-bold text-slate-900 dark:text-white mt-1">{cfg.secure ? "••••••••••••" : cfg.val}</span>
                    </div>
                    {cfg.secure ? <Lock className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
                 </div>
              ))}
           </div>

           <button className="w-full mt-10 py-4 dark:bg-primary bg-black text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
              Commit & Deploy Changes
           </button>
        </Card>
      </div>

      {/* Terminal View */}
      <Card className="bg-[#09090b] border-slate-800 overflow-hidden">
         <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-2">
               <Terminal className="h-4 w-4 text-primary" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Kernel Logs</span>
            </div>
            <div className="flex gap-1.5">
               <div className="h-2 w-2 rounded-full bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]" />
               <div className="h-2 w-2 rounded-full bg-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]" />
               <div className="h-2 w-2 rounded-full bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
         </div>
         <div className="p-6 font-mono text-xs space-y-2 max-h-[300px] overflow-y-auto">
            <p className="text-emerald-500 opacity-80">[SYSTEM] Initialization of Edge Node INDIA-01 complete.</p>
            <p className="text-slate-500">[KERNEL] Sharding strategy updated: Weighted Distribution.</p>
            <p className="text-slate-500">[NETWORK] Latency spike detected in Cluster EU-02 (Region: eu-central).</p>
            <p className="text-orange-500">[WARN] High memory usage in AI Inference Shard (Node: INDIA-02).</p>
            <p className="text-slate-500">[AUTH] RSA Key rotation sequence initiated.</p>
            <p className="text-emerald-500 opacity-80">[SYSTEM] All systems nominal. Global traffic routing active.</p>
            <p className="text-slate-600 animate-pulse">_</p>
         </div>
      </Card>
    </div>
  )
}
