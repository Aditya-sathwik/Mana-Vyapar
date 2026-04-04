"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { 
  Search, 
  ArrowLeft,
  ArrowRight,
  Plus, 
  Tag, 
  Ticket,
  RefreshCw,
  Loader2,
  Trash2,
  Edit,
  AlertCircle,
  IndianRupee,
  Percent,
  Calendar,
  Users,
  CheckCircle2,
  Clock
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api-client"
import { CouponModal } from "@/components/merchant/coupon-modal"
import toast from "react-hot-toast"

function CouponsContent() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any>(null)
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    usage: 0
  })

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await apiFetch("/coupons")
      if (res.success) {
        setCoupons(res.data)
        
        // Calculate basic stats locally to save API calls
        const now = new Date()
        const total = res.data.length
        const active = res.data.filter((c: any) => c.isActive && (!c.expiryDate || new Date(c.expiryDate) > now)).length
        const expired = res.data.filter((c: any) => c.expiryDate && new Date(c.expiryDate) < now).length
        const usage = res.data.reduce((acc: number, c: any) => acc + (c.usedCount || 0), 0)
        
        setStats({ total, active, expired, usage })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load coupons")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  const handleOpenModal = (coupon: any = null) => {
    setEditingCoupon(coupon)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon? This cannot be undone.")) return
    try {
      const res = await apiFetch(`/coupons/${id}`, { method: "DELETE" })
      if (res.success) {
        toast.success("Coupon deleted")
        fetchCoupons()
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-12 text-center lg:text-left">
        <div className="space-y-2">
           <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-foreground tracking-tight uppercase leading-none">
             Promos <span className="text-primary italic">& Coupons</span>
           </h1>
           <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-4 mt-2">
              <span className="h-px w-6 md:w-16 bg-primary/30 hidden sm:block" />
              <p className="text-muted-foreground text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] lg:tracking-[0.4em]">
                Customer Incentives • {stats.active} Active Offers
              </p>
           </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full px-6 sm:px-0 mt-4 sm:mt-0">
           <button 
             onClick={() => handleOpenModal()}
             className="flex-1 lg:max-w-md flex items-center justify-center gap-3 md:gap-4 py-3.5 px-6 md:px-8 xl:px-10 bg-background hover:bg-accent text-foreground rounded-full transition-all active:scale-95 border-[1.5px] border-foreground shadow-[0_5px_15px_rgba(0,0,0,0.05)] mx-auto sm:mx-0"
           >
              <Plus className="h-7 w-7 md:h-8 md:w-8 stroke-[3] text-foreground shrink-0" />
              <div className="text-center md:text-left flex flex-col justify-center gap-0.5">
                <p className="text-[8px] md:text-[9px] font-black text-muted-foreground tracking-[0.15em] leading-none uppercase">Promotion</p>
                <p className="text-sm md:text-lg font-black text-foreground tracking-[0.1em] uppercase leading-none">Create Coupon</p>
              </div>
           </button>
        </div>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
         {[
           { label: "Created", value: stats.total, icon: Ticket, color: "text-blue-500", bg: "bg-blue-500/10" },
           { label: "Active", value: stats.active, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
           { label: "Expired", value: stats.expired, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
           { label: "Total Usage", value: stats.usage, icon: Users, color: "text-primary", bg: "bg-primary/10" },
         ].map((item, i) => (
            <Card key={i} className="p-4 md:p-8 bg-card border-border hover:border-primary/40 transition-all rounded-[1.25rem] md:rounded-[2rem] shadow-lg overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform">
                  <item.icon className="h-12 w-12 text-foreground" />
               </div>
               <div className="flex items-center gap-3 md:gap-5 relative z-10">
                  <div className={cn("h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                     <item.icon className="h-5 w-5 md:h-7 md:w-7" />
                  </div>
                  <div className="min-w-0 text-left">
                     <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5 truncate">{item.label}</p>
                     <p className="text-sm md:text-2xl font-black text-foreground uppercase tracking-tight leading-none truncate">{item.value}</p>
                  </div>
               </div>
            </Card>
         ))}
      </div>

      {/* --- REWARDS LIST --- */}
      <Card className="bg-card border-border overflow-hidden shadow-2xl rounded-[1.5rem] md:rounded-[2.5rem]">
         <div className="p-4 md:p-8 border-b border-border flex items-center justify-between gap-3 text-left bg-muted/30">
            <div className="relative flex-1 group">
               <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <input 
                type="text" 
                placeholder="Search promotion codes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 md:pl-14 pr-6 h-11 md:h-14 bg-background/50 border border-border rounded-xl md:rounded-2xl text-xs md:text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all shadow-inner"
               />
            </div>
            <button 
              onClick={() => fetchCoupons()}
              className="h-11 md:h-14 w-11 md:w-14 flex items-center justify-center bg-background border border-border rounded-xl md:rounded-2xl hover:text-primary transition-all shadow-sm shrink-0 active:scale-90"
            >
               <RefreshCw className={cn("h-4 md:h-5 w-4 md:w-5", isLoading && "animate-spin")} />
            </button>
         </div>

         <div className="divide-y divide-border/50 min-h-[400px]">
            {isLoading ? (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic animate-pulse">Scanning Cloud Promos...</p>
              </div>
            ) : filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <div key={coupon._id} className="p-5 md:p-8 hover:bg-primary/5 transition-all group flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 overflow-hidden">
                   {/* Left side: Code and Discount Info */}
                   <div className="flex items-center gap-4 w-full md:flex-1 min-w-0">
                      <div className="relative shrink-0">
                         <div className={cn(
                           "h-20 w-20 md:h-24 md:w-24 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center border-2 border-border group-hover:border-primary/50 transition-all shadow-xl relative",
                           coupon.type === "FLAT" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                         )}>
                            {coupon.type === "FLAT" ? <IndianRupee className="h-6 w-6" /> : <Percent className="h-6 w-6" />}
                            <span className="text-xl md:text-2xl font-black mt-1 leading-none">{coupon.value}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-60">{coupon.type}</span>
                         </div>
                         <div className={cn(
                           "absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-background shadow-lg flex items-center justify-center",
                           coupon.isActive ? "bg-emerald-500" : "bg-red-500"
                         )}>
                            <div className="h-1 w-1 rounded-full bg-white animate-pulse" />
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base md:text-2xl font-black text-foreground tracking-tighter uppercase truncate leading-none">{coupon.code}</h4>
                            {!coupon.isActive && (
                               <span className="text-[7px] font-black px-1 py-0.5 bg-red-500 text-white rounded uppercase tracking-widest">DISABLED</span>
                            )}
                         </div>
                         <p className="text-[10px] md:text-sm font-bold text-muted-foreground truncate leading-snug mb-2">{coupon.description || "No description provided."}</p>
                         <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[8px] md:text-[9px] font-black px-1.5 py-0.5 bg-muted text-muted-foreground rounded border border-border uppercase tracking-widest flex items-center gap-1">
                              <Users className="h-2 w-2" /> {coupon.usedCount} Uses
                            </span>
                            {coupon.minOrderAmount > 0 && (
                               <span className="text-[8px] md:text-[9px] font-black px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 uppercase tracking-widest">
                                 MIN: ₹{coupon.minOrderAmount}
                               </span>
                            )}
                            {coupon.expiryDate && (
                               <span className="text-[8px] md:text-[9px] font-black px-1.5 py-0.5 bg-muted text-muted-foreground rounded border border-border uppercase tracking-widest flex items-center gap-1">
                                 <Clock className="h-2 w-2" /> {new Date(coupon.expiryDate).toLocaleDateString()}
                               </span>
                            )}
                         </div>
                      </div>
                   </div>

                   {/* Right Side: Actions */}
                   <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 md:gap-12 mt-2 md:mt-0 border-t md:border-t-0 border-border/10 pt-4 md:pt-0">
                      <div className="flex items-center gap-2 w-full md:w-auto">
                          <button 
                              onClick={() => handleOpenModal(coupon)}
                              className="flex-1 md:flex-none h-11 md:h-12 px-4 md:px-8 flex items-center justify-center bg-muted border border-border rounded-xl text-muted-foreground hover:text-primary transition-all shadow-sm gap-2 active:scale-95"
                          >
                              <Edit className="h-4 w-4" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Configure</span>
                          </button>
                          <button 
                              onClick={() => handleDelete(coupon._id)}
                              className="flex-1 md:flex-none h-11 md:h-12 px-4 md:w-12 flex items-center justify-center bg-red-500/5 border border-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0 active:scale-95"
                          >
                              <Trash2 className="h-4 w-4" />
                          </button>
                      </div>
                   </div>
                </div>
              ))
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-center p-8">
                <Ticket className="h-16 w-16 text-muted-foreground/20" />
                <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest italic opacity-50">Zero Coupons Found</h3>
              </div>
            )}
         </div>
      </Card>

      <CouponModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchCoupons()}
        editingCoupon={editingCoupon}
      />
    </div>
  )
}

export default function CouponsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 text-primary animate-spin" /></div>}>
      <CouponsContent />
    </Suspense>
  )
}
