import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButtonProps";
import { products } from "@/lib/products";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const productId = Number(id);

  const product = products.find((item) => item.id === productId);

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-white">Không tìm thấy mô tô</h1>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Quay lại danh sách mô tô
        </Link>
      </main>
    );
  }

  const relatedProducts = products.filter((item) => item.id !== product.id);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href="/products"
        className="mb-8 inline-block text-blue-600 hover:underline"
      >
        ← Quay lại danh sách mô tô
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-white">
          <Image
            src={product.image}
            alt={product.ten}
            width={600}
            height={600}
            loading="eager"
            className="h-auto w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white">{product.ten}</h1>

          <div className="mt-6">
            <p className="text-lg text-gray-400 line-through">
              {product.gia.toLocaleString("vi-VN")} ₫
            </p>

            <p className="text-2xl font-bold text-blue-600">
              {product.giaKhuyenMai.toLocaleString("vi-VN")} ₫
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white">Mô tả mô tô</h2>

            <p className="mt-3 leading-7 text-gray-300">{product.moTa}</p>
          </div>

          <div className="mt-6">
            <span className="font-semibold text-white">Tồn kho:</span>{" "}
            <span className="text-gray-300">{product.tonKho} xe</span>
          </div>

          <AddToCartButton
            id={product.id}
            ten={product.ten}
            gia={product.gia}
            giaKhuyenMai={product.giaKhuyenMai}
            image={product.image}
            tonKho={product.tonKho}
          />
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-8 text-2xl font-bold text-white">Mô tô liên quan</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {relatedProducts.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Image
                src={item.image}
                alt={item.ten}
                width={300}
                height={300}
                loading="eager"
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{item.ten}</h3>

                <p className="mt-2 font-bold text-red-600">
                  {item.giaKhuyenMai.toLocaleString("vi-VN")} ₫
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
