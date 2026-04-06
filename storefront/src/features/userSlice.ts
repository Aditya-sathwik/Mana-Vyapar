import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  orders: any[];
  addresses: any[];
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null, // No persistence for now
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk('user/login', async (credentials: { email: string; otp?: string }) => {
  // Simulate login
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    id: 'user-1',
    name: 'John Doe',
    email: credentials.email,
    orders: [],
    addresses: [],
  };
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
