import { guiShop } from "./api";

export const tenPhuongThuc: Record<string, string> = {
  tien_mat: "Tiền mặt khi nhận hàng (COD)",
  chuyen_khoan: "Chuyển khoản ngân hàng",
  vnpay_qr: "VNPAY-QR",
  vnpay_atm: "Thẻ ATM / ngân hàng nội địa",
  vnpay_the: "Thẻ quốc tế Visa / Mastercard / JCB",
};
export const laThanhToanOnline = (ma = "") =>
  ["vnpay_qr", "vnpay_atm", "vnpay_the"].includes(ma);
export type PhuongThuc = {
  ma: string; ten: string; online: boolean; san_sang: boolean; mo_ta: string;
};
export type ThongTinThanhToan = {
  ma_don_hang: number; tong_tien: string; phuong_thuc: string;
  trang_thai_don: string; trang_thai_thanh_toan: string; can_doi_soat: boolean;
  giao_dich: null | { trang_thai: string; ma_phan_hoi: string | null; het_han: string; ma_giao_dich: string | null };
};
export async function moThanhToan(ma: number, khoa: string) {
  sessionStorage.setItem("shop_don_thanh_toan", JSON.stringify({ ma, khoa }));
  const data = await guiShop<{ url: string }>("/thanh-toan/tao", { ma_don_hang: ma, khoa });
  const url = new URL(data.url);
  if (url.protocol !== "https:" || !["sandbox.vnpayment.vn", "pay.vnpay.vn"].includes(url.hostname))
    throw new Error("Địa chỉ cổng thanh toán không hợp lệ.");
  window.location.assign(url.href);
}
