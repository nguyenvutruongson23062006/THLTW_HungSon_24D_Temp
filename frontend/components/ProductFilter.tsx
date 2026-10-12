"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

type ProductFilterProps = {
  search: string;
  category: string;
  brand: string;
  price: string;
  sort: string;

  products: Product[];

  onSearch: (keyword: string) => void;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onPriceChange: (price: string) => void;
  onSortChange: (sort: string) => void;
};

export default function ProductFilter({
  search,
  category,
  brand,
  price,
  sort,
  products,
  onSearch,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onSortChange,
}: ProductFilterProps) {
  const [keyword, setKeyword] = useState(search);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(keyword);
  }

  // =========================
  // DANH MỤC TỪ DATABASE
  // =========================

  const categories = Array.from(
    new Map(
      products.map((product) => [product.categoryId, product.categoryName]),
    ).entries(),
  );

  // =========================
  // THƯƠNG HIỆU TỪ DATABASE
  // =========================

  const brands = Array.from(
    new Map(
      products
        .filter((product) => product.brandId && product.brand)
        .map((product) => [product.brandId, product.brand]),
    ).entries(),
  );

  return (
    <div className="mb-8 space-y-4">
      {/* =========================
          SEARCH
      ========================= */}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Tìm kiếm
        </button>
      </form>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* DANH MỤC */}

        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
        >
          <option value="all">Tất cả danh mục</option>

          {categories.map(([id, name]) => (
            <option key={id} value={String(id)}>
              {name}
            </option>
          ))}
        </select>

        {/* THƯƠNG HIỆU */}

        <select
          value={brand}
          onChange={(event) => onBrandChange(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
        >
          <option value="all">Tất cả thương hiệu</option>

          {brands.map(([id, name]) => (
            <option key={id} value={String(id)}>
              {name}
            </option>
          ))}
        </select>

        {/* GIÁ */}

        <select
          value={price}
          onChange={(event) => onPriceChange(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
        >
          <option value="all">Tất cả mức giá</option>

          <option value="under-200">Dưới 200 triệu</option>

          <option value="200-250">200 - 250 triệu</option>

          <option value="250-300">250 - 300 triệu</option>

          <option value="over-300">Trên 300 triệu</option>
        </select>

        {/* SẮP XẾP */}

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
        >
          <option value="default">Sắp xếp</option>

          <option value="price-asc">Giá thấp đến cao</option>

          <option value="price-desc">Giá cao đến thấp</option>

          <option value="newest">Mới nhất</option>
        </select>
      </div>
    </div>
  );
}
