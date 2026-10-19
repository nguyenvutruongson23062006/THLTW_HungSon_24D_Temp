import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      aria-label="Điều hướng cửa hàng"
      className="bg-slate-950 text-white"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-4 sm:flex-row sm:justify-between">
        <Link
          href="/"
          className="shrink-0 rounded-sm text-xl font-bold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 sm:text-2xl"
        >
          MOTOCYCLE<span className="text-blue-400">LEGEND</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium sm:gap-x-6">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-sm text-slate-300 transition-colors hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
          >
            Trang chủ
          </Link>

          <Link
            href="/products"
            className="inline-flex min-h-11 items-center rounded-sm text-slate-300 transition-colors hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
          >
            Sản phẩm
          </Link>

          <Link
            href="/cart"
            className="inline-flex min-h-11 items-center rounded-sm text-slate-300 transition-colors hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
          >
            Giỏ hàng
          </Link>

          <Link
            href="/login"
            className="inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="h-1 bg-linear-to-r from-blue-600 via-sky-400 to-slate-950"
      />
    </nav>
  );
}
