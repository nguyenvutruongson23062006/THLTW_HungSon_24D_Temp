"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function BoCucTrang({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const duongDanHienTai = usePathname();
  const dangOTrangQuanTri = duongDanHienTai.startsWith("/admin");

  return (
    <>
      {!dangOTrangQuanTri && <Navbar />}
      {children}
    </>
  );
}
