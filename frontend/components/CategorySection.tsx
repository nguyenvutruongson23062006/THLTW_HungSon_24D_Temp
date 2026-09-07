const categories = [
  "Điện thoại",
  "Laptop",
  "Tai nghe",
  "Phụ kiện",
];

export default function CategorySection() {
  return (
    <section>
      <h2>Danh mục nổi bật</h2>

      <div>
        {categories.map((category) => (
          <div key={category}>
            <h3>{category}</h3>
            <p>Khám phá sản phẩm</p>
          </div>
        ))}
      </div>
    </section>
  );
}