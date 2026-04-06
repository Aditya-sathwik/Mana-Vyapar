import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import storefrontApi from '@/lib/api';

export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  merchantId: string;
  productId: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'ACCEPTED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    state: string;
    zipCode: string;
    street: string;
  };
  orderNumber: string;
  clientSecret?: string;
  createdAt: string;
}

interface OrderState {
  currentOrder: Order | null;
  history: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  history: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk('order/fetchOrders', async () => {
  const response = await storefrontApi.getCustomerOrders();
  return response.data || response;
});

export const placeOrder = createAsyncThunk('order/placeOrder', async (orderData: any) => {
    const response = await storefrontApi.placeOrder(orderData);
    return response.data || response;
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    clearOrderState: (state) => {
      state.currentOrder = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchOrders.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.history = action.payload;
        })
        .addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch orders';
        })
        .addCase(placeOrder.pending, (state) => {
            state.loading = true;
        })
        .addCase(placeOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.currentOrder = action.payload;
        })
        .addCase(placeOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to place order';
        });
  }
});

export const { setCurrentOrder, clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
