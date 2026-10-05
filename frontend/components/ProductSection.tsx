"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, type Product } from "@/lib/products";

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="h-[600px] animate-pulse rounded-2xl bg-gray-800" />
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const product = products[currentIndex];

  function goPrevious() {
    setCurrentIndex((current) =>
      current === 0 ? products.length - 1 : current - 1,
    );
  }

  function goNext() {
    setCurrentIndex((current) =>
      current === products.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Featured
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Sản phẩm nổi bật
          </h2>
        </div>

        <span className="text-sm text-gray-400">
          {currentIndex + 1} / {products.length}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative h-[420px] w-full overflow-hidden bg-gray-100 sm:h-[520px] lg:h-[600px]">
            <Image
              key={product.id}
              src={product.image}
              alt={product.ten}
              fill
              priority
              sizes="100vw"
              className="object-contain p-6 transition duration-500 hover:scale-105 sm:p-10"
            />
          </div>
        </Link>

        <div className="flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href={`/products/${product.id}`}>
              <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 sm:text-3xl">
                {product.ten}
              </h3>
            </Link>

            {product.gia > product.giaKhuyenMai && (
              <p className="mt-2 text-sm text-gray-400 line-through">
                {product.gia.toLocaleString("vi-VN")} ₫
              </p>
            )}

            <p className="mt-1 text-2xl font-bold text-blue-600">
              {product.giaKhuyenMai.toLocaleString("vi-VN")} ₫
            </p>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="rounded-lg bg-gray-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-gray-700"
          >
            Xem chi tiết
          </Link>
        </div>

        <button
          type="button"
          onClick={goPrevious}
          aria-label="Sản phẩm trước"
          className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl text-white backdrop-blur transition hover:bg-black/80"
        >
          ←
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Sản phẩm tiếp theo"
          className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl text-white backdrop-blur transition hover:bg-black/80"
        >
          →
        </button>
      </div>
    </section>
  );
}
