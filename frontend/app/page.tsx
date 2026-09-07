import Banner from "@/components/Banner";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import BlogCard from "@/components/BlogCard";

const blogs = [
  {
    id: 1,
    title: "Top sản phẩm công nghệ đáng mua năm 2026",
    description: "Khám phá những sản phẩm công nghệ nổi bật và đáng chú ý.",
  },
  {
    id: 2,
    title: "Cách chọn laptop phù hợp với nhu cầu",
    description: "Một số tiêu chí giúp bạn chọn laptop phù hợp.",
  },
  {
    id: 3,
    title: "Những phụ kiện công nghệ cần có",
    description: "Các phụ kiện hữu ích cho công việc và giải trí.",
  },
];

export default function Home() {
  return (
    <main>
      <Banner />

      <CategorySection />

      <ProductSection />

      <section>
        <h2>Bài viết mới nhất</h2>

        <div>
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              description={blog.description}
            />
          ))}
        </div>
      </section>
    </main>
  );
}