"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Database, 
  Code2, 
  Zap, 
  Search, 
  Plus, 
  Globe, 
  Copy, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Play,
  Settings2,
  Lock,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface DynamicCollection {
  _id: string;
  name: string;
  slug: string;
  dataCount: number;
  lastUpdated: string;
  status: 'active' | 'syncing' | 'error';
}

export default function ApiEnginePage() {
  const [jsonInput, setJsonInput] = useState("")
  const [collectionName, setCollectionName] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  
  // Mock data for initial UI design
  const [collections, setCollections] = useState<DynamicCollection[]>([
    { _id: '1', name: 'Product Categories', slug: 'categories', dataCount: 14, lastUpdated: '2 mins ago', status: 'active' },
    { _id: '2', name: 'Homepage Banners', slug: 'banners', dataCount: 5, lastUpdated: '1 hour ago', status: 'active' },
    { _id: '3', name: 'System Constants', slug: 'config', dataCount: 42, lastUpdated: 'Yesterday', status: 'active' },
  ])

  const handleDeploy = () => {
    setIsDeploying(true)
    // Here we will hit the backend to save the collection
    setTimeout(() => {
      setIsDeploying(false)
      setActiveTab('manage')
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show toast or notification
  }

  return (
    <div className="space-y-10 pb-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                 <Database className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Dynamic Infrastructure</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
             API <span className="text-primary italic">Engine</span> v1.0
           </h1>
           <p className="text-muted-foreground text-sm mt-3 font-medium max-w-lg">
             Rapidly deploy production-ready JSON endpoints without writing a single line of backend code. 
           </p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-muted rounded-2xl border border-border self-start">
           <button 
             onClick={() => setActiveTab('create')}
             className={cn(
               "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
               activeTab === 'create' ? "bg-card text-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
             )}
           >
             Create API
           </button>
           <button 
             onClick={() => setActiveTab('manage')}
             className={cn(
               "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
               activeTab === 'manage' ? "bg-card text-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
             )}
           >
             Manage Hub
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'create' ? (
          <motion.div 
            key="create-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Editor Side */}
            <div className="lg:col-span-8 space-y-6">
               <Card className="p-1 bg-muted/50 border-border overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
                     <div className="flex items-center gap-4">
                        <Code2 className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-black uppercase tracking-widest">JSON Manifest Editor</h3>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Syntax: JSON</span>
                     </div>
                  </div>
                  <textarea 
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='[{ "id": 1, "key": "value" }]'
                    className="w-full h-[500px] bg-transparent p-8 font-mono text-sm focus:outline-none resize-none text-foreground/90 caret-primary"
                  />
               </Card>
            </div>

            {/* Sidebar Controls */}
            <div className="lg:col-span-4 space-y-6">
               <Card className="p-8 bg-card border-border relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 transition-transform group-hover:rotate-0">
                     <Zap className="h-24 w-24 text-primary" />
                  </div>
                  
                  <h3 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                     <Settings2 className="h-5 w-5 text-primary" /> Deployment Config
                  </h3>
                  
                  <div className="space-y-6 relative z-10">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Collection Identity</label>
                        <input 
                          type="text" 
                          value={collectionName}
                          onChange={(e) => setCollectionName(e.target.value)}
                          placeholder="e.g. mobile-config"
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                        />
                        <p className="text-[9px] text-muted-foreground italic">Target: /api/v1/custom/{collectionName || "..."}</p>
                     </div>

                     <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                           <Lock className="h-4 w-4 text-primary" />
                           <span className="text-[10px] font-black uppercase text-foreground">Security Mode</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                           Routes are automatically wrapped in <span className="text-primary font-bold">verifyJWT</span> and assigned to the current administrator.
                        </p>
                     </div>

                     <button 
                       onClick={handleDeploy}
                       disabled={isDeploying || !collectionName || !jsonInput}
                       className="w-full h-14 bg-primary hover:bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 uppercase tracking-widest"
                     >
                        {isDeploying ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" /> DEPLOYING INFRA...
                          </>
                        ) : (
                          <>
                            <Globe className="h-5 w-5 text-white" /> DEPLOY AS LIVE API
                          </>
                        )}
                     </button>
                  </div>
               </Card>

               <div className="p-6 bg-muted/30 border border-border border-dashed rounded-[2rem] text-center space-y-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Pro Tip</p>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    You can paste data from Excel, SQL results, or any JSON tool. The engine will automatically normalize it for delivery.
                  </p>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="manage-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((col, i) => (
                  <Card key={col._id} className="p-6 bg-card border-border hover:border-primary/50 transition-all group overflow-hidden relative">
                     <div className="flex items-start justify-between mb-6">
                        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <Globe className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-2">
                           <button className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5 rounded-lg">
                              <RefreshCw className="h-4 w-4" />
                           </button>
                           <button className="p-2 text-muted-foreground hover:text-red-500 transition-colors hover:bg-red-500/5 rounded-lg">
                              <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                     </div>
                     
                     <div>
                        <h4 className="font-black text-foreground text-lg tracking-tight mb-1">{col.name}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">slug: /{col.slug}</p>
                        
                        <div className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border group-hover:border-primary/30 transition-colors cursor-pointer" onClick={() => copyToClipboard(`https://api.manavyapar.com/v1/custom/${col.slug}`)}>
                           <code className="text-[10px] font-mono text-primary truncate">.../custom/{col.slug}</code>
                           <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                           <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span className="text-[10px] font-black uppercase text-muted-foreground">{col.dataCount} Objects</span>
                           </div>
                           <span className="text-[10px] font-bold text-muted-foreground italic uppercase">{col.lastUpdated}</span>
                        </div>
                     </div>
                     
                     {/* Hover Arrow */}
                     <Link href={`#`} className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                        <ArrowRight className="h-5 w-5 text-primary" />
                     </Link>
                  </Card>
                ))}
                
                <button 
                  onClick={() => setActiveTab('create')}
                  className="p-6 border-4 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground hover:border-primary/30 hover:text-primary transition-all cursor-pointer group bg-muted/30 h-full min-h-[250px]"
                >
                   <div className="h-14 w-14 rounded-full bg-background border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="h-6 w-6" />
                   </div>
                   <span className="text-xs font-black uppercase tracking-widest">New Deployment</span>
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Dummy Link component since we are in a text file
const Link = ({ children, href, className }: any) => <a href={href} className={className}>{children}</a>
