"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Store, 
  Image as ImageIcon, 
  Layout, 
  Smartphone, 
  ExternalLink,
  ChevronRight,
  Type,
  Palette,
  Globe,
  Loader2,
  AlertCircle,
  Eye,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Box,
  Layers,
  IndianRupee,
  ChevronDown,
  Upload,
  Link as LinkIcon,
  X,
  Info,
  Save,
  PlusCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { apiFetch } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Banner {
  _id?: string;
  url: string;
  title: string;
  subtitle: string;
  link: string;
}

interface StoreTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

interface StoreData {
  _id: string;
  name: string;
  description: string;
  slug: string;
  logo?: string;
  corouselImages: Banner[];
  theme: StoreTheme;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
}

export default function WebsiteManagementPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [store, setStore] = useState<StoreData | null>(null)
  const [activeTab, setActiveTab] = useState<"hero" | "carousel" | "theme">("hero")
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile")

  const fetchStoreData = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await apiFetch("/stores/me")
      if (res.success) {
        setStore(res.data)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load store data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStoreData()
  }, [fetchStoreData])

  const handleUpdateStore = async (updatedFields: Partial<StoreData>) => {
    try {
      setIsSaving(true)
      const res = await apiFetch("/stores/me", {
        method: "PATCH",
        body: JSON.stringify(updatedFields)
      })
      if (res.success) {
        toast.success("Website configuration updated")
        setStore(res.data)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddBanner = () => {
    if (!store) return
    const newBanner: Banner = {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200",
      title: "New Promotional Offer",
      subtitle: "Discover our latest collections",
      link: "/store/products"
    }
    const updatedBanners = [...store.corouselImages, newBanner]
    setStore({ ...store, corouselImages: updatedBanners })
  }

  const handleRemoveBanner = (index: number) => {
    if (!store) return
    const updatedBanners = store.corouselImages.filter((_, i) => i !== index)
    setStore({ ...store, corouselImages: updatedBanners })
  }

  const handleBannerChange = (index: number, field: keyof Banner, value: string) => {
    if (!store) return
    const updatedBanners = [...store.corouselImages]
    updatedBanners[index] = { ...updatedBanners[index], [field]: value }
    setStore({ ...store, corouselImages: updatedBanners })
  }

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Initializing Command Center...</p>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6 p-8 text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground/20" />
        <div>
           <h2 className="text-xl font-black uppercase tracking-tight mb-2">Store Profile Missing</h2>
           <p className="text-xs text-muted-foreground max-w-xs mx-auto">Please complete your business registration in Store Settings before managing your website.</p>
        </div>
        <button onClick={() => router.push("/merchant/store-settings")} className="h-12 px-8 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest">Go to Settings</button>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-32">
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="text-center lg:text-left space-y-2">
           <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground tracking-tight uppercase leading-none">
             Website <span className="text-primary italic">Control</span>
           </h1>
           <div className="flex items-center justify-center lg:justify-start gap-3 mt-2">
              <span className="h-px w-6 md:w-16 bg-primary/30 hidden sm:block" />
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em]">
                Front-End Configuration • {store.corouselImages.length} Active Banners
              </p>
           </div>
        </div>
        <div className="flex items-center justify-center gap-3">
           <button 
             onClick={() => window.open(`/store/${store.slug}`, "_blank")}
             className="h-14 flex items-center gap-3 px-8 bg-muted border border-border rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-foreground hover:text-white transition-all shadow-lg group"
           >
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              Live Site
           </button>
           <button 
             onClick={() => handleUpdateStore({ corouselImages: store.corouselImages, theme: store.theme, name: store.name, description: store.description })}
             disabled={isSaving}
             className="h-14 flex items-center gap-3 px-10 bg-primary hover:bg-emerald-600 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-2xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
           >
              {isSaving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Push Updates
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* --- NAVIGATION & EDITOR (XL:8) --- */}
        <div className="xl:col-span-8 space-y-6">
           {/* Tab Switcher */}
           <div className="flex bg-muted/50 p-1.5 rounded-3xl gap-1.5 h-16 md:h-20">
              {[
                { id: "hero", label: "Homepage Hero", icon: Type },
                { id: "carousel", label: "Promo Banners", icon: ImageIcon },
                { id: "theme", label: "Brand Styling", icon: Palette },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === tab.id ? "bg-card text-primary shadow-xl border border-border" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className={cn("h-4 w-4 md:h-5 md:w-5", activeTab === tab.id && "animate-pulse")} />
                  <span className="leading-tight">{tab.label}</span>
                </button>
              ))}
           </div>

           {/* Editor Content */}
           <Card className="p-6 md:p-10 border-border bg-card/50 backdrop-blur-md rounded-[2rem] md:rounded-[3rem] shadow-2xl min-h-[500px]">
              {activeTab === "hero" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Type className="h-5 w-5 text-primary" />
                         </div>
                         <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Main Typography</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Store Display Name</label>
                           <input 
                              type="text"
                              value={store.name}
                              onChange={(e) => setStore({ ...store, name: e.target.value })}
                              className="w-full h-14 px-6 bg-background/50 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Hero Tagline</label>
                           <textarea 
                              value={store.description}
                              onChange={(e) => setStore({ ...store, description: e.target.value })}
                              rows={4}
                              className="w-full p-6 bg-background/50 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                              placeholder="Elevate Your Shopping Experience..."
                           />
                        </div>
                      </div>
                   </div>

                   <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
                      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-[10px] font-bold text-primary/80 uppercase tracking-widest leading-relaxed">
                        The hero section creates the first impression for your customers. Use concise, high-impact language to highlight your brand's unique value proposition.
                      </p>
                   </div>
                </div>
              )}

              {activeTab === "carousel" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-primary" />
                         </div>
                         <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Active Banners</h3>
                      </div>
                      <button 
                        onClick={handleAddBanner}
                        className="h-10 px-6 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                      >
                         <PlusCircle className="h-4 w-4" />
                         Add Banner
                      </button>
                   </div>

                   <div className="grid grid-cols-1 gap-6">
                      {store.corouselImages.map((banner, index) => (
                        <div key={index} className="group relative p-6 bg-muted/30 border border-border rounded-3xl hover:bg-muted/50 transition-all">
                           <div className="flex flex-col md:flex-row gap-6">
                              <div className="w-full md:w-48 h-32 relative rounded-2xl overflow-hidden border border-border bg-background shrink-0">
                                 <Image src={banner.url} alt={banner.title} fill className="object-cover" />
                                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button className="h-8 w-8 bg-white text-black rounded-lg shadow-xl flex items-center justify-center hover:scale-110 transition-all">
                                       <ImageIcon className="h-4 w-4" />
                                    </button>
                                 </div>
                              </div>
                              <div className="flex-1 space-y-4">
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                       <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Headline</label>
                                       <input 
                                          type="text"
                                          value={banner.title}
                                          onChange={(e) => handleBannerChange(index, "title", e.target.value)}
                                          className="w-full h-11 px-4 bg-background border border-border rounded-xl text-xs font-bold focus:border-primary outline-none transition-all"
                                       />
                                    </div>
                                    <div className="space-y-1.5">
                                       <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Image URL</label>
                                       <input 
                                          type="text"
                                          value={banner.url}
                                          onChange={(e) => handleBannerChange(index, "url", e.target.value)}
                                          className="w-full h-11 px-4 bg-background border border-border rounded-xl text-xs font-bold focus:border-primary outline-none transition-all"
                                       />
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                       <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Subtitle</label>
                                       <input 
                                          type="text"
                                          value={banner.subtitle}
                                          onChange={(e) => handleBannerChange(index, "subtitle", e.target.value)}
                                          className="w-full h-11 px-4 bg-background border border-border rounded-xl text-xs font-bold focus:border-primary outline-none transition-all"
                                       />
                                    </div>
                                    <div className="space-y-1.5">
                                       <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Action Link</label>
                                       <input 
                                          type="text"
                                          value={banner.link}
                                          onChange={(e) => handleBannerChange(index, "link", e.target.value)}
                                          className="w-full h-11 px-4 bg-background border border-border rounded-xl text-xs font-bold focus:border-primary outline-none transition-all"
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <button 
                             onClick={() => handleRemoveBanner(index)}
                             className="absolute -top-3 -right-3 h-10 w-10 bg-red-500 text-white rounded-xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all md:opacity-0 group-hover:opacity-100 z-10"
                           >
                              <Trash2 className="h-5 w-5" />
                           </button>
                        </div>
                      ))}

                      {store.corouselImages.length === 0 && (
                        <div className="h-48 flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed border-border rounded-3xl">
                           <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No Banners Configured</p>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {activeTab === "theme" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                         <Palette className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Visual Identity</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Primary Brand Color</label>
                           <div className="flex items-center gap-4">
                              <input 
                                 type="color"
                                 value={store.theme.primaryColor}
                                 onChange={(e) => setStore({ ...store, theme: { ...store.theme, primaryColor: e.target.value }})}
                                 className="h-14 w-14 rounded-xl border border-border cursor-pointer bg-transparent p-0"
                              />
                              <input 
                                 type="text"
                                 value={store.theme.primaryColor}
                                 onChange={(e) => setStore({ ...store, theme: { ...store.theme, primaryColor: e.target.value }})}
                                 className="flex-1 h-14 px-6 bg-background border border-border rounded-2xl text-xs font-black uppercase tracking-widest"
                              />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Secondary Accent</label>
                           <div className="flex items-center gap-4">
                              <input 
                                 type="color"
                                 value={store.theme.secondaryColor}
                                 onChange={(e) => setStore({ ...store, theme: { ...store.theme, secondaryColor: e.target.value }})}
                                 className="h-14 w-14 rounded-xl border border-border cursor-pointer bg-transparent p-0"
                              />
                              <input 
                                 type="text"
                                 value={store.theme.secondaryColor}
                                 onChange={(e) => setStore({ ...store, theme: { ...store.theme, secondaryColor: e.target.value }})}
                                 className="flex-1 h-14 px-6 bg-background border border-border rounded-2xl text-xs font-black uppercase tracking-widest"
                              />
                           </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Typography System</label>
                            <div className="grid grid-cols-2 gap-3">
                               {["Inter", "Outfit", "Plus Jakarta Sans", "Roboto"].map((font) => (
                                 <button 
                                   key={font}
                                   onClick={() => setStore({ ...store, theme: { ...store.theme, fontFamily: font }})}
                                   className={cn(
                                     "h-14 flex items-center justify-center rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest",
                                     store.theme.fontFamily === font ? "bg-primary text-white border-primary shadow-xl" : "bg-background border-border hover:border-primary/40"
                                   )}
                                   style={{ fontFamily: font }}
                                 >
                                    {font}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </Card>
        </div>

        {/* --- LIVE PREVIEW (XL:4) --- */}
        <div className="xl:col-span-4 sticky top-24 space-y-6">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <Eye className="h-5 w-5 text-primary" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Reality Engine™</h3>
              </div>
              <div className="flex bg-muted/50 p-1 rounded-xl">
                 <button 
                   onClick={() => setPreviewMode("mobile")}
                   className={cn("p-2 rounded-lg transition-all", previewMode === "mobile" ? "bg-card text-primary shadow-md" : "text-muted-foreground")}
                 >
                    <Smartphone className="h-4 w-4" />
                 </button>
                 <button 
                    onClick={() => setPreviewMode("desktop")}
                    className={cn("p-2 rounded-lg transition-all", previewMode === "desktop" ? "bg-card text-primary shadow-md" : "text-muted-foreground")}
                 >
                    <Layout className="h-4 w-4" />
                 </button>
              </div>
           </div>

           <div className={cn(
             "relative bg-background border-[8px] border-slate-900 rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 flex flex-col",
             previewMode === "mobile" ? "w-[300px] h-[600px] mx-auto" : "w-full h-[600px]"
           )}>
              {/* Fake Browser Chrome */}
              <div className="h-6 bg-slate-900 flex items-center justify-center gap-1.5">
                 <div className="h-1.5 w-10 bg-slate-700 rounded-full" />
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-white dark:bg-slate-950">
                {/* Mock Hero Render */}
                <div className="relative h-[250px] w-full overflow-hidden">
                   {store.corouselImages.length > 0 ? (
                     <div className="absolute inset-0">
                       <Image src={store.corouselImages[0].url} alt="Preview" fill className="object-cover" />
                       <div className="absolute inset-0 bg-black/40" />
                       <div className="absolute inset-0 flex flex-col justify-center p-6 text-white">
                          <h4 className="text-xl font-bold leading-tight mb-2">{store.corouselImages[0].title}</h4>
                          <p className="text-[10px] opacity-90 mb-4 line-clamp-2">{store.corouselImages[0].subtitle}</p>
                          <div className="h-8 w-24 rounded bg-primary flex items-center justify-center text-[8px] font-bold uppercase tracking-widest">Shop Now</div>
                       </div>
                     </div>
                   ) : (
                     <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-slate-400" />
                     </div>
                   )}
                </div>

                <div className="p-6 space-y-6">
                   <div className="space-y-2">
                      <span className="h-3 w-20 bg-primary/10 rounded block" />
                      <h5 className="text-lg font-bold leading-tight text-slate-900 dark:text-white" style={{ fontFamily: store.theme.fontFamily }}>{store.name}</h5>
                      <p className="text-xs text-slate-500 line-clamp-3">{store.description}</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="aspect-square bg-slate-100 rounded-xl flex flex-col p-3">
                           <div className="h-full w-full bg-slate-200/50 rounded-lg mb-2" />
                           <div className="h-2 w-12 bg-slate-300 rounded" />
                        </div>
                      ))}
                   </div>
                </div>
              </div>
              
              {/* Bottom Notch Area */}
              <div className="h-8 bg-slate-900 flex items-center justify-center">
                 <div className="h-1 w-20 bg-slate-700 rounded-full" />
              </div>
           </div>
           <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-[0.2em]">Live Simulation View</p>
        </div>
      </div>
    </div>
  )
}
