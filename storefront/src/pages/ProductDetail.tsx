import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../features/productSlice';
import { addToCart } from '../features/cartSlice';
import type { AppDispatch, RootState } from '../store';
import MainLayout from '../layouts/MainLayout';
import { ShoppingCart, Heart, Shield, RotateCcw, Truck, Star, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProduct, loading, error } = useSelector((state: RootState) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        discountPrice: selectedProduct.discountPrice,
        quantity: quantity,
        image: selectedProduct.images[0]
      }));
    }
  };

  if (loading) return <MainLayout><div className="pt-32 min-h-screen bg-sf-background flex justify-center items-center"><div className="w-12 h-12 border-4 border-sf-primary border-t-transparent rounded-full animate-spin"></div></div></MainLayout>;
  if (error || !selectedProduct) return <MainLayout><div className="pt-32 min-h-screen bg-sf-background flex flex-col justify-center items-center"><h2 className="text-4xl font-black mb-6 uppercase">Product Not Found</h2><Link to="/products" className="text-sf-primary font-bold">RETURN TO ARCHIVE</Link></div></MainLayout>;

  return (
    <MainLayout>
      <div className="pt-32 pb-32 px-6 md:px-12 bg-sf-background">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
            
            {/* Visual Section */}
            <div className="flex flex-col gap-8">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
                 <img 
                    src={selectedProduct.images[activeImage]} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover transition-transform duration-1000 transform scale-100"
                 />
                 <div className="absolute top-6 left-6 flex flex-col gap-3">
                   {selectedProduct.discountPrice && (
                     <span className="bg-sf-primary text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg uppercase">
                       SEASONAL OFFER
                     </span>
                   )}
                 </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                 {selectedProduct.images.length > 1 && selectedProduct.images.map((img, i) => (
                    <button 
                       key={i}
                       onClick={() => setActiveImage(i)}
                       className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === i ? 'border-sf-primary ring-4 ring-sf-primary/10' : 'border-white hover:border-sf-primary/30'}`}
                    >
                       <img src={img} alt={`${selectedProduct.name} thumbnail ${i}`} className="w-full h-full object-cover" />
                    </button>
                 ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col pt-4">
              <div className="flex items-center gap-4 mb-4">
                 <span className="text-sf-primary text-[10px] font-black tracking-[0.3em] uppercase leading-none">{selectedProduct.category}</span>
                 <div className="h-px w-8 bg-sf-outline/20" />
                 <div className="flex items-center gap-1">
                    <Star size={12} className="fill-sf-primary text-sf-primary" />
                    <span className="text-[10px] font-bold text-sf-text">{selectedProduct.rating} (52 REVIEWS)</span>
                 </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-sf-text mb-8 leading-[0.9]">
                 {selectedProduct.name.toUpperCase()}
              </h1>

              <div className="flex items-baseline gap-4 mb-12">
                 {selectedProduct.discountPrice ? (
                   <>
                     <span className="text-5xl font-black text-sf-text tracking-tighter">₹{selectedProduct.discountPrice.toLocaleString()}</span>
                     <span className="text-xl text-sf-text-muted line-through opacity-40">₹{selectedProduct.price.toLocaleString()}</span>
                     <span className="ml-4 text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full">{Math.round((1 - selectedProduct.discountPrice / selectedProduct.price) * 100)}% OFF</span>
                   </>
                 ) : (
                   <span className="text-5xl font-black text-sf-text tracking-tighter">₹{selectedProduct.price.toLocaleString()}</span>
                 )}
              </div>

              <p className="text-sf-text-muted text-lg leading-relaxed mb-16 max-w-xl">
                 {selectedProduct.description}
              </p>

              {/* Purchase Actions */}
              <div className="flex flex-col gap-8 mb-20">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center bg-sf-surface border border-sf-outline/10 rounded-2xl p-2 gap-4">
                       <button 
                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
                         className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-sf-surface-low transition-colors"
                       >
                          <Minus size={18} />
                       </button>
                       <span className="text-lg font-black w-8 text-center">{quantity}</span>
                       <button 
                         onClick={() => setQuantity(quantity + 1)}
                         className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-sf-surface-low transition-colors"
                       >
                          <Plus size={18} />
                       </button>
                    </div>

                    <button 
                      onClick={handleAddToCart}
                      className="flex-grow h-16 bg-sf-text text-white rounded-2xl flex items-center justify-center gap-4 font-black text-xs tracking-[0.2em] shadow-2xl hover:bg-sf-primary transition-all uppercase"
                    >
                       <ShoppingCart size={20} /> ADD TO ATELIER BAG
                    </button>
                 </div>

                 <button className="h-16 w-full rounded-2xl border-2 border-sf-text text-sf-text font-black text-xs tracking-[0.2em] uppercase hover:bg-sf-text hover:text-white transition-all">
                    BUY NOW SECURELY
                 </button>
              </div>

              {/* USP List */}
              <div className="grid grid-cols-2 gap-8 border-t border-sf-outline/10 pt-12">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sf-primary/5 flex items-center justify-center text-sf-primary shrink-0">
                       <Truck size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase mb-1">Fast Delivery</p>
                       <p className="text-[10px] font-bold text-sf-text-muted uppercase tracking-wider">3-5 DAYS</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sf-primary/5 flex items-center justify-center text-sf-primary shrink-0">
                       <Shield size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase mb-1">Authentic Quality</p>
                       <p className="text-[10px] font-bold text-sf-text-muted uppercase tracking-wider">VERIFIED MERCHANT</p>
                    </div>
                 </div>
              </div>
            </div>

          </div>

          {/* Related Products Section */}
          <div className="mt-48">
             <div className="flex items-center gap-8 mb-16">
                 <h2 className="text-3xl md:text-5xl font-black tracking-tighter">YOU MAY ALSO <br /> ENJOY.</h2>
                 <div className="flex-grow h-px bg-sf-outline/10" />
             </div>
             {/* Related products can be rendered here similar to home grid */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
