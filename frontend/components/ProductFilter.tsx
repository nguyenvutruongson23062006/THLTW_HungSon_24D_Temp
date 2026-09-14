"use client";

import { useState } from "react";

type ProductFilterProps = {
  search: string;
  category: string;
  motoType: string;
  brand: string;
  price: string;
  sort: string;
  onSearch: (keyword: string) => void;
  onCategoryChange: (category: string) => void;
  onMotoTypeChange: (motoType: string) => void;
  onBrandChange: (brand: string) => void;
  onPriceChange: (price: string) => void;
  onSortChange: (sort: string) => void;
};

export default function ProductFilter({
  search,
  category,
  motoType,
  brand,
  price,
  sort,
  onSearch,
  onCategoryChange,
  onMotoTypeChange,
  onBrandChange,
  onPriceChange,
  onSortChange,
}: ProductFilterProps) {
  const [keyword, setKeyword] = useState(search);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(keyword);
  }

  return (
    <div className="mb-8 space-y-4">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Danh mục chính */}
        <select
          value={category}
          onChange={(event) => {
            onCategoryChange(event.target.value);
            if (event.target.value !== "moto") {
              onMotoTypeChange("all");
            }
          }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
        >
          <option value="all">Tất cả danh mục</option>
          <option value="moto">Mô tô</option>
          <option value="accessories">Phụ kiện</option>
          <option value="oil">Dầu nhớt</option>
          <option value="gear">Đồ bảo hộ</option>
        </select>

        {/* Phân loại mô tô */}
        <select
          value={motoType}
          onChange={(event) => onMotoTypeChange(event.target.value)}
          disabled={category !== "moto"}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="all">Tất cả mô tô</option>
          <option value="sport">Sport</option>
          <option value="naked">Naked</option>
        </select>

        {/* Thương hiệu */}
        <select
          value={brand}
          onChange={(event) => onBrandChange(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
        >
          <option value="all">Tất cả thương hiệu</option>
          <option value="Yamaha">Yamaha</option>
          <option value="Honda">Honda</option>
          <option value="Kawasaki">Kawasaki</option>
          <option value="Suzuki">Suzuki</option>
          <option value="Triumph">Triumph</option>
        </select>

        {/* Giá */}
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

        {/* Sắp xếp */}
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
