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
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function AdminProfilePage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true)

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Account Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            View and manage your super admin credentials and security preferences.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold">
           <ShieldCheck className="h-4 w-4" />
           Verified Administrator
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 text-center bg-white dark:bg-[#09090b] border-primary/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-primary-dark/20 -z-10"></div>
             
             <div className="relative inline-block mt-4">
                <div className="h-32 w-32 rounded-3xl bg-slate-100 dark:bg-slate-800 p-1 ring-4 ring-white dark:ring-[#09090b] overflow-hidden">
                   <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5QGtyS46ffXJmtiUOY-Mq-cEmOc7FePMAok4tf6sm3G4X7oW97TivKVxOLQ0NsUlEoQN7-oYfr5cpdKMJrOd6mD19rgvD6Z1yTasNnlhUUAu47Jw6vXSJ40yql6yHWPvUFNA3qE9kwyQA0B_TOvtUhEgBDXKwxCi9bsIJMP5rRhX15jNJr35xjlrXSycBVedLuDD4lJ0Swodp1ogo0-Sbnysa4H65Ujorz0BV-0X3HiLMw-Kf_TMQjxRGw9xjO1WkdjtItytNu-A" 
                    alt="Admin Avatar" 
                    className="h-full w-full object-cover rounded-2xl"
                   />
                </div>
                <button className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-black rounded-xl shadow-xl hover:scale-110 transition-transform">
                   <Camera className="h-4 w-4" />
                </button>
             </div>

             <div className="mt-6 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Aditya Sathwik</h2>
                <p className="text-slate-500 font-medium">Chief Technology Officer</p>
             </div>

             <div className="space-y-3">
                <div className="flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-slate-800">
                   <span className="text-slate-500">Access Level</span>
                   <span className="font-bold text-primary">System Owner</span>
                </div>
                <div className="flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-slate-800">
                   <span className="text-slate-500">Member Since</span>
                   <span className="font-bold text-slate-700 dark:text-slate-300">Mar 12, 2022</span>
                </div>
             </div>

             <button className="w-full mt-8 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-red-600 font-bold bg-red-50 dark:bg-red-900/10 hover:bg-red-100 transition-colors">
                <LogOut className="h-5 w-5" />
                Sign Out Everywhere
             </button>
          </Card>

          <Card className="p-6 bg-white dark:bg-[#09090b] border-primary/10">
             <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Recent Logs
             </h3>
             <div className="space-y-4">
                {[
                  { event: "API Key Regened", time: "2h ago", icon: Key, color: "blue" },
                  { event: "Login Success", time: "5h ago", icon: ShieldCheck, color: "emerald" },
                  { event: "Config Change", time: "Yesterday", icon: Smartphone, color: "orange" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", 
                       item.color === 'blue' ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600" :
                       item.color === 'emerald' ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600" :
                       "bg-orange-100 dark:bg-orange-900/20 text-orange-600"
                     )}>
                        <item.icon className="h-4 w-4" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.event}</p>
                        <p className="text-[10px] text-slate-400">{item.time}</p>
                     </div>
                     <ArrowRight className="h-3 w-3 text-slate-300" />
                  </div>
                ))}
             </div>
             <button className="w-full mt-6 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">View All Activity</button>
          </Card>
        </div>

        {/* Right Column: Settings */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-8 bg-white dark:bg-[#09090b] border-primary/10">
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                Personal Details
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                   <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input 
                        type="text" 
                        defaultValue="Aditya Sathwik"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input 
                        type="email" 
                        defaultValue="aditya@manavyapar.com"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Phone Number</label>
                   <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input 
                        type="tel" 
                        defaultValue="+91 99887 76655"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      />
                   </div>
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                   <button className="bg-primary hover:bg-primary-dark text-black font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                      Update Profile Information
                   </button>
                </div>
             </div>
          </Card>

          <Card className="p-8 bg-white dark:bg-[#09090b] border-primary/10">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                   <Shield className="h-6 w-6 text-primary" />
                   Security & Credentialing
                </h3>
             </div>

             <div className="space-y-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                         <Smartphone className="h-6 w-6" />
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h4>
                         <p className="text-xs text-slate-500">Secure your account with SMS & Authenticator App.</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                      is2FAEnabled ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                    )}
                   >
                      <span className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        is2FAEnabled ? "translate-x-6" : "translate-x-1"
                      )} />
                   </button>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                         <Key className="h-6 w-6" />
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900 dark:text-white">Change Root Password</h4>
                         <p className="text-xs text-slate-500">Last updated 124 days ago. (Recommendation: 90 days)</p>
                      </div>
                   </div>
                   <button className="text-primary font-bold text-sm">Update Now</button>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
