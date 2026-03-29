'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hero3DScene } from '@/components/storefront/Hero3DScene';
import { ProductCard } from '@/components/storefront/ui/ProductCard';
import { Button } from '@/components/storefront/ui/Button';
import { FadeIn, SlideUp } from '@/components/storefront/ui/MotionComponents';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProducts } from '@/redux/slices/productSlice';
import { ArrowRight, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function StoreHome() {
  const dispatch = useAppDispatch();
  const { items: products, status } = useAppSelector((state) => state.products);
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const features = [
    { icon: <Truck className="h-6 w-6 text-primary" />, title: 'Free Delivery', desc: 'On orders over ₹999' },
    { icon: <ShieldCheck className="h-6 w-6 text-primary" />, title: '100% Secure', desc: 'Safe & secure payments' },
    { icon: <RefreshCcw className="h-6 w-6 text-primary" />, title: 'Easy Returns', desc: '14-day return policy' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. 3D Hero Section */}
      <section className="relative flex min-h-[90vh] sm:min-h-screen w-full items-center justify-center overflow-hidden">
        <Hero3DScene />
        
        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6">
          <SlideUp duration={0.8}>
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-md mb-6 border border-primary/20">
              Welcome to Mana Store
            </span>
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl lg:text-8xl drop-shadow-sm">
              Premium Shopping <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">Reimagined.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl drop-shadow-sm">
              Discover curated collections of premium fashion, accessories, and home decor powered by Mana Vyapar technology.
            </p>
          </SlideUp>

          <SlideUp delay={0.3} duration={0.8} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
      <section className="border-y border-border bg-card/50 backdrop-blur-xl">
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

      {/* 3. Featured Categories (Scroll reveals) */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex items-end justify-between">
            <SlideUp>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Shop by Category</h2>
              <p className="mt-2 text-muted-foreground">Find exactly what you&apos;re looking for</p>
            </SlideUp>
            <Link href="/store/categories" className="hidden text-sm font-semibold text-primary hover:underline sm:flex sm:items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { id: 'c1', name: 'Premium Clothing', desc: 'Sarees, Kurtas & more', img: 'https://images.unsplash.com/photo-1583391733958-6fb51e70befd?q=80&w=800&auto=format&fit=crop' },
              { id: 'c2', name: 'Fine Jewelry', desc: 'Necklaces, Earrings & Sets', img: 'https://images.unsplash.com/photo-1599643477874-ceab36916a13?q=80&w=800&auto=format&fit=crop' },
              { id: 'c3', name: 'Home Living', desc: 'Decor & Furniture', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop' },
            ].map((cat, idx) => (
              <SlideUp key={cat.id} delay={idx * 0.15}>
                <Link href={`/store/categories/${cat.id}`} className="group relative block h-80 w-full overflow-hidden rounded-3xl">
                  <Image src={cat.img} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h3 className="font-display text-2xl font-bold text-white mb-2">{cat.name}</h3>
                    <p className="text-sm text-white/80">{cat.desc}</p>
                  </div>
                </Link>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products (3D micro-interactions) */}
      <section id="featured" className="py-24 bg-card">
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
              <SlideUp key={product.id} delay={idx * 0.1}>
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
