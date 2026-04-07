import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchStoreBySlug, setSlug } from '../features/storeSlice';

/**
 * Hook to manage store configuration, slug detection, and SEO synchronization.
 * It intelligently switches between Live data (from API) and Preview data (from Merchant Dashboard).
 */
export const useStoreConfig = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { config: liveConfig, loading, error, slug } = useSelector((state: RootState) => state.store);
  const { config: previewConfig, isPreview } = useSelector((state: RootState) => state.preview);

  // Determine active configuration (Preview overrides Live)
  const config = isPreview ? previewConfig : liveConfig;

  useEffect(() => {
    // 1. Detect Slug from Hostname (Subdomain Strategy)
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    let detectedSlug = '';

    // Handle slug.manavyapar.com or slug.lvh.me
    // If we have more than one part and it's not a direct IP or localhost
    if (parts.length >= 2 && !['localhost', '127', '0', '192', '172'].includes(parts[0])) {
      detectedSlug = parts[0];
    } else {
      // Fallback for local development or direct IP access
      const params = new URLSearchParams(window.location.search);
      detectedSlug = params.get('slug') || '';
    }

    if (detectedSlug && detectedSlug !== slug) {
      console.log(`🌐 [useStoreConfig]: Detected Slug -> ${detectedSlug}`);
      dispatch(setSlug(detectedSlug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    // 2. Fetch Live Config only if not in Preview mode
    // Added !error check to prevent the infinite re-fetch loop on failures
    if (slug && !isPreview && !liveConfig && !loading && !error) {
      dispatch(fetchStoreBySlug(slug));
    }
  }, [dispatch, slug, isPreview, liveConfig, loading, error]);

  useEffect(() => {
    // 3. Dynamic SEO & Aesthetics
    if (config) {
      // Update Title
      if (config.seoConfig?.metaTitle || config.name) {
        document.title = config.seoConfig?.metaTitle || config.name;
      }

      // Update Favicon
      if (config.seoConfig?.favicon || config.logo) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
          link.href = config.seoConfig?.favicon || config.logo;
        }
      }

      // Update Meta description
      if (config.seoConfig?.metaDescription || config.description) {
        let metaDesc = document.querySelector("meta[name='description']");
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', config.seoConfig?.metaDescription || config.description);
      }

      // Dynamic CSS Variables (Theming)
      const root = document.documentElement;
      if (config.theme) {
        const { primaryColor, accentColor, secondaryColor, borderRadius, fontFamily } = config.theme;
        
        if (primaryColor) root.style.setProperty('--sf-primary', primaryColor);
        if (accentColor) root.style.setProperty('--sf-accent', accentColor);
        if (secondaryColor) root.style.setProperty('--sf-secondary', secondaryColor);
        
        if (fontFamily) root.style.setProperty('--sf-font-family', fontFamily);
        
        // Handle Border Radius
        const radiusMap: Record<string, string> = {
          sharp: '0px',
          rounded: '12px',
          pill: '9999px'
        };
        if (borderRadius) root.style.setProperty('--sf-radius', radiusMap[borderRadius] || '12px');
      }
    }
  }, [config]);

  return { config, loading, error, isPreview, slug };
};
