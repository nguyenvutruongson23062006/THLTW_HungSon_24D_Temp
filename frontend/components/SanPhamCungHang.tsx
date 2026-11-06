"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/products";

export default function SanPhamCungHang({ sanPhams, hang }: { sanPhams: Product[]; hang: string }) {
  const [trang, setTrang] = useState(1);
  const soTrang = Math.max(1, Math.ceil(sanPhams.length / 4));
  const hienTai = Math.min(trang, soTrang);
  const ds = sanPhams.slice((hienTai - 1) * 4, hienTai * 4);
  const nut = "rounded-lg border border-slate-600 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40";
  return <section className="mt-16">
    <h2 className="mb-8 text-2xl font-bold text-white">Sản phẩm cùng hãng{hang ? ` ${hang}` : ""}</h2>
    {!sanPhams.length ? <p className="text-gray-300">Chưa có sản phẩm khác cùng hãng.</p> : <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {ds.map((item) => <Link key={item.id} href={`/products/${item.id}`} className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <Image src={item.image} alt={item.ten} width={300} height={300} className="h-48 w-full object-cover" />
          <div className="p-4"><h3 className="font-semibold text-gray-900">{item.ten}</h3><p className="mt-2 font-bold text-red-600">{item.giaKhuyenMai.toLocaleString("vi-VN")} ₫</p></div>
        </Link>)}
      </div>
      <nav aria-label="Phân trang sản phẩm cùng hãng" className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-300">{sanPhams.length} sản phẩm · Trang {hienTai}/{soTrang}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={nut} disabled={hienTai === 1} onClick={() => setTrang(hienTai - 1)}>Trước</button>
          {Array.from({ length: soTrang }, (_, i) => i + 1).map((n) => <button key={n} type="button" aria-label={`Trang ${n}`} aria-current={n === hienTai ? "page" : undefined} className={nut + (n === hienTai ? " border-blue-500 bg-blue-600" : "")} onClick={() => setTrang(n)}>{n}</button>)}
          <button type="button" className={nut} disabled={hienTai === soTrang} onClick={() => setTrang(hienTai + 1)}>Sau</button>
        </div>
      </nav>
    </>}
  </section>;
}
