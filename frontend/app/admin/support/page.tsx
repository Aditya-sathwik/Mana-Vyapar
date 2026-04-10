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
  PhoneCall,
  Zap,
  Ticket,
  HeadphonesIcon
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
                 <HeadphonesIcon className="h-4 w-4 text-primary" />
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
           <Card className="flex flex-col min-h-[850px] bg-card border-border/50 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)] rounded-[3rem] relative">
              {/* Converastion Header */}
              <div className="p-10 border-b border-border/50 flex flex-col md:flex-row items-center justify-between gap-8 bg-muted/20 backdrop-blur-xl">
                 <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shadow-2xl shadow-primary/30 border-4 border-background">KM</div>
                    <div>
                       <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase leading-none mb-2">
                          Kirana Mart 
                          <span className="text-sm font-black text-primary italic ml-3 opacity-60 tracking-widest">LAYER #T-1025</span>
                       </h3>
                       <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest italic opacity-70">
                          <User className="h-4 w-4 text-primary" /> Ramesh Sharma (Primary Operator) • Verified Business
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-card border border-border text-muted-foreground hover:text-primary hover:shadow-xl transition-all active:scale-95 group/btn">
                       <History className="h-6 w-6" />
                    </button>
                    <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-card border border-border text-muted-foreground hover:text-red-500 hover:shadow-xl transition-all active:scale-95 group/btn">
                       <AlertTriangle className="h-6 w-6" />
                    </button>
                    <button className="px-8 h-12 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all">
                       CLOSE SESSION
                    </button>
                 </div>
              </div>

              {/* Chat Matrix */}
              <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-muted/10 relative">
                 {/* Adaptive Glow */}
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                 
                 <div className="flex flex-col items-center relative z-10">
                    <span className="px-6 py-2 bg-muted/80 backdrop-blur-md border border-border rounded-full text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] shadow-sm">TEMPORAL MARK: 10:45 AM</span>
                 </div>

                 {/* Message Left */}
                 <div className="flex gap-6 max-w-[85%] animate-in slide-in-from-left duration-500 relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 shadow-lg">
                       <Zap className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="p-8 bg-card rounded-[2rem] rounded-tl-none border border-border shadow-2xl relative group">
                       <p className="text-[15px] text-foreground leading-[1.6] font-medium tracking-tight">Hello Support, my digital ledger is not syncing with the server after the latest update. I can't see the transactions from yesterday. This is critical for our evening audit.</p>
                       <span className="absolute -bottom-7 left-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Kirana Hub • Node: SRV-04</span>
                       <div className="absolute -left-2 top-0 h-4 w-4 bg-card border-l border-t border-border rotate-[-45deg]" />
                    </div>
                 </div>

                 {/* Message Right */}
                 <div className="flex gap-6 max-w-[85%] self-end flex-row-reverse animate-in slide-in-from-right duration-500 relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-2xl shadow-primary/20 border-2 border-background">
                       <User className="h-6 w-6" />
                    </div>
                    <div className="p-8 bg-primary text-primary-foreground rounded-[2rem] rounded-tr-none shadow-[0_20px_40px_rgba(5,148,103,0.25)] relative group border-2 border-white/10">
                       <p className="text-[15px] leading-[1.6] font-black tracking-tight">Hi Ramesh! I'm analyzing your sync stream now. It appears your store shard (SHD-04) underwent kernel maintenance approximately 2 hours ago. Could you please initiate a manual logout/login to refresh your local cache?</p>
                       <span className="absolute -bottom-7 right-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">Super Operator Ajay • Active Console</span>
                       <div className="absolute -right-2 top-0 h-4 w-4 bg-primary rotate-[45deg] border-r border-t border-white/10" />
                    </div>
                 </div>

                 <div className="flex flex-col items-center pt-8 relative z-10">
                    <div className="flex items-center gap-3 px-8 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-500 uppercase tracking-widest shadow-inner animate-in fade-in zoom-in duration-700">
                       <CheckCircle className="h-4 w-4" />
                       Merchant state updated: Manual Resynchronization Successful.
                    </div>
                 </div>
              </div>

              {/* Input Engine */}
              <div className="p-10 border-t border-border/50 bg-card/80 backdrop-blur-2xl relative">
                 <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="Type your strategic response to Ramesh Sharma..." 
                      className="w-full pl-8 pr-40 py-6 bg-muted/40 border border-border rounded-[2rem] text-[15px] font-bold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-inner placeholder:text-muted-foreground/40"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                       <button className="p-3 text-muted-foreground hover:text-primary transition-all hover:rotate-12"><Paperclip className="h-6 w-6" /></button>
                       <button className="h-14 px-10 flex items-center justify-center bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest">
                          <Send className="h-5 w-5 mr-3" /> SEND 
                       </button>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 mt-6 ml-4">
                    <div className="flex items-center gap-3">
                       {['#kernel-patch', '#sync-reset', '#auth-v3'].map(tag => (
                          <button key={tag} className="text-[9px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-widest opacity-60 hover:opacity-100">{tag}</button>
                       ))}
                    </div>
                    <div className="text-[9px] font-black text-primary ml-auto italic uppercase tracking-[0.2em] animate-pulse">Console ACTIVE: Ajay is formulating response...</div>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
