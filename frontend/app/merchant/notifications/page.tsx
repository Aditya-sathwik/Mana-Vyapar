"use client"

import { useState, useEffect } from "react"
import { 
  Bell, 
  Search,
  CheckCircle2,
  Trash2,
  MoreVertical,
  ChevronRight,
  ShoppingBag,
  Info,
  Gift,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CreditCard
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

const TYPE_ICONS = {
  ORDER: ShoppingBag,
  PAYMENT: CreditCard,
  STOCK: AlertTriangle,
  CUSTOMER: UserIcon,
  SYSTEM: Info
}

const TYPE_COLORS = {
  ORDER: "primary",
  PAYMENT: "emerald",
  STOCK: "amber",
  CUSTOMER: "purple",
  SYSTEM: "blue"
}

function UserIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/notifications`, { 
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      setNotifications(data.data || [])
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAllRead = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        toast.success("All marked as read")
      }
    } catch (error) {
      toast.error("Failed to update notifications")
    }
  }

  const markRead = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      })
      if (res.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
      }
    } catch (error) {
       console.error(error)
    }
  }

  const deleteNotif = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id))
        toast.success("Notification removed")
      }
    } catch (error) {
      toast.error("Failed to delete notification")
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.isRead
    if (filter === "orders") return n.type === "ORDER"
    return true
  })

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-1 uppercase tracking-tighter">
            Store <span className="text-primary italic">Alerts</span>
          </h1>
          <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em]">
            Real-time Operational Signals • Secure Node
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={markAllRead}
             className="text-[10px] font-black uppercase text-primary hover:underline px-4 py-2 bg-primary/5 rounded-xl transition-all"
           >
             Mark all as read
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border pb-px">
         {["all", "unread", "orders"].map((t) => (
           <button 
             key={t}
             onClick={() => setFilter(t)}
             className={cn(
               "pb-4 border-b-2 text-[10px] font-black uppercase tracking-widest px-2 transition-all",
               filter === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
             )}
           >
             {t === "all" ? "All Notifications" : t}
           </button>
         ))}
      </div>

      {/* Notifications List */}
      <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-border/50 divide-y divide-border/50 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sychronizing Alerts...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-2">
                <Bell className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tighter">No signals detected</h3>
            <p className="max-w-xs text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Your notification buffer is currently empty. Critical alerts will appear here.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const Icon = TYPE_ICONS[notif.type] || Info
            const colorClass = TYPE_COLORS[notif.type] || "blue"
            
            return (
              <div 
                key={notif._id} 
                onClick={() => !notif.isRead && markRead(notif._id)}
                className={cn(
                  "p-6 md:p-8 flex items-start gap-6 hover:bg-muted/40 transition-all cursor-pointer relative group",
                  !notif.isRead ? "bg-primary/[0.02]" : "opacity-60"
                )}
              >
                {!notif.isRead && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-r-full shadow-[0_0_15px_rgba(5,148,103,0.5)]"></div>}
                
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                  colorClass === "primary" ? "bg-primary text-white" :
                  colorClass === "emerald" ? "bg-emerald-500 text-white" :
                  colorClass === "amber" ? "bg-amber-500 text-white" :
                  "bg-blue-500 text-white"
                )}>
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-base font-black tracking-tight uppercase">
                      {notif.title}
                    </h3>
                    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    {notif.message}
                  </p>
                  {!notif.isRead && (
                    <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest group-hover:gap-3 transition-all">
                      <span>Sync Detail</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </div>
                
                <button 
                    onClick={(e) => deleteNotif(notif._id, e)}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )
          })
        )}
      </div>
      
      {!loading && notifications.length > 5 && (
        <div className="text-center">
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Archive History</button>
        </div>
      )}
    </div>
  )
}
