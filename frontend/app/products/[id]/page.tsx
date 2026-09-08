import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButtonProps";

const products = [
  {
    id: 1,
    ten: "Yamaha YZF-R7",
    gia: 269000000,
    giaKhuyenMai: 259000000,
    image: "/products/yamaha-r7.jpg",
    moTa: "Yamaha YZF-R7 là mẫu sportbike 689cc sử dụng động cơ CP2 2 xy-lanh, thiết kế thể thao và khả năng vận hành linh hoạt.",
    tonKho: 5,
  },
  {
    id: 2,
    ten: "Yamaha MT-07",
    gia: 189000000,
    giaKhuyenMai: 179000000,
    image: "/products/yamaha-mt07.jpg",
    moTa: "Yamaha MT-07 là mẫu naked bike nổi tiếng với động cơ CP2 689cc, mô-men xoắn mạnh và thiết kế gọn gàng.",
    tonKho: 8,
  },
  {
    id: 3,
    ten: "Honda CBR650R",
    gia: 254000000,
    giaKhuyenMai: 244000000,
    image: "/products/honda-cbr650r.jpg",
    moTa: "Honda CBR650R sở hữu động cơ 4 xy-lanh 649cc, phong cách sportbike và khả năng vận hành mạnh mẽ.",
    tonKho: 4,
  },
  {
    id: 4,
    ten: "Honda CB650R",
    gia: 249000000,
    giaKhuyenMai: 239000000,
    image: "/products/honda-cb650r.jpg",
    moTa: "Honda CB650R là naked bike 4 xy-lanh 649cc với thiết kế Neo Sports Café đặc trưng.",
    tonKho: 6,
  },
  {
    id: 5,
    ten: "Kawasaki Ninja 650",
    gia: 209000000,
    giaKhuyenMai: 199000000,
    image: "/products/kawasaki-ninja-650.jpg",
    moTa: "Kawasaki Ninja 650 là sportbike 649cc cân bằng giữa hiệu năng, sự linh hoạt và khả năng sử dụng hằng ngày.",
    tonKho: 7,
  },
  {
    id: 6,
    ten: "Kawasaki Z650",
    gia: 194000000,
    giaKhuyenMai: 184000000,
    image: "/products/kawasaki-z650.jpg",
    moTa: "Kawasaki Z650 là naked bike 649cc với thiết kế Sugomi đặc trưng và khả năng tăng tốc mạnh mẽ.",
    tonKho: 9,
  },
  {
    id: 7,
    ten: "Suzuki GSX-8R",
    gia: 285000000,
    giaKhuyenMai: 275000000,
    image: "/products/suzuki-gsx-8r.jpg",
    moTa: "Suzuki GSX-8R là sportbike sử dụng động cơ 776cc 2 xy-lanh, hướng đến khả năng vận hành thể thao nhưng vẫn dễ sử dụng.",
    tonKho: 3,
  },
  {
    id: 8,
    ten: "Triumph Daytona 660",
    gia: 299000000,
    giaKhuyenMai: 289000000,
    image: "/products/triumph-daytona-660.jpg",
    moTa: "Triumph Daytona 660 là sportbike 3 xy-lanh 660cc, nổi bật với âm thanh đặc trưng và khả năng vận hành thể thao.",
    tonKho: 4,
  },
];

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
        <h1 className="text-3xl font-bold text-white">
          Không tìm thấy sản phẩm
        </h1>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Quay lại sản phẩm
        </Link>
      </main>
    );
  }

  const relatedProducts = products.filter(
    (item) => item.id !== product.id
  );

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
            className="h-auto w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white">
            {product.ten}
          </h1>

          <div className="mt-6">
            <p className="text-lg text-white line-through">
              {product.gia.toLocaleString("vi-VN")} ₫
            </p>

            <p className="text-2xl font-bold text-blue-600">
              {product.giaKhuyenMai.toLocaleString("vi-VN")} ₫
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white">
              Mô tả mô tô
            </h2>

            <p className="mt-3 leading-7 text-white">
              {product.moTa}
            </p>
          </div>

          <div className="mt-6">
            <span className="font-semibold text-white">
              Tồn kho:
            </span>{" "}
            <span className="text-white">
              {product.tonKho} xe
            </span>
          </div>

          <AddToCartButton
            id={product.id}
            ten={product.ten}
            gia={product.gia}
            giaKhuyenMai={product.giaKhuyenMai}
            image={product.image}
          />
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-8 text-2xl font-bold text-white">
          Mô tô liên quan
        </h2>

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
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold text-gray-900">
                  {item.ten}
                </h3>

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

