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
  CheckCircle2,
  PhoneCall
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
    <div className="max-w-[1600px] mx-auto w-full space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Advanced Support Queue
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage merchant inquiries, technical failures, and service requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex -space-x-2 mr-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-[#09090b] bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Agent" />
                </div>
              ))}
              <div className="h-10 w-10 rounded-full border-2 border-white dark:border-[#09090b] bg-primary text-black flex items-center justify-center text-[10px] font-bold">+5</div>
           </div>
           <button className="bg-primary hover:bg-primary-dark text-black px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
              <PhoneCall className="h-4 w-4" />
              Agent Console
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ticket List */}
        <div className="lg:col-span-4 space-y-4">
           <Card className="p-4 bg-white dark:bg-[#09090b] border-primary/10">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <input 
                  type="text" 
                  placeholder="Ticket ID, Merchant name..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                 />
              </div>
           </Card>

           <div className="space-y-3">
              {tickets.map((ticket) => (
                <Card 
                  key={ticket.id} 
                  className={cn(
                    "p-5 cursor-pointer hover:border-primary/50 transition-all border-l-4",
                    ticket.id === "T-1025" ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-slate-200 dark:border-slate-800 border-l-transparent"
                  )}
                >
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-slate-400">{ticket.id}</span>
                      <span className={cn(
                        "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                        ticket.priority === 'Critical' ? "bg-red-500 text-white" :
                        ticket.priority === 'High' ? "bg-orange-500 text-white" : "bg-blue-500 text-white"
                      )}>
                         {ticket.priority}
                      </span>
                   </div>
                   <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{ticket.merchant}</h4>
                   <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-1">{ticket.topic}</p>
                   
                   <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                         <Clock className="h-3 w-3" />
                         {ticket.time}
                      </div>
                      <div className="flex items-center gap-1">
                         <span className={cn(
                           "h-2 w-2 rounded-full",
                           ticket.status === 'Open' ? "bg-emerald-500 animate-pulse" :
                           ticket.status === 'In Progress' ? "bg-blue-500" : "bg-slate-300"
                         )}></span>
                         <span className="text-[10px] font-bold text-slate-500 uppercase">{ticket.status}</span>
                      </div>
                   </div>
                </Card>
              ))}
           </div>
        </div>

        {/* Right Column: Active Conversation */}
        <div className="lg:col-span-8 h-full">
           <Card className="flex flex-col h-[700px] bg-white dark:bg-[#09090b] border-primary/10 overflow-hidden shadow-2xl">
              {/* Converastion Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">KM</div>
                    <div>
                       <h3 className="text-lg font-bold text-slate-900 dark:text-white">Kirana Mart <span className="text-sm font-normal text-slate-400 ml-2">#T-1025</span></h3>
                       <p className="text-xs text-slate-500 flex items-center gap-1">
                          <User className="h-3 w-3" /> Ramesh Sharma (Owner) • Verified Merchant
                       </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary transition-colors">
                       <History className="h-5 w-5" />
                    </button>
                    <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 transition-colors">
                       <AlertTriangle className="h-5 w-5" />
                    </button>
                    <button className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 rounded-xl font-bold text-sm">
                       Resolved
                    </button>
                    <button className="p-2 text-slate-300">
                       <MoreVertical className="h-6 w-6" />
                    </button>
                 </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-[#09090b]">
                 <div className="flex flex-col items-center">
                    <span className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-300 dark:border-slate-700">Today, 10:45 AM</span>
                 </div>

                 {/* Message Left */}
                 <div className="flex gap-4 max-w-[80%]">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                       <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-sm relative">
                       <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">Hello Support, my digital ledger is not syncing with the server after the latest update. I can't see the transactions from yesterday.</p>
                       <span className="absolute -bottom-5 left-0 text-[10px] text-slate-400 font-medium">10:46 AM • Kirana Mart</span>
                    </div>
                 </div>

                 {/* Message Right */}
                 <div className="flex gap-4 max-w-[80%] self-end flex-row-reverse">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                       <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="p-4 bg-primary text-black rounded-2xl rounded-tr-none shadow-xl shadow-primary/10 relative">
                       <p className="text-sm leading-relaxed font-bold">Hi Ramesh! I'm looking into your sync status now. It seems your store shard (SHD-04) underwent maintenance 2 hours ago. Could you please check if you can logout and login again?</p>
                       <span className="absolute -bottom-5 right-0 text-[10px] text-slate-400 font-medium">10:48 AM • Support Agent Ajay</span>
                    </div>
                 </div>

                 <div className="flex flex-col items-center pt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                       <CheckCircle2 className="h-4 w-4" />
                       Merchant checked and confirmed sync working.
                    </div>
                 </div>
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type your response to Ramesh Sharma..." 
                      className="w-full pl-6 pr-32 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <button className="p-2 text-slate-400 hover:text-primary"><Paperclip className="h-5 w-5" /></button>
                       <button className="h-10 w-10 flex items-center justify-center bg-primary text-black rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                          <Send className="h-5 w-5" />
                       </button>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 mt-3 ml-2">
                    <button className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1 lowercase">#ledge-issue</button>
                    <button className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1 lowercase">#sync-retry</button>
                    <div className="text-[10px] text-slate-300 ml-auto italic">Ajay is typing...</div>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
