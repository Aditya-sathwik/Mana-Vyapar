"use client"

import { 
  Truck, 
  Package, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  MapPin,
  Box,
  ShoppingBag,
  ArrowUpRight,
  Plus,
  Loader2,
  ChevronLeft
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { 
  usePathname, 
  useRouter, 
  useSearchParams 
} from "next/navigation"
import { toast } from "react-hot-toast"
import { ManualOrderModal, OrderFilterModal, OrderDetailsModal } from "@/components/modals"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)
  const [summary, setSummary] = useState<any>(null)
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    dateRange: "all",
    paymentMethod: "all",
    minAmount: "",
    maxAmount: "",
    search: ""
  })
  const searchParams = useSearchParams()
  const querySearch = searchParams.get("search") || ""
  const [searchTerm, setSearchTerm] = useState(querySearch)

  useEffect(() => {
    if (querySearch) {
      setSearchTerm(querySearch)
      setCurrentPage(1)
      fetchOrders()
    }
  }, [querySearch])

  // Local filtering logic
  const filteredOrders = orders.filter(order => {
    // Tab Filter (Status)
    if (activeTab !== "all" && order.status !== activeTab) return false;

    // Payment Method Filter
    if (activeFilters.paymentMethod !== "all" && order.paymentMethod !== activeFilters.paymentMethod) return false;

    // Amount Filter
    if (activeFilters.minAmount && order.totalAmount < parseFloat(activeFilters.minAmount)) return false;
    if (activeFilters.maxAmount && order.totalAmount > parseFloat(activeFilters.maxAmount)) return false;

    // Date Filter (Today/Yesterday/Week)
    if (activeFilters.dateRange !== "all") {
       const orderDate = new Date(order.createdAt);
       const now = new Date();
       if (activeFilters.dateRange === "today") {
          if (orderDate.toDateString() !== now.toDateString()) return false;
       } else if (activeFilters.dateRange === "yesterday") {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          if (orderDate.toDateString() !== yesterday.toDateString()) return false;
       } else if (activeFilters.dateRange === "week") {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          if (orderDate < weekAgo) return false;
       }
    }

    return true;
  })

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("mana_vyapar_access_token") || "";
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const [ordersRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE}/orders/merchant?page=${currentPage}&limit=15${activeTab !== 'all' ? `&status=${activeTab}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}`, { headers }),
        fetch(`${API_BASE}/dashboard/summary`, { headers })
      ])
      
      const ordersData = await ordersRes.json()
      const summaryData = await summaryRes.json()
      
      setOrders(ordersData.data?.orders || [])
      setPagination(ordersData.data?.pagination)
      setSummary(summaryData.data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Manifest sync failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, activeTab, searchTerm])

  const statusColors: any = {
    PLACED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    SHIPPED: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins} mins ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} hours ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <Truck className="h-3 w-3" />
            Delivery Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
            All <span className="text-primary italic">Orders</span>
          </h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest italic">
            Manage your customer orders and delivery status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                if (currentPage !== 1) setCurrentPage(1)
                else fetchOrders() // Trigger fetch if already on page 1
              }}
              className="h-12 w-64 bg-card border border-border rounded-2xl pl-10 pr-4 text-xs text-foreground focus:outline-none focus:border-primary/30 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsManualOrderOpen(true)}
            className="h-12 px-6 bg-primary hover:bg-emerald-600 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Manual Order
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isManualOrderOpen && (
          <ManualOrderModal 
            isOpen={isManualOrderOpen}
            onClose={() => setIsManualOrderOpen(false)}
            onSuccess={fetchOrders}
          />
        )}

        {isFilterModalOpen && (
          <OrderFilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            onApply={setActiveFilters}
            currentFilters={activeFilters}
          />
        )}

        {isDetailsOpen && (
          <OrderDetailsModal
            isOpen={isDetailsOpen}
            onClose={() => {
              setIsDetailsOpen(false)
              setSelectedOrder(null)
            }}
            order={selectedOrder}
          />
        )}
      </AnimatePresence>

      {/* Fulfillment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Orders", value: summary?.totalOrders || "0", sub: "Total orders so far", icon: ShoppingBag, color: "blue" },
          { label: "Total Sales", value: `₹${summary?.totalSales?.toLocaleString() || "0"}`, sub: "Total money earned", icon: Truck, color: "indigo" },
          { label: "Sales Today", value: `₹${summary?.todayRevenue || "0"}`, sub: "Daily revenue", icon: CheckCircle2, color: "primary" },
          { label: "Stock Alerts", value: summary?.lowStockCount || "0", sub: "Items out of stock", icon: Clock, color: "orange" },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-card border-border group hover:border-primary/50 transition-all overflow-hidden relative">
            <div className="relative z-10 flex flex-col h-full">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                stat.color === 'primary' ? "bg-primary/10 text-primary" :
                stat.color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                stat.color === 'indigo' ? "bg-indigo-500/10 text-indigo-500" : "bg-orange-500/10 text-orange-500"
              )}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-foreground mb-1 tabular-nums">{stat.value}</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Order Shard */}
      <Card className="bg-card border-border overflow-hidden relative">
        {/* Tab Controls */}
        <div className="px-8 pt-8 border-b border-border">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                 <Box className="h-5 w-5 text-primary" />
                 Order Queue
              </h3>
              <div className="flex gap-2">
                 <button 
                   onClick={() => setIsFilterModalOpen(true)}
                   className={cn(
                     "p-2.5 rounded-xl border transition-all relative",
                     activeFilters.dateRange === 'all' && activeFilters.paymentMethod === 'all' && !activeFilters.minAmount && !activeFilters.maxAmount
                       ? "border-border hover:bg-muted" 
                       : "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                   )}
                 >
                   <Filter className="h-4 w-4" />
                   {/* Active filter dot */}
                   {(activeFilters.dateRange !== 'all' || activeFilters.paymentMethod !== 'all' || activeFilters.minAmount || activeFilters.maxAmount) && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                   )}
                 </button>
              </div>
           </div>

           <div className="flex gap-8 overflow-x-auto scrollbar-none pb-px">
              {["all", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                    activeTab === tab ? "text-primary px-2" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="order-tab-pill"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_10px_rgba(5,148,103,1)]" 
                    />
                  )}
                </button>
              ))}
           </div>
        </div>

        {/* Order Table with Scroller */}
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing Order Fragments...</span>
             </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Items & Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {filteredOrders.map((order, i) => (
                   <tr 
                     key={i} 
                     className="hover:bg-primary/5 transition-colors group cursor-pointer"
                     onClick={() => {
                       setSelectedOrder(order)
                       setIsDetailsOpen(true)
                     }}
                   >
                     <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                           <span className="text-xs font-black text-foreground tabular-nums truncate max-w-[120px]">{order.orderNumber || order._id}</span>
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{getTimeAgo(order.createdAt)}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-foreground">{order.customerName || "Walk-in Client"}</span>
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{order.paymentMethod}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                           <span className="text-xs font-bold text-foreground/80">{order.items?.length || 0} Units</span>
                           <span className="text-xs font-black text-primary tabular-nums">₹{order.totalAmount?.toLocaleString()}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className={cn(
                          "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter border",
                          statusColors[order.status] || "bg-muted text-muted-foreground"
                        )}>
                          {order.status}
                        </span>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <button 
                          className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOrder(order)
                            setIsDetailsOpen(true)
                          }}
                        >
                           <ChevronRight className="h-4 w-4" />
                        </button>
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Global Pagination Console */}
        {!loading && pagination && pagination.pages > 1 && (
           <div className="px-8 py-6 border-t border-border bg-muted/20 flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Page {currentPage} of {pagination.pages}</span>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">{pagination.total} Orders Managed</span>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                   disabled={currentPage === 1}
                   onClick={() => setCurrentPage(prev => prev - 1)}
                   className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                 >
                    <ChevronLeft className="h-4 w-4" />
                 </button>
                 <button 
                   disabled={currentPage >= pagination.pages}
                   onClick={() => setCurrentPage(prev => prev + 1)}
                   className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black"
                 >
                    <ChevronRight className="h-4 w-4" />
                 </button>
              </div>
           </div>
        )}

        {/* Empty State Projection */}
        {!loading && filteredOrders.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
             <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6 border border-dashed border-border">
                <AlertCircle className="h-10 w-10 text-muted-foreground/30" />
             </div>
             <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No matching orders in this sector</p>
             <button 
               onClick={() => setActiveTab("all")}
               className="mt-4 text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
             >
               Reset Core Filters
             </button>
          </div>
        )}
      </Card>

      {/* Logistics Partner Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="p-8 bg-gradient-to-br from-indigo-900 to-slate-950 border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
               <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  <ArrowUpRight className="h-6 w-6" />
               </div>
            </div>
            <div className="relative z-10 space-y-4">
               <div>
                  <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Advanced Delivery</p>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Delivery Partners</h3>
               </div>
               <p className="text-indigo-100/60 text-xs leading-relaxed max-w-sm font-medium">
                  Connect with delivery providers like Dunzo, Porter, or Shadowfax to automate your shipping.
               </p>
               <button className="mt-4 px-6 py-3 bg-white text-indigo-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-500/20">
                  Connect Now
               </button>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Truck className="h-40 w-40 text-white fill-white" />
            </div>
         </Card>

         <Card className="p-8 bg-card border-border flex flex-col justify-center">
            <div className="flex items-center gap-6 mb-6">
               <div className="h-14 w-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
                  <AlertCircle className="h-8 w-8" />
               </div>
               <div>
                  <h4 className="text-lg font-black text-foreground uppercase tracking-tight">Order Status</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Real-time tracking overview</p>
               </div>
            </div>
            <div className="space-y-3">
               <div className="p-3 rounded-xl bg-muted border border-border flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                    {orders.filter(o => o.status === 'PLACED').length} PLACED ORDERS WAITING TO PACK
                  </span>
               </div>
               <div className="p-3 rounded-xl bg-muted border border-border flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                    {orders.filter(o => o.status === 'SHIPPED').length} SHIPMENTS ON THE WAY
                  </span>
               </div>
            </div>
         </Card>
      </div>
    </div>
  )
}
