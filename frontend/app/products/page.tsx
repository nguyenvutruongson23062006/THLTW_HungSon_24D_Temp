
"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";

const products = [
  {
    id: 1,
    ten: "Yamaha YZF-R7",
    gia: 269000000,
    image: "/products/yamaha-r7.jpg",
    category: "sport",
  },
  {
    id: 2,
    ten: "Yamaha MT-07",
    gia: 189000000,
    image: "/products/yamaha-mt07.jpg",
    category: "naked",
  },
  {
    id: 3,
    ten: "Honda CBR650R",
    gia: 254000000,
    image: "/products/honda-cbr650r.jpg",
    category: "sport",
  },
  {
    id: 4,
    ten: "Honda CB650R",
    gia: 249000000,
    image: "/products/honda-cb650r.jpg",
    category: "naked",
  },
  {
    id: 5,
    ten: "Kawasaki Ninja 650",
    gia: 209000000,
    image: "/products/kawasaki-ninja-650.jpg",
    category: "sport",
  },
  {
    id: 6,
    ten: "Kawasaki Z650",
    gia: 194000000,
    image: "/products/kawasaki-z650.jpg",
    category: "naked",
  },
  {
    id: 7,
    ten: "Suzuki GSX-8R",
    gia: 285000000,
    image: "/products/suzuki-gsx-8r.jpg",
    category: "sport",
  },
  {
    id: 8,
    ten: "Triumph Daytona 660",
    gia: 299000000,
    image: "/products/triumph-daytona-660.jpg",
    category: "sport",
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

    const matchCategory =
      category === "all" || product.category === category;

    return matchSearch && matchCategory;
  });

  if (sort === "price-asc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.gia - b.gia
    );
  }

  if (sort === "price-desc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.gia - a.gia
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-white">
        Tất cả mô tô
      </h1>

      <ProductFilter
        onSearch={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSort}
      />

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">
          Không tìm thấy mô tô phù hợp.
        </p>
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

