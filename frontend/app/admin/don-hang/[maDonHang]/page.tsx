type ChiTietDonHangProps = {
  params: Promise<{ maDonHang: string }>;
};

export default async function ChiTietDonHang({
  params,
}: ChiTietDonHangProps) {
  const { maDonHang } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
      <p className="mt-2 text-slate-500">Mã đơn hàng: {maDonHang}</p>
    </div>
  );
}
