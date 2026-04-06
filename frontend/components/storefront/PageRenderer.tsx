'use client';

import { useStorefrontSelector } from '@/redux/hooks';
import { cn } from '@/lib/utils';
import HeroSection from './sections/HeroSection';
import ProductCarousel from './sections/ProductCarousel';
import CategoryGrid from './sections/CategoryGrid';
import Testimonials from './sections/Testimonials';
import OffersBanner from './sections/OffersBanner';

interface PageRendererProps {
  sections: Array<{
    _id: string;
    type: string;
    data: any;
    isVisible: boolean;
  }>;
}

export default function PageRenderer({ sections }: PageRendererProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 sf-container text-[var(--sf-text-muted)]">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Store Under Construction</h2>
        <p className="text-sm font-bold uppercase tracking-widest opacity-60">Crafting your premium experience...</p>
      </div>
    );
  }

  const renderSection = (section: any) => {
    if (!section.isVisible) return null;

    switch (section.type) {
      case 'hero':
        return <HeroSection key={section._id} data={section.data || section} />;
      case 'featured_products':
      case 'products':
      case 'carousel':
        return <ProductCarousel key={section._id} data={section.data || section} />;
      case 'categories_grid':
      case 'categories':
      case 'grid':
        return <CategoryGrid key={section._id} data={section.data || section} />;
      case 'cta':
      case 'offers':
      case 'banner':
        return <OffersBanner key={section._id} data={section.data || section} />;
      case 'text_block':
        const blockAlign = section.data?.alignment || section.alignment || 'center';
        const blockPadding = section.data?.padding || section.padding || 'normal';
        
        const textAlignClass = blockAlign === 'left' ? 'text-left items-start' : blockAlign === 'right' ? 'text-right items-end' : 'text-center items-center mx-auto';
        const paddingClass = blockPadding === 'compact' ? 'py-12' : blockPadding === 'spacious' ? 'py-40' : 'py-20';

        return (
          <section key={section._id} className={cn("sf-section", paddingClass)}>
            <div className={cn("sf-container max-w-[700px] flex flex-col w-full", textAlignClass)}>
              <h3 className="text-3xl md:text-4xl font-black text-[var(--sf-text)] uppercase tracking-tighter mb-10 leading-tight">
                {(section.data?.title || section.title)}
              </h3>
              <p className="text-lg md:text-xl text-[var(--sf-text-muted)] font-medium leading-[1.6] opacity-90">
                {(section.data?.textContent || section.textContent)}
              </p>
            </div>
          </section>
        );
      case 'testimonials':
        return <Testimonials key={section._id} data={section.data || section} />;
      default:
        console.warn(`Unknown section type: ${section.type}`);
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-0 w-full overflow-hidden">
      {sections.map(renderSection)}
    </div>
  );
}
