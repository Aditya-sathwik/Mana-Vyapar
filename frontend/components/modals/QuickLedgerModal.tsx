"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Plus, Minus, Search, CreditCard, Wallet } from "lucide-react"
import { KhataAccount } from "@/hooks/use-khata"
import { cn } from "@/lib/utils"

interface QuickLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: KhataAccount[];
  onSuccess: (khataId: string, data: { amount: number; type: string; description: string }) => void;
  isLoading?: boolean;
}

export const QuickLedgerModal = ({ isOpen, onClose, customers, onSuccess, isLoading }: QuickLedgerModalProps) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"Credit" | "Payment Received">("Credit")
  const [description, setDescription] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(c => 
    (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || "").includes(searchTerm)
  )

  const handleSubmit = () => {
    if (selectedCustomerId && amount) {
      onSuccess(selectedCustomerId, {
        amount: parseFloat(amount),
        type,
        description: description || "Instant Ledger Entry"
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Ledger Entry"
      description="Record an instant transaction for any customer."
      onConfirm={handleSubmit}
      confirmLabel="Save Entry"
      isLoading={isLoading}
      size="lg"
    >
      <div className="space-y-6 py-4">
        {/* Customer Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Customer</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none transition-all mb-2"
            />
          </div>
          <div className="max-h-[150px] overflow-y-auto space-y-1 pr-2 custom-scrollbar border border-border rounded-2xl p-2 bg-muted/30">
            {filteredCustomers.map(customer => (
              <button
                key={customer._id}
                onClick={() => setSelectedCustomerId(customer._id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all border",
                  selectedCustomerId === customer._id 
                    ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5" 
                    : "hover:bg-muted border-transparent text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="h-8 w-8 rounded-lg bg-card flex items-center justify-center font-black text-[10px] border border-border">
                    {(customer.name || "UN").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-black leading-none mb-1 uppercase">{customer.name}</p>
                    <p className="text-[9px] font-bold opacity-60 tracking-wider font-mono">{customer.phone}</p>
                  </div>
                </div>
                {selectedCustomerId === customer._id && <Wallet className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Details */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setType("Credit")}
            className={cn(
              "h-14 flex items-center justify-center gap-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 shadow-xl",
              type === "Credit" 
                ? "bg-red-500 border-red-400 text-white shadow-red-500/20" 
                : "bg-muted border-transparent text-muted-foreground hover:border-red-500/20"
            )}
          >
            <Minus className="h-4 w-4" />
            YOU GAVE (OUT)
          </button>
          <button
            onClick={() => setType("Payment Received")}
            className={cn(
              "h-14 flex items-center justify-center gap-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 shadow-xl",
              type === "Payment Received" 
                ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20" 
                : "bg-muted border-transparent text-muted-foreground hover:border-emerald-500/20"
            )}
          >
            <Plus className="h-4 w-4" />
            YOU GOT (IN)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount</label>
               <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground text-sm">₹</div>
                  <input
                     type="number"
                     placeholder="0.00"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     className="w-full pl-8 pr-4 py-3 bg-muted border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold"
                  />
               </div>
           </div>
           <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notes / Item Name</label>
               <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                     type="text"
                     placeholder="e.g. Grocery Items"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold font-mono uppercase tracking-tighter"
                  />
               </div>
           </div>
        </div>
      </div>
    </Modal>
  )
}
