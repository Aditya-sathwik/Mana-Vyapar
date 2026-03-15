"use client"

import { 
  AlertTriangle, 
  Info, 
  Bell, 
  CheckCircle2, 
  X,
  CreditCard,
  Package,
  Users,
  ChevronRight,
  Filter
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "Low Inventory Alert",
    message: "Basmati Rice (5kg) is extremely low. Only 2 units left in stock.",
    time: "10 mins ago",
    icon: Package,
    color: "red",
    action: "Reorder Now"
  },
  {
    id: 2,
    type: "warning",
    title: "Pending Khata Collection",
    message: "Vijay Singh's payment of ₹4,200 is overdue for 3 days.",
    time: "2 hours ago",
    icon: Users,
    color: "orange",
    action: "Send Reminder"
  },
  {
    id: 3,
    type: "info",
    title: "Account Security",
    message: "Your password was last updated 90 days ago. Consider changing it.",
    time: "Yesterday",
    icon: ShieldCheck,
    color: "blue",
    action: "Update Password"
  },
  {
    id: 4,
    type: "success",
    title: "System Update",
    message: "Mana Vyapar v2.4 successfully installed. Check out new AI features!",
    time: "2 days ago",
    icon: Zap,
    color: "emerald",
    action: "View Changelog"
  }
]

import { ShieldCheck, Zap } from "lucide-react"

export default function AlertsPage() {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Service Alerts & Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Stay updated with your store&apos;s critical events and system status.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500">
              <Filter className="h-5 w-5" />
           </button>
           <button className="text-sm font-semibold text-primary hover:underline px-2">Mark all as read</button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Critical", count: 1, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
           { label: "Warnings", count: 2, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
           { label: "Information", count: 5, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
           { label: "Read", count: 12, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-900/20" },
         ].map((stat) => (
           <Card key={stat.label} className="p-4 flex items-center justify-between border-slate-100 dark:border-slate-800 bg-white dark:bg-[#132a23]">
              <div>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                <p className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.count}</p>
              </div>
              <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", stat.bg)}>
                 <Bell className={cn("h-5 w-5", stat.color)} />
              </div>
           </Card>
         ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card 
            key={alert.id} 
            className={cn(
              "p-6 border-l-4 transition-all hover:translate-x-1 cursor-pointer",
              alert.type === "critical" ? "border-l-red-500" :
              alert.type === "warning" ? "border-l-orange-500" :
              alert.type === "info" ? "border-l-blue-500" : "border-l-emerald-500"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                alert.color === "red" ? "bg-red-50 dark:bg-red-900/20 text-red-500" :
                alert.color === "orange" ? "bg-orange-50 dark:bg-orange-900/20 text-orange-500" :
                alert.color === "blue" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500"
              )}>
                <alert.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{alert.title}</h3>
                  <span className="text-xs text-slate-400 shrink-0">{alert.time}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  {alert.message}
                </p>
                <div className="flex items-center gap-3">
                  <button className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    alert.color === "red" ? "bg-red-500 text-white hover:bg-red-600" :
                    alert.color === "orange" ? "bg-orange-500 text-white hover:bg-orange-600" :
                    "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                  )}>
                    {alert.action}
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-center justify-center p-2 text-slate-300">
                 <ChevronRight className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
