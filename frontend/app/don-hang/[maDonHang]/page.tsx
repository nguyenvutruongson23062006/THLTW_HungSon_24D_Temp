import { notFound } from "next/navigation";
import DonHangThanhVien from "@/components/shop/DonHangThanhVien";
export default async function ChiTietDon({
  params,
}: {
  params: Promise<{ maDonHang: string }>;
}) {
  const { maDonHang } = await params;
  if (!/^[1-9]\d*$/.test(maDonHang) || !Number.isSafeInteger(Number(maDonHang)))
    notFound();
  return <DonHangThanhVien ma={Number(maDonHang)} />;
}
