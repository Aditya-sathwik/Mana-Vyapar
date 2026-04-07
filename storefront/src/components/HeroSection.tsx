import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart } from 'lucide-react';

interface HeroSectionProps {
  data?: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const title = data?.title || "REDEFINING INDIAN COMMERCE.";
  const subtitle = data?.subtitle || "Experience a premium, curated collection of local artisanship. We bring the soul of Bharat to your doorstep with modern elegance.";
  const buttonText = data?.buttonText || "DISCOVER MORE";

  return (
    <section className="relative w-full min-h-screen bg-sf-background flex items-center justify-center p-6 md:p-12 md:h-[120vh] overflow-hidden pt-24 md:pt-12">
      {/* Background Shapes */}
      <div className="absolute top-[10%] -left-[10%] w-[40vw] h-[40vw] bg-sf-primary/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-sf-accent/5 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        
        {/* Content Side */}
        <div className="flex flex-col justify-center items-start">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-2 px-4 rounded-full bg-sf-primary/10 border border-sf-primary/20 text-sf-primary text-[10px] font-black tracking-[0.2em] mb-8 uppercase">
              The Digital Atelier
            </span>
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter text-sf-text mb-8 leading-[0.9]">
              {title.includes(" ") ? (
                <>
                  {title.split(" ").slice(0, -1).join(" ")} <br />
                  <span className="text-sf-primary">{title.split(" ").slice(-1)}</span>
                </>
              ) : title}
            </h1>
            <p className="text-sf-text-muted text-lg max-w-md mb-12 leading-relaxed">
              {subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
              <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="group h-14 md:h-16 px-8 md:px-10 bg-sf-primary text-white rounded-2xl flex items-center gap-3 shadow-2xl shadow-sf-primary/25 sf-gradient border border-white/20 transition-all font-black text-sm tracking-widest uppercase overflow-hidden"
              >
                {buttonText}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <button className="h-14 md:h-16 px-6 md:px-8 rounded-2xl border border-sf-outline/20 text-sf-text font-black text-sm tracking-widest uppercase hover:bg-sf-surface hover:border-sf-primary transition-all flex items-center gap-3">
                VIEW COLLECTIONS
              </button>
            </div>
          </motion.div>

          <div className="mt-12 md:mt-20 flex gap-12 border-t border-sf-outline/10 pt-10 w-full opacity-60">
            <div>
              <p className="text-3xl font-black text-sf-text leading-none">12K+</p>
              <p className="text-[10px] font-bold tracking-widest text-sf-text-muted mt-2">ACTIVE MERCHANTS</p>
            </div>
            <div>
              <p className="text-3xl font-black text-sf-text leading-none">4.9/5</p>
              <p className="text-[10px] font-bold tracking-widest text-sf-text-muted mt-2">CUSTOMER TRUST</p>
            </div>
          </div>
        </div>

        {/* Visual Side */}
        <div className="relative h-full flex items-center justify-center pt-24 md:pt-0">
          <motion.div 
            initial={{ scale: 1.2, opacity: 0, rotate: 10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-full h-[60vh] md:w-full md:h-[90%]"
          >
            {/* Main Product Frame */}
            <div className="absolute inset-0 bg-sf-surface rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden p-4 group">
               <img 
                 src={data?.backgroundImage || "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1412"} 
                 alt="Featured Collection" 
                 className="w-full h-full object-cover rounded-2xl transition-transform duration-1000 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-sf-primary/40 to-transparent pointer-events-none" />
            </div>

            {/* Floating Tags */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-6 -right-6 md:-top-10 md:-right-10 bg-white p-4 md:p-6 rounded-2xl shadow-2xl border border-sf-outline/10 z-20 flex flex-col gap-2 max-w-[140px] md:max-w-[200px]"
            >
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-sf-text-muted uppercase">TRENDING NOW</span>
              </div>
              <p className="font-bold text-sm leading-tight text-sf-text">Handcrafted Leather Collective</p>
              <p className="text-sf-primary font-black text-lg">₹4,999</p>
              <button className="mt-2 w-full h-10 bg-sf-text text-white rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest hover:bg-sf-primary transition-colors">
                <ShoppingCart size={14} /> ADD TO CART
              </button>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute -bottom-12 -left-6 md:-bottom-12 md:-left-12 glass p-4 md:p-8 rounded-3xl shadow-2xl z-20 hidden sm:flex items-center gap-6 max-w-sm"
            >
               <div className="w-16 h-16 rounded-2xl bg-sf-primary/10 flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
               </div>
               <div>
                  <p className="text-xs italic text-sf-text-muted mb-1">"The best shopping experience I've had in years. Truly premium."</p>
                  <p className="text-[10px] font-black tracking-widest text-sf-text uppercase">— ARJUN VERMA, MUMBAI</p>
               </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
