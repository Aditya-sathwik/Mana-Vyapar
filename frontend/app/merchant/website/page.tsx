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
  ChevronLeft,
  Upload,
  Link as LinkIcon,
  X,
  Info,
  Save,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  Power,
  Sparkles,
  Zap,
  Cloud,
  CheckCircle,
  Clock
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { apiFetch } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"
// @ts-ignore
import * as Vibrant from "node-vibrant/browser"
import Image from "next/image"
import { useRef } from "react"


export default function WebsiteBuilderPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [store, setStore] = useState<any>(null)

  // Tabs: sections, theme, branding, seo, footer
  const [activeTab, setActiveTab] = useState<"sections" | "theme" | "branding" | "seo" | "footer">("sections")
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile")
  const previewRef = useRef<HTMLIFrameElement>(null)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // For sections: which one is actively being edited
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)

  const fetchStoreData = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await apiFetch("/stores/website")
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

  // --- Handlers ---
  const handleUpdateWebsite = async () => {
    try {
      setIsSaving(true)
      const payload = {
        theme: store.theme,
        seoConfig: store.seoConfig,
        footerConfig: store.footerConfig,
        name: store.name,
      }
      const res = await apiFetch("/stores/website", {
        method: "PATCH",
        body: JSON.stringify(payload)
      })
      if (res.success) {
        toast.success("Website configuration saved to draft!")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeploy = async () => {
    try {
      setIsSaving(true)
      const res = await apiFetch("/stores/website/deploy", {
        method: "POST"
      })
      if (res.success) {
        toast.success("Website deployed successfully! Your changes are now live.")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to deploy website")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSection = async (type: string) => {
    try {
      const res = await apiFetch("/stores/website/sections", {
        method: "POST",
        body: JSON.stringify({ type, title: `New ${type} block` })
      })
      if (res.success) {
        setStore({ ...store, sections: res.data.sections })
        toast.success("Section added")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add section")
    }
  }

  useEffect(() => {
    const sendPreviewData = () => {
      if (previewRef.current?.contentWindow) {
        previewRef.current.contentWindow.postMessage({
          type: 'MANA_VYAPAR_WEBSITE_PREVIEW',
          config: store
        }, '*');
      }
    };

    const timer = setTimeout(sendPreviewData, 100);
    return () => clearTimeout(timer);
  }, [store]);

  const handleUpdateSection = async (sectionId: string, updates: any) => {
    // 1. Instant Local Update (Optimistic UI)
    const currentSection = store.sections.find((s: any) => s._id === sectionId)
    
    // Check if anything actually changed
    const isDifferent = Object.entries(updates).some(([key, value]) => currentSection[key] !== value)
    if (!isDifferent) return

    const updatedSections = store.sections.map((s: any) => s._id === sectionId ? { ...s, ...updates } : s)
    setStore({ ...store, sections: updatedSections })

    // 2. Debounced Sync to Backend
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
    
    setIsSyncing(true)
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await apiFetch(`/stores/website/sections/${sectionId}`, {
          method: "PATCH",
          body: JSON.stringify(updates)
        })
        setIsSyncing(false)
      } catch (error: any) {
        console.error("Sync failed:", error)
        setIsSyncing(false)
        // Optionally fetch fresh data if sync fails to stay in sync
        fetchStoreData()
      }
    }, 500)
  }

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const res = await apiFetch(`/stores/website/sections/${sectionId}`, {
        method: "DELETE"
      })
      if (res.success) {
        setStore({ ...store, sections: res.data.sections })
        if (editingSectionId === sectionId) setEditingSectionId(null)
        toast.success("Section removed")
      }
    } catch (error: any) {
      toast.error("Failed to delete section")
    }
  }

  const handleToggleSection = async (sectionId: string) => {
    try {
      const section = store.sections.find((s: any) => s._id === sectionId);
      const updatedSections = store.sections.map((s: any) => s._id === sectionId ? { ...s, isVisible: !s.isVisible } : s)
      setStore({ ...store, sections: updatedSections })

      await apiFetch(`/stores/website/sections/${sectionId}/toggle`, {
        method: "PATCH"
      })
    } catch (error: any) {
      toast.error("Failed to toggle section")
      fetchStoreData()
    }
  }

  const handleReorder = async (sectionId: string, direction: "up" | "down") => {
    const idx = store.sections.findIndex((s: any) => s._id === sectionId);
    if (idx < 0) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === store.sections.length - 1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const newSections = [...store.sections];

    // Swap order values
    const tempOrder = newSections[idx].order;
    newSections[idx].order = newSections[targetIdx].order;
    newSections[targetIdx].order = tempOrder;

    // Sort array based on new order
    newSections.sort((a, b) => a.order - b.order);
    setStore({ ...store, sections: newSections });

    try {
      const orderMap = newSections.map(s => ({ id: s._id, order: s.order }));
      await apiFetch("/stores/website/sections/reorder", {
        method: "PATCH",
        body: JSON.stringify({ orderMap })
      })
    } catch (error: any) {
      toast.error("Failed to reorder sections")
      fetchStoreData()
    }
  }

  // Effect to handle auto-prefill once store data is loaded
  useEffect(() => {
    if (store && (!store.sections || store.sections.length === 0)) {
      handleApplyDefaultTemplate();
    }
  }, [store?.sections?.length]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Max 2MB.")
      return
    }

    const payload = new FormData()
    payload.append("logo", file)

    try {
      setIsSaving(true)
      const res = await apiFetch("/stores/logo", {
        method: "PATCH",
        body: payload,
        isMultipart: true
      })
      if (res.success) {
        toast.success("Logo updated")
        setStore(res.data)
      }
    } catch (error: any) {
      toast.error(error.message || "Logo upload failed")
    } finally {
      setIsSaving(false)
    }
  }

  const handleExtractColors = async () => {
    if (!store?.logo) {
      toast.error("Upload a logo first to extract colors!")
      return
    }

    const loadingToast = toast.loading("Magic colors extracting...")
    try {
      // Library can export as a default or namespace depending on bundler
      const V: any = Vibrant;
      const extractor = V.default || V;

      const palette = await extractor.from(store.logo).getPalette()

      const newTheme = {
        ...store.theme,
        primaryColor: palette.Vibrant?.hex || store.theme?.primaryColor,
        secondaryColor: palette.DarkVibrant?.hex || store.theme?.secondaryColor,
        accentColor: palette.LightVibrant?.hex || store.theme?.accentColor || "#f59e0b"
      }

      setStore({ ...store, theme: newTheme })
      toast.success("Magic Colors Applied!", { id: loadingToast })
    } catch (error) {
      toast.error("Failed to extract colors. Is it a valid image?", { id: loadingToast })
    }
  }

  const handleApplyDefaultTemplate = async () => {
    try {
      setIsSaving(true);
      const defaultSections = [
        {
          type: "hero",
          title: "Elevate Your Lifestyle",
          subtitle: "Discover the intersection of tradition and modern innovation. Curated collections for the discerning heartland shopper.",
          buttonText: "Explore Collection",
          buttonLink: "/products",
          backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80",
          isVisible: true,
          order: 0
        },
        {
          type: "categories_grid",
          title: "Curated Departments",
          isVisible: true,
          order: 1
        },
        {
          type: "featured_products",
          title: "The Artisanal Collection",
          isVisible: true,
          order: 2
        },
        {
          type: "text_block",
          title: "The Heartland Promise",
          textContent: "At Mana-Vyapar, we believe quality is a right, not a luxury. Every product in our inventory undergoes a rigorous 15-point check to ensure only the finest reaches your doorstep.",
          isVisible: true,
          order: 3
        },
        {
          type: "cta",
          title: "Join the Vyapar Revolution",
          subtitle: "Become part of the community that's redefining retail across the heartland.",
          buttonText: "Stay Updated",
          buttonLink: "/register",
          backgroundImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80",
          isVisible: true,
          order: 4
        },
      ];

      const defaultTheme = {
        primaryColor: "#910035",
        secondaryColor: "#1e293b",
        accentColor: "#f59e0b",
        fontFamily: "Inter",
        borderRadius: "rounded"
      };

      const payload = {
        sections: defaultSections,
        theme: defaultTheme
      };

      const res = await apiFetch("/stores/website", {
        method: "PATCH",
        body: JSON.stringify(payload)
      });

      if (res.success) {
        setStore(res.data);
        toast.success("Magic Template & Brand Skin Applied!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to apply template");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Renderers ---
  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Initializing Builder...</p>
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

  const activeSection = editingSectionId ? store.sections.find((s: any) => s._id === editingSectionId) : null;

  return (
    <div className="space-y-8 pb-32">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="text-center lg:text-left space-y-2">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground tracking-tight uppercase leading-none">
            Website <span className="text-primary italic">Builder</span>
          </h1>
          <div className="flex items-center justify-center lg:justify-start gap-4 mt-2">
            <span className="h-px w-6 md:w-16 bg-primary/30 hidden sm:block" />
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em]">
              {store.sections?.length || 0} Blocks Active • Live Edits
            </p>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-500 border",
              isSyncing 
                ? "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse" 
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            )}>
              {isSyncing ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Syncing Changes
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Draft Saved
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              const url = `http://${store.slug}.lvh.me:5173`;
              window.open(url, "_blank");
            }}
            className="h-14 flex items-center gap-3 px-8 bg-muted border border-border rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-foreground hover:text-white transition-all shadow-lg group"
          >
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            Store Preview
          </button>
          <button
            onClick={handleUpdateWebsite}
            disabled={isSaving}
            className="h-14 flex items-center gap-3 px-8 bg-muted border border-border rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-100 transition-all shadow-lg group"
          >
            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </button>
          <button
            onClick={handleDeploy}
            disabled={isSaving}
            className="h-14 flex items-center gap-3 px-10 bg-primary hover:bg-emerald-600 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-2xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 group"
          >
             {isSaving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 group-hover:animate-pulse" />}
            Publish to Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* EDITOR (XL:8) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex bg-muted/50 p-1.5 rounded-3xl gap-1.5 overflow-x-auto hide-scrollbar">
            {[
              { id: "sections", label: "My Homepage", icon: Layout },
              { id: "branding", label: "My Brand", icon: Zap },
              { id: "theme", label: "My Style", icon: Palette },
              { id: "seo", label: "Google Settings", icon: Globe },
              { id: "footer", label: "Bottom Section", icon: Type },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setEditingSectionId(null); }}
                className={cn(
                  "flex-1 min-w-[120px] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 rounded-2xl p-3 md:p-4 text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id ? "bg-card text-primary shadow-xl border border-border" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className={cn("h-4 w-4 md:h-5 md:w-5", activeTab === tab.id && "animate-pulse")} />
                <span className="leading-tight">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <Card className="p-6 md:p-10 border-border bg-card/50 backdrop-blur-md rounded-[2rem] md:rounded-[3rem] shadow-2xl min-h-[600px] flex flex-col transition-all">

            {/* --- 1. SECTIONS TAB --- */}
            {activeTab === "sections" && !editingSectionId && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                    <Layout className="text-primary h-6 w-6" /> Home Page Blocks
                  </h3>
                  <div className="flex gap-2">
                    {/* Block adding options removed per user request */}
                  </div>
                </div>

                <div className="space-y-4">
                  {store.sections?.length > 0 ? store.sections.map((section: any, idx: number) => (
                    <div key={section._id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-background border border-border rounded-2xl hover:border-primary/50 transition-all gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="flex flex-col gap-1">
                          <button onClick={() => handleReorder(section._id, "up")} disabled={idx === 0} className="text-muted-foreground hover:text-primary disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                          <button onClick={() => handleReorder(section._id, "down")} disabled={idx === store.sections.length - 1} className="text-muted-foreground hover:text-primary disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                        </div>
                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner", section.isVisible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                          {section.type === "hero" && <ImageIcon className="h-6 w-6" />}
                          {section.type === "text_block" && <Type className="h-6 w-6" />}
                          {section.type === "featured_products" && <Box className="h-6 w-6" />}
                          {section.type === "categories_grid" && <Layers className="h-6 w-6" />}
                          {section.type === "cta" && <LinkIcon className="h-6 w-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm uppercase tracking-wider">{section.type.replace("_", " ")}</p>
                          <p className="text-xs text-muted-foreground font-medium">{section.title || "No title set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button onClick={() => handleToggleSection(section._id)} className={cn("p-2 rounded-lg hover:bg-muted transition-all", section.isVisible ? "text-emerald-500" : "text-muted-foreground")} title="Toggle Visibility">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button onClick={() => setEditingSectionId(section._id)} className="p-2 rounded-lg hover:bg-muted text-blue-500 transition-all" title="Edit Content">
                          <Edit className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center">
                      <Layers className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No Blocks Found</p>
                      <p className="text-[10px] text-muted-foreground mt-2 max-w-sm mb-6">If your homepage is empty, please contact support or wait for the system to initialize your default layout.</p>
                      {/* Removed Apply Magic Template button per request */}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- SECTION EDITOR SUB-VIEW --- */}
            {editingSectionId && activeSection && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4 border-b border-border pb-4">
                  <button onClick={() => setEditingSectionId(null)} className="p-2 bg-muted hover:bg-muted/80 rounded-xl text-foreground">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h3 className="text-lg font-black uppercase tracking-widest">Edit {activeSection.type.replace("_", " ")}</h3>
                </div>

                <div className="space-y-6">
                  {/* Common Fields */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Main Heading</label>
                    <input
                      type="text"
                      value={activeSection.title}
                      onChange={(e) => handleUpdateSection(activeSection._id, { title: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:border-primary outline-none"
                      placeholder="Enter heading..."
                    />
                  </div>

                  {!["featured_products", "categories_grid"].includes(activeSection.type) && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Subtext / Description</label>
                      <textarea
                        rows={3}
                        value={activeSection.subtitle || activeSection.textContent}
                        onChange={(e) => handleUpdateSection(activeSection._id, { subtitle: e.target.value, textContent: e.target.value })}
                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:border-primary outline-none resize-none"
                        placeholder="Enter text..."
                      />
                    </div>
                  )}

                  {["hero", "cta"].includes(activeSection.type) && (
                    <>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Background Image URL</label>
                        <input
                          type="text"
                          value={activeSection.backgroundImage}
                          onChange={(e) => handleUpdateSection(activeSection._id, { backgroundImage: e.target.value })}
                          className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:border-primary outline-none"
                          placeholder="https://..."
                        />
                        {activeSection.backgroundImage && (
                          <img src={activeSection.backgroundImage} alt="Preview" className="h-32 w-full object-cover rounded-xl mt-2 border border-border" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Button Text</label>
                          <input
                            type="text"
                            value={activeSection.buttonText}
                            onChange={(e) => handleUpdateSection(activeSection._id, { buttonText: e.target.value })}
                            className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:border-primary outline-none"
                            placeholder="e.g. Shop Now"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Button Link</label>
                          <input
                            type="text"
                            value={activeSection.buttonLink}
                            onChange={(e) => handleUpdateSection(activeSection._id, { buttonLink: e.target.value })}
                            className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:border-primary outline-none"
                            placeholder="e.g. /products"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* --- BRANDING / LOGO TAB --- */}
            {activeTab === "branding" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 border-b border-border pb-4">
                  <Zap className="text-primary h-6 w-6" /> Brand Identity
                </h3>

                <div className="flex flex-col md:flex-row items-center gap-10 p-8 bg-muted/20 border border-border rounded-3xl">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-[2.5rem] bg-background flex items-center justify-center border-4 border-dashed border-border group-hover:border-primary/50 transition-all overflow-hidden relative shadow-inner">
                      {store?.logo ? (
                        <img src={store.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleLogoUpload}
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tight">Shop Logo</h4>
                      <p className="text-xs text-muted-foreground font-bold italic">This logo represents your brand on the header, footer, and emails.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleExtractColors}
                        className="h-12 px-6 bg-foreground text-background rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary transition-all active:scale-95 shadow-lg"
                      >
                        <Sparkles className="h-4 w-4" /> Magic Extract Colors
                      </button>
                      <label className="h-12 px-6 border border-border bg-card rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:bg-muted transition-all">
                        <Upload className="h-4 w-4" /> Change Logo
                        <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <p className="text-[11px] font-bold text-primary/80 leading-relaxed italic">
                    <span className="font-black">Pro Tip:</span> Use the "Magic Extract Colors" tool after uploading your logo. Our AI will automatically detect your brand's primary and secondary colors and apply them to your entire store style!
                  </p>
                </div>
              </div>
            )}

            {/* --- 2. THEME TAB --- */}
            {activeTab === "theme" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 border-b border-border pb-4">
                  <Palette className="text-primary h-6 w-6" /> Look & Feel Design
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted block w-fit px-3 py-1 rounded-full">Color Palette</h4>

                    <div className="space-y-3">
                      <label className="text-xs font-bold flex items-center gap-2">Main Brand Color</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={store.theme?.primaryColor || "#059467"}
                          onChange={(e) => setStore({ ...store, theme: { ...store.theme, primaryColor: e.target.value } })}
                          className="h-12 w-12 rounded-lg cursor-pointer bg-transparent border border-border"
                        />
                        <input
                          type="text"
                          value={store.theme?.primaryColor || "#059467"}
                          onChange={(e) => setStore({ ...store, theme: { ...store.theme, primaryColor: e.target.value } })}
                          className="flex-1 px-4 py-2 bg-muted/50 border border-border rounded-xl font-bold font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold flex items-center gap-2">Accent / Button Color</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={store.theme?.accentColor || "#f59e0b"}
                          onChange={(e) => setStore({ ...store, theme: { ...store.theme, accentColor: e.target.value } })}
                          className="h-12 w-12 rounded-lg cursor-pointer bg-transparent border border-border"
                        />
                        <input
                          type="text"
                          value={store.theme?.accentColor || "#f59e0b"}
                          onChange={(e) => setStore({ ...store, theme: { ...store.theme, accentColor: e.target.value } })}
                          className="flex-1 px-4 py-2 bg-muted/50 border border-border rounded-xl font-bold font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted block w-fit px-3 py-1 rounded-full">Typography & Shape</h4>

                    <div className="space-y-3">
                      <label className="text-xs font-bold">Text Font</label>
                      <select
                        value={store.theme?.fontFamily || "Inter"}
                        onChange={(e) => setStore({ ...store, theme: { ...store.theme, fontFamily: e.target.value } })}
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-bold outline-none focus:border-primary"
                      >
                        <option value="Inter">Inter (Clean & Modern)</option>
                        <option value="Roboto">Roboto (Professional)</option>
                        <option value="Lora">Lora (Elegant Serif)</option>
                        <option value="Outfit">Outfit (Trendy)</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold">Button & Card Shapes</label>
                      <div className="flex gap-2">
                        {["sharp", "rounded", "pill"].map(shape => (
                          <button
                            key={shape}
                            onClick={() => setStore({ ...store, theme: { ...store.theme, borderRadius: shape } })}
                            className={cn(
                              "flex-1 py-3 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                              store.theme?.borderRadius === shape ? "bg-primary text-white border-primary" : "bg-card border-border hover:border-primary/50 text-foreground"
                            )}
                          >
                            {shape}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <label className="text-xs font-bold flex items-center justify-between">
                        <span>Storefront Dark Mode</span>
                        <button
                          onClick={() => setStore({ ...store, theme: { ...store.theme, darkMode: !store.theme?.darkMode } })}
                          className={cn(
                            "relative w-12 h-6 rounded-full transition-colors duration-300 outline-none",
                            store.theme?.darkMode ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-md",
                            store.theme?.darkMode ? "translate-x-6" : "translate-x-0"
                          )} />
                        </button>
                      </label>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">When enabled, your store automatically wears a sleek dark theme.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- 3. SEO TAB --- */}
            {activeTab === "seo" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 border-b border-border pb-4">
                  <Globe className="text-primary h-6 w-6" /> Google Appearance
                </h3>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Search Title (Meta Title)</label>
                    <input
                      type="text"
                      value={store.seoConfig?.metaTitle || ""}
                      onChange={(e) => setStore({ ...store, seoConfig: { ...store.seoConfig, metaTitle: e.target.value } })}
                      className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:border-primary outline-none"
                      placeholder={`e.g. ${store.name} - Premium Shopping`}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Search Description</label>
                    <textarea
                      rows={3}
                      value={store.seoConfig?.metaDescription || ""}
                      onChange={(e) => setStore({ ...store, seoConfig: { ...store.seoConfig, metaDescription: e.target.value } })}
                      className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:border-primary outline-none resize-none"
                      placeholder="Brief description to attract clicks on Google..."
                    />
                  </div>

                  <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-900 border border-border rounded-2xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Google Preview</p>
                    <div className="space-y-1">
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-bold truncate max-w-xl">{store.seoConfig?.metaTitle || `${store.name} - Official Store`}</p>
                      <p className="text-xs text-[#006621] dark:text-emerald-500 font-medium truncate">https://{store.slug}.manavyapar.com</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 max-w-xl">{store.seoConfig?.metaDescription || store.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- 4. FOOTER TAB --- */}
            {activeTab === "footer" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 border-b border-border pb-4">
                  <Type className="text-primary h-6 w-6" /> Bottom Section
                </h3>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Copyright Text</label>
                    <input
                      type="text"
                      value={store.footerConfig?.copyrightText || ""}
                      onChange={(e) => setStore({ ...store, footerConfig: { ...store.footerConfig, copyrightText: e.target.value } })}
                      className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:border-primary outline-none"
                      placeholder={`© ${new Date().getFullYear()} ${store.name}. All rights reserved.`}
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-all">
                      <input
                        type="checkbox"
                        checked={store.footerConfig?.showSocialLinks ?? true}
                        onChange={(e) => setStore({ ...store, footerConfig: { ...store.footerConfig, showSocialLinks: e.target.checked } })}
                        className="h-5 w-5 accent-primary"
                      />
                      <div>
                        <p className="font-bold text-sm">Show Social Media Links</p>
                        <p className="text-xs text-muted-foreground">Links configured in Store Settings will appear</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-all">
                      <input
                        type="checkbox"
                        checked={store.footerConfig?.showContactInfo ?? true}
                        onChange={(e) => setStore({ ...store, footerConfig: { ...store.footerConfig, showContactInfo: e.target.checked } })}
                        className="h-5 w-5 accent-primary"
                      />
                      <div>
                        <p className="font-bold text-sm">Show Contact Information</p>
                        <p className="text-xs text-muted-foreground">Email and phone visible in footer</p>
                      </div>
                    </label>
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
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Live Preview Only</h3>
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
            <div className="h-6 bg-slate-900 flex items-center justify-center gap-1.5 shrink-0 z-20 relative">
              <div className="h-1.5 w-10 bg-slate-700 rounded-full" />
            </div>

            <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-900">
              <iframe
                ref={previewRef}
                src={`http://${store?.slug || 'default'}.lvh.me:5173/`}
                className="w-full h-full border-none"
                title="Live Storefront Preview"
                onLoad={() => {
                   if (previewRef.current?.contentWindow) {
                     previewRef.current.contentWindow.postMessage({
                       type: 'MANA_VYAPAR_WEBSITE_PREVIEW',
                       config: store
                     }, '*');
                   }
                }}
              />
            </div>


            {/* Bottom Notch Area */}
            <div className="h-8 bg-slate-900 flex items-center justify-center shrink-0 z-20">
              <div className="h-1 w-20 bg-slate-700 rounded-full" />
            </div>
          </div>
          <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-[0.2em]">Live Simulation View</p>
        </div>
      </div>
    </div>
  )
}

