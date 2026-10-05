type ChiTietPhieuXuatProps = {
  params: Promise<{ maPhieuXuat: string }>;
};

export default async function ChiTietPhieuXuat({
  params,
}: ChiTietPhieuXuatProps) {
  const { maPhieuXuat } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Chi tiết phiếu xuất</h1>
      <p className="mt-2 text-slate-500">Mã phiếu xuất: {maPhieuXuat}</p>
    </div>
  );
}
