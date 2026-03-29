'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, ArrowUpRight, Leaf, BookOpen, Palette, Wind } from 'lucide-react';
import { FadeIn, SlideUp } from '@/components/storefront/ui/MotionComponents';

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-12 md:py-16 max-w-7xl">
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
        {/* Category Card: Large (Handicrafts) */}
        <div className="md:col-span-8 group cursor-pointer">
          <SlideUp delay={0.1}>
            <div className="relative h-[480px] rounded-[2.5rem] overflow-hidden bg-card border border-border/50 transition-all duration-500 xl:hover:shadow-2xl xl:hover:-translate-y-2">
              <Image 
                fill
                alt="Artisan Pottery" 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200&auto=format&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10 w-full z-10">
                <div className="flex justify-between items-end">
                  <div className="max-w-md">
                    <span className="bg-primary text-primary-foreground text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold mb-4 inline-block shadow-lg shadow-primary/20">Trending</span>
                    <h3 className="font-display text-4xl font-bold text-white mb-3 tracking-tight">Artisan Handicrafts</h3>
                    <p className="text-white/80 font-body text-lg leading-relaxed">Traditional skills meeting modern design. Explore textiles, pottery, and woodwork from local masters.</p>
                  </div>
                  <span className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-lg shadow-primary/10">
                    <ArrowUpRight className="w-8 h-8" />
                  </span>
                </div>
              </div>
            </div>
          </SlideUp>
        </div>

        {/* Category Card: Small (Gourmet) */}
        <div className="md:col-span-4 group cursor-pointer">
          <SlideUp delay={0.2}>
            <div className="relative h-[480px] rounded-[2.5rem] overflow-hidden bg-card border border-border/50 transition-all duration-500 xl:hover:shadow-2xl xl:hover:-translate-y-2">
              <Image 
                fill
                alt="Local Food" 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10 z-10">
                <h3 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">Gourmet Pantry</h3>
                <p className="text-white/80 font-body leading-relaxed">Pure ingredients and family recipes straight from the farm to your table.</p>
              </div>
            </div>
          </SlideUp>
        </div>

        {/* Category Card: Medium (Fashion) */}
        <div className="md:col-span-4 group cursor-pointer">
          <SlideUp delay={0.3}>
            <div className="relative h-[380px] rounded-[2.5rem] overflow-hidden bg-card border border-border/50 transition-all duration-500 xl:hover:shadow-2xl xl:hover:-translate-y-2">
              <Image 
                fill
                alt="Sustainable Fashion" 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 z-10">
                <h3 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">Ethical Fashion</h3>
                <p className="text-white/80 font-body leading-relaxed">Conscious apparel that honors the maker and the planet.</p>
              </div>
            </div>
          </SlideUp>
        </div>

        {/* Category Card: Wide (Decor) */}
        <div className="md:col-span-8 group cursor-pointer">
          <SlideUp delay={0.4}>
            <div className="relative h-[380px] rounded-[2.5rem] overflow-hidden bg-card border border-border/50 transition-all duration-500 xl:hover:shadow-2xl xl:hover:-translate-y-2">
              <Image 
                fill
                alt="Home Decor" 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10 z-10">
                <h3 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">Sustainable Home Decor</h3>
                <p className="text-white/80 text-lg font-body leading-relaxed max-w-md">Elevate your living space with items that tell a story of heritage and home.</p>
              </div>
            </div>
          </SlideUp>
        </div>
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
  );
}
