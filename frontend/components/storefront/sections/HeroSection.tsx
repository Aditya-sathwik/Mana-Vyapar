'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function HeroSection({ data }: { data: any }) {
  const { title, subtitle, imageUrl, backgroundImage, buttonText, buttonLink, alignment, padding } = data;
  const finalImageUrl = imageUrl || backgroundImage;

  // Alignment Mapping
  const alignClass = alignment === 'left' ? 'text-left items-start' : alignment === 'right' ? 'text-right items-end' : 'text-center items-center mx-auto';
  const containerAlign = alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center';

  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden">
      {/* Edge-to-edge Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={finalImageUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80'}
          alt={title || ""}
          fill
          className="object-cover transition-transform duration-[4s] group-hover:scale-110 ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/20 z-0" /> {/* Subtle base darkening for readability */}
      </div>

      <div className="relative z-20 w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className={cn("flex flex-col", alignClass)}
          >
            <div className="mb-10 p-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full flex items-center gap-4 w-fit shadow-2xl">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
              CURATED EXPERIENCE V3
            </div>

            <h1 className="text-6xl md:text-[100px] font-black mb-10 text-white tracking-[base] md:tracking-[-0.04em] leading-[0.85] sf-text-shadow">
              {title || "Unrivaled Craftsmanship."}
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-3xl font-medium leading-relaxed sf-text-shadow opacity-95">
              {subtitle || "Digitally engineered for the next era of commerce. Explore our high-spec hardware and curated retail experience."}
            </p>

            <div className={cn("flex gap-8", containerAlign)}>
              <motion.a
                href={buttonLink || '#'}
                style={{ backgroundColor: `var(--sf-accent, #10b981)` }}
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="sf-btn-premium text-lg px-14 py-7 !rounded-[32px] uppercase tracking-[0.2em] font-black"
              >
                {buttonText || "Explore Collection"}
                <ArrowRight size={24} strokeWidth={3} className="ml-3 group-hover:translate-x-3 transition-transform" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cinematic Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 animate-bounce cursor-pointer">
        <span className="text-[10px] font-black uppercase tracking-widest text-white">Scroll</span>
        <div className="h-12 w-[2px] bg-white rounded-full" />
      </div>
    </section>
  );
}
