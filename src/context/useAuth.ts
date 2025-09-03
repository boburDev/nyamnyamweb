import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  authId: string | null;
  setAuthId: (id: string) => void;
  clearAuthId: () => void;
  to: string | null;
  setTo: (to: string) => void;
  clearTo: () => void;
  confirm: string | null;
  setConfirm: (confirm: string) => void;
  deleteConfirm: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      authId: null,
      to: null,
      confirm: null,
      setAuthId: (id) => set({ authId: id }),
      clearAuthId: () => set({ authId: null }),
      setTo: (to) => set({ to }),
      clearTo: () => set({ to: null }),
      setConfirm: (confirm) => set({ confirm }),
      deleteConfirm: () => set({ confirm: null }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
