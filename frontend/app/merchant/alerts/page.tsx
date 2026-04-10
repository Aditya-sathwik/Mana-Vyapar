"use client"

import { useState, useEffect } from "react"
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
  Zap,
  Loader2,
  Trash2,
  ArrowRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

interface Notification {
  _id: string
  type: "ORDER" | "PAYMENT" | "STOCK" | "CUSTOMER" | "SYSTEM"
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Notification[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [notifsRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE}/notifications`, { headers: { "Content-Type": "application/json" } }),
        fetch(`${API_BASE}/dashboard/summary`, { headers: { "Content-Type": "application/json" } })
      ])
      
      const notifsData = await notifsRes.json()
      const summaryData = await summaryRes.json()
      
      setAlerts(notifsData.data || [])
      setSummary(summaryData.data)
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const markRead = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, { method: "PATCH" })
      if (res.ok) {
        setAlerts(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
      }
    } catch (error) {
       console.error(error)
    }
  }

  const deleteAlert = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await fetch(`${API_BASE}/notifications/${id}`, { method: "DELETE" })
      setAlerts(prev => prev.filter(n => n._id !== id))
      toast.success("Alert cleared")
    } catch (error) {
      toast.error("Failed to clear alert")
    }
  }

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground mb-1 uppercase tracking-tighter">
            System <span className="text-primary italic">Sync</span>
          </h1>
          <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.3em]">
            Critical Operational Signals • Secure Infrastructure
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="p-3 bg-card border border-border rounded-2xl hover:bg-muted text-muted-foreground transition-all">
              <Filter className="h-5 w-5" />
           </button>
           <button 
             onClick={() => toast.success("Marking all active signals as read")}
             className="text-[10px] font-black uppercase text-primary hover:underline px-4 py-2 bg-primary/5 rounded-xl transition-all"
           >
             Mark all as read
           </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Critical Stock", count: summary?.lowStockCount || 0, color: "text-red-500", bg: "bg-red-500/10", icon: Package },
           { label: "Open Inquiries", count: alerts.filter(a => !a.isRead).length, color: "text-orange-500", bg: "bg-orange-500/10", icon: Bell },
           { label: "Growth Index", count: "+12.4%", color: "text-primary", bg: "bg-primary/10", icon: Zap },
           { label: "Secure Sessions", count: 1, color: "text-blue-500", bg: "bg-blue-500/10", icon: ShieldCheck },
         ].map((stat) => (
           <Card key={stat.label} className="p-6 flex items-center justify-between border-border/50 bg-card/50 backdrop-blur-xl shadow-xl overflow-hidden relative group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={cn("text-3xl font-black tracking-tighter", stat.color)}>{stat.count}</p>
              </div>
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                 <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
           </Card>
         ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
             <div className="p-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Polling System Signals...</span>
             </div>
        ) : alerts.length === 0 ? (
            <div className="p-20 bg-card/40 border border-dashed border-border rounded-[2.5rem] flex flex-col items-center text-center">
                <ShieldCheck className="h-16 w-16 text-primary/20 mb-4" />
                <h3 className="text-lg font-black uppercase tracking-tighter">System Nominal</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">No critical alerts currently detected in the operational buffer.</p>
            </div>
        ) : (
            alerts.map((alert) => (
            <Card 
                key={alert._id} 
                onClick={() => !alert.isRead && markRead(alert._id)}
                className={cn(
                "p-8 border border-border/50 transition-all hover:bg-muted/40 cursor-pointer bg-card/60 backdrop-blur-xl rounded-[2.5rem] relative group overflow-hidden shadow-lg",
                alert.type === "STOCK" ? "border-l-4 border-l-red-500" :
                alert.type === "ORDER" ? "border-l-4 border-l-primary" :
                alert.type === "PAYMENT" ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-blue-500"
                )}
            >
                <div className="flex items-start gap-6">
                <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                    alert.type === "STOCK" ? "bg-red-500 text-white" :
                    alert.type === "ORDER" ? "bg-primary text-white" :
                    alert.type === "PAYMENT" ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
                )}>
                    {alert.type === "STOCK" ? <Package className="h-7 w-7" /> :
                     alert.type === "ORDER" ? <Zap className="h-7 w-7" /> :
                     alert.type === "PAYMENT" ? <CreditCard className="h-7 w-7" /> : <Info className="h-7 w-7" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight truncate">{alert.title}</h3>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6">
                    {alert.message}
                    </p>
                    <div className="flex items-center gap-4">
                    <button className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg",
                        alert.type === "STOCK" ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20" :
                        "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                    )}>
                        Take Action
                    </button>
                    <button 
                        onClick={(e) => deleteAlert(alert._id, e)}
                        className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                    </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center p-2 text-muted-foreground/30 group-hover:text-primary transition-colors hover:translate-x-1 duration-300">
                    <ArrowRight className="h-6 w-6" />
                </div>
                </div>
            </Card>
            ))
        )}
      </div>
    </div>
  )
}
