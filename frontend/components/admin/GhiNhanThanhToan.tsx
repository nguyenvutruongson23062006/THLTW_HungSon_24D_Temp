"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api/apiClient";

type KetQua = {
  trang_thai_thanh_toan: string;
  ma_giao_dich: string | null;
  ngay_cap_nhat: string | null;
};

export default function GhiNhanThanhToan({
  ma,
  trangThai,
  trangThaiDon,
  phuongThuc,
  onCapNhat,
}: {
  ma: number;
  trangThai: string;
  trangThaiDon: string;
  phuongThuc?: string;
  onCapNhat: (data: KetQua) => void;
}) {
  const [maGiaoDich, setMaGiaoDich] = useState("");
  const [dangLuu, setDangLuu] = useState(false);
  const [thongBao, setThongBao] = useState("");
  const [loi, setLoi] = useState("");
  const moi =
    trangThai === "chua_thanh_toan" && trangThaiDon !== "da_huy"
      ? "da_thanh_toan"
      : trangThai === "da_thanh_toan"
        ? "da_hoan_tien"
        : null;
  const nhan =
    moi === "da_thanh_toan" ? "Ghi nhận đã thu tiền" : "Ghi nhận đã hoàn tiền";

  async function luu() {
    if (
      !moi ||
      !window.confirm(
        `${nhan} cho đơn #${ma}? Chỉ xác nhận sau khi đã kiểm tra giao dịch thực tế.`,
      )
    )
      return;
    setDangLuu(true);
    setLoi("");
    setThongBao("");
    try {
      const data = await apiRequest<KetQua>(
        `/admin/don-hang/${ma}/thanh-toan`,
        {
          method: "PATCH",
          body: JSON.stringify({
            trang_thai_thanh_toan: moi,
            trang_thai_hien_tai: trangThai,
            ma_giao_dich: maGiaoDich.trim() || undefined,
          }),
        },
      );
      onCapNhat(data);
      setMaGiaoDich("");
      setThongBao("Đã lưu trạng thái thanh toán.");
    } catch (error) {
      setLoi(error instanceof Error ? error.message : "Không thể cập nhật.");
    } finally {
      setDangLuu(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Ghi nhận giao dịch</h2>
      <p className="mt-2 text-sm text-slate-500">
        {phuongThuc?.startsWith("vnpay_") ? "VNPay tự động xác nhận khi nhận thông báo hợp lệ từ cổng. Hoàn tiền online cần xử lý, đối soát qua VNPay; trang này không thực hiện hoàn tiền." : "Cập nhật sau khi đã thu hoặc hoàn tiền thực tế. Thao tác này lưu thông tin đối soát của cửa hàng."}
      </p>
      {moi && !phuongThuc?.startsWith("vnpay_") && (
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            aria-label="Mã giao dịch đối soát"
            maxLength={255}
            placeholder="Mã giao dịch (nếu có)"
            value={maGiaoDich}
            onChange={(e) => setMaGiaoDich(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            disabled={dangLuu}
            onClick={luu}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {dangLuu ? "Đang lưu..." : nhan}
          </button>
        </div>
      )}
      {loi && (
        <p role="alert" className="mt-3 text-sm text-rose-700">
          {loi} Hãy tải lại đơn nếu thông tin đã thay đổi.
        </p>
      )}
      {thongBao && (
        <p role="status" className="mt-3 text-sm text-emerald-700">
          {thongBao}
        </p>
      )}
    </section>
  );
}
