import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
}: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${id}`}>
        <Image
          src={image}
          alt={name}
          width={300}
          height={300}
          className="h-64 w-full object-cover"
        />
      </Link>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>

        <p className="mt-2 text-xl font-bold text-blue-600">
          {price.toLocaleString("vi-VN")} ₫
        </p>

        <Link
          href={`/products/${id}`}
          className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
