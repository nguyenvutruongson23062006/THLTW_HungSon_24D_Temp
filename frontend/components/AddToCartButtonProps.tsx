"use client";

import { addToCart } from "@/lib/cart";

type AddToCartButtonProps = {
  id: number;
  ten: string;
  gia: number;
  giaKhuyenMai: number;
  image: string;
};

export default function AddToCartButton({
  id,
  ten,
  gia,
  giaKhuyenMai,
  image,
}: AddToCartButtonProps) {
  function handleAddToCart() {
    addToCart({
      id,
      ten,
      gia,
      giaKhuyenMai,
      image,
      quantity: 1,
    });

    alert("Đã thêm sản phẩm vào giỏ hàng!");
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="mt-8 rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
    >
      Thêm vào giỏ hàng
    </button>
  );
}
