"use client";

import Link from "next/link";
import { useEffect, useState, type SyntheticEvent } from "react";
import { apiRequest } from "@/lib/api/apiClient";
import { layDanhSachSanPham } from "@/lib/api/sanPhamApi";
import {
  layPhieuKho,
  type LoaiKho,
  type PhieuKho,
  type DongPhieuKho,
} from "@/lib/api/khoApi";
import type { SanPham } from "@/types/admin";

const input =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500";
const button =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50";
const tien = (n: string | number | undefined) =>
  Number(n ?? 0).toLocaleString("vi-VN") + "đ";
const LY_DO: Record<string, string> = {
  ban_hang: "Bán hàng",
  trung_bay: "Trưng bày",
  tra_hang: "Trả nhà cung cấp",
  khac: "Khác",
};

export default function QuanLyKho({
  loai,
  ma,
}: {
  loai: LoaiKho;
  ma?: number;
}) {
  const laNhap = loai === "nhap";
  const nhan = laNhap ? "nhập" : "xuất";
  const endpoint = `/admin/kho/${loai}`;
  const [danhSach, setDanhSach] = useState<PhieuKho[]>([]);
  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
  const [chiTiet, setChiTiet] = useState<PhieuKho | null>(null);
  const [tai, setTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [bao, setBao] = useState("");
  const [lanTai, setLanTai] = useState(0);
  const [thungRac, setThungRac] = useState(false);
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [trang, setTrang] = useState(1);
  const [mo, setMo] = useState(false);
  const [dangLuu, setDangLuu] = useState(false);
  const [loiForm, setLoiForm] = useState("");
  const [maSua, setMaSua] = useState<number | null>(null);
  const [soPhieu, setSoPhieu] = useState("");
  const [doiTac, setDoiTac] = useState("");
  const [lyDo, setLyDo] = useState("ban_hang");
  const [ghiChu, setGhiChu] = useState("");
  const [dong, setDong] = useState<DongPhieuKho[]>([
    { ma_san_pham: 0, so_luong: 1, don_gia: 0, ghi_chu: "" },
  ]);

  useEffect(() => {
    const ac = new AbortController();
    Promise.all([
      ma
        ? layPhieuKho(loai, ma, ac.signal)
        : apiRequest<PhieuKho[]>(`${endpoint}?thung_rac=${thungRac ? 1 : 0}`, {
            signal: ac.signal,
          }),
      layDanhSachSanPham(),
    ])
      .then(([data, products]) => {
        if (!ac.signal.aborted) {
          if (Array.isArray(data)) setDanhSach(data);
          else setChiTiet(data);
          setSanPhams(products);
        }
      })
      .catch((e) => {
        if (!ac.signal.aborted)
          setLoi(e instanceof Error ? e.message : "Không thể tải phiếu.");
      })
      .finally(() => {
        if (!ac.signal.aborted) setTai(false);
      });
    return () => ac.abort();
  }, [endpoint, loai, ma, lanTai, thungRac]);

  function taiLai() {
    setTai(true);
    setLoi("");
    setLanTai((v) => v + 1);
  }
  function layMa(p: PhieuKho) {
    return Number(laNhap ? p.ma_phieu_nhap : p.ma_phieu_xuat);
  }
  function laySo(p: PhieuKho) {
    return (laNhap ? p.so_phieu_nhap : p.so_phieu_xuat) ?? "";
  }
  function moForm(p?: PhieuKho) {
    setMaSua(p ? layMa(p) : null);
    setSoPhieu(p ? laySo(p) : "");
    setDoiTac(p?.nha_cung_cap ?? "");
    setLyDo(p?.ly_do_xuat ?? "ban_hang");
    setGhiChu(p?.ghi_chu ?? "");
    setDong(
      p?.chi_tiet.map((d) => ({
        ma_san_pham: d.ma_san_pham,
        so_luong: d.so_luong,
        don_gia: d.don_gia ?? 0,
        ghi_chu: d.ghi_chu ?? "",
      })) ?? [{ ma_san_pham: 0, so_luong: 1, don_gia: 0, ghi_chu: "" }],
    );
    setLoiForm("");
    setMo(true);
  }
  async function sua(p: PhieuKho) {
    try {
      moForm(await layPhieuKho(loai, layMa(p)));
    } catch (e) {
      setLoi(e instanceof Error ? e.message : "Không thể tải phiếu.");
    }
  }
  async function luu(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (dangLuu) return;
    setDangLuu(true);
    setLoiForm("");
    try {
      const data = {
        [laNhap ? "so_phieu_nhap" : "so_phieu_xuat"]: soPhieu.trim() || null,
        [laNhap ? "nha_cung_cap" : "ly_do_xuat"]: laNhap ? doiTac : lyDo,
        ghi_chu: ghiChu,
        chi_tiet: dong,
      };
      await apiRequest(endpoint + (maSua ? `/${maSua}` : ""), {
        method: maSua ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      setMo(false);
      setBao("Đã lưu phiếu nháp. Phiếu chưa làm thay đổi tồn kho.");
      taiLai();
    } catch (error) {
      setLoiForm(
        error instanceof Error ? error.message : "Không thể lưu phiếu.",
      );
    } finally {
      setDangLuu(false);
    }
  }
  async function xuLy(p: PhieuKho, tacVu: "hoan-tat" | "xoa" | "khoi-phuc") {
    const message =
      tacVu === "hoan-tat"
        ? `Xác nhận phiếu ${laySo(p)}? Tồn kho sẽ được ${laNhap ? "tăng" : "giảm"} theo phiếu. Phiếu hoàn tất không thể sửa.`
        : tacVu === "xoa"
          ? "Chuyển phiếu nháp vào thùng rác?"
          : "Khôi phục phiếu nháp?";
    if (!window.confirm(message)) return;
    setDangLuu(true);
    setLoi("");
    try {
      await apiRequest(
        `${endpoint}/${layMa(p)}${tacVu === "xoa" ? "" : `/${tacVu}`}`,
        { method: tacVu === "xoa" ? "DELETE" : "PATCH" },
      );
      setBao("Thao tác thành công.");
      taiLai();
    } catch (e) {
      setLoi(e instanceof Error ? e.message : "Không thể xử lý phiếu.");
    } finally {
      setDangLuu(false);
    }
  }
  const loc = danhSach.filter(
    (p) =>
      `${laySo(p)} ${p.nguoi_lap ?? ""} ${p.nha_cung_cap ?? p.ly_do_xuat ?? ""}`
        .toLowerCase()
        .includes(tuKhoa.toLowerCase()) &&
      (!trangThai || p.trang_thai === trangThai),
  );
  const soTrang = Math.max(1, Math.ceil(loc.length / 10));
  const trangHienTai = Math.min(trang, soTrang);
  const hanhDong = (p: PhieuKho) => (
    <div className="flex flex-wrap gap-2 print:hidden">
      {!ma && !thungRac && (
        <Link href={`/admin/phieu-${loai}/${layMa(p)}`} className={button}>
          Chi tiết
        </Link>
      )}
      {thungRac ? (
        <button
          disabled={dangLuu}
          className={button}
          onClick={() => xuLy(p, "khoi-phuc")}
        >
          Khôi phục
        </button>
      ) : (
        p.trang_thai === "ban_nhap" && (
          <>
            <button
              disabled={dangLuu}
              className={button}
              onClick={() => sua(p)}
            >
              Sửa
            </button>
            <button
              disabled={dangLuu}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-50"
              onClick={() => xuLy(p, "hoan-tat")}
            >
              Xác nhận hoàn tất
            </button>
            <button
              disabled={dangLuu}
              className={button + " text-rose-600"}
              onClick={() => xuLy(p, "xoa")}
            >
              Xóa
            </button>
          </>
        )
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-sky-600">Quản trị kho</p>
          <h1 className="mt-1 text-3xl font-bold">
            {ma ? "Chi tiết" : thungRac ? "Thùng rác" : "Quản lý"} phiếu {nhan}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Tồn kho chỉ thay đổi một lần khi xác nhận hoàn tất phiếu.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          {ma ? (
            <>
              <Link href={`/admin/phieu-${loai}`} className={button}>
                Quay lại
              </Link>
              <button className={button} onClick={() => window.print()}>
                In phiếu
              </button>
            </>
          ) : (
            <>
              <button className={button} onClick={taiLai}>
                Tải lại
              </button>
              <button
                className={button + " text-rose-600"}
                onClick={() => {
                  setThungRac(!thungRac);
                  setTrang(1);
                  setTai(true);
                }}
              >
                {thungRac ? "Quay lại danh sách" : "Thùng rác"}
              </button>
              {!thungRac && (
                <button
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => moForm()}
                >
                  + Tạo phiếu {nhan}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {loi && (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700"
        >
          {loi}
        </p>
      )}
      {bao && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {bao}
        </p>
      )}
      {tai ? (
        <p className="p-8 text-center text-slate-500">Đang tải dữ liệu...</p>
      ) : ma && chiTiet ? (
        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{laySo(chiTiet)}</h2>
              <p className="mt-2 text-sm">
                Người lập: {chiTiet.nguoi_lap ?? "—"}
              </p>
              <p className="mt-1 text-sm">
                Ngày tạo: {new Date(chiTiet.ngay_tao).toLocaleString("vi-VN")}
              </p>
              <p className="mt-1 text-sm">
                {laNhap ? "Nhà cung cấp" : "Lý do xuất"}:{" "}
                {chiTiet.nha_cung_cap ?? LY_DO[chiTiet.ly_do_xuat ?? ""] ?? "—"}
              </p>
              <p className="mt-1 text-sm">
                Trạng thái:{" "}
                {chiTiet.trang_thai === "ban_nhap" ? "Bản nháp" : "Hoàn tất"}
              </p>
            </div>
            {hanhDong(chiTiet)}
          </div>
          <p className="text-sm text-slate-500">
            {chiTiet.ghi_chu || "Không có ghi chú."}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3">Sản phẩm</th>
                  <th className="p-3">Số lượng</th>
                  {laNhap ? (
                    <>
                      <th className="p-3">Đơn giá</th>
                      <th className="p-3">Thành tiền</th>
                    </>
                  ) : (
                    <th className="p-3">Ghi chú</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {chiTiet.chi_tiet.map((d, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="p-3">
                      {d.ten_san_pham ?? "Sản phẩm không còn tồn tại"}
                    </td>
                    <td className="p-3">{d.so_luong}</td>
                    {laNhap ? (
                      <>
                        <td className="p-3">{tien(d.don_gia)}</td>
                        <td className="p-3">{tien(d.thanh_tien)}</td>
                      </>
                    ) : (
                      <td className="p-3">{d.ghi_chu ?? "—"}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {laNhap && (
            <p className="text-right text-lg font-bold">
              Tổng: {tien(chiTiet.tong_tien)}
            </p>
          )}
        </section>
      ) : (
        !ma && (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-wrap justify-between gap-3 p-5">
              <p className="text-sm text-slate-500">Có {loc.length} phiếu.</p>
              <div className="flex gap-2">
                <input
                  aria-label="Tìm phiếu"
                  placeholder="Tìm mã phiếu, người lập..."
                  className={input}
                  value={tuKhoa}
                  onChange={(e) => {
                    setTuKhoa(e.target.value);
                    setTrang(1);
                  }}
                />
                <select
                  aria-label="Lọc trạng thái"
                  className={input}
                  value={trangThai}
                  onChange={(e) => {
                    setTrangThai(e.target.value);
                    setTrang(1);
                  }}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="ban_nhap">Bản nháp</option>
                  <option value="hoan_tat">Hoàn tất</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-4">Số phiếu</th>
                    <th className="p-4">Người lập</th>
                    <th className="p-4">
                      {laNhap ? "Nhà cung cấp" : "Lý do xuất"}
                    </th>
                    {laNhap && <th className="p-4">Tổng tiền</th>}
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loc
                    .slice((trangHienTai - 1) * 10, trangHienTai * 10)
                    .map((p) => (
                      <tr key={layMa(p)} className="border-t border-slate-100">
                        <td className="p-4 font-medium">{laySo(p)}</td>
                        <td className="p-4">{p.nguoi_lap ?? "—"}</td>
                        <td className="p-4">
                          {p.nha_cung_cap ?? LY_DO[p.ly_do_xuat ?? ""] ?? "—"}
                        </td>
                        {laNhap && <td className="p-4">{tien(p.tong_tien)}</td>}
                        <td className="p-4">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${p.trang_thai === "ban_nhap" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
                          >
                            {p.trang_thai === "ban_nhap"
                              ? "Bản nháp"
                              : "Hoàn tất"}
                          </span>
                        </td>
                        <td className="p-4">{hanhDong(p)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {loc.length === 0 && (
                <p className="p-8 text-center text-slate-500">
                  Không có phiếu phù hợp.
                </p>
              )}
            </div>
            <div className="flex justify-between border-t border-slate-100 p-4 text-sm">
              <span>
                Trang {trangHienTai}/{soTrang}
              </span>
              <div className="flex gap-2">
                <button
                  className={button}
                  disabled={trangHienTai <= 1}
                  onClick={() => setTrang(trangHienTai - 1)}
                >
                  Trước
                </button>
                <button
                  className={button}
                  disabled={trangHienTai >= soTrang}
                  onClick={() => setTrang(trangHienTai + 1)}
                >
                  Sau
                </button>
              </div>
            </div>
          </section>
        )
      )}
      {mo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Phiếu ${nhan}`}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 p-4"
        >
          <form
            className="mx-auto max-w-4xl space-y-5 rounded-xl bg-white p-6"
            onSubmit={luu}
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">
                {maSua ? "Sửa" : "Tạo"} phiếu {nhan}
              </h2>
              <button
                type="button"
                disabled={dangLuu}
                className={button}
                onClick={() => setMo(false)}
              >
                Đóng
              </button>
            </div>
            {loiForm && (
              <p
                role="alert"
                className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
              >
                {loiForm}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Số phiếu (để trống để tự tạo)
                <input
                  className={input + " mt-1"}
                  value={soPhieu}
                  onChange={(e) => setSoPhieu(e.target.value)}
                />
              </label>
              {laNhap ? (
                <label className="text-sm">
                  Nhà cung cấp
                  <input
                    required
                    className={input + " mt-1"}
                    value={doiTac}
                    onChange={(e) => setDoiTac(e.target.value)}
                  />
                </label>
              ) : (
                <label className="text-sm">
                  Lý do xuất
                  <select
                    className={input + " mt-1"}
                    value={lyDo}
                    onChange={(e) => setLyDo(e.target.value)}
                  >
                    {Object.entries(LY_DO).map(([v, label]) => (
                      <option key={v} value={v}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            <label className="block text-sm">
              Ghi chú
              <textarea
                rows={2}
                className={input + " mt-1"}
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
              />
            </label>
            <div className="space-y-3">
              {dong.map((d, i) => (
                <div
                  key={i}
                  className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-12"
                >
                  <label className="text-sm sm:col-span-5">
                    Sản phẩm
                    <select
                      required
                      className={input + " mt-1"}
                      value={d.ma_san_pham || ""}
                      onChange={(e) =>
                        setDong(
                          dong.map((v, n) =>
                            n === i
                              ? { ...v, ma_san_pham: Number(e.target.value) }
                              : v,
                          ),
                        )
                      }
                    >
                      <option value="">Chọn sản phẩm</option>
                      {sanPhams.map((p) => (
                        <option key={p.ma_san_pham} value={p.ma_san_pham}>
                          {p.ten_san_pham} (tồn: {p.so_luong_ton})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm sm:col-span-2">
                    Số lượng
                    <input
                      required
                      type="number"
                      min={1}
                      max={1000000}
                      className={input + " mt-1"}
                      value={d.so_luong}
                      onChange={(e) =>
                        setDong(
                          dong.map((v, n) =>
                            n === i
                              ? { ...v, so_luong: Number(e.target.value) }
                              : v,
                          ),
                        )
                      }
                    />
                  </label>
                  {laNhap ? (
                    <label className="text-sm sm:col-span-3">
                      Đơn giá
                      <input
                        required
                        type="number"
                        min={0}
                        step="0.01"
                        className={input + " mt-1"}
                        value={d.don_gia}
                        onChange={(e) =>
                          setDong(
                            dong.map((v, n) =>
                              n === i ? { ...v, don_gia: e.target.value } : v,
                            ),
                          )
                        }
                      />
                    </label>
                  ) : (
                    <label className="text-sm sm:col-span-3">
                      Ghi chú
                      <input
                        className={input + " mt-1"}
                        value={d.ghi_chu ?? ""}
                        onChange={(e) =>
                          setDong(
                            dong.map((v, n) =>
                              n === i ? { ...v, ghi_chu: e.target.value } : v,
                            ),
                          )
                        }
                      />
                    </label>
                  )}
                  <button
                    type="button"
                    className={button + " self-end text-rose-600 sm:col-span-2"}
                    disabled={dong.length === 1}
                    onClick={() => setDong(dong.filter((_, n) => n !== i))}
                  >
                    Bỏ dòng
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className={button}
              onClick={() =>
                setDong([
                  ...dong,
                  { ma_san_pham: 0, so_luong: 1, don_gia: 0, ghi_chu: "" },
                ])
              }
            >
              + Thêm sản phẩm
            </button>
            {laNhap && (
              <p className="text-right font-bold">
                Tổng dự kiến:{" "}
                {tien(
                  dong.reduce(
                    (s, d) => s + Number(d.don_gia ?? 0) * d.so_luong,
                    0,
                  ),
                )}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className={button}
                disabled={dangLuu}
                onClick={() => setMo(false)}
              >
                Hủy
              </button>
              <button
                disabled={dangLuu}
                className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {dangLuu ? "Đang lưu..." : "Lưu phiếu nháp"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
