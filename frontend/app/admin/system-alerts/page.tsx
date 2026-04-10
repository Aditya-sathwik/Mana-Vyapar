"use client"

import { 
  CircleAlert, 
  Terminal, 
  Activity, 
  Database, 
  Server,
  RefreshCw,
  Search,
  Filter,
  Download,
  CheckCircle,
  CircleX,
  AlertTriangle,
  Layers,
  Trash2,
  ChevronRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const logs = [
  {
    id: "LOG-9283",
    timestamp: "2023-11-20 10:45:22",
    level: "ERROR",
    module: "Payment Gateway",
    message: "Failed to initialize handshake with Razorpay API. Connection timeout after 30s.",
    source: "payment-svc-02"
  },
  {
    id: "LOG-9284",
    timestamp: "2023-11-20 10:44:01",
    level: "WARNING",
    module: "Auth Service",
    message: "High latency detected in JWT verification. Average time 450ms.",
    source: "auth-svc-01"
  },
  {
    id: "LOG-9285",
    timestamp: "2023-11-20 10:42:15",
    level: "CRITICAL",
    module: "Database",
    message: "Maximum connection pool reached for store-shard-04. Refusing new connections.",
    source: "db-cluster-prod"
  },
  {
    id: "LOG-9286",
    timestamp: "2023-11-20 10:40:00",
    level: "INFO",
    module: "System Cache",
    message: "Cache eviction policy triggered. 4.2GB memory freed.",
    source: "redis-master"
  }
]

export default function SystemAlertsPage() {
  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                 <Terminal className="h-4 w-4 text-red-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Kernel Monitoring</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
             System <span className="text-red-500 italic">Alerts</span> & Logs
           </h1>
           <p className="text-muted-foreground text-sm mt-3 font-medium max-w-lg leading-relaxed">
             Real-time critical infrastructure monitoring and hardware-level sharding logs.
           </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <button className="h-14 px-8 bg-card border border-border rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground hover:shadow-xl transition-all shadow-sm">
              <RefreshCw className="h-4 w-4 text-primary animate-spin-slow" />
              Stream: Active
           </button>
           <button className="h-14 px-8 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 active:scale-95 shadow-lg shadow-red-500/5">
              <Trash2 className="h-4 w-4" />
              Purge Buffer
           </button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <Card className="p-8 bg-card border-emerald-500/20 shadow-xl rounded-[2rem] group relative overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform">
               <Server className="h-20 w-20 text-emerald-500" />
            </div>
            <div className="flex items-center gap-6 mb-8 relative z-10">
               <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <Activity className="h-7 w-7 text-emerald-500" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">API Clusters</p>
                  <p className="text-2xl font-black text-foreground tracking-tighter italic">ACTIVE (12/12)</p>
               </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-black uppercase tracking-widest relative z-10">
               <CheckCircle className="h-3.5 w-3.5" />
               Stability: 99.998%
            </div>
         </Card>

         <Card className="p-8 bg-card border-orange-500/20 shadow-xl rounded-[2rem] group relative overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform">
               <Database className="h-20 w-20 text-orange-500" />
            </div>
            <div className="flex items-center gap-6 mb-8 relative z-10">
               <div className="h-14 w-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-lg shadow-orange-500/10">
                  <Database className="h-7 w-7 text-orange-500" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Store Shoting</p>
                  <p className="text-2xl font-black text-foreground tracking-tighter italic">DEGRADED (4/5)</p>
               </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-orange-500 font-black uppercase tracking-widest relative z-10">
               <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
               Shard 04 Re-syncing...
            </div>
         </Card>

         <Card className="p-8 bg-card border-red-500/20 shadow-xl rounded-[2rem] group relative overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform">
               <CircleAlert className="h-20 w-20 text-red-500" />
            </div>
            <div className="flex items-center gap-6 mb-8 relative z-10">
               <div className="h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-lg shadow-red-500/10">
                  <CircleAlert className="h-7 w-7 text-red-500" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Active Alerts</p>
                  <p className="text-2xl font-black text-foreground tracking-tighter italic">2 CRITICAL</p>
               </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-red-500 font-black uppercase tracking-widest relative z-10">
               <CircleX className="h-3.5 w-3.5" />
               Immediate Action Required
            </div>
         </Card>
      </div>

      {/* Logs Hub */}
      <Card className="bg-slate-950 border border-border shadow-2xl rounded-[3rem] overflow-hidden">
         <div className="p-10 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900/40 backdrop-blur-md">
            <div className="relative flex-1 group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
               <input 
                  type="text" 
                  placeholder="Filter kernel logs by module, message or ID..." 
                  className="w-full pl-14 pr-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-100 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-slate-600"
               />
            </div>
            <div className="flex items-center gap-4">
               <button className="h-12 w-12 flex items-center justify-center border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-400 transition-all active:scale-90">
                  <Filter className="h-5 w-5" />
               </button>
               <button className="h-12 w-12 flex items-center justify-center border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-400 transition-all active:scale-90">
                  <Download className="h-5 w-5" />
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-900/60 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                     <th className="px-10 py-6">LOG LEVEL</th>
                     <th className="px-8 py-6">TIMESTAMP</th>
                     <th className="px-8 py-6">KERNEL MODULE</th>
                     <th className="px-8 py-6">STREAM PAYLOAD</th>
                     <th className="px-10 py-6 text-right">SOURCE</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50 font-mono text-[11px]">
                  {logs.map((log) => (
                     <tr key={log.id} className="hover:bg-primary/5 transition-all group cursor-pointer">
                        <td className="px-10 py-7">
                           <span className={cn(
                               "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                               log.level === "ERROR" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                               log.level === "CRITICAL" ? "bg-red-600 text-white shadow-lg shadow-red-600/20" :
                               log.level === "WARNING" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                           )}>
                              {log.level}
                           </span>
                        </td>
                        <td className="px-8 py-7 text-slate-500 font-bold">{log.timestamp}</td>
                        <td className="px-8 py-7 text-slate-200 font-black uppercase tracking-tighter italic">{log.module}</td>
                        <td className="px-8 py-7 text-slate-400 group-hover:text-slate-100 transition-colors max-w-lg leading-relaxed tabular-nums">
                           {log.message}
                        </td>
                        <td className="px-10 py-7 text-right">
                           <div className="flex items-center justify-end gap-2 text-primary font-black uppercase tracking-widest italic opacity-60">
                              {log.source}
                              <ChevronRight className="h-3 w-3" />
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-8 bg-slate-900/20 border-t border-slate-800 text-center">
            <button className="text-[10px] font-black text-slate-600 hover:text-primary transition-colors uppercase tracking-[0.4em] italic flex items-center gap-3 mx-auto">
               <Layers className="h-4 w-4" /> Load Extensive System Events
            </button>
         </div>
      </Card>
    </div>
  )
}
