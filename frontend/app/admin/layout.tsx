"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ThanhBenQuanTri from "@/components/admin/ThanhBenQuanTri";
import ThanhTrenQuanTri from "@/components/admin/ThanhTrenQuanTri";
import { layThongTinNguoiDung, xoaPhienDangNhap } from "@/lib/api/authApi";
import { layTokenDangNhap, LoiApi } from "@/lib/api/apiClient";
import type { NguoiDung } from "@/types/admin";

function BaoVeQuanTri({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [nguoiDung, setNguoiDung] = useState<NguoiDung | null>(null);
  const [loi, setLoi] = useState("");
  const [lanTai, setLanTai] = useState(0);
  useEffect(() => {
    let huy = false;
    if (!layTokenDangNhap()) {
      router.replace("/admin/dang-nhap");
      return;
    }
    function kiemTra() {
      layThongTinNguoiDung()
        .then(({ user }) => {
          if (huy) return;
          if (
            user.vai_tro !== "quan_tri_vien" ||
            user.trang_thai !== "hoat_dong"
          ) {
            xoaPhienDangNhap();
            router.replace("/admin/dang-nhap");
            return;
          }
          localStorage.setItem("nguoi_dung", JSON.stringify(user));
          setNguoiDung(user);
        })
        .catch((error) => {
          if (huy) return;
          if (error instanceof LoiApi && [401, 403].includes(error.trangThai)) {
            xoaPhienDangNhap();
            router.replace("/admin/dang-nhap");
          } else
            setLoi(
              "Không thể kết nối backend. Kiểm tra Laravel đang chạy rồi thử lại.",
            );
        });
    }
    kiemTra();
    function hetPhien() {
      xoaPhienDangNhap();
      router.replace("/admin/dang-nhap");
    }
    window.addEventListener("cap-nhat-nguoi-dung", kiemTra);
    window.addEventListener("phien-quan-tri-het-han", hetPhien);
    return () => {
      huy = true;
      window.removeEventListener("cap-nhat-nguoi-dung", kiemTra);
      window.removeEventListener("phien-quan-tri-het-han", hetPhien);
    };
  }, [router, lanTai]);
  if (!nguoiDung)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#edf5fc] p-6 text-sm text-slate-600">
        <p>{loi || "Đang kiểm tra phiên quản trị..."}</p>
        {loi && (
          <button
            className="rounded-lg bg-sky-600 px-4 py-2 text-white"
            onClick={() => {
              setLoi("");
              setLanTai((v) => v + 1);
            }}
          >
            Thử lại
          </button>
        )}
      </div>
    );
  return (
    <div className="min-h-screen bg-[#edf5fc] text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ThanhBenQuanTri />
        <div className="min-w-0 flex-1">
          <ThanhTrenQuanTri nguoiDung={nguoiDung} />
          <main className="px-5 py-6 sm:px-8 print:p-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default function BoCucQuanTri({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  if (pathname === "/admin/dang-nhap") return children;
  return <BaoVeQuanTri>{children}</BaoVeQuanTri>;
}
