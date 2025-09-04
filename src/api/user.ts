import { GET_USER } from "@/constants";
import axios from "axios";

export async function getUsers() {
  try {
    const res = await axios.get(GET_USER);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
