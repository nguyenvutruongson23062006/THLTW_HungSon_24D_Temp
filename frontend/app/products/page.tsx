"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import { getProducts, type Product } from "@/lib/products";

const PRODUCTS_PER_PAGE = 4;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);
  const [urlReady, setUrlReady] = useState(false);

  // =========================
  // LOAD PRODUCTS FROM LARAVEL
  // =========================

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // =========================
  // READ URL
  // =========================

  useEffect(() => {
    function readUrl() {
      const params = new URLSearchParams(window.location.search);

      setSearch(params.get("q") ?? "");
      setCategory(params.get("category") ?? "all");
      setBrand(params.get("brand") ?? "all");
      setPrice(params.get("price") ?? "all");
      setSort(params.get("sort") ?? "default");

      setCurrentPage(Math.max(Number(params.get("page")) || 1, 1));

      setUrlReady(true);
    }

    readUrl();

    window.addEventListener("popstate", readUrl);

    return () => {
      window.removeEventListener("popstate", readUrl);
    };
  }, []);

  // =========================
  // UPDATE URL
  // =========================

  useEffect(() => {
    if (!urlReady) return;

    const params = new URLSearchParams();

    if (search) {
      params.set("q", search);
    }

    if (category !== "all") {
      params.set("category", category);
    }

    if (brand !== "all") {
      params.set("brand", brand);
    }

    if (price !== "all") {
      params.set("price", price);
    }

    if (sort !== "default") {
      params.set("sort", sort);
    }

    if (currentPage > 1) {
      params.set("page", String(currentPage));
    }

    const query = params.toString();

    const nextUrl = query ? `/products?${query}` : "/products";

    window.history.replaceState(null, "", nextUrl);
  }, [brand, category, currentPage, price, search, sort, urlReady]);

  // =========================
  // FILTER HANDLERS
  // =========================

  function handleSearch(keyword: string) {
    setSearch(keyword);
    setCurrentPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setCurrentPage(1);
  }

  function handleBrandChange(value: string) {
    setBrand(value);
    setCurrentPage(1);
  }

  function handlePriceChange(value: string) {
    setPrice(value);
    setCurrentPage(1);
  }

  function handleSortChange(value: string) {
    setSort(value);
    setCurrentPage(1);
  }

  // =========================
  // FILTER PRODUCTS
  // =========================

  let filteredProducts = products.filter((product) => {
    // Tìm kiếm
    const matchSearch = product.ten
      .toLowerCase()
      .includes(search.toLowerCase());

    // Danh mục từ DB
    const matchCategory =
      category === "all"
        ? true
        : category === "moto"
          ? [1, 2, 3, 4].includes(product.categoryId)
          : category === "accessory"
            ? [7, 9, 10].includes(product.categoryId)
            : category === "oil"
              ? product.categoryId === 6
              : category === "gear"
                ? product.categoryId === 5
                : product.categoryId === Number(category);
    // Thương hiệu từ DB
    const matchBrand = brand === "all" || product.brandId === Number(brand);

    // Giá
    const sellingPrice = product.giaKhuyenMai;

    const matchPrice =
      price === "all" ||
      (price === "under-200" && sellingPrice < 200000000) ||
      (price === "200-250" &&
        sellingPrice >= 200000000 &&
        sellingPrice <= 250000000) ||
      (price === "250-300" &&
        sellingPrice > 250000000 &&
        sellingPrice <= 300000000) ||
      (price === "over-300" && sellingPrice > 300000000);

    return matchSearch && matchCategory && matchBrand && matchPrice;
  });

  // =========================
  // SORT
  // =========================

  if (sort === "price-asc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.giaKhuyenMai - b.giaKhuyenMai,
    );
  }

  if (sort === "price-desc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.giaKhuyenMai - a.giaKhuyenMai,
    );
  }

  if (sort === "newest") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.id - a.id);
  }

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const safePage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  // =========================
  // RENDER
  // =========================

  return (
    <main className="w-full px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-white">Tất cả sản phẩm</h1>

      <ProductFilter
        search={search}
        category={category}
        brand={brand}
        price={price}
        sort={sort}
        products={products}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onBrandChange={handleBrandChange}
        onPriceChange={handlePriceChange}
        onSortChange={handleSortChange}
      />

      {loading ? (
        <div className="rounded-xl bg-white p-8 text-center">
          <p className="text-gray-500">Đang tải sản phẩm...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl bg-white p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center">
          <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.ten}
                originalPrice={product.gia}
                price={product.giaKhuyenMai}
                image={product.image}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                disabled={safePage === 1}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước ←
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-4 py-2 font-semibold ${
                      safePage === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(page + 1, totalPages))
                }
                disabled={safePage === totalPages}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
