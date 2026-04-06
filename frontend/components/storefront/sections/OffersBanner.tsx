'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function OffersBanner({ data }: { data: any }) {
  const { title, subtitle, imageUrl, buttonText, buttonLink, alignment } = data;

  const alignClass = alignment === 'center' ? 'items-center text-center mx-auto' : alignment === 'right' ? 'items-end text-right ml-auto' : 'items-start text-left';
  
  return (
    <section className="sf-section">
      <div className="sf-container">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          style={{ 
            background: `linear-gradient(135deg, var(--sf-accent, #10b981), #059669)` 
          }}
          className="relative p-10 md:p-20 rounded-[32px] overflow-hidden shadow-2xl group cursor-pointer"
        >
          {/* Animated Background Element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110" />
          
          <div className={cn("relative z-10 flex flex-col max-w-2xl", alignClass)}>
            <div className="mb-6 py-2 px-4 bg-black/20 backdrop-blur-md text-white text-[10px] font-black tracking-[0.2em] rounded-full inline-flex items-center gap-3">
                <TrendingUp size={14} strokeWidth={3} />
                EXCLUSIVE DEALS
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight sf-text-shadow">
              {title || "Unlock Your Premium Offer"}
            </h2>
            <p className="text-lg md:text-xl text-white/90 font-medium mb-12 leading-relaxed opacity-90 sf-text-shadow">
              {subtitle || "Join our community of elite members and get access to early drops and curated hardware savings."}
            </p>
            
            <Link 
              href={buttonLink || '#'}
              className="sf-btn-premium !bg-white !text-black !px-10 !py-5 text-sm uppercase tracking-[0.2em] font-black shadow-2xl hover:!scale-110"
            >
              <span className="flex items-center gap-4">
                {buttonText || "Shop Collection"}
                <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Decorative Image */}
          {imageUrl && (
            <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:block opacity-40 mix-blend-overlay">
                <Image src={imageUrl} alt="" fill className="object-cover" />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
