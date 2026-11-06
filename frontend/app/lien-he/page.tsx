"use client";

import { useState, type SyntheticEvent } from "react";
import { guiShop } from "@/lib/shop/api";
import { khung, nut, oNhap, ThongBaoShop } from "@/components/shop/GiaoDien";

export default function LienHeShop() {
  const [form, setForm] = useState({ho_ten:'',dia_chi_email:'',so_dien_thoai:'',tieu_de:'',noi_dung:''});
  const [gui, setGui] = useState(false);
  const [loi, setLoi] = useState('');
  const [bao, setBao] = useState('');
  async function xuLy(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault(); if (gui) return;
    setGui(true);setLoi('');setBao('');
    try {
      const data = await guiShop<{ma_lien_he:number}>('/cua-hang/lien-he',form);
      setBao(`Đã gửi liên hệ #${data.ma_lien_he}. Cửa hàng sẽ liên hệ lại qua email hoặc số điện thoại bạn cung cấp.`);
      setForm({...form,tieu_de:'',noi_dung:''});
    } catch(e) { setLoi(e instanceof Error ? e.message : 'Không thể gửi liên hệ. Vui lòng thử lại.'); }
    finally { setGui(false); }
  }
  return <main className="mx-auto max-w-4xl space-y-6 px-5 py-12 text-white">
    <div><p className="text-sm text-blue-300">MOTOCYCLELEGEND · Hỗ trợ khách hàng</p><h1 className="mt-2 text-3xl font-bold">Liên hệ cửa hàng</h1><p className="mt-3 text-slate-300">Bạn cần tư vấn sản phẩm, hỗ trợ đơn hàng hoặc góp ý? Hãy để lại thông tin bên dưới. Không cần đăng nhập để gửi liên hệ.</p></div>
    <ThongBaoShop loi={loi} bao={bao} />
    <form onSubmit={xuLy} className={khung}><fieldset disabled={gui} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">{([{ten:'ho_ten',nhan:'Họ và tên',type:'text',auto:'name'},{ten:'dia_chi_email',nhan:'Email',type:'email',auto:'email'},{ten:'so_dien_thoai',nhan:'Số điện thoại (không bắt buộc)',type:'tel',auto:'tel'},{ten:'tieu_de',nhan:'Tiêu đề liên hệ',type:'text',auto:'off'}] as const).map((f)=><label key={f.ten} className="block text-sm">{f.nhan}<input className={oNhap} required={f.ten!=='so_dien_thoai'} type={f.type} autoComplete={f.auto} maxLength={f.ten==='so_dien_thoai'?20:255} value={form[f.ten]} onChange={(e)=>setForm({...form,[f.ten]:e.target.value})} /></label>)}</div>
      <label className="block text-sm">Nội dung<textarea className={oNhap+' min-h-40'} required minLength={10} maxLength={5000} value={form.noi_dung} onChange={(e)=>setForm({...form,noi_dung:e.target.value})} placeholder="Mô tả nội dung cần hỗ trợ; ghi mã đơn nếu liên quan đến đơn hàng." /></label>
      <p className="text-xs text-slate-400">Nội dung từ 10 đến 5.000 ký tự. Không gửi mật khẩu, mã OTP hoặc thông tin thẻ ngân hàng.</p>
      <button className={nut} type="submit" disabled={gui}>{gui?'Đang gửi...':'Gửi liên hệ'}</button>
    </fieldset></form>
  </main>;
}
