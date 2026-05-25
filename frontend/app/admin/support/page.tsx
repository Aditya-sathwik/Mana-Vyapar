"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { supportApi } from "@/lib/api"
import { 
  HelpCircle, 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  Clock, 
  ChevronRight, 
  MoreVertical,
  AlertTriangle,
  History,
  Send,
  Paperclip,
  CheckCircle,
  Headphones,
  PhoneCall,
  Zap,
  Ticket
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import ChatInterface from "@/components/shared/ChatInterface"

export default function SupportQueuePage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const res = await supportApi.getTickets()
      if (res.success && Array.isArray(res.data)) {
        setTickets(res.data)
        if (res.data.length > 0 && !selectedTicket) {
          setSelectedTicket(res.data[0])
        }
      } else if (Array.isArray(res)) {
        setTickets(res)
        if (res.length > 0 && !selectedTicket) {
          setSelectedTicket(res[0])
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch tickets:", err)
      toast.error(err?.message || "Failed to load support queue")
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchTickets()
  }, [])

  return (
    <div className="space-y-12 pb-20 max-w-[1700px] mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                 <Headphones className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Omni-Channel Support Layer</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-[0.8]">
             Command <span className="text-primary italic">Desk</span>
           </h1>
           <p className="text-muted-foreground text-sm mt-4 font-medium max-w-lg leading-relaxed">
             Real-time triage and resolution for merchant inquiries, infrastructure failures, and priority escalations.
           </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
           <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 w-12 rounded-2xl border-4 border-background bg-muted flex items-center justify-center shadow-xl overflow-hidden grayscale hover:grayscale-0 transition-all cursor-crosshair">
                   <img src={`https://api.dicebear.com/7.x/miniavars/svg?seed=${i + 10}`} alt="Agent" />
                </div>
              ))}
              <div className="h-12 w-12 rounded-2xl border-4 border-background bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black shadow-xl">+5</div>
           </div>
           <button className="h-14 px-10 bg-primary hover:bg-emerald-600 text-primary-foreground rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center gap-3 transition-all hover:-translate-y-1 active:translate-y-0">
              <PhoneCall className="h-5 w-5" />
              Initialize Console
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[850px] relative">
        {/* Left Column: Ticket Stream */}
        <div className="lg:col-span-4 h-full bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] overflow-hidden flex flex-col shadow-xl">
           <div className="p-6 border-b border-border/50 bg-muted/20">
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <input 
                  type="text" 
                  placeholder="Ticket ID, Merchant name..." 
                  className="w-full pl-12 pr-6 py-4 bg-muted/50 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              {loading ? (
                <div className="p-8 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                  Loading live tickets...
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  No support tickets in queue
                </div>
              ) : (
                tickets.map((ticket) => {
                  const ticketId = ticket.ticketNumber || ticket._id || ticket.id;
                  const isSelected = selectedTicket?.ticketNumber === ticket.ticketNumber || selectedTicket?._id === ticket._id;
                  const priority = ticket.priority || 'Medium';
                  const merchantName = ticket.merchantName || "Merchant";
                  const topic = ticket.title || ticket.description;
                  const time = ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Recently";
                  const status = ticket.status || 'Open';

                  return (
                    <Card 
                      key={ticket._id || ticketId} 
                      onClick={() => setSelectedTicket(ticket)}
                      className={cn(
                        "p-6 cursor-pointer transition-all border-l-[6px] rounded-[2rem] shadow-lg group relative overflow-hidden",
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10 ring-2 ring-primary/20" 
                          : "border-muted border-l-muted bg-card hover:border-primary/50 hover:shadow-xl"
                      )}
                    >
                       <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-muted rounded-lg border border-border">
                                <Ticket className="h-3 w-3 text-muted-foreground" />
                             </div>
                             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">#{ticketId}</span>
                          </div>
                          <span className={cn(
                            "text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-sm",
                            priority === 'Critical' ? "bg-red-500 text-white" :
                            priority === 'High' ? "bg-orange-500 text-white" : "bg-blue-500 text-white"
                          )}>
                             {priority} MATRIX
                          </span>
                       </div>
                       <h4 className="text-lg font-black text-foreground mb-1 group-hover:text-primary transition-colors tracking-tighter uppercase italic">{merchantName}</h4>
                       <p className="text-xs font-bold text-muted-foreground mb-6 line-clamp-1 opacity-70 italic">{topic}</p>
                       
                       <div className="flex items-center justify-between mt-auto relative z-10 border-t border-border/20 pt-4">
                          <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                             <Clock className="h-3.5 w-3.5 text-primary" />
                             {time}
                          </div>
                          <div className="flex items-center gap-2">
                             <span className={cn(
                               "h-2 w-2 rounded-full",
                               status === 'Open' ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" :
                               status === 'In Progress' ? "bg-blue-500" : "bg-muted shadow-inner"
                             )}></span>
                             <span className="text-[9px] font-black text-foreground uppercase tracking-widest">{status}</span>
                          </div>
                       </div>
                       {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />}
                    </Card>
                  );
                })
              )}
           </div>
        </div>

        {/* Right Column: Active Matrix Conversation */}
        <div className="lg:col-span-8 h-full bg-card/50 border border-border/50 rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-xl">
             {selectedTicket ? (
               <div className="flex-1 overflow-hidden h-full">
                 <ChatInterface 
                   roomId={selectedTicket.ticketNumber || selectedTicket.id} 
                   role="Admin" 
                   title={`${selectedTicket.merchantName || 'Merchant'} - ${selectedTicket.title || 'Support'}`} 
                   showInternalNotes={true}
                 />
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                 <Ticket className="h-16 w-16 text-primary mb-4 opacity-50 animate-pulse" />
                 <h3 className="text-xl font-bold uppercase tracking-tighter">No Ticket Selected</h3>
                 <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Select a ticket from the queue to start chatting.</p>
               </div>
             )}
        </div>
      </div>
    </div>
  )
}
