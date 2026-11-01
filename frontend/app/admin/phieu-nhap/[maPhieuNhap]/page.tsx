import QuanLyKho from "@/components/admin/QuanLyKho";
import { notFound } from "next/navigation";

type ChiTietPhieuNhapProps = {
  params: Promise<{ maPhieuNhap: string }>;
};

export default async function ChiTietPhieuNhap({
  params,
}: ChiTietPhieuNhapProps) {
  const { maPhieuNhap } = await params;
  if (
    !/^[1-9]\d*$/.test(maPhieuNhap) ||
    !Number.isSafeInteger(Number(maPhieuNhap))
  )
    notFound();

  return <QuanLyKho loai="nhap" ma={Number(maPhieuNhap)} />;
}
