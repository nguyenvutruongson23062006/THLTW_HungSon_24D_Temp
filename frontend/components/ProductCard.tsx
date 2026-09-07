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
    <div>
        <Image
            src={image}
            alt={name}
            width={300}
            height={300}
        />

      <h3>{name}</h3>

      <p>{price.toLocaleString("vi-VN")} ₫</p>

      <Link href={`/products/${id}`}>
        Xem chi tiết
      </Link>
    </div>
  );
}