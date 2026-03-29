import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '@/lib/api-client';

interface Banner {
  _id?: string;
  url: string;
  title: string;
  subtitle: string;
  link: string;
}

interface StoreTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

interface StoreData {
  _id: string;
  name: string;
  description: string;
  slug: string;
  logo?: string;
  corouselImages: Banner[];
  theme: StoreTheme;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
}

interface StoreState {
  currentStore: StoreData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StoreState = {
  currentStore: {
    _id: 's1',
    name: 'Mana Store',
    description: 'Your premier destination for high-quality sustainable products and traditional craftsmanship reimagined for the modern world.',
    slug: 'mana-store',
    logo: 'https://images.unsplash.com/photo-1541103554737-fe33e240b44c?q=80&w=200&auto=format&fit=crop',
    corouselImages: [
      { _id: 'b1', title: 'Summer Collection', subtitle: 'Up to 50% Off on apparel', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop', link: '/store/products' },
      { _id: 'b2', title: 'New Arrivals', subtitle: 'Discover the latest trends in jewelry', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop', link: '/store/products' },
      { _id: 'b3', title: 'Festive Season Sale', subtitle: 'Extra 10% off on premium collections', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop', link: '/store/products' },
    ],
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#3b82f6',
      fontFamily: 'Inter',
    },
    contactInfo: {
      email: 'hello@manastore.com',
      phone: '+91 9876543210',
      address: '123, Craft Street, Hitech City, Hyderabad, India',
    },
  },
  status: 'succeeded',
  error: null,
};

// Fetch store data by slug
export const fetchStoreBySlug = createAsyncThunk('store/fetchBySlug', async (slug: string) => {
  // Commenting out real fetch for hardcoded data testing
  /*
  const response = await apiFetch(`/stores/slug/${slug}`);
  if (!response.success) throw new Error(response.message);
  return response.data;
  */
  return initialState.currentStore;
});

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setStore(state, action: PayloadAction<StoreData>) {
      state.currentStore = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchStoreBySlug.pending, (state) => {
        // state.status = 'loading'; // Keep succeeded
      })
      .addCase(fetchStoreBySlug.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentStore = action.payload;
      })
      .addCase(fetchStoreBySlug.rejected, (state, action) => {
        state.status = 'succeeded';
        state.error = action.error.message || 'Failed to fetch store';
      });
  },
});

export const { setStore } = storeSlice.actions;
export default storeSlice.reducer;
