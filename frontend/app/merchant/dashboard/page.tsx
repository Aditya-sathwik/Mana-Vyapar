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
   ShieldCheck,
   Loader2,
   HeadphonesIcon
} from "lucide-react"
import { apiFetch } from "@/lib/api-client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"
import { useDashboard } from "@/hooks/use-dashboard"
import { useAuth } from "@/context/auth-context"
import { useEffect } from "react"

export default function DashboardPage() {
   const { data, loading, error } = useDashboard();
   const { user } = useAuth();

   // 🚀 Fetch store slug on load if not in localStorage or user object
   useEffect(() => {
      const checkAndSaveSlug = async () => {
         // Priority: 1. User Object, 2. LocalStorage, 3. API
         const currentSlug = user?.storeSlug || localStorage.getItem("storeSlug");
         
         if (currentSlug && currentSlug !== "undefined") {
            if (!localStorage.getItem("storeSlug")) {
               localStorage.setItem("storeSlug", currentSlug);
            }
            return;
         }

         try {
            const result = await apiFetch("/stores/me");
            if (result.success && result.data?.slug) {
               localStorage.setItem("storeSlug", result.data.slug);
               console.log("✅ Store slug saved to local storage:", result.data.slug);
            }
         } catch (err) {
            console.error("❌ Failed to fetch store slug:", err);
         }
      };

      if (user) {
         checkAndSaveSlug();
      }
   }, [user]);

   if (loading) {
      return (
         <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Opening Dashboard...</p>
         </div>
      );
   }

   if (error) {
      return (
         <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold">
               Connection Error: {error}
            </div>
            <button 
               onClick={() => window.location.reload()}
               className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:underline"
            >
               Tap to Retry
            </button>
         </div>
      );
   }

   return (
      <div className="space-y-12 pb-12">
         {/* Live Status Banner */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 dark:text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  <Activity className="h-3 w-3 animate-pulse" />
                  Live Sales Update Active
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
                  {data?.storeInfo?.name.split(' ').map((word, i) => (
                     <span key={i} className={i === 1 ? "text-primary italic" : ""}>{word} </span>
                  )) || <>Shop <span className="text-primary italic">Overview</span></>}
               </h1>
               <div className="flex items-center gap-4 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                  <span>Store ID: {data?.storeInfo?.storeId || "MV-000"}</span>
                  <span className="h-1 w-1 bg-border rounded-full" />
                  <span>Category: {user?.businessCategory || "General"}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <Link href="/merchant/scanner" className="h-14 flex items-center gap-3 px-8 bg-primary hover:bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden">
                  <ScanLine className="h-5 w-5 group-hover:rotate-12 transition-transform relative z-10 text-white" />
                  <span className="relative z-10 uppercase tracking-widest">Open Scanner</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
               </Link>
            </div>
         </div>

         {/* Hero Analytics Section */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
               <Card className="h-full bg-foreground text-background dark:bg-card dark:text-foreground border-none shadow-2xl relative overflow-hidden group min-h-[400px]">
                  {/* Premium Background Elements */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -ml-20 -mb-20" />
                  
                  <div className="relative z-10 p-10 flex flex-col h-full">
                     <div className="flex justify-between items-start mb-12">
                        <div>
                           <p className="text-background/60 dark:text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-3">Total Sales Revenue</p>
                           <div className="flex items-baseline gap-4">
                              <h2 className="text-6xl lg:text-8xl font-black text-background dark:text-foreground tracking-tighter tabular-nums drop-shadow-2xl">
                                 ₹{data?.totalSales?.toLocaleString('en-IN') || "0"}
                              </h2>
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-black shadow-lg shadow-primary/20">
                                 <TrendingUp className="h-3 w-3" />
                                 +{data?.storeInfo?.revenueGrowth || "0"}%
                              </div>
                           </div>
                        </div>
                        <button className="p-4 bg-background/5 dark:bg-muted/50 hover:bg-background/10 dark:hover:bg-muted text-background dark:text-foreground rounded-2xl backdrop-blur-xl border border-background/10 dark:border-border transition-all">
                           <Activity className="h-6 w-6" />
                        </button>
                     </div>
                     <div className="mt-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                           { label: "Total Orders", value: data?.totalOrders || "0", icon: LayoutGrid, color: "text-blue-400" },
                           { label: "Sales Today", value: `₹${(data?.todayRevenue || 0).toLocaleString('en-IN')}`, icon: Wallet, color: "text-primary" },
                           { label: "Items Sold", value: data?.topProducts?.[0]?.unitsSold || "0", icon: Package, color: "text-orange-400" },
                           { label: "Low Stock", value: data?.lowStockCount || "0", icon: Activity, color: "text-red-400" },
                        ].map((stat, i) => (
                           <div key={i} className="space-y-2 group/item">
                              <div className="flex items-center gap-2">
                                 <stat.icon className={cn("h-4 w-4", stat.color)} />
                                 <p className="text-[9px] font-black text-background/40 dark:text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                              </div>
                              <p className="text-2xl font-black text-background dark:text-foreground group-hover/item:text-primary transition-colors tabular-nums">{stat.value}</p>
                              <div className="h-1 w-full bg-background/5 dark:bg-muted rounded-full overflow-hidden">
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
               <Card className="p-8 bg-card border-border h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Top Products
                     </h3>
                     <div className="flex gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <div className="h-1.5 w-1.5 rounded-full bg-primary opacity-50" />
                        <div className="h-1.5 w-1.5 rounded-full bg-primary opacity-20" />
                     </div>
                  </div>
                  
                  <div className="space-y-8 flex-1">
                     {data?.topProducts?.map((product, i) => (
                        <div key={i} className="space-y-3">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="text-muted-foreground truncate max-w-[150px]">{product.name}</span>
                              <span className="text-primary">₹{product.revenue?.toLocaleString('en-IN')}</span>
                           </div>
                           <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(product.unitsSold / (data.topProducts[0]?.unitsSold || 1)) * 100}%` }}
                                 transition={{ duration: 1.5, ease: "easeOut" }}
                                 className="h-full rounded-full bg-primary"
                              />
                           </div>
                        </div>
                     ))}
                  </div>

                  <button className="w-full mt-12 py-4 bg-muted border border-border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                     Full Sales Reports
                  </button>
               </Card>
            </div>
         </div>

         {/* Operational Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
               { label: "Pending Khata", val: `₹${(data?.khataSummary?.totalOutstanding || 0).toLocaleString('en-IN')}`, sub: `${data?.khataSummary?.activeAccounts || 0} Accounts`, icon: Wallet, color: "orange", href: "/merchant/khata" },
               { label: "Stock alerts", val: `${data?.lowStockCount || 0} Items`, sub: "Critical Low", icon: Package, color: "red", href: "/merchant/inventory" },
               { label: "Top Customer", val: data?.topCustomers?.[0]?.name || "N/A", sub: `Spent ₹${(data?.topCustomers?.[0]?.totalSpent || 0).toLocaleString('en-IN')}`, icon: Users, color: "blue", href: "/merchant/insights" },
               { label: "Total Orders", val: data?.totalOrders || "0", sub: "Successful", icon: LayoutGrid, color: "primary", href: "/merchant/delivery" },
            ].map((card, i) => (
               <Link key={i} href={card.href}>
                  <Card className="p-8 bg-card border-border group cursor-pointer hover:border-primary/50 transition-all overflow-hidden relative h-full">
                     <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className={cn(
                           "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                           card.color === 'orange' ? "bg-orange-500/10 text-orange-500" :
                           card.color === 'red' ? "bg-red-500/10 text-red-500" :
                           card.color === 'blue' ? "bg-blue-500/10 text-blue-500" : "bg-primary/10 text-primary"
                        )}>
                           <card.icon className="h-7 w-7" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                     </div>
                     <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">{card.label}</p>
                        <h3 className="text-3xl font-black text-foreground tracking-tight truncate">{card.val}</h3>
                        <p className="text-[10px] font-bold mt-2 uppercase tracking-wide text-muted-foreground">{card.sub}</p>
                     </div>
                     {/* Decorative element */}
                     <div className={cn(
                        "absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity",
                        card.color === 'orange' ? "bg-orange-500" :
                        card.color === 'blue' ? "bg-blue-500" : "bg-primary"
                     )} />
                  </Card>
               </Link>
            ))}

            <div className="p-8 border-4 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground hover:border-primary/30 hover:text-primary transition-all cursor-pointer group bg-muted/30">
               <Plus className="h-10 w-10 mb-4 group-hover:rotate-90 transition-transform duration-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add Feature</span>
            </div>
         </div>

         {/* Support & Policies Quick Access */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pb-20">
            <Link href="/merchant/support">
               <Card className="p-8 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-all group overflow-hidden relative h-full">
                  <div className="flex items-center gap-6 relative z-10">
                     <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 transition-transform group-hover:scale-110">
                        <HeadphonesIcon className="h-8 w-8" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Need Assistance?</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Chat with our 24/7 concierge support team.</p>
                     </div>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:rotate-12 transition-transform">
                     <HeadphonesIcon className="h-32 w-32 text-primary" />
                  </div>
               </Card>
            </Link>
            <Link href="/merchant/settings/policies">
               <Card className="p-8 bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10 transition-all group overflow-hidden relative h-full">
                  <div className="flex items-center gap-6 relative z-10">
                     <div className="h-16 w-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transition-transform group-hover:scale-110">
                        <ShieldCheck className="h-8 w-8" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Legal Compliance</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Configure your storefront policies & T&C.</p>
                     </div>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:rotate-12 transition-transform">
                     <ShieldCheck className="h-32 w-32 text-blue-500" />
                  </div>
               </Card>
            </Link>
         </div>
      </div>
   )
}
