import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '@/lib/api-client';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  basePrice: number;
  discountPrice?: number;
  images: string[];
  category: string;
  stock: number;
  sku: string;
  slug: string;
  isActive: boolean;
}

interface ProductState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
}

const initialState: ProductState = {
  items: [
    {
      _id: 'p1',
      name: 'Premium Silk Saree',
      description: 'Handwoven pure silk saree with intricate zari work, perfect for weddings and festive occasions.',
      price: 12999,
      basePrice: 15000,
      discountPrice: 12999,
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop'],
      category: 'Premium Clothing',
      stock: 5,
      sku: 'MV-CL-001',
      slug: 'premium-silk-saree',
      isActive: true,
    },
    {
      _id: 'p2',
      name: 'Gold Plated Necklace Set',
      description: 'Stunning traditional necklace set with matching earrings, plated in 24k gold with kundans.',
      price: 4500,
      basePrice: 6000,
      discountPrice: 4500,
      images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop'],
      category: 'Fine Jewelry',
      stock: 12,
      sku: 'MV-JW-002',
      slug: 'gold-plated-necklace',
      isActive: true,
    },
    {
      _id: 'p3',
      name: 'Handcrafted Wooden Lamp',
      description: 'Elegant teak wood lamp with a sustainable linen shade, bringing warmth to any room.',
      price: 2499,
      basePrice: 3500,
      discountPrice: 2499,
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed043e1463?q=80&w=800&auto=format&fit=crop'],
      category: 'Home Living',
      stock: 8,
      sku: 'MV-HL-003',
      slug: 'wooden-lamp',
      isActive: true,
    },
    {
      _id: 'p4',
      name: 'Leather Messenger Bag',
      description: 'Genuine full-grain leather bag with multiple compartments, designed for the modern professional.',
      price: 5999,
      basePrice: 7500,
      discountPrice: 5999,
      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'],
      category: 'Accessories',
      stock: 15,
      sku: 'MV-AC-004',
      slug: 'leather-bag',
      isActive: true,
    },
    {
      _id: 'p5',
      name: 'Designer Cotton Kurta',
      description: 'Breathable organic cotton kurta with minimal embroidery, ideal for everyday elegance.',
      price: 1899,
      basePrice: 2400,
      discountPrice: 1899,
      images: ['https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=800&auto=format&fit=crop'],
      category: 'Premium Clothing',
      stock: 20,
      sku: 'MV-CL-005',
      slug: 'cotton-kurta',
      isActive: true,
    },
    {
      _id: 'p6',
      name: 'Silver Filigree Earrings',
      description: 'Exquisite handcrafted sterling silver earrings featuring traditional filigree craftsmanship.',
      price: 3200,
      basePrice: 3200,
      discountPrice: 3200,
      images: ['https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop'],
      category: 'Fine Jewelry',
      stock: 10,
      sku: 'MV-JW-006',
      slug: 'silver-earrings',
      isActive: true,
    }
  ],
  status: 'succeeded',
  error: null,
  searchQuery: '',
  selectedCategory: 'All',
};

// Fetch products for a specific store by slug
export const fetchProductsByStoreSlug = createAsyncThunk('products/fetchByStoreSlug', async (slug: string) => {
  // Commenting out real fetch for hardcoded data testing
  /*
  const response = await apiFetch(`/products/store/${slug}`);
  if (!response.success) throw new Error(response.message);
  return response.data;
  */
  return initialState.items; // Return hardcoded items
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
      .addCase(fetchProductsByStoreSlug.pending, (state) => {
        // state.status = 'loading'; // Keep 'succeeded' to avoid blink
      })
      .addCase(fetchProductsByStoreSlug.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProductsByStoreSlug.rejected, (state, action) => {
        state.status = 'succeeded'; // Don't show failure for hardcoded data
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { setSearchQuery, setSelectedCategory } = productSlice.actions;
export default productSlice.reducer;
