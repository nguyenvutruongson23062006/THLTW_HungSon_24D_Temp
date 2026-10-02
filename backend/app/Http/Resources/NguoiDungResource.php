<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NguoiDungResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'ma_nguoi_dung' => $this->ma_nguoi_dung,
            'ho_ten' => $this->ho_ten,
            'ten_dang_nhap' => $this->ten_dang_nhap,
            'dia_chi_email' => $this->dia_chi_email,
            'anh_dai_dien' => $this->anh_dai_dien,
            'so_dien_thoai' => $this->so_dien_thoai,
            'dia_chi' => $this->dia_chi,
            'vai_tro' => $this->vai_tro,
            'trang_thai' => $this->trang_thai,
            'ngay_tao' => $this->ngay_tao,
            'ngay_cap_nhat' => $this->ngay_cap_nhat,
        ];
    }
}