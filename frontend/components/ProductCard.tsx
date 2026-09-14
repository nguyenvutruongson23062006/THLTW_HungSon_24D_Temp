import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: number;
  name: string;
  originalPrice: number;
  price: number;
  image: string;
};

export default function ProductCard({
  id,
  name,
  originalPrice,
  price,
  image,
}: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={name}
            fill
            loading="eager"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition duration-300 hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>

        {originalPrice > price && (
          <p className="mt-2 text-sm text-gray-400 line-through">
            {originalPrice.toLocaleString("vi-VN")} ₫
          </p>
        )}

        <p className="text-xl font-bold text-blue-600">
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
