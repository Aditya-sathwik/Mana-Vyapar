'use client';

import { StoreMetadata } from "@/redux/slices/storeSlice";
import { useEffect } from "react";

export function DynamicTheme({ store }: { store: any | null }) {
  useEffect(() => {
    if (store?.theme) {
      const root = document.documentElement;
      
      // Inject primary colors
      if (store.theme.primaryColor) {
        root.style.setProperty('--primary', store.theme.primaryColor);
        // Create an 80% opacity version for background transitions
        root.style.setProperty('--primary-muted', `${store.theme.primaryColor}CC`);
      }
      
      // Inject secondary colors
      if (store.theme.secondaryColor) {
        root.style.setProperty('--secondary', store.theme.secondaryColor);
      }
      
      // Inject accent if it exists
      if (store.theme.accentColor) {
        root.style.setProperty('--accent', store.theme.accentColor);
      }

      // Inject font family (if user-defined)
      if (store.theme.fontFamily) {
        root.style.setProperty('--font-body', store.theme.fontFamily);
      }
      
      // Inject border radius (if user-defined)
      if (store.theme.borderRadius) {
        let radiusValue = "0.5rem"; // rounded (default)
        if (store.theme.borderRadius === "sharp") radiusValue = "0px";
        if (store.theme.borderRadius === "pill") radiusValue = "9999px";
        root.style.setProperty('--radius', radiusValue);
      }
    }
  }, [store]);

  return null;
}
