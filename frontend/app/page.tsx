import Banner from "@/components/Banner";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import BlogCard from "@/components/BlogCard";

const blogs = [
  {
    id: 1,
    title: "Cách chọn xe máy phù hợp với nhu cầu",
    description: "Những tiêu chí về mục đích sử dụng, tư thế ngồi và ngân sách khi lựa chọn xe máy.",
  },
  {
    id: 2,
    title: "Bảo dưỡng xe máy: những hạng mục cần lưu ý",
    description: "Tìm hiểu việc kiểm tra dầu máy, lốp, phanh và lịch bảo dưỡng theo hướng dẫn của nhà sản xuất.",
  },
  {
    id: 3,
    title: "Cách chọn mũ bảo hiểm vừa vặn",
    description: "Những điểm cần chú ý về kích cỡ, quai cài và độ vừa vặn khi chọn mũ bảo hiểm.",
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
