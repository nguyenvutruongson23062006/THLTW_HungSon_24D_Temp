"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mucQuanTri = [
  { nhan: "Dashboard", duongDan: "/admin", bieuTuong: "⌂" },
  { nhan: "Xe máy", duongDan: "/admin/san-pham", bieuTuong: "♢" },
  { nhan: "Hãng xe", duongDan: "/admin/thuong-hieu", bieuTuong: "◈" },
  { nhan: "Danh mục", duongDan: "/admin/danh-muc", bieuTuong: "▤" },
  { nhan: "Khách hàng", duongDan: "/admin/nguoi-dung", bieuTuong: "♙" },
  { nhan: "Đơn hàng", duongDan: "/admin/don-hang", bieuTuong: "▱" },
  { nhan: "Nhập hàng", duongDan: "/admin/phieu-nhap", bieuTuong: "↓" },
  { nhan: "Xuất hàng", duongDan: "/admin/phieu-xuat", bieuTuong: "↑" },
  { nhan: "Báo cáo", duongDan: "/admin/bao-cao", bieuTuong: "▥" },
  { nhan: "Cài đặt", duongDan: "/admin/cai-dat", bieuTuong: "⚙" },
];

export default function ThanhBenQuanTri() {
  const duongDanHienTai = usePathname();

  function dangChon(duongDan: string) {
    return duongDan === "/admin"
      ? duongDanHienTai === duongDan
      : duongDanHienTai.startsWith(duongDan);
  }

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col bg-[#09233d] text-white lg:flex">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            🏍
          </span>
          <span>
            <span className="block text-xl font-bold tracking-tight">
              MotoShop
            </span>
            <span className="block text-[10px] text-slate-300">
              Quản lý cửa hàng xe máy
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Menu Admin">
        {mucQuanTri.map((muc) => (
          <Link
            key={muc.duongDan}
            href={muc.duongDan}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
              dangChon(muc.duongDan)
                ? "bg-[#1677e8] font-semibold text-white shadow-lg shadow-blue-950/20"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="w-6 text-center text-lg" aria-hidden="true">
              {muc.bieuTuong}
            </span>
            <span>{muc.nhan}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-5">
        <button
          type="button"
          className="flex items-center gap-3 text-sm text-slate-200 transition hover:text-white"
        >
          <span className="text-lg" aria-hidden="true">
            ⇥
          </span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
