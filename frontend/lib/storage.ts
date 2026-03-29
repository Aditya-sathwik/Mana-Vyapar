/**
 * Centralized LocalStorage Utility for Mana-Vyapar
 * Handles User, AccessToken, and RefreshToken management.
 */

const STORAGE_KEYS = {
  USER: "mana_vyapar_user",
  ACCESS_TOKEN: "mana_vyapar_access_token",
  REFRESH_TOKEN: "mana_vyapar_refresh_token",
};

export const storage = {
  // --- USER DATA ---
  setUser(user: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },
  getUser() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // --- TOKENS ---
  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  },
  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
    return null;
  },
  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
    return null;
  },

  // --- SYSTEM ---
  clearAuth() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },
};

export default storage;
