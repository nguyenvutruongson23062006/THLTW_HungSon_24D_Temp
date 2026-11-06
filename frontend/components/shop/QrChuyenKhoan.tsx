"use client";

import Image from "next/image";
import { useState } from "react";
import type { DonCuaToi } from "@/lib/shop/donHang";
import { khung, tienShop } from "./GiaoDien";

export default function QrChuyenKhoan({ don }: { don: Pick<DonCuaToi, 'ma_don_hang' | 'tong_tien' | 'chuyen_khoan' | 'so_thang_tra_gop' | 'lich_tra_gop'> }) {
  const [loi, setLoi] = useState(false);
  const c = don.chuyen_khoan;
  const [ky, setKy] = useState(1);
  const lich = don.lich_tra_gop ?? [];
  const soTien = Number(lich.length ? lich.find((d) => d.ky === ky)?.so_tien ?? lich[0].so_tien : don.tong_tien);
  const noiDung = (c?.noi_dung ?? "") + (lich.length ? ` KY${ky}` : "");
  const query = new URLSearchParams({ amount: String(soTien), addInfo: noiDung, accountName: c?.chu_tai_khoan ?? "" });
  const url = c ? `https://img.vietqr.io/image/${c.ngan_hang_bin}-${c.tai_khoan_nhan}-compact2.png?${query}` : "";
  return <section className={khung + " space-y-4 border-blue-500/50"}>
    <h2 className="text-xl font-semibold">Quét QR chuyển khoản ngân hàng</h2>
    {lich.length > 0 && <label className="block text-sm">Chọn kỳ cần chuyển khoản (0% lãi)<select className="ml-3 rounded-lg bg-slate-800 p-2" value={ky} onChange={(e) => { setKy(Number(e.target.value)); setLoi(false); }}>{lich.map((d) => <option key={d.ky} value={d.ky}>Tháng {d.ky} — {tienShop(d.so_tien)}</option>)}</select><span className="mt-2 block text-amber-200">QR theo từng kỳ. Chỉ chuyển cho kỳ chưa trả; cửa hàng đối soát từng giao dịch.</span></label>}
    {!c ? <p className="text-amber-200">Cửa hàng chưa cấu hình tài khoản nhận tiền. Quản trị viên vào Cài đặt, nhập mã BIN ngân hàng, số tài khoản và tên chủ tài khoản rồi lưu để hiện QR.</p> : <>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex justify-center rounded-xl bg-white p-3">
          {Number.isSafeInteger(soTien) && soTien > 0 && !loi ? <Image unoptimized src={url} alt={`QR chuyển khoản đơn ${don.ma_don_hang}`} width={300} height={380} className="h-auto max-w-full object-contain" onError={() => setLoi(true)} /> : <p className="p-4 text-sm text-red-700">Không tải được QR. Vui lòng chuyển khoản bằng thông tin bên cạnh.</p>}
        </div>
        <div className="space-y-3 break-words text-sm">
          <p>Mã ngân hàng: <strong>{c.ngan_hang_bin}</strong></p>
          <p>Số tài khoản: <strong>{c.tai_khoan_nhan}</strong></p>
          <p>Chủ tài khoản: <strong>{c.chu_tai_khoan}</strong></p>
          <p>Số tiền: <strong>{tienShop(soTien)}</strong></p>
          <p>Nội dung: <strong>{noiDung}</strong></p>
          <p>Mở ứng dụng ngân hàng hỗ trợ VietQR, quét mã và kiểm tra đúng người nhận, số tiền trước khi chuyển.</p>
        </div>
      </div>
      <p className="text-xs text-slate-400">Ảnh QR được tạo qua VietQR.io với thông tin tài khoản nhận tiền, số tiền và mã đơn. Cửa hàng xác nhận sau khi kiểm tra tiền nhận được; quét QR không tự đánh dấu đã thanh toán.</p>
    </>}
  </section>;
}
