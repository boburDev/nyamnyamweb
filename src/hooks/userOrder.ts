import { showError } from "@/components/toast/Toast";
import { OrderPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface Props {
  data: OrderPayload;
  locale?: string;
}

const getOrder = async ()=> {
  try {
    const res = await axios.get("/api/proxy/order/my_last_orders");
    return res.data.data;
  } catch (err) {
    console.log("❌ Order yaratishda xato:", err);
    throw err;
  }
}
const createOrder = async ({ data, locale }: Props) => {
  try {
    const res = await axios.post("/api/order", data, {
      headers: {
        "Accept-Language": locale,
      },
    });
    return res.data;
  } catch (err) {
    console.log("❌ Order yaratishda xato:", err);
    throw err;
  }
};


export const useGetOrder = () => {
  return useQuery({
    queryKey: ["order"],
    queryFn: getOrder,
  });
}
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { data: OrderPayload; locale?: string }) =>
      createOrder(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (err: Error | AxiosError) => {
      const axiosErr = err as AxiosError & {
        response?: { data?: { backend?: string; message?: string } };
      };
      const data = axiosErr.response?.data;
      const errorMessage =
        data?.backend ||
        data?.message ||
        axiosErr.message ||
        (err as Error)?.message ||
        "Xato yuz berdi";
      showError(errorMessage);
    },
  });
};
