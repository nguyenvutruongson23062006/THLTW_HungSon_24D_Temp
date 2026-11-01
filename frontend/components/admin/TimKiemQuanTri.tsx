"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/apiClient";

type KetQua = { nhom: string; ma: number; ten: string; duong_dan: string };

export default function TimKiemQuanTri({ tuKhoa }: { tuKhoa: string }) {
  const [data, setData] = useState<KetQua[]>([]);
  const [loi, setLoi] = useState("");
  const [tai, setTai] = useState(true);
  useEffect(() => {
    const ac = new AbortController();
    apiRequest<KetQua[]>(
      `/admin/tim-kiem?tu_khoa=${encodeURIComponent(tuKhoa)}`,
      { signal: ac.signal },
    )
      .then((v) => {
        if (!ac.signal.aborted) setData(v);
      })
      .catch((e) => {
        if (!ac.signal.aborted)
          setLoi(e instanceof Error ? e.message : "Tìm kiếm thất bại.");
      })
      .finally(() => {
        if (!ac.signal.aborted) setTai(false);
      });
    return () => ac.abort();
  }, [tuKhoa]);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Kết quả tìm kiếm</h1>
      <p className="text-sm text-slate-500">Từ khóa: {tuKhoa || "Chưa nhập"}</p>
      {loi && <p className="rounded-lg bg-rose-50 p-4 text-rose-700">{loi}</p>}
      <section className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {tai ? (
          <p className="p-6 text-slate-500">Đang tìm kiếm...</p>
        ) : data.length === 0 ? (
          <p className="p-6 text-slate-500">Không có kết quả phù hợp.</p>
        ) : (
          data.map((v) => (
            <Link
              key={`${v.nhom}-${v.ma}`}
              href={v.duong_dan}
              className="block p-5 hover:bg-slate-50"
            >
              <p className="text-xs text-sky-600">
                {v.nhom} · #{v.ma}
              </p>
              <p className="mt-1 font-medium">{v.ten}</p>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
