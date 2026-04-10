"use client"

import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Store, 
  CheckCircle, 
  Clock, 
  CircleX,
  MapPin,
  ExternalLink,
  Download,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  CreditCard
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const merchants = [
  { id: "M-9283", name: "Kirana Mart", owner: "Ramesh Sharma", location: "HSR Layout, Bangalore", status: "Active", joined: "Oct 12, 2023", revenue: "₹84,200", plan: "Business Pro", growth: "+12%" },
  { id: "M-9284", name: "Modern Electronics", owner: "Sita Devi", location: "Gachibowli, Hyderabad", status: "Pending", joined: "Oct 22, 2023", revenue: "₹0", plan: "Starter", growth: "0%" },
  { id: "M-9285", name: "The Daily Needs", owner: "Vikram Singh", location: "Indiranagar, Bangalore", status: "Active", joined: "Sep 05, 2023", revenue: "₹1,24,500", plan: "Enterprise", growth: "+45%" },
  { id: "M-9286", name: "Sharma Textiles", owner: "Anjali Patel", location: "Chandni Chowk, Delhi", status: "Suspended", joined: "Aug 14, 2023", revenue: "₹2,10,000", plan: "Business Pro", growth: "-5%" },
  { id: "M-9287", name: "Fresh Fruits Co.", owner: "Mohan Lal", location: "Salt Lake, Kolkata", status: "Active", joined: "Nov 01, 2023", revenue: "₹12,400", plan: "Starter", growth: "+8%" },
]

export default function MerchantManagementPage() {
  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                 <Store className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Ecosystem Management</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
             Merchant <span className="text-primary italic">Central</span>
           </h1>
           <p className="text-muted-foreground text-sm mt-3 font-medium max-w-lg leading-relaxed">
             Onboard, monitor, and manage all business entities across the platform with unified control.
           </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <button className="flex items-center gap-3 px-6 py-3.5 bg-card border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground hover:shadow-xl transition-all shadow-sm">
              <Download className="h-4 w-4 text-primary" />
              Export Directory
           </button>
           <button className="bg-primary hover:bg-emerald-600 text-primary-foreground px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center gap-3 transition-all hover:-translate-y-1 active:translate-y-0">
              <Plus className="h-5 w-5" />
              Onboard Merchant
           </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: "Total Partners", value: "1,240", sub: "Global Network", icon: Users, color: "primary" },
           { label: "Gross Volume", value: "₹4.8 Cr", sub: "Monthly Revenue", icon: CreditCard, color: "blue" },
           { label: "Success Rate", value: "98.4%", sub: "Service Health", icon: ShieldCheck, color: "emerald" },
         ].map((stat, i) => (
            <Card key={i} className="p-8 bg-card border-border/50 shadow-xl rounded-[2rem] group relative overflow-hidden transition-all hover:scale-[1.02]">
               <div className="absolute right-0 top-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform">
                  <stat.icon className="h-20 w-20 text-primary" />
               </div>
               <div className="relative z-10 flex items-center gap-5">
                  <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg",
                    stat.color === 'primary' ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  )}>
                     <stat.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">{stat.label}</p>
                    <h3 className="text-3xl font-black text-foreground tracking-tighter leading-none italic">{stat.value}</h3>
                  </div>
               </div>
            </Card>
         ))}
      </div>

      {/* Main Merchant Hub */}
      <Card className="bg-card border-border/50 shadow-2xl rounded-[3rem] overflow-hidden">
         {/* Table Toolbar */}
         <div className="p-10 border-b border-border/50 flex flex-col xl:flex-row items-center gap-8 bg-muted/20">
            <div className="relative flex-1 w-full group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search by ID, store name, or owner..." 
                 className="w-full pl-14 pr-6 py-4 bg-muted/50 border border-border rounded-2xl text-[11px] font-bold text-foreground focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-muted-foreground/60 uppercase tracking-widest"
               />
            </div>
            <div className="flex items-center gap-4 w-full xl:w-auto">
               <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground bg-card hover:shadow-xl transition-all">
                  <Filter className="h-4 w-4 text-primary" />
                  Apply Filters
               </button>
               <div className="h-10 w-px bg-border/50 hidden md:block" />
               <div className="flex-1 md:flex-none flex items-center bg-muted border border-border rounded-2xl p-1.5 gap-2">
                  {['All Status', 'Active', 'Pending'].map((t, i) => (
                    <button key={t} className={cn(
                      "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", 
                      i === 0 ? "bg-card text-primary shadow-lg border border-border" : "text-muted-foreground hover:text-foreground"
                    )}>
                      {t}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Merchants Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-muted/30 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                     <th className="px-10 py-6">ENTITY / IDENTIFIER</th>
                     <th className="px-8 py-6">GEOLOCATION</th>
                     <th className="px-8 py-6 text-center">STATUS MATRIX</th>
                     <th className="px-8 py-6 text-center">SERVICE PLAN</th>
                     <th className="px-8 py-6">PERFORMANCE (MTD)</th>
                     <th className="px-10 py-6 text-right">OPERATIONS</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/30">
                  {merchants.map((m) => (
                     <tr key={m.id} className="hover:bg-muted/40 transition-all group cursor-pointer">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-5">
                              <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all shadow-inner group-hover:shadow-primary/10">
                                 <Store className="h-7 w-7" />
                              </div>
                              <div>
                                 <h4 className="font-black text-foreground text-lg tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">{m.name}</h4>
                                 <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">
                                    <span className="text-primary italic opacity-70">{m.id}</span>
                                    <span>•</span>
                                    <span>{m.owner}</span>
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground tracking-tight">
                              <MapPin className="h-4 w-4 text-primary opacity-50" />
                              {m.location}
                           </div>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <span className={cn(
                             "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                             m.status === 'Active' ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                             m.status === 'Pending' ? "bg-orange-500 text-white shadow-orange-500/20" :
                             "bg-red-500 text-white shadow-red-500/20"
                           )}>
                              {m.status === 'Active' ? <CheckCircle className="h-3 w-3" /> : 
                               m.status === 'Pending' ? <Clock className="h-3 w-3" /> : <CircleX className="h-3 w-3" />}
                              {m.status}
                           </span>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <span className="text-[10px] font-black text-foreground px-4 py-1.5 bg-muted border border-border rounded-full uppercase tracking-widest shadow-inner">{m.plan}</span>
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex items-center gap-3">
                              <div className="text-base font-black text-foreground tracking-tighter italic">{m.revenue}</div>
                              <span className={cn(
                                "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                                m.growth.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : m.growth === '0%' ? "text-muted-foreground" : "bg-red-500/10 text-red-500"
                              )}>
                                 {m.growth}
                              </span>
                           </div>
                           <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Joined: {m.joined}</p>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex items-center justify-end gap-3">
                              <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted border border-border text-muted-foreground hover:text-primary hover:bg-card hover:shadow-lg transition-all active:scale-95 group/btn">
                                 <ExternalLink className="h-4 w-4" />
                                 <span className="sr-only">View Store</span>
                              </button>
                              <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-card hover:shadow-lg transition-all active:scale-95 group/btn">
                                 <MoreVertical className="h-4 w-4" />
                                 <span className="sr-only">Actions</span>
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         {/* Table Footer */}
         <div className="p-10 bg-muted/20 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Showing <span className="text-foreground tracking-normal font-black">5</span> of <span className="text-foreground tracking-normal font-black">1,240</span> Strategic Partners
            </p>
            <div className="flex gap-4">
               <button className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground bg-muted border border-border transition-all">Previous Block</button>
               <button className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-primary shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all">Next Stream</button>
            </div>
         </div>
      </Card>
    </div>
  )
}
