import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../features/cartSlice';
import type { RootState } from '../store';
import MainLayout from '../layouts/MainLayout';
import { ShoppingBag, X, Minus, Plus, ArrowRight, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector((state: RootState) => state.cart);

  const handleUpdateQuantity = (id: string, current: number, delta: number) => {
    dispatch(updateQuantity({ id, quantity: current + delta }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  return (
    <MainLayout>
      <div className="pt-32 pb-32 px-6 md:px-12 bg-sf-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 relative">
             <div className="absolute top-0 -left-12 w-32 h-32 bg-sf-primary/5 rounded-full blur-3xl pointer-events-none" />
             
             <div className="flex flex-col">
                <span className="text-sf-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">Your Selection</span>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-sf-text leading-[0.8]">
                   ATELIER <br /> BAG.
                </h1>
             </div>
             <p className="text-sf-text-muted text-lg max-w-sm leading-relaxed pb-2">
                Review your items before we prepare them for dispatch from our merchant network.
             </p>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-sf-surface rounded-3xl border border-sf-outline/10 shadow-sm">
               <div className="w-24 h-24 bg-sf-primary/5 rounded-full flex items-center justify-center text-sf-primary/20 mb-8 scale-150">
                  <ShoppingBag size={48} />
               </div>
               <h2 className="text-3xl font-black tracking-tight text-sf-text mb-4 uppercase">Your bag is empty</h2>
               <p className="text-sf-text-muted mb-12 uppercase tracking-widest text-[10px] font-bold">DISCOVER THE COLLECTIONS TO FIND SOMETHING SPECIAL</p>
               <Link 
                 to="/products" 
                 className="h-16 px-12 bg-sf-primary text-white rounded-2xl flex items-center gap-4 font-black text-xs tracking-[0.2em] shadow-2xl shadow-sf-primary/25 hover:bg-sf-primary/90 transition-all uppercase"
               >
                  EXPLORE ARCHIVES <ArrowRight size={18} />
               </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
               
               {/* Cart Items */}
               <div className="lg:col-span-2 flex flex-col gap-8">
                  <AnimatePresence>
                     {items.map((item) => (
                        <motion.div 
                           key={item.id}
                           layout
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: 20 }}
                           className="group flex flex-col md:flex-row gap-8 bg-white p-6 rounded-3xl border border-sf-outline/5 shadow-sm hover:shadow-xl transition-all"
                        >
                           <Link to={`/product/${item.id}`} className="w-full md:w-32 h-40 rounded-2xl overflow-hidden shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                           </Link>

                           <div className="flex-grow flex flex-col py-2">
                              <div className="flex justify-between items-start mb-4">
                                 <div>
                                    <h3 className="text-xl font-bold text-sf-text group-hover:text-sf-primary transition-colors mb-2 uppercase">{item.name}</h3>
                                    <p className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase">MERCHANT: PREMIUM SELLER</p>
                                 </div>
                                 <button 
                                   onClick={() => handleRemove(item.id)}
                                   className="w-10 h-10 rounded-full flex items-center justify-center text-sf-text-muted hover:bg-red-50 hover:text-red-500 transition-all"
                                 >
                                    <X size={20} />
                                 </button>
                              </div>

                              <div className="mt-auto flex justify-between items-end">
                                 <div className="flex items-center bg-sf-surface border border-sf-outline/10 rounded-xl p-1 gap-4 scale-90 -ml-2">
                                    <button 
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                      className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-sf-surface-low transition-colors"
                                    >
                                       <Minus size={14} />
                                    </button>
                                    <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                                    <button 
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                      className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-sf-surface-low transition-colors"
                                    >
                                       <Plus size={14} />
                                    </button>
                                 </div>

                                 <div className="flex flex-col items-end">
                                    <span className="text-xl font-black text-sf-text tracking-tighter">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                                    {item.discountPrice && <span className="text-[10px] text-sf-primary font-black uppercase">SAVED ₹{(item.price - item.discountPrice).toLocaleString() * item.quantity}</span>}
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
                  
                  <button 
                    onClick={() => dispatch(clearCart())}
                    className="self-start text-[10px] font-black tracking-[0.2em] text-sf-text-muted hover:text-red-500 transition-colors uppercase pt-8"
                  >
                    CLEAR ATELIER BAG
                  </button>
               </div>

               {/* Summary Sidebar */}
               <div className="lg:col-span-1">
                  <div className="bg-sf-surface rounded-3xl p-10 border border-sf-outline/10 shadow-sm sticky top-32">
                     <h2 className="text-2xl font-black tracking-tight mb-8 uppercase">Order Summary.</h2>
                     
                     <div className="space-y-6 mb-12">
                        <div className="flex justify-between items-center text-sm font-bold opacity-60 text-sf-text uppercase">
                           <span>SUBTOTAL ({totalQuantity} ITEMS)</span>
                           <span className="tracking-tighter">₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold opacity-60 text-sf-text uppercase">
                           <span>SHIPPING</span>
                           <span className="text-green-600">FREE</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold opacity-60 text-sf-text uppercase">
                           <span>EST. TAXES</span>
                           <span className="tracking-tighter">₹{(totalAmount * 0.12).toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-sf-outline/10" />
                        <div className="flex justify-between items-baseline pt-4">
                           <span className="text-lg font-black tracking-widest text-sf-text uppercase">TOTAL</span>
                           <span className="text-4xl font-black text-sf-primary tracking-tighter">₹{(totalAmount * 1.12).toLocaleString()}</span>
                        </div>
                     </div>

                     <button className="w-full h-18 bg-sf-primary text-white rounded-2xl flex items-center justify-center gap-4 font-black text-xs tracking-[0.2em] shadow-2xl shadow-sf-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase mb-12">
                        PROCEED TO CHECKOUT <CreditCard size={18} />
                     </button>

                     <div className="space-y-6 pt-10 border-t border-sf-outline/10">
                        <div className="flex items-center gap-4 group">
                           <div className="w-8 h-8 rounded-lg bg-sf-primary/5 flex items-center justify-center text-sf-primary"><Truck size={16} /></div>
                           <span className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase">EXPRESS DELIVERY ELIGIBLE</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                           <div className="w-8 h-8 rounded-lg bg-sf-primary/5 flex items-center justify-center text-sf-primary"><ShieldCheck size={16} /></div>
                           <span className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase">100% SECURE TRANSACTIONS</span>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
