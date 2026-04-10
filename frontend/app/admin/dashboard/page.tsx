"use client"

import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe,
  Database,
  ShieldCheck,
  Zap,
  MoreVertical,
  Calendar,
  Layers,
  FileCode,
  Download
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function PlatformAnalyticsDashboard() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                 <Activity className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Platform Intelligence</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
             Platform <span className="text-primary italic">Health</span>
           </h1>
           <p className="text-muted-foreground text-sm mt-3 font-medium max-w-lg leading-relaxed">
             Real-time insights across all merchants, transactions, and system clusters with automated anomaly detection.
           </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-card border border-border px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <Calendar className="h-4 w-4 text-primary" />
              Reporting Period: Last 30 Days
           </div>
           <button className="bg-primary hover:bg-emerald-600 text-primary-foreground px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
              <Download className="h-4 w-4" /> Export Report
           </button>
        </div>
      </div>

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Total Revenue", value: "₹42.5M", growth: "+14.2%", icon: CreditCard, color: "primary" },
          { label: "Active Merchants", value: "12,402", growth: "+8.4%", icon: Users, color: "blue" },
          { label: "Transaction Vol", value: "1.2M", growth: "+22.1%", icon: Activity, color: "purple" },
          { label: "System Uptime", value: "99.99%", growth: "Stable", icon: Globe, color: "emerald" },
        ].map((metric) => (
          <Card key={metric.label} className="p-8 bg-card border-border/50 shadow-xl rounded-[2rem] hover:shadow-2xl hover:border-primary/20 transition-all group relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:rotate-12 transition-transform">
               <metric.icon className="h-24 w-24 text-primary" />
            </div>
            
            <div className="flex justify-between items-start mb-10 relative z-10">
               <div className={cn(
                 "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                 metric.color === 'primary' ? "bg-primary text-primary-foreground shadow-primary/20" :
                 metric.color === 'blue' ? "bg-blue-500 text-white shadow-blue-500/20" :
                 metric.color === 'purple' ? "bg-purple-500 text-white shadow-purple-500/20" : "bg-emerald-500 text-white shadow-emerald-500/20"
               )}>
                  <metric.icon className="h-7 w-7" />
               </div>
               <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><MoreVertical className="h-5 w-5" /></button>
            </div>
            
            <div className="relative z-10">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60">{metric.label}</p>
               <div className="flex items-baseline gap-4">
                  <h3 className="text-4xl font-black text-foreground tracking-tighter italic">{metric.value}</h3>
                  <span className={cn(
                    "text-[10px] font-black flex items-center gap-1 px-2 py-1 rounded-full uppercase tracking-widest",
                    metric.growth.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                  )}>
                     {metric.growth.startsWith('+') && <TrendingUp className="h-3 w-3" />}
                     {metric.growth}
                  </span>
               </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart Placeholder */}
        <Card className="lg:col-span-2 p-10 bg-card border-border/50 shadow-xl rounded-[3rem]">
           <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase leading-none flex items-center gap-4 italic">
                 <BarChart3 className="h-7 w-7 text-primary" />
                 Growth Metrics
              </h3>
              <div className="flex gap-2 p-1 bg-muted rounded-xl border border-border shadow-inner">
                 {['Daily', 'Weekly', 'Monthly'].map(t => (
                   <button key={t} className={cn("px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", t === 'Weekly' ? "bg-card text-primary shadow-lg border border-border" : "text-muted-foreground hover:text-foreground")}>{t}</button>
                 ))}
              </div>
           </div>
           
           <div className="h-[400px] w-full flex items-end justify-between gap-5 pt-10">
              {[45, 60, 40, 80, 55, 90, 70, 85, 50, 65, 75, 95].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                   <div 
                    className="w-full bg-primary/10 dark:bg-primary/5 border border-primary/10 rounded-t-2xl group-hover:bg-primary/40 group-hover:border-primary/50 transition-all relative cursor-pointer shadow-inner" 
                    style={{ height: `${val}%` }}
                   >
                      {i === 11 && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black px-4 py-2 rounded-full shadow-2xl animate-bounce uppercase tracking-widest border border-white/20 whitespace-nowrap">
                          Peak: ₹4.2M
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40 group-hover:opacity-100 transition-opacity tracking-widest leading-none">M{i+1}</span>
                </div>
              ))}
           </div>
        </Card>

        {/* Infrastructure Nodes */}
        <Card className="p-10 bg-card border-border/50 shadow-xl rounded-[3rem]">
           <h3 className="text-2xl font-black text-foreground tracking-tighter mb-10 uppercase leading-none flex items-center gap-4 italic">
              <Database className="h-7 w-7 text-primary" />
              Live Nodes
           </h3>
           <div className="space-y-6">
              {[
                { name: "Auth Cluster", status: "Healthy", uptime: "99.98%", load: "24%" },
                { name: "Payment Gateway", status: "Healthy", uptime: "99.99%", load: "42%" },
                { name: "AI Scanner V3", status: "Degraded", uptime: "98.50%", load: "88%" },
                { name: "Cloud Storage", status: "Healthy", uptime: "100%", load: "12%" },
              ].map((node) => (
                <div key={node.name} className="p-6 rounded-[2rem] bg-muted/30 border border-border/50 group hover:bg-card hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden">
                   <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="font-black text-foreground text-[11px] uppercase tracking-tight">{node.name}</span>
                      <span className={cn(
                        "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm",
                        node.status === 'Healthy' ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"
                      )}>
                         {node.status}
                      </span>
                   </div>
                   <div className="flex items-center justify-between mt-auto relative z-10">
                      <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                         <Activity className="h-3.5 w-3.5 text-primary" />
                         {node.uptime} Up
                      </div>
                      <div className="w-28 bg-muted border border-border h-2 rounded-full overflow-hidden shadow-inner">
                         <div className={cn("h-full rounded-full transition-all duration-1000", parseInt(node.load) > 80 ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" : "bg-primary shadow-[0_0_8px_rgba(5,148,103,0.4)]")} style={{ width: node.load }}></div>
                      </div>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
           </div>
           <button className="w-full mt-10 h-14 bg-muted border border-border rounded-2xl text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] hover:bg-card hover:text-primary hover:border-primary/30 hover:shadow-xl transition-all active:scale-95">Analyze All Clusters</button>
        </Card>
      </div>
    </div>
  )
}
