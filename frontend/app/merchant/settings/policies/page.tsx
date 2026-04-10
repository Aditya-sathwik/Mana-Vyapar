"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, 
  RotateCcw, 
  Truck, 
  FileText, 
  Save, 
  Eye, 
  Edit3, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Bold,
  Italic,
  List,
  Heading1,
  Link,
  Info,
  ChevronRight,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const POLICY_TYPES = [
  { id: 'privacy', label: 'Privacy Policy', icon: Shield, description: 'How you handle customer data and security.' },
  { id: 'return', label: 'Return Policy', icon: RotateCcw, description: 'Refunds, exchanges, and timeframes.' },
  { id: 'shipping', label: 'Shipping Policy', icon: Truck, description: 'Delivery times, costs, and carriers.' },
  { id: 'terms', label: 'Terms & Conditions', icon: FileText, description: 'Rules and regulations for your storefront.' }
]

const TEMPLATES = {
  privacy: "# Privacy Policy\n\nWe value your privacy. This policy explains how we collect, use, and protect your personal information...\n\n### 1. Information Collection\nWe collect information you provide directly to us when you make a purchase...\n\n### 2. Security\nWe implement industry-standard security measures to protect your digital identity.",
  return: "# Return & Refund Policy\n\nThank you for shopping with us! If you are not entirely satisfied with your purchase, we're here to help.\n\n### Returns\nYou have 30 calendar days to return an item from the date you received it...\n\n### Refunds\nOnce we receive your item, we will inspect it and notify you that we have received your returned item.",
  shipping: "# Shipping Policy\n\nAll orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.\n\n### Shipping Rates & Delivery Estimates\nShipping charges for your order will be calculated and displayed at checkout.",
  terms: "# Terms and Conditions\n\nPlease read these terms and conditions carefully before using Our Service.\n\n### Acknowledgement\nThese are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company."
}

export default function PolicyManagementPage() {
  const [activePolicy, setActivePolicy] = useState('privacy')
  const [policies, setPolicies] = useState({
    privacy: TEMPLATES.privacy,
    return: TEMPLATES.return,
    shipping: TEMPLATES.shipping,
    terms: TEMPLATES.terms
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  const applyTemplate = () => {
    if (confirm("Applying template will overwrite your current draft. Continue?")) {
        setPolicies(prev => ({ ...prev, [activePolicy]: TEMPLATES[activePolicy as keyof typeof TEMPLATES] }))
    }
  }

  const CurrentIcon = POLICY_TYPES.find(p => p.id === activePolicy)?.icon || FileText

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-foreground tracking-tighter uppercase sm:text-5xl lg:text-6xl flex items-center gap-4">
            Legal <span className="text-primary italic">Forge</span>
          </h1>
          <p className="text-muted-foreground text-xs uppercase font-bold tracking-[0.3em] mt-2">
            Automate & Customize Your Storefront Policies • Compliance Ready
          </p>
        </div>
        <div className="flex gap-4">
            <Button 
                variant="outline" 
                onClick={() => setPreviewMode(!previewMode)}
                className="rounded-2xl h-14 px-6 border-border/50 text-[10px] font-black uppercase tracking-widest gap-3"
            >
                {previewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewMode ? 'Editor View' : 'Live Preview'}
            </Button>
            <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-2xl h-14 px-8 bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest gap-3 min-w-[160px]"
            >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? 'Processing...' : 'Sync Policies'}
            </Button>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3 text-primary text-xs font-black uppercase tracking-widest"
          >
            <CheckCircle2 className="h-5 w-5" />
            Storefront policies have been successfully updated and deployed.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
            {POLICY_TYPES.map((policy) => (
                <button
                    key={policy.id}
                    onClick={() => setActivePolicy(policy.id)}
                    className={cn(
                        "w-full p-6 rounded-3xl text-left transition-all border flex flex-col gap-3 group",
                        activePolicy === policy.id 
                            ? "bg-primary/10 border-primary/20 shadow-xl shadow-primary/5" 
                            : "bg-card/50 border-border/50 hover:bg-muted/40"
                    )}
                >
                    <div className={cn(
                        "h-10 w-10 rounded-2xl flex items-center justify-center transition-all",
                        activePolicy === policy.id ? "bg-primary text-white scale-110 shadow-lg" : "bg-muted text-muted-foreground group-hover:scale-110"
                    )}>
                        <policy.icon className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm tracking-tight">{policy.label}</h3>
                        <p className="text-[10px] text-muted-foreground font-medium line-clamp-2 mt-1 uppercase tracking-wider">{policy.description}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-black uppercase text-primary">Modify Content</span>
                        <ChevronRight className="h-3 w-3 text-primary" />
                    </div>
                </button>
            ))}

            <div className="mt-8 p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10 space-y-4">
                <div className="flex items-center gap-2 text-amber-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Compliance Tip</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-bold leading-relaxed uppercase tracking-wide">
                    Ensure your policies comply with local e-commerce regulations for 2026.
                </p>
            </div>
        </div>

        {/* Editor / Preview Area */}
        <div className="lg:col-span-9 h-full min-h-[600px] flex flex-col bg-card border border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/20">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <CurrentIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">{POLICY_TYPES.find(p => p.id === activePolicy)?.label}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Status: </span>
                            <span className="text-[8px] font-black uppercase text-primary tracking-widest px-2 py-0.5 bg-primary/10 rounded-full">Drafted</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mr-4">Auto-Save Enabled</p>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={applyTemplate}
                        className="rounded-xl border-border/50 h-10 px-4 text-[10px] font-black uppercase tracking-widest items-center gap-2"
                    >
                        <Sparkles className="h-3 w-3 text-primary" /> Apply Standard Template
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col p-8">
                {previewMode ? (
                    <div className="flex-1 bg-muted/10 rounded-3xl p-8 overflow-y-auto max-h-[500px] prose dark:prose-invert max-w-none border border-dashed border-border/50">
                        {policies[activePolicy as keyof typeof policies].split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black tracking-tighter uppercase mb-6 text-foreground">{line.replace('# ', '')}</h1>
                            if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold tracking-tight mt-8 mb-4 text-primary">{line.replace('### ', '')}</h3>
                            if (!line.trim()) return <br key={i} />
                            return <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4">{line}</p>
                        })}
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                           {[
                               { icon: Heading1, label: 'Title' },
                               { icon: Bold, label: 'Bold' },
                               { icon: Italic, label: 'Italic' },
                               { icon: List, label: 'List' },
                               { icon: Link, label: 'Link' }
                           ].map((tool, i) => (
                               <button key={i} className="h-10 px-4 bg-muted hover:bg-muted-foreground/10 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all">
                                   <tool.icon className="h-4 w-4" /> {tool.label}
                               </button>
                           ))}
                        </div>
                        <textarea 
                            value={policies[activePolicy as keyof typeof policies]}
                            onChange={(e) => setPolicies(prev => ({ ...prev, [activePolicy]: e.target.value }))}
                            className="flex-1 w-full bg-muted/10 border border-border/50 rounded-3xl p-8 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all min-h-[400px] resize-none leading-relaxed font-mono"
                            placeholder="Begin drafting your policy here using Markdown structure..."
                        />
                    </>
                )}
            </div>

            <div className="p-8 border-t border-border/50 bg-muted/20 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Info className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Content Optimization</p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-0.5">Readability Score: <span className="text-primary italic">High (8.5/10)</span></p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
                                TM
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">3 active drafts</p>
                 </div>
            </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
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
