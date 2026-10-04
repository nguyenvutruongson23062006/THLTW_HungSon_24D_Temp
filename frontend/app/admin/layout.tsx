import ThanhBenQuanTri from "@/components/admin/ThanhBenQuanTri";
import ThanhTrenQuanTri from "@/components/admin/ThanhTrenQuanTri";

export default function BoCucQuanTri({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#edf5fc] text-slate-900">
      <div className="flex min-h-screen">
        <ThanhBenQuanTri />

        <div className="min-w-0 flex-1">
          <ThanhTrenQuanTri />
          <main className="px-5 py-6 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
