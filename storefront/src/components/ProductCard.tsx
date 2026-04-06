import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    image: string;
    category: string;
    rating: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity: 1,
      image: product.image
    }));
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative flex flex-col bg-sf-surface rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-sf-primary/5 transition-all duration-500 border border-sf-outline/5"
    >
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="relative block h-72 w-full overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-sf-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.discountPrice && (
            <span className="bg-sf-primary text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-full shadow-lg shadow-sf-primary/20 uppercase">
              SALE
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-sf-text opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl border border-white/20 hover:bg-sf-primary hover:text-white">
          <Heart size={18} strokeWidth={1.5} />
        </button>

        {/* Add to Cart Hover Overlay */}
        <div className="absolute bottom-4 inset-x-4 z-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
           <button 
             onClick={handleAddToCart}
             className="w-full h-12 bg-white backdrop-blur-3xl text-sf-text font-black text-[10px] tracking-widest shadow-xl rounded-xl flex items-center justify-center gap-2 hover:bg-sf-primary hover:text-white transition-all uppercase"
           >
              <ShoppingCart size={16} /> QUICK ADD
           </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black tracking-[0.2em] text-sf-text-muted uppercase leading-none">{product.category}</span>
          <div className="flex items-center gap-1">
             <Star size={10} className="fill-sf-primary text-sf-primary" />
             <span className="text-[10px] font-bold text-sf-text leading-none">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`} className="block mb-4">
          <h3 className="font-bold text-lg text-sf-text leading-tight group-hover:text-sf-primary transition-colors">{product.name}</h3>
        </Link>
        
        <div className="mt-auto flex items-baseline gap-3">
          {product.discountPrice ? (
            <>
              <span className="text-xl font-black text-sf-text tracking-tighter">₹{product.discountPrice.toLocaleString()}</span>
              <span className="text-xs text-sf-text-muted line-through opacity-50">₹{product.price.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-xl font-black text-sf-text tracking-tighter">₹{product.price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
