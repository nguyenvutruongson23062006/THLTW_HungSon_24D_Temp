import KhoiPhucMatKhau from "@/components/shop/KhoiPhucMatKhau";
export default async function DatLai({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email, token } = await searchParams;
  return <KhoiPhucMatKhau datLai email={email} token={token} />;
}
