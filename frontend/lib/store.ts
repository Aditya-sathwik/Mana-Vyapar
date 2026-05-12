import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './features/themeSlice';
import scannerReducer from './features/scannerSlice';
import khataReducer from './features/khataSlice';
import authReducer from '../redux/slices/authSlice';
import supportReducer from '../redux/slices/supportSlice';

// Existing Merchant Store Factory
export const makeStore = () => {
    return configureStore({
        reducer: {
            theme: themeReducer,
            scanner: scannerReducer,
            khata: khataReducer,
            auth: authReducer,
            support: supportReducer,
        },
    });
};

// Types for Merchant Store
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
