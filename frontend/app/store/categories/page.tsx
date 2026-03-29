'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCategoriesByStoreId } from '@/redux/slices/categorySlice';
import { Search, SlidersHorizontal, ArrowUpRight, Leaf, BookOpen, Palette, Wind, PackageOpen } from 'lucide-react';
import { FadeIn, SlideUp } from '@/components/storefront/ui/MotionComponents';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const slug = (params?.slug as string) || "mana-store";
  
  const { currentStore } = useAppSelector((state) => state.store);
  const { items: categories, status } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (currentStore?._id && status === 'idle') {
      dispatch(fetchCategoriesByStoreId(currentStore._id));
    }
  }, [currentStore, status, dispatch]);

  const bentoIcons = [Leaf, BookOpen, Palette, Wind];

  const displayCategories = categories.length > 0 
    ? categories 
    : [
        { _id: 'c1', name: 'Artisan Handicrafts', description: 'Traditional skills meeting modern design. Explore textiles, pottery, and woodwork.', image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200" },
        { _id: 'c2', name: 'Gourmet Pantry', description: 'Pure ingredients and family recipes straight from the farm.', image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800" },
        { _id: 'c3', name: 'Ethical Fashion', description: 'Conscious apparel that honors the maker and the planet.', image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800" },
        { _id: 'c4', name: 'Sustainable Decor', description: 'Elevate your living space with items that tell a story.', image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200" },
      ];
  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute top-[20%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[150px]" />

      <div className="container mx-auto max-w-7xl px-4 pt-24 sm:px-6 md:pt-32">
      {/* Hero Section */}
      <header className="mb-20 flex flex-col items-center text-center">
        <SlideUp>
          <span className="text-xs uppercase tracking-widest text-primary font-semibold mb-4 block">Curated Markets</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tighter leading-tight mb-6 text-foreground max-w-3xl drop-shadow-sm">
            Explore the <span className="text-primary italic">Handcrafted</span> Heart of our Community
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-body mx-auto">
            Connect directly with local artisans and merchants. Discover unique collections curated specifically for Mana Vyapar's diverse marketplace.
          </p>
        </SlideUp>
      </header>

      {/* Search & Filter Bar */}
      <FadeIn delay={0.2}>
        <div className="mb-16 bg-muted rounded-3xl p-4 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center border border-border/50">
          <div className="relative w-full flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              className="w-full bg-background border-none rounded-2xl py-4 pl-12 pr-6 text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg shadow-sm" 
              placeholder="Find a category or local specialty..." 
              type="text"
            />
          </div>
          <button className="flex items-center gap-2 px-8 py-4 bg-background text-foreground font-semibold rounded-2xl hover:bg-muted-foreground/10 transition-colors border border-border/50 shadow-sm shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>
      </FadeIn>

      {/* Categories Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
        {displayCategories.map((cat, idx) => {
          const isLarge = idx % 3 === 0;
          const Icon = bentoIcons[idx % bentoIcons.length];
          
          return (
            <div key={cat._id} className={cn("group cursor-pointer", isLarge ? "md:col-span-8" : "md:col-span-4")}>
              <SlideUp delay={idx * 0.1}>
                <Link href={`/store/categories/${cat._id}`}>
                  <div className={cn(
                    "relative rounded-[2.5rem] overflow-hidden bg-card border border-border/50 transition-all duration-500 xl:hover:shadow-2xl xl:hover:-translate-y-2",
                    isLarge ? "h-[450px]" : "h-[450px]"
                  )}>
                    <Image 
                      fill
                      alt={cat.name} 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      src={cat.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800"}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 sm:p-10 w-full z-10">
                      <div className="flex justify-between items-end gap-4">
                        <div className="max-w-md">
                          {idx === 0 && <span className="bg-primary text-primary-foreground text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold mb-4 inline-block shadow-lg shadow-primary/20">Trending</span>}
                          <h3 className={cn("font-display font-bold text-white mb-3 tracking-tight", isLarge ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl")}>{cat.name}</h3>
                          <p className="text-white/80 font-body text-sm sm:text-lg leading-relaxed line-clamp-2">{cat.description}</p>
                        </div>
                        <span className="hidden sm:flex bg-white/20 backdrop-blur-md text-white p-3 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-lg">
                          <ArrowUpRight className="w-6 h-6" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SlideUp>
            </div>
          );
        })}
      </div>

      {/* Subtle "No-Line" Zones: Secondary Categories */}
      <section className="bg-card rounded-[3rem] px-8 py-16 md:px-12 md:py-20 mb-24 border border-border shadow-sm">
        <SlideUp>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight mb-2 text-foreground">Niche Collections</h2>
              <p className="text-muted-foreground text-lg">Specialized categories for the curious collector.</p>
            </div>
            <button className="text-primary font-bold flex items-center gap-2 group hover:underline underline-offset-4">
              View All Categories 
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>
        </SlideUp>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Niche Card 1 */}
          <SlideUp delay={0.1}>
            <div className="bg-background cursor-pointer p-8 rounded-3xl hover:shadow-xl transition-all duration-300 group border border-border/50 h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-inner">
                <Leaf className="w-7 h-7" />
              </div>
              <h4 className="font-display text-xl font-bold mb-3 text-foreground tracking-tight">Natural Wellness</h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">Herbal blends, essential oils, and organic skincare from the highlands.</p>
              <span className="text-primary font-bold text-sm tracking-wide group-hover:underline underline-offset-4 decoration-2">Explore Collection</span>
            </div>
          </SlideUp>

          {/* Niche Card 2 */}
          <SlideUp delay={0.2}>
            <div className="bg-background cursor-pointer p-8 rounded-3xl hover:shadow-xl transition-all duration-300 group border border-border/50 h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="font-display text-xl font-bold mb-3 text-foreground tracking-tight">Local Literature</h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">Regional poetry, folklore, and independent publications from local authors.</p>
              <span className="text-primary font-bold text-sm tracking-wide group-hover:underline underline-offset-4 decoration-2">Explore Collection</span>
            </div>
          </SlideUp>

          {/* Niche Card 3 */}
          <SlideUp delay={0.3}>
            <div className="bg-background cursor-pointer p-8 rounded-3xl hover:shadow-xl transition-all duration-300 group border border-border/50 h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-inner">
                <Palette className="w-7 h-7" />
              </div>
              <h4 className="font-display text-xl font-bold mb-3 text-foreground tracking-tight">Original Art</h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">Paintings, sketches, and digital art from emerging regional creators.</p>
              <span className="text-primary font-bold text-sm tracking-wide group-hover:underline underline-offset-4 decoration-2">Explore Collection</span>
            </div>
          </SlideUp>

          {/* Niche Card 4 */}
          <SlideUp delay={0.4}>
            <div className="bg-background cursor-pointer p-8 rounded-3xl hover:shadow-xl transition-all duration-300 group border border-border/50 h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-inner">
                <Wind className="w-7 h-7" />
              </div>
              <h4 className="font-display text-xl font-bold mb-3 text-foreground tracking-tight">Eco Lifestyle</h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">Biodegradable home essentials and low-waste everyday solutions.</p>
              <span className="text-primary font-bold text-sm tracking-wide group-hover:underline underline-offset-4 decoration-2">Explore Collection</span>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* CTA Section */}
      <SlideUp delay={0.2} className="relative rounded-[3rem] overflow-hidden bg-primary p-12 md:p-16 text-center text-primary-foreground mb-16 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-display text-4xl font-bold mb-6 tracking-tight">Are you a Local Merchant?</h2>
          <p className="text-primary-foreground/90 text-lg md:text-xl mb-10 leading-relaxed font-medium">
            Join thousands of artisans and small businesses reaching conscious shoppers in your region. List your products and tell your unique story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-background text-primary px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:bg-muted transition-all active:scale-95 shadow-xl shadow-black/10 tracking-widest uppercase text-sm">
              Start Selling
            </button>
            <button className="bg-primary-foreground/10 backdrop-blur-md text-primary-foreground px-10 py-4 rounded-2xl font-bold text-lg border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all active:scale-95 tracking-widest uppercase text-sm">
              Learn More
            </button>
          </div>
        </div>
      </SlideUp>
      </div>
    </div>
  );
}
