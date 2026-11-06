"use client";

import { useEffect, useState } from "react";
import { shopApi } from "@/lib/shop/api";
import type { PhuongThuc } from "@/lib/shop/thanhToan";

export default function ChonPhuongThucThanhToan({ giaTri, onChon }: {
  giaTri: string; onChon: (ma: string) => void;
}) {
  const [danhSach, setDanhSach] = useState<PhuongThuc[]>([]);
  const [loi, setLoi] = useState("");
  useEffect(() => {
    let huy = false;
    shopApi<PhuongThuc[]>("/thanh-toan/phuong-thuc").then((data) => {
      if (!huy) setDanhSach(data);
    }).catch(() => { if (!huy) setLoi("Không tải được phương thức thanh toán. Hãy tải lại trang."); });
    return () => { huy = true; };
  }, []);
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-lg font-semibold">Phương thức thanh toán</legend>
      {loi && <p role="alert" className="text-sm text-red-500">{loi}</p>}
      {!danhSach.length && !loi && <p className="text-sm">Đang tải phương thức...</p>}
      {danhSach.map((p) => (
        <label key={p.ma} className={`flex gap-3 rounded-xl border p-4 transition ${giaTri === p.ma ? "border-blue-500 bg-blue-500/10" : "border-slate-400/40"} ${!p.san_sang ? "opacity-60" : "cursor-pointer"}`}>
          <input type="radio" name="phuong-thuc" value={p.ma} checked={giaTri === p.ma} disabled={!p.san_sang} onChange={() => onChon(p.ma)} className="mt-1 accent-blue-600" />
          <span><span className="block text-sm font-semibold">{p.ten}</span><span className="mt-1 block text-xs leading-5">{p.mo_ta}</span></span>
        </label>
      ))}
      <p className="text-xs leading-5 opacity-75">Với chuyển khoản, vui lòng ghi nội dung theo mã đơn hàng. Cửa hàng xác nhận thanh toán sau khi kiểm tra tiền nhận được.</p>
    </fieldset>
  );
}
