"use client"

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
  ArrowRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const notifications = [
  {
    id: 1,
    title: "New Order Received",
    message: "Order #8492 from Ramesh Kumar is ready for pick up.",
    time: "4 mins ago",
    icon: ShoppingBag,
    color: "primary",
    read: false
  },
  {
    id: 2,
    title: "AI Feature Update",
    message: "You can now scan handwritten 'chitti' bills with 99% accuracy.",
    time: "1 hour ago",
    icon: Info,
    color: "blue",
    read: false
  },
  {
    id: 3,
    title: "Referral Bonus Released",
    message: "Congratulations! You earned ₹150 for referring S.K. Stores.",
    time: "Yesterday",
    icon: Gift,
    color: "purple",
    read: true
  },
  {
    id: 4,
    title: "Weekly Summary",
    message: "Your store activity for March 8 - March 15 is ready to view.",
    time: "2 days ago",
    icon: CheckCircle2,
    color: "emerald",
    read: true
  }
]

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Stay in the loop with transactional updates and product news.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button className="text-sm font-semibold text-primary hover:underline px-2">Mark all as read</button>
           <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 className="h-5 w-5" />
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-px">
         <button className="pb-4 border-b-2 border-primary text-primary font-bold text-sm px-2">All Notifications</button>
         <button className="pb-4 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-slate-700 px-2">Unread</button>
         <button className="pb-4 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-slate-700 px-2">Orders</button>
         <button className="pb-4 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-slate-700 px-2">System</button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm"
          placeholder="Search notifications..."
          type="text"
        />
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className={cn(
              "p-4 md:p-6 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer relative",
              !notif.read ? "bg-primary/5 dark:bg-primary/10" : ""
            )}
          >
            {!notif.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r-lg"></div>}
            
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
              notif.color === "primary" ? "bg-primary/10 text-primary" :
              notif.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
              notif.color === "purple" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" :
              "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
            )}>
              <notif.icon className="h-6 w-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className={cn("text-base font-bold", notif.read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white")}>
                  {notif.title}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
              </div>
              <p className={cn("text-sm", notif.read ? "text-slate-500 dark:text-slate-400" : "text-slate-600 dark:text-slate-300")}>
                {notif.message}
              </p>
              {!notif.read && (
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-primary hover:gap-2 transition-all">
                  <span>Take Action</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              )}
            </div>
            
            <button className="text-slate-300 hover:text-slate-500 p-1">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <button className="text-sm font-semibold text-slate-400 hover:text-primary transition-colors">View Older Notifications</button>
      </div>
    </div>
  )
}
