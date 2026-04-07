import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface PreviewState {
  config: any | null;
  isPreview: boolean;
}

const initialState: PreviewState = {
  config: null,
  isPreview: false,
};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setPreviewConfig: (state, action: PayloadAction<any>) => {
      state.config = action.payload;
      state.isPreview = true;
    },
    clearPreview: (state) => {
      state.config = null;
      state.isPreview = false;
    },
  },
});

export const { setPreviewConfig, clearPreview } = previewSlice.actions;
export default previewSlice.reducer;
