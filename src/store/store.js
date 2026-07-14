import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  cart: null,
  authLoading: true,

  setUser: (user) => set({ user }),

  setCart: (cart) => set({ cart }),

  setAuthLoading: (authLoading) => set({ authLoading }),

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, cart: null });
  }
}));
