"use client";
import { useState } from "react";

export function usePhanTrangDanhSach() {
  const [trang, setTrang] = useState(1);
  const [kichThuoc, setKichThuoc] = useState(10);
  function cat<T>(ds: T[]): T[] {
    const hienTai = Math.min(trang, Math.max(1, Math.ceil(ds.length / kichThuoc)));
    return ds.slice((hienTai - 1) * kichThuoc, hienTai * kichThuoc);
  }
  function thanh(tong: number) {
    const soTrang = Math.max(1, Math.ceil(tong / kichThuoc));
    const hienTai = Math.min(trang, soTrang);
    const nut = "rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40";
    return <nav aria-label="Phân trang danh sách" className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white p-4 text-sm text-slate-700">
      <span>Tổng {tong} mục · Trang {hienTai}/{soTrang}</span>
      <div className="flex flex-wrap items-center gap-2">
        <label>Số dòng <select className={nut} value={kichThuoc} onChange={(e) => { setKichThuoc(Number(e.target.value)); setTrang(1); }}>{[10,20,50].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
        <button type="button" className={nut} disabled={hienTai === 1} onClick={() => setTrang(1)}>Đầu</button>
        <button type="button" className={nut} disabled={hienTai === 1} onClick={() => setTrang(hienTai - 1)}>Trước</button>
        <button type="button" className={nut} disabled={hienTai === soTrang} onClick={() => setTrang(hienTai + 1)}>Sau</button>
        <button type="button" className={nut} disabled={hienTai === soTrang} onClick={() => setTrang(soTrang)}>Cuối</button>
      </div>
    </nav>;
  }
  return { cat, thanh };
}
