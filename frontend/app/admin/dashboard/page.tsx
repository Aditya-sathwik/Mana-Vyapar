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
  Calendar
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function PlatformAnalyticsDashboard() {
  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Platform Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Real-time insights across all merchants, transactions, and system clusters.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">
              <Calendar className="h-4 w-4" />
              Last 30 Days
           </div>
           <button className="bg-primary hover:bg-primary-dark text-black px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all">
              Generate Report
           </button>
        </div>
      </div>

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "₹42.5M", growth: "+14.2%", icon: CreditCard, color: "primary" },
          { label: "Active Merchants", value: "12,402", growth: "+8.4%", icon: Users, color: "blue" },
          { label: "Transaction Vol", value: "1.2M", growth: "+22.1%", icon: Activity, color: "purple" },
          { label: "System Uptime", value: "99.99%", growth: "Stable", icon: Globe, color: "emerald" },
        ].map((metric) => (
          <Card key={metric.label} className="p-6 bg-white dark:bg-[#09090b] border-primary/10 hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
               <div className={cn(
                 "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                 metric.color === 'primary' ? "bg-primary/10 text-primary" :
                 metric.color === 'blue' ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600" :
                 metric.color === 'purple' ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600" : "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600"
               )}>
                  <metric.icon className="h-6 w-6" />
               </div>
               <button className="text-slate-300 hover:text-slate-500"><MoreVertical className="h-5 w-5" /></button>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{metric.label}</p>
            <div className="flex items-baseline gap-3">
               <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{metric.value}</h3>
               <span className={cn(
                 "text-xs font-bold flex items-center gap-0.5",
                 metric.growth.startsWith('+') ? "text-emerald-500" : "text-slate-400"
               )}>
                  {metric.growth.startsWith('+') && <TrendingUp className="h-3 w-3" />}
                  {metric.growth}
               </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart Placeholder */}
        <Card className="lg:col-span-2 p-8 bg-white dark:bg-[#09090b] border-primary/10">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                 <BarChart3 className="h-6 w-6 text-primary" />
                 Revenue Performance
              </h3>
              <div className="flex gap-2">
                 {['Daily', 'Weekly', 'Monthly'].map(t => (
                   <button key={t} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", t === 'Weekly' ? "bg-primary text-black" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800")}>{t}</button>
                 ))}
              </div>
           </div>
           
           <div className="h-[350px] w-full flex items-end justify-between gap-4 pt-4">
              {[45, 60, 40, 80, 55, 90, 70, 85, 50, 65, 75, 95].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                   <div 
                    className="w-full bg-primary/10 dark:bg-primary/5 rounded-t-xl group-hover:bg-primary/30 transition-all relative" 
                    style={{ height: `${val}%` }}
                   >
                      {i === 11 && <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold px-2 py-1 rounded-lg shadow-xl">₹42.5M</div>}
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">M{i+1}</span>
                </div>
              ))}
           </div>
        </Card>

        {/* Infrastructure Nodes */}
        <Card className="p-8 bg-white dark:bg-[#09090b] border-primary/10">
           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              Service Status
           </h3>
           <div className="space-y-6">
              {[
                { name: "Auth Cluster", status: "Healthy", uptime: "99.98%", load: "24%" },
                { name: "Payment Gateway", status: "Healthy", uptime: "99.99%", load: "42%" },
                { name: "AI Scanner V3", status: "Degraded", uptime: "98.50%", load: "88%" },
                { name: "Cloud Storage", status: "Healthy", uptime: "100%", load: "12%" },
              ].map((node) => (
                <div key={node.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group hover:border-primary/30 transition-all">
                   <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{node.name}</span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                        node.status === 'Healthy' ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
                      )}>
                         {node.status}
                      </span>
                   </div>
                   <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                         <Activity className="h-3 w-3" />
                         {node.uptime} Uptime
                      </div>
                      <div className="w-24 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                         <div className={cn("h-full rounded-full", parseInt(node.load) > 80 ? "bg-orange-500" : "bg-primary")} style={{ width: node.load }}></div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-8 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Launch Health Console</button>
        </Card>
      </div>
    </div>
  )
}
