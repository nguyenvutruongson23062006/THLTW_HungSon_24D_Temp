"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTaiKhoan } from "@/lib/shop/useTaiKhoan";
import { guiShop, shopApi } from "@/lib/shop/api";
import type { DonCuaToi } from "@/lib/shop/donHang";
import {
  khung,
  nutPhu,
  tienShop,
  trangThaiDon,
  trangThaiTien,
  oNhap,
  ThongBaoShop,
} from "./GiaoDien";
import NoiDungDonHang from "./NoiDungDonHang";

type DanhSach = {
  danh_sach: DonCuaToi[];
  trang: number;
  so_trang: number;
  tong: number;
};
export default function DonHangThanhVien({ ma }: { ma?: number }) {
  const { user, tai: taiUser, loi: loiUser } = useTaiKhoan(true);
  const [ds, setDs] = useState<DanhSach | null>(null);
  const [don, setDon] = useState<DonCuaToi | null>(null);
  const [trang, setTrang] = useState(1);
  const [loc, setLoc] = useState("");
  const [tai, setTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [bao, setBao] = useState("");
  const [gui, setGui] = useState(false);
  const [lanTai, setLanTai] = useState(0);
  const [xacNhanHuy, setXacNhanHuy] = useState(false);
  useEffect(() => {
    if (!user) return;
    const ac = new AbortController();
    shopApi<DonCuaToi | DanhSach>(
      `/cua-hang/don-hang${ma ? `/${ma}` : `?page=${trang}&trang_thai=${loc}`}`,
      { signal: ac.signal },
    )
      .then((data) => {
        if (!ac.signal.aborted) {
          if ("danh_sach" in data) setDs(data);
          else setDon(data);
        }
      })
      .catch((error) => {
        if (!ac.signal.aborted)
          setLoi(
            error instanceof Error ? error.message : "Không thể tải đơn hàng.",
          );
      })
      .finally(() => {
        if (!ac.signal.aborted) setTai(false);
      });
    return () => ac.abort();
  }, [user, ma, trang, loc, lanTai]);
  async function huy() {
    if (!ma || gui) return;
    setGui(true);
    setLoi("");
    setBao("");
    try {
      setDon(
        await guiShop<DonCuaToi>(`/cua-hang/don-hang/${ma}/huy`, {}, "PATCH"),
      );
      setBao("Đã hủy đơn hàng.");
      setXacNhanHuy(false);
    } catch (error) {
      setLoi(error instanceof Error ? error.message : "Không thể hủy đơn.");
    } finally {
      setGui(false);
    }
  }
  function taiLai() {
    setTai(true);
    setLoi("");
    setLanTai((v) => v + 1);
  }
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-5 py-10 text-white">
      <div className="flex flex-wrap justify-between gap-4">
        <h1 className="text-3xl font-bold">
          {ma ? "Chi tiết đơn hàng" : "Đơn hàng của tôi"}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Link className={nutPhu} href={ma ? "/don-hang" : "/tai-khoan"}>
            Quay lại
          </Link>
          <button className={nutPhu} onClick={taiLai}>
            Tải lại
          </button>
        </div>
      </div>
      <ThongBaoShop loi={loi || loiUser} bao={bao} />
      {!ma && (
        <label className="block max-w-xs text-sm">
          Trạng thái đơn
          <select
            className={oNhap}
            value={loc}
            onChange={(e) => {
              setLoc(e.target.value);
              setTrang(1);
              setTai(true);
              setLoi("");
            }}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(trangThaiDon).map(([v, n]) => (
              <option key={v} value={v}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}
      {taiUser || (user && tai) ? (
        <p>Đang tải đơn hàng...</p>
      ) : (
        user &&
        (ma
          ? don && (
              <>
                <NoiDungDonHang don={don} />
                {don.trang_thai === "cho_xac_nhan" && (
                  <div className={khung}>
                    <p className="mb-3 text-sm text-slate-400">
                      Bạn có thể tự hủy khi đơn đang chờ xác nhận. Nếu đã thanh
                      toán, hãy liên hệ cửa hàng để xử lý hoàn tiền.
                    </p>
                    <button
                      disabled={
                        gui || don.trang_thai_thanh_toan === "da_thanh_toan"
                      }
                      onClick={() => setXacNhanHuy(true)}
                      className="rounded-lg bg-rose-700 px-5 py-2.5 text-white disabled:opacity-50"
                    >
                      {gui ? "Đang hủy..." : "Hủy đơn hàng"}
                    </button>
                    {xacNhanHuy && (
                      <div
                        role="alert"
                        className="mt-4 rounded-lg border border-rose-700 p-4 text-sm"
                      >
                        <p>
                          Xác nhận hủy đơn #{ma}? Số lượng sản phẩm sẽ được hoàn
                          lại kho.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button
                            disabled={gui}
                            onClick={huy}
                            className="rounded-lg bg-rose-700 px-4 py-2 text-white disabled:opacity-50"
                          >
                            Đồng ý hủy đơn
                          </button>
                          <button
                            disabled={gui}
                            onClick={() => setXacNhanHuy(false)}
                            className={nutPhu}
                          >
                            Giữ lại đơn
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )
          : ds && (
              <section className={khung}>
                <p className="mb-4 text-sm text-slate-400">
                  Có {ds.tong} đơn hàng.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-140 text-left text-sm">
                    <thead>
                      <tr className="text-slate-400">
                        <th className="pb-3">Mã đơn</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thanh toán</th>
                        <th>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ds.danh_sach.map((d) => (
                        <tr
                          key={d.ma_don_hang}
                          className="border-t border-slate-700"
                        >
                          <td className="py-4">#{d.ma_don_hang}</td>
                          <td>
                            {new Date(d.ngay_tao).toLocaleDateString("vi-VN")}
                          </td>
                          <td>{tienShop(d.tong_tien)}</td>
                          <td>{trangThaiDon[d.trang_thai] ?? d.trang_thai}</td>
                          <td className="py-4 pr-3">
                            <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${d.trang_thai_thanh_toan === "da_thanh_toan" ? "bg-emerald-500/15 text-emerald-300" : d.trang_thai_thanh_toan === "da_hoan_tien" ? "bg-blue-500/15 text-blue-300" : "bg-amber-500/15 text-amber-200"}`}>
                              {trangThaiTien[d.trang_thai_thanh_toan] ?? d.trang_thai_thanh_toan}
                            </span>
                          </td>
                          <td>
                            <Link
                              href={`/don-hang/${d.ma_don_hang}`}
                              className="text-blue-300"
                            >
                              Xem đơn #{d.ma_don_hang}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {ds.tong === 0 && (
                  <p className="py-5 text-slate-400">
                    Chưa có đơn hàng phù hợp.
                  </p>
                )}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-sm">
                    Trang {ds.trang}/{ds.so_trang}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className={nutPhu}
                      disabled={trang <= 1}
                      onClick={() => {
                        setTrang(trang - 1);
                        setTai(true);
                      }}
                    >
                      Trước
                    </button>
                    <button
                      className={nutPhu}
                      disabled={trang >= ds.so_trang}
                      onClick={() => {
                        setTrang(trang + 1);
                        setTai(true);
                      }}
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </section>
            ))
      )}
    </main>
  );
}
