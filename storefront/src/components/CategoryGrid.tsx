import React from 'react';
import { motion } from 'framer-motion';

interface CategoryGridProps {
  data: any;
  theme?: any;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ data, theme }) => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-12 bg-sf-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase mb-4" style={{ color: theme?.primaryColor || 'var(--sf-primary)' }}>Curated Departments</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-sf-text leading-[0.9]">
              {data.title || "SHOP BY CATEGORY"}
            </h2>
          </div>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-12 hide-scrollbar snap-x snap-mandatory">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center gap-6 snap-center min-w-[150px] group"
            >
              <div className="h-32 w-32 rounded-full glass border border-sf-outline flex items-center justify-center relative overflow-hidden shadow-2xl transition-all group-hover:scale-105 group-hover:border-sf-primary/30" style={{ borderColor: `${theme?.primaryColor}20` || 'var(--sf-outline)' }}>
                <div className="absolute inset-0 bg-gradient-to-tr from-sf-surface-low to-sf-surface opacity-60" />
                <div className="h-20 w-20 rounded-full blur-xl group-hover:blur-2xl transition-all" style={{ backgroundColor: `${theme?.primaryColor}10` || 'var(--sf-primary-container)' }} />
                <div className="relative text-sf-text-muted z-10 text-[10px] font-black tracking-widest uppercase">Cat-{id}</div>
                
                <div className="absolute inset-0 border-r-2 rounded-full animate-spin [animation-duration:8s]" style={{ borderRightColor: theme?.primaryColor || 'var(--sf-primary)' }} />
              </div>
              <span className="text-xs font-black text-sf-text uppercase tracking-widest opacity-80 whitespace-nowrap group-hover:text-sf-primary transition-colors" style={{ '--hover-color': theme?.primaryColor } as any}>Collection {id}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `${theme?.primaryColor}05` || 'var(--sf-primary-container)' }} />
    </section>
  );
};

export default CategoryGrid;
