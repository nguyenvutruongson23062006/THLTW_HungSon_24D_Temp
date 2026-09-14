"use client";

import { addToCart } from "@/lib/cart";

type AddToCartButtonProps = {
  id: number;
  ten: string;
  gia: number;
  giaKhuyenMai: number;
  image: string;
  tonKho: number;
};

export default function AddToCartButton({
  id,
  ten,
  gia,
  giaKhuyenMai,
  image,
  tonKho,
}: AddToCartButtonProps) {
  function handleAddToCart() {
    if (tonKho <= 0) {
      alert("Sản phẩm đã hết hàng.");
      return;
    }

    const added = addToCart({
      id,
      ten,
      gia,
      giaKhuyenMai,
      image,
      quantity: 1,
    });

    if (added) {
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } else {
      alert("Không thể thêm sản phẩm vào giỏ hàng.");
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={tonKho <= 0}
        className="rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {tonKho > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
      </button>
    </div>
  );
}
