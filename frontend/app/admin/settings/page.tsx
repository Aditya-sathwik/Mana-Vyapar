"use client"

import { useState } from "react"
import { 
  Settings, 
  Globe, 
  Shield, 
  Database, 
  Bell, 
  Lock, 
  Cpu, 
  Cloud,
  Save,
  ChevronRight,
  UserPlus,
  RefreshCw,
  Server,
  Zap,
  ArrowRight,
  ShieldCheck,
  Globe2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function SuperAdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("system")

  const tabs = [
    { id: "system", label: "System Config", icon: Cpu },
    { id: "security", label: "Platform Security", icon: Shield },
    { id: "merchants", label: "Merchant Rules", icon: Settings },
    { id: "nodes", label: "Node Clusters", icon: Server },
  ]

  return (
    <div className="space-y-12 pb-20 max-w-[1700px] mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                 <Settings className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Global Orchestration Layer</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none italic">
             Core <span className="text-primary tracking-normal">Parameters</span>
           </h1>
           <p className="text-muted-foreground text-sm mt-4 font-medium max-w-lg leading-relaxed italic opacity-80">
             Define system-wide entropy, cryptographic standards, and global infrastructure orchestration protocols.
           </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <button className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all">Discard Pending Changes</button>
           <button className="bg-primary hover:bg-emerald-600 text-primary-foreground px-10 py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center gap-3 transition-all hover:-translate-y-1 active:translate-y-0">
              <Save className="h-5 w-5" />
              Push Global Manifest
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Sidebar Navigation Matrix */}
        <div className="lg:col-span-3 space-y-4">
           <div className="flex flex-col gap-2 p-2 bg-card border border-border rounded-[2.5rem] shadow-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all group relative overflow-hidden",
                    activeTab === tab.id 
                      ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                  )}
                >
                  <tab.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", activeTab === tab.id ? "text-primary-foreground" : "text-primary opacity-60")} />
                  {tab.label}
                  {activeTab === tab.id && <ArrowRight className="h-4 w-4 ml-auto animate-in slide-in-from-left-2 duration-300" />}
                </button>
              ))}
           </div>
           
           <Card className="p-8 bg-slate-950 border border-border rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 transition-opacity group-hover:opacity-70" />
              <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Runtime Kernel</p>
                 </div>
                 <p className="text-2xl font-black text-white italic tracking-tighter leading-none mb-6 uppercase">v2.4.9 <span className="text-primary italic">STABLE</span></p>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-emerald-400 transition-colors group/btn">
                    <RefreshCw className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-700" />
                    Poll for Staging
                 </button>
              </div>
              <Cloud className="absolute -bottom-10 -right-10 h-40 w-40 text-primary opacity-[0.03] transition-transform group-hover:rotate-12 duration-1000" />
           </Card>
        </div>

        {/* Dynamic Settings Manifest */}
        <div className="lg:col-span-9">
           <Card className="p-12 bg-card border-border/50 shadow-2xl rounded-[3.5rem] min-h-[800px]">
              {activeTab === 'system' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2 opacity-60">System Root Domain</label>
                         <div className="relative group/input">
                            <Globe2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                            <input 
                              type="text" 
                              defaultValue="app.manavyapar.com"
                              className="w-full pl-14 pr-6 py-5 bg-muted/40 border border-border rounded-2xl text-sm font-black tracking-tight text-foreground focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                            />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2 opacity-60">NOC Support Alias</label>
                         <div className="relative group/input">
                            <Bell className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                            <input 
                              type="text" 
                              defaultValue="noc-ops@manavyapar.com"
                              className="w-full pl-14 pr-6 py-5 bg-muted/40 border border-border rounded-2xl text-sm font-black tracking-tight text-foreground focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                            />
                         </div>
                      </div>
                   </div>

                   <section className="space-y-6">
                      <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none flex items-center gap-4">
                         <Database className="h-7 w-7 text-primary" />
                         Kernel Variables
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {[
                           { label: "Throughput Limit", value: "25,000 Req/s" },
                           { label: "Sharding TTL", value: "30ms" },
                           { label: "Replica Quorum", value: "3x Nodes" },
                         ].map(item => (
                            <div key={item.label} className="p-6 rounded-[2rem] bg-muted/30 border border-border/50 shadow-inner group hover:bg-card hover:shadow-2xl transition-all">
                               <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-60 italic">{item.label}</p>
                               <input type="text" defaultValue={item.value} className="w-full bg-transparent border-none p-0 text-sm font-black text-foreground focus:ring-0 uppercase tracking-tight" />
                            </div>
                         ))}
                      </div>
                   </section>

                   <section className="p-10 bg-slate-950 border border-border rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
                      <div className="flex items-center justify-between mb-10 relative z-10">
                         <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
                               <Shield className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Access Matrix Enforcement</h3>
                               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Multi-layer cryptographic guard</p>
                            </div>
                         </div>
                         <button className="bg-primary text-primary-foreground text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-primary/20">SYSTEM ACTIVE</button>
                      </div>
                      <div className="space-y-6 relative z-10">
                         {[
                           { title: "Deterministic JWT verification", desc: "Forces high-entropy RSA-4096 signature sharding on all incoming edge requests." },
                           { title: "Geo-fencing Super Authority", desc: "Restricts Admin Matrix portal to verified kernel-level VPN ranges and office IP shards." },
                         ].map((rule, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                               <div className="flex-1">
                                  <p className="text-sm font-black text-white uppercase tracking-tight mb-1">{rule.title}</p>
                                  <p className="text-[11px] text-slate-400 font-medium italic opacity-70 leading-relaxed">{rule.desc}</p>
                                </div>
                                <div className="ml-8 relative h-8 w-14 flex items-center bg-primary rounded-full p-1 cursor-pointer shadow-lg shadow-primary/20 transition-all">
                                   <div className="h-6 w-6 bg-white rounded-full absolute right-1 shadow-md" />
                                </div>
                            </div>
                         ))}
                      </div>
                   </section>
                </div>
              )}

              {activeTab !== 'system' && (
                <div className="h-[600px] flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                   <div className="h-24 w-24 rounded-full bg-muted border border-border flex items-center justify-center mb-8 shadow-inner">
                      <Zap className="h-10 w-10 text-primary opacity-20 animate-pulse" />
                   </div>
                   <h4 className="text-3xl font-black text-foreground tracking-tighter uppercase italic mb-4">{tabs.find(t => t.id === activeTab)?.label} Hub</h4>
                   <p className="text-sm font-bold text-muted-foreground max-w-sm uppercase tracking-widest opacity-40">Deployment of this kernel module is currently undergoing system staging and audit.</p>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  )
}
