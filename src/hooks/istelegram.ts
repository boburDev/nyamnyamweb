export const isTelegramEnv = () => {
  if (typeof window === "undefined") return false;
  // 1) Telegram Mini App
  // @ts-expect-error Telegram WebApp globaldan keladi
  if (window.Telegram?.WebApp) return true;
  // 2) Telegram Browser (In-App WebView)
  if (navigator.userAgent.includes("Telegram")) return true;

  return false;
};