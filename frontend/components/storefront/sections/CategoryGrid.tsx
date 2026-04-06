import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function CategoryGrid({ data }: { data: any }) {
  const { title, categories } = data;
  
  // Use provided categories or default mocks
  const displayCategories = categories || [
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80', slug: 'fashion' },
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80', slug: 'electronics' },
    { name: 'Groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80', slug: 'groceries' },
    { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80', slug: 'home-decor' },
  ];

  return (
    <section className="sf-section mt-20">
      <div className="sf-container">
        <h2 className="text-4xl md:text-5xl font-black text-foreground italic uppercase tracking-tighter mb-16 leading-none">
          {title || "Shop By Department"}
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {displayCategories.map((cat: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="sf-card group !p-0 aspect-[4/5] !rounded-[32px] cursor-pointer shadow-premium border border-white/5"
            >
              <Image 
                src={cat.image} 
                alt={cat.name} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 opacity-80 group-hover:opacity-60" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center pb-12">
                <div className="sf-glass py-3 px-6 transform transition-all duration-500 group-hover:-translate-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
