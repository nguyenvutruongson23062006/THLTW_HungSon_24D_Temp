"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/apiClient";
type Dong = { ma_don_hang: number; ho_ten: string; tong_tien: string };
export default function ChoThanhToan() {
  const [ds, setDs] = useState<Dong[]>([]);
  const [loi, setLoi] = useState('');
  useEffect(() => { apiRequest<Dong[]>('/admin/don-hang?cho_thanh_toan=1&per_page=100').then(setDs).catch((e) => setLoi(e.message)); }, []);
  return <div className="space-y-5"><h1 className="text-2xl font-bold">Chờ đối soát chuyển khoản</h1><p>Đây là phiên chờ thanh toán, chưa phải đơn hàng chính thức. Chỉ xác nhận thu tiền sau khi kiểm tra giao dịch ngân hàng thực tế.</p><Link className="text-blue-600" href="/admin/don-hang">Về đơn hàng chính thức</Link>{loi && <p role="alert">{loi}</p>}<div className="rounded-xl bg-white p-5">{ds.map((d) => <div key={d.ma_don_hang} className="flex flex-wrap justify-between gap-3 border-b py-4"><span>Yêu cầu #{d.ma_don_hang} · {d.ho_ten} · {Number(d.tong_tien).toLocaleString('vi-VN')}đ</span><Link className="text-blue-600" href={`/admin/don-hang/${d.ma_don_hang}`}>Kiểm tra và đối soát</Link></div>)}{!ds.length && !loi && <p>Chưa có yêu cầu chuyển khoản chờ đối soát.</p>}</div></div>;
}
