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
  Search
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

// Mock Extracted Data
const initialItems: ScannedItem[] = [
  { id: 1, name: "Whole Wheat Bread", brand: "Britannia • 400g", price: 45, qty: 2, confidence: "high" },
  { id: 2, name: "Nescafe Classic Jar", brand: "Nestle • 50g", price: 160, qty: 1, confidence: "high" },
  { id: 3, name: "Dark Chocolate ???", brand: "Verify Item", price: 80, qty: 3, confidence: "low" },
]

export default function ScannerPage() {
  const webcamRef = useRef<Webcam>(null)
  const [items, setItems] = useState<ScannedItem[]>(initialItems)
  const [isFlashOn, setIsFlashOn] = useState(false)

  const videoConstraints = {
    facingMode: "environment"
  }

  const totalValue = items.reduce((acc, item) => acc + (item.price * item.qty), 0)

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] -m-4 md:-m-8 bg-black">
      {/* Camera Viewfinder */}
      <div className="flex-1 relative overflow-hidden bg-black group">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover opacity-80"
        />

        {/* Scanning Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Scanner Laser */}
          <div className="absolute w-full h-[2px] bg-primary shadow-[0_0_15px_rgba(5,148,103,0.6)] animate-[scan_3s_linear_infinite] top-0 z-10"></div>

          {/* Viewfinder Corners */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-primary rounded-tl-xl opacity-80"></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-primary rounded-tr-xl opacity-80"></div>
          <div className="absolute bottom-24 md:bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-primary rounded-bl-xl opacity-80"></div>
          <div className="absolute bottom-24 md:bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-primary rounded-br-xl opacity-80"></div>

          {/* Status Badge */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide uppercase">AI Active & Scanning</span>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="absolute bottom-24 md:bottom-8 left-0 w-full flex justify-center gap-8 z-20">
          <button
            onClick={() => setIsFlashOn(!isFlashOn)}
            className={cn(
              "w-12 h-12 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all",
              isFlashOn ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            <Zap className="h-5 w-5" />
          </button>

          <button className="w-16 h-16 rounded-full bg-white border-4 border-primary/50 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full bg-primary"></div>
          </button>

          <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <Camera className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop Right Pane / Mobile Bottom Sheet */}
      <div className="hidden lg:flex flex-col w-[400px] bg-white dark:bg-[#132a23] border-l border-slate-200 dark:border-primary/10 z-10 shadow-xl">
        <ExtractionList items={items} setItems={setItems} totalValue={totalValue} />
      </div>

      {/* Mobile Drawer (Vaul) */}
      <div className="lg:hidden">
        <Drawer.Root shouldScaleBackground>
          <Drawer.Trigger asChild>
            <div className="absolute bottom-20 left-0 right-0 mx-auto w-fit">
               <button className="bg-primary/90 backdrop-blur text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-bounce">
                 View {items.length} Extracted Items
               </button>
            </div>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="bg-white dark:bg-[#132a23] flex flex-col rounded-t-[10px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
              <div className="p-4 bg-white dark:bg-[#132a23] rounded-t-[10px] flex-1">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-4" />
                <ExtractionList items={items} setItems={setItems} totalValue={totalValue} />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </div>
  )
}

function ExtractionList({ items, setItems, totalValue }: {
  items: ScannedItem[],
  setItems: React.Dispatch<React.SetStateAction<ScannedItem[]>>,
  totalValue: number
}) {
  const updateQuantity = (id: number, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(0, item.qty + delta) }
      }
      return item
    }).filter(item => item.qty > 0))
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 dark:border-primary/10">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Extracted Items
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">{items.length} New</span>
          </h2>
          <button
            className="text-xs text-slate-500 hover:text-primary underline"
            onClick={() => setItems([])}
          >
            Clear All
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center px-3 py-2 border border-transparent focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search className="text-slate-400 h-4 w-4 mr-2" />
            <input
              className="bg-transparent border-none p-0 text-sm w-full focus:ring-0 text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none"
              placeholder="Add item manually..."
              type="text"
            />
          </div>
          <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-[#0b1c16]">
        {items.map(item => (
          <div key={item.id} className={cn(
            "bg-white dark:bg-surface-dark p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow group relative",
            item.confidence === "low" ? "border-amber-200 dark:border-amber-900/50" : "border-slate-200 dark:border-slate-700"
          )}>
            <div className={cn("absolute -left-[1px] top-3 bottom-3 w-1 rounded-r", item.confidence === 'low' ? "bg-amber-400" : "bg-primary")}></div>
            <div className="flex justify-between items-start mb-2 pl-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900 dark:text-white">{item.name}</h3>
                  <span className={cn("w-2 h-2 rounded-full", item.confidence === 'low' ? "bg-amber-400 animate-pulse" : "bg-green-500")} />
                </div>
                {item.confidence === 'low' ? (
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Verify Item
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">{item.brand}</p>
                )}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 rounded p-2 pl-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-6 h-6 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="font-semibold text-sm w-4 text-center text-slate-700 dark:text-slate-300">{item.qty}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-6 h-6 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">₹{item.price}.00/unit</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">₹{item.price * item.qty}.00</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-primary/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-slate-500">Items Count: <span className="font-semibold text-slate-800 dark:text-slate-200">{items.length}</span></span>
          <div className="text-right">
            <span className="text-slate-500 mr-2">Total Value</span>
            <span className="text-xl font-bold text-primary">₹{totalValue}.00</span>
          </div>
        </div>
        <button className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
          <CheckCircle className="h-5 w-5" />
          Confirm & Add to Inventory
        </button>
      </div>
    </div>
  )
}
