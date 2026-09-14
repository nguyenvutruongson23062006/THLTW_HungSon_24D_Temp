import Link from "next/link";

const categories = [
  {
    name: "Mô tô",
    description: "Sport và Naked",
    href: "/products?category=moto",
  },
  {
    name: "Phụ kiện",
    description: "Phụ kiện dành cho xe",
    href: "/products?category=accessories",
  },
  {
    name: "Dầu nhớt",
    description: "Dầu nhớt và sản phẩm chăm sóc xe",
    href: "/products?category=oil",
  },
  {
    name: "Đồ bảo hộ",
    description: "Trang bị bảo hộ khi lái xe",
    href: "/products?category=gear",
  },
];

export default function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-8 text-3xl font-bold text-white">Danh mục nổi bật</h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-900">
              {category.name}
            </h3>

            <p className="mt-2 text-gray-500">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
