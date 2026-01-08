import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@hd-boutique/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isAdmin: user.role === 'admin'
        });
      },
      clearAuth: () => {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isAdmin: false
        });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Update isAuthenticated and isAdmin after rehydration
        if (state?.user && state?.token) {
          state.isAuthenticated = true;
          state.isAdmin = state.user.role === 'admin';
        }
      },
    }
  )
);
