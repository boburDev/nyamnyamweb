import { TOKEN } from "@/constants";
import { cookieStorage } from "@/lib";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StoreState {
  auth: boolean;
  login: (value: string) => void;
  logout: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, _get) => ({
      auth: false,
      login: (token) => {
        cookieStorage.setItem(TOKEN, token);
        set({ auth: true });
      },
      logout: () => {
        cookieStorage.removeItem(TOKEN);
        set({ auth: false });
      },
    }),
    {
      name: "nyam-web",
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);

export default useStore;
