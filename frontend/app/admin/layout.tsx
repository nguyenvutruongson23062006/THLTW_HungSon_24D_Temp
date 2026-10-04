export default function BoCucQuanTri({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#eef5fb] text-slate-900">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Khu vực quản trị
          </p>

          <p className="text-xs text-slate-500">
            Quản lý hoạt động cửa hàng
          </p>
        </div>

        <span className="text-sm text-slate-600">Admin</span>
      </header>

      <main className="px-5 py-6 sm:px-8">{children}</main>
    </div>
  );
}