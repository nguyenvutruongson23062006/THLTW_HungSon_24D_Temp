"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ThanhBenQuanTri from "@/components/admin/ThanhBenQuanTri";
import ThanhTrenQuanTri from "@/components/admin/ThanhTrenQuanTri";
import {
  layThongTinNguoiDung,
  xoaPhienDangNhap,
} from "@/lib/api/authApi";

export default function BoCucQuanTri({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [dangKiemTra, setDangKiemTra] = useState(true);

  useEffect(() => {
    let daHuy = false;
    const token = localStorage.getItem("auth_token") ??
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return () => {
        daHuy = true;
      };
    }

    layThongTinNguoiDung()
      .then(({ user }) => {
        if (user.vai_tro !== "quan_tri_vien") {
          xoaPhienDangNhap();
          router.replace("/login");
          return;
        }

        if (!daHuy) {
          setDangKiemTra(false);
        }
      })
      .catch(() => {
        xoaPhienDangNhap();
        router.replace("/login");
      });

    return () => {
      daHuy = true;
    };
  }, [router]);

  if (dangKiemTra) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edf5fc] text-sm text-slate-500">
        Đang kiểm tra phiên quản trị...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edf5fc] text-slate-900">
      <div className="flex min-h-screen">
        <ThanhBenQuanTri />

        <div className="min-w-0 flex-1">
          <ThanhTrenQuanTri />
          <main className="px-5 py-6 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
