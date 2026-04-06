import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import storefrontApi from '@/lib/api';

export interface StoreMetadata {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  theme: {
    primary: string;
    secondary: string;
    fontFamily: string;
    accent: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    twitter?: string;
  };
  website: {
    sections: Array<{
      _id: string;
      type: string;
      data: any;
      order: number;
      isVisible: boolean;
    }>;
  };
  merchantId: string;
}

interface StoreState {
  metadata: any | null;
  loading: boolean;
  error: string | null;
  isDarkMode: boolean;
}

const initialState: StoreState = {
  metadata: null,
  loading: false,
  error: null,
  isDarkMode: false,
};

export const fetchStoreBySlug = createAsyncThunk(
  'store/fetchBySlug',
  async (slug: string) => {
    const response = await storefrontApi.getStoreBySlug(slug);
    return response.data || response;
  }
);

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setStoreMetadata: (state, action: PayloadAction<any>) => {
      state.metadata = action.payload;
      state.isDarkMode = action.payload?.theme?.darkMode || false;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.metadata = action.payload;
        state.isDarkMode = action.payload?.theme?.darkMode || false;
      })
      .addCase(fetchStoreBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Store not found';
      });
  },
});

export const { setStoreMetadata, toggleDarkMode } = storeSlice.actions;
export default storeSlice.reducer;
