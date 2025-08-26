import { deleteCookie, getCookie, setCookie } from "cookies-next";

export const cookieStorage = {
  getItem: (name: string) => {
    const value = getCookie(name) as string | undefined;
    return value === undefined ? null : value;
  },
  setItem: (name: string, value: string) => {
    setCookie(name, value, { secure: true, maxAge: 60 * 60 * 24 * 7 });
  },
  removeItem: (name: string) => {
    deleteCookie(name);
  },
};
