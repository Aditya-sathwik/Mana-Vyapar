"use client"

import { useState, useEffect, useCallback } from "react"
import {
   Store,
   MapPin,
   Phone as PhoneIcon,
   Globe,
   Clock,
   Settings2,
   Camera,
   Save,
   Bell,
   Lock,
   ChevronRight,
   ShieldCheck,
   Zap,
   Plus,
   Loader2,
   X,
   CalendarClock
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api-client"
import toast from "react-hot-toast"
import { Modal } from "@/components/ui/modal"

export default function StoreSettingsPage() {
   const [activeTab, setActiveTab] = useState("general")
   const [isLoading, setIsLoading] = useState(true)
   const [isSaving, setIsSaving] = useState(false)
   const [store, setStore] = useState<any>(null)
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
   const [isCreating, setIsCreating] = useState(false)

   const [formData, setFormData] = useState({
      name: "",
      description: "",
      contactInfo: {
         email: "",
         phone: "",
         address: ""
      },
      socialLinks: {
         whatsapp: "",
         instagram: "",
         facebook: "",
         twitter: ""
      },
      openingHours: [
         { dayGroup: "Monday - Friday", openTime: "09:00", closeTime: "21:00", isClosed: false },
         { dayGroup: "Saturday - Sunday", openTime: "10:00", closeTime: "19:00", isClosed: false }
      ],
      gstin: ""
   })

   const [createFormData, setCreateFormData] = useState({
      name: "",
      description: "",
      slug: ""
   })

   const fetchStore = useCallback(async () => {
      try {
         setIsLoading(true)
         const res = await apiFetch("/stores/me")
         if (res.success) {
            setStore(res.data)
            setFormData({
               name: res.data.name || "",
               description: res.data.description || "",
               contactInfo: {
                  email: res.data.contactInfo?.email || "",
                  phone: res.data.contactInfo?.phone || "",
                  address: res.data.contactInfo?.address || ""
               },
               socialLinks: {
                  whatsapp: res.data.socialLinks?.whatsapp || "",
                  instagram: res.data.socialLinks?.instagram || "",
                  facebook: res.data.socialLinks?.facebook || "",
                  twitter: res.data.socialLinks?.twitter || ""
               },
               openingHours: res.data.openingHours?.length > 0 ? res.data.openingHours : [
                  { dayGroup: "Monday - Friday", openTime: "09:00", closeTime: "21:00", isClosed: false },
                  { dayGroup: "Saturday - Sunday", openTime: "10:00", closeTime: "19:00", isClosed: false }
               ],
               gstin: res.data.gstin || ""
            })
         }
      } catch (error: any) {
         if (error.message === "Store not found") {
            setStore(null)
         } else {
            toast.error(error.message || "Failed to load store data")
         }
      } finally {
         setIsLoading(false)
      }
   }, [])

   useEffect(() => {
      fetchStore()
   }, [fetchStore])

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section?: string) => {
      const { name, value } = e.target
      if (section) {
         setFormData(prev => ({
            ...prev,
            [section]: {
               ...(prev as any)[section],
               [name]: value
            }
         }))
      } else {
         setFormData(prev => ({ ...prev, [name]: value }))
      }
   }

   const handleHourChange = (index: number, field: string, value: any) => {
      const newHours = [...formData.openingHours]
      newHours[index] = { ...newHours[index], [field]: value }
      setFormData(prev => ({ ...prev, openingHours: newHours }))
   }

   const handleSave = async () => {
      if (!store) {
         setIsCreateModalOpen(true)
         return
      }

      try {
         setIsSaving(true)
         const res = await apiFetch("/stores/update", {
            method: "PATCH",
            body: JSON.stringify(formData)
         })
         if (res.success) {
            toast.success("Settings saved successfully")
            setStore(res.data)
         }
      } catch (error: any) {
         toast.error(error.message || "Failed to update settings")
      } finally {
         setIsSaving(false)
      }
   }

   const handleCreateStore = async () => {
      if (!createFormData.name) {
         toast.error("Store name is required")
         return
      }

      try {
         setIsCreating(true)
         const res = await apiFetch("/stores", {
            method: "POST",
            body: JSON.stringify(createFormData)
         })
         if (res.success) {
            toast.success("Store created successfully!")
            setIsCreateModalOpen(false)
            fetchStore()
         }
      } catch (error: any) {
         toast.error(error.message || "Failed to create store")
      } finally {
         setIsCreating(false)
      }
   }

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
         const token = localStorage.getItem("accessToken")
         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores/logo`, {
            method: "PATCH",
            headers: {
               "Authorization": `Bearer ${token}`
            },
            body: payload
         })
         const res = await response.json()
         if (res.success) {
            toast.success("Logo updated")
            setStore(res.data)
         } else {
            throw new Error(res.message)
         }
      } catch (error: any) {
         toast.error(error.message || "Logo upload failed")
      } finally {
         setIsSaving(false)
      }
   }

   const tabs = [
      { id: "general", label: "General Info", icon: Store, description: "Store name and contact details" },
      { id: "business", label: "Business Profile", icon: Settings2, description: "About your store and social links" },
      { id: "notifications", label: "Notifications", icon: Bell, description: "Alerts and message settings" },
      { id: "security", label: "Security", icon: Lock, description: "Passwords and account access" },
   ]

   if (isLoading) {
      return (
         <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Loading Settings...</p>
         </div>
      )
   }

   return (
      <div className="max-w-7xl mx-auto w-full space-y-10 pb-16">
         {/* Simple Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Store Setup</span>
               </div>
               <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
                  Store <span className="text-primary tracking-normal">Settings</span>
               </h1>
               <p className="text-muted-foreground text-sm mt-2 font-medium italic">
                  Manage your store identity, contact details, and business profile.
               </p>
            </div>
            <Button
               onClick={handleSave}
               disabled={isSaving}
               className="h-14 px-8 bg-primary hover:bg-emerald-600 text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20 uppercase tracking-widest text-xs"
            >
               {isSaving ? (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
               ) : (
                  <Save className="h-5 w-5 mr-3 stroke-[3] text-white" />
               )}
               Save All Changes
            </Button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-4 space-y-4">
               <div className="space-y-2">
                  {tabs.map((tab) => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                           "w-full flex items-start gap-4 px-6 py-5 rounded-[2rem] text-left transition-all group relative overflow-hidden",
                           activeTab === tab.id
                              ? "bg-primary text-white shadow-xl shadow-primary/20"
                              : "bg-card text-muted-foreground hover:bg-muted border border-border"
                        )}
                     >
                        <div className={cn(
                           "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                           activeTab === tab.id ? "bg-black/10 text-white" : "bg-muted text-muted-foreground group-hover:text-primary"
                        )}>
                           <tab.icon className="h-5 w-5" />
                        </div>
                        <div>
                           <p className={cn("font-black uppercase tracking-widest text-[10px]", activeTab === tab.id ? "text-white" : "text-foreground")}>{tab.label}</p>
                           <p className={cn("text-[10px] font-bold italic mt-0.5", activeTab === tab.id ? "text-white/60" : "text-muted-foreground")}>{tab.description}</p>
                        </div>
                        {activeTab === tab.id && (
                           <div className="absolute -right-4 -bottom-4 opacity-10">
                              <tab.icon className="h-20 w-20 text-white" />
                           </div>
                        )}
                     </button>
                  ))}
               </div>

               <div className="p-8 bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20 relative overflow-hidden group">
                  <ShieldCheck className="absolute -right-6 -bottom-6 h-32 w-32 opacity-10 group-hover:rotate-12 transition-transform text-emerald-500" />
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 px-1">Store Status</p>
                  <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 font-bold italic leading-relaxed">Your store "{store?.name || 'New'}" is live and verified.</p>
               </div>
            </div>

            {/* Settings Form */}
            <div className="lg:col-span-8">
               {!store ? (
                  <Card className="p-16 bg-card border-border shadow-2xl rounded-[3rem] overflow-hidden flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500">
                     <div className="h-24 w-24 rounded-[2rem] bg-muted/50 flex items-center justify-center border-4 border-dashed border-border relative">
                        <Store className="h-10 w-10 text-muted-foreground" />
                        <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive flex items-center justify-center shadow-lg border-2 border-card">
                           <X className="h-3 w-3 text-white stroke-[4]" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter">Store Not Available</h3>
                        <p className="text-muted-foreground text-sm font-bold italic max-w-sm mx-auto leading-relaxed">
                           You haven't created a store yet. Create your store now to start selling to your customers.
                        </p>
                     </div>
                     <Button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-14 px-10 bg-primary hover:bg-emerald-600 text-white rounded-2xl font-black transition-all hover:scale-110 shadow-2xl shadow-primary/30 uppercase tracking-[0.2em] text-xs"
                     >
                        <Plus className="h-5 w-5 mr-3 stroke-[3]" />
                        Create My Store
                     </Button>
                  </Card>
               ) : (
                  <Card className="p-10 bg-card border-border shadow-2xl rounded-[3rem] overflow-hidden">
                  {activeTab === "general" && (
                     <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Profile Picture */}
                        <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-border">
                           <div className="relative group cursor-pointer">
                              <div className="h-28 w-28 rounded-[2rem] bg-muted flex items-center justify-center border-4 border-dashed border-border group-hover:border-primary/50 transition-all overflow-hidden relative">
                                 {store?.logo ? (
                                    <img src={store.logo} alt="Store Logo" className="w-full h-full object-cover" />
                                 ) : (
                                    <Store className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                                 )}
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="h-8 w-8 text-white" />
                                 </div>
                                 <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleLogoUpload}
                                    accept="image/*"
                                 />
                              </div>
                              <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary text-white rounded-xl shadow-xl hover:scale-110 transition-transform flex items-center justify-center border-4 border-card pointer-events-none">
                                 <Plus className="h-5 w-5 stroke-[4] text-white" />
                              </button>
                           </div>
                           <div className="text-center md:text-left space-y-1">
                              <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Store Logo</h3>
                              <p className="text-xs text-muted-foreground font-bold italic">Upload your store logo. Max 2MB.</p>
                              <button className="mt-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline px-1 py-1">Remove Logo</button>
                           </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Store Name</label>
                              <div className="relative group">
                                 <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                 <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 h-14 bg-muted/30 border border-border rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-muted-foreground/50"
                                 />
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Phone Number</label>
                              <div className="relative group">
                                 <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                 <input
                                    type="text"
                                    name="phone"
                                    value={formData.contactInfo.phone}
                                    onChange={(e) => handleInputChange(e, 'contactInfo')}
                                    className="w-full pl-12 pr-4 h-14 bg-muted/30 border border-border rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-muted-foreground/50"
                                 />
                              </div>
                           </div>
                           <div className="md:col-span-2 space-y-3">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Store Address</label>
                              <div className="relative group">
                                 <MapPin className="absolute left-4 top-5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                 <textarea
                                    rows={3}
                                    name="address"
                                    value={formData.contactInfo.address}
                                    onChange={(e) => handleInputChange(e, 'contactInfo')}
                                    className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-[1.5rem] text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all resize-none placeholder:text-muted-foreground/50 leading-relaxed"
                                 />
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">WhatsApp Number</label>
                              <div className="relative group">
                                 <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                 <input
                                    type="text"
                                    name="whatsapp"
                                    value={formData.socialLinks.whatsapp}
                                    onChange={(e) => handleInputChange(e, 'socialLinks')}
                                    placeholder="e.g. 919876543210"
                                    className="w-full pl-12 pr-4 h-14 bg-muted/30 border border-border rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-muted-foreground/50"
                                 />
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Store Link (Slug)</label>
                              <div className="relative group">
                                 <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                 <input
                                    type="text"
                                    value={store?.slug || ""}
                                    disabled
                                    className="w-full pl-12 pr-4 h-14 bg-muted/10 border border-border rounded-2xl text-sm font-bold text-muted-foreground focus:outline-none cursor-not-allowed opacity-70"
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Editable Store Hours */}
                        <div className="pt-10 space-y-8 border-t border-border">
                           <div className="flex items-center justify-between">
                              <h3 className="text-xl font-black text-foreground uppercase tracking-tighter flex items-center gap-3">
                                 <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Clock className="h-4 w-4" />
                                 </div>
                                 Store Hours
                              </h3>
                              <p className="text-[10px] font-bold text-muted-foreground italic uppercase">Manual Override Active</p>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {formData.openingHours.map((group, index) => (
                                 <div key={group.dayGroup} className={cn(
                                    "p-8 rounded-[2rem] border border-border transition-all space-y-6 group relative overflow-hidden",
                                    group.isClosed ? "bg-muted/30 opacity-60" : "bg-card hover:bg-muted/10 hover:shadow-xl hover:shadow-primary/5"
                                 )}>
                                    <div className="flex items-center justify-between">
                                       <div>
                                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Day Group</p>
                                          <p className="text-xl font-black text-foreground uppercase tracking-tighter">{group.dayGroup}</p>
                                       </div>
                                       {/* Custom Toggle for Closed */}
                                       <button 
                                          onClick={() => handleHourChange(index, "isClosed", !group.isClosed)}
                                          className={cn(
                                             "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border",
                                             group.isClosed 
                                                ? "bg-destructive/10 text-destructive border-destructive/20" 
                                                : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                          )}
                                       >
                                          {group.isClosed ? "Closed" : "Open"}
                                       </button>
                                    </div>

                                    {!group.isClosed && (
                                       <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                             <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Open</label>
                                             <div className="relative">
                                                <input 
                                                   type="time" 
                                                   value={group.openTime}
                                                   onChange={(e) => handleHourChange(index, "openTime", e.target.value)}
                                                   className="w-full px-4 h-12 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none flex items-center"
                                                />
                                             </div>
                                          </div>
                                          <div className="space-y-2">
                                             <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Close</label>
                                             <div className="relative">
                                                <input 
                                                   type="time" 
                                                   value={group.closeTime}
                                                   onChange={(e) => handleHourChange(index, "closeTime", e.target.value)}
                                                   className="w-full px-4 h-12 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none flex items-center"
                                                />
                                             </div>
                                          </div>
                                       </div>
                                    )}

                                    {group.isClosed && (
                                       <div className="h-20 flex items-center justify-center border-2 border-dashed border-border rounded-2xl">
                                          <p className="text-xs font-bold text-muted-foreground italic">Store will be marked as closed</p>
                                       </div>
                                    )}
                                    
                                    <CalendarClock className="absolute -right-4 -bottom-4 h-20 w-20 text-foreground opacity-[0.03] group-hover:rotate-12 transition-transform" />
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="pt-8 flex justify-end">
                           <Button
                              onClick={handleSave}
                              disabled={isSaving}
                              className="h-14 px-10 bg-primary hover:bg-emerald-600 text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 uppercase tracking-widest text-[10px]"
                           >
                              {isSaving ? (
                                 <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                              ) : (
                                 <Save className="h-5 w-5 mr-3 stroke-[3]" />
                              )}
                              Update Store Details
                           </Button>
                        </div>
                     </div>
                  )}

                  {activeTab !== "general" && (activeTab !== "business") && (
                     <div className="h-96 flex flex-col items-center justify-center text-center p-12 space-y-6">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground border-4 border-dashed border-border animate-pulse">
                           <Settings2 className="h-10 w-10" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter mb-2">Section Coming Soon</h3>
                           <p className="text-xs text-muted-foreground font-bold italic max-w-xs">{tabs.find(t => t.id === activeTab)?.label} settings are currently being prepared for your store.</p>
                        </div>
                        <button className="bg-muted px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border hover:text-primary transition-colors" onClick={() => setActiveTab('general')}>Return to general</button>
                     </div>
                  )}

                  {activeTab === "business" && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                           <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Business Profile</h3>
                           <p className="text-xs text-muted-foreground font-bold italic">Update your brand story and social links.</p>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Store Description</label>
                           <textarea
                              rows={4}
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              placeholder="Tell your customers about your business..."
                              className="w-full px-6 py-4 bg-muted/30 border border-border rounded-[1.5rem] text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all resize-none placeholder:text-muted-foreground/50 leading-relaxed"
                           />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Instagram</label>
                              <input
                                 type="text"
                                 name="instagram"
                                 value={formData.socialLinks.instagram}
                                 onChange={(e) => handleInputChange(e, 'socialLinks')}
                                 placeholder="@yourhandle"
                                 className="w-full px-6 h-14 bg-muted/30 border border-border rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                              />
                           </div>
                           <div className="space-y-3">
                               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Facebook</label>
                              <input
                                 type="text"
                                 name="facebook"
                                 value={formData.socialLinks.facebook}
                                 onChange={(e) => handleInputChange(e, 'socialLinks')}
                                 placeholder="facebook.com/yourpage"
                                 className="w-full px-6 h-14 bg-muted/30 border border-border rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                              />
                           </div>
                        </div>
                        <button
                           onClick={handleSave}
                           className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/10"
                        >
                           Save Business Profile
                        </button>
                     </div>
                  )}
                  </Card>
               )}
            </div>
         </div>

         <Modal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            title="Create Your Store"
            description="Fill in the basic details below to launch your store."
            size="md"
            isLoading={isCreating}
            onConfirm={handleCreateStore}
            confirmLabel="Launch Store"
         >
            <div className="space-y-6 pt-4 pb-2 text-left">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Store Name</label>
                  <div className="relative group">
                     <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                     <input
                        type="text"
                        placeholder="e.g. Premium Groceries"
                        value={createFormData.name}
                        onChange={(e) => {
                           const name = e.target.value;
                           const slug = name.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
                           setCreateFormData(prev => ({ ...prev, name, slug }));
                        }}
                        className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                     />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Store Link (Slug)</label>
                  <div className="relative group">
                     <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                     <input
                        type="text"
                        placeholder="my-store-slug"
                        value={createFormData.slug}
                        onChange={(e) => setCreateFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                     />
                  </div>
                  <p className="text-[9px] text-muted-foreground italic font-medium">Your store will be available at manavyapar.com/{createFormData.slug || 'slug'}</p>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Store Description</label>
                  <textarea
                     rows={3}
                     placeholder="What do you sell?"
                     value={createFormData.description}
                     onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                     className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  />
               </div>
            </div>
         </Modal>
      </div>
   )
}
