import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, X, Facebook, ArrowRight } from 'lucide-react';
import { useStoreConfig } from '../hooks/useStoreConfig';

const Footer: React.FC = () => {
  const { config } = useStoreConfig();

  return (
    <footer className="bg-sf-surface pt-24 pb-12 px-6 md:px-12 border-t border-sf-outline/10 overflow-hidden relative">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-sf-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 relative z-10">

          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              {config?.logo ? (
                <img src={config.logo} alt={config.name} className="h-8 md:h-10 w-auto object-contain" />
              ) : (
                <>
                  <div className="w-6 h-6 bg-sf-primary rounded-md rotate-12 flex items-center justify-center p-1">
                    <span className="text-white font-black italic text-xs leading-none">{config?.name?.[0] || 'M'}</span>
                  </div>
                  <span className="font-bold tracking-tighter text-lg text-sf-text uppercase italic">{config?.name || 'MANA VYAPAR'}</span>
                </>
              )}
            </div>
            <p className="text-sf-text-muted text-sm leading-relaxed mb-6">
              {config?.description || "Empowering Indian small businesses with premium digital storefronts. We celebrate local artisanship through global technology."}
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, link: config?.socialLinks?.instagram },
                { Icon: X, link: config?.socialLinks?.twitter },
                { Icon: Facebook, link: config?.socialLinks?.facebook }
              ].map(({ Icon, link }, i) => (
                <a 
                  key={i} 
                  href={link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-sf-outline/20 flex items-center justify-center text-sf-text-muted hover:bg-sf-primary hover:text-white hover:border-sf-primary transition-all duration-300"
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-[10px] font-black tracking-[0.2em] text-sf-text mb-8 uppercase">Explore</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sf-text-muted hover:text-sf-primary text-sm transition-colors uppercase font-bold tracking-widest text-[10px]">Home</Link></li>
              <li><Link to="/products" className="text-sf-text-muted hover:text-sf-primary text-sm transition-colors uppercase font-bold tracking-widest text-[10px]">Products</Link></li>
              <li><Link to="/categories" className="text-sf-text-muted hover:text-sf-primary text-sm transition-colors uppercase font-bold tracking-widest text-[10px]">Categories</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-[10px] font-black tracking-[0.2em] text-sf-text mb-8 uppercase">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-sf-text-muted hover:text-sf-primary text-sm transition-colors uppercase font-bold tracking-widest text-[10px]">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-sf-text-muted hover:text-sf-primary text-sm transition-colors uppercase font-bold tracking-widest text-[10px]">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-[10px] font-black tracking-[0.2em] text-sf-text mb-8 uppercase">Newsletter</h4>
            <p className="text-sf-text-muted text-sm mb-6 leading-relaxed italic opacity-80">
              Join our atelier for exclusive updates and design insights.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="w-full bg-sf-surface-low border border-sf-outline/10 h-12 px-4 rounded-[var(--sf-radius-md)] text-[10px] font-bold tracking-widest focus:outline-none focus:border-sf-primary focus:ring-4 focus:ring-sf-primary/5 transition-all text-sf-text"
              />
              <button className="absolute right-2 top-2 w-8 h-8 bg-sf-primary text-white rounded-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-lg shadow-sf-primary/20">
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-sf-outline/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold tracking-widest text-sf-text-muted text-center md:text-left uppercase italic">
            © 2026 {config?.name || 'MANA VYAPAR'}. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            {['VISA', 'MASTERCARD', 'AMEX', 'UPI'].map((brand, i) => (
              <span key={i} className="text-[9px] font-black tracking-[0.2em] text-sf-outline/50">{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
