export default function ThanhTrenQuanTri() {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-5 py-3 backdrop-blur sm:px-8">
      <label className="flex h-10 w-full max-w-md items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-slate-400 shadow-sm">
        <span aria-hidden="true" className="text-lg">
          ⌕
        </span>
        <input
          type="search"
          placeholder="Tìm kiếm việc, khách hàng, đơn hàng..."
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </label>

      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          aria-label="Thông báo"
          className="relative text-xl text-slate-500 transition hover:text-sky-600"
        >
          ♧
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-lg text-sky-700">
            ♙
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-800">Admin</p>
            <p className="text-xs text-slate-500">Quản trị viên</p>
          </div>
          <span className="text-xs text-slate-400">⌄</span>
        </div>
      </div>
    </header>
  );
}
