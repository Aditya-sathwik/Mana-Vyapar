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
  Maximize2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function DetailedPlatformAnalytics() {
  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Deep-Dive Platform Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Detailed cluster performance, shard-level revenue tracking, and security load analysis.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 hover:text-primary transition-all">
              <Filter className="h-4 w-4" />
              Advanced Filters
           </button>
           <button className="bg-primary hover:bg-primary-dark text-black px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
              <Maximize2 className="h-4 w-4" />
              Fullscreen Mode
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {[
           { label: "Merchant Shard-01", status: "Active", throughput: "4.2 GB/s", mrr: "₹12.5M" },
           { label: "Merchant Shard-02", status: "Active", throughput: "3.8 GB/s", mrr: "₹11.2M" },
           { label: "Merchant Shard-03", status: "High Load", throughput: "6.1 GB/s", mrr: "₹18.4M" },
           { label: "Merchant Shard-04", status: "Active", throughput: "2.5 GB/s", mrr: "₹6.8M" },
         ].map((shard, i) => (
           <Card key={i} className="p-6 bg-white dark:bg-[#09090b] border-primary/10 hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                 <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Layers className="h-5 w-5" />
                 </div>
                 <span className={cn(
                   "text-[8px] font-black px-2 py-0.5 rounded uppercase",
                   shard.status === 'High Load' ? "bg-orange-500 text-white" : "bg-emerald-500 text-white"
                 )}>{shard.status}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{shard.label}</h4>
              <div className="flex items-center justify-between mt-4">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Throughput</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{shard.throughput}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">MRR</p>
                    <p className="text-sm font-black text-primary">{shard.mrr}</p>
                 </div>
              </div>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Load Balance Chart */}
         <Card className="lg:col-span-8 p-10 bg-white dark:bg-[#09090b] border-primary/10">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Global Load Distribution</h3>
                  <p className="text-xs text-slate-500">Real-time balancing across 12 infrastructure nodes.</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="h-3 w-3 rounded-full bg-primary" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Production</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Staging</span>
                  </div>
               </div>
            </div>

            <div className="h-[400px] flex items-center justify-around gap-2 px-10">
               {[65, 45, 80, 55, 30, 90, 70, 40, 60, 85, 50, 75].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-help">
                    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-full relative overflow-hidden">
                       <div 
                        className={cn(
                          "absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 group-hover:opacity-100 opacity-60",
                          h > 80 ? "bg-orange-500" : "bg-primary"
                        )} 
                        style={{ height: `${h}%` }} 
                       />
                    </div>
                    <span className="text-[8px] font-bold text-slate-400">N{i+1}</span>
                 </div>
               ))}
            </div>
         </Card>

         {/* Security Heatmap placeholder */}
         <Card className="lg:col-span-4 p-8 bg-slate-900 border-slate-800 relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
               <Shield className="h-6 w-6 text-primary" />
               Security Perimeter
            </h3>
            
            <div className="space-y-6">
               <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative">
                  <Activity className="absolute top-4 right-4 h-5 w-5 text-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">DDoS Mitigation</p>
                  <p className="text-2xl font-black text-white">Active</p>
                  <p className="text-xs text-slate-400 mt-2">WAF layer filtering 12.4k malicious probes across Asian nodes.</p>
               </div>

               <div className="space-y-4">
                  {[
                    { city: "Frankfurt", risk: "Low", load: "12%" },
                    { city: "Singapore", risk: "Medium", load: "45%" },
                    { city: "New York", risk: "Low", load: "08%" },
                  ].map((node, i) => (
                    <div key={i} className="flex items-center justify-between px-2">
                       <span className="text-xs font-bold text-slate-300">{node.city} Node</span>
                       <div className="flex items-center gap-4">
                          <span className={cn("text-[10px] font-bold uppercase", node.risk === 'Medium' ? "text-orange-500" : "text-emerald-500")}>{node.risk} Risk</span>
                          <span className="text-xs font-black text-white">{node.load}</span>
                       </div>
                    </div>
                  ))}
               </div>

               <button className="w-full py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all border border-white/5">View Full Traffic Map</button>
            </div>
         </Card>
      </div>
    </div>
  )
}
