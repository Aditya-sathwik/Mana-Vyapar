import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '@/lib/api-client';

export interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string;
  slug: string;
  parent?: string | null;
  store: string;
}

interface CategoryState {
  items: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoryState = {
  items: [
    {
      _id: 'c1',
      name: 'Premium Clothing',
      description: 'Sarees, Kurtas & more',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      slug: 'premium-clothing',
      store: 's1'
    },
    {
      _id: 'c2',
      name: 'Fine Jewelry',
      description: 'Necklaces, Earrings & Sets',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      slug: 'fine-jewelry',
      store: 's1'
    },
    {
      _id: 'c3',
      name: 'Home Living',
      description: 'Decor & Furniture',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
      slug: 'home-living',
      store: 's1'
    },
    {
      _id: 'c4',
      name: 'Accessories',
      description: 'Bags, Watches & Sunglasses',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
      slug: 'accessories',
      store: 's1'
    }
  ],
  status: 'succeeded',
  error: null,
};

// Fetch categories for a store
export const fetchCategoriesByStoreId = createAsyncThunk('categories/fetchByStoreId', async (storeId: string) => {
  // Commenting out real fetch for hardcoded data testing
  /*
  const response = await apiFetch(`/categories/all/${storeId}`);
  if (!response.success) throw new Error(response.message);
  return response.data;
  */
  return initialState.items;
});

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategoriesByStoreId.pending, (state) => {
        // state.status = 'loading'; // Keep succeeded
      })
      .addCase(fetchCategoriesByStoreId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategoriesByStoreId.rejected, (state, action) => {
        state.status = 'succeeded';
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export default categorySlice.reducer;
