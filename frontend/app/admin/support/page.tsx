"use client"

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

const tickets = [
  { id: "T-1025", merchant: "Kirana Mart", topic: "Ledger Sync Failure", priority: "High", status: "Open", time: "12m ago", owner: "Ramesh Sharma" },
  { id: "T-1024", merchant: "Modern Electronics", topic: "Subscription Renewal Error", priority: "Critical", status: "Open", time: "45m ago", owner: "Sita Devi" },
  { id: "T-1022", merchant: "The Daily Needs", topic: "AI Scanner Inaccuracy", priority: "Medium", status: "In Progress", time: "2h ago", owner: "Vikram Singh" },
  { id: "T-1019", merchant: "Sharma Textiles", topic: "Login Access Issue", priority: "Low", status: "Resolved", time: "1d ago", owner: "Anjali Patel" },
]

export default function SupportQueuePage() {
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ticket Stream */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-6 bg-card border-border/50 shadow-xl rounded-[2rem]">
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <input 
                  type="text" 
                  placeholder="Ticket ID, Merchant name..." 
                  className="w-full pl-12 pr-6 py-4 bg-muted/50 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                 />
              </div>
           </Card>

           <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card 
                  key={ticket.id} 
                  className={cn(
                    "p-6 cursor-pointer transition-all border-l-[6px] rounded-[2rem] shadow-lg group relative overflow-hidden",
                    ticket.id === "T-1025" 
                      ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10 ring-2 ring-primary/20" 
                      : "border-muted border-l-muted bg-card hover:border-primary/50 hover:shadow-xl"
                  )}
                >
                   <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                         <div className="p-1.5 bg-muted rounded-lg border border-border">
                            <Ticket className="h-3 w-3 text-muted-foreground" />
                         </div>
                         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">{ticket.id}</span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-sm",
                        ticket.priority === 'Critical' ? "bg-red-500 text-white" :
                        ticket.priority === 'High' ? "bg-orange-500 text-white" : "bg-blue-500 text-white"
                      )}>
                         {ticket.priority} MATRIX
                      </span>
                   </div>
                   <h4 className="text-lg font-black text-foreground mb-1 group-hover:text-primary transition-colors tracking-tighter uppercase italic">{ticket.merchant}</h4>
                   <p className="text-xs font-bold text-muted-foreground mb-6 line-clamp-1 opacity-70 italic">{ticket.topic}</p>
                   
                   <div className="flex items-center justify-between mt-auto relative z-10 border-t border-border/20 pt-4">
                      <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                         <Clock className="h-3.5 w-3.5 text-primary" />
                         {ticket.time}
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={cn(
                           "h-2 w-2 rounded-full",
                           ticket.status === 'Open' ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" :
                           ticket.status === 'In Progress' ? "bg-blue-500" : "bg-muted shadow-inner"
                         )}></span>
                         <span className="text-[9px] font-black text-foreground uppercase tracking-widest">{ticket.status}</span>
                      </div>
                   </div>
                   {ticket.id === 'T-1025' && <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />}
                </Card>
              ))}
           </div>
        </div>

        {/* Right Column: Active Matrix Conversation */}
        <div className="lg:col-span-8">
            <div className="min-h-[850px] flex flex-col">
              <ChatInterface 
                roomId="T-1025" 
                role="Admin" 
                title="Kirana Mart Support" 
                showInternalNotes={true}
              />
            </div>
        </div>
      </div>
    </div>
  )
}
