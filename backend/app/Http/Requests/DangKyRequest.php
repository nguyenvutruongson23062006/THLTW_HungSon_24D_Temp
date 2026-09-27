<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DangKyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        $data = $this->all();

        if (isset($data['xac_nhan_mat_khau']) && !isset($data['mat_khau_confirmation'])) {
            $data['mat_khau_confirmation'] = $data['xac_nhan_mat_khau'];
        }

        if (isset($data['nhap_lai_mat_khau']) && !isset($data['mat_khau_confirmation'])) {
            $data['mat_khau_confirmation'] = $data['nhap_lai_mat_khau'];
        }

        $this->replace($data);
    }

    public function rules(): array
    {
        return [
            'ho_ten' => ['required', 'string', 'max:255'],
            'ten_dang_nhap' => ['required', 'string', 'max:255', 'unique:nguoi_dung,ten_dang_nhap'],
            'dia_chi_email' => ['required', 'email', 'max:255', 'unique:nguoi_dung,dia_chi_email'],
            'so_dien_thoai' => ['nullable', 'string', 'max:20'],
            'mat_khau' => ['required', 'string', 'min:6', 'confirmed'],
        ];
    }
}