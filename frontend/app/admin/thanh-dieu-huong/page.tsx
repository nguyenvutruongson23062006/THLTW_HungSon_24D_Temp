import TrangQuanLyDuLieu from "@/components/admin/TrangQuanLyDuLieu";
import { CAU_HINH_DU_LIEU } from "@/lib/admin/cauHinhDuLieu";

export default function QuanLyThanhDieuHuong() {
  return <TrangQuanLyDuLieu cauHinh={CAU_HINH_DU_LIEU["thanh-dieu-huong"]} />;
}
