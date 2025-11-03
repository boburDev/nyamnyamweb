"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useCartStore from "@/context/cartStore";
import useFavouriteStore from "@/context/favouriteStore";
import { usePostCartAfterSignup } from "@/hooks/usePostCartAfterSignup";
import { usePostFavouriteAfterSignup } from "@/hooks/usePostFavouriteAfterSignup";
import { showSuccess } from "../toast/Toast";
import { useRouter } from "@/i18n/navigation";

export const AuthSyncAfterOAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    items: cartItems,
    clearCart,
    hasHydrated: cartHydrated,
  } = useCartStore();

  const {
    items: favouriteItems,
    clearFavourites,
    hasHydrated: favouriteHydrated,
  } = useFavouriteStore();

  const { mutateAsync: createCart } = usePostCartAfterSignup();
  const { mutateAsync: createFavourite } = usePostFavouriteAfterSignup();

  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!cartHydrated || !favouriteHydrated || done) return;

    const sync = async () => {
      try {
        if (cartItems.length === 0 && favouriteItems.length === 0) {
          router.push("/");
          return;
        }

        if (cartItems.length > 0) {
          await createCart({ items: cartItems });
          clearCart();
        }

        if (favouriteItems.length > 0) {
          await createFavourite({
            items: favouriteItems.map((i) => i.id),
          });
          clearFavourites();
        }

        showSuccess("Muvaffaqiyatli tizimga kirdingiz");
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["favourites"] });
        setDone(true);
        router.push("/");
      } catch (err) {
        console.error("Sync error:", err);
        router.push("/");
      }
    };

    sync();
  }, [
    cartHydrated,
    favouriteHydrated,
    cartItems,
    favouriteItems,
    done,
    createCart,
    createFavourite,
    clearCart,
    clearFavourites,
    queryClient,
    router,
  ]);

  return null;
};
