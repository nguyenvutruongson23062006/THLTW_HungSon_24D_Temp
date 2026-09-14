import ProductCard from "@/components/ProductCard";
import { products, type Product } from "@/lib/products";

const newProducts = products.filter(({ id }) => [1, 3, 7, 8].includes(id));

const bestSellingProducts = products.filter(({ id }) =>
  [2, 4, 5, 6].includes(id),
);

function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
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
  );
}

export default function ProductSection() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <section>
        <h2 className="text-2xl font-bold text-white">Mô tô mới</h2>
        <ProductList products={newProducts} />
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">Mô tô bán chạy</h2>
        <ProductList products={bestSellingProducts} />
      </section>
    </div>
  );
}
