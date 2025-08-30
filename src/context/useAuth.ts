import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  authId: string | null;
  setAuthId: (id: string) => void;
  clearAuthId: () => void;
  to: string | null;
  setTo: (to: string) => void;
  clearTo: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      authId: null,
      setAuthId: (id) => set({ authId: id }),
      clearAuthId: () => set({ authId: null }),
      to: null,
      setTo: (to) => set({ to }),
      clearTo: () => set({ to: null }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
