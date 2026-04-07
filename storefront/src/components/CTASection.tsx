import React from 'react';
import { motion } from 'framer-motion';

interface CTASectionProps {
  data: any;
  theme?: any;
}

const CTASection: React.FC<CTASectionProps> = ({ data, theme }) => {
  return (
    <section className="py-24 px-6 md:px-12 bg-sf-background relative border-y border-sf-outline/10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-sf-text mb-12 italic leading-[0.9]">
          {data.title || "Join the Vyapar Revolution"}
        </h2>
        <button 
          className="h-20 px-16 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-[0.2em] text-white shadow-2xl transition-all mx-auto hover:scale-105 active:scale-95 sf-gradient border border-white/20"
          style={{
            backgroundColor: theme?.accentColor,
            borderRadius: theme?.borderRadius === 'pill' ? '9999px' : theme?.borderRadius === 'sharp' ? '0px' : '1rem'
          }}
        >
          {data.buttonText || "Get Started"}
        </button>
      </motion.div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-sf-primary/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};

export default CTASection;
