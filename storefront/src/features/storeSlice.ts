import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface StoreState {
  config: any | null;
  loading: boolean;
  error: string | null;
  slug: string | null;
}

const initialState: StoreState = {
  config: null,
  loading: false,
  error: null,
  slug: null,
};

/**
 * Fetch store configuration by slug
 */
export const fetchStoreBySlug = createAsyncThunk(
  'store/fetchBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      console.log(`🔍 [StoreSlice]: Hitting API for slug: ${slug}`);
      const response = await api.get(`/stores/${slug}`);
      console.log(`✅ [StoreSlice]: API Response success:`, response.data.success);
      
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch store');
    } catch (error: any) {
      console.error(`❌ [StoreSlice]: API Error for slug ${slug}:`, error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setSlug: (state, action) => {
      state.slug = action.payload;
      state.error = null; // Reset error on slug change
      state.config = null; // Clear old config
    },
    clearStore: (state) => {
      state.config = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(fetchStoreBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSlug, clearStore } = storeSlice.actions;
export default storeSlice.reducer;
