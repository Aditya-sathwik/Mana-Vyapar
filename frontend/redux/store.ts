import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import storeReducer from './slices/storeSlice';

export const storefrontStore = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    auth: authReducer,
    order: orderReducer,
    store: storeReducer,
  },
});

export type StorefrontRootState = ReturnType<typeof storefrontStore.getState>;
export type StorefrontAppDispatch = typeof storefrontStore.dispatch;
