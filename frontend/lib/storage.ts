/**
 * Centralized LocalStorage Utility for Mana-Vyapar
 * Handles User, AccessToken, and RefreshToken management.
 */

const STORAGE_KEYS = {
  USER: "mana_vyapar_user",
  ACCESS_TOKEN: "mana_vyapar_access_token",
  REFRESH_TOKEN: "mana_vyapar_refresh_token",
};

const getStorage = (persist = true) => {
  if (typeof window === "undefined") return null;
  return persist ? localStorage : sessionStorage;
};

export const storage = {
  // --- USER DATA ---
  setUser(user: any, persist = true) {
    const s = getStorage(persist);
    if (s) {
      s.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },
  getUser() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // --- TOKENS ---
  setTokens(accessToken: string, refreshToken: string, persist = true) {
    const s = getStorage(persist);
    if (s) {
      s.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      s.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  },
  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
    return null;
  },
  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
    return null;
  },

  // --- SYSTEM ---
  clearAuth() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER);
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },
};


export default storage;
