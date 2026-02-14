import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScannedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  confidence: number;
  sku?: string;
  unit?: string;
}

interface ScannerState {
  isScanning: boolean;
  scannedItems: ScannedItem[];
  lastScanTime: number | null;
}

const initialState: ScannerState = {
  isScanning: false,
  scannedItems: [],
  lastScanTime: null,
};

const scannerSlice = createSlice({
  name: 'scanner',
  initialState,
  reducers: {
    setScanning: (state, action: PayloadAction<boolean>) => {
      state.isScanning = action.payload;
    },
    addScannedItem: (state, action: PayloadAction<ScannedItem>) => {
      state.scannedItems.push(action.payload);
      state.lastScanTime = Date.now();
    },
    removeScannedItem: (state, action: PayloadAction<string>) => {
      state.scannedItems = state.scannedItems.filter(item => item.id !== action.payload);
    },
    updateScannedItem: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.scannedItems.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearScannedItems: (state) => {
      state.scannedItems = [];
    },
  },
});

export const { setScanning, addScannedItem, removeScannedItem, updateScannedItem, clearScannedItems } = scannerSlice.actions;
export default scannerSlice.reducer;
