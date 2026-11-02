import { khung, tienShop, trangThaiDon, trangThaiTien } from "./GiaoDien";
import type { DonCuaToi } from "@/lib/shop/donHang";
import { tenPhuongThuc, laThanhToanOnline } from "@/lib/shop/thanhToan";
import ThanhToanDon from "./ThanhToanDon";
import QrChuyenKhoan from "./QrChuyenKhoan";

export default function NoiDungDonHang({ don }: { don: DonCuaToi }) {
  return (
    <div className="space-y-5">
      {!!don.so_thang_tra_gop && <section className={khung}><h2 className="text-xl font-semibold">Trả góp {don.so_thang_tra_gop} tháng · Lãi suất 0%</h2><p className="my-3 text-sm">Tổng tiền chia theo kỳ hạn, không thu lãi. Tháng cuối điều chỉnh phần lẻ.</p><div className="grid gap-2 sm:grid-cols-3">{don.lich_tra_gop?.map((ky) => <p key={ky.ky} className="rounded-lg border border-slate-700 p-3 text-sm">Tháng {ky.ky}: <strong>{tienShop(ky.so_tien)}</strong></p>)}</div></section>}
      <ThanhToanDon ma={don.ma_don_hang} khoa={don.khoa_thanh_toan} online={laThanhToanOnline(don.phuong_thuc_thanh_toan)} />
      {don.phuong_thuc_thanh_toan === "chuyen_khoan" && don.trang_thai !== "da_huy" && don.trang_thai_thanh_toan === "chua_thanh_toan" && (
        <QrChuyenKhoan don={don} />
      )}
      <section className={khung}>
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Đơn hàng #{don.ma_don_hang}</h2>
            <p className="mt-2 text-sm text-slate-400">
              {new Date(don.ngay_tao).toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="text-blue-300">
              {trangThaiDon[don.trang_thai] ?? don.trang_thai}
            </p>
            <p className="mt-2">
              {laThanhToanOnline(don.phuong_thuc_thanh_toan) ? "Xem xác nhận VNPay bên trên" : trangThaiTien[don.trang_thai_thanh_toan] ??
                don.trang_thai_thanh_toan}
            </p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-7">
          Người nhận: {don.ho_ten}
          <br />
          Điện thoại: {don.so_dien_thoai}
          <br />
          Địa chỉ: {don.dia_chi_giao_hang}
          <br />
          Thanh toán:{" "}
          {tenPhuongThuc[don.phuong_thuc_thanh_toan ?? "tien_mat"] ?? don.phuong_thuc_thanh_toan}
        </p>
      </section>
      <section className={khung}>
        <h2 className="mb-4 text-xl font-semibold">Sản phẩm</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-125 text-left text-sm">
            <thead>
              <tr className="text-slate-400">
                <th className="pb-3">Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {don.chi_tiet_don_hangs.map((d, i) => (
                <tr key={i} className="border-t border-slate-700">
                  <td className="py-4 pr-3">{d.ten_san_pham}</td>
                  <td>{d.so_luong}</td>
                  <td>{tienShop(d.don_gia)}</td>
                  <td>{tienShop(d.thanh_tien)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className="ml-auto mt-5 max-w-sm space-y-3 border-t border-slate-700 pt-5 text-sm">
          <div className="flex justify-between">
            <dt>Tạm tính</dt>
            <dd>{tienShop(don.tam_tinh)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Giảm giá {don.ma_giam_gia && `(${don.ma_giam_gia})`}</dt>
            <dd>− {tienShop(don.giam_gia)}</dd>
          </div>
          <div className="flex justify-between text-lg font-bold text-blue-300">
            <dt>Tổng tiền</dt>
            <dd>{tienShop(don.tong_tien)}</dd>
          </div>
        </dl>
      </section>
      {don.lich_su.length > 0 && (
        <section className={khung}>
          <h2 className="mb-4 text-xl font-semibold">Lịch sử xử lý</h2>
          <ol className="space-y-4">
            {don.lich_su.map((l, i) => (
              <li key={i} className="border-l-2 border-blue-500 pl-4 text-sm">
                <p className="font-semibold">
                  {trangThaiDon[l.trang_thai_moi] ?? l.trang_thai_moi}
                </p>
                <p className="mt-1 text-slate-400">
                  {new Date(l.ngay_tao).toLocaleString("vi-VN")} · {l.ghi_chu}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
