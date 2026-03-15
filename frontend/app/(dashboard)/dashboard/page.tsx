"use client"

import {
   ScanLine,
   TrendingUp,
   Users,
   Activity,
   LayoutGrid,
   ArrowUpRight,
   MoreHorizontal,
   Wallet,
   Package,
   ChevronRight,
   Plus,
   Terminal,
   ShieldCheck
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DashboardPage() {
   return (
      <div className="space-y-12 pb-12">
         {/* Live Status Banner */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 dark:text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  <Activity className="h-3 w-3 animate-pulse" />
                  Real-time Ledger Sync Active
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
                  Mission <span className="text-primary italic">Control</span>
               </h1>
               <div className="flex items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <span>Node: RJ-1024</span>
                  <span className="h-1 w-1 bg-slate-300 rounded-full" />
                  <span>Sector: Electronics</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rank</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">TOP 5%</p>
               </div>
               <Link href="/scanner" className="h-14 flex items-center gap-3 px-8 bg-primary hover:bg-emerald-600 text-black rounded-2xl font-black text-xs shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden">
                  <ScanLine className="h-5 w-5 group-hover:rotate-12 transition-transform relative z-10" />
                  <span className="relative z-10 uppercase tracking-widest">Launch Smart Scanner</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
               </Link>
            </div>
         </div>

         {/* Hero Analytics Section */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
               <Card className="h-full bg-slate-900 border-none shadow-2xl relative overflow-hidden group min-h-[400px]">
                  {/* Premium Background Elements */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -ml-20 -mb-20" />
                  
                  <div className="relative z-10 p-10 flex flex-col h-full">
                     <div className="flex justify-between items-start mb-12">
                        <div>
                           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Gross Revenue Portfolio</p>
                           <div className="flex items-baseline gap-4">
                              <h2 className="text-6xl lg:text-8xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                                 ₹8,42,500
                              </h2>
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-black rounded-lg text-[10px] font-black shadow-lg shadow-primary/20">
                                 <TrendingUp className="h-3 w-3" />
                                 +12.4%
                              </div>
                           </div>
                        </div>
                        <button className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl backdrop-blur-xl border border-white/10 transition-all">
                           <Terminal className="h-6 w-6" />
                        </button>
                     </div>

                     <div className="mt-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                           { label: "Daily Ops", value: "420", icon: LayoutGrid, color: "text-blue-400" },
                           { label: "AI Inference", value: "1.2K", icon: ScanLine, color: "text-primary" },
                           { label: "Ledger Volume", value: "84", icon: Wallet, color: "text-orange-400" },
                           { label: "Asset Skews", value: "3.2K", icon: Package, color: "text-indigo-400" },
                        ].map((stat, i) => (
                           <div key={i} className="space-y-2 group/item">
                              <div className="flex items-center gap-2">
                                 <stat.icon className={cn("h-4 w-4", stat.color)} />
                                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                              </div>
                              <p className="text-2xl font-black text-white group-hover/item:text-primary transition-colors tabular-nums">{stat.value}</p>
                              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "70%" }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className={cn("h-full rounded-full", stat.color.replace('text-', 'bg-'))} 
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </Card>
            </div>

            <div className="lg:col-span-4 space-y-8">
               <Card className="p-8 bg-white dark:bg-[#09090b] border-slate-200 dark:border-slate-800 h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Core Vitals
                     </h3>
                     <div className="flex gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <div className="h-1.5 w-1.5 rounded-full bg-primary opacity-50" />
                        <div className="h-1.5 w-1.5 rounded-full bg-primary opacity-20" />
                     </div>
                  </div>
                  
                  <div className="space-y-8 flex-1">
                     {[
                        { label: "Ledger Compute", status: "Optimal", val: 99, color: "primary" },
                        { label: "Vision Engine", status: "Active", val: 84, color: "blue" },
                        { label: "Stock Cluster", status: "Healthy", val: 72, color: "orange" },
                        { label: "API Latency", status: "12ms", val: 92, color: "emerald" },
                     ].map((sys, i) => (
                        <div key={i} className="space-y-3">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="text-slate-400">{sys.label}</span>
                              <span className={cn(
                                 sys.color === 'blue' ? "text-blue-500" : 
                                 sys.color === 'orange' ? "text-orange-500" : 
                                 "text-primary"
                              )}>{sys.status}</span>
                           </div>
                           <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${sys.val}%` }}
                                 transition={{ duration: 1.5, ease: "easeOut" }}
                                 className={cn("h-full rounded-full bg-primary", 
                                    sys.color === 'blue' && "bg-blue-500",
                                    sys.color === 'orange' && "bg-orange-500"
                                 )}
                              />
                           </div>
                        </div>
                     ))}
                  </div>

                  <button className="w-full mt-12 py-4 dark:bg-slate-900 bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary hover:border-primary/30 transition-all">
                     System Maintenance
                  </button>
               </Card>
            </div>
         </div>

         {/* Operational Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
               { label: "Pending Khata", val: "₹15,400", sub: "12 Clients", icon: Wallet, color: "orange" },
               { label: "Stock alerts", val: "12 Items", sub: "Critical Low", icon: Package, color: "red" },
               { label: "Global Reach", val: "2.4K", sub: "MTD Customers", icon: Users, color: "blue" },
            ].map((card, i) => (
               <Card key={i} className="p-8 bg-white dark:bg-[#09090b] border-slate-200 dark:border-slate-800 group cursor-pointer hover:border-primary/50 transition-all overflow-hidden relative">
                  <div className="flex items-center justify-between mb-8 relative z-10">
                     <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                        card.color === 'orange' ? "bg-orange-500/10 text-orange-500" :
                        card.color === 'red' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                     )}>
                        <card.icon className="h-7 w-7" />
                     </div>
                     <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="relative z-10">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{card.label}</p>
                     <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{card.val}</h3>
                     <p className={cn(
                        "text-[10px] font-bold mt-2 uppercase tracking-wide",
                        card.color === 'red' ? "text-red-500" : "text-slate-400"
                     )}>{card.sub}</p>
                  </div>
                  {/* Decorative element */}
                  <div className={cn(
                     "absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity",
                     card.color === 'orange' ? "bg-orange-500" :
                     card.color === 'red' ? "bg-red-500" : "bg-blue-500"
                  )} />
               </Card>
            ))}

            <div className="p-8 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 hover:border-primary/30 hover:text-primary transition-all cursor-pointer group bg-slate-50/30 dark:bg-transparent">
               <Plus className="h-10 w-10 mb-4 group-hover:rotate-90 transition-transform duration-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Extend Node</span>
            </div>
         </div>
      </div>
   )
}
