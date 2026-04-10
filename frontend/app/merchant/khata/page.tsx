"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Search, Filter, UserPlus, Phone, X, History, ArrowLeft, ChevronRight, ChevronLeft, MessageCircle, Plus, Minus, CheckCircle2, ExternalLink, MoreVertical, Calendar, Share2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { AddCustomerModal, QuickLedgerModal, TransactionModal } from "@/components/modals"
import { useKhata, KhataAccount } from "@/hooks/use-khata"

export default function KhataPage() {
  const { khataAccounts, loading, error, pagination, page, setPage, refreshKhata, addCustomer, getCustomerDetails, performTransaction } = useKhata()
  const searchParams = useSearchParams()
  const querySearch = searchParams.get("search") || ""
  const [selectedCustomer, setSelectedCustomer] = useState<KhataAccount | null>(null)
  const [searchTerm, setSearchTerm] = useState(querySearch)

  useEffect(() => {
    if (querySearch) {
      setSearchTerm(querySearch)
      refreshKhata(querySearch, 1)
    }
  }, [querySearch, refreshKhata])
  
  // Modal States
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [isQuickLedgerOpen, setIsQuickLedgerOpen] = useState(false)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"Credit" | "Payment Received">("Credit")
  const [isActionLoading, setIsActionLoading] = useState(false)
  
  // Filter States
  const [filterType, setFilterType] = useState<"all" | "receivables" | "payables" | "settled">("all")

  // Calculate Stats
  const receivables = khataAccounts.filter(a => a.balance > 0).reduce((acc, curr) => acc + curr.balance, 0)
  const payables = khataAccounts.filter(a => a.balance < 0).reduce((acc, curr) => acc + Math.abs(curr.balance), 0)

  const filteredCustomers = khataAccounts.filter(c => {
    const matchesSearch = (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c.phone || "").includes(searchTerm);
    
    if (!matchesSearch) return false;
    
    if (filterType === "receivables") return c.balance > 0;
    if (filterType === "payables") return c.balance < 0;
    if (filterType === "settled") return c.balance === 0;
    
    return true;
  })

  const exportReport = () => {
    const headers = ["Customer Name", "Phone", "Balance", "Last Updated"];
    const rows = filteredCustomers.map(c => [
      c.name,
      c.phone,
      c.balance,
      new Date(c.updatedAt).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `khata_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleAddCustomerSubmit = async (data: { customerName: string; customerPhoneNumber: string }) => {
    try {
       setIsActionLoading(true)
       await addCustomer(data)
       setIsAddCustomerOpen(false)
    } catch (err) {
       console.error("Add customer failed", err)
    } finally {
       setIsActionLoading(false)
    }
  }

  const handleQuickLedgerSubmit = async (khataId: string, data: { amount: number; type: string; description: string }) => {
     try {
        setIsActionLoading(true)
        await performTransaction(khataId, data)
        setIsQuickLedgerOpen(false)
     } catch (err) {
        console.error("Quick ledger entry failed", err)
     } finally {
        setIsActionLoading(false)
     }
  }

  const handleCustomerSelect = async (customer: KhataAccount) => {
     try {
        const details = await getCustomerDetails(customer._id);
        setSelectedCustomer(details);
     } catch (err) {
        console.error("Failed to fetch customer details", err);
        setSelectedCustomer(customer); // Fallback to basic info if details fail
     }
  }

   const handleAddCustomer = () => {
      setIsAddCustomerOpen(true)
   }

  return (
    <div className="space-y-10 pb-12 relative overflow-hidden h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase leading-none">
             Digital <span className="text-primary tracking-normal">Khata</span> Ledger
           </h1>
           <p className="text-muted-foreground text-sm mt-1 font-medium italic">
              Managing {khataAccounts.length} loyal customers • ₹{(receivables + payables).toLocaleString()} total exposure
           </p>
        </div>
         <div className="flex items-center gap-3">
            <button 
               onClick={exportReport}
               className="h-12 flex items-center gap-3 px-6 bg-foreground text-background rounded-2xl font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95 group"
            >
               <Share2 className="h-4 w-4" />
               EXPORT REPORT
            </button>
            <button 
               onClick={handleAddCustomer}
               className="h-12 flex items-center gap-3 px-6 bg-primary hover:bg-primary-dark text-black rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group"
            >
               <UserPlus className="h-5 w-5" />
               ADD NEW CUSTOMER
            </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <Card className="p-8 bg-card border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Plus className="h-16 w-16 text-emerald-500" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Receivables</p>
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">₹{receivables.toLocaleString()}.00</h3>
            <p className="text-[10px] font-bold text-muted-foreground mt-2">Expected collection within 7 days</p>
         </Card>
         <Card className="p-8 bg-card border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Minus className="h-16 w-16 text-red-500" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Payables</p>
            <h3 className="text-3xl font-black text-red-600 dark:text-red-400 tracking-tighter">₹{payables.toLocaleString()}.00</h3>
            <p className="text-[10px] font-bold text-muted-foreground mt-2">Due to local vendors/suppliers</p>
         </Card>
          <Card 
            onClick={() => setIsQuickLedgerOpen(true)}
            className="p-8 bg-primary/5 dark:bg-primary/10 border-primary/20 border-dashed relative overflow-hidden group cursor-pointer hover:border-primary/40 transition-all h-full"
          >
            <div className="flex items-center gap-4">
               <div className="h-14 w-14 rounded-2xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
                  <Plus className="h-8 w-8" />
               </div>
               <div>
                  <h4 className="font-black text-foreground uppercase tracking-tighter leading-none mb-1">Quick Ledger</h4>
                  <p className="text-xs text-muted-foreground font-medium italic underline underline-offset-4">Add instant entry</p>
               </div>
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Customer List Column */}
         <div className="lg:col-span-12 space-y-6">
            <Card className="p-4 bg-card border-border">
               <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative flex-1 w-full">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <input 
                      type="text" 
                      placeholder="Search by name, phone, or location..." 
                      value={searchTerm}
                      onChange={(e) => {
                          setSearchTerm(e.target.value)
                          refreshKhata(e.target.value, 1)
                      }}
                      className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                     />
                  </div>
                   <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                      {[
                        { id: "all", label: "All Ledgers" },
                        { id: "receivables", label: "Receivables" },
                        { id: "payables", label: "Payables" },
                        { id: "settled", label: "Settled" }
                      ].map(type => (
                        <button 
                          key={type.id}
                          onClick={() => setFilterType(type.id as any)}
                          className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                            filterType === type.id 
                              ? "bg-primary text-black border-primary shadow-lg shadow-primary/20" 
                              : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                          )}
                        >
                          {type.label}
                        </button>
                      ))}
                   </div>
               </div>
            </Card>

            <Card className="bg-card border-border overflow-hidden shadow-2xl">
               <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-muted/50 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                           <th className="px-8 py-6">Customer Profile</th>
                           <th className="px-6 py-6">Last Transaction</th>
                           <th className="px-6 py-6">Status</th>
                           <th className="px-6 py-6 font-black text-right pr-12">Net Balance</th>
                           <th className="px-6 py-6 text-right"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/50 font-medium">
                        {filteredCustomers.map((customer) => (
                           <tr 
                            key={customer._id} 
                            onClick={() => handleCustomerSelect(customer)}
                            className="hover:bg-primary/5 transition-all cursor-pointer group"
                           >
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className={cn(
                                       "h-14 w-14 rounded-[1.5rem] flex items-center justify-center font-black text-lg transition-transform group-hover:scale-105 group-hover:rotate-3 shadow-lg bg-primary/10 text-primary"
                                    )}>
                                       {(customer.name || "UN").substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                       <h4 className="font-black text-foreground text-lg tracking-tight leading-none mb-1.5">{customer.name}</h4>
                                       <p className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Phone className="h-3 w-3" /> {customer.phone}
                                       </p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-6">
                                 <div className="flex items-center gap-2 text-sm text-foreground/80">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {new Date(customer.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                 </div>
                              </td>
                              <td className="px-6 py-6">
                                 <span className={cn(
                                   "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                   customer.balance === 0 ? "bg-muted text-muted-foreground" :
                                   customer.balance > 0 ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                                   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                 )}>
                                    <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", 
                                      customer.balance === 0 ? "bg-muted-foreground/50" :
                                      customer.balance > 0 ? "bg-red-500" : "bg-emerald-500"
                                    )} />
                                    {customer.balance > 0 ? "You get" : customer.balance < 0 ? "You give" : "Settled"}
                                 </span>
                              </td>
                              <td className="px-6 py-6 text-right pr-12">
                                 <div className={cn("text-xl font-black tracking-tighter", 
                                   customer.balance === 0 ? "text-muted-foreground/50" :
                                   customer.balance > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                                 )}>
                                    ₹ {Math.abs(customer.balance).toLocaleString()}.00
                                 </div>
                              </td>
                              <td className="px-6 py-6 text-right">
                                 <button className="p-3 text-muted-foreground/30 hover:text-primary transition-all hover:bg-primary/10 rounded-2xl">
                                    <ChevronRight className="h-6 w-6" />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Ledger Pagination Console */}
               {!loading && pagination && pagination.pages > 1 && (
                  <div className="px-8 py-6 border-t border-border bg-muted/20 flex items-center justify-between">
                     <div className="flex flex-col text-left">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Digital Page {page} of {pagination.pages}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">{pagination.total} Ledger Records Found</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <button 
                          disabled={page === 1}
                          onClick={() => refreshKhata(searchTerm, page - 1)}
                          className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                           <ChevronLeft className="h-4 w-4 text-foreground" />
                        </button>
                        <button 
                          disabled={page >= pagination.pages}
                          onClick={() => refreshKhata(searchTerm, page + 1)}
                          className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                           <ChevronRight className="h-4 w-4 text-foreground" />
                        </button>
                     </div>
                  </div>
               )}
            </Card>
         </div>
      </div>

      {/* Customer Side Drawer Overlay */}
      <AnimatePresence>
         {selectedCustomer && (
            <>
               <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCustomer(null)}
                className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[60]"
               />
               <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-screen w-full md:w-[600px] bg-card shadow-2xl z-[70] border-l border-border flex flex-col"
               >
                  <div className="p-8 border-b border-border bg-muted/50 relative overflow-hidden text-card-foreground">
                     <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <History className="h-48 w-48 text-primary" />
                     </div>
                     <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="absolute top-6 right-6 p-3 bg-card border border-border rounded-2xl text-muted-foreground hover:text-red-500 transition-all hover:rotate-90"
                     >
                        <X className="h-6 w-6" />
                     </button>
                     
                     <div className="flex items-center gap-6 mb-10">
                        <div className={cn(
                          "h-24 w-24 rounded-[2.5rem] bg-primary/10 text-primary flex items-center justify-center font-black text-3xl shadow-2xl"
                        )}>
                           {(selectedCustomer.name || "UN").substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                           <h2 className="text-4xl font-black text-foreground tracking-tighter leading-none mb-3">{selectedCustomer.name}</h2>
                           <div className="flex items-center gap-6">
                              <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                 <Phone className="h-4 w-4 text-primary" /> {selectedCustomer.phone}
                              </p>
                              <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                 <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Verified 
                              </p>
                           </div>
                        </div>
                     </div>
 
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-card rounded-[2rem] border border-border shadow-inner">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Current Balance</p>
                           <h4 className={cn("text-3xl font-black tracking-tighter", 
                             selectedCustomer.balance > 0 ? "text-red-600" : "text-emerald-600"
                           )}>₹{Math.abs(selectedCustomer.balance).toLocaleString()}.00</h4>
                           <span className="text-[10px] font-black text-muted-foreground/60 uppercase">{selectedCustomer.balance > 0 ? "Pending recovery" : "Safe payout"}</span>
                        </div>
                        <div className="p-6 bg-card rounded-[2rem] border border-border shadow-inner">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Last Update</p>
                           <h4 className="text-3xl font-black text-foreground tracking-tighter italic">
                              {new Date(selectedCustomer.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                           </h4>
                           <span className="text-[10px] font-black text-muted-foreground/60 uppercase">Cloud Sync Active</span>
                        </div>
                     </div>
                  </div>
 
                  <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-card">
                     <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] text-center mb-10">— TRANSACTION LEDGER —</h3>
                     <div className="space-y-6">
                        {selectedCustomer.transactions?.length ? selectedCustomer.transactions.map((txn, i) => (
                           <div key={txn._id} className="group relative flex gap-6">
                              <div className="flex flex-col items-center gap-2">
                                 <div className={cn("h-4 w-4 rounded-full border-4 border-background shadow-sm z-10", 
                                    (txn.type === "Credit" || txn.type === "Payment Made") ? "bg-red-500" : "bg-emerald-500"
                                 )} />
                                 {i < selectedCustomer.transactions!.length - 1 && <div className="w-0.5 flex-1 bg-border rounded-full" />}
                              </div>
                              <div className="flex-1 pb-10">
                                 <div className={cn(
                                    "bg-muted/50 p-6 rounded-[2rem] border transition-all",
                                    (txn.type === "Credit" || txn.type === "Payment Made") ? "border-red-500/10 group-hover:border-red-500/30" : "border-emerald-500/10 group-hover:border-emerald-500/30"
                                 )}>
                                    <div className="flex justify-between items-start mb-4">
                                       <div>
                                          <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">TXN #{txn.transactionId.slice(-8)}</p>
                                          <h5 className="font-black text-foreground uppercase tracking-tight">{txn.description || "Digital Entry"}</h5>
                                       </div>
                                       <span className={cn("text-lg font-black tracking-tighter", 
                                          (txn.type === "Credit" || txn.type === "Payment Made") ? "text-red-600" : "text-emerald-600"
                                       )}>
                                          {(txn.type === "Credit" || txn.type === "Payment Made") ? "-" : "+"} ₹{txn.amount.toLocaleString()}.00
                                       </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border border-dashed">
                                       <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                                          <Calendar className="h-3 w-3" /> {new Date(txn.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                       </div>
                                       <div className="text-[9px] font-black text-muted-foreground/40 uppercase">
                                          Balance After: ₹{txn.balanceAfter.toLocaleString()}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )) : (
                           <div className="py-20 text-center space-y-4">
                              <History className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">No Transaction History found</p>
                           </div>
                        )}
                     </div>
                  </div>
 
                  <div className="p-8 border-t border-border bg-card safe-area-bottom">
                     <div className="grid grid-cols-2 gap-6 mb-4">
                        <button 
                           onClick={() => {
                              setTransactionType("Credit")
                              setIsTransactionModalOpen(true)
                           }}
                           className="h-16 bg-red-600 text-white rounded-3xl font-black text-sm shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                           <Minus className="h-5 w-5" />
                           YOU GAVE (OUT)
                        </button>
                        <button 
                           onClick={() => {
                              setTransactionType("Payment Received")
                              setIsTransactionModalOpen(true)
                           }}
                           className="h-16 bg-emerald-600 text-white rounded-3xl font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                           <Plus className="h-5 w-5" />
                           YOU GOT (IN)
                        </button>
                     </div>
                     <button className="w-full h-16 bg-[#25D366] text-white rounded-3xl font-black text-sm shadow-xl shadow-emerald-900/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
                        <MessageCircle className="h-6 w-6" />
                        SEND WHATSAPP REMINDER
                     </button>
                  </div>
               </motion.aside>
            </>
         )}
       </AnimatePresence>

       {/* Floating Modals */}
       <AddCustomerModal 
         isOpen={isAddCustomerOpen} 
         onClose={() => setIsAddCustomerOpen(false)}
         onSuccess={handleAddCustomerSubmit}
         isLoading={isActionLoading}
       />

       <QuickLedgerModal
         isOpen={isQuickLedgerOpen}
         onClose={() => setIsQuickLedgerOpen(false)}
         customers={khataAccounts}
         onSuccess={handleQuickLedgerSubmit}
         isLoading={isActionLoading}
       />

       {selectedCustomer && (
         <TransactionModal 
            isOpen={isTransactionModalOpen}
            onClose={() => setIsTransactionModalOpen(false)}
            type={transactionType}
            customerName={selectedCustomer.name}
            isLoading={isActionLoading}
            onSuccess={async (data) => {
               try {
                  setIsActionLoading(true)
                  await performTransaction(selectedCustomer._id, data)
                  await handleCustomerSelect(selectedCustomer) // Refresh details
                  setIsTransactionModalOpen(false)
               } catch (err) {
                  console.error("Transaction failed", err)
               } finally {
                  setIsActionLoading(false)
               }
            }}
         />
       )}
    </div>
  )
}
