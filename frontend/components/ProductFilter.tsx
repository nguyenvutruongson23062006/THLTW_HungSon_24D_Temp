"use client";

import { useState } from "react";

type ProductFilterProps = {
  onSearch: (keyword: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
};

export default function ProductFilter({
  onSearch,
  onCategoryChange,
  onSortChange,
}: ProductFilterProps) {
  const [keyword, setKeyword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(keyword);
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Tìm kiếm */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-1 rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Bộ lọc */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <select
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
          defaultValue="all"
        >
          <option value="all">Tất cả danh mục</option>
          <option value="phone">Điện thoại</option>
          <option value="laptop">Laptop</option>
          <option value="audio">Tai nghe</option>
        </select>

        <select
          onChange={(event) => onSortChange(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
          defaultValue="default"
        >
          <option value="default">Sắp xếp</option>
          <option value="price-asc">Giá thấp → cao</option>
          <option value="price-desc">Giá cao → thấp</option>
        </select>
      </div>
    </div>
  );
}
