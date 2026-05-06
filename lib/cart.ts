export type CartItem = {
  productId: string;
  quantity: number;
};

const COOKIE_NAME = "prosonus_cart";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

export function readCartCookie(): CartItem[] {
  if (typeof document === "undefined") return [];
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`)
    );
    if (!match) return [];
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return [];
  }
}

export function writeCartCookie(items: CartItem[]) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(items)
  )};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}
