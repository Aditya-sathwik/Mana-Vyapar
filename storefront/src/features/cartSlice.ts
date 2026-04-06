import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
  totalQuantity: JSON.parse(localStorage.getItem('cartTotalQuantity') || '0'),
  totalAmount: JSON.parse(localStorage.getItem('cartTotalAmount') || '0'),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      } else {
        existingItem.quantity += newItem.quantity || 1;
      }
      
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
      
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      localStorage.setItem('cartTotalQuantity', JSON.stringify(state.totalQuantity));
      localStorage.setItem('cartTotalAmount', JSON.stringify(state.totalAmount));
    },
    removeFromCart(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
      
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      localStorage.setItem('cartTotalQuantity', JSON.stringify(state.totalQuantity));
      localStorage.setItem('cartTotalAmount', JSON.stringify(state.totalAmount));
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
      
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      localStorage.setItem('cartTotalQuantity', JSON.stringify(state.totalQuantity));
      localStorage.setItem('cartTotalAmount', JSON.stringify(state.totalAmount));
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartTotalQuantity');
      localStorage.removeItem('cartTotalAmount');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
