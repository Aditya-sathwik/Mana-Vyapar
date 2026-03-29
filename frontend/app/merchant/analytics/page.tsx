"use client"

import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Filter, 
  Download, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Clock,
  ChevronRight,
  Target,
  Zap,
  DollarSign,
  ShoppingCart,
  Users
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function SalesDataPage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <LineChart className="h-3 w-3" />
            Performance Intelligence v4.0
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
            Sales <span className="text-primary italic">Intelligence</span>
          </h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest italic">
            Deep dive into your revenue streams and transaction patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-12 px-4 bg-card border border-border rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </button>
          <button className="h-12 px-6 bg-primary hover:bg-emerald-600 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Download className="h-4 w-4 inline mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Net Revenue", value: "₹4,82,500", growth: "+18%", icon: DollarSign, color: "primary" },
          { label: "Avg. Order Value", value: "₹1,240", growth: "+5%", icon: ShoppingCart, color: "blue" },
          { label: "Total Transactions", value: "3,842", growth: "+22%", icon: Zap, color: "orange" },
          { label: "Retention Rate", value: "78%", growth: "+2.4%", icon: Users, color: "purple" },
        ].map((metric, i) => (
          <Card key={i} className="p-6 bg-card border-border group hover:border-primary/50 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center",
                metric.color === 'primary' ? "bg-primary/10 text-primary" :
                metric.color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                metric.color === 'orange' ? "bg-orange-500/10 text-orange-500" : "bg-purple-500/10 text-purple-500"
              )}>
                <metric.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="h-3 w-3" />
                {metric.growth}
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{metric.label}</p>
              <h3 className="text-3xl font-black text-foreground tracking-tighter tabular-nums">{metric.value}</h3>
            </div>
            {/* Background Accent */}
            <div className={cn(
              "absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity",
              metric.color === 'primary' ? "bg-primary" :
              metric.color === 'blue' ? "bg-blue-500" :
              metric.color === 'orange' ? "bg-orange-500" : "bg-purple-500"
            )} />
          </Card>
        ))}
      </div>

      {/* Main Charts Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Visualization */}
        <Card className="lg:col-span-2 p-8 bg-card border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <div className="flex gap-2">
                {['D', 'W', 'M', 'Y'].map(t => (
                  <button key={t} className={cn("h-8 w-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all", t === 'W' ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted")}>{t}</button>
                ))}
             </div>
          </div>
          
          <div className="space-y-1 mb-10">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              Revenue Velocity
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Weighted Transaction Flow per Week</p>
          </div>

          <div className="h-[300px] w-full flex items-end justify-between gap-4 pt-4">
            {[40, 65, 45, 90, 55, 100, 75].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full relative flex flex-col items-center justify-end h-full">
                   {/* Bar Container */}
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                    className="w-full bg-muted rounded-t-2xl group-hover:bg-primary/20 transition-all relative overflow-hidden border border-transparent group-hover:border-primary/10" 
                  >
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary/40 to-primary/0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter group-hover:text-primary transition-colors">Week 0{i+1}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products Shard */}
        <Card className="p-8 bg-card border-border">
          <div className="space-y-1 mb-8">
             <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
               <Target className="h-5 w-5 text-primary" />
               High Yield Ops
             </h3>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Top conversion Products</p>
          </div>

          <div className="space-y-6">
            {[
              { name: "Electronics Bundle", sales: "₹1.2M", share: 45, color: "primary" },
              { name: "Smart Home Kit", sales: "₹840K", share: 30, color: "blue" },
              { name: "IoT Sensors", sales: "₹420K", share: 15, color: "orange" },
              { name: "Cloud Subs", sales: "₹210K", share: 10, color: "purple" },
            ].map((item, i) => (
              <div key={i} className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground/80 group-hover:text-primary transition-colors">{item.name}</span>
                  <span className="text-[10px] font-black tabular-nums">{item.sales}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.share}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className={cn(
                      "h-full rounded-full",
                      item.color === 'primary' ? "bg-primary" :
                      item.color === 'blue' ? "bg-blue-500" :
                      item.color === 'orange' ? "bg-orange-500" : "bg-purple-500"
                    )} 
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-12 py-4 bg-muted border border-border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
            Full Inventory Report
          </button>
        </Card>
      </div>

      {/* Recent High-Value Transactions */}
      <Card className="bg-card border-border overflow-hidden">
         <div className="p-8 border-b border-border flex justify-between items-center">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
               <Clock className="h-5 w-5 text-primary" />
               Recent Transaction Stream
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Cluster</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-border/50">
                     <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Transaction ID</th>
                     <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Client Alias</th>
                     <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amount</th>
                     <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                     <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Node Path</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                  {[
                     { id: "#TX-9042", user: "Rajesh K.", amount: "₹42,500", status: "Verified", node: "RJ-1024-A" },
                     { id: "#TX-9041", user: "Anita M.", amount: "₹12,200", status: "Verified", node: "RJ-1024-B" },
                     { id: "#TX-9040", user: "Vikas S.", amount: "₹8,400", status: "Processing", node: "RJ-1024-A" },
                     { id: "#TX-9039", user: "Deepak P.", amount: "₹1,24,000", status: "Verified", node: "RJ-1024-C" },
                  ].map((tx, i) => (
                     <tr key={i} className="hover:bg-muted/50 transition-colors group">
                        <td className="px-8 py-5 text-xs font-bold text-muted-foreground tabular-nums">{tx.id}</td>
                        <td className="px-8 py-5 text-xs font-black text-foreground">{tx.user}</td>
                        <td className="px-8 py-5 text-xs font-black text-foreground tabular-nums">{tx.amount}</td>
                        <td className="px-8 py-5">
                           <span className={cn(
                              "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
                              tx.status === 'Verified' ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
                           )}>
                              {tx.status}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors">{tx.node}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  )
}
