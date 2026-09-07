"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem, getCart, removeFromCart, clearCart } from "@/lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

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
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Giỏ hàng</h1>

      {cart.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-lg text-gray-500">Giỏ hàng đang trống.</p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 rounded-xl border bg-white p-5"
              >
                <Image
                  src={item.image}
                  alt={item.ten}
                  width={120}
                  height={120}
                  className="h-28 w-28 rounded-lg object-cover"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.ten}
                    </h2>

                    <p className="mt-2 font-bold text-blue-600">
                      {item.giaKhuyenMai.toLocaleString("vi-VN")} ₫
                    </p>

                    <p className="mt-1 text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="mt-3 w-fit text-sm font-medium text-red-600 hover:underline"
                  >
                    Xóa khỏi giỏ hàng
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-red-500 px-5 py-2 text-red-600 hover:bg-red-50"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>

          <div className="h-fit rounded-xl border bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">Tổng đơn hàng</h2>

            <div className="mt-6 flex justify-between">
              <span className="text-gray-600">Tạm tính</span>

              <span className="font-semibold text-gray-900">
                {total.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Tổng cộng</span>

                <span className="text-xl font-bold text-blue-600">
                  {total.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Tiến hành đặt hàng
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
