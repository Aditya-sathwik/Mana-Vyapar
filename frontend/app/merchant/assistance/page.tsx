"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Headphones, 
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
import ChatInterface from "@/components/shared/ChatInterface"

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
        <div className="lg:col-span-3 min-h-0 flex flex-col">
            <ChatInterface 
                roomId="assistance-room" 
                role="Merchant" 
                title="Platform Concierge" 
                showInternalNotes={false}
            />
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
