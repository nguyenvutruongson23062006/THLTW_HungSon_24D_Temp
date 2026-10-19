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

  if (dangOTrangQuanTri) {
    return children;
  }

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
