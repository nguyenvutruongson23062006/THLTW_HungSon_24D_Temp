"use client";

import Image from "next/image";
import { useEffect, useState, type SyntheticEvent } from "react";
import { apiRequest } from "@/lib/api/apiClient";
import type { CauHinhDuLieu, CotDuLieu } from "@/lib/admin/cauHinhDuLieu";

type Dong = Record<string, unknown>;
const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500";
const buttonClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50";

function Anh({ src }: { src: string }) {
  const [loi, setLoi] = useState(false);
  return !src || loi || !/^(\/|https?:|blob:)/.test(src) ? (
    <span className="text-xs text-slate-400">Chưa có ảnh</span>
  ) : (
    <Image
      src={src}
      alt="Ảnh đại diện"
      width={72}
      height={48}
      unoptimized
      onError={() => setLoi(true)}
      className="h-12 w-18 rounded-lg object-cover"
    />
  );
}

export default function TrangQuanLyDuLieu({
  cauHinh: c,
}: {
  cauHinh: CauHinhDuLieu;
}) {
  const [duLieu, setDuLieu] = useState<Dong[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [thongBao, setThongBao] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [vaiTro, setVaiTro] = useState("");
  const [thungRac, setThungRac] = useState(false);
  const [lanTai, setLanTai] = useState(0);
  const [trang, setTrang] = useState(1);
  const [bieuMau, setBieuMau] = useState<Record<string, string> | null>(null);
  const [dongSua, setDongSua] = useState<Dong | null>(null);
  const [tepAnh, setTepAnh] = useState<File | null>(null);
  const [anhXemTruoc, setAnhXemTruoc] = useState("");
  const [dangLuu, setDangLuu] = useState(false);
  const [loiForm, setLoiForm] = useState("");
  const [maXuLy, setMaXuLy] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<Dong[]>(`${c.endpoint}?thung_rac=${thungRac ? 1 : 0}`, {
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) setDuLieu(data);
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setLoi(
            error instanceof Error ? error.message : "Không thể tải dữ liệu.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setDangTai(false);
      });
    return () => controller.abort();
  }, [c.endpoint, thungRac, lanTai]);

  useEffect(
    () => () => {
      if (anhXemTruoc) URL.revokeObjectURL(anhXemTruoc);
    },
    [anhXemTruoc],
  );

  function taiLai() {
    setDangTai(true);
    setLoi("");
    setLanTai((v) => v + 1);
  }
  const loc = duLieu.filter(
    (dong) =>
      Object.entries(dong)
        .filter(([ten]) => !ten.includes("mat_khau"))
        .map(([, value]) => String(value ?? ""))
        .join(" ")
        .toLowerCase()
        .includes(tuKhoa.toLowerCase()) &&
      (!trangThai || dong.trang_thai === trangThai) &&
      (!vaiTro || dong.vai_tro === vaiTro),
  );
  const soTrang = Math.max(1, Math.ceil(loc.length / 10));
  const trangHienTai = Math.min(trang, soTrang);
  const hienThi = loc.slice((trangHienTai - 1) * 10, trangHienTai * 10);

  function moForm(dong: Dong | null) {
    const giaTri: Record<string, string> = {};
    for (const truong of c.truong) {
      giaTri[truong.ten] =
        truong.kieu === "password"
          ? ""
          : String(
              dong?.[truong.ten] ??
                (truong.kieu === "number"
                  ? 0
                  : (truong.luaChon?.[0]?.giaTri ?? "")),
            );
    }
    giaTri.trang_thai = String(dong?.trang_thai ?? c.trangThai[0].giaTri);
    setBieuMau(giaTri);
    setDongSua(dong);
    setTepAnh(null);
    setAnhXemTruoc("");
    setLoiForm("");
  }

  async function luu(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bieuMau || dangLuu) return;
    setDangLuu(true);
    setLoiForm("");
    const data: Record<string, string | number | null> = {
      trang_thai: bieuMau.trang_thai,
    };
    for (const truong of c.truong) {
      const raw = bieuMau[truong.ten] ?? "";
      const value = truong.kieu === "password" ? raw : raw.trim();
      if (truong.kieu === "password" && !value && dongSua) continue;
      data[truong.ten] =
        value === ""
          ? null
          : truong.kieu === "number" || truong.laMucCha
            ? Number(value)
            : value;
    }
    let body: string | FormData = JSON.stringify(data);
    let method = dongSua ? "PUT" : "POST";
    if (tepAnh) {
      const form = new FormData();
      for (const [key, value] of Object.entries(data))
        form.append(key, value === null ? "" : String(value));
      form.append("tep_anh", tepAnh);
      if (dongSua) form.append("_method", "PUT");
      body = form;
      method = "POST";
    }
    try {
      await apiRequest(c.endpoint + (dongSua ? `/${dongSua[c.khoa]}` : ""), {
        method,
        body,
      });
      setBieuMau(null);
      setThongBao("Đã lưu dữ liệu thành công.");
      taiLai();
    } catch (error) {
      setLoiForm(
        error instanceof Error ? error.message : "Không thể lưu dữ liệu.",
      );
    } finally {
      setDangLuu(false);
    }
  }

  async function thaoTac(
    dong: Dong,
    loai: "xoa" | "khoi-phuc" | "xoa-vinh-vien",
  ) {
    const ten = String(dong[c.cotTen] ?? `#${dong[c.khoa]}`);
    const nhan =
      loai === "xoa"
        ? "Chuyển vào thùng rác"
        : loai === "khoi-phuc"
          ? "Khôi phục"
          : "Xóa vĩnh viễn (không thể khôi phục)";
    if (!window.confirm(`${nhan}: ${ten}?`)) return;
    setMaXuLy(Number(dong[c.khoa]));
    setLoi("");
    try {
      await apiRequest(
        `${c.endpoint}/${dong[c.khoa]}${loai === "xoa" ? "" : `/${loai}`}`,
        { method: loai === "khoi-phuc" ? "PATCH" : "DELETE" },
      );
      setThongBao("Thao tác thành công.");
      taiLai();
    } catch (error) {
      setLoi(error instanceof Error ? error.message : "Thao tác thất bại.");
    } finally {
      setMaXuLy(null);
    }
  }

  function giaTri(dong: Dong, cot: CotDuLieu) {
    const value = dong[cot.ten];
    if (cot.kieu === "anh")
      return <Anh key={String(value)} src={String(value ?? "")} />;
    if (cot.kieu === "ngay")
      return value ? new Date(String(value)).toLocaleDateString("vi-VN") : "—";
    if (cot.kieu === "trang_thai")
      return (
        <span
          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs ${["an", "tam_ngung", "khoa"].includes(String(value)) ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
        >
          {c.trangThai.find((v) => v.giaTri === value)?.nhan ?? String(value)}
        </span>
      );
    if (cot.ten === "vai_tro")
      return (
        c.truong
          .find((v) => v.ten === "vai_tro")
          ?.luaChon?.find((v) => v.giaTri === value)?.nhan ?? String(value)
      );
    return value === null || value === undefined || value === ""
      ? "—"
      : String(value);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-sky-600">Quản trị</p>
          <h1 className="mt-1 text-3xl font-bold">
            {thungRac ? "Thùng rác · " : ""}
            {c.tieuDe}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{c.moTa}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={buttonClass} onClick={taiLai} disabled={dangTai}>
            Tải lại
          </button>
          <button
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => {
              setThungRac(!thungRac);
              setDangTai(true);
              setTrang(1);
              setLoi("");
              setThongBao("");
            }}
          >
            {thungRac ? "Quay lại danh sách" : "Thùng rác"}
          </button>
          {!thungRac && c.choThem !== false && (
            <button
              onClick={() => moForm(null)}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
            >
              + Thêm mới
            </button>
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
      {thongBao && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {thongBao}
        </p>
      )}
      {c.khoa === "ma_nguoi_dung" && !thungRac && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Tổng tài khoản", duLieu.length],
            [
              "Đang hoạt động",
              duLieu.filter((d) => d.trang_thai === "hoat_dong").length,
            ],
            [
              "Không hoạt động",
              duLieu.filter((d) => d.trang_thai !== "hoat_dong").length,
            ],
          ].map(([nhan, so]) => (
            <div
              key={nhan}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="text-sm text-slate-500">{nhan}</p>
              <p className="mt-2 text-3xl font-bold">{so}</p>
            </div>
          ))}
        </div>
      )}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <p className="text-sm text-slate-500">
            Có {loc.length} bản ghi phù hợp.
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              aria-label="Tìm kiếm"
              value={tuKhoa}
              onChange={(e) => {
                setTuKhoa(e.target.value);
                setTrang(1);
              }}
              placeholder="Tìm kiếm..."
              className={inputClass + " sm:w-56"}
            />
            {c.khoa === "ma_nguoi_dung" && (
              <select
                aria-label="Lọc vai trò"
                value={vaiTro}
                onChange={(e) => {
                  setVaiTro(e.target.value);
                  setTrang(1);
                }}
                className={inputClass + " sm:w-auto"}
              >
                <option value="">Tất cả vai trò</option>
                {c.truong
                  .find((v) => v.ten === "vai_tro")
                  ?.luaChon?.map((v) => (
                    <option key={v.giaTri} value={v.giaTri}>
                      {v.nhan}
                    </option>
                  ))}
              </select>
            )}
            <select
              aria-label="Lọc trạng thái"
              value={trangThai}
              onChange={(e) => {
                setTrangThai(e.target.value);
                setTrang(1);
              }}
              className={inputClass + " sm:w-auto"}
            >
              <option value="">Tất cả trạng thái</option>
              {c.trangThai.map((v) => (
                <option key={v.giaTri} value={v.giaTri}>
                  {v.nhan}
                </option>
              ))}
            </select>
          </div>
        </div>
        {dangTai ? (
          <p className="p-8 text-center text-slate-500">Đang tải dữ liệu...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3">Mã</th>
                  {c.cot.map((cot) => (
                    <th key={cot.ten} className="px-5 py-3 font-medium">
                      {cot.nhan}
                    </th>
                  ))}
                  <th className="px-5 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hienThi.map((dong) => (
                  <tr key={Number(dong[c.khoa])}>
                    <td className="px-5 py-4 text-slate-400">
                      #{String(dong[c.khoa])}
                    </td>
                    {c.cot.map((cot) => (
                      <td key={cot.ten} className="max-w-xs px-5 py-4">
                        <div className="line-clamp-3 break-words">
                          {giaTri(dong, cot)}
                        </div>
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {thungRac ? (
                          <>
                            <button
                              className={buttonClass}
                              disabled={maXuLy !== null}
                              onClick={() => thaoTac(dong, "khoi-phuc")}
                            >
                              Khôi phục
                            </button>
                            <button
                              className={buttonClass + " text-rose-600"}
                              disabled={maXuLy !== null}
                              onClick={() => thaoTac(dong, "xoa-vinh-vien")}
                            >
                              Xóa vĩnh viễn
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={buttonClass}
                              onClick={() => moForm(dong)}
                            >
                              {c.choThem === false
                                ? "Xem / Xử lý"
                                : "Xem / Sửa"}
                            </button>
                            <button
                              className={buttonClass + " text-rose-600"}
                              disabled={maXuLy !== null}
                              onClick={() => thaoTac(dong, "xoa")}
                            >
                              Xóa
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hienThi.length === 0 && (
              <p className="p-8 text-center text-slate-500">
                {thungRac ? "Thùng rác trống." : "Không có dữ liệu phù hợp."}
              </p>
            )}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm">
          <span>
            Trang {trangHienTai}/{soTrang}
          </span>
          <div className="flex gap-2">
            <button
              className={buttonClass}
              disabled={trangHienTai <= 1}
              onClick={() => setTrang(trangHienTai - 1)}
            >
              Trước
            </button>
            <button
              className={buttonClass}
              disabled={trangHienTai >= soTrang}
              onClick={() => setTrang(trangHienTai + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      </section>
      {bieuMau && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={c.tieuDe}
          onKeyDown={(e) => {
            if (e.key === "Escape" && !dangLuu) setBieuMau(null);
          }}
        >
          <div className="mx-auto max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold">
                {dongSua ? "Chi tiết / Cập nhật" : "Thêm mới"}
              </h2>
              <button
                aria-label="Đóng biểu mẫu"
                disabled={dangLuu}
                className={buttonClass}
                onClick={() => setBieuMau(null)}
              >
                Đóng
              </button>
            </div>
            <form onSubmit={luu} className="space-y-4 p-6">
              {loiForm && (
                <p
                  role="alert"
                  className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
                >
                  {loiForm}
                </p>
              )}
              {c.chiTiet?.map((cot) => (
                <div key={cot.ten}>
                  <p className="text-xs font-medium text-slate-500">
                    {cot.nhan}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm">
                    {String(dongSua?.[cot.ten] ?? "—")}
                  </p>
                </div>
              ))}
              {c.truong.map((truong) => (
                <label key={truong.ten} className="block">
                  <span className="mb-1 block text-sm font-medium">
                    {truong.nhan}
                  </span>
                  {truong.kieu === "textarea" ? (
                    <textarea
                      rows={truong.ten === "noi_dung" ? 10 : 4}
                      required={truong.batBuoc}
                      className={inputClass}
                      value={bieuMau[truong.ten]}
                      onChange={(e) =>
                        setBieuMau({ ...bieuMau, [truong.ten]: e.target.value })
                      }
                    />
                  ) : truong.kieu === "select" ? (
                    <select
                      required={truong.batBuoc}
                      className={inputClass}
                      value={bieuMau[truong.ten]}
                      onChange={(e) =>
                        setBieuMau({ ...bieuMau, [truong.ten]: e.target.value })
                      }
                    >
                      {truong.laMucCha && (
                        <option value="">Không có mục cha</option>
                      )}
                      {(truong.laMucCha
                        ? duLieu
                            .filter((d) => d[c.khoa] !== dongSua?.[c.khoa])
                            .map((d) => ({
                              giaTri: String(d[c.khoa]),
                              nhan: String(d[c.cotTen]),
                            }))
                        : (truong.luaChon ?? [])
                      ).map((v) => (
                        <option key={v.giaTri} value={v.giaTri}>
                          {v.nhan}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={truong.kieu ?? "text"}
                      min={truong.kieu === "number" ? 0 : undefined}
                      minLength={truong.kieu === "password" ? 6 : undefined}
                      autoComplete={
                        truong.kieu === "password" ? "new-password" : undefined
                      }
                      required={
                        truong.batBuoc &&
                        !(dongSua && truong.kieu === "password")
                      }
                      className={inputClass}
                      value={bieuMau[truong.ten]}
                      onChange={(e) =>
                        setBieuMau({ ...bieuMau, [truong.ten]: e.target.value })
                      }
                    />
                  )}
                </label>
              ))}
              {c.truongAnh && (
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">
                    Chọn ảnh từ máy tính (JPG, PNG, WEBP, tối đa 2 MB)
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className={inputClass}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (file && file.size > 2 * 1024 * 1024) {
                        setLoiForm("Ảnh không được lớn hơn 2 MB.");
                        setTepAnh(null);
                        setAnhXemTruoc("");
                        e.target.value = "";
                        return;
                      }
                      setTepAnh(file);
                      setAnhXemTruoc(file ? URL.createObjectURL(file) : "");
                    }}
                  />
                  <div className="mt-3">
                    <Anh
                      key={anhXemTruoc || bieuMau[c.truongAnh]}
                      src={anhXemTruoc || bieuMau[c.truongAnh] || ""}
                    />
                  </div>
                </label>
              )}
              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Trạng thái
                </span>
                <select
                  className={inputClass}
                  value={bieuMau.trang_thai}
                  onChange={(e) =>
                    setBieuMau({ ...bieuMau, trang_thai: e.target.value })
                  }
                >
                  {c.trangThai.map((v) => (
                    <option key={v.giaTri} value={v.giaTri}>
                      {v.nhan}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className={buttonClass}
                  disabled={dangLuu}
                  onClick={() => setBieuMau(null)}
                >
                  Hủy
                </button>
                <button
                  disabled={dangLuu}
                  className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {dangLuu ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
