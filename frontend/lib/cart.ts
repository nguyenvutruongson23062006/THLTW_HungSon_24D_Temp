export type CartItem = {
  id: number;
  ten: string;
  gia: number;
  giaKhuyenMai: number;
  image: string;
  quantity: number;
};

const CART_KEY = "cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const cart = localStorage.getItem(CART_KEY);

  if (!cart) {
    return [];
  }

  return JSON.parse(cart);
}

export function addToCart(item: CartItem): void {
  const cart = getCart();

  const existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function removeFromCart(id: number): void {
  const cart = getCart().filter((item) => item.id !== id);

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}
