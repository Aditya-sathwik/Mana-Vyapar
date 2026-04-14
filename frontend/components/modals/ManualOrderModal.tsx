"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  User, 
  Phone, 
  CreditCard, 
  Wallet, 
  MessageSquare,
  Loader2,
  CheckCircle2,
  Banknote
} from "lucide-react"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"
import storage from "@/lib/storage"
import { useAuth } from "@/context/auth-context"
import { useKhata } from "@/hooks/use-khata"
import { apiFetch } from "@/lib/api-client"


interface Product {
  _id: string
  name: string
  sellingPrice: number
  unit: string
  images: { url: string }[]
  stock: number
}

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  unit: string
}

interface ManualOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

export function ManualOrderModal({ isOpen, onClose, onSuccess }: ManualOrderModalProps) {
  const [step, setStep] = useState(1) // 1: Products, 2: Customer & Payment
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])
  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    model: "Customer"
  })
  const [couponCode, setCouponCode] = useState("")
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false)
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("CASH")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mobileTab, setMobileTab] = useState<"search" | "manifest">("search")
  const { user } = useAuth()
  const { khataAccounts, addCustomer, refreshKhata } = useKhata()
  
  // New States for Khata Integration
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)
  // 🔍 DEBOUNCED SEARCH LOGIC
  useEffect(() => {
    const handler = setTimeout(() => {
      const nameQuery = (customer.name || "").trim();
      
      if (nameQuery.length > 1 && showCustomerSearch) {
        refreshKhata(nameQuery);
      }
    }, 500); // 500ms debounce for better UX

    return () => clearTimeout(handler);
  }, [customer.name, customer.phone, showCustomerSearch]);

  // We rely on the server-side results in khataAccounts now
  const filteredKhata = khataAccounts;

  const selectExistingCustomer = (acc: any) => {
    setCustomer({
      id: acc._id,
      name: acc.name || acc.customerName,
      phone: acc.phone || acc.customerPhoneNumber,
      email: acc.email || acc.customerEmail || "",
      model: "Customer"
    })
    setShowCustomerSearch(false)
  }

  useEffect(() => {
    if (searchQuery.length > 1) {
      const delayDebounceFn = setTimeout(() => {
        searchProducts()
      }, 500)
      return () => clearTimeout(delayDebounceFn)
    } else {
      setProducts([])
    }
  }, [searchQuery])

  const searchProducts = async () => {
    try {
      setLoadingProducts(true)
      
      const slug = user?.storeSlug || localStorage.getItem("storeSlug") || "kirana";

      const data = await apiFetch(`/products/store/${slug}?search=${searchQuery}`);
      if (data.success) {
        setProducts(data.data.products || data.data || [])
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const addItem = (product: Product) => {
    const existing = selectedItems.find(item => item.productId === product._id)
    if (existing) {
      setSelectedItems(selectedItems.map(item => 
        item.productId === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setSelectedItems([...selectedItems, {
        productId: product._id,
        name: product.name,
        price: product.sellingPrice,
        quantity: 1,
        unit: product.unit
      }])
    }
    toast.success(`${product.name} added`)
  }

  const removeItem = (productId: string) => {
    setSelectedItems(selectedItems.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: string, delta: number) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(0.01, item.quantity + delta)
        return { ...item, quantity: parseFloat(newQty.toFixed(2)) }
      }
      return item
    }))
  }

  const updatePrice = (productId: string, price: number) => {
    setSelectedItems(selectedItems.map(item => 
      item.productId === productId ? { ...item, price } : item
    ))
  }

  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    if (!customer.id) {
      toast.error("Please identify or select a customer first!");
      return;
    }
    
    try {
      setIsVerifyingCoupon(true);
      const data = await apiFetch(`/transactions/coupon/validate/${couponCode}?subtotal=${totalAmount}&customerId=${customer.id}`);
      
      if (data.success) {
        setCouponDiscountAmount(data.data.discount);
        toast.success(`Coupon Applied! Extra ₹${data.data.discount} off`);
      } else {
        setCouponDiscountAmount(0);
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (err) {
      toast.error("Failed to verify coupon");
    } finally {
      setIsVerifyingCoupon(false);
    }
  }

  const finalTotal = Math.max(0, totalAmount - couponDiscountAmount);

  const handleSubmit = async () => {
    if (selectedItems.length === 0) return toast.error("Add at least one item")
    if (!customer.name || !customer.phone) return toast.error("Customer details required")
    
    // Strict phone validation to match backend Joi validator
    if (!/^[0-9]{10}$/.test(customer.phone)) {
       return toast.error("Phone number must be exactly 10 digits")
    }

    try {
      setIsSubmitting(true)
      // 🚀 Step 1: Ensure Customer Profile exists in Khata/CRM
      let currentCustomerId = customer.id;
      let currentCustomerModel = customer.model || "Customer";

      if (!currentCustomerId && customer.phone) {
          try {
              toast.loading("Initializing customer profile...", { id: "customer-init" });
              const newCustomer = await addCustomer({
                  customerName: customer.name,
                  customerPhoneNumber: customer.phone,
                  customerEmail: customer.email
              });
              currentCustomerId = newCustomer._id;
              currentCustomerModel = "Customer";
              toast.success("Customer profile secured", { id: "customer-init" });
          } catch (err) {
              console.error("Failed to auto-create customer in frontend:", err);
              toast.error("Proceeding with manual entry...", { id: "customer-init" });
          }
      }

      const orderPayload = {
        merchantId: user?._id,
        customerId: currentCustomerId,
        customerName: customer.name,
        customerPhoneNumber: customer.phone,
        customerModel: currentCustomerModel,
        items: selectedItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit
        })),
        couponCode,
        paymentMethod,
        status: "PLACED",
        source: "Manual"
      };

      console.log("📦 Sending Order Payload:", orderPayload);

      const data = await apiFetch("/orders/create", {
        method: "POST",
        body: JSON.stringify(orderPayload)
      });

      if (data.success) {
        toast.success("Order created successfully!")
        onSuccess()
        onClose()
        // Reset state
        setStep(1)
        setSelectedItems([])
        setCustomer({ name: "", phone: "", email: "", model: "Customer", id: "" })
      } else {
        toast.error(data.message || "Failed to create order")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-card border border-border rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] mt-auto sm:mt-0"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
              {step === 1 ? "Build Manual Order" : "Finalize Manifest"}
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
              Step {step} of 2 • {selectedItems.length} Items Selected
            </p>
          </div>
          <button 
            onClick={onClose}
            className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
          {step === 1 ? (
            <>
              {/* Mobile Tab Switcher */}
              <div className="sm:hidden flex p-4 bg-muted/50 border-b border-border">
                <div className="flex-1 bg-muted rounded-xl p-1 flex">
                    <button 
                      onClick={() => setMobileTab("search")}
                      className={cn(
                        "flex-1 h-10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        mobileTab === "search" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                      )}
                    >
                      Search
                    </button>
                    <button 
                      onClick={() => setMobileTab("manifest")}
                      className={cn(
                        "flex-1 h-10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all relative",
                        mobileTab === "manifest" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                      )}
                    >
                      Manifest
                      {selectedItems.length > 0 && (
                        <span className={cn(
                          "absolute top-1 right-2 h-4 w-4 text-[8px] flex items-center justify-center rounded-full font-black",
                          mobileTab === "manifest" ? "bg-background text-primary" : "bg-primary text-primary-foreground"
                        )}>
                          {selectedItems.length}
                        </span>
                      )}
                    </button>
                </div>
              </div>

              {/* Product Search Side */}
              <div className={cn(
                "flex-1 p-5 sm:p-8 border-r border-border overflow-y-auto",
                mobileTab === "manifest" && "hidden sm:block"
              )}>
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input 
                    type="text"
                    placeholder="Search products by name or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 bg-muted border border-border rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-4">
                  {loadingProducts ? (
                    <div className="py-12 flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Searching Catalog...</span>
                    </div>
                  ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {products.map((product) => (
                        <div 
                          key={product._id}
                          className={cn(
                            "p-4 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all group cursor-pointer relative",
                            selectedItems.some(item => item.productId === product._id) && "border-primary/50 bg-primary/5"
                          )}
                          onClick={() => addItem(product)}
                        >
                          {/* ✅ Tick on left side for added items */}
                          <AnimatePresence>
                            {selectedItems.some(item => item.productId === product._id) && (
                              <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute -left-2 -top-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center text-black z-20 shadow-lg shadow-primary/20"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="flex gap-4">
                            <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden shrink-0 border border-border relative">
                              {product.images?.[0] ? (
                                <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                              ) : (
                                <ShoppingBag className="h-full w-full p-4 text-muted-foreground/30" />
                              )}
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                              <h4 className="text-xs font-black text-foreground truncate">{product.name}</h4>
                              <p className="text-[10px] font-bold text-primary mt-1 uppercase">₹{product.sellingPrice} / {product.unit}</p>
                              <p className={cn(
                                "text-[9px] font-bold mt-1 uppercase",
                                product.stock > 0 ? "text-emerald-500" : "text-red-500"
                              )}>
                                {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.length > 1 ? (
                    <div className="py-12 text-center">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">No products found</p>
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center opacity-30 italic">
                       <ShoppingBag className="h-12 w-12 mb-4" />
                       <span className="text-xs">Start typing to search products</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Selection Side (Manifest) */}
              <div className={cn(
                "w-full sm:w-80 bg-muted/30 p-5 sm:p-8 flex flex-col overflow-y-auto border-t sm:border-t-0 border-border",
                mobileTab === "search" && "hidden sm:flex"
              )}>
                <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Selected Items
                </h3>

                <div className="space-y-4 mb-8">
                  {selectedItems.length > 0 ? (
                    selectedItems.map((item) => (
                      <div key={item.productId} className="flex flex-col gap-3 p-4 bg-card border border-border rounded-2xl">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black text-foreground uppercase truncate max-w-[120px]">{item.name}</span>
                          <button onClick={() => removeItem(item.productId)} className="text-muted-foreground hover:text-red-500 transition-colors">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:text-primary transition-colors">
                              <Minus className="h-3 w-3" />
                            </button>
                            <input 
                              type="number" 
                              value={item.quantity} 
                              onChange={(e) => updateQuantity(item.productId, parseFloat(e.target.value) - item.quantity)}
                              className="w-10 bg-transparent text-center text-[10px] font-black focus:outline-none"
                            />
                            <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:text-primary transition-colors">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.unit}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Price Override</span>
                          <div className="flex items-center gap-1 group">
                            <span className="text-[10px] font-black">₹</span>
                            <input 
                              type="number" 
                              value={item.price} 
                              onChange={(e) => updatePrice(item.productId, parseFloat(e.target.value))}
                              className="w-16 bg-transparent text-right text-[10px] font-black focus:outline-none focus:text-primary transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center opacity-20 italic">
                      <p className="text-[10px]">Your order is empty</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-border mt-auto">
                   <div className="flex justify-between items-end mb-6">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Grand Total</span>
                      <h4 className="text-2xl font-black text-primary tabular-nums">₹{totalAmount.toLocaleString()}</h4>
                   </div>
                   <button 
                     disabled={selectedItems.length === 0}
                     onClick={() => setStep(2)}
                     className="w-full h-14 bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                   >
                     Process Details
                   </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 p-5 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 overflow-y-auto">
              <div className="space-y-8">
                <div>
                   <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Customer Identification
                  </h3>
                  <div className="space-y-4 relative">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input 
                          placeholder="Customer Full Name"
                          value={customer.name}
                          onFocus={() => setShowCustomerSearch(true)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setShowCustomerSearch(false);
                            }
                          }}
                          onChange={(e) => setCustomer({...customer, name: e.target.value})}
                          className="w-full h-14 bg-muted border border-border rounded-2xl pl-12 pr-12 text-xs font-bold focus:outline-none focus:border-primary/50"
                        />
                        {customer.name && (
                          <button 
                            onClick={() => {
                              setCustomer({...customer, name: "", id: undefined});
                              setShowCustomerSearch(false);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted-foreground/10 rounded-full transition-colors"
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        )}
                      
                      {/* Customer Dropdown */}
                      <AnimatePresence>
                        {showCustomerSearch && (customer.name.length > 1 || customer.phone.length > 1) && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-[60] left-0 right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-2xl max-h-56 overflow-y-auto"
                          >
                            <div className="p-3 border-b border-border bg-muted/30 flex justify-between items-center">
                               <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Select Matching Profile</span>
                               <button 
                                onClick={() => setShowCustomerSearch(false)}
                                className="text-[9px] font-bold text-primary hover:underline hover:text-emerald-500 transition-colors uppercase"
                               >
                                  Skip & Use Manual
                               </button>
                            </div>
                            
                            {filteredKhata.length > 0 ? filteredKhata.map(acc => (
                              <button
                                key={acc._id}
                                onClick={() => selectExistingCustomer(acc)}
                                className="w-full p-4 flex items-center justify-between hover:bg-primary/5 transition-all text-left border-b border-border/50 last:border-0"
                              >
                                <div className="flex flex-col">
                                  <span className="text-xs font-black uppercase text-foreground leading-none mb-1">{acc.name}</span>
                                  <span className="text-[9px] font-bold text-muted-foreground font-mono">{acc.phone}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className={cn(
                                    "text-[8px] font-black px-2 py-0.5 rounded-full uppercase mb-1",
                                    acc.balance > 0 ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                                  )}>
                                    ₹{Math.abs(acc.balance)} In Khata
                                  </span>
                                  <span className="text-[7px] font-bold text-muted-foreground uppercase">Sync Active</span>
                                </div>
                              </button>
                            )) : (
                              <div className="p-10 text-center opacity-50">
                                <User className="h-6 w-6 mx-auto mb-2 text-muted-foreground/30" />
                                <p className="text-[9px] font-black uppercase tracking-widest">No matching profiles</p>
                                <button 
                                  onClick={() => setShowCustomerSearch(false)}
                                  className="mt-4 text-[9px] font-bold text-primary border border-primary/20 px-4 py-2 rounded-xl"
                                >
                                   CREATE NEW PROFILE
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input 
                          placeholder="Phone Number (10 digits)"
                          value={customer.phone}
                          autoComplete="off"
                          onChange={(e) => {
                             const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                             setCustomer({...customer, phone: val});
                             // Don't show search for phone anymore
                          }}
                          className="w-full h-14 bg-muted border border-border rounded-2xl pl-12 pr-12 text-xs font-bold focus:outline-none focus:border-primary/50"
                        />
                        {customer.phone && (
                          <button 
                            onClick={() => {
                              setCustomer({...customer, phone: "", id: undefined});
                              setShowCustomerSearch(false);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted-foreground/10 rounded-full transition-colors"
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                  </div>
                </div>

                <div>
                   <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Payment Protocol
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: "CASH", label: "Cash Payment", icon: Wallet, color: "bg-emerald-500" },
                      { id: "UPI", label: "UPI / Digital QR", icon: CreditCard, color: "bg-blue-500" },
                      { id: "KHATA", label: "Add to Khata (Credit)", icon: ShoppingBag, color: "bg-orange-500" },
                      { id: "WHATSAPP", label: "Order Placed - Send Payment Link", icon: MessageSquare, color: "bg-indigo-500", sub: "Payment via WhatsApp" }
                    ].map((method) => (
                      <button 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={cn(
                          "p-4 rounded-2xl border flex items-center gap-4 transition-all group",
                          paymentMethod === method.id 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg",
                          method.color
                        )}>
                          <method.icon className="h-5 w-5" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest">{method.label}</p>
                          {method.sub && <p className="text-[8px] font-bold text-muted-foreground uppercase mt-0.5">{method.sub}</p>}
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-8 rounded-[2rem] border border-border flex flex-col">
                 <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-6">Manifest Summary</h3>
                 <div className="flex-1 space-y-3">
                    {selectedItems.map(item => (
                      <div key={item.productId} className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-muted-foreground uppercase">{item.quantity} {item.unit} x {item.name}</span>
                        <span className="text-foreground tabular-nums">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                 </div>
                 <div className="pt-6 border-t border-border mt-8">
                     <div className="mb-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Coupon / Reward Code</label>
                        <div className="relative">
                           <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <input 
                              type="text" 
                              placeholder="e.g. SUMMER50"
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(e.target.value.toUpperCase());
                                setCouponDiscountAmount(0); // Reset discount on change
                              }}
                              className="w-full h-12 bg-muted border border-border rounded-xl pl-11 pr-20 text-[10px] font-black focus:outline-none focus:border-primary/50 uppercase tracking-widest"
                           />
                           <button 
                              onClick={handleApplyCoupon}
                              disabled={isVerifyingCoupon || !couponCode}
                              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50"
                           >
                              {isVerifyingCoupon ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply"}
                           </button>
                        </div>
                        {couponDiscountAmount > 0 && (
                          <p className="text-[9px] font-bold text-emerald-500 mt-2 uppercase flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3" />
                            Coupon Active: -₹{couponDiscountAmount}
                          </p>
                        )}
                     </div>
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-xs font-black uppercase tracking-widest">Total Payable</span>
                      <div className="flex flex-col items-end">
                        {couponDiscountAmount > 0 && (
                          <span className="text-[10px] font-bold text-muted-foreground line-through opacity-50">₹{totalAmount.toLocaleString()}</span>
                        )}
                        <span className="text-3xl font-black text-primary tabular-nums">₹{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setStep(1)}
                        className="h-14 border border-border rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-muted transition-all"
                      >
                        Back
                      </button>
                      <button 
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="h-14 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Order"}
                      </button>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
