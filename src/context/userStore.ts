import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LocationState {
  coords: { lat: number; lon: number } | null;
  address: string | null;
  loading: boolean;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
  setCoords: (coords: { lat: number; lon: number }) => void;
  setAddress: (address: string) => void;
  setLoading: (loading: boolean) => void;
  setPermission: (permission: 'granted' | 'denied' | 'prompt' | 'unknown') => void;
  clear: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      coords: null,
      address: null,
      loading: false,
      permission: 'unknown',
      setCoords: (coords) => set({ coords }),
      setAddress: (address) => set({ address }),
      setLoading: (loading) => set({ loading }),
      setPermission: (permission) => set({ permission }),
      clear: () => set({ coords: null, address: null, permission: 'unknown' }),
    }),
    {
      name: "nyam-web-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
