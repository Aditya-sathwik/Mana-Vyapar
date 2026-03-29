'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hero3DScene } from '@/components/storefront/Hero3DScene';
import { ProductCard } from '@/components/storefront/ui/ProductCard';
import { Button } from '@/components/storefront/ui/Button';
import { FadeIn, SlideUp } from '@/components/storefront/ui/MotionComponents';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProductsByStoreSlug } from '@/redux/slices/productSlice';
import { fetchCategoriesByStoreId } from '@/redux/slices/categorySlice';
import { ArrowRight, Truck, ShieldCheck, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';

import { fetchStoreBySlug } from '@/redux/slices/storeSlice';
import { useAuth } from '@/context/auth-context';
import { useParams } from 'next/navigation';

export default function StoreHome() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const { items: products, status } = useAppSelector((state) => state.products);
  const { items: categories, status: catStatus } = useAppSelector((state) => state.categories);
  const { currentStore, status: storeStatus } = useAppSelector((state) => state.store);
  
  // For the generic /store route, we might want a default or derived slug
  // For now let's use a default if not in a [slug] route
  const slug = (params?.slug as string) || "mana-store"; 

  const bannersList = [
    { id: 1, title: 'Summer Collection', sub: 'Up to 50% Off on apparel', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop', cta: 'Shop Summer' },
    { id: 2, title: 'New Arrivals', sub: 'Discover the latest trends in jewelry', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop', cta: 'Explore Now' },
    { id: 3, title: 'Festive Season Sale', sub: 'Extra 10% off on premium collections', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop', cta: 'Claim Offer' },
  ];

  // Use dynamic categories if available, else fallback
  const displayCategories = categories?.length 
    ? categories.slice(0, 4).map(c => ({ 
        id: c._id, 
        name: c.name, 
        desc: c.description, 
        img: c.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800' 
      }))
    : [
        { id: 'c1', name: 'Premium Clothing', desc: 'Sarees, Kurtas & more', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop' },
        { id: 'c2', name: 'Fine Jewelry', desc: 'Necklaces, Earrings & Sets', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop' },
        { id: 'c3', name: 'Home Living', desc: 'Decor & Furniture', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop' },
        { id: 'c4', name: 'Accessories', desc: 'Bags, Watches & Sunglasses', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop' },
      ];

  useEffect(() => {
    if (storeStatus === 'idle') {
      dispatch(fetchStoreBySlug(slug));
    }
    if (status === 'idle') {
      dispatch(fetchProductsByStoreSlug(slug));
    }
  }, [status, storeStatus, dispatch, slug]);

  useEffect(() => {
    if (currentStore?._id && catStatus === 'idle') {
      dispatch(fetchCategoriesByStoreId(currentStore._id));
    }
  }, [currentStore, catStatus, dispatch]);

  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const bannersRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);

  // Use dynamic banners if available, else fallback
  const displayBanners = currentStore?.corouselImages?.length 
    ? currentStore.corouselImages.map((b, i) => ({ id: i, title: b.title, sub: b.subtitle, img: b.url, cta: 'Shop Now' }))
    : [
        { id: 1, title: 'Summer Collection', sub: 'Up to 50% Off on apparel', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop', cta: 'Shop Summer' },
        { id: 2, title: 'New Arrivals', sub: 'Discover the latest trends in jewelry', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop', cta: 'Explore Now' },
        { id: 3, title: 'Festive Season Sale', sub: 'Extra 10% off on premium collections', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop', cta: 'Claim Offer' },
      ];

  const handleScrollUpdate = (ref: React.RefObject<HTMLDivElement | null>, setter: React.Dispatch<React.SetStateAction<number>>) => {
    if (!ref.current) return;
    const firstChild = ref.current.firstElementChild as HTMLElement;
    const scrollBy = firstChild ? firstChild.clientWidth + 24 : ref.current.clientWidth;
    setter(Math.round(ref.current.scrollLeft / scrollBy));
  };

  const scrollToIdx = (ref: React.RefObject<HTMLDivElement | null>, idx: number) => {
    if (!ref.current) return;
    const firstChild = ref.current.firstElementChild as HTMLElement;
    const scrollBy = firstChild ? firstChild.clientWidth + 24 : ref.current.clientWidth;
    ref.current.scrollTo({ left: scrollBy * idx, behavior: 'smooth' });
  };

  const manualScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'prev' | 'next') => {
    if (!ref.current) return;
    const firstChild = ref.current.firstElementChild as HTMLElement;
    const scrollBy = firstChild ? firstChild.clientWidth + 24 : ref.current.clientWidth;
    const currentLeft = ref.current.scrollLeft;
    ref.current.scrollTo({ left: direction === 'next' ? currentLeft + scrollBy : currentLeft - scrollBy, behavior: 'smooth' });
  };

  // Auto-scroll logic arrays
  useEffect(() => {
    const interval = setInterval(() => {
      [bannersRef, categoriesRef].forEach((ref) => {
        if (ref.current) {
          const { scrollLeft, scrollWidth, clientWidth } = ref.current;
          if (scrollLeft >= scrollWidth - clientWidth - 10) {
            ref.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            const firstChild = ref.current.firstElementChild as HTMLElement;
            const scrollBy = firstChild ? firstChild.clientWidth + 24 : clientWidth; 
            ref.current.scrollTo({ left: scrollLeft + scrollBy, behavior: 'smooth' });
          }
        }
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <Truck className="h-6 w-6 text-primary" />, title: 'Free Delivery', desc: 'On orders over ₹999' },
    { icon: <ShieldCheck className="h-6 w-6 text-primary" />, title: '100% Secure', desc: 'Safe & secure payments' },
    { icon: <RefreshCcw className="h-6 w-6 text-primary" />, title: 'Easy Returns', desc: '14-day return policy' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24 md:pb-0">
      {/* 1. 3D Hero Section */}
      <section className="relative flex min-h-[90vh] sm:min-h-screen w-full items-center justify-center overflow-hidden">
        <Hero3DScene />
        
        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 pointer-events-none">
          <SlideUp duration={0.8}>
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-md mb-6 border border-primary/20">
              Welcome to Mana Store
            </span>
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl drop-shadow-sm">
              {currentStore?.name || "Premium Shopping"} <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">Reimagined.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl drop-shadow-sm">
              {currentStore?.description || "Discover curated collections of premium fashion, accessories, and home decor powered by Mana Vyapar technology."}
            </p>
          </SlideUp>

          <SlideUp delay={0.3} duration={0.8} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row pointer-events-auto">
            <Link href="/store/products">
              <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/20">
                Explore Collection
              </Button>
            </Link>
            <Link href="#featured">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-background/50 backdrop-blur-md">
                Featured Products
              </Button>
            </Link>
          </SlideUp>
        </div>
      </section>

      {/* 2. Features Scroll Section - Sticky/Parallax style */}
      <section className="border-y border-border bg-card/30 backdrop-blur-xl relative z-10">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {features.map((feature, idx) => (
              <FadeIn key={idx} delay={idx * 0.2} className="flex flex-col items-center text-center px-4 pt-6 sm:pt-0">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 Offers Banners Carousel */}
      <section className="py-12 bg-transparent border-b border-border/50 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <SlideUp>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Exclusive Offers</h2>
            </SlideUp>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => manualScroll(bannersRef, 'prev')} className="h-10 w-10 flex items-center justify-center rounded-full border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-sm">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => manualScroll(bannersRef, 'next')} className="h-10 w-10 flex items-center justify-center rounded-full border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-sm">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div ref={bannersRef} onScroll={() => handleScrollUpdate(bannersRef, setActiveBanner)} className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 custom-scrollbar">
            {displayBanners.map((banner, idx) => (
              <SlideUp key={banner.id} delay={idx * 0.1} className="relative min-w-[85vw] sm:min-w-[700px] h-[350px] shrink-0 snap-start overflow-hidden rounded-3xl group">
                <Image src={banner.img} alt={banner.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-8 sm:p-14 w-full sm:w-2/3">
                  <h3 className="font-display text-3xl sm:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">{banner.title}</h3>
                  <p className="text-sm sm:text-lg text-white/90 mb-6 drop-shadow">{banner.sub}</p>
                  <Button variant="default" className="w-fit shadow-xl" size="lg">{banner.cta}</Button>
                </div>
              </SlideUp>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {displayBanners.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => scrollToIdx(bannersRef, idx)}
                className={cn("h-2 rounded-full transition-all duration-300", activeBanner === idx ? "w-8 bg-primary shadow-sm shadow-primary/50" : "w-2 bg-primary/20 hover:bg-primary/40")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Categories (Carousel) */}
      <section className="py-16 bg-transparent relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <SlideUp>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Shop by Category</h2>
              <p className="mt-2 text-muted-foreground">Find exactly what you&apos;re looking for</p>
            </SlideUp>
            
            <div className="flex items-center gap-4">
              <Link href="/store/categories" className="hidden text-sm font-semibold text-primary hover:underline sm:flex items-center mr-2">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <div className="hidden sm:flex items-center gap-2">
                <button onClick={() => manualScroll(categoriesRef, 'prev')} className="h-10 w-10 flex items-center justify-center rounded-full border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-sm">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={() => manualScroll(categoriesRef, 'next')} className="h-10 w-10 flex items-center justify-center rounded-full border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-sm">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div ref={categoriesRef} onScroll={() => handleScrollUpdate(categoriesRef, setActiveCategory)} className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {displayCategories.map((cat) => (
              <SlideUp key={cat.id} className="min-w-[75vw] sm:min-w-[280px] lg:min-w-[320px] shrink-0 snap-start">
                <Link href={`/store/categories/${cat.id}`} className="group relative block h-80 w-full overflow-hidden rounded-3xl">
                  <Image src={cat.img} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 75vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="font-display text-2xl font-bold text-white mb-2">{cat.name}</h3>
                    <p className="text-sm text-white/80">{cat.desc}</p>
                  </div>
                </Link>
              </SlideUp>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-center gap-2">
            {displayCategories.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => scrollToIdx(categoriesRef, idx)}
                className={cn("h-2 rounded-full transition-all duration-300", activeCategory === idx ? "w-8 bg-primary shadow-sm shadow-primary/50" : "w-2 bg-primary/20 hover:bg-primary/40")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products (3D micro-interactions) */}
      <section id="featured" className="py-24 bg-card/40 backdrop-blur-md relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-14 flex items-end justify-between">
            <SlideUp>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Trending Now</h2>
              <p className="mt-2 text-muted-foreground">Handpicked favorites just for you</p>
            </SlideUp>
            <Link href="/store/products" className="hidden text-sm font-semibold text-primary hover:underline sm:flex sm:items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {status === 'loading' && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse" />
            ))}
            {status === 'succeeded' && products.slice(0, 4).map((product, idx) => (
              <SlideUp key={product._id} delay={idx * 0.1}>
                <ProductCard product={product} />
              </SlideUp>
            ))}
          </div>
        </div>
      </section>
      
      {/* 5. Parallax Scroll Banner */}
      <section className="relative flex h-96 items-center justify-center overflow-hidden bg-primary overflow-y-hidden">
        <motion.div style={{ y: parallaxY }} className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=2000&auto=format&fit=crop" fill alt="Banner" className="object-cover opacity-20 mix-blend-multiply" />
        </motion.div>
        <div className="relative z-10 text-center container px-4">
          <h2 className="font-display text-4xl font-bold text-primary-foreground sm:text-5xl mb-6">Elevate Your Lifestyle</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
             Exclusive member discounts directly on checkout. Join Mana Vyapar community today.
          </p>
          <Link href="/store/register">
             <Button variant="secondary" size="lg" className="rounded-full shadow-2xl">
                Become a Member
             </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
