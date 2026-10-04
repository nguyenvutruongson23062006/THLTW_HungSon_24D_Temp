type ChiTietPhieuNhapProps = {
  params: Promise<{ maPhieuNhap: string }>;
};

export default async function ChiTietPhieuNhap({
  params,
}: ChiTietPhieuNhapProps) {
  const { maPhieuNhap } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Chi tiết phiếu nhập</h1>
      <p className="mt-2 text-slate-500">Mã phiếu nhập: {maPhieuNhap}</p>
    </div>
  );
}
