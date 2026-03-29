"use client"

import { useState } from "react"
import { Check, CreditCard, Shield, Zap, Info, ChevronRight, ArrowUpRight, Lock, Calendar, Download, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter Shard",
    price: "₹0",
    description: "Perfect for micro-retailers starting their digital journey.",
    features: ["50 Khata entries/mo", "100 Inventory SKUs", "Digital Bill Engine", "Single Admin Seat", "Community Support"],
    cta: "Current Active Plan",
    current: true,
  },
  {
    name: "Business Matrix",
    price: "₹499",
    period: "/mo",
    description: "The complete orchestration solution for growing marts.",
    features: ["Unlimited Khata entries", "Unlimited Inventory Hub", "AI Chitti Scanner (50/mo)", "3 Staff Matrix Seats", "Priority Node Support", "WhatsApp Autopilot"],
    cta: "Optimize to Matrix",
    popular: true,
  },
  {
    name: "Enterprise Grid",
    price: "Custom",
    description: "For multi-outlet conglomerates and hypermarkets.",
    features: ["Unified Store Cluster", "Unmetered AI Scanning", "Advanced Neural Analytics", "Dedicated Node Manager", "API/ERP Grid Sync"],
    cta: "Contact Architecture",
  },
]

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState("Business Matrix")

  return (
    <div className="space-y-10 pb-12">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase leading-none">
             Platform <span className="text-primary tracking-normal">Subscription</span> Matrix
           </h1>
           <p className="text-muted-foreground text-sm mt-1 font-medium italic">
             Managing node capabilities and scaling your merchant infrastructure.
           </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Shield className="h-4 w-4 animate-pulse" />
              Active Integration: Starter Shard
           </div>
        </div>
      </div>

      {/* Plans Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={cn(
              "relative p-10 flex flex-col h-full transition-all duration-500 border group overflow-hidden shadow-2xl",
              plan.popular 
                ? "bg-card border-primary/30 ring-4 ring-primary/10" 
                : "bg-card border-border hover:border-primary/20",
              selectedPlan === plan.name ? "scale-[1.02] shadow-primary/10" : "opacity-90 hover:opacity-100"
            )}
            onClick={() => setSelectedPlan(plan.name)}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-bl-3xl uppercase tracking-widest shadow-lg z-10">
                Recommended Node
              </div>
            )}
            
            {plan.popular && (
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-50" />
            )}

            <div className="mb-10 relative z-10">
              <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter mb-4">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black text-foreground tracking-tighter">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground font-black uppercase text-xs">{plan.period}</span>}
              </div>
              <p className={cn("text-xs font-medium italic leading-relaxed text-muted-foreground")}>
                {plan.description}
              </p>
            </div>

            <div className="flex-1 space-y-6 mb-10 relative z-10">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-4 group/feature">
                  <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover/feature:rotate-12 bg-primary/10 text-primary")}>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className={cn("text-xs font-bold uppercase tracking-tight text-muted-foreground group-hover:text-foreground transition-colors")}>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              className={cn(
                "w-full h-16 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all relative overflow-hidden z-10",
                plan.current ? "bg-muted text-muted-foreground cursor-not-allowed border border-border" : 
                plan.popular ? "bg-primary text-white hover:scale-105 shadow-xl shadow-primary/20" : 
                "bg-muted hover:bg-muted/80 text-foreground hover:text-primary border border-border transition-all"
              )}
            >
              {plan.cta}
            </button>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16">
         {/* Method Intelligence */}
         <Card className="p-10 bg-card border-border shadow-2xl">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                       <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    Payment Matrix
                  </h3>
               </div>
               <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">Update Method</button>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-muted/30 border border-border flex items-center justify-between group cursor-pointer hover:border-primary/40 transition-all shadow-inner">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-14 bg-card border border-border rounded-2xl flex items-center justify-center overflow-hidden">
                     <span className="text-[10px] font-black italic text-blue-600 dark:text-blue-400">VISA</span>
                  </div>
                  <div>
                     <h4 className="font-black text-foreground uppercase tracking-tighter">Verified Card Hub</h4>
                     <p className="text-xs text-muted-foreground font-bold">Expires 12/26 • Secondary Node-02</p>
                  </div>
               </div>
               <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-emerald-500" />
               </div>
            </div>

            <div className="mt-8 flex items-center gap-6 p-6 bg-primary/5 border border-dashed border-primary/30 rounded-[2.5rem]">
               <Calendar className="h-10 w-10 text-primary shrink-0" />
               <p className="text-xs font-bold text-muted-foreground">Next Automated Settlement: <span className="text-foreground font-black italic">Nov 12, 2023</span>. System will use primary liquidity pool.</p>
            </div>
         </Card>

         {/* Ledger Logs */}
         <Card className="p-10 bg-card border-border shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Billing Ledger</h3>
               <button className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                  <RefreshCw className="h-5 w-5" />
               </button>
            </div>
            
            <div className="flex-1 space-y-4">
               {[
                 { id: "LX-1024-V1", date: "Oct 12, 2023", amount: "₹0.00", status: "Verified" },
                 { id: "LX-1023-V0", date: "Sep 12, 2023", amount: "₹0.00", status: "Verified" },
               ].map((inv) => (
                  <div key={inv.id} className="p-6 rounded-3xl bg-muted/30 border border-border hover:border-primary/20 hover:bg-card transition-all flex items-center justify-between group">
                     <div className="flex items-center gap-6">
                        <div className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                           <Download className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="font-black text-foreground tracking-tighter">{inv.id}</p>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{inv.date}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-lg font-black text-foreground tracking-tighter">{inv.amount}</p>
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest px-1.5 py-0.5 bg-emerald-500/10 rounded">{inv.status}</span>
                     </div>
                  </div>
               ))}
            </div>
            <button className="w-full mt-10 h-14 bg-muted border border-border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all">
               Deep-Dive Archive Access
            </button>
         </Card>
      </div>
    </div>
  )
}
