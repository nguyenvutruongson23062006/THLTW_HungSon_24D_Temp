import QuanLyKho from "@/components/admin/QuanLyKho";
import { notFound } from "next/navigation";

type ChiTietPhieuXuatProps = {
  params: Promise<{ maPhieuXuat: string }>;
};

export default async function ChiTietPhieuXuat({
  params,
}: ChiTietPhieuXuatProps) {
  const { maPhieuXuat } = await params;
  if (
    !/^[1-9]\d*$/.test(maPhieuXuat) ||
    !Number.isSafeInteger(Number(maPhieuXuat))
  )
    notFound();

  return <QuanLyKho loai="xuat" ma={Number(maPhieuXuat)} />;
}
