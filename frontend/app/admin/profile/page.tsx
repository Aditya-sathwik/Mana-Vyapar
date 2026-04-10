"use client"

import { useState } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  ShieldCheck, 
  Activity, 
  Key, 
  Smartphone, 
  LogOut,
  Camera,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Zap,
  Fingerprint,
  ChevronRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function AdminProfilePage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true)

  return (
    <div className="space-y-12 pb-20 max-w-[1400px] mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                 <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Super User Authentication</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none italic">
             Account <span className="text-primary tracking-normal">Security</span>
           </h1>
           <p className="text-muted-foreground text-sm mt-4 font-medium max-w-lg leading-relaxed italic opacity-80">
             Manage high-level administrative credentials, multi-factor authorization, and session persistence.
           </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/5 transition-all hover:scale-105 active:scale-95 cursor-default">
           <ShieldAlert className="h-5 w-5 text-emerald-500" />
           Verified System Owner
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Premium Profile Summary */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="p-10 text-center bg-card border-border/50 shadow-2xl rounded-[3rem] relative overflow-hidden group">
             {/* Adaptive Background Gradient */}
             <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent -z-10 group-hover:opacity-60 transition-opacity"></div>
             
             <div className="relative inline-block mt-4 mb-8">
                <div className="h-40 w-40 rounded-[2.5rem] bg-muted border-4 border-background p-1.5 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                   <img 
                    src="https://api.dicebear.com/7.x/adventurer/svg?seed=aditya" 
                    alt="Admin Avatar" 
                    className="h-full w-full object-cover rounded-[2rem] grayscale group-hover:grayscale-0 transition-all duration-700"
                   />
                </div>
                <button className="absolute -bottom-2 -right-2 h-12 w-12 bg-primary text-primary-foreground rounded-2xl shadow-2xl border-4 border-background flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-primary/40">
                   <Camera className="h-5 w-5" />
                </button>
             </div>

             <div className="mb-10">
                <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic leading-none mb-3">Aditya Sathwik</h2>
                <div className="flex items-center justify-center gap-2">
                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic opacity-60">Chief Strategy Officer</p>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-muted/40 border border-border/50 rounded-2xl shadow-inner group/item hover:bg-muted/60 transition-colors">
                   <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60 italic">Permission Level</span>
                   <span className="text-xs font-black text-primary uppercase italic tracking-tighter">Root Authority</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-muted/40 border border-border/50 rounded-2xl shadow-inner group/item hover:bg-muted/60 transition-colors">
                   <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60 italic">Node Lifetime</span>
                   <span className="text-xs font-black text-foreground tracking-tighter italic tabular-nums">1,245 Days Active</span>
                </div>
             </div>

             <button className="w-full h-16 mt-10 flex items-center justify-center gap-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-red-500 bg-red-500/5 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95 group/logout">
                <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Terminate All Sessions
             </button>
          </Card>

          <Card className="p-10 bg-card border-border/50 shadow-xl rounded-[3rem]">
             <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase italic mb-8 flex items-center gap-4">
                <Activity className="h-6 w-6 text-primary" />
                Security Logs
             </h3>
             <div className="space-y-6">
                {[
                  { event: "Kernel Key Rotation", time: "2h ago", icon: Key, color: "blue" },
                  { event: "Authorized Entrance", time: "5h ago", icon: ShieldCheck, color: "emerald" },
                  { event: "Protocol Update", time: "Yesterday", icon: Zap, color: "orange" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 group cursor-pointer hover:translate-x-1 transition-all">
                     <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:rotate-12", 
                       item.color === 'blue' ? "bg-blue-500 text-white shadow-blue-500/20" :
                       item.color === 'emerald' ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                       "bg-orange-500 text-white shadow-orange-500/20"
                     )}>
                        <item.icon className="h-5 w-5" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-foreground uppercase tracking-tight truncate">{item.event}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic mt-0.5">{item.time}</p>
                     </div>
                     <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
             </div>
             <button className="w-full mt-10 h-12 bg-muted border border-border rounded-xl text-[9px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors italic">Deep Audit History</button>
          </Card>
        </div>

        {/* Right Column: Identity & Security Parameters */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="p-10 bg-card border-border/50 shadow-2xl rounded-[3.5rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 transition-transform">
                <Fingerprint className="h-64 w-64 text-primary" />
             </div>
             <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase italic leading-none mb-12 flex items-center gap-5 relative z-10">
                <User className="h-7 w-7 text-primary" />
                Core Profile
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2 opacity-60">Legal Nomenclature</label>
                   <div className="relative group/input">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      <input 
                        type="text" 
                        defaultValue="Aditya Sathwik"
                        className="w-full pl-14 pr-6 py-5 bg-muted/40 border border-border rounded-2xl text-sm font-black tracking-tight text-foreground focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                      />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2 opacity-60">Strategic Communication</label>
                   <div className="relative group/input">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      <input 
                        type="email" 
                        defaultValue="aditya@manavyapar.com"
                        className="w-full pl-14 pr-6 py-5 bg-muted/40 border border-border rounded-2xl text-sm font-black tracking-tight text-foreground focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                      />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2 opacity-60">Direct Hotlink</label>
                   <div className="relative group/input">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      <input 
                        type="tel" 
                        defaultValue="+91 99887 76655"
                        className="w-full pl-14 pr-6 py-5 bg-muted/40 border border-border rounded-2xl text-sm font-black tracking-tight text-foreground focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                      />
                   </div>
                </div>
                <div className="space-y-3 flex flex-col justify-end">
                   <button className="h-16 bg-primary hover:bg-emerald-600 text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3">
                      Update Neural Identity
                   </button>
                </div>
             </div>
          </Card>

          <Card className="p-10 bg-card border-border/50 shadow-2xl rounded-[3.5rem] flex flex-col relative overflow-hidden">
             <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] -rotate-12 transition-transform group-hover:rotate-0">
                <Shield className="h-64 w-64 text-primary" />
             </div>
             <div className="flex items-center justify-between mb-12 relative z-10">
                <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase italic leading-none flex items-center gap-5">
                   <Shield className="h-7 w-7 text-primary" />
                   Security Protocols
                </h3>
             </div>

             <div className="space-y-8 relative z-10">
                <div className="p-8 bg-muted/30 border border-border/50 rounded-[2.5rem] flex items-center justify-between shadow-inner group/toggle hover:bg-muted/50 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-xl shadow-orange-500/10">
                         <Smartphone className="h-8 w-8" />
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-foreground tracking-tighter uppercase italic leading-none mb-2">Two-Factor Authorization</h4>
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Multi-point identity verification layer.</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                    className={cn(
                      "relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none shadow-lg",
                      is2FAEnabled ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                   >
                      <span className={cn(
                        "inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-xl",
                        is2FAEnabled ? "translate-x-9" : "translate-x-1"
                      )} />
                   </button>
                </div>

                <div className="p-8 bg-muted/30 border border-border/50 rounded-[2.5rem] flex items-center justify-between shadow-inner group hover:bg-card hover:shadow-2xl hover:border-primary/30 transition-all cursor-pointer">
                   <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/10">
                         <Key className="h-8 w-8" />
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-foreground tracking-tighter uppercase italic leading-none mb-2">Root Access Rotation</h4>
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 italic">Last entropy update: 124 cycles ago. (High Entropy Recommended)</p>
                      </div>
                   </div>
                   <button className="h-12 px-8 border border-primary/30 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest border-2 hover:bg-primary hover:text-white transition-all shadow-sm">INITIATE ROTATION</button>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
