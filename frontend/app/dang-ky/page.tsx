import DangNhapDangKy from "@/components/shop/DangNhapDangKy";

export default async function DangKy({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <DangNhapDangKy dangKy next={next} />;
}
