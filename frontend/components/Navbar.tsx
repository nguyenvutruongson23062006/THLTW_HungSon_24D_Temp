import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-black">
          MOTOCYCLELEGEND
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-700 transition hover:text-black">
            Trang chủ
          </Link>

          <Link
            href="/products"
            className="text-gray-700 transition hover:text-black"
          >
            Sản phẩm
          </Link>

          <Link
            href="/cart"
            className="text-gray-700 transition hover:text-black"
          >
            Giỏ hàng
          </Link>

          <Link
            href="/login"
            className="rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </nav>
  );
}
