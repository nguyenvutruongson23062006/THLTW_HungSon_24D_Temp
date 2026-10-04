type TheThongKeProps = {
  nhan: string;
  giaTri: string;
  thayDoi?: string;
};

export default function TheThongKe({
  nhan,
  giaTri,
  thayDoi,
}: TheThongKeProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{nhan}</p>
      <p className="mt-3 text-2xl font-bold text-slate-900">{giaTri}</p>
      {thayDoi && <p className="mt-2 text-xs text-emerald-600">↑ {thayDoi}</p>}
    </article>
  );
}
