import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './features/themeSlice'
import scannerReducer from './features/scannerSlice'
import khataReducer from './features/khataSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      theme: themeReducer,
      scanner: scannerReducer,
      khata: khataReducer,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
