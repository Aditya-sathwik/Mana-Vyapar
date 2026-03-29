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
  Filter,
  ShieldCheck,
  Zap
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

export default function AlertsPage() {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            Service Alerts & Notifications
          </h1>
          <p className="text-muted-foreground text-sm">
            Stay updated with your store&apos;s critical events and system status.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="p-2 border border-border rounded-lg hover:bg-muted text-muted-foreground">
              <Filter className="h-5 w-5" />
           </button>
           <button className="text-sm font-semibold text-primary hover:underline px-2">Mark all as read</button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Critical", count: 1, color: "text-red-500", bg: "bg-red-500/10" },
           { label: "Warnings", count: 2, color: "text-orange-500", bg: "bg-orange-500/10" },
           { label: "Information", count: 5, color: "text-blue-500", bg: "bg-blue-500/10" },
           { label: "Read", count: 12, color: "text-muted-foreground", bg: "bg-muted" },
         ].map((stat) => (
           <Card key={stat.label} className="p-4 flex items-center justify-between border-border bg-card">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
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
              "p-6 border-l-4 transition-all hover:translate-x-1 cursor-pointer bg-card border-border",
              alert.type === "critical" ? "border-l-red-500" :
              alert.type === "warning" ? "border-l-orange-500" :
              alert.type === "info" ? "border-l-blue-500" : "border-l-emerald-500"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                alert.color === "red" ? "bg-red-500/10 text-red-500" :
                alert.color === "orange" ? "bg-orange-500/10 text-orange-500" :
                alert.color === "blue" ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
              )}>
                <alert.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-lg font-bold text-foreground truncate">{alert.title}</h3>
                  <span className="text-xs text-muted-foreground shrink-0">{alert.time}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {alert.message}
                </p>
                <div className="flex items-center gap-3">
                  <button className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    alert.color === "red" ? "bg-red-500 text-white hover:bg-red-600" :
                    alert.color === "orange" ? "bg-orange-500 text-white hover:bg-orange-600" :
                    "bg-muted text-foreground hover:bg-muted/80"
                  )}>
                    {alert.action}
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-center justify-center p-2 text-border">
                 <ChevronRight className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
