import BieuMauSanPham from "@/components/admin/BieuMauSanPham";

type SuaSanPhamProps = {
  params: Promise<{ maSanPham: string }>;
};

export default async function SuaSanPham({
  params,
}: SuaSanPhamProps) {
  const { maSanPham } = await params;
  const maSanPhamSo = Number(maSanPham);

  if (!Number.isInteger(maSanPhamSo) || maSanPhamSo <= 0) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        Mã sản phẩm không hợp lệ.
      </div>
    );
  }

  return (
    <BieuMauSanPham
      cheDo="sua"
      maSanPham={maSanPhamSo}
    />
  );
}