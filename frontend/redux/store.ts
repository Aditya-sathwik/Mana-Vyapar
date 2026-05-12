import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import storeReducer from './slices/storeSlice';
import supportReducer from './slices/supportSlice';

export const storefrontStore = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    auth: authReducer,
    order: orderReducer,
    store: storeReducer,
    support: supportReducer,
  },
});

export type RootState = ReturnType<typeof storefrontStore.getState>;
export type AppDispatch = typeof storefrontStore.dispatch;
