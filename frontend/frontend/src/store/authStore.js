import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("lf_token"),
  role: null,
  userId: null,

  setToken: (token) => {
    if (token) {
      localStorage.setItem("lf_token", token);

      const decoded = jwtDecode(token);

      set({
        token,
        role: decoded.role?.toLowerCase(),
        userId: Number(decoded.sub),
      });
    } else {
      localStorage.removeItem("lf_token");
      set({ token: null, role: null, userId: null });
    }
  },

  logout: () => {
    localStorage.removeItem("lf_token");
    set({ token: null, role: null, userId: null });
  },
}));
