"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  UserPlus,
  Phone,
  X,
  History,
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  Plus,
  Minus,
  CheckCircle2,
  ExternalLink,
  MoreVertical,
  Calendar,
  Share2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface Customer {
  id: number
  name: string
  phone: string
  activity: string
  balance: number
  type: "get" | "give" | "settled"
  initial: string
  color: string
}

const initialCustomers: Customer[] = [
  { id: 1, name: "Ramesh Kumar", phone: "+91 98765 43210", activity: "2 mins ago", balance: 850, type: "get", initial: "RK", color: "indigo" },
  { id: 2, name: "Sita Devi", phone: "+91 98123 45678", activity: "Yesterday", balance: 200, type: "give", initial: "SD", color: "orange" },
  { id: 3, name: "Vikram Singh", phone: "+91 70000 11222", activity: "Oct 24, 2023", balance: 0, type: "settled", initial: "VS", color: "slate" },
  { id: 4, name: "Anjali Patel", phone: "+91 88888 99999", activity: "Oct 20, 2023", balance: 1250, type: "get", initial: "AP", color: "pink" },
]

export default function KhataPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  return (
    <div className="space-y-10 pb-12 relative overflow-hidden h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase leading-none">
             Digital <span className="text-primary tracking-normal">Khata</span> Ledger
           </h1>
           <p className="text-muted-foreground text-sm mt-1 font-medium italic">
             Managing 124 loyal customers • ₹57,680 total exposure
           </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="h-12 flex items-center gap-3 px-6 bg-foreground text-background rounded-2xl font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95 group">
              <Share2 className="h-4 w-4" />
              EXPORT REPORT
           </button>
           <button className="h-12 flex items-center gap-3 px-6 bg-primary hover:bg-primary-dark text-black rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
              <UserPlus className="h-5 w-5" />
              ADD NEW CUSTOMER
           </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <Card className="p-8 bg-card border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Plus className="h-16 w-16 text-emerald-500" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Receivables</p>
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">₹45,230.00</h3>
            <p className="text-[10px] font-bold text-muted-foreground mt-2">Expected collection within 7 days</p>
         </Card>
         <Card className="p-8 bg-card border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Minus className="h-16 w-16 text-red-500" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Payables</p>
            <h3 className="text-3xl font-black text-red-600 dark:text-red-400 tracking-tighter">₹12,450.00</h3>
            <p className="text-[10px] font-bold text-muted-foreground mt-2">Due to local vendors/suppliers</p>
         </Card>
         <Card className="p-8 bg-primary/5 dark:bg-primary/10 border-primary/20 border-dashed relative overflow-hidden group cursor-pointer hover:border-primary/40 transition-all">
            <div className="flex items-center gap-4">
               <div className="h-14 w-14 rounded-2xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
                  <Plus className="h-8 w-8" />
               </div>
               <div>
                  <h4 className="font-black text-foreground uppercase tracking-tighter leading-none mb-1">Quick Ledger</h4>
                  <p className="text-xs text-muted-foreground font-medium italic underline underline-offset-4">Add instant entry</p>
               </div>
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Customer List Column */}
         <div className="lg:col-span-12 space-y-6">
            <Card className="p-4 bg-card border-border">
               <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative flex-1 w-full">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <input 
                      type="text" 
                      placeholder="Search by name, phone, or location..." 
                      className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                     />
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                     <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-2xl text-xs font-bold text-muted-foreground hover:text-primary transition-all uppercase tracking-widest">
                        <Filter className="h-4 w-4" />
                        Filters
                     </button>
                  </div>
               </div>
            </Card>

            <Card className="bg-card border-border overflow-hidden shadow-2xl">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-muted/50 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                           <th className="px-8 py-6">Customer Profile</th>
                           <th className="px-6 py-6">Last Transaction</th>
                           <th className="px-6 py-6">Status</th>
                           <th className="px-6 py-6 font-black text-right pr-12">Net Balance</th>
                           <th className="px-6 py-6 text-right"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/50 font-medium">
                        {initialCustomers.map((customer) => (
                           <tr 
                            key={customer.id} 
                            onClick={() => setSelectedCustomer(customer)}
                            className="hover:bg-primary/5 transition-all cursor-pointer group"
                           >
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className={cn(
                                       "h-14 w-14 rounded-[1.5rem] flex items-center justify-center font-black text-lg transition-transform group-hover:scale-105 group-hover:rotate-3 shadow-lg",
                                       customer.color === "indigo" ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300" :
                                       customer.color === "orange" ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400" :
                                       customer.color === "pink" ? "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300" :
                                       "bg-muted text-muted-foreground shadow-none"
                                    )}>
                                       {customer.initial}
                                    </div>
                                    <div>
                                       <h4 className="font-black text-foreground text-lg tracking-tight leading-none mb-1.5">{customer.name}</h4>
                                       <p className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Phone className="h-3 w-3" /> {customer.phone}
                                       </p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-6">
                                 <div className="flex items-center gap-2 text-sm text-foreground/80">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {customer.activity}
                                 </div>
                              </td>
                              <td className="px-6 py-6">
                                 <span className={cn(
                                   "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                   customer.balance === 0 ? "bg-muted text-muted-foreground" :
                                   customer.type === 'get' ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                                   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                 )}>
                                    <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", 
                                      customer.balance === 0 ? "bg-muted-foreground/50" :
                                      customer.type === 'get' ? "bg-red-500" : "bg-emerald-500"
                                    )} />
                                    {customer.type === 'get' ? "You get" : customer.type === 'give' ? "You give" : "Settled"}
                                 </span>
                              </td>
                              <td className="px-6 py-6 text-right pr-12">
                                 <div className={cn("text-xl font-black tracking-tighter", 
                                   customer.balance === 0 ? "text-muted-foreground/50" :
                                   customer.type === 'get' ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                                 )}>
                                    ₹ {customer.balance.toLocaleString()}.00
                                 </div>
                              </td>
                              <td className="px-6 py-6 text-right">
                                 <button className="p-3 text-muted-foreground/30 hover:text-primary transition-all hover:bg-primary/10 rounded-2xl">
                                    <ChevronRight className="h-6 w-6" />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>
         </div>
      </div>

      {/* Customer Side Drawer Overlay */}
      <AnimatePresence>
         {selectedCustomer && (
            <>
               <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCustomer(null)}
                className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[60]"
               />
               <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-screen w-full md:w-[600px] bg-card shadow-2xl z-[70] border-l border-border flex flex-col"
               >
                  <div className="p-8 border-b border-border bg-muted/50 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <History className="h-48 w-48 text-primary" />
                     </div>
                     <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="absolute top-6 right-6 p-3 bg-card border border-border rounded-2xl text-muted-foreground hover:text-red-500 transition-all hover:rotate-90"
                     >
                        <X className="h-6 w-6" />
                     </button>
                     
                     <div className="flex items-center gap-6 mb-10">
                        <div className={cn(
                          "h-24 w-24 rounded-[2.5rem] flex items-center justify-center font-black text-3xl shadow-2xl",
                          selectedCustomer.color === "indigo" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-500" :
                          selectedCustomer.color === "orange" ? "bg-orange-100 dark:bg-orange-900 text-orange-500" :
                          "bg-muted text-muted-foreground"
                        )}>
                           {selectedCustomer.initial}
                        </div>
                        <div>
                           <h2 className="text-4xl font-black text-foreground tracking-tighter leading-none mb-3">{selectedCustomer.name}</h2>
                           <div className="flex items-center gap-6">
                              <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                 <Phone className="h-4 w-4 text-primary" /> {selectedCustomer.phone}
                              </p>
                              <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                 <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Verified 
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-card rounded-[2rem] border border-border shadow-inner">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Current Balance</p>
                           <h4 className={cn("text-3xl font-black tracking-tighter", 
                             selectedCustomer.type === 'get' ? "text-red-600" : "text-emerald-600"
                           )}>₹{selectedCustomer.balance.toLocaleString()}.00</h4>
                           <span className="text-[10px] font-black text-muted-foreground/60 uppercase">{selectedCustomer.type === 'get' ? "Pending recovery" : "Safe payout"}</span>
                        </div>
                        <div className="p-6 bg-card rounded-[2rem] border border-border shadow-inner">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Last Settled</p>
                           <h4 className="text-3xl font-black text-foreground tracking-tighter italic">24 Oct</h4>
                           <span className="text-[10px] font-black text-muted-foreground/60 uppercase">Automated sync</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-card">
                     <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] text-center mb-10">— TRANSACTION LEDGER —</h3>
                     <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((item, i) => (
                           <div key={i} className="group relative flex gap-6">
                              <div className="flex flex-col items-center gap-2">
                                 <div className={cn("h-4 w-4 rounded-full border-4 border-background shadow-sm z-10", i % 2 === 0 ? "bg-red-500" : "bg-emerald-500")} />
                                 {i < 4 && <div className="w-0.5 flex-1 bg-border rounded-full" />}
                              </div>
                              <div className="flex-1 pb-10">
                                 <div className="bg-muted/50 p-6 rounded-[2rem] border border-border group-hover:border-primary/30 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                       <div>
                                          <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">TXN #{1024 + i}</p>
                                          <h5 className="font-black text-foreground uppercase tracking-tight">Purchase: Grocery Combo</h5>
                                       </div>
                                       <span className={cn("text-lg font-black tracking-tighter", i % 2 === 0 ? "text-red-600" : "text-emerald-600")}>
                                          {i % 2 === 0 ? "-" : "+"} ₹{450 * (i + 1)}.00
                                       </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border border-dashed">
                                       <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                                          <Calendar className="h-3 w-3" /> Oct {24 - i}, 10:45 AM
                                       </div>
                                       <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
                                          View Bill <ExternalLink className="h-3 w-3" />
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 border-t border-border bg-card safe-area-bottom">
                     <div className="grid grid-cols-2 gap-6 mb-4">
                        <button className="h-16 bg-red-500 text-white rounded-3xl font-black text-sm shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                           <Minus className="h-5 w-5" />
                           YOU GAVE (OUT)
                        </button>
                        <button className="h-16 bg-emerald-500 text-white rounded-3xl font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                           <Plus className="h-5 w-5" />
                           YOU GOT (IN)
                        </button>
                     </div>
                     <button className="w-full h-16 bg-[#25D366] text-white rounded-3xl font-black text-sm shadow-xl shadow-emerald-900/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
                        <MessageCircle className="h-6 w-6" />
                        SEND WHATSAPP REMINDER
                     </button>
                  </div>
               </motion.aside>
            </>
         )}
      </AnimatePresence>
    </div>
  )
}
