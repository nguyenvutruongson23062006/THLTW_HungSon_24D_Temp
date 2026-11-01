import TimKiemQuanTri from "@/components/admin/TimKiemQuanTri";

export default async function TimKiemPage({
  searchParams,
}: {
  searchParams: Promise<{ tu_khoa?: string }>;
}) {
  const { tu_khoa } = await searchParams;
  return <TimKiemQuanTri key={tu_khoa ?? ""} tuKhoa={tu_khoa ?? ""} />;
}
