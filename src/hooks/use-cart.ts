import { useState } from "react";
import useCartStore from "@/context/cartStore";
import {
  useDeleteCartAll,
  useDeleteCartItem,
  useGetCart,
  useUpdateCart,
} from "./useCart";
import { useLocationStore } from "@/context/userStore";
import { useLocale } from "next-intl";
import { OrderPayload, ProductData } from "@/types";
import { showSuccess, showWarning } from "@/components/toast/Toast";
import { useCreateOrder } from "./userOrder";
import { useRouter } from "@/i18n/navigation";

export const useHelpCart = ({auth}: {auth: boolean}) => {
  // state store
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [payment, setPayment] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
  const coords = useLocationStore((s) => s.coords);
  const storeCart = useCartStore((s) => s.items);
  const deleteCartStore = useCartStore((s) => s.removeFromCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const storeCartReset = useCartStore((s) => s.clearCart);
  const locale = useLocale();
  const router = useRouter();

  // api logic
  const { data: apiCart, isLoading } = useGetCart({
    lat: coords?.lat,
    lon: coords?.lon,
    locale,
    enabled: auth,
  });
  const { mutate: deleteCartAll } = useDeleteCartAll();
  const { mutate: deleteCartApi } = useDeleteCartItem();
  const { mutate: updateCartQty } = useUpdateCart();
    const { mutate: createOrder, isPending } = useCreateOrder();
  // data function
  const cartData = apiCart ?? { cart_items: [], cart_total: 0 };
  const items = auth ? cartData?.cart_items ?? [] : storeCart;
  const totalPrice = auth ? cartData?.cart_total : getTotalPrice();

  const handleConfirm = () => {
    if (auth) {
      deleteCartAll();
    } else {
      storeCartReset();
    }
  };
  const handleDelete = (id: string) => {
    if (!auth) {
      deleteCartStore(id);
    } else {
      deleteCartApi(id);
    }
  };
  const handleUpdateQuantity = (
    id: string,
    quantity: number,
    surprise_bag?: string
  ) => {
    if (quantity < 1) return;

    const currentItem = items?.find(
      (i: ProductData) => i && "id" in i && i.id === id
    );
    const getServerMax = (it: ProductData): number => {
      if (!it) return 30;
      if ("count" in it && typeof it.count === "number" && it.count > 0)
        return it.count;
      if ("stock" in it && typeof it.stock === "number" && it.stock > 0)
        return it.stock;
      return 30;
    };
    const serverMax = getServerMax(currentItem);
    const maxAllowed = Math.min(30, serverMax);

    if (quantity > maxAllowed) {
      showWarning(`Maksimal miqdor ${maxAllowed} tadan oshmasligi kerak!`);
      quantity = maxAllowed;
    }

    if (!auth) {
      updateQuantity(id, quantity);
    } else {
      const sb = (() => {
        if (typeof surprise_bag === "string") return surprise_bag;
        if (currentItem && "surprise_bag" in currentItem)
          return currentItem.surprise_bag ?? "";
        return "";
      })();
      updateCartQty({ id, quantity, surprise_bag: sb });
    }
  };
  const handleCheckout = () => {
    if (!auth) {
      router.push("/signin");
      return;
    }
    if (!payment) {
      setError("To'lov turi tanlang");
      return;
    }
    const payload: OrderPayload = {
      order_items: items.map((item: ProductData) => ({
        title: item.title,
        count: item.quantity,
        price: item.price_in_app,
        surprise_bag: item.id,
        start_time: item.start_time || "",
        end_time: item.end_time || "",
        weekday: item.weekday ?? 0,
      })),
      total_price: totalPrice,
      payment_method: payment || "",
    };

    createOrder(
      { data: payload, locale },
      {
        onSuccess: () => {
          showSuccess("Buyurtma muvaffaqiyatli yaratildi");
          router.push("/order");
        },
      }
    );
  };
  const toggleConfirm = () => setConfirmOpen(!confirmOpen);
  return {
    items,
    totalPrice,
    handleConfirm,
    confirmOpen,
    setConfirmOpen,
    toggleConfirm,
    isLoading,
    handleDelete,
    handleUpdateQuantity,
    handleCheckout,
    error,
    setPayment,
    payment,
    isPending,
    setError
  };
};
