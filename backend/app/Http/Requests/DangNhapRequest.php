<?php

namespace App\Http\Requests;

use App\Support\ThongBaoKiemTra;
use Illuminate\Foundation\Http\FormRequest;

class DangNhapRequest extends FormRequest
{
    public function messages(): array
    {
        return ThongBaoKiemTra::NOI_DUNG;
    }

    public function attributes(): array
    {
        return ThongBaoKiemTra::TEN_TRUONG;
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dia_chi_email' => ['required', 'email'],
            'mat_khau' => ['required', 'string'],
        ];
    }
}
