import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { StorefrontRootState, StorefrontAppDispatch } from './store';

// Use throughout your storefront instead of plain `useDispatch` and `useSelector`
export const useStorefrontDispatch: () => StorefrontAppDispatch = useDispatch;
export const useStorefrontSelector: TypedUseSelectorHook<StorefrontRootState> = useSelector;
export const useStorefrontStore = () => useStore<StorefrontRootState>();
