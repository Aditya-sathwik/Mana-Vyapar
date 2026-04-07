import React from 'react';
import HeroSection from './HeroSection';
import CategoryGrid from './CategoryGrid';
import CTASection from './CTASection';
import TextBlockSection from './TextBlockSection';

interface SectionRendererProps {
  sections: any[];
  theme?: any;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ sections, theme }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections
        .filter((section) => section.isVisible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((section) => {
          switch (section.type) {
            case 'hero':
              return <HeroSection key={section._id || 'hero'} data={section} />;
            case 'categories_grid':
              return <CategoryGrid key={section._id || 'categories'} data={section} theme={theme} />;
            case 'cta':
              return <CTASection key={section._id || 'cta'} data={section} theme={theme} />;
            case 'text_block':
              return <TextBlockSection key={section._id || 'text_block'} data={section} />;
            case 'featured_products':
              // Temporary placeholder until FeaturedProducts is built
              return (
                <section key={section._id} className="py-20 text-center opacity-50">
                  <h2 className="text-xl font-bold uppercase tracking-widest">{section.title || 'Featured Products'}</h2>
                  <p className="text-xs mt-2 italic text-sf-text-muted">[Products integration in progress]</p>
                </section>
              );
            default:
              console.warn(`Unknown section type: ${section.type}`);
              return null;
          }
        })}
    </>
  );
};

export default SectionRenderer;
