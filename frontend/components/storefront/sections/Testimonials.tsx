'use client';

import { motion } from 'framer-motion';
import { Star, MessageCircle, User, Quote } from 'lucide-react';
import Image from 'next/image';

export default function Testimonials({ data }: { data: any }) {
  const { title, testimonials } = data;
  
  const displayTestimonials = testimonials || [
    { name: 'Aditya Sathwik', review: 'One of the best shopping experiences I had. Premium products with lightning-fast delivery across the retail heartland.', rating: 5, avatar: 'https://i.pravatar.cc/150?u=aditya' },
    { name: 'Sathwik Kumar', review: 'The dynamic curation here is simply top-notch. Love how personalized everything feels for my local needs.', rating: 5, avatar: 'https://i.pravatar.cc/150?u=sathwik' },
    { name: 'Praveen Raju', review: 'Secured identity and verified merchants. Mana-Vyapar infrastructure makes everyday shopping extremely reliable.', rating: 4, avatar: 'https://i.pravatar.cc/150?u=praveen' },
  ];

  return (
    <section className="py-32 px-6 bg-background px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 blur-[200px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-20 leading-none">
          {title || "Customer Voices"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {displayTestimonials.map((test: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-12 bg-card border border-border rounded-[48px] hover:bg-card/80 hover:border-border transition-all shadow-premium shadow-black/10 border border-border/50 cursor-default group"
            >
              <div className="absolute -top-6 -left-6 p-5 bg-card border border-border rounded-[32px] text-primary shadow-xl shadow-black/10 group-hover:rotate-12 transition-transform">
                <Quote size={32} fill="currentColor" className="opacity-20 translate-x-1" />
              </div>

              <div className="flex gap-1.5 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < test.rating ? "text-amber-400 fill-amber-400" : "text-muted"} 
                  />
                ))}
              </div>

              <p className="text-xl md:text-2xl text-muted-foreground font-medium italic mb-10 leading-relaxed group-hover:text-foreground transition-colors">
                "{test.review}"
              </p>

              <div className="flex items-center gap-6 pt-10 border-t border-border mt-auto">
                <div className="w-16 h-16 rounded-[24px] bg-muted/50 border border-border p-1 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                  {test.avatar && <Image src={test.avatar} alt={test.name} width={64} height={64} className="rounded-[20px]" />}
                </div>
                <div>
                   <h4 className="text-sm font-black text-foreground uppercase tracking-widest">{test.name}</h4>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verified Customer</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
