"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThanhToanDon from "@/components/shop/ThanhToanDon";
import { nutPhu } from "@/components/shop/GiaoDien";

export default function KetQuaThanhToan() {
  const [thongTin, setThongTin] = useState<{ ma: number; khoa: string } | null>(null);
  const [loi, setLoi] = useState("");
  useEffect(() => {
    Promise.resolve().then(() => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const query = new URLSearchParams(window.location.search);
      window.history.replaceState(null, "", "/order/thanh-toan");
      if (query.has("loi")) { setLoi("Thông tin trả về không hợp lệ. Hãy mở đơn hàng của bạn để kiểm tra; không thanh toán thêm nếu tài khoản đã bị trừ tiền."); return; }
      try {
        const data = hash.has("khoa") ? { ma: Number(hash.get("ma")), khoa: hash.get("khoa")! } : JSON.parse(sessionStorage.getItem("shop_don_thanh_toan") ?? "null");
        if (!data || !Number.isInteger(data.ma) || data.ma < 1 || !/^[a-f0-9]{64}$/.test(data.khoa)) throw new Error();
        sessionStorage.setItem("shop_don_thanh_toan", JSON.stringify(data));
        setThongTin(data);
      } catch { setLoi("Không tìm thấy phiên thanh toán. Mở đơn hàng trong tài khoản để tiếp tục kiểm tra."); }
    });
  }, []);
  return <main className="mx-auto max-w-3xl space-y-6 px-5 py-12 text-white">
    <h1 className="text-3xl font-bold">Kết quả thanh toán</h1>
    {loi && <p role="alert" className="text-rose-300">{loi}</p>}
    {thongTin && <ThanhToanDon ma={thongTin.ma} khoa={thongTin.khoa} />}
    <div className="flex flex-wrap gap-3"><Link className={nutPhu} href="/don-hang">Đơn hàng của tôi</Link><Link className={nutPhu} href="/products">Tiếp tục mua sắm</Link></div>
  </main>;
}
