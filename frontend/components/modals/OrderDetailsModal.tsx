"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  FileText, 
  MessageSquare, 
  User, 
  Phone, 
  CreditCard, 
  Package, 
  Clock,
  Printer,
  ChevronRight,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"
import { generateInvoice } from "@/lib/invoice"

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)

  if (!isOpen || !order) return null

  const handleGenerateInvoice = async () => {
    try {
      setIsGenerating(true)
      // Call the professional generator
      generateInvoice(order)
      toast.success("Invoice manifest projected!")
    } catch (error) {
      toast.error("Failed to generate manifest")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendWhatsApp = async () => {
    try {
      setIsSending(true)
      // Simulate WhatsApp API call
      await new Promise(r => setTimeout(r, 1500))
      toast.success("Invoice sent to customer WhatsApp!")
    } catch (error) {
      toast.error("Failed to send WhatsApp message")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-card border border-border rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] mt-auto sm:mt-0"
      >
        {/* Header */}
        <div className="p-5 sm:p-8 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">
                {order.status}
              </span>
              <span className="text-xs font-black text-muted-foreground uppercase opacity-50 tracking-widest">#{order.orderNumber || order._id}</span>
            </div>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Order Details</h2>
          </div>
          <button 
            onClick={onClose}
            className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">
          {/* Section 1: Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
             <div className="space-y-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                   <User className="h-3 w-3" />
                   Customer Entity
                </h3>
                <div className="flex flex-col">
                   <span className="text-sm font-black text-foreground">{order.customerName || "Walk-in Client"}</span>
                   <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mt-1">
                      <Phone className="h-3 w-3" />
                      {order.customerPhoneNumber || "N/A"}
                   </div>
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                   <CreditCard className="h-3 w-3" />
                   Settlement Model
                </h3>
                <div className="flex flex-col">
                   <span className="text-sm font-black text-primary uppercase">{order.paymentMethod}</span>
                   <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mt-1 uppercase">
                      <Clock className="h-3 w-3" />
                      {new Date(order.createdAt).toLocaleDateString()}
                   </div>
                </div>
             </div>
          </div>

          {/* Section 2: Items Manifest */}
          <div className="space-y-4">
             <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Package className="h-3 w-3" />
                Line Items
             </h3>
             <div className="bg-muted/30 rounded-3xl border border-border overflow-hidden">
                <div className="divide-y divide-border">
                   {order.items?.map((item: any, i: number) => (
                     <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-foreground uppercase">{item.productName || "Product"}</span>
                           <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.quantity} {item.unit} x ₹{item.price}</span>
                        </div>
                        <span className="text-xs font-black text-foreground tabular-nums">₹{(item.price * item.quantity).toLocaleString()}</span>
                     </div>
                   ))}
                </div>
                <div className="p-6 bg-muted/50 border-t border-border space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                       <span>Subtotal</span>
                       <span className="text-foreground">₹{order.subtotal?.toLocaleString()}</span>
                    </div>
                    {order.couponCode && (
                       <div className="flex justify-between items-center text-[10px] font-bold text-emerald-500 uppercase">
                          <span>Coupon Applied ({order.couponCode})</span>
                          <span>-₹{(order.discountAmount || 0).toLocaleString()}</span>
                       </div>
                    )}
                    <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                       <span>Tax (GST)</span>
                       <span className="text-foreground">₹{(order.tax || 0).toLocaleString()}</span>
                    </div>
                   <div className="flex justify-between items-center pt-2 border-t border-border">
                      <span className="text-xs font-black text-foreground uppercase">Total Amount</span>
                      <span className="text-xl font-black text-primary tabular-nums">₹{order.totalAmount?.toLocaleString()}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-8 border-t border-border bg-muted/30 flex flex-col sm:flex-row gap-3 sm:gap-4">
           <button 
             disabled={isGenerating}
             onClick={handleGenerateInvoice}
             className="flex-1 h-14 border border-border rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all disabled:opacity-50"
           >
             {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
             Generate Invoice
           </button>
           <button 
             disabled={isSending}
             onClick={handleSendWhatsApp}
             className="flex-1 h-14 bg-emerald-500 text-black rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
           >
             {isSending ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : <MessageSquare className="h-4 w-4 text-black" />}
             WhatsApp Invoice
           </button>
        </div>
      </motion.div>
    </div>
  )
}
