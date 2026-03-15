"use client"

import { useState, useRef } from "react"
import Webcam from "react-webcam"
import { Drawer } from "vaul"
import {
  Camera,
  Zap,
  X,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
  Search,
  Activity,
  Maximize2,
  ListRestart,
  CreditCard,
  ShieldCheck,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ScannedItem {
  id: number
  name: string
  brand: string
  price: number
  qty: number
  confidence: "high" | "low"
}

const initialItems: ScannedItem[] = [
  { id: 1, name: "Whole Wheat Bread", brand: "Britannia • 400g", price: 45, qty: 2, confidence: "high" },
  { id: 2, name: "Nescafe Classic Jar", brand: "Nestle • 50g", price: 160, qty: 1, confidence: "high" },
  { id: 3, name: "??? Item Mystery", brand: "Verify Manually", price: 80, qty: 3, confidence: "low" },
]

export default function ScannerPage() {
  const webcamRef = useRef<Webcam>(null)
  const [items, setItems] = useState<ScannedItem[]>(initialItems)
  const [isFlashOn, setIsFlashOn] = useState(false)
  const [isCapturing, setIsCapturing] = useState(true)

  const totalValue = items.reduce((acc, item) => acc + (item.price * item.qty), 0)

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-10rem)] md:h-[calc(100vh-6rem)] -m-6 md:-m-10 lg:-m-12 bg-black overflow-hidden relative">
      <div className="flex-1 relative overflow-hidden bg-slate-900 flex items-center justify-center">
        {/* Fake Camera Feed for Demo */}
        <div className="absolute inset-0 z-0">
           <Webcam
             audio={false}
             ref={webcamRef}
             screenshotFormat="image/jpeg"
             videoConstraints={{ facingMode: "environment" }}
             className="w-full h-full object-cover opacity-50 contrast-125"
           />
        </div>

        {/* HUD UI */}
        <div className="absolute inset-0 pointer-events-none z-10">
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80"></div>
           
           {/* Scan Line Animation */}
           <div className="absolute inset-x-0 h-1 bg-primary/40 shadow-[0_0_20px_rgba(5,148,103,1)] animate-[scan_4s_ease-in-out_infinite] z-20"></div>

           {/* Viewfinder brackets */}
           <div className="absolute top-[20%] left-[20%] right-[20%] bottom-[20%] border-2 border-primary/20 rounded-[2rem]">
              <div className="absolute -top-1 -left-1 w-12 h-12 border-l-8 border-t-8 border-primary rounded-tl-[1.5rem]" />
              <div className="absolute -top-1 -right-1 w-12 h-12 border-r-8 border-t-8 border-primary rounded-tr-[1.5rem]" />
              <div className="absolute -bottom-1 -left-1 w-12 h-12 border-l-8 border-b-8 border-primary rounded-bl-[1.5rem]" />
              <div className="absolute -bottom-1 -right-1 w-12 h-12 border-r-8 border-b-8 border-primary rounded-br-[1.5rem]" />
           </div>

           {/* AI Status */}
           <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <div className="bg-black/60 backdrop-blur-xl border border-white/20 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-2xl">
                 <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(5,148,103,1)]" />
                 <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">Chitti AI / Active Lens</span>
              </div>
           </div>
        </div>

        {/* Camera Controls */}
        <div className="absolute bottom-12 inset-x-0 flex justify-center items-center gap-8 z-30 pointer-events-auto">
           <button 
            onClick={() => setIsFlashOn(!isFlashOn)}
            className={cn("h-14 w-14 rounded-full border border-white/20 flex items-center justify-center transition-all", isFlashOn ? "bg-primary text-black" : "bg-black/40 backdrop-blur-md text-white hover:bg-black/60")}
           >
              <Zap className="h-6 w-6" />
           </button>
           
           <button 
            onClick={() => {
              setIsCapturing(false)
              setTimeout(() => setIsCapturing(true), 1500)
            }}
            className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-md p-2 border-4 border-primary/50 group hover:scale-110 transition-transform active:scale-95"
           >
              <div className="h-full w-full rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
                 {!isCapturing ? <RefreshCw className="h-10 w-10 text-black animate-spin" /> : <Camera className="h-10 w-10 text-black group-hover:rotate-12 transition-transform" />}
              </div>
           </button>

           <button className="h-14 w-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all">
              <Maximize2 className="h-6 w-6" />
           </button>
        </div>
      </div>

      {/* Side Intelligence Panel */}
      <aside className="w-full lg:w-[480px] bg-[#09090b] border-l border-white/5 flex flex-col z-40">
         <div className="p-8 border-b border-white/5 bg-slate-950/40">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Intelligence <span className="text-primary not-italic">Feed</span></h2>
               <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
                  {items.length} Extracted
               </div>
            </div>
            <p className="text-xs text-slate-500 font-medium italic">High-confidence neural parsing of 124ms total latency.</p>
         </div>

         <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-950/20">
            {items.map((item, i) => (
               <div key={i} className={cn(
                 "group relative bg-white/5 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 transition-all hover:bg-white/10",
                 item.confidence === 'low' && "border-orange-500/20 bg-orange-500/5"
               )}>
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="font-black text-white uppercase tracking-tight">{item.name}</h3>
                           {item.confidence === 'low' ? <AlertTriangle className="h-4 w-4 text-orange-500 animate-pulse" /> : <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.brand}</p>
                     </div>
                     <button className="text-slate-600 hover:text-red-500 transition-colors">
                        <X className="h-5 w-5" />
                     </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                     <div className="flex items-center bg-black/40 rounded-xl p-1 gap-4 border border-white/5">
                        <button className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all"><Minus className="h-4 w-4" /></button>
                        <span className="text-sm font-black text-white w-4 text-center">{item.qty}</span>
                        <button className="h-8 w-8 rounded-lg bg-primary text-black flex items-center justify-center hover:scale-105 transition-all"><Plus className="h-4 w-4" /></button>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 tracking-widest">SUBTOTAL</p>
                        <p className="text-xl font-black text-white tracking-tighter">₹{item.price * item.qty}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         <div className="p-8 border-t border-white/5 bg-slate-950/60 safe-area-bottom">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-xl">
                     <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Valuation</p>
                     <p className="text-3xl font-black text-white tracking-tighter leading-none">₹{totalValue}.00</p>
                  </div>
               </div>
               <button className="p-3 text-slate-500 hover:text-primary transition-colors hover:rotate-180 duration-700">
                  <ListRestart className="h-6 w-6" />
               </button>
            </div>
            
            <button className="w-full h-16 bg-primary hover:bg-primary-dark text-black rounded-3xl font-black text-sm shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest">
               <CheckCircle className="h-6 w-6" />
               Update Store Catalog
            </button>
         </div>
      </aside>
    </div>
  )
}
