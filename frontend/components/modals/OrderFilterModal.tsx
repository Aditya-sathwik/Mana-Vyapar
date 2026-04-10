"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  Calendar, 
  CreditCard, 
  Filter, 
  RotateCcw,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
  currentFilters: any
}

export function OrderFilterModal({ isOpen, onClose, onApply, currentFilters }: FilterModalProps) {
  const [filters, setFilters] = useState(currentFilters)

  const resetFilters = () => {
    setFilters({
      dateRange: "all",
      paymentMethod: "all",
      minAmount: "",
      maxAmount: "",
      search: ""
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-xl bg-card border-t sm:border border-border rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Visual Handle for Mobile */}
        <div className="sm:hidden flex justify-center pt-4">
           <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-8 pb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              Refine Manifest
            </h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mt-2">
              Apply structural filters to the queue
            </p>
          </div>
          <button 
            onClick={onClose}
            className="h-12 w-12 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-10">
          {/* Time Shard */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
               <Calendar className="h-3 w-3 text-primary" />
               Temporal Range
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "all", label: "All Time" },
                { id: "today", label: "Today" },
                { id: "yesterday", label: "Yesterday" },
                { id: "week", label: "Last 7 Days" }
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setFilters({ ...filters, dateRange: range.id })}
                  className={cn(
                    "h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2",
                    filters.dateRange === range.id 
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "bg-muted border-transparent text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Protocol */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
               <CreditCard className="h-3 w-3 text-primary" />
               Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["CASH", "UPI", "KHATA", "WHATSAPP", "all"].map((method) => (
                <button
                  key={method}
                  onClick={() => setFilters({ ...filters, paymentMethod: method })}
                  className={cn(
                    "h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2",
                    filters.paymentMethod === method 
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "bg-muted border-transparent text-muted-foreground hover:bg-muted/80",
                    method === "all" && "col-span-2"
                  )}
                >
                  {method === "all" ? "All Settlement Methods" : method}
                </button>
              ))}
            </div>
          </div>

          {/* Value Range */}
          <div className="space-y-4 pb-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
               <Zap className="h-3 w-3 text-primary" />
               Amount Threshold
            </h3>
            <div className="flex gap-4">
               <div className="flex-1 space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase ml-1">Min ₹</label>
                  <input 
                    type="number"
                    placeholder="0"
                    value={filters.minAmount}
                    onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                    className="w-full h-16 bg-muted border border-border rounded-2xl px-6 text-sm font-black text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-all"
                  />
               </div>
               <div className="flex-1 space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase ml-1">Max ₹</label>
                  <input 
                    type="number"
                    placeholder="No limit"
                    value={filters.maxAmount}
                    onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                    className="w-full h-16 bg-muted border border-border rounded-2xl px-6 text-sm font-black text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-all"
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Action Belt */}
        <div className="p-8 pt-0 space-y-4">
           <button 
             onClick={resetFilters}
             className="w-full h-12 flex items-center justify-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all group"
           >
             <RotateCcw className="h-4 w-4 group-hover:rotate-[-120deg] transition-transform duration-500" />
             Reset All Parameters
           </button>
           
           <button 
             onClick={() => {
               onApply(filters)
               onClose()
             }}
             className="w-full h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-xl active:scale-95"
           >
             Apply Manifest Filters
           </button>
        </div>
      </motion.div>
    </div>
  )
}
