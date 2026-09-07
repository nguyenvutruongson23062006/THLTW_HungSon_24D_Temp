"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";

const products = [
  {
    id: 1,
    ten: "iPhone 16",
    gia: 19990000,
    image: "/products/iphone-16.jpg",
    category: "phone",
  },
  {
    id: 2,
    ten: "MacBook Air M3",
    gia: 24990000,
    image: "/products/macbook-air.jpg",
    category: "laptop",
  },
  {
    id: 3,
    ten: "AirPods Pro",
    gia: 5990000,
    image: "/products/airpods-pro.jpg",
    category: "audio",
  },
  {
    id: 4,
    ten: "Samsung Galaxy S25",
    gia: 21990000,
    image: "/products/galaxy-s25.jpg",
    category: "phone",
  },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  let filteredProducts = products.filter((product) => {
    const matchSearch = product.ten
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = category === "all" || product.category === category;

    return matchSearch && matchCategory;
  });

  if (sort === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.gia - b.gia);
  }

  if (sort === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.gia - a.gia);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-white">Tất cả sản phẩm</h1>

      <ProductFilter
        onSearch={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSort}
      />

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.ten}
              price={product.gia}
              image={product.image}
            />
          ))}
        </div>
      )}
    </main>
  );
}
