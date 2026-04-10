"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Phone, User } from "lucide-react"

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { customerName: string; customerPhoneNumber: string }) => void;
  isLoading?: boolean;
}

export const AddCustomerModal = ({ isOpen, onClose, onSuccess, isLoading }: AddCustomerModalProps) => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const handleSubmit = () => {
    if (name && phone) {
      onSuccess({ customerName: name, customerPhoneNumber: phone })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Customer"
      description="Register a new customer to your digital ledger for credit tracking."
      onConfirm={handleSubmit}
      confirmLabel="Create Account"
      isLoading={isLoading}
      size="md"
    >
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Customer Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold"
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
