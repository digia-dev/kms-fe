/**
 * Auth store — Zustand store for authentication state.
 * Manages tokens, user info, login/logout.
 */

"use client";

import { create } from "zustand";
import { api, type LoginPayload, type RegisterPayload, type UserBrief } from "@/lib/api";

interface AuthState {
  user: UserBrief | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/login", payload);
      const data = res.data.data;

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ??
        "Login failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/auth/register", payload);
      set({ isLoading: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ??
        "Registration failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      const res = await api.get("/auth/me");
      const me = res.data.data;

      set({
        user: {
          id: me.id,
          email: me.email,
          name: me.name,
          roles: me.roles?.map((r: { name: string }) => r.name) ?? [],
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
