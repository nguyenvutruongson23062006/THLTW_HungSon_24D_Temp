"use client";

import { useState } from "react";
import { getCart, removeFromCart, clearCart, type CartItem } from "@/lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => getCart());

  function handleRemove(id: number) {
    removeFromCart(id);
    setCart(getCart());
  }

  function handleClear() {
    clearCart();
    setCart([]);
  }

  const total = cart.reduce(
    (sum, item) => sum + item.giaKhuyenMai * item.quantity,
    0,
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-white">Giỏ hàng</h1>

      {cart.length === 0 ? (
        <p className="text-gray-400">Giỏ hàng đang trống.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 rounded-xl border bg-white p-4"
              >
                <img
                  src={item.image}
                  alt={item.ten}
                  className="h-24 w-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.ten}
                  </h2>

                  <p className="mt-2 font-bold text-blue-600">
                    {item.giaKhuyenMai.toLocaleString("vi-VN")} ₫
                  </p>

                  <p className="mt-1 text-gray-600">
                    Số lượng: {item.quantity}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-lg text-white">Tổng tiền:</p>
              <p className="text-2xl font-bold text-blue-500">
                {total.toLocaleString("vi-VN")} ₫
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg bg-gray-600 px-5 py-3 font-semibold text-white hover:bg-gray-700"
              >
                Xóa giỏ hàng
              </button>

              <button
                type="button"
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
