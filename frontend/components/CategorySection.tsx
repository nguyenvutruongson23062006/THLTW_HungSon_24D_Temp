const categories = ["Điện thoại", "Laptop", "Tai nghe", "Phụ kiện"];

export default function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-8 text-3xl font-bold text-white">Danh mục nổi bật</h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category}
            className="cursor-pointer rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-900">{category}</h3>

            <p className="mt-2 text-gray-500">Khám phá sản phẩm</p>
          </div>
        ))}
      </div>
    </section>
  );
}
