import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

interface ProductState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
}

const initialState: ProductState = {
  items: [],
  status: 'idle',
  error: null,
  searchQuery: '',
  selectedCategory: 'All',
};

// Mock async fetch for products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  // Simulate API call
  return new Promise<Product[]>((resolve) => {
    setTimeout(() => resolve([
      { id: '1', name: 'Emerald Silk Saree', description: 'Premium Indian Saree', price: 4999, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop', category: 'Clothing', inStock: true },
      { id: '2', name: 'Golden Necklace Sets', description: 'Intricate design jewelry', price: 15999, image: 'https://images.unsplash.com/photo-1599643478524-fb66f7f27f6b?q=80&w=800&auto=format&fit=crop', category: 'Jewelry', inStock: true },
      { id: '3', name: 'Handcrafted Wooden Table', description: 'Solid wood table', price: 8500, image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=800&auto=format&fit=crop', category: 'Home', inStock: true },
      { id: '4', name: 'Silk Stole Dupatta', description: 'Soft fabric dupatta', price: 1200, image: 'https://images.unsplash.com/photo-1620806947661-8ffeb0e8f2a2?q=80&w=800&auto=format&fit=crop', category: 'Clothing', inStock: true },
    ]), 1000);
  });
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { setSearchQuery, setSelectedCategory } = productSlice.actions;
export default productSlice.reducer;
