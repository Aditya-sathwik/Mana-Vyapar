import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit'; // credit: you gave, debit: you got
  date: string;
  description?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  balance: number; // Positive = You will get, Negative = You will give
  lastActivity: string;
  transactions: Transaction[];
}

interface KhataState {
  customers: Customer[];
  activeCustomerId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: KhataState = {
  customers: [],
  activeCustomerId: null,
  loading: false,
  error: null,
};

const khataSlice = createSlice({
  name: 'khata',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setActiveCustomer: (state, action: PayloadAction<string | null>) => {
      state.activeCustomerId = action.payload;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },
    updateCustomerBalance: (state, action: PayloadAction<{ id: string; amount: number; type: 'credit' | 'debit' }>) => {
      const customer = state.customers.find(c => c.id === action.payload.id);
      if (customer) {
        if (action.payload.type === 'credit') {
          customer.balance += action.payload.amount;
        } else {
          customer.balance -= action.payload.amount;
        }
        customer.lastActivity = new Date().toISOString();
      }
    },
    addTransaction: (state, action: PayloadAction<{ customerId: string; transaction: Transaction }>) => {
      const customer = state.customers.find(c => c.id === action.payload.customerId);
      if (customer) {
        customer.transactions.unshift(action.payload.transaction);
        // Also update balance logic here if needed, but separate action is fine too
      }
    },
  },
});

export const { setLoading, setActiveCustomer, addCustomer, updateCustomerBalance, addTransaction } = khataSlice.actions;
export default khataSlice.reducer;
