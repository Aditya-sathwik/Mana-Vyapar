"use client"

import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  TrendingUpDown,
  Calendar,
  Download,
  Filter,
  Users,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  MoreVertical,
  Zap,
  Target,
  PieChart,
  LayoutGrid,
  MapPin
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function MerchantPerformanceAnalytics() {
  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                 <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Market Intelligence Engine</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none italic">
             Performance <span className="text-primary tracking-normal">Metrics</span>
           </h1>
           <p className="text-muted-foreground text-sm mt-4 font-medium max-w-lg leading-relaxed italic opacity-80">
             Deep dive into merchant growth dynamics, transactional retention matrix, and regional market penetration.
           </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <button className="h-14 px-8 bg-card border border-border rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground hover:shadow-xl transition-all shadow-sm active:scale-95">
              <Calendar className="h-4 w-4 text-primary" />
              FY 2026 CYCLE
           </button>
           <button className="h-14 px-10 bg-primary hover:bg-emerald-600 text-primary-foreground rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
              <Download className="h-4 w-4" />
              Export Analytics
           </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: "Merchant Growth", value: "12.4%", sub: "842 New signups", icon: Users, color: "indigo" },
           { label: "Average Transaction", value: "₹1,450", sub: "+5.2% Per basket", icon: ShoppingBag, color: "emerald" },
           { label: "Churn Matrix", value: "2.1%", sub: "-0.4% Retention Up", icon: TrendingUpDown, color: "pink" },
         ].map((stat, i) => (
           <Card key={i} className="p-10 bg-card border-border/50 shadow-xl rounded-[2.5rem] group relative overflow-hidden transition-all hover:scale-[1.02]">
              <div className="absolute right-0 top-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform">
                 <stat.icon className="h-24 w-24 text-primary" />
              </div>
              
              <div className={cn(
                "h-16 w-16 rounded-2xl flex items-center justify-center mb-10 shadow-lg transition-transform group-hover:scale-110",
                stat.color === 'indigo' ? "bg-indigo-500 text-white shadow-indigo-500/20" :
                stat.color === 'emerald' ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                "bg-pink-500 text-white shadow-pink-500/20"
              )}>
                 <stat.icon className="h-8 w-8" />
              </div>
              
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2 opacity-60 italic">{stat.label}</p>
              <h3 className="text-5xl font-black text-foreground tracking-tighter mb-6 italic leading-none">{stat.value}</h3>
              
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary italic bg-primary/5 border border-primary/10 w-fit px-4 py-1.5 rounded-full">
                 <ArrowRight className="h-3.5 w-3.5" />
                 {stat.sub}
              </div>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Detailed Analytics */}
         <Card className="lg:col-span-8 p-12 bg-card border-border/50 shadow-2xl rounded-[3rem] relative overflow-hidden">
            <div className="flex items-center justify-between mb-16 relative z-10">
               <div>
                  <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none italic mb-2">Merchant Distribution</h3>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">Revenue sharding across core business verticals.</p>
               </div>
               <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-all"><MoreVertical className="h-6 w-6" /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
               <div className="relative aspect-square flex items-center justify-center p-8">
                  {/* High-Fidelity Custom Chart visualization using CSS borders */}
                  <div className="absolute inset-0 rounded-full border-[30px] border-muted shadow-inner opacity-50"></div>
                  <div className="absolute inset-0 rounded-full border-[30px] border-primary border-t-transparent border-l-transparent rotate-[30deg] shadow-[0_0_30px_rgba(5,148,103,0.3)]"></div>
                  <div className="absolute inset-0 rounded-full border-[30px] border-indigo-500 border-b-transparent border-r-transparent -rotate-45 shadow-[0_0_30px_rgba(79,70,229,0.3)]"></div>
                  
                  <div className="flex flex-col items-center relative z-20">
                     <span className="text-5xl font-black text-foreground tracking-tighter leading-none italic transition-transform hover:scale-110 cursor-default">12.4K</span>
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-3">Active Units</span>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(5,148,103,1)] animate-pulse" />
               </div>

               <div className="space-y-8">
                  {[
                    { category: "Retail & Grocery", percentage: "42%", count: "5,208", color: "bg-primary" },
                    { category: "Electronics", percentage: "18%", count: "2,232", color: "bg-indigo-500" },
                    { category: "Textiles", percentage: "25%", count: "3,100", color: "bg-emerald-500" },
                    { category: "Miscellaneous", percentage: "15%", count: "1,860", color: "bg-muted" },
                  ].map((cat) => (
                    <div key={cat.category} className="space-y-3 group cursor-pointer">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className={cn("h-4 w-4 rounded-md shadow-sm group-hover:scale-125 transition-transform", cat.color)} />
                             <span className="text-[11px] font-black text-foreground uppercase tracking-widest">{cat.category}</span>
                          </div>
                          <span className="text-sm font-black text-foreground italic">{cat.percentage}</span>
                       </div>
                       <div className="w-full bg-muted border border-border h-2.5 rounded-full overflow-hidden shadow-inner p-0.5">
                          <div className={cn("h-full rounded-full transition-all duration-1000", cat.color)} style={{ width: cat.percentage }}></div>
                       </div>
                       <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none italic">{cat.count} verified entities</p>
                          <ArrowRight className="h-3 w-3 text-primary" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </Card>

         {/* Regional Penetration Matrix */}
         <Card className="lg:col-span-4 p-10 bg-card border-border/50 shadow-2xl rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
               <MapPin className="h-48 w-48 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase leading-none italic mb-10 relative z-10 flex items-center gap-4">
               <Target className="h-6 w-6 text-primary" />
               Regional Pulse
            </h3>
            
            <div className="space-y-5 relative z-10">
               {[
                 { city: "Bangalore", share: "34%", status: "High Growth", color: "blue" },
                 { city: "Hyderabad", share: "22%", status: "Stable Cluster", color: "emerald" },
                 { city: "Mumbai", share: "18%", status: "Expanding", color: "primary" },
                 { city: "Delhi Capital", share: "14%", status: "Saturated", color: "orange" },
               ].map((region) => (
                 <div key={region.city} className="p-6 rounded-[2rem] bg-muted/30 border border-border/50 flex items-center justify-between group cursor-pointer hover:bg-card hover:shadow-2xl transition-all relative overflow-hidden">
                    <div className="flex items-center gap-5 relative z-10">
                       <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-[11px] uppercase tracking-tighter border shadow-sm group-hover:scale-110 transition-transform",
                        region.color === 'blue' ? "bg-blue-500 text-white border-blue-400/30" :
                        region.color === 'emerald' ? "bg-emerald-500 text-white border-emerald-400/30" :
                        region.color === 'primary' ? "bg-primary text-primary-foreground border-primary/30" : "bg-orange-500 text-white border-orange-400/30"
                       )}>
                          {region.city.substring(0, 2)}
                       </div>
                       <div>
                          <h4 className="font-black text-foreground text-sm uppercase tracking-tight mb-1">{region.city}</h4>
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic opacity-60 leading-none">{region.status}</p>
                       </div>
                    </div>
                    <div className="text-right relative z-10">
                       <p className="text-xl font-black text-foreground italic leading-none mb-1">{region.share}</p>
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Portfolio</p>
                    </div>
                    <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                 </div>
               ))}
               <button className="w-full mt-10 h-14 border-2 border-dashed border-border rounded-3xl text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95 italic">
                  Launch Global Penetration Map
               </button>
            </div>
         </Card>
      </div>
    </div>
  )
}
