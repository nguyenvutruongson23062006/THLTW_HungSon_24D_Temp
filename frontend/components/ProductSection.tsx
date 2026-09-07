import ProductCard from "@/components/ProductCard";

const newProducts = [
  {
    id: 1,
    ten: "iPhone 16",
    gia: 19990000,
    image: "/products/iphone-16.jpg",
  },
  {
    id: 2,
    ten: "MacBook Air M3",
    gia: 24990000,
    image: "/products/macbook-air.jpg",
  },
  {
    id: 3,
    ten: "AirPods Pro",
    gia: 5990000,
    image: "/products/airpods-pro.jpg",
  },
  {
    id: 4,
    ten: "Samsung Galaxy S25",
    gia: 21990000,
    image: "/products/galaxy-s25.jpg",
  },
];

const bestSellingProducts = [
  {
    id: 5,
    ten: "iPhone 15",
    gia: 17990000,
    image: "/products/iphone-15.jpg",
  },
  {
    id: 6,
    ten: "MacBook Pro M3",
    gia: 35990000,
    image: "/products/macbook-pro.jpg",
  },
  {
    id: 7,
    ten: "AirPods 3",
    gia: 3990000,
    image: "/products/airpods-3.jpg",
  },
  {
    id: 8,
    ten: "Samsung Galaxy S24",
    gia: 16990000,
    image: "/products/galaxy-s24.jpg",
  },
];

function ProductList({ products }: { products: typeof newProducts }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.ten}
          price={product.gia}
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
        <h2 className="text-2xl font-bold text-white">Sản phẩm mới</h2>
        <ProductList products={newProducts} />
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">Sản phẩm bán chạy</h2>
        <ProductList products={bestSellingProducts} />
      </section>
    </div>
  );
}
