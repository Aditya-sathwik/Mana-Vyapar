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
  PieChart
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function MerchantPerformanceAnalytics() {
  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Performance Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Deep dive into merchant growth, retention metrics, and market penetration.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">
              <Calendar className="h-4 w-4" />
              Full Year 2023
           </button>
           <button className="bg-primary hover:bg-primary-dark text-black px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
              <Download className="h-4 w-4" />
              Export Analytics
           </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Users className="h-20 w-20" />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center mb-6">
               <TrendingUp className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-widest">Merchant Growth</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">12.4%</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
               <span className="bg-indigo-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" />
                  842 New signups
               </span>
               <span className="text-slate-400">Since last quarter</span>
            </div>
         </Card>

         <Card className="p-8 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <ShoppingBag className="h-20 w-20" />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6">
               <Target className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-widest">Average Transaction</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">₹1,450</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
               <span className="bg-emerald-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5.2%
               </span>
               <span className="text-slate-400">Per merchant basket</span>
            </div>
         </Card>

         <Card className="p-8 bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Zap className="h-20 w-20" />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-pink-500/20 text-pink-500 flex items-center justify-center mb-6">
               <TrendingUpDown className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-widest">Churn Rate</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">2.1%</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-pink-400">
               <span className="bg-pink-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -0.4%
               </span>
               <span className="text-slate-400">Industry leading retention</span>
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Detailed Analytics */}
         <Card className="lg:col-span-8 p-8 bg-white dark:bg-[#09090b] border-primary/10">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <PieChart className="h-6 w-6 text-primary" />
                  Merchant Distribution
               </h3>
               <button className="text-slate-300 hover:text-slate-600"><MoreVertical className="h-5 w-5" /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div className="relative aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[20px] border-primary/10"></div>
                  <div className="absolute inset-0 rounded-full border-[20px] border-emerald-500/40 border-t-transparent border-l-transparent rotate-12"></div>
                  <div className="absolute inset-0 rounded-full border-[20px] border-indigo-500/60 border-b-transparent border-r-transparent -rotate-45"></div>
                  <div className="flex flex-col items-center">
                     <span className="text-4xl font-black text-slate-900 dark:text-white">12.4K</span>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Merchants</span>
                  </div>
               </div>

               <div className="space-y-6">
                  {[
                    { category: "Retail & Grocery", percentage: "42%", count: "5,208", color: "bg-primary" },
                    { category: "Electronics", percentage: "18%", count: "2,232", color: "bg-indigo-500" },
                    { category: "Textiles", percentage: "25%", count: "3,100", color: "bg-emerald-500" },
                    { category: "Other", percentage: "15%", count: "1,860", color: "bg-slate-400" },
                  ].map((cat) => (
                    <div key={cat.category} className="space-y-2">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className={cn("h-3 w-3 rounded-full", cat.color)} />
                             <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cat.category}</span>
                          </div>
                          <span className="text-sm font-black text-slate-900 dark:text-white">{cat.percentage}</span>
                       </div>
                       <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", cat.color)} style={{ width: cat.percentage }}></div>
                       </div>
                       <p className="text-[10px] text-slate-400 font-medium text-right">{cat.count} stores onboarded</p>
                    </div>
                  ))}
               </div>
            </div>
         </Card>

         {/* Market Insight */}
         <Card className="lg:col-span-4 p-8 bg-white dark:bg-[#09090b] border-primary/10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Regional Insight</h3>
            <div className="space-y-6">
               {[
                 { city: "Bangalore", share: "34%", status: "High Growth", color: "blue" },
                 { city: "Hyderabad", share: "22%", status: "Stable", color: "emerald" },
                 { city: "Mumbai", share: "18%", status: "Expanding", color: "primary" },
                 { city: "Delhi", share: "14%", status: "Saturated", color: "orange" },
               ].map((region) => (
                 <div key={region.city} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-4">
                       <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 uppercase font-black text-xs",
                        region.color === 'blue' ? "bg-blue-100 text-blue-600" :
                        region.color === 'emerald' ? "bg-emerald-100 text-emerald-600" :
                        region.color === 'primary' ? "bg-primary/10 text-primary" : "bg-orange-100 text-orange-600"
                       )}>
                          {region.city.substring(0, 2)}
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{region.city}</h4>
                          <p className="text-[10px] text-slate-500">{region.status}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-slate-900 dark:text-white">{region.share}</p>
                       <p className="text-[10px] text-slate-400">Total Share</p>
                    </div>
                 </div>
               ))}
               <button className="w-full py-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-500 hover:text-primary transition-colors">
                  View Heatmap Details
               </button>
            </div>
         </Card>
      </div>
    </div>
  )
}
