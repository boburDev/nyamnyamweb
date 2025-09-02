import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { cookieStorage } from "@/lib";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StoreState {
  auth: boolean;
  isHydrated: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  setAuth: (auth: boolean) => void;
  setHydrated: (value: boolean) => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, _get) => ({
      auth: false,
      isHydrated: false,
      login: (access, refresh) => {
        cookieStorage.setItem(ACCESS_TOKEN, access);
        cookieStorage.setItem(REFRESH_TOKEN, refresh);
        set({ auth: true });
      },
      logout: () => {
        cookieStorage.removeItem(ACCESS_TOKEN);
        cookieStorage.removeItem(REFRESH_TOKEN);
        set({ auth: false });
      },
      setAuth: (auth: boolean) => set({ auth }),
      setHydrated: (value: boolean) => set({ isHydrated: value }),
    }),
    {
      name: "nyam-web",
      storage: createJSONStorage(() => cookieStorage),
      onRehydrateStorage: () => (state) => {
        const token = cookieStorage.getItem(REFRESH_TOKEN);
        if (token) state?.setAuth(true);
        state?.setHydrated(true);
      },
    }
  )
);
export const hydrateStore = () => {
  useStore.persist.rehydrate();

  if (typeof window !== "undefined" && cookieStorage.getItem(REFRESH_TOKEN)) {
    useStore.setState({ auth: true });
  }
};
export default useStore;
