import { products } from "@/lib/products";

export type CartItem = {
  id: number;
  ten: string;
  gia: number;
  giaKhuyenMai: number;
  image: string;
  quantity: number;
};

const CART_KEY = "cart";

const emptyCart: CartItem[] = [];

let cachedCart: CartItem[] = emptyCart;

const listeners = new Set<() => void>();

function notifyCartChange() {
  listeners.forEach((listener) => listener());
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return emptyCart;
  }

  const cart = localStorage.getItem(CART_KEY);

  if (!cart) {
    return emptyCart;
  }

  try {
    const parsedCart = JSON.parse(cart);

    if (!Array.isArray(parsedCart)) {
      return emptyCart;
    }

    return parsedCart.filter(
      (item): item is CartItem =>
        typeof item?.id === "number" &&
        typeof item?.quantity === "number" &&
        item.quantity > 0,
    );
  } catch {
    return emptyCart;
  }
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return emptyCart;
  }

  return cachedCart;
}

export function subscribeCart(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function initializeCart() {
  if (typeof window === "undefined") {
    return;
  }

  cachedCart = loadCartFromStorage();

  // Đồng bộ giỏ hàng với tồn kho hiện tại.
  cachedCart = cachedCart
    .map((item) => {
      const product = products.find((product) => product.id === item.id);

      if (!product || product.tonKho <= 0) {
        return null;
      }

      return {
        ...item,
        quantity: Math.min(item.quantity, product.tonKho),
      };
    })
    .filter((item): item is CartItem => item !== null);

  localStorage.setItem(CART_KEY, JSON.stringify(cachedCart));

  notifyCartChange();
}

export function addToCart(item: CartItem): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const product = products.find((product) => product.id === item.id);

  if (!product || product.tonKho <= 0) {
    return false;
  }

  const cart = [...cachedCart];

  const existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    const nextQuantity = existingItem.quantity + item.quantity;

    if (nextQuantity > product.tonKho) {
      existingItem.quantity = product.tonKho;
    } else {
      existingItem.quantity = nextQuantity;
    }
  } else {
    cart.push({
      ...item,
      quantity: Math.min(item.quantity, product.tonKho),
    });
  }

  cachedCart = cart;

  localStorage.setItem(CART_KEY, JSON.stringify(cachedCart));

  notifyCartChange();

  return true;
}

export function updateCartQuantity(id: number, quantity: number): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const product = products.find((product) => product.id === id);

  if (!product || product.tonKho <= 0) {
    removeFromCart(id);
    return false;
  }

  const nextQuantity = Math.max(1, Math.min(quantity, product.tonKho));

  const cart = [...cachedCart];

  const item = cart.find((cartItem) => cartItem.id === id);

  if (!item) {
    return false;
  }

  item.quantity = nextQuantity;

  cachedCart = cart;

  localStorage.setItem(CART_KEY, JSON.stringify(cachedCart));

  notifyCartChange();

  return true;
}

export function removeFromCart(id: number): void {
  cachedCart = cachedCart.filter((item) => item.id !== id);

  localStorage.setItem(CART_KEY, JSON.stringify(cachedCart));

  notifyCartChange();
}

export function clearCart(): void {
  cachedCart = emptyCart;

  localStorage.removeItem(CART_KEY);

  notifyCartChange();
}
