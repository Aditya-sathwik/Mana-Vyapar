import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '@/lib/api-client';

export interface Product {
    _id: string;
    id: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number;
    images: string[];
    category: string;
    merchantId: string;
    stock: number;
    variants?: any[];
    rating?: number;
    reviewsCount?: number;
    isFeatured?: boolean;
    isTrending?: boolean;
    discount?: number;
}

interface ProductState {
    items: Product[];
    loading: boolean;
    error: string | null;
    selectedProduct: Product | null;
    categories: string[];
}

const initialState: ProductState = {
    items: [],
    loading: false,
    error: null,
    selectedProduct: null,
    categories: [],
};

// Async actions for fetching products
export const fetchProducts = createAsyncThunk('product/fetchProducts', async (merchantId: string) => {
    // Standard endpoint might be /products/merchant/{id}
    const response = await apiFetch(`/products?merchantId=${merchantId}`);
    return response.items || response; // Depending on API shape
});

export const fetchProductById = createAsyncThunk('product/fetchProductById', async (productId: string) => {
    const response = await apiFetch(`/products/${productId}`);
    return response;
});

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.items = action.payload;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.items = action.payload;
                // Unique categories
                state.categories = Array.from(new Set(action.payload.map(p => p.category)));
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch products';
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            });
    }
});

export const { setProducts, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
