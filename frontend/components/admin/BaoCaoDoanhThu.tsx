"use client";
import { useEffect, useState, type SyntheticEvent } from "react";
import { layBaoCao, type BaoCaoQuanTri } from "@/lib/api/thongKeApi";
const tien = (v: number | string) => Number(v).toLocaleString('vi-VN') + 'đ';
const nut = 'rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm disabled:opacity-50';
export default function BaoCaoDoanhThu() {
  const homNay = new Date().toLocaleDateString('en-CA');
  const [tu, setTu] = useState(homNay.slice(0,7) + '-01');
  const [den, setDen] = useState(homNay);
  const [loc, setLoc] = useState({tu, den});
  const [data, setData] = useState<BaoCaoQuanTri | null>(null);
  const [loi, setLoi] = useState('');
  const [tai, setTai] = useState(true);
  useEffect(() => {
    const ac = new AbortController();
    layBaoCao(loc.tu, loc.den, ac.signal).then(setData).catch((e) => { if (!ac.signal.aborted) setLoi(e.message); }).finally(() => { if (!ac.signal.aborted) setTai(false); });
    return () => ac.abort();
  }, [loc]);
  function apDung(e: SyntheticEvent) { e.preventDefault(); setTai(true); setLoi(''); setData(null); setLoc({tu,den}); }
  function xuat() {
    if (!data) return;
    const dong = [['Ngày','Doanh thu đã thu (VND)','Số đơn đã thu'],...data.doanh_thu_theo_ngay.map((d) => [d.ngay,String(d.doanh_thu),String(d.so_don)])];
    const url = URL.createObjectURL(new Blob(['\uFEFF'+dong.map((r) => r.map((v) => '"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=`doanh-thu-${data.tu_ngay}-${data.den_ngay}.csv`;a.click();URL.revokeObjectURL(url);
  }
  const ngay = data?.doanh_thu_theo_ngay ?? [];
  const soDonThu = ngay.reduce((s,d) => s + Number(d.so_don),0);
  const max = Math.max(1,...ngay.map((d) => Number(d.doanh_thu)));
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-sky-600">Phân tích kinh doanh</p><h1 className="text-3xl font-bold">Báo cáo doanh thu</h1><p className="mt-2 text-sm text-slate-500">Phân tích khoản đã thu theo ngày. Không tính đơn chưa thanh toán, đã hoàn tiền hoặc đã hủy.</p></div><div className="flex gap-2 print:hidden"><button className={nut} disabled={!data || tai} onClick={xuat}>Xuất CSV doanh thu</button><button className={nut} onClick={() => window.print()}>In báo cáo</button></div></div>
    <form onSubmit={apDung} className="flex flex-wrap items-end gap-4 rounded-xl border bg-white p-5 print:hidden"><label>Từ ngày<input className="mt-1 block rounded border p-2" required type="date" value={tu} max={den} onChange={(e)=>setTu(e.target.value)} /></label><label>Đến ngày<input className="mt-1 block rounded border p-2" required type="date" value={den} min={tu} onChange={(e)=>setDen(e.target.value)} /></label><button className={nut} disabled={tai}>Xem báo cáo</button></form>
    {loi && <p role="alert" className="text-red-700">{loi}</p>}{tai && <p>Đang tính báo cáo...</p>}
    {data && <>
      <p className="text-sm text-slate-500">Kỳ báo cáo: {data.tu_ngay} đến {data.den_ngay}</p>
      <div className="grid gap-4 sm:grid-cols-3">{[['Doanh thu đã thu',tien(data.tong_quan.doanh_thu)],['Số đơn đã thu',soDonThu],['Giá trị trung bình / đơn đã thu',tien(soDonThu ? Number(data.tong_quan.doanh_thu)/soDonThu : 0)]].map(([nhan,v])=><article key={nhan} className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-500">{nhan}</p><p className="mt-3 text-2xl font-bold text-sky-700">{v}</p></article>)}</div>
      <section className="rounded-xl border bg-white p-5"><h2 className="font-semibold">Biến động doanh thu theo ngày</h2><div className="overflow-x-auto"><div className="mt-6 flex h-48 min-w-max items-end gap-2 border-b">{ngay.map((d)=><div key={d.ngay} title={`${d.ngay}: ${tien(d.doanh_thu)} · ${d.so_don} đơn`} className="flex h-full w-8 items-end"><div className="w-full rounded-t bg-sky-500" style={{height:`${Math.max(1,Number(d.doanh_thu)/max*100)}%`}} /></div>)}</div></div><p className="mt-3 text-xs text-slate-500">Mỗi cột là một ngày. Rê chuột vào cột để xem số tiền và số đơn.</p></section>
      <section className="overflow-hidden rounded-xl border bg-white"><h2 className="p-5 font-semibold">Chi tiết doanh thu theo ngày</h2><div className="max-h-120 overflow-auto print:max-h-none"><table className="w-full text-left text-sm"><thead className="sticky top-0 bg-slate-100"><tr><th className="p-3">Ngày</th><th>Số đơn đã thu</th><th>Doanh thu</th><th>Trung bình / đơn</th></tr></thead><tbody>{ngay.map((d)=><tr key={d.ngay} className="border-t"><td className="p-3">{d.ngay}</td><td>{d.so_don}</td><td>{tien(d.doanh_thu)}</td><td>{tien(Number(d.so_don) ? Number(d.doanh_thu)/Number(d.so_don) : 0)}</td></tr>)}</tbody><tfoot className="border-t bg-sky-50 font-semibold"><tr><td className="p-3">Tổng kỳ</td><td>{soDonThu}</td><td>{tien(data.tong_quan.doanh_thu)}</td><td>—</td></tr></tfoot></table></div></section>
    </>}
  </div>;
}
