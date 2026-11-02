"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type SyntheticEvent,
} from "react";
import {
  truSanPhamDaThanhToan,
  getCart,
  initializeCart,
  subscribeCart,
  type CartItem,
} from "@/lib/cart";
import { useTaiKhoan } from "@/lib/shop/useTaiKhoan";
import { guiShop, LoiShop, shopApi } from "@/lib/shop/api";
import type { BaoGia, DonCuaToi } from "@/lib/shop/donHang";
import type { NguoiDung } from "@/types/admin";
import {
  khung,
  nut,
  nutPhu,
  oNhap,
  tienShop,
  ThongBaoShop,
} from "@/components/shop/GiaoDien";
import NoiDungDonHang from "@/components/shop/NoiDungDonHang";
import ChonPhuongThucThanhToan from "@/components/shop/ChonPhuongThucThanhToan";
import { laThanhToanOnline, moThanhToan, tenPhuongThuc } from "@/lib/shop/thanhToan";

const trong: CartItem[] = [];
type DuLieuDat = {
  ho_ten: string;
  dia_chi_email: string;
  so_dien_thoai: string;
  dia_chi_giao_hang: string;
  ghi_chu: string;
  phuong_thuc_thanh_toan: string;
  so_thang_tra_gop?: number;
  chi_tiet: { ma_san_pham: number; so_luong: number }[];
  ma_giam_gia: string;
  khoa_dat_hang: string;
  tong_tien_du_kien: string;
};
const CHO_GUI = "shop_don_dang_gui";

function BieuMauDatHang({
  cart,
  user,
}: {
  cart: CartItem[];
  user: NguoiDung | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    ho_ten: user?.ho_ten ?? "",
    dia_chi_email: user?.dia_chi_email ?? "",
    so_dien_thoai: user?.so_dien_thoai ?? "",
    dia_chi_giao_hang: user?.dia_chi ?? "",
    ghi_chu: "",
    phuong_thuc_thanh_toan: "tien_mat",
    so_thang_tra_gop: 0,
  });
  const [ma, setMa] = useState("");
  const [baoGia, setBaoGia] = useState<BaoGia | null>(null);
  const [don, setDon] = useState<DonCuaToi | null>(null);
  const [loi, setLoi] = useState("");
  const [bao, setBao] = useState("");
  const [gui, setGui] = useState(false);
  const [dangBaoGia, setDangBaoGia] = useState(true);
  const [choGui, setChoGui] = useState<DuLieuDat | null>(null);
  const [sanSang, setSanSang] = useState(false);
  const chiTiet = cart.map((d) => ({
    ma_san_pham: d.id,
    so_luong: d.quantity,
  }));
  const gioKey = JSON.stringify(chiTiet);
  const chuSoHuu = user?.ma_nguoi_dung ?? "khach";
  const khoaChoGui = `${CHO_GUI}_${chuSoHuu}`;
  const khoaDonVuaDat = `shop_don_vua_dat_${chuSoHuu}`;

  useEffect(() => {
    let huy = false;
    Promise.resolve().then(async () => {
      if (huy) return;
      try {
        const chon = new URLSearchParams(window.location.search).get("phuong_thuc");
        if (chon && tenPhuongThuc[chon]) setForm((cu) => ({ ...cu, phuong_thuc_thanh_toan: chon }));
        const pending = sessionStorage.getItem(khoaChoGui);
        if (pending) {
          setChoGui(JSON.parse(pending));
          setBao(
            "Có yêu cầu đặt hàng chưa xác định kết quả. Bấm gửi lại để kiểm tra và tiếp tục đúng yêu cầu đó.",
          );
        } else if (getCart().length === 0) {
          const cu = sessionStorage.getItem(khoaDonVuaDat);
          if (cu) {
            const daLuu = JSON.parse(cu) as DonCuaToi;
            const moi =
              chuSoHuu === "khach"
                ? daLuu
                : await shopApi<DonCuaToi>(
                    `/cua-hang/don-hang/${daLuu.ma_don_hang}`,
                  );
            if (!huy) setDon(moi);
          }
        }
      } catch {
        sessionStorage.removeItem(khoaChoGui);
      }
      if (!huy) setSanSang(true);
    });
    return () => {
      huy = true;
    };
  }, [chuSoHuu, khoaChoGui, khoaDonVuaDat]);

  useEffect(() => {
    if (!sanSang || !JSON.parse(gioKey).length) return;
    let huy = false;
    guiShop<BaoGia>("/cua-hang/bao-gia", { chi_tiet: JSON.parse(gioKey) })
      .then((data) => {
        if (!huy) setBaoGia(data);
      })
      .catch((error) => {
        if (!huy)
          setLoi(
            error instanceof Error
              ? error.message
              : "Không thể kiểm tra giỏ hàng.",
          );
      })
      .finally(() => {
        if (!huy) setDangBaoGia(false);
      });
    return () => {
      huy = true;
    };
  }, [gioKey, sanSang]);

  async function capNhatBaoGia() {
    setDangBaoGia(true);
    setLoi("");
    setBaoGia(null);
    try {
      setBaoGia(
        await guiShop<BaoGia>("/cua-hang/bao-gia", {
          chi_tiet: chiTiet,
          ma_giam_gia: ma.trim() || null,
        }),
      );
    } catch (error) {
      setLoi(error instanceof Error ? error.message : "Không thể áp dụng mã.");
    } finally {
      setDangBaoGia(false);
    }
  }

  async function datHang(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (gui || (!choGui && !baoGia)) return;
    const payload: DuLieuDat = choGui ?? {
      ...form,
      chi_tiet: chiTiet,
      ma_giam_gia: baoGia?.ma_giam_gia ?? "",
      khoa_dat_hang: crypto.randomUUID(),
      tong_tien_du_kien: baoGia!.tong_tien,
    };
    setGui(true);
    setLoi("");
    setBao("");
    setChoGui(payload);
    sessionStorage.setItem(khoaChoGui, JSON.stringify(payload));
    try {
      const result = await guiShop<DonCuaToi>("/cua-hang/dat-hang", payload);
      sessionStorage.removeItem(khoaChoGui);
      sessionStorage.setItem(khoaDonVuaDat, JSON.stringify(result));
      setChoGui(null);
      setDon(result);
      if (result.phuong_thuc_thanh_toan === "chuyen_khoan" && result.khoa_thanh_toan) {
        sessionStorage.setItem(`shop_don_gio_${result.ma_don_hang}`, JSON.stringify(payload.chi_tiet));
        router.push(`/order/chuyen-khoan#${new URLSearchParams({ ma: String(result.ma_don_hang), khoa: result.khoa_thanh_toan })}`);
        return;
      }
      truSanPhamDaThanhToan(payload.chi_tiet);
      if (laThanhToanOnline(result.phuong_thuc_thanh_toan) && result.khoa_thanh_toan) {
        await moThanhToan(result.ma_don_hang, result.khoa_thanh_toan);
      }
    } catch (error) {
      if (
        error instanceof LoiShop &&
        error.status < 500 &&
        error.status !== 429
      ) {
        sessionStorage.removeItem(khoaChoGui);
        setChoGui(null);
      }
      setLoi(
        error instanceof Error
          ? error.message
          : "Mạng bị gián đoạn. Hãy gửi lại để nhận đúng đơn đã đặt, tránh tạo đơn trùng.",
      );
    } finally {
      setGui(false);
    }
  }

  if (!sanSang) return <p>Đang chuẩn bị thanh toán...</p>;
  if (don)
    return (
      <>
        <ThongBaoShop loi={loi} />
        <h1 className="text-3xl font-bold">
          {don.trang_thai === "da_huy"
            ? "Đơn hàng đã hủy"
            : don.phuong_thuc_thanh_toan === "chuyen_khoan" && don.trang_thai_thanh_toan === "chua_thanh_toan" ? "Đang chờ thanh toán" : "Đặt hàng thành công"}
        </h1>
        <p className="text-slate-300">
          {don.trang_thai === "da_huy"
            ? "Đơn hàng này đã được hủy."
            : laThanhToanOnline(don.phuong_thuc_thanh_toan)
              ? "Đơn đã được tạo. Kết quả thanh toán được kiểm tra riêng bên dưới."
            : don.phuong_thuc_thanh_toan === "chuyen_khoan"
              ? "Cửa hàng sẽ liên hệ hướng dẫn chuyển khoản; đơn đang chờ xác nhận thanh toán."
              : "Bạn thanh toán khi nhận hàng."}
        </p>
        {!user && (
          <p className="text-sm text-slate-400">
            Đây là thông tin xác nhận tại thời điểm đặt hàng. Cửa hàng sẽ liên
            hệ để cập nhật tình trạng xử lý.
          </p>
        )}
        <NoiDungDonHang don={don} />
        <div className="flex flex-wrap gap-3">
          <Link className={nut} href="/products">
            Tiếp tục mua hàng
          </Link>
          {user && (
            <Link className={nutPhu} href={`/don-hang/${don.ma_don_hang}`}>
              Theo dõi đơn hàng
            </Link>
          )}
          <button className={nutPhu} onClick={() => window.print()}>
            In thông tin đơn
          </button>
        </div>
      </>
    );
  if (!cart.length && !choGui)
    return (
      <div className={khung}>
        <h1 className="text-2xl font-bold">Giỏ hàng đang trống</h1>
        <Link className={nut + " mt-5"} href="/products">
          Chọn sản phẩm
        </Link>
      </div>
    );
  return (
    <>
      <h1 className="text-3xl font-bold">Đặt hàng</h1>
      {!user && (
        <p className="text-sm text-slate-300">
          Bạn có thể đặt hàng không cần tài khoản.{" "}
          <Link href="/login?next=/order" className="text-blue-300 underline">
            Đăng nhập
          </Link>{" "}
          để xem lịch sử và theo dõi đơn.
        </p>
      )}
      <ThongBaoShop loi={loi} bao={bao} />
      {choGui ? (
        <form onSubmit={datHang} className={khung + " space-y-4"}>
          <p>
            Đang giữ yêu cầu đặt hàng cho {choGui.ho_ten}, tổng dự kiến{" "}
            {tienShop(choGui.tong_tien_du_kien)}. Gửi lại sẽ dùng cùng mã yêu
            cầu.
          </p>
          <button disabled={gui} className={nut}>
            {gui ? "Đang kiểm tra..." : "Gửi lại yêu cầu đặt hàng"}
          </button>
          {user && (
            <Link className={nutPhu + " ml-3"} href="/don-hang">
              Kiểm tra lịch sử đơn
            </Link>
          )}
        </form>
      ) : (
        <form
          onSubmit={datHang}
          className="grid items-start gap-6 lg:grid-cols-2"
        >
          <fieldset disabled={gui} className={khung + " space-y-4"}>
            <legend className="px-2 text-xl font-semibold">
              Thông tin giao hàng
            </legend>
            {(
              [
                {
                  ten: "ho_ten",
                  nhan: "Họ tên người nhận",
                  auto: "name",
                  type: "text",
                },
                {
                  ten: "dia_chi_email",
                  nhan: "Email (không bắt buộc)",
                  auto: "email",
                  type: "email",
                },
                {
                  ten: "so_dien_thoai",
                  nhan: "Số điện thoại",
                  auto: "tel",
                  type: "tel",
                },
              ] as const
            ).map((f) => (
              <label key={f.ten} className="block text-sm">
                {f.nhan}
                <input
                  required={f.ten !== "dia_chi_email"}
                  maxLength={f.ten === "so_dien_thoai" ? 20 : 255}
                  autoComplete={f.auto}
                  type={f.type}
                  className={oNhap}
                  value={form[f.ten]}
                  onChange={(e) =>
                    setForm({ ...form, [f.ten]: e.target.value })
                  }
                />
              </label>
            ))}
            <label className="block text-sm">
              Địa chỉ giao hàng
              <textarea
                required
                maxLength={2000}
                autoComplete="street-address"
                className={oNhap}
                value={form.dia_chi_giao_hang}
                onChange={(e) =>
                  setForm({ ...form, dia_chi_giao_hang: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              Ghi chú
              <textarea
                maxLength={2000}
                className={oNhap}
                value={form.ghi_chu}
                onChange={(e) => setForm({ ...form, ghi_chu: e.target.value })}
              />
            </label>
            <ChonPhuongThucThanhToan giaTri={form.phuong_thuc_thanh_toan} onChon={(ma) => setForm({ ...form, phuong_thuc_thanh_toan: ma })} />
            <label className="block text-sm">Hình thức mua
              <select className={oNhap} value={form.so_thang_tra_gop} onChange={(e) => setForm({ ...form, so_thang_tra_gop: Number(e.target.value) })}>
                <option value={0}>Trả thẳng — toàn bộ tiền đơn</option>
                {[6,12,18].map((n) => <option key={n} value={n}>Trả góp {n} tháng — lãi suất 0%</option>)}
              </select>
            </label>
            {form.so_thang_tra_gop > 0 && baoGia && <p className="text-sm text-blue-200">Không trả trước. Dự kiến {tienShop(Math.floor(Number(baoGia.tong_tien) / form.so_thang_tra_gop))}/tháng trong {form.so_thang_tra_gop} tháng. Tháng cuối điều chỉnh phần lẻ.</p>}
          </fieldset>
          <section className={khung + " space-y-4"}>
            <h2 className="text-xl font-semibold">Kiểm tra đơn hàng</h2>
            <p className="text-xs text-slate-400">
              Giá, tồn kho và điều kiện khuyến mãi được kiểm tra lại trước khi
              tạo đơn.
            </p>
            <div className="flex flex-wrap gap-2">
              <label className="min-w-0 flex-1 text-sm">
                Mã khuyến mãi
                <input
                  maxLength={50}
                  className={oNhap}
                  value={ma}
                  onChange={(e) => {
                    setMa(e.target.value.toUpperCase());
                    setBaoGia(null);
                  }}
                />
              </label>
              <button
                type="button"
                disabled={dangBaoGia || gui}
                className={nutPhu + " self-end"}
                onClick={capNhatBaoGia}
              >
                Áp dụng / Cập nhật
              </button>
            </div>
            {dangBaoGia ? (
              <p>Đang kiểm tra giá và tồn kho...</p>
            ) : baoGia ? (
              <>
                <ul className="divide-y divide-slate-700">
                  {baoGia.chi_tiet.map((d) => (
                    <li
                      key={d.ma_san_pham}
                      className="flex justify-between gap-3 py-4 text-sm"
                    >
                      <span>
                        {d.ten_san_pham}
                        <span className="mt-1 block text-slate-400">
                          {d.so_luong} × {tienShop(d.don_gia)}
                        </span>
                      </span>
                      <span className="shrink-0">{tienShop(d.thanh_tien)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt>Tạm tính</dt>
                    <dd>{tienShop(baoGia.tam_tinh)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Giảm giá {baoGia.ma_giam_gia}</dt>
                    <dd>− {tienShop(baoGia.giam_gia)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-slate-700 pt-3 text-lg font-bold text-blue-300">
                    <dt>Tổng thanh toán</dt>
                    <dd>{tienShop(baoGia.tong_tien)}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="text-sm text-amber-200">
                Bấm “Áp dụng / Cập nhật” để kiểm tra lại tổng tiền trước khi
                đặt.
              </p>
            )}
            <button
              disabled={gui || dangBaoGia || !baoGia}
              className={nut + " w-full"}
            >
              {gui ? "Đang tạo đơn..." : laThanhToanOnline(form.phuong_thuc_thanh_toan) ? "Đặt hàng và thanh toán VNPay" : "Xác nhận đặt hàng"}
            </button>
            <Link
              className="block text-center text-sm text-blue-300"
              href="/cart"
            >
              Quay lại chỉnh giỏ hàng
            </Link>
          </section>
        </form>
      )}
    </>
  );
}

export default function DatHang() {
  const cart = useSyncExternalStore(subscribeCart, getCart, () => trong);
  const [chon, setChon] = useState<number[] | null>(null);
  const { user, tai, loi } = useTaiKhoan();
  useEffect(() => {
    initializeCart();
    Promise.resolve().then(() => {
      const query = new URLSearchParams(window.location.search);
      if (query.has('chon')) setChon((query.get('chon') ?? '').split(',').filter((id) => /^[1-9]\d*$/.test(id)).map(Number));
    });
  }, []);
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-5 py-10 text-white">
      <ThongBaoShop loi={loi} />
      {tai ? (
        <p>Đang tải thông tin đặt hàng...</p>
      ) : (
        <BieuMauDatHang
          key={user?.ma_nguoi_dung ?? "khach"}
          cart={chon === null ? cart : cart.filter((d) => chon.includes(d.id))}
          user={user}
        />
      )}
    </main>
  );
}
