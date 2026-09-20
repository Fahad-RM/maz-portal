/**
 * Safe Storage wrapper that prevents uncaught SecurityErrors on iOS Safari
 * (especially in Private Browsing or when Advanced Tracking Protection is active).
 */

const inMemoryStore = new Map<string, string>();

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Fall back to in-memory store
    }
    return inMemoryStore.get(key) || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Fall back to in-memory store
    }
    inMemoryStore.set(key, value);
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Fall back to in-memory store
    }
    inMemoryStore.delete(key);
  },
};
