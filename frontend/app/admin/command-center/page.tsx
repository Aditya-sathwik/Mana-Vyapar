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
  CheckCircle,
  AlertTriangle,
  Monitor,
  Clock,
  RefreshCw,
  ArrowRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function CommandCenterOverview() {
  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="relative group bg-card border border-border rounded-[2.5rem] p-10 md:p-14 overflow-hidden shadow-2xl transition-all hover:shadow-primary/5">
         {/* Adaptive Background Glows */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-primary/10 to-transparent -z-10 opacity-50 transition-opacity group-hover:opacity-70" />
         <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
         
         <div className="absolute top-10 right-10 opacity-[0.03] dark:opacity-[0.07] rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-110">
            <Monitor className="h-64 w-64 text-primary" />
         </div>

         <div className="relative z-10 flex flex-col lg:flex-row justify-between lg:items-end gap-10">
            <div className="max-w-3xl">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
                  <Activity className="h-3.5 w-3.5 animate-pulse" />
                  Live Platform Feed
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-none mb-6">
                  SUPER <span className="text-primary italic">ADMIN</span> COMMAND
               </h1>
               <p className="text-muted-foreground text-lg md:text-xl font-medium tracking-tight max-w-2xl leading-relaxed">
                  Centralized control for platform orchestration, infrastructure integrity, and global security enforcement.
               </p>
            </div>
            <div className="flex flex-wrap gap-5">
               <div className="px-8 py-6 bg-muted/40 backdrop-blur-md rounded-3xl border border-border/50 text-right shadow-sm hover:translate-y-[-4px] transition-all">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60">Response Latency</p>
                  <p className="text-4xl font-black text-primary tracking-tighter">124ms</p>
               </div>
               <div className="px-8 py-6 bg-muted/40 backdrop-blur-md rounded-3xl border border-border/50 text-right shadow-sm hover:translate-y-[-4px] transition-all">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60">Global Utilization</p>
                  <p className="text-4xl font-black text-primary tracking-tighter uppercase italic">32.4%</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* System Integrity Feed */}
         <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="p-10 bg-card border-border/50 shadow-xl rounded-[2rem] hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-2xl font-black text-foreground tracking-tighter flex items-center gap-4">
                        <Layers className="h-7 w-7 text-primary" />
                        Platform Clusters
                     </h3>
                     <span className="text-[10px] font-black text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full uppercase tracking-widest">8 Active Zones</span>
                  </div>
                  <div className="space-y-6">
                     {[
                       { name: "API Gateway (Asia)", status: "Balanced", load: 35, color: "primary" },
                       { name: "Global CDN Edge", status: "Optimal", load: 12, color: "emerald" },
                       { name: "Compute Shards", status: "Scaling", load: 78, color: "orange" },
                     ].map(cluster => (
                        <div key={cluster.name} className="space-y-3">
                           <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                              <span className="text-muted-foreground">{cluster.name}</span>
                              <span className={cn(cluster.color === 'orange' ? "text-orange-500" : "text-primary")}>{cluster.status}</span>
                           </div>
                           <div className="w-full bg-muted border border-border h-2.5 rounded-full overflow-hidden shadow-inner">
                              <div className={cn("h-full rounded-full transition-all duration-1000", cluster.color === 'orange' ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-primary shadow-[0_0_10px_rgba(5,148,103,0.5)]")} style={{ width: `${cluster.load}%` }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </Card>

               <Card className="p-10 bg-card border-border/50 shadow-xl rounded-[2rem] hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-2xl font-black text-foreground tracking-tighter flex items-center gap-4">
                        <Terminal className="h-7 w-7 text-primary" />
                        Log Events
                     </h3>
                     <button className="text-[10px] items-center flex gap-1 font-black text-primary hover:text-emerald-600 transition-colors uppercase tracking-[0.2em]">View All <ArrowRight className="h-3 w-3" /></button>
                  </div>
                  <div className="font-mono text-[10px] space-y-4">
                     {[
                       { time: "10:45:22", type: "INFO", msg: "CDN Cache invalidation started for /static/*" },
                       { time: "10:44:10", type: "WARN", msg: "Slow handshake detected: Node-Region-7" },
                       { time: "10:42:01", type: "SUCCESS", msg: "Db Backup complete: s3://prod-backup-v4" },
                     ].map((log, i) => (
                        <div key={i} className="flex gap-4 p-3 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-colors">
                           <span className="text-muted-foreground/60 shrink-0 font-bold">{log.time}</span>
                           <span className={cn("font-black shrink-0 px-1.5 rounded", 
                             log.type === 'WARN' ? "bg-orange-500/10 text-orange-500" : 
                             log.type === 'SUCCESS' ? "bg-emerald-500/10 text-emerald-500" : 
                             "bg-blue-500/10 text-blue-500")}>{log.type}</span>
                           <span className="truncate text-foreground/80 font-medium tracking-tight">{log.msg}</span>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>

            {/* Quick Control Console */}
            <Card className="p-12 relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-card border-primary/10 rounded-[3rem] shadow-2xl">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-0">
                  <Zap className="h-48 w-48 text-primary" />
               </div>
               <div className="flex items-center gap-6 mb-12 relative z-10">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-primary text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/30">
                     <Settings2 className="h-8 w-8" />
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none mb-2">Orchestration Console</h3>
                     <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">System-wide atomic actions</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                  {[
                    { label: "Purge Cache", icon: Zap, color: "primary" },
                    { label: "Maint Window", icon: Clock, color: "orange" },
                    { label: "Root Access", icon: ShieldAlert, color: "red" },
                    { label: "Core Rebuild", icon: RefreshCw, color: "blue" },
                  ].map(action => (
                     <button key={action.label} className="flex flex-col items-center gap-4 p-8 bg-card border border-border rounded-[2rem] hover:border-primary/50 hover:shadow-2xl transition-all group shadow-sm active:scale-95">
                        <div className={cn(
                          "h-16 w-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg",
                          action.color === 'primary' ? "bg-primary text-primary-foreground shadow-primary/20" :
                          action.color === 'orange' ? "bg-orange-500 text-white shadow-orange-500/20" :
                          action.color === 'red' ? "bg-red-500 text-white shadow-red-500/20" : "bg-blue-500 text-white shadow-blue-500/20"
                        )}>
                           <action.icon className="h-7 w-7" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground transition-colors group-hover:text-primary">{action.label}</span>
                     </button>
                  ))}
               </div>
            </Card>
         </div>

         {/* Sidebar Integrity Metrics */}
         <div className="lg:col-span-4 space-y-8">
            <Card className="p-10 bg-card border-border/50 shadow-xl rounded-[2rem]">
               <h3 className="text-2xl font-black text-foreground tracking-tighter mb-10 flex items-center gap-4">
                  <Bell className="h-7 w-7 text-primary" />
                  Security Grid
               </h3>
               <div className="space-y-5">
                  {[
                    { title: "DDoS Mitigation", desc: "Edge layer actively blocking 40k req/m", level: "Active", color: "emerald" },
                    { title: "Unauthorized Root", desc: "Rejected 3 attempts from 102.34.11.*", level: "Critical", color: "red" },
                    { title: "SLA Breach Risk", desc: "Store ID #9283 latency > 800ms", level: "Warning", color: "orange" },
                  ].map((alert, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-muted/30 border border-border/50 relative group overflow-hidden hover:bg-muted/50 transition-all cursor-pointer">
                       <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", 
                         alert.color === 'emerald' ? "bg-emerald-500" : 
                         alert.color === 'red' ? "bg-red-500" : "bg-orange-500"
                       )} />
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-foreground text-sm uppercase tracking-tight">{alert.title}</h4>
                          <span className={cn(
                            "text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest",
                            alert.color === 'emerald' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : 
                            alert.color === 'red' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                          )}>{alert.level}</span>
                       </div>
                       <p className="text-xs text-muted-foreground font-medium italic opacity-80 leading-relaxed">{alert.desc}</p>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 h-14 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-500/20 active:scale-95">Lockdown Infrastructure</button>
            </Card>

            <Card className="p-10 bg-card border-border/50 shadow-xl rounded-[2rem] relative overflow-hidden">
               <Globe className="absolute -bottom-16 -right-16 h-64 w-64 text-primary opacity-[0.03] dark:opacity-[0.07]" />
               <h3 className="text-2xl font-black text-foreground tracking-tighter mb-8 uppercase leading-none italic">Kernel Sync</h3>
               <div className="space-y-8">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Data Consistency</span>
                     <span className="text-xs font-black text-emerald-500 italic">100% SECURE</span>
                  </div>
                  <div className="flex gap-2.5">
                     {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="flex-1 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner hover:bg-primary/20 transition-colors">
                           <Database className="h-5 w-5 text-primary opacity-60" />
                        </div>
                     ))}
                  </div>
                  <div className="p-5 bg-muted/50 rounded-2xl border border-border/50 backdrop-blur-sm">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                           <Cloud className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                           <p className="text-xs font-black text-foreground uppercase tracking-widest">AWS CloudWatch</p>
                           <p className="text-[10px] font-bold text-muted-foreground tracking-tight">Active for 12 clusters</p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                     </div>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  )
}
