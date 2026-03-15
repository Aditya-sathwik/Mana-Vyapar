"use client"

import { 
  ShieldAlert, 
  Activity, 
  Database, 
  Zap, 
  Globe, 
  Terminal, 
  Server,
  Cloud,
  Layers,
  Settings2,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Clock,
  RefreshCw
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function CommandCenterOverview() {
  return (
    <div className="space-y-12 pb-12">
      {/* Dynamic Header */}
      <div className="bg-gradient-to-br from-slate-900 to-[#09090b] rounded-[2rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Monitor className="h-48 w-48 text-primary" />
         </div>
         <div className="relative z-10 flex flex-col lg:flex-row justify-between lg:items-end gap-8">
            <div className="max-w-2xl">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                  <Activity className="h-3 w-3 animate-pulse" />
                  Live System Feed
               </div>
               <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                  Super Admin <span className="text-primary">Command Center</span>
               </h1>
               <p className="text-slate-400 text-lg">
                  Centralized control for platform orchestration, infrastructure integrity, and global security enforcement.
               </p>
            </div>
            <div className="flex gap-4">
               <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Response Time</p>
                  <p className="text-2xl font-black text-emerald-400">124ms</p>
               </div>
               <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Global Load</p>
                  <p className="text-2xl font-black text-primary">32.4%</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* System Integrity Feed */}
         <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="p-8 bg-white dark:bg-[#09090b] border-primary/10">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Layers className="h-6 w-6 text-primary" />
                        Platform Clusters
                     </h3>
                     <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">8 Active</span>
                  </div>
                  <div className="space-y-4">
                     {[
                       { name: "API Gateway (Asia)", status: "Balanced", load: 35, color: "primary" },
                       { name: "Global CDN Edge", status: "Optimal", load: 12, color: "emerald" },
                       { name: "Compute Shards", status: "Scaling", load: 78, color: "orange" },
                     ].map(cluster => (
                        <div key={cluster.name} className="space-y-2">
                           <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-700 dark:text-slate-300">{cluster.name}</span>
                              <span className={cn(cluster.color === 'orange' ? "text-orange-500" : "text-primary")}>{cluster.status}</span>
                           </div>
                           <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full transition-all duration-1000", cluster.color === 'orange' ? "bg-orange-500" : "bg-primary")} style={{ width: `${cluster.load}%` }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </Card>

               <Card className="p-8 bg-white dark:bg-[#09090b] border-primary/10">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Terminal className="h-6 w-6 text-primary" />
                        Edge Events
                     </h3>
                     <button className="text-[10px] font-bold text-primary hover:underline">Full Logs</button>
                  </div>
                  <div className="font-mono text-[10px] space-y-3">
                     {[
                       { time: "10:45:22", type: "INFO", msg: "CDN Cache invalidation started for /static/*" },
                       { time: "10:44:10", type: "WARN", msg: "Slow handshake detected: Node-Region-7" },
                       { time: "10:42:01", type: "SUCCESS", msg: "Db Backup complete: s3://prod-backup-2023" },
                     ].map((log, i) => (
                        <div key={i} className="flex gap-3 text-slate-500 dark:text-slate-400">
                           <span className="text-slate-600 dark:text-slate-500 shrink-0">{log.time}</span>
                           <span className={cn("font-bold shrink-0", log.type === 'WARN' ? "text-orange-500" : log.type === 'SUCCESS' ? "text-emerald-500" : "text-blue-500")}>[{log.type}]</span>
                           <span className="truncate">{log.msg}</span>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>

            {/* Quick Control Console */}
            <Card className="p-10 bg-gradient-to-br from-primary/5 to-[#09090b] border-primary/20">
               <div className="flex items-center gap-4 mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20">
                     <Settings2 className="h-8 w-8" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Orchestration Console</h3>
                     <p className="text-sm text-slate-500">Atomic control over platform sub-services.</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: "Purge Cache", icon: Zap, color: "primary" },
                    { label: "Maint Window", icon: Clock, color: "orange" },
                    { label: "Root Access", icon: ShieldAlert, color: "red" },
                    { label: "Cluster Rebuild", icon: RefreshCw, color: "blue" },
                  ].map(action => (
                     <button key={action.label} className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-primary/50 transition-all group">
                        <div className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm",
                          action.color === 'primary' ? "bg-primary/10 text-primary" :
                          action.color === 'orange' ? "bg-orange-100 text-orange-600" :
                          action.color === 'red' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                        )}>
                           <action.icon className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-400">{action.label}</span>
                     </button>
                  ))}
               </div>
            </Card>
         </div>

         {/* Sidebar Integrity Metrics */}
         <div className="lg:col-span-4 space-y-8">
            <Card className="p-8 bg-white dark:bg-[#09090b] border-primary/10">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <Bell className="h-6 w-6 text-primary" />
                  Security Alerts
               </h3>
               <div className="space-y-4">
                  {[
                    { title: "DDoS Mitigation", desc: "Edge layer actively blocking 40k req/m", level: "Active", color: "emerald" },
                    { title: "Unauthorized Root", desc: "Rejected 3 attempts from 102.34.11.*", level: "Critical", color: "red" },
                    { title: "SLA Breach Risk", desc: "Store ID #9283 latency > 800ms", level: "Warning", color: "orange" },
                  ].map((alert, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
                       <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
                         alert.color === 'emerald' ? "bg-emerald-500" : 
                         alert.color === 'red' ? "bg-red-500" : "bg-orange-500"
                       )} />
                       <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{alert.title}</h4>
                          <span className={cn(
                            "text-[8px] font-black px-1.5 py-0.5 rounded uppercase",
                            alert.color === 'emerald' ? "bg-emerald-500 text-white" : 
                            alert.color === 'red' ? "bg-red-500 text-white" : "bg-orange-500 text-white"
                          )}>{alert.level}</span>
                       </div>
                       <p className="text-xs text-slate-500 font-medium">{alert.desc}</p>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Emergency Lockdown</button>
            </Card>

            <Card className="p-8 bg-white dark:bg-[#09090b] border-primary/10 relative overflow-hidden">
               <Globe className="absolute -bottom-12 -right-12 h-48 w-48 text-primary/5" />
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Database Health</h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Sync</span>
                     <span className="text-xs font-black text-emerald-500">100% COMPLETE</span>
                  </div>
                  <div className="flex gap-2">
                     {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="flex-1 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
                           <Database className="h-4 w-4 text-primary" />
                        </div>
                     ))}
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                     <div className="flex items-center gap-3">
                        <Cloud className="h-5 w-5 text-blue-500" />
                        <div className="flex-1">
                           <p className="text-xs font-bold text-slate-700 dark:text-slate-300">AWS CloudWatch</p>
                           <p className="text-[10px] text-slate-500">Connected to 12 clusters</p>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                     </div>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  )
}

