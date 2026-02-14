import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeVariant = 'merchant' | 'admin';

interface ThemeState {
  mode: ThemeMode;
  variant: ThemeVariant;
}

const initialState: ThemeState = {
  mode: 'system',
  variant: 'merchant',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setThemeVariant: (state, action: PayloadAction<ThemeVariant>) => {
      state.variant = action.payload;
    },
  },
});

export const { setThemeMode, setThemeVariant } = themeSlice.actions;
export default themeSlice.reducer;
