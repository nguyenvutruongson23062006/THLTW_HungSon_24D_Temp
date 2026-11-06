"use client";

import { useCallback, useEffect, useState } from "react";
import { guiShop } from "@/lib/shop/api";
import { laThanhToanOnline, moThanhToan, type ThongTinThanhToan } from "@/lib/shop/thanhToan";
import { nut, nutPhu, tienShop } from "./GiaoDien";

export default function ThanhToanDon({ ma, khoa, online = true }: { ma: number; khoa?: string; online?: boolean }) {
  const [data, setData] = useState<ThongTinThanhToan | null>(null);
  const [loi, setLoi] = useState("");
  const [dangMo, setDangMo] = useState(false);
  const [dangTai, setDangTai] = useState(false);
  const tai = useCallback(async () => {
    if (!khoa || !online) return;
    setDangTai(true);
    try {
      setData(await guiShop<ThongTinThanhToan>("/thanh-toan/trang-thai", { ma_don_hang: ma, khoa }));
      setLoi("");
    } catch (e) { setLoi(e instanceof Error ? e.message : "Không thể kiểm tra thanh toán."); }
    finally { setDangTai(false); }
  }, [ma, khoa, online]);
  const daTra = data?.trang_thai_thanh_toan === "da_thanh_toan";
  useEffect(() => {
    if (!online || !khoa) return;
    let soLan = 0;
    const batDau = window.setTimeout(() => { void tai(); }, 0);
    const lap = window.setInterval(() => { if (++soLan <= 12 && !daTra) void tai(); }, 5000);
    return () => { clearTimeout(batDau); clearInterval(lap); };
  }, [tai, online, khoa, daTra]);
  if (!online || !khoa) return null;
  async function mo() {
    if (!khoa) return;
    setDangMo(true); setLoi("");
    try { await moThanhToan(ma, khoa); }
    catch (e) { setLoi(e instanceof Error ? e.message : "Chưa mở được VNPay."); setDangMo(false); }
  }
  const trangThai = data?.giao_dich?.trang_thai;
  return (
    <section className="space-y-4 rounded-xl border border-blue-500/50 bg-blue-500/10 p-5" aria-live="polite">
      <h2 className="text-xl font-bold">Thanh toán online · Đơn #{ma}</h2>
      {data && <p className="font-semibold">Số tiền: {tienShop(data.tong_tien)}</p>}
      <p className={daTra ? "text-emerald-300" : "text-amber-200"}>
        {daTra ? "VNPay đã xác nhận nhận tiền." : data?.trang_thai_don === "da_huy" ? "Đơn đã hủy, không thể tiếp tục thanh toán." : trangThai === "that_bai" ? "Giao dịch không thành công hoặc đã bị hủy tại cổng. Bạn có thể thanh toán lại." : trangThai === "het_han" ? "Phiên thanh toán đã hết hạn. Bạn có thể tạo phiên mới." : trangThai === "dang_cho" ? "Đang chờ xác nhận từ VNPay. Nếu đã bị trừ tiền, hãy chờ cập nhật và không trả thêm lần nữa." : "Đơn chưa thanh toán. Bấm bên dưới để mở VNPay."}
      </p>
      {data?.can_doi_soat && <p role="alert" className="text-rose-300">Giao dịch cần đối soát do tiền về sau khi hủy đơn hoặc có thanh toán trùng. Vui lòng liên hệ cửa hàng, không thanh toán thêm.</p>}
      {loi && <p role="alert" className="text-rose-300">{loi}</p>}
      <div className="flex flex-wrap gap-3">
        {data && !daTra && data.trang_thai_don === "cho_xac_nhan" && laThanhToanOnline(data.phuong_thuc) && <button disabled={dangMo} className={nut} onClick={mo}>{dangMo ? "Đang mở VNPay..." : trangThai === "dang_cho" ? "Mở lại phiên VNPay đang chờ" : "Thanh toán qua VNPay"}</button>}
        <button disabled={dangTai} className={nutPhu} onClick={() => void tai()}>{dangTai ? "Đang kiểm tra..." : "Kiểm tra kết quả"}</button>
      </div>
      <p className="text-xs text-slate-300">Trang tự kiểm tra trong khoảng 1 phút. Kết quả chỉ được xác nhận sau khi cổng gửi thông báo về hệ thống. Hoàn tiền online cần cửa hàng đối soát với VNPay.</p>
    </section>
  );
}
