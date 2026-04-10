"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { 
  Plus, 
  Minus, 
  Calendar, 
  FileText, 
  Wallet, 
  CreditCard, 
  ArrowRightLeft,
  Banknote,
  Receipt
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "Credit" | "Payment Received";
  customerName: string;
  onSuccess: (data: { amount: number; type: string; description: string; paymentMethod?: string }) => Promise<void>;
  isLoading?: boolean;
}

export const TransactionModal = ({ 
  isOpen, 
  onClose, 
  type, 
  customerName,
  onSuccess,
  isLoading 
}: TransactionModalProps) => {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  // Reset fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount("")
      setDescription("")
      setPaymentMethod("Cash")
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    await onSuccess({
      amount: parseFloat(amount),
      type,
      description: description || (type === "Credit" ? "Credit Entry" : "Payment Received"),
      paymentMethod: type === "Payment Received" ? paymentMethod : undefined
    });
    
    onClose();
  }

  const isCredit = type === "Credit"

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCredit ? "Record Credit (You Gave)" : "Record Payment (You Got)"}
      description={`Adding transaction for ${customerName}`}
      onConfirm={handleSubmit}
      confirmLabel={isCredit ? "Give Credit" : "Accept Payment"}
      isLoading={isLoading}
      size="md"
    >
      <div className="space-y-8 py-4">
        {/* Amount Input Section */}
        <div className="relative">
          <div className={cn(
            "p-8 rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-2 transition-all shadow-inner",
            isCredit ? "bg-red-50/50 border-red-500/20 dark:bg-red-950/20" : "bg-emerald-50/50 border-emerald-500/20 dark:bg-emerald-950/20"
          )}>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Transaction Amount</label>
            <div className="flex items-center gap-3">
              <span className={cn("text-4xl font-black", isCredit ? "text-red-600" : "text-emerald-600")}>₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="bg-transparent text-5xl font-black tracking-tighter w-48 text-center focus:outline-none placeholder:opacity-20 tabular-nums"
              />
            </div>
            <div className={cn(
              "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2",
              isCredit ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
            )}>
              {isCredit ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              {isCredit ? "Balance will increase" : "Balance will decrease"}
            </div>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notes / Description</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="e.g. For grocery/payment part 1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
            </div>
          </div>

          {!isCredit && (
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Cash", icon: Banknote },
                  { id: "UPI", icon: CreditCard },
                  { id: "Bank", icon: Receipt }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                      paymentMethod === m.id 
                        ? "bg-primary border-primary text-black shadow-lg shadow-primary/20" 
                        : "bg-muted border-border text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    <m.icon className="h-5 w-5" />
                    <span className="text-[9px] font-black uppercase">{m.id}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Transaction Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
