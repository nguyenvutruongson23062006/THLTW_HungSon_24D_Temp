import Link from "next/link";
export default function Banner() {
  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900">
          chào mừng đến với thiên đường MOTO
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Khám phá những cổ máy đỉnh cao, mạnh mẽ và đầy phong cách, được thiết
          kế để chinh phục mọi cung đường. Từ những chiếc mô tô thể thao đến
          những chiếc cruiser sang trọng, chúng tôi mang đến cho bạn trải nghiệm
          lái xe tuyệt vời và cảm giác tự do trên hai bánh.
        </p>

        <div className="mt-8">
          <Link
            href="/products"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Khám phá ngay
          </Link>
        </div>
      </div>
    </section>
  );
}
