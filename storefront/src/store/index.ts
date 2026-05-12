import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cartSlice';
import productReducer from '../features/productSlice';
import userReducer from '../features/userSlice';
import previewReducer from '../features/previewSlice';
import storeReducer from '../features/storeSlice';
import supportReducer from './slices/supportSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    user: userReducer,
    preview: previewReducer,
    store: storeReducer,
    support: supportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
