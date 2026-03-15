"use client"

import { useState } from "react"
import { 
  Store, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Settings2, 
  Camera,
  Save,
  Bell,
  Lock,
  Smartphone,
  CreditCard,
  ChevronRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function StoreSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", label: "General Information", icon: Store },
    { id: "business", label: "Business Rules", icon: Settings2 },
    { id: "notifications", label: "Notification Settings", icon: Bell },
    { id: "security", label: "Security & Devices", icon: Lock },
  ]

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Store Profile & Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Control your business details, operating hours, and system preferences.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
          <Save className="h-5 w-5" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200 dark:border-slate-800"
              )}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
              {activeTab === tab.id && <ChevronRight className="h-4 w-4 ml-auto" />}
            </button>
          ))}
          
          <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
             <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Verification Status</p>
             <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Verified Merchant Account #MV-1902</p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-9">
          <Card className="p-8 bg-white dark:bg-[#132a23] border-primary/10">
            {activeTab === "general" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Profile Picture */}
                <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                   <div className="relative group">
                      <div className="h-24 w-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                         <Store className="h-10 w-10 text-slate-400" />
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-lg shadow-lg hover:scale-110 transition-transform">
                         <Camera className="h-4 w-4" />
                      </button>
                   </div>
                   <div className="text-center md:text-left">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Store Logo</h3>
                      <p className="text-sm text-slate-500">JPG, PNG or SVG. Max size 2MB.</p>
                      <button className="mt-2 text-xs font-bold text-primary hover:underline">Remove logo</button>
                   </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Store Name</label>
                      <div className="relative">
                         <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                         <input 
                           type="text" 
                           defaultValue="Mana Vyapar Store #102"
                           className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Business Phone</label>
                      <div className="relative">
                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                         <input 
                           type="text" 
                           defaultValue="+91 98765 43210"
                           className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                         />
                      </div>
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Store Address</label>
                      <div className="relative">
                         <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                         <textarea 
                           rows={3}
                           defaultValue="Shop No. 42, Market Complex, HSR Layout Sector 2, Bangalore, Karnataka - 560102"
                           className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">GST Number</label>
                      <input 
                        type="text" 
                        placeholder="Optional"
                        defaultValue="29ABCDE1234F1Z5"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Store Website</label>
                      <div className="relative">
                         <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                         <input 
                           type="text" 
                           defaultValue="www.manavyapar.com/store/102"
                           className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                         />
                      </div>
                   </div>
                </div>

                <div className="pt-8 space-y-4">
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <Clock className="h-6 w-6 text-primary" />
                      Operating Hours
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Monday - Friday', 'Saturday - Sunday'].map((group) => (
                        <div key={group} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                           <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{group}</p>
                              <p className="text-xs text-slate-500">09:00 AM - 09:00 PM</p>
                           </div>
                           <button className="text-xs font-bold text-primary px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm">Edit</button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
            
            {activeTab !== "general" && (
              <div className="h-64 flex flex-col items-center justify-center text-center opacity-50">
                 <Settings2 className="h-12 w-12 mb-4 text-slate-400" />
                 <p className="text-slate-500 font-medium">{tabs.find(t => t.id === activeTab)?.label} under development.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
