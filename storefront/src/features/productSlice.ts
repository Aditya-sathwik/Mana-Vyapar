import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: any[];
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  trendingProducts: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  trendingProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

// Mock data generator helper
const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Premium Product ${i + 1}`,
    price: 1500 + i * 200,
    discountPrice: 1200 + i * 200,
    description: "Experience the ultimate in quality and style with this premium offering from Mana Vyapar. Crafted with precision for the modern lifestyle.",
    category: i % 3 === 0 ? "Electronics" : i % 3 === 1 ? "Fashion" : "Home Decor",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000"],
    stock: 10 + i,
    rating: 4.5,
    reviews: []
  }));
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return generateMockProducts(12);
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockProducts(20).find(p => p.id === id) || null;
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.featuredProducts = action.payload.slice(0, 4);
        state.trendingProducts = action.payload.slice(4, 10);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      });
  },
});

export default productSlice.reducer;
