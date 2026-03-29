"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  FolderTree, 
  ChevronRight, 
  ChevronDown, 
  Image as ImageIcon,
  Edit2,
  Trash2,
  Search,
  RefreshCw
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 🌳 Recursive Category Component
const CategoryNode = ({ category, level = 0 }: { category: any, level?: number }) => {
  const [isOpen, setIsOpen] = useState(level < 1); // Auto-expand first level
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center justify-between p-4 hover:bg-primary/5 transition-all group border-b border-slate-100 dark:border-slate-800",
          level > 0 && "ml-8 border-l-2 border-primary/10"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center min-w-[24px]">
            {hasChildren && (
              <button 
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }} 
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              >
                {isOpen ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
          </div>
          
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
            {category.image ? (
              <img src={category.image} className="h-full w-full object-cover" alt={category.name} />
            ) : (
              <ImageIcon className="h-5 w-5 text-slate-400" />
            )}
          </div>
          
          <div>
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{category.name}</h4>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{category.slug}</span>
                {hasChildren && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded ring-1 ring-primary/20">
                        {category.children.length} SUBS
                    </span>
                )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <Button variant="ghost" size="icon" className="h-9 w-9 bg-primary/5 text-primary hover:bg-primary hover:text-black rounded-xl">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary rounded-xl">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white rounded-xl">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="animate-in slide-in-from-top-1 duration-300">
          {category.children.map((child: any) => (
            <CategoryNode key={child._id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoriesPage() {
  const [tree, setTree] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Mock Data to show the structure
  useEffect(() => {
    setTimeout(() => {
        setTree([
            { 
              _id: '1', 
              name: 'Electronics', 
              slug: 'electronics', 
              children: [
                { 
                  _id: '2', 
                  name: 'Smartphones', 
                  slug: 'smartphones', 
                  children: [
                    { _id: '3', name: 'Premium Range', slug: 'premium-range', children: [] },
                    { _id: '4', name: 'Refurbished', slug: 'refurbished', children: [] }
                  ]
                },
                { _id: '5', name: 'Accessories', slug: 'accessories', children: [] }
              ]
            },
            { 
                _id: '6', 
                name: 'Grocery', 
                slug: 'grocery', 
                children: [
                    { _id: '7', name: 'Fruits & Veg', slug: 'fruits-veg', children: [] }
                ] 
            }
          ]);
          setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-10 pb-12 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Organization Engine</span>
           </div>
           <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
             Catalog <span className="text-primary tracking-normal">Hierarchy</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium italic">
             Build an infinite category tree for your storefront navigation.
           </p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="h-14 px-6 border-slate-200 dark:border-slate-800 rounded-2xl font-black text-xs tracking-widest uppercase hover:text-primary transition-all active:scale-95">
                <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                Sync Tree
            </Button>
            <Button className="h-14 px-8 bg-primary hover:bg-primary-dark text-black rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30">
                <Plus className="h-5 w-5 mr-2 stroke-[3]" />
                NEW ROOT CATEGORY
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Tree View */}
        <Card className="lg:col-span-2 bg-white dark:bg-[#09090b] border-primary/10 overflow-hidden shadow-2xl shadow-black/5">
            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FolderTree className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Global Store Tree</h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Live Preview of Storefront Sitemaps</p>
                    </div>
                </div>
                <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Filter..." 
                        className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    />
                </div>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800 min-h-[400px]">
                {isLoading ? (
                    <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                        <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compiling Hierarchy...</p>
                    </div>
                ) : (
                    tree.map((node: any) => (
                        <CategoryNode key={node._id} category={node} />
                    ))
                )}
            </div>
        </Card>

        {/* Info/Stats Card */}
        <div className="space-y-6">
            <Card className="p-8 bg-primary text-black border-none shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <FolderTree className="absolute -right-6 -bottom-6 h-32 w-32 opacity-10 group-hover:rotate-12 transition-transform" />
                <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Category Logic</h3>
                <p className="text-xs font-bold leading-relaxed opacity-80 mb-6">
                    Each product in your store can be linked to a specific sub-category. 
                    This builds your storefront sidebar navigation automatically.
                </p>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-black/5 rounded-xl border border-black/5">
                        <span className="text-[10px] font-black uppercase">Total Nodes</span>
                        <span className="font-black">7</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/5 rounded-xl border border-black/5">
                        <span className="text-[10px] font-black uppercase">Max Depth</span>
                        <span className="font-black">3 Levels</span>
                    </div>
                </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-[#09090b] border-primary/10">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Tips</h4>
                <ul className="space-y-4">
                    {[
                        "Drag and drop to reorder (Coming soon)",
                        "Sub-categories inherit parent filters",
                        "Images are optimized for mobile icons",
                        "Deleting a parent requires sub-category cleanup"
                    ].map((tip, i) => (
                        <li key={i} className="flex gap-3 items-start">
                            <div className="h-4 w-4 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            </div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{tip}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
      </div>
    </div>
  )
}
