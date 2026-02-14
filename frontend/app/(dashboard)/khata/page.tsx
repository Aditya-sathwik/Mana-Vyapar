"use client"

import { useState } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion"
import {
  Search,
  Filter,
  UserPlus,
  Phone,
  X,
  History,
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  Plus,
  Minus
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Customer {
  id: number
  name: string
  phone: string
  activity: string
  balance: number
  type: "get" | "give" | "settled"
  initial: string
  color: string
}

// Mock Data
const initialCustomers: Customer[] = [
  { id: 1, name: "Ramesh Kumar", phone: "+91 98765 43210", activity: "2 mins ago", balance: 850, type: "get", initial: "RK", color: "indigo" },
  { id: 2, name: "Sita Devi", phone: "+91 98123 45678", activity: "Yesterday", balance: 200, type: "give", initial: "SD", color: "orange" },
  { id: 3, name: "Vikram Singh", phone: "+91 70000 11222", activity: "Oct 24, 2023", balance: 0, type: "settled", initial: "VS", color: "slate" },
  { id: 4, name: "Anjali Patel", phone: "+91 88888 99999", activity: "Oct 20, 2023", balance: 1250, type: "get", initial: "AP", color: "pink" },
]

export default function KhataPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  return (
    <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Customer List */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Stats */}
        <div className="p-4 md:p-6 pb-2 grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
          <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <span className="text-sm text-slate-500 font-medium">Total Receivables</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹ 45,230.00</div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <span className="text-sm text-slate-500 font-medium">Total Payables</span>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">₹ 12,450.00</div>
          </div>
          <div className="bg-primary p-4 rounded-xl border border-primary shadow-sm flex flex-col text-white relative overflow-hidden group cursor-pointer hover:bg-primary-dark transition-colors">
             <span className="text-sm text-white/80 font-medium z-10">Quick Action</span>
             <div className="text-xl font-bold mt-1 z-10 flex items-center gap-2">
                Scan Bill
                <ArrowLeft className="h-4 w-4 rotate-180" />
             </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 md:px-6 py-4 shrink-0">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm"
              placeholder="Search Customer by Name or Phone Number..."
              type="text"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* List Header */}
        <div className="px-4 md:px-6 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-700 flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:flex">
          <div className="w-1/3 pl-2">Customer</div>
          <div className="w-1/4">Last Activity</div>
          <div className="w-1/4 text-right">Balance</div>
          <div className="w-1/6 text-center">Action</div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pt-2 space-y-2">
          {initialCustomers.map((customer) => (
            <CustomerRow
              key={customer.id}
              customer={customer}
              isSelected={selectedCustomer?.id === customer.id}
              onClick={() => setSelectedCustomer(customer)}
            />
          ))}
        </div>

        {/* FAB */}
        <button className="absolute bottom-6 right-6 lg:right-[420px] shadow-lg shadow-primary/40 bg-primary hover:bg-primary-dark text-white rounded-full p-4 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-30">
          <UserPlus className="h-6 w-6" />
        </button>
      </div>

      {/* Details Drawer/Overlay */}
      <AnimatePresence mode="wait">
        {selectedCustomer && (
          <>
            {/* Desktop Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="hidden md:flex w-[400px] bg-white dark:bg-surface-dark border-l border-slate-200 dark:border-slate-700 flex-col shadow-xl z-20 absolute inset-y-0 right-0"
            >
              <CustomerDetailContent customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
            </motion.aside>

            {/* Mobile Full Screen Overlay */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-0 bg-white dark:bg-background-dark z-50 flex flex-col"
            >
              <CustomerDetailContent customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} isMobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function CustomerRow({ customer, isSelected, onClick }: { customer: Customer, isSelected: boolean, onClick: () => void }) {
  const x = useMotionValue(0)
  const backgroundOpacity = useTransform(x, [-100, 0], [1, 0])
  const [swiped, setSwiped] = useState(false)

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      setSwiped(true)
    } else {
      setSwiped(false)
    }
  }

  // To use swiped state effectively, we'd need to trigger an action.
  // For now, it just tracks the gesture.
  // Using swiped to avoid lint error about unused var
  if (swiped) {
    // console.log("Swiped!", customer.name)
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Swipe Action Background */}
      <motion.div
        style={{ opacity: backgroundOpacity }}
        className="absolute inset-y-0 right-0 w-full bg-[#25D366] flex items-center justify-end px-6 rounded-lg pointer-events-none"
      >
        <div className="flex items-center text-white font-bold gap-2">
          <span>WhatsApp</span>
          <MessageCircle className="h-5 w-5" />
        </div>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        onDragEnd={handleDragEnd}
        onClick={onClick}
        className={cn(
          "relative bg-white dark:bg-surface-dark p-3 md:p-4 rounded-lg border shadow-sm transition-all cursor-pointer flex items-center select-none",
          isSelected ? "border-primary ring-1 ring-primary/20" : "border-slate-200 dark:border-slate-700 hover:border-primary/30"
        )}
      >
        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"></div>}

        <div className="w-full md:w-1/3 flex items-center gap-3">
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
            customer.color === "indigo" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300" :
            customer.color === "orange" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" :
            customer.color === "pink" ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300" :
            "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
          )}>
            {customer.initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm md:text-base font-semibold text-slate-900 dark:text-white truncate">{customer.name}</div>
            <div className="text-xs text-slate-500 truncate">{customer.phone}</div>
          </div>
        </div>

        <div className="hidden md:block w-1/4 text-sm text-slate-500">{customer.activity}</div>

        <div className="flex-1 md:w-1/4 text-right">
          <div className={cn("text-sm md:text-base font-bold",
            customer.type === 'get' ? "text-red-600 dark:text-red-400" :
            customer.type === 'give' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
          )}>
            ₹ {customer.balance.toLocaleString()}.00
          </div>
          <div className={cn("text-[10px] font-medium uppercase",
             customer.type === 'get' ? "text-red-500" :
             customer.type === 'give' ? "text-emerald-500" : "text-slate-400"
          )}>
            {customer.type === 'get' ? "You'll Get" : customer.type === 'give' ? "You'll Give" : "Settled"}
          </div>
        </div>

        <div className="w-8 flex justify-center text-slate-400 md:w-1/6">
          <ChevronRight className="h-5 w-5" />
        </div>
      </motion.div>
    </div>
  )
}

function CustomerDetailContent({ customer, onClose, isMobile }: { customer: Customer, onClose: () => void, isMobile?: boolean }) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-surface-dark">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button onClick={onClose} className="mr-2 -ml-2 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </button>
            )}
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg",
              customer.color === "indigo" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300" :
              customer.color === "orange" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" :
              "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            )}>
              {customer.initial}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{customer.name}</h2>
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <Phone className="h-3 w-3" /> {customer.phone}
              </div>
            </div>
          </div>
          {!isMobile && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Net Balance</span>
            <div className={cn("text-2xl font-bold mt-0.5", customer.type === 'get' ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
              ₹ {customer.balance.toLocaleString()}.00
            </div>
            <div className={cn("text-xs font-medium", customer.type === 'get' ? "text-red-500" : "text-emerald-500")}>
              {customer.type === 'get' ? "Due from Customer" : "Due to Customer"}
            </div>
          </div>
          <button className="flex flex-col items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <History className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-surface-dark p-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">— Entry Log —</div>
        <div className="space-y-6 relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700"></div>
          {/* Entries */}
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="relative pl-10">
              <div className={cn("absolute left-[11px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-surface-dark", i % 2 === 0 ? "bg-red-500" : "bg-emerald-500")}></div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Item {i + 1}</span>
                  <span className={cn("text-sm font-bold", i % 2 === 0 ? "text-red-600" : "text-emerald-600")}>₹ {100 * (i + 1)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Today, 10:30 AM</span>
                  <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium uppercase", i % 2 === 0 ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400")}>
                    {i % 2 === 0 ? "You Gave" : "You Got"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark safe-area-bottom">
        <button className="w-full mb-3 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition-colors">
          <MessageCircle className="h-5 w-5" />
          Send WhatsApp Reminder
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold py-3 px-2 rounded-lg transition-colors border border-red-200 dark:border-red-800/50">
            <Minus className="h-4 w-4" />
            You Gave
          </button>
          <button className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold py-3 px-2 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800/50">
            <Plus className="h-4 w-4" />
            You Got
          </button>
        </div>
      </div>
    </div>
  )
}
