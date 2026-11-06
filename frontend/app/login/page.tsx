import DangNhapDangKy from "@/components/shop/DangNhapDangKy";

export default async function DangNhap({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <DangNhapDangKy next={next} />;
}
