import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAppStore = create(
  persist(
    (set) => ({
      user: null,
      unit: null,
      financialYear: null,
      theme: "light",
      sidebarCollapsed: false,
      toasts: [],

      setUser: (user) => set({ user }),
      setUnit: (unit) => set({ unit }),
      setFinancialYear: (financialYear) => set({ financialYear }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      addToast: (toast) =>
        set((state) => ({
          toasts: [...state.toasts, { id: Date.now(), ...toast }],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      logout: () => set({ user: null, unit: null, financialYear: null }),
    }),
    {
      name: "erp-storage",
      partialize: (state) => ({
        user: state.user,
        unit: state.unit,
        financialYear: state.financialYear,
        theme: state.theme,
      }),
    },
  ),
)
