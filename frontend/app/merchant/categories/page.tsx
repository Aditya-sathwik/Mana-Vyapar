"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  Check,
  Zap,
  Loader2,
  AlertCircle,
  PackagePlus,
  IndianRupee,
  Box,
  Eye,
  ArrowRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { apiFetch } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const CategoryNode = ({
  category,
  level = 0,
  onAddSub,
  onEdit,
  onDelete,
  onAddProduct
}: {
  category: any,
  level?: number,
  onAddSub: (parent: any) => void,
  onEdit: (category: any) => void,
  onDelete: (category: any) => void,
  onAddProduct: (category: any) => void
}) => {
  const [isOpen, setIsOpen] = useState(level < 1);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center justify-between p-4 hover:bg-primary/5 transition-all group border-b border-border",
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
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {isOpen ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </button>
            )}
          </div>

          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
            {category.image ? (
              <img src={category.image} className="h-full w-full object-cover" alt={category.name} />
            ) : (
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-[120px]">
            <h4 className="font-black text-foreground uppercase tracking-tighter leading-none">{category.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{category.slug}</span>
              {hasChildren && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded ring-1 ring-primary/20">
                  {category.children.length} ITEMS
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = `/merchant/inventory?category=${category._id}`}
            title="View Products"
            className="h-9 w-9 bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl border border-blue-500/20"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddProduct(category)}
            title="Add Product"
            className="h-9 w-9 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl border border-emerald-500/20"
          >
            <PackagePlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddSub(category)}
            title="Add Sub"
            className="h-9 w-9 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-xl border border-primary/20"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(category)}
            title="Edit"
            className="h-9 w-9 bg-muted text-muted-foreground hover:text-primary rounded-xl border border-border"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(category)}
            title="Delete"
            className="h-9 w-9 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="animate-in slide-in-from-top-1 duration-300">
          {category.children.map((child: any) => (
            <CategoryNode
              key={child._id}
              category={child}
              level={level + 1}
              onAddSub={onAddSub}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddProduct={onAddProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoriesPage() {
  const [tree, setTree] = useState<any[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [parentCategory, setParentCategory] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    image: ""
  });

  const [productFormData, setProductFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    unit: "piece"
  });

  const fetchTree = useCallback(async (sid: string) => {
    try {
      setIsLoading(true);
      const res = await apiFetch(`/categories/tree/${sid}`);
      if (res.success) {
        setTree(res.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStore = useCallback(async () => {
    try {
      const res = await apiFetch("/stores/me");
      if (res.success && res.data) {
        setStoreId(res.data._id);
        fetchTree(res.data._id);
      }
    } catch (error: any) {
      toast.error("Please ensure your store is set up properly");
      setIsLoading(false);
    }
  }, [fetchTree]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  const handleOpenForm = (category: any = null, parent: any = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        image: category.image || ""
      });
    } else {
      setSelectedCategory(null);
      setFormData({ name: "", image: "" });
    }
    setParentCategory(parent);
    setIsFormOpen(true);
  };

  const handleOpenProductForm = (category: any) => {
    setSelectedCategory(category);
    setProductFormData({ name: "", description: "", price: "", stock: "0", unit: "piece" });
    setIsProductModalOpen(true);
  };

  const handleAddProduct = async () => {
    if (!productFormData.name || !productFormData.price) {
      toast.error("Please fill in basic product details");
      return;
    }

    try {
      setIsActionLoading(true);
      const data = new FormData();
      data.append("name", productFormData.name);
      data.append("description", productFormData.description);
      data.append("price", productFormData.price);
      data.append("stock", productFormData.stock);
      data.append("unit", productFormData.unit);
      data.append("category", selectedCategory._id);

      const res = await apiFetch("/products", {
        method: "POST",
        body: data,
        isMultipart: true
      });

      if (res.success) {
        toast.success(`Success! Added ${productFormData.name}`);
        setIsProductModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    if (!storeId) return;

    try {
      setIsActionLoading(true);
      const payload = { ...formData, parentCategory: parentCategory?._id || null };
      
      let res;
      if (selectedCategory && !isProductModalOpen) {
        res = await apiFetch(`/categories/${storeId}/${selectedCategory._id}`, {
          method: "PATCH",
          body: JSON.stringify(formData)
        });
      } else {
        res = await apiFetch(`/categories/${storeId}`, {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }

      if (res.success) {
        toast.success(selectedCategory ? "Update successful" : "Created successfully");
        setIsFormOpen(false);
        fetchTree(storeId);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory || !storeId) return;

    try {
      setIsActionLoading(true);
      const res = await apiFetch(`/categories/${storeId}/${selectedCategory._id}`, {
        method: "DELETE"
      });

      if (res.success) {
        toast.success("Category removed");
        setIsDeleteOpen(false);
        fetchTree(storeId);
      }
    } catch (error: any) {
      toast.error(error.message || "Ensure sub-categories are removed first.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredTree = searchQuery
    ? tree.filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : tree;

  return (
    <div className="space-y-10 pb-12 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
            Digital <span className="text-primary tracking-normal">Categories</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium italic">
            Group your products for a better customer discovery experience.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => storeId && fetchTree(storeId)}
            className="h-14 px-8 bg-muted border border-border rounded-full font-black text-[10px] tracking-widest uppercase hover:bg-foreground hover:text-white transition-all shadow-sm group"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Sync Tree
          </Button>
          <Button
            onClick={() => handleOpenForm()}
            className="h-14 px-10 bg-primary hover:bg-emerald-600 text-white rounded-full font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-3 stroke-[3]" />
            New Category
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card border-border overflow-hidden shadow-2xl rounded-[2.5rem]">
          <div className="p-8 bg-muted/30 border-b border-border flex items-center justify-between">
            <h2 className="text-xs font-black text-foreground uppercase tracking-widest">Inventory Structure</h2>
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Find category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-card border border-border rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="divide-y divide-border min-h-[400px]">
            {isLoading ? (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest font-display">Syncing Engine...</p>
              </div>
            ) : filteredTree.length > 0 ? (
              filteredTree.map((node: any) => (
                <CategoryNode
                  key={node._id}
                  category={node}
                  onAddSub={(p) => handleOpenForm(null, p)}
                  onEdit={(c) => handleOpenForm(c)}
                  onDelete={(c) => {
                    setSelectedCategory(c);
                    setIsDeleteOpen(true);
                  }}
                  onAddProduct={(c) => handleOpenProductForm(c)}
                />
              ))
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4 p-8 text-center">
                <FolderTree className="h-16 w-16 text-muted-foreground/20" />
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No Categories Defined</p>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-10 bg-emerald-600 border-none shadow-2xl relative overflow-hidden group rounded-[2.5rem]">
            <FolderTree className="absolute -right-6 -bottom-6 h-32 w-32 opacity-10 group-hover:rotate-12 transition-transform text-white" />
            <h3 className="text-3xl font-black tracking-tighter uppercase mb-4 text-white">Smart Mapping</h3>
            <p className="text-[11px] font-bold leading-relaxed text-emerald-50 opacity-80 mb-10">
              Defining categories helps your AI Salesbot and Customer Web-App display your products with zero effort.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-white/10">
                <span className="text-[10px] font-black uppercase text-emerald-100">Total Departments</span>
                <span className="font-black text-2xl text-white">{tree.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Add Product Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title="Quick Product Entry"
        description={`Registering new product under ${selectedCategory?.name}`}
        confirmLabel="Save Product"
        onConfirm={handleAddProduct}
        isLoading={isActionLoading}
      >
        <div className="space-y-6 py-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Identity</label>
            <div className="relative group">
               <Box className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <input
                type="text"
                placeholder="Product Name"
                value={productFormData.name}
                onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Product Description</label>
            <textarea
              placeholder="Short description for customers..."
              value={productFormData.description}
              onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
              className="w-full p-4 h-24 bg-muted/30 border border-border rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Mkt Price</label>
            <div className="relative group">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
              <input
                type="number"
                placeholder="0.00"
                value={productFormData.price}
                onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Initial Stock</label>
            <div className="flex gap-2">
              <div className="relative group flex-[2]">
                <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="Count"
                  value={productFormData.stock}
                  onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                  className="w-full pl-11 pr-4 h-12 bg-muted/30 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <select
                value={productFormData.unit}
                onChange={(e) => setProductFormData({ ...productFormData, unit: e.target.value })}
                className="flex-1 h-12 bg-muted/30 border border-border rounded-xl px-4 text-[10px] font-black uppercase focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
              >
                <option value="piece">piece</option>
                <option value="kg">kg</option>
                <option value="gm">gm</option>
                <option value="litre">litre</option>
                <option value="packet">packet</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedCategory ? "Update Classification" : "New Classification"}
        description="Categories help structure your digital storefront."
        confirmLabel={selectedCategory ? "Update" : "Create"}
        onConfirm={handleSubmit}
        isLoading={isActionLoading}
      >
        <div className="space-y-6 py-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Name</label>
            <input
              type="text"
              placeholder="e.g. Fresh Groceries"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-14 bg-muted border border-border rounded-2xl px-6 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Visual Reference (URL)</label>
            <input
                type="text"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full h-14 bg-muted border border-border rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Remove Category"
        variant="danger"
        confirmLabel="Permanently Delete"
        onConfirm={handleDelete}
        isLoading={isActionLoading}
      >
        <div className="p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-foreground uppercase tracking-tighter">Are you absolutely sure?</p>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">
            Deleting {selectedCategory?.name} cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  )
}
