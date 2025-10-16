import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LocationState {
  coords: { lat: number; lon: number } | null;
  address: string | null;
  loading: boolean;
  setCoords: (coords: { lat: number; lon: number }) => void;
  setAddress: (address: string) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      coords: null,
      address: null,
      loading: false,
      setCoords: (coords) => set({ coords }),
      setAddress: (address) => set({ address }),
      setLoading: (loading) => set({ loading }),
      clear: () => set({ coords: null, address: null }),
    }),
    {
      name: "nyam-web-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
