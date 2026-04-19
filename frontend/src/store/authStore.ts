import { create } from "zustand";

type User = {
  id: string;
  email: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  logout: () => void;
};

export const authStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
}));