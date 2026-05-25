"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { supportApi } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Headphones, 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Send, 
  Paperclip, 
  MoreVertical,
  ChevronRight,
  Plus,
  ArrowLeft,
  X,
  FileText,
  User,
  ShieldCheck,
  AlertCircle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import ChatInterface from "@/components/shared/ChatInterface"

// Mock Tickets
const MOCK_TICKETS = [
  {
    id: "TIC-8821",
    subject: "Payout Delay Notification",
    lastMessage: "Thank you for the update. We are checking with the bank.",
    status: "in-progress",
    priority: "high",
    updatedAt: "2 mins ago",
    messages: [
      { id: 1, sender: "merchant", text: "My payout for last week is still pending. Any reasons for the delay?", timestamp: "10:00 AM" },
      { id: 2, sender: "admin", text: "Hello! We are currently experiencing a slight delay due to regional banking holidays. It should reach you by tomorrow.", timestamp: "10:15 AM" },
      { id: 3, sender: "merchant", text: "Thank you for the update. We are checking with the bank.", timestamp: "10:17 AM" },
    ]
  },
  {
    id: "TIC-7712",
    subject: "Bulk CSV Import Error",
    lastMessage: "File format seems correct, checking logs.",
    status: "open",
    priority: "medium",
    updatedAt: "1 hour ago",
    messages: [
       { id: 1, sender: "merchant", text: "Encountering 'Unexpected Token' error while importing 500 products via CSV.", timestamp: "09:00 AM" }
    ]
  },
  {
    id: "TIC-6601",
    subject: "Return Policy Query",
    lastMessage: "Policy updated as requested.",
    status: "resolved",
    priority: "low",
    updatedAt: " Yesterday",
    messages: []
  }
]

export default function MerchantSupportPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null)
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false)

  // Form states for new ticket creation
  const [newTitle, setNewTitle] = useState("")
  const [newCategory, setNewCategory] = useState("Technical Issue")
  const [newPriority, setNewPriority] = useState("Medium")
  const [newDescription, setNewDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const res = await supportApi.getTickets()
      if (res.success && Array.isArray(res.data)) {
        setTickets(res.data)
      } else if (Array.isArray(res)) {
        setTickets(res)
      }
    } catch (err: any) {
      console.error("Failed to fetch tickets:", err)
      toast.error(err?.message || "Failed to load support inquiries")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleCreateTicket = async () => {
    if (!newTitle.trim() || !newDescription.trim()) return
    try {
      setSubmitting(true)
      const res = await supportApi.createTicket({
        title: newTitle,
        description: newDescription,
        category: newCategory,
        priority: newPriority
      })
      toast.success("Support ticket created successfully!")
      setNewTitle("")
      setNewDescription("")
      setNewCategory("Technical Issue")
      setNewPriority("Medium")
      setIsNewTicketModalOpen(false)
      await fetchTickets()
    } catch (err: any) {
      console.error("Failed to create ticket:", err)
      toast.error(err?.message || "Failed to submit inquiry. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }



  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-foreground tracking-tighter uppercase sm:text-5xl lg:text-6xl flex items-center gap-4">
            Command <span className="text-primary italic">Support</span>
          </h1>
          <p className="text-muted-foreground text-xs uppercase font-bold tracking-[0.3em] mt-2">
            24/7 Priority Assistance for Merchants • Enterprise Grade
          </p>
        </div>
        <Button 
            onClick={() => setIsNewTicketModalOpen(true)}
            className="rounded-2xl h-14 px-8 bg-primary text-white shadow-[0_0_30px_rgba(5,148,103,0.3)] hover:scale-105 transition-all text-[10px] font-black uppercase tracking-[0.2em] gap-3"
        >
          <Plus className="h-4 w-4" /> Open New Inquiry
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[750px] relative">
        {/* Ticket Sidebar */}
        <div className={cn(
            "lg:col-span-4 h-full bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden flex flex-col",
            selectedTicket ? "hidden lg:flex" : "flex"
        )}>
          <div className="p-6 border-b border-border/50">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search tickets..."
                className="bg-muted/30 border-border/50 pl-10 h-12 rounded-xl text-xs uppercase tracking-widest font-bold"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {loading ? (
              <div className="p-8 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                Loading live inquiries...
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                No active inquiries
              </div>
            ) : (
              tickets.map((ticket) => {
                const ticketId = ticket.ticketNumber || ticket._id || ticket.id;
                const ticketTitle = ticket.title || ticket.subject;
                const ticketUpdatedAt = ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently';
                const statusLower = (ticket.status || 'open').toLowerCase();
                const priorityLower = (ticket.priority || 'medium').toLowerCase();

                return (
                  <motion.div
                    key={ticket._id || ticketId}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      "p-4 rounded-2xl cursor-pointer transition-all border border-transparent group",
                      (selectedTicket?.ticketNumber === ticket.ticketNumber || selectedTicket?._id === ticket._id)
                        ? "bg-primary/10 border-primary/20 shadow-lg shadow-primary/5" 
                        : "hover:bg-muted/40"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">#{ticketId}</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{ticketUpdatedAt}</span>
                    </div>
                    <h3 className="font-bold text-sm tracking-tight mb-1 truncate">{ticketTitle}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
                      {ticket.lastMessageSnippet || ticket.lastMessage || "No messages yet"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border",
                        statusLower === 'in progress' || statusLower === 'in-progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        statusLower === 'resolved' ? 'bg-primary/10 text-primary border-primary/20' :
                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      )}>
                        {statusLower}
                      </span>
                      <span className={cn(
                         "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                         priorityLower === 'high' || priorityLower === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground'
                      )}>
                        {priorityLower}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
            "lg:col-span-8 h-full bg-card/80 backdrop-blur-2xl border border-border/50 rounded-3xl overflow-hidden flex flex-col relative",
            !selectedTicket ? "hidden lg:flex" : "flex"
        )}>
          {selectedTicket ? (
            <>
              {/* Chat Area */}
              <div className="flex-1 overflow-hidden">
                <ChatInterface 
                  roomId={selectedTicket.ticketNumber || selectedTicket.id} 
                  role="Merchant" 
                  title={selectedTicket.title || selectedTicket.subject} 
                  showInternalNotes={false}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="relative mb-8">
                    <div className="h-32 w-32 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
                        <Headphones className="h-16 w-16 text-primary" />
                    </div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute bottom-0 right-0 h-10 w-10 bg-card border border-border rounded-2xl flex items-center justify-center shadow-xl"
                    >
                        <MessageSquare className="h-5 w-5 text-primary" />
                    </motion.div>
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase mb-4">No Active Selection</h2>
                <p className="max-w-xs text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] leading-loose">
                    Select a ticket from the left panel to begin communicating with our dedicated concierge support team. 
                </p>
                <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                        <span className="text-[8px] font-black uppercase text-muted-foreground">Avg Response Time</span>
                        <p className="text-sm font-bold uppercase mt-1"> ~15 Minutes</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <ShieldCheck className="h-5 w-5 text-primary mx-auto mb-2" />
                        <span className="text-[8px] font-black uppercase text-muted-foreground">Support Tier</span>
                        <p className="text-sm font-bold uppercase mt-1">Enterprise Plus</p>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Active inquiries", value: "02", icon: MessageSquare, color: "text-blue-500" },
           { label: "Resolved this month", value: "24", icon: CheckCircle2, color: "text-primary" },
           { label: "System Uptime", value: "99.9%", icon: Zap, color: "text-amber-500" }
         ].map((stat, i) => (
            <Card key={i} className="bg-card/40 backdrop-blur-md border border-border/50 overflow-hidden relative group">
                <CardContent className="p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
                            <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
                        </div>
                        <div className={cn("p-3 rounded-2xl bg-muted/50 transition-colors group-hover:bg-primary/10", stat.color)}>
                            <stat.icon className="h-6 w-6 transition-transform group-hover:scale-110" />
                        </div>
                    </div>
                </CardContent>
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
         ))}
      </div>

      {/* New Ticket Modal (Mockly implemented as an Overlay for now) */}
      <AnimatePresence>
        {isNewTicketModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsNewTicketModalOpen(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
             >
                <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/30">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Draft New Inquiry</h2>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Provide details for accelerated triage</p>
                    </div>
                    <button 
                        onClick={() => setIsNewTicketModalOpen(false)}
                        className="h-10 w-10 flex items-center justify-center hover:bg-muted rounded-xl transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Inquiry Subject</label>
                        <Input 
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Brief descriptive title..." 
                            className="h-14 rounded-2xl bg-muted/30 border-border/50 text-sm font-bold pl-4" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Department / Category</label>
                            <select 
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full h-14 rounded-2xl bg-muted/30 border border-border/50 text-xs font-bold px-4 appearance-none outline-none focus:border-primary/50 transition-all uppercase tracking-widest"
                            >
                                <option value="Technical Issue">Technical Issue</option>
                                <option value="Billing">Billing & Payouts</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="Bug Report">Bug Report</option>
                                <option value="Account Issue">Account Issue</option>
                                <option value="WhatsApp Integration">WhatsApp Integration</option>
                                <option value="Payment Gateway">Payment Gateway</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Urgency / Priority</label>
                            <select 
                                value={newPriority}
                                onChange={(e) => setNewPriority(e.target.value)}
                                className="w-full h-14 rounded-2xl bg-muted/30 border border-border/50 text-xs font-bold px-4 appearance-none outline-none focus:border-primary/50 transition-all uppercase tracking-widest"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Contextual Details</label>
                        <textarea 
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all min-h-[150px] resize-none"
                            placeholder="Describe your request in detail for the technical team..."
                        />
                    </div>
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                         <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                         <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed">
                            Critical inquiries are monitored 24/7. Response time for standard inquiries is between <span className="text-primary">09:00 - 18:00 IST</span>.
                         </p>
                    </div>
                </div>

                <div className="p-8 bg-muted/10 border-t border-border/50 flex gap-4">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsNewTicketModalOpen(false)}
                        className="flex-1 rounded-2xl h-14 text-[10px] font-black uppercase tracking-widest border-border/50"
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleCreateTicket}
                        className="flex-[2] rounded-2xl h-14 bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                        disabled={submitting || !newTitle.trim() || !newDescription.trim()}
                    >
                        {submitting ? "Transmitting..." : "Transmit Inquiry"}
                    </Button>
                </div>
             </motion.div>

          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  )
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.71 11.5 3 13 10.29 20 9.29 12.5 21 11 13.71 4 14.71Z" />
    </svg>
  )
}
