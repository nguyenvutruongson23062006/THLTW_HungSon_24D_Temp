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

function ProductList({
  products,
}: {
  products: typeof newProducts;
}) {
  return (
    <div>
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
    <>
      <section>
        <h2>Sản phẩm mới</h2>
        <ProductList products={newProducts} />
      </section>

      <section>
        <h2>Sản phẩm bán chạy</h2>
        <ProductList products={bestSellingProducts} />
      </section>
    </>
  );
}