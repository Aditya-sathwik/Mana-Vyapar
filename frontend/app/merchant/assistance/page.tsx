"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  HeadphonesIcon, 
  Send, 
  Paperclip, 
  X,
  User,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

const INITIAL_MESSAGES = [
  { id: 1, sender: "support", text: "Hello! I'm your Mana Vyapar concierge. How can I assist you with your shop operations today?", timestamp: "Just now" }
]

const QUICK_ACTIONS = [
  "How to update shipping?",
  "Payout schedule",
  "Bulk product upload",
  "Website customization"
]

export default function ShopAssistancePage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = (text: string = input) => {
    if (!text.trim()) return

    const userMsg = { id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, sender: "merchant", text, timestamp: "Just now" }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    
    // Simulate support response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const supportMsg = { 
        id: `support-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, 
        sender: "support", 
        text: "I've received your request regarding '" + text + "'. A support specialist is joining the session to provide targeted guidance.", 
        timestamp: "Just now" 
      }
      setMessages(prev => [...prev, supportMsg])
    }, 2000)
  }

  return (
    <div className="max-w-5xl mx-auto h-[80vh] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
            <Link href="/merchant/dashboard" className="p-3 bg-card border border-border rounded-2xl hover:bg-muted transition-all">
                <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase flex items-center gap-3">
                    Shop <span className="text-primary italic">Assistance</span>
                </h1>
                <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.3em] mt-1">
                    Concierge Unit • Dedicated Concierge Support
                </p>
            </div>
        </div>
        <div className="flex items-center gap-3">
             <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Support Agent Online</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Helper Panel */}
        <div className="hidden lg:flex flex-col gap-6">
            <Card className="bg-primary/5 border-primary/20 overflow-hidden relative group h-fit">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <HelpCircle className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Quick Topics</span>
                    </div>
                    <div className="space-y-2">
                        {QUICK_ACTIONS.map((action, i) => (
                            <button 
                                key={i}
                                onClick={() => handleSend(action)}
                                className="w-full text-left p-3 bg-card border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-primary/50 hover:bg-primary/5 transition-all"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 h-fit">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Response Times</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">General</span>
                            <span className="text-[10px] font-black text-foreground">~15 MIN</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Technical</span>
                            <span className="text-[10px] font-black text-foreground">~45 MIN</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-[9px] font-bold text-muted-foreground uppercase">Payouts</span>
                             <span className="text-[10px] font-black text-foreground">~2 HOURS</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Chat System */}
        <div className="lg:col-span-3 flex flex-col bg-card/80 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl relative min-h-0">
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar scroll-smooth">
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 opacity-50">
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Concierge Support Session Secure</p>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Encrypted for business safety</p>
                    </div>
                </div>

                {messages.map((msg, i) => (
                    <motion.div
                        key={`${msg.id}-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex flex-col max-w-[85%]",
                            msg.sender === 'merchant' ? "ml-auto items-end" : "items-start"
                        )}
                    >
                        <div className={cn(
                            "p-5 rounded-3xl text-sm leading-relaxed",
                            msg.sender === 'merchant' 
                                ? "bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20" 
                                : "bg-muted/80 backdrop-blur-sm border border-border/50 rounded-tl-none font-medium text-foreground"
                        )}>
                            {msg.text}
                        </div>
                        <div className="mt-2 flex items-center gap-2 px-1">
                             {msg.sender === 'support' && <div className="h-2 w-2 bg-primary rounded-full animate-pulse mr-1" />}
                             <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{msg.sender === 'merchant' ? 'You' : 'Concierge'} • {msg.timestamp}</span>
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex items-center gap-2 p-4 bg-muted/40 rounded-2xl border border-border/50 w-fit">
                        <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Agent is typing</span>
                        <div className="flex gap-1">
                            <div className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                            <div className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Overlay */}
            <div className="p-8 border-t border-border/50 bg-card/80">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <input 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Describe your issue or ask for guidance..."
                            className="w-full h-16 bg-muted/50 border border-border/50 rounded-2xl pl-6 pr-14 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all focus:shadow-[0_0_20px_rgba(5,148,103,0.1)]"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center hover:bg-primary/10 rounded-xl transition-all group">
                             <Paperclip className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                    </div>
                    <Button 
                        onClick={() => handleSend()}
                        className="h-16 w-16 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all p-0 flex items-center justify-center shrink-0"
                    >
                         <Send className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
      </div>

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
