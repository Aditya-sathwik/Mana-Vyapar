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
  Server
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
    <div className="max-w-[1600px] mx-auto w-full space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Global Platform Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Configure system-wide parameters, security protocols, and infrastructure clusters.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors">Discard</button>
           <button className="bg-primary hover:bg-primary-dark text-black px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
              <Save className="h-5 w-5" />
              Push Global Update
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all border",
                 activeTab === tab.id 
                   ? "bg-primary text-black border-primary shadow-lg shadow-primary/10" 
                   : "bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-primary/5"
               )}
             >
               <tab.icon className="h-5 w-5" />
               {tab.label}
               {activeTab === tab.id && <ChevronRight className="h-4 w-4 ml-auto" />}
             </button>
           ))}
           
           <div className="mt-8 p-6 bg-slate-900 rounded-3xl border border-slate-800 relative overflow-hidden">
              <div className="relative z-10">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Platform Version</p>
                 <p className="text-xl font-black text-white">v2.4.9-Stable</p>
                 <button className="mt-4 flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                    <RefreshCw className="h-3 w-3" />
                    Check for Updates
                 </button>
              </div>
              <Cloud className="absolute -bottom-8 -right-8 h-32 w-32 text-white/5" />
           </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-9">
           <Card className="p-8 bg-white dark:bg-[#09090b] border-primary/10">
              {activeTab === 'system' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-900 dark:text-slate-300 ml-1">Platform Domain</label>
                         <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input 
                              type="text" 
                              defaultValue="app.manavyapar.com"
                              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-slate-900 dark:text-slate-300 ml-1">Support Email</label>
                         <div className="relative">
                            <Bell className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input 
                              type="text" 
                              defaultValue="noc-ops@manavyapar.com"
                              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm"
                            />
                         </div>
                      </div>
                   </div>

                   <section className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                         <Database className="h-5 w-5 text-primary" />
                         Database Parameters
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {[
                           { label: "Max Connections", value: "25,000" },
                           { label: "Timeout (Sec)", value: "30" },
                           { label: "Replication Factor", value: "3x" },
                         ].map(item => (
                            <div key={item.label} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                               <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{item.label}</p>
                               <input type="text" defaultValue={item.value} className="w-full bg-transparent border-none p-0 text-sm font-black text-slate-900 dark:text-white focus:ring-0" />
                            </div>
                         ))}
                      </div>
                   </section>

                   <section className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold text-white">Advanced Access Enforcement</h3>
                         </div>
                         <button className="bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">Enabled</button>
                      </div>
                      <div className="space-y-4">
                         {[
                           { title: "Strict JWT verification", desc: "Forces RSA256 signature checks on all incoming edge requests." },
                           { title: "Geo-fencing Admin Access", desc: "Restricts Super Admin portal to internal office VPN ranges." },
                         ].map((rule, i) => (
                            <div key={i} className="flex items-start justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                               <div>
                                  <p className="text-sm font-bold text-white">{rule.title}</p>
                                  <p className="text-xs text-slate-400">{rule.desc}</p>
                               </div>
                               <div className="h-6 w-11 bg-primary rounded-full relative p-1">
                                  <div className="h-4 w-4 bg-white rounded-full absolute right-1" />
                               </div>
                            </div>
                         ))}
                      </div>
                   </section>
                </div>
              )}

              {activeTab !== 'system' && (
                <div className="h-[500px] flex flex-col items-center justify-center text-center opacity-40">
                   <Settings className="h-16 w-16 mb-6 text-slate-500" />
                   <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tabs.find(t => t.id === activeTab)?.label} Settings</h4>
                   <p className="text-sm text-slate-500 max-w-xs">Deployment of this module is currently undergoing system staging.</p>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  )
}
