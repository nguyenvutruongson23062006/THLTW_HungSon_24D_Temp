type ChiTietSanPhamProps = {
  params: Promise<{ maSanPham: string }>;
};

export default async function ChiTietSanPham({
  params,
}: ChiTietSanPhamProps) {
  const { maSanPham } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Chi tiết sản phẩm</h1>
      <p className="mt-2 text-slate-500">Mã sản phẩm: {maSanPham}</p>
    </div>
  );
}
