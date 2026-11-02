"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BoCucTrang({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const duongDanHienTai = usePathname();
  const dangOTrangQuanTri = duongDanHienTai.startsWith("/admin");
  const trangMuaHang = [
    "/login",
    "/dang-ky",
    "/quen-mat-khau",
    "/dat-lai-mat-khau",
    "/tai-khoan",
    "/don-hang",
    "/order",
    "/cart",
  ].some(
    (path) =>
      duongDanHienTai === path || duongDanHienTai.startsWith(path + "/"),
  );

  if (dangOTrangQuanTri) {
    return children;
  }

  return (
    <>
      <Navbar />
      <div className={`flex-1 ${trangMuaHang ? "bg-slate-900" : ""}`}>
        {children}
      </div>
      <Footer />
    </>
  );
}
