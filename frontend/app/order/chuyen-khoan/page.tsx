"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { guiShop } from "@/lib/shop/api";
import type { DonCuaToi } from "@/lib/shop/donHang";
import QrChuyenKhoan from "@/components/shop/QrChuyenKhoan";
import { nutPhu } from "@/components/shop/GiaoDien";
import { truSanPhamDaThanhToan } from "@/lib/cart";

type Phien = { ma: number; khoa: string };
type Don = Pick<DonCuaToi, 'ma_don_hang' | 'tong_tien' | 'chuyen_khoan' | 'trang_thai' | 'trang_thai_thanh_toan' | 'so_thang_tra_gop' | 'lich_tra_gop'>;

export default function TrangChuyenKhoan() {
  const [don, setDon] = useState<Don | null>(null);
  const [phien, setPhien] = useState<Phien | null>(null);
  const [loi, setLoi] = useState("");
  const [tai, setTai] = useState(false);
  async function kiemTra(p: Phien) {
    setTai(true); setLoi("");
    try {
      const moi = await guiShop<Don>("/thanh-toan/chuyen-khoan", { ma_don_hang: p.ma, khoa: p.khoa });
      setDon(moi);
      if (moi.trang_thai_thanh_toan === 'da_thanh_toan') {
        const key = `shop_don_gio_${p.ma}`;
        const cu = sessionStorage.getItem(key);
        if (cu) { truSanPhamDaThanhToan(JSON.parse(cu)); sessionStorage.removeItem(key); }
      }
    }
    catch(e) { setLoi(e instanceof Error ? e.message : "Không tải được thanh toán."); }
    finally { setTai(false); }
  }
  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const p: Phien = hash.has('khoa') ? { ma: Number(hash.get('ma')), khoa: hash.get('khoa')! } : JSON.parse(sessionStorage.getItem('shop_don_qr') ?? 'null');
        window.history.replaceState(null, '', '/order/chuyen-khoan');
        if (!p || !Number.isInteger(p.ma) || p.ma < 1 || !/^[a-f0-9]{64}$/.test(p.khoa)) throw new Error('Không tìm thấy phiên thanh toán. Hãy mở lại đơn hàng.');
        sessionStorage.setItem('shop_don_qr', JSON.stringify(p)); setPhien(p); void kiemTra(p);
      } catch(e) { setLoi(e instanceof Error ? e.message : 'Không tìm thấy đơn.'); }
    });
  }, []);
  return <main className="mx-auto max-w-4xl space-y-6 px-5 py-12 text-white">
    <p className="text-sm text-blue-300">Sản phẩm được giữ trong giỏ đến khi cửa hàng xác nhận thanh toán.</p>
    <h1 className="text-3xl font-bold">Quét mã QR để thanh toán {don && `#${don.ma_don_hang}`}</h1>
    {loi && <p role="alert" className="rounded-xl bg-red-950 p-4 text-red-200">{loi}</p>}
    {tai && <p>Đang kiểm tra thông tin thanh toán...</p>}
    {don && (don.trang_thai_thanh_toan === 'da_thanh_toan' ? <p className="rounded-xl bg-emerald-950 p-6 text-emerald-200">Cửa hàng đã xác nhận thanh toán thành công.</p> : don.trang_thai === 'da_huy' ? <p className="text-amber-200">Đơn đã hủy. Vui lòng không chuyển tiền cho đơn này.</p> : <><QrChuyenKhoan don={don} /><p className="text-sm text-slate-300">Sau khi chuyển tiền, bấm kiểm tra kết quả. Cửa hàng cần kiểm tra tiền nhận được và xác nhận; vui lòng không chuyển thêm nếu đã chuyển thành công.</p></>)}
    <div className="flex flex-wrap gap-3">
      {phien && <button className={nutPhu} disabled={tai} onClick={() => void kiemTra(phien)}>Kiểm tra kết quả thanh toán</button>}
      <Link className={nutPhu} href="/don-hang">Đơn hàng của tôi</Link><Link className={nutPhu} href="/products">Tiếp tục mua sắm</Link>
      <Link className={nutPhu} href="/cart">Quay lại giỏ hàng</Link>
    </div>
  </main>;
}
