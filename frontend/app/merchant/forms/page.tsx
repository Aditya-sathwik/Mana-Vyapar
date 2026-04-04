"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import {
    Plus,
    Trash2,
    GripVertical,
    Eye,
    Save,
    Type,
    Hash,
    ChevronDown,
    CircleDot,
    CheckSquare,
    CalendarDays,
    Layout,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    ListFilter,
    Globe,
    Lock,
    Search
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, Reorder, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api-client"
import toast from "react-hot-toast"
import { useRouter, useSearchParams } from "next/navigation"

// 🏗️ Field Types definition
const FIELD_TYPES = [
    { type: 'text', label: 'Short Text', icon: Type, description: 'Single line info' },
    { type: 'textarea', label: 'Long Text', icon: Layout, description: 'Multiple lines' },
    { type: 'number', label: 'Price/Number', icon: Hash, description: 'Numbers only' },
    { type: 'dropdown', label: 'Selection Menu', icon: ChevronDown, description: 'Pick from list' },
    { type: 'radio', label: 'Single Choice', icon: CircleDot, description: 'One option' },
    { type: 'checkbox', label: 'Multiple Choice', icon: CheckSquare, description: 'One or more' },
    { type: 'date', label: 'Date Picker', icon: CalendarDays, description: 'Pick a day' },
]

function BuilderComponent() {
    const searchParams = useSearchParams()
    const formId = searchParams.get('id')
    const isEditMode = !!formId

    const [title, setTitle] = useState("My Customer Form")
    const [description, setDescription] = useState("Tell us what you think about our service.")
    const [accessType, setAccessType] = useState<"PUBLIC" | "REGISTERED">("PUBLIC")
    const [fields, setFields] = useState<any[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [loadingForm, setLoadingForm] = useState(isEditMode)
    const [previewMode, setPreviewMode] = useState(false)
    const router = useRouter()
    const canvasRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isEditMode) {
            const fetchForm = async () => {
                try {
                    const response = await apiFetch(`/dynamic-forms/public/${formId}`)
                    if (response.success) {
                        setTitle(response.data.title)
                        setDescription(response.data.description)
                        setAccessType(response.data.accessType || "PUBLIC")
                        setFields(response.data.fields.map((f: any) => ({ ...f, id: Math.random().toString(36).substr(2, 9) })))
                    }
                } catch (error) {
                    toast.error("Form not found")
                    router.push("/merchant/forms/list")
                } finally {
                    setLoadingForm(false)
                }
            }
            fetchForm()
        }
    }, [formId, isEditMode, router])

    const addField = (fieldType: string) => {
        const newField = {
            id: Math.random().toString(36).substr(2, 9),
            label: `New ${fieldType} item`,
            type: fieldType,
            required: false,
            placeholder: `Enter ${fieldType}...`,
            options: (['dropdown', 'radio', 'checkbox'].includes(fieldType)) ?
                [{ label: 'Option 1', value: 'option-1' }, { label: 'Option 2', value: 'option-2' }] : [],
        }
        setFields([...fields, newField])
        toast.success(`Added ${fieldType}`)
    }

    const handleDragEnd = (event: any, info: any, type: string) => {
        if (!canvasRef.current) return
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const { x, y } = info.point
        if (x >= canvasRect.left && x <= canvasRect.right && y >= canvasRect.top && y <= canvasRect.bottom) {
            addField(type)
        }
    }

    const removeField = (id: string) => setFields(fields.filter(f => f.id !== id))
    const updateField = (id: string, updates: any) => setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f))

    const saveForm = async () => {
        if (fields.length === 0) return toast.error("Add at least one field")
        setIsSaving(true)
        try {
            const endpoint = isEditMode ? `/dynamic-forms/${formId}` : "/dynamic-forms/create"
            const method = isEditMode ? "PATCH" : "POST"
            
            const response = await apiFetch(endpoint, {
                method,
                body: JSON.stringify({
                    title,
                    description,
                    accessType,
                    fields: fields.map(({ id, ...f }) => f)
                })
            })

            if (response.success) {
                toast.success(isEditMode ? "Changes Saved" : "Form Created")
                router.push("/merchant/forms/list")
            }
        } catch (error: any) {
            toast.error("Cloud connection failed. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    if (loadingForm) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Preparing Editor</p>
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-20">
            {/* 🛸 Builder Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8 px-4 md:px-0">
                <div className="space-y-2">
                    <button
                        onClick={() => router.push("/merchant/forms/list")}
                        className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors mb-4 text-left"
                    >
                        <ListFilter className="h-3 w-3" />
                        Back to My Forms
                    </button>
                    <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
                        {isEditMode ? "Edit" : "Form"} <span className="text-primary italic">{isEditMode ? "Design" : "Builder"}</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className={cn(
                            "h-16 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3",
                            previewMode ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {previewMode ? <CheckCircle2 className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        {previewMode ? "Exit Preview" : "Live Preview"}
                    </button>

                    <button
                        onClick={saveForm}
                        disabled={isSaving}
                        className="h-16 px-10 bg-foreground text-background dark:bg-card dark:text-primary border border-border/50 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 font-black italic"
                    >
                        {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        {isEditMode ? "Update Design" : "Transmit Form"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* 🛠️ Sidebar Palette */}
                <div className="lg:col-span-4 space-y-8 px-4 md:px-0">
                    {!previewMode ? (
                        <Card className="p-8 space-y-6 bg-card border-border border-2 rounded-[2rem]">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Design Settings</p>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Display Name</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-lg font-black focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold min-h-[100px] focus:outline-none focus:border-primary/50"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Access Visibility</label>
                                    <div className="grid grid-cols-2 gap-2 bg-muted/30 p-1 rounded-[1.25rem] border border-border">
                                        <button
                                            onClick={() => setAccessType("PUBLIC")}
                                            className={cn(
                                                "h-10 px-4 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase transition-all text-center justify-center",
                                                accessType === "PUBLIC" ? "bg-white dark:bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <Globe className="h-3 w-3" />
                                            Public
                                        </button>
                                        <button
                                            onClick={() => setAccessType("REGISTERED")}
                                            className={cn(
                                                "h-10 px-4 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase transition-all text-center justify-center",
                                                accessType === "REGISTERED" ? "bg-white dark:bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <Lock className="h-3 w-3" />
                                            Customers
                                        </button>
                                    </div>
                                    <p className="text-[8px] font-bold text-muted-foreground px-2 uppercase leading-snug">
                                        {accessType === "PUBLIC" 
                                            ? "Anyone with the link can fill the form." 
                                            : "Only verified customers logged into your shop can fill this form."}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-border focus-within:border-primary/20 transition-all">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Click or Drag to Add</p>
                                    <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto lg:max-h-[480px] gap-3 py-2 pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                                        {FIELD_TYPES.map((type) => (
                                            <motion.button
                                                key={type.type}
                                                type="button"
                                                drag
                                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                                dragElastic={0.9}
                                                onDragEnd={(e, info) => handleDragEnd(e, info, type.type)}
                                                onClick={() => addField(type.type)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="min-w-[150px] lg:min-w-full p-4 bg-[#0d1525]/50 hover:bg-[#0d1525] border-[#1e293b] border-2 rounded-[2rem] text-left flex items-center gap-4 transition-all shadow-lg active:z-50 cursor-grab active:cursor-grabbing group/btn"
                                            >
                                                <div className="h-10 w-10 rounded-xl bg-[#1e293b] flex items-center justify-center shrink-0 group-hover/btn:bg-primary/10 group-hover/btn:text-primary transition-all">
                                                    <type.icon className="h-4 w-4" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-tight text-white group-hover/btn:translate-x-1 transition-all">{type.label}</p>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-8 bg-primary/5 border-primary/20 border-2 rounded-[2rem]">
                             <div className="flex items-center gap-3 mb-4">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                <h3 className="text-sm font-black uppercase tracking-tight">Active Preview</h3>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-tight tracking-widest">
                                This is exactly how your customers will see your form on their devices.
                            </p>
                        </Card>
                    )}
                </div>

                {/* 🏗️ Canvas Area */}
                <div className="lg:col-span-8 px-4 md:px-0">
                    <Card ref={canvasRef} className="min-h-[600px] bg-foreground/[0.02] dark:bg-card p-6 md:p-12 border-border border-2 lg:border-4 lg:border-dashed rounded-[2rem] lg:rounded-[3rem] relative">
                        {fields.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-40">
                                <Layout className="h-12 w-12 text-muted-foreground/20 mb-6" />
                                <h3 className="text-xl font-black text-muted-foreground/40 uppercase tracking-widest">Canvas Empty</h3>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                <div className="space-y-3 pb-8 border-b border-border/50 text-center lg:text-left">
                                    <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">{title}</h2>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{description}</p>
                                </div>

                                <Reorder.Group axis="y" values={fields} onReorder={setFields} className="space-y-6">
                                    {fields.map((field) => (
                                        <Reorder.Item key={field.id} value={field} className="relative">
                                            {!previewMode ? (
                                                <Card className="p-6 bg-muted/20 border-border flex gap-4 items-start group rounded-[1.5rem]">
                                                    <div className="cursor-move p-2 text-muted-foreground group-hover:text-primary"><GripVertical className="h-4 w-4" /></div>
                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex justify-between items-center gap-4 flex-wrap">
                                                            <input value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} className="bg-transparent text-[11px] font-black uppercase tracking-widest focus:outline-none w-full md:w-auto flex-1 min-w-[200px]" />
                                                            <div className="flex items-center gap-2">
                                                                {field.type === 'dropdown' && (
                                                                    <button 
                                                                        onClick={() => updateField(field.id, { hasSearch: !field.hasSearch })} 
                                                                        className={cn(
                                                                            "text-[8px] font-black px-2 py-1 rounded-lg border transition-all flex items-center gap-1", 
                                                                            field.hasSearch ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "text-muted-foreground border-border hover:border-primary/50"
                                                                        )}
                                                                    >
                                                                        <Search className="h-2 w-2" />
                                                                        SEARCHABLE
                                                                    </button>
                                                                )}
                                                                <button onClick={() => updateField(field.id, { required: !field.required })} className={cn("text-[8px] font-black px-2 py-1 rounded-lg border transition-all", field.required ? "bg-primary text-white border-primary" : "text-muted-foreground border-border hover:border-primary/50")}>REQUIRED</button>
                                                                <button onClick={() => removeField(field.id)} className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                                                            </div>
                                                        </div>
                                                        <input value={field.placeholder} onChange={(e) => updateField(field.id, { placeholder: e.target.value })} className="w-full bg-muted border border-border/50 rounded-xl px-4 py-2 text-[10px] font-bold focus:outline-none focus:border-primary/30" />
                                                    </div>
                                                </Card>
                                            ) : (
                                                <div className="space-y-3 px-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{field.label}</label>
                                                    {field.type === 'textarea' ? (
                                                        <textarea className="w-full h-32 bg-card/50 border-2 border-border rounded-[1.25rem] p-4 text-[10px] font-bold" />
                                                    ) : field.type === 'dropdown' ? (
                                                         <div className="relative">
                                                            <select defaultValue="" className="w-full h-16 bg-card/50 border-2 border-border rounded-[1.25rem] px-4 text-[10px] appearance-none font-bold">
                                                                <option value="" disabled>{field.placeholder}</option>
                                                                {field.options.map((opt: any, i: number) => <option key={i} value={opt.value}>{opt.label}</option>)}
                                                            </select>
                                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4" />
                                                        </div>
                                                    ) : (
                                                        <input className="w-full h-16 bg-card/50 border-2 border-border rounded-[1.25rem] px-4 text-[10px] font-bold" />
                                                    )}
                                                </div>
                                            )}
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function FormBuilderPage() {
    return (
        <Suspense fallback={<div>Loading Builder...</div>}>
            <BuilderComponent />
        </Suspense>
    )
}
