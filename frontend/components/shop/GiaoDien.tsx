export const oNhap =
  "mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-blue-400 disabled:opacity-60";
export const nut =
  "inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50";
export const nutPhu =
  "inline-flex items-center justify-center rounded-lg border border-slate-600 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50";
export const khung =
  "rounded-2xl border border-slate-700 bg-slate-950 p-5 sm:p-7";
export const tienShop = (n: number | string) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
export const trangThaiDon: Record<string, string> = {
  cho_xac_nhan: "Chờ xác nhận",
  da_xac_nhan: "Đã xác nhận",
  dang_xu_ly: "Đang xử lý",
  dang_giao: "Đang giao",
  da_giao: "Đã giao",
  hoan_tat: "Hoàn tất",
  da_huy: "Đã hủy",
};
export const trangThaiTien: Record<string, string> = {
  chua_thanh_toan: "Chưa thanh toán",
  da_thanh_toan: "Đã thanh toán",
  da_hoan_tien: "Đã hoàn tiền",
};
export function ThongBaoShop({ loi, bao }: { loi?: string; bao?: string }) {
  return (
    <>
      {loi && (
        <p
          role="alert"
          className="rounded-lg border border-rose-800 bg-rose-950 p-4 text-sm text-rose-100"
        >
          {loi}
        </p>
      )}
      {bao && (
        <p
          role="status"
          className="rounded-lg border border-emerald-800 bg-emerald-950 p-4 text-sm text-emerald-100"
        >
          {bao}
        </p>
      )}
    </>
  );
}
