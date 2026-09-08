import ProductCard from "@/components/ProductCard";

const newProducts = [
  {
    id: 1,
    ten: "Yamaha YZF-R7",
    gia: 269000000,
    image: "/products/yamaha-r7.jpg",
  },
  {
    id: 3,
    ten: "Honda CBR650R",
    gia: 254000000,
    image: "/products/honda-cbr650r.jpg",
  },
  {
    id: 7,
    ten: "Suzuki GSX-8R",
    gia: 285000000,
    image: "/products/suzuki-gsx-8r.jpg",
  },
  {
    id: 8,
    ten: "Triumph Daytona 660",
    gia: 299000000,
    image: "/products/triumph-daytona-660.jpg",
  },
];

const bestSellingProducts = [
  {
    id: 2,
    ten: "Yamaha MT-07",
    gia: 189000000,
    image: "/products/yamaha-mt07.jpg",
  },
  {
    id: 4,
    ten: "Honda CB650R",
    gia: 249000000,
    image: "/products/honda-cb650r.jpg",
  },
  {
    id: 5,
    ten: "Kawasaki Ninja 650",
    gia: 209000000,
    image: "/products/kawasaki-ninja-650.jpg",
  },
  {
    id: 6,
    ten: "Kawasaki Z650",
    gia: 194000000,
    image: "/products/kawasaki-z650.jpg",
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
