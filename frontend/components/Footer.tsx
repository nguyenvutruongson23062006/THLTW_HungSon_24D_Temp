import Link from "next/link";
import BlogCard from "@/components/BlogCard";

const danhSachBaiViet = [
  {
    id: 1,
    title: "Top sản phẩm đáng mua năm 2026",
    description: "Khám phá những sản phẩm công nghệ nổi bật và đáng chú ý.",
  },
  {
    id: 2,
    title: "Cách chọn moto phù hợp với nhu cầu",
    description: "Một số tiêu chí giúp bạn chọn chiếc moto phù hợp.",
  },
  {
    id: 3,
    title: "Những phụ kiện cần có",
    description: "Các phụ kiện hữu ích cho chuyến đi.",
  },
];

export default function Footer() {
  return (
    <footer
      aria-labelledby="tieu-de-bai-viet-footer"
      className="mt-auto border-t border-slate-800 bg-slate-950 text-white"
    >
      <div className="h-1 bg-linear-to-r from-blue-600 via-sky-400 to-slate-950" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
          <div className="min-w-0 border-b border-slate-800 pb-8 lg:col-span-4 lg:border-b-0 lg:pb-0">
            <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-blue-400">
              MÔ TÔ & PHỤ KIỆN
            </p>

            <Link
              href="/"
              className="inline-block rounded-sm text-xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 sm:text-2xl"
            >
              MOTOCYCLE<span className="text-blue-400">LEGEND</span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              Khám phá những chiếc mô tô đầy phong cách cùng phụ kiện và
              trang bị cho hành trình của bạn.
            </p>

            <p className="mt-5 text-sm font-medium text-slate-200">
              Đam mê hai bánh. Kết nối mọi hành trình.
            </p>
          </div>

          <div className="min-w-0 lg:col-span-8">
            <h2
              id="tieu-de-bai-viet-footer"
              className="text-2xl font-bold text-white sm:text-3xl"
            >
              Bài viết mới nhất
            </h2>

            <div className="mt-8 grid gap-8 md:grid-cols-3 lg:gap-6">
              {danhSachBaiViet.map((baiViet) => (
                <BlogCard
                  key={baiViet.id}
                  id={baiViet.id}
                  title={baiViet.title}
                  description={baiViet.description}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-800 py-6 text-xs leading-6 text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MOTOCYCLELEGEND. Bảo lưu mọi quyền.</p>
          <p>Mô tô, phụ kiện và đam mê trên mọi cung đường.</p>
        </div>
      </div>
    </footer>
  );
}
