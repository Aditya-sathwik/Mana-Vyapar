"use client"

import { 
  AlertCircle, 
  Terminal, 
  Activity, 
  Database, 
  Server,
  RefreshCw,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle
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
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            System Alerts & Logs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Critical infrastructure monitoring and real-time system logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
              <RefreshCw className="h-4 w-4" />
              Auto Refresh: ON
           </button>
           <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-primary/20">
              Clear Logs
           </button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 bg-white dark:bg-[#09090b] border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Server className="h-16 w-16" />
            </div>
            <div className="flex items-center gap-4 mb-4">
               <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-emerald-600" />
               </div>
               <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">API Nodes</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">Active (12/12)</p>
               </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
               <CheckCircle2 className="h-3 w-3" />
               Uptime 99.998%
            </div>
         </Card>

         <Card className="p-6 bg-white dark:bg-[#09090b] border-orange-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Database className="h-16 w-16" />
            </div>
            <div className="flex items-center gap-4 mb-4">
               <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Database className="h-5 w-5 text-orange-600" />
               </div>
               <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Database Cluster</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">Degraded (4/5)</p>
               </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-orange-600 font-bold">
               <AlertTriangle className="h-3 w-3" />
               Shard 04 Re-syncing...
            </div>
         </Card>

         <Card className="p-6 bg-white dark:bg-[#09090b] border-red-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Terminal className="h-16 w-16" />
            </div>
            <div className="flex items-center gap-4 mb-4">
               <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
               </div>
               <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Active Alerts</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">2 Critical</p>
               </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-red-600 font-bold">
               <XCircle className="h-3 w-3" />
               Requires Immediate Action
            </div>
         </Card>
      </div>

      {/* Logs Table */}
      <Card className="bg-slate-950 border-slate-800 overflow-hidden shadow-2xl">
         <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
               <input 
                  type="text" 
                  placeholder="Filter logs by module, message or ID..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border-none rounded-lg text-sm text-slate-200 focus:ring-1 focus:ring-primary focus:outline-none"
               />
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2 border border-slate-700 rounded-lg hover:bg-slate-800 text-slate-400">
                  <Filter className="h-4 w-4" />
               </button>
               <button className="p-2 border border-slate-700 rounded-lg hover:bg-slate-800 text-slate-400">
                  <Download className="h-4 w-4" />
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-900/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                     <th className="px-6 py-4">Level</th>
                     <th className="px-6 py-4">Timestamp</th>
                     <th className="px-6 py-4">Module</th>
                     <th className="px-6 py-4">Message</th>
                     <th className="px-6 py-4">Source</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-900 font-mono text-xs">
                  {logs.map((log) => (
                     <tr key={log.id} className="hover:bg-slate-900/30 transition-colors group">
                        <td className="px-6 py-4">
                           <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              log.level === "ERROR" ? "bg-red-500/20 text-red-400" :
                              log.level === "CRITICAL" ? "bg-red-600/30 text-red-500 border border-red-500/20" :
                              log.level === "WARNING" ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"
                           )}>
                              {log.level}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                        <td className="px-6 py-4 text-slate-300 font-bold">{log.module}</td>
                        <td className="px-6 py-4 text-slate-400 group-hover:text-slate-200 transition-colors max-w-sm">
                           {log.message}
                        </td>
                        <td className="px-6 py-4 text-slate-600 italic">
                           {log.source}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-4 border-t border-slate-900 text-center">
            <button className="text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest">Load More System Events</button>
         </div>
      </Card>
    </div>
  )
}
