"use client"

import { 
  Truck, 
  Package, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  MapPin,
  Box,
  ShoppingBag,
  ArrowUpRight,
  Plus
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")

  const orders = [
    { id: "ORD-7721", customer: "Rajesh Kumar", items: 3, total: "₹4,250", status: "processing", date: "2 mins ago", type: "Delivery" },
    { id: "ORD-7720", customer: "Anita Sharma", items: 1, total: "₹1,200", status: "shipped", date: "45 mins ago", type: "Pickup" },
    { id: "ORD-7719", customer: "Vikas Singh", items: 5, total: "₹12,400", status: "delivered", date: "2 hours ago", type: "Delivery" },
    { id: "ORD-7718", customer: "Sunita Reddy", items: 2, total: "₹3,150", status: "pending", date: "3 hours ago", type: "Delivery" },
    { id: "ORD-7717", customer: "Karan Johar", items: 1, total: "₹850", status: "delivered", date: "5 hours ago", type: "Pickup" },
    { id: "ORD-7716", customer: "Priya Patel", items: 4, total: "₹6,700", status: "cancelled", date: "Yesterday", type: "Delivery" },
  ]

  const statusColors: any = {
    pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    shipped: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <Truck className="h-3 w-3" />
            Logistic Control Layer
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
            Order <span className="text-primary italic">Manifest</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">
            Manage your incoming requests and fulfillment pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search by ID or Name..."
              className="h-12 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 text-xs dark:text-slate-300 focus:outline-none focus:border-primary/30 transition-all shadow-sm"
            />
          </div>
          <button className="h-12 px-6 bg-primary hover:bg-emerald-600 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Manual Order
          </button>
        </div>
      </div>

      {/* Fulfillment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Orders", value: "24", sub: "Currently processing", icon: ShoppingBag, color: "blue" },
          { label: "In Transit", value: "12", sub: "Dispatched to clients", icon: Truck, color: "indigo" },
          { label: "Fulfillment Rate", value: "98.2%", sub: "MTD Performance", icon: CheckCircle2, color: "primary" },
          { label: "Pending Review", value: "05", sub: "Awaiting approval", icon: Clock, color: "orange" },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-white dark:bg-[#09090b] border-slate-200 dark:border-slate-800 group hover:border-primary/50 transition-all overflow-hidden relative">
            <div className="relative z-10 flex flex-col h-full">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                stat.color === 'primary' ? "bg-primary/10 text-primary" :
                stat.color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                stat.color === 'indigo' ? "bg-indigo-500/10 text-indigo-500" : "bg-orange-500/10 text-orange-500"
              )}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 tabular-nums">{stat.value}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Order Shard */}
      <Card className="bg-white dark:bg-[#09090b] border-slate-200 dark:border-slate-800 overflow-hidden relative">
        {/* Tab Controls */}
        <div className="px-8 pt-8 border-b border-slate-100 dark:border-slate-900">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                 <Box className="h-5 w-5 text-primary" />
                 Processing Queue
              </h3>
              <div className="flex gap-2">
                 <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                    <Filter className="h-4 w-4 text-slate-500" />
                 </button>
              </div>
           </div>

           <div className="flex gap-8 overflow-x-auto scrollbar-none pb-px">
              {["all", "pending", "processing", "shipped", "delivered"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                    activeTab === tab ? "text-primary px-2" : "text-slate-500 hover:text-slate-400"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="order-tab-pill"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_10px_rgba(5,148,103,1)]" 
                    />
                  )}
                </button>
              ))}
           </div>
        </div>

        {/* Order Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-900 bg-slate-50/30 dark:bg-transparent">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Path</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Package Alpha</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
               {orders
                .filter(o => activeTab === "all" || o.status === activeTab)
                .map((order, i) => (
                 <tr key={i} className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group">
                   <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                         <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">{order.id}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{order.date}</span>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                            <MapPin className="h-4 w-4" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-900 dark:text-white">{order.customer}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{order.type}</span>
                         </div>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                         <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{order.items} Units</span>
                         <span className="text-xs font-black text-primary tabular-nums">{order.total}</span>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <span className={cn(
                        "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter border",
                        statusColors[order.status]
                      )}>
                        {order.status}
                      </span>
                   </td>
                   <td className="px-8 py-6 text-right">
                      <button className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                         <ExternalLink className="h-4 w-4" />
                      </button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>

        {/* Empty State Projection */}
        {orders.filter(o => activeTab === "all" || o.status === activeTab).length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
             <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center mb-6 border border-dashed border-slate-200 dark:border-slate-800">
                <AlertCircle className="h-10 w-10 text-slate-300" />
             </div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching orders in this sector</p>
             <button className="mt-4 text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Reset Core Filters</button>
          </div>
        )}
      </Card>

      {/* Logistics Partner Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="p-8 bg-gradient-to-br from-indigo-900 to-slate-950 border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
               <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  <ArrowUpRight className="h-6 w-6" />
               </div>
            </div>
            <div className="relative z-10 space-y-4">
               <div>
                  <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Partner Optimization</p>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Fleet Intelligence</h3>
               </div>
               <p className="text-indigo-100/60 text-xs leading-relaxed max-w-sm font-medium">
                  Connect your preferred logistics providers to automate fulfillment routing and real-time tracking sharding.
               </p>
               <button className="mt-4 px-6 py-3 bg-white text-indigo-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-500/20">
                  Connect Node
               </button>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Truck className="h-40 w-40 text-white fill-white" />
            </div>
         </Card>

         <Card className="p-8 bg-white dark:bg-[#09090b] border-slate-200 dark:border-slate-800 flex flex-col justify-center">
            <div className="flex items-center gap-6 mb-6">
               <div className="h-14 w-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
                  <AlertCircle className="h-8 w-8" />
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Critical Warnings</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System generated alerts</p>
               </div>
            </div>
            <div className="space-y-3">
               <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">3 Orders exceeding SLA fulfillment window</span>
               </div>
               <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">1 Cancelled order requires inventory audit</span>
               </div>
            </div>
         </Card>
      </div>
    </div>
  )
}
