"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getProducts } from "@/lib/products";
import ChonPhuongThucThanhToan from "@/components/shop/ChonPhuongThucThanhToan";
import {
  type CartItem,
  getCart,
  removeFromCart,
  clearCart,
  subscribeCart,
  initializeCart,
  updateCartQuantity,
  dongBoGioHang,
} from "@/lib/cart";

const emptyCart: CartItem[] = [];

export default function CartPage() {
  const cart = useSyncExternalStore(subscribeCart, getCart, () => emptyCart);
  const [thongBao, setThongBao] = useState("");
  const [phuongThuc, setPhuongThuc] = useState("tien_mat");
  const [boChon, setBoChon] = useState<number[]>([]);

  useEffect(() => {
    let huy = false;
    initializeCart();
    getProducts()
      .then((products) => {
        if (!huy && dongBoGioHang(products))
          setThongBao(
            "Giỏ hàng đã cập nhật theo giá và tồn kho hiện tại. Sản phẩm hết hàng hoặc ngừng bán đã được bỏ khỏi giỏ.",
          );
      })
      .catch(() => {
        if (!huy)
          setThongBao(
            "Chưa thể cập nhật giỏ từ server. Giá và tồn kho sẽ được kiểm tra lại khi đặt hàng.",
          );
      });
    return () => {
      huy = true;
    };
  }, []);

  function handleRemove(id: number) {
    removeFromCart(id);
  }

  function handleClear() {
    clearCart();
  }

  function handleDecrease(item: CartItem) {
    if (item.quantity <= 1) {
      return;
    }

    updateCartQuantity(item.id, item.quantity - 1);
  }

  function handleIncrease(item: CartItem) {
    if (item.quantity >= item.tonKho) {
      alert(`Sản phẩm chỉ còn ${item.tonKho} sản phẩm trong kho.`);
      return;
    }

    updateCartQuantity(item.id, item.quantity + 1);
  }

  const daChon = cart.filter((d) => !boChon.includes(d.id));
  const total = daChon.reduce(
    (sum, item) => sum + item.giaKhuyenMai * item.quantity,
    0,
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-white">Giỏ hàng</h1>
      {thongBao && (
        <p
          role="status"
          className="mb-5 rounded-lg border border-blue-800 bg-blue-950 p-4 text-sm text-blue-100"
        >
          {thongBao}
        </p>
      )}

      {cart.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center">
          <p className="text-lg text-gray-500">Giỏ hàng đang trống.</p>

          <Link
            href="/products"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            <label className="flex items-center gap-3 text-white"><input type="checkbox" checked={daChon.length === cart.length} onChange={(e) => setBoChon(e.target.checked ? [] : cart.map((d) => d.id))} />Chọn tất cả ({daChon.length}/{cart.length} sản phẩm)</label>
            {cart.map((item) => {
              const stock = item.tonKho;

              const itemTotal = item.giaKhuyenMai * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center"
                >
                  <label className="flex items-center gap-2 text-sm text-slate-800"><input aria-label={`Chọn ${item.ten}`} type="checkbox" checked={!boChon.includes(item.id)} onChange={(e) => setBoChon((cu) => e.target.checked ? cu.filter((id) => id !== item.id) : [...cu, item.id])} />Chọn mua</label>
                  <Image
                    src={item.image}
                    alt={item.ten}
                    className="h-40 w-full rounded-xl object-cover md:h-36 md:w-52"
                    width={208}
                    height={144}
                  />

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.id}`}
                      className="text-2xl font-bold text-gray-900 hover:text-blue-600"
                    >
                      {item.ten}
                    </Link>

                    <div className="mt-3 space-y-1">
                      {item.gia > item.giaKhuyenMai && (
                        <p className="text-base text-gray-400 line-through">
                          Giá gốc: {item.gia.toLocaleString("vi-VN")} ₫
                        </p>
                      )}

                      <p className="text-xl font-bold text-blue-600">
                        Giá bán: {item.giaKhuyenMai.toLocaleString("vi-VN")} ₫
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-5">
                      <div>
                        <p className="mb-2 font-semibold text-gray-700">
                          Số lượng
                        </p>

                        <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item)}
                            disabled={item.quantity <= 1}
                            className="px-4 py-2 text-lg font-bold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="min-w-12 border-x border-gray-300 px-4 py-2 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleIncrease(item)}
                            disabled={stock <= 0 || item.quantity >= stock}
                            className="px-4 py-2 text-lg font-bold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-700">Tồn kho</p>

                        <p
                          className={`mt-2 ${
                            stock > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stock > 0 ? `Còn ${stock} sản phẩm` : "Hết hàng"}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-700">
                          Thành tiền
                        </p>

                        <p className="mt-2 font-bold text-gray-900">
                          {itemTotal.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-6 text-slate-900"><ChonPhuongThucThanhToan giaTri={phuongThuc} onChon={setPhuongThuc} /></div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-700">Tổng tiền</p>

                <p className="mt-1 text-3xl font-bold text-blue-600">
                  {total.toLocaleString("vi-VN")} ₫
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
                >
                  Xóa giỏ hàng
                </button>

                <Link
                  href={`/order?phuong_thuc=${phuongThuc}&chon=${daChon.map((d) => d.id).join(',')}`}
                  aria-disabled={!daChon.length}
                  onClick={(e) => { if (!daChon.length) { e.preventDefault(); setThongBao('Vui lòng chọn ít nhất một sản phẩm để thanh toán.'); } }}
                  className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  Đặt hàng
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
