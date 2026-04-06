import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './features/themeSlice';
import scannerReducer from './features/scannerSlice';
import khataReducer from './features/khataSlice';

// Existing Merchant Store Factory
export const makeStore = () => {
    return configureStore({
        reducer: {
            theme: themeReducer,
            scanner: scannerReducer,
            khata: khataReducer,
        },
    });
};

// Types for Merchant Store
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
