import { GET_USER } from "@/constants";
import request from "@/services";

export async function getUsers() {
  try {
    const res = await request(GET_USER);
    return res.data.data;
  } catch (err) {
    console.error("getUsers error:", err);
    return null;
  }
}
