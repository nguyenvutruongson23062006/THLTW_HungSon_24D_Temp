<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class NoiDungQuanTriController extends Controller
{
    private const BANG = [
        'bai-viet' => ['bai_viet', 'ma_bai_viet', 'tieu_de', 'anh_dai_dien'],
        'trang-don' => ['trang_don', 'ma_trang_don', 'tieu_de', null],
        'anh-quang-cao' => ['anh_quang_cao', 'ma_anh_quang_cao', 'tieu_de', 'hinh_anh'],
        'thanh-dieu-huong' => ['thanh_dieu_huong', 'ma_thanh_dieu_huong', 'ten_hien_thi', null],
        'lien-he' => ['lien_he', 'ma_lien_he', 'ho_ten', null],
    ];

    private function cauHinh(string $loai): array
    {
        abort_unless(isset(self::BANG[$loai]), 404);

        return self::BANG[$loai];
    }

    public function index(Request $request, string $loai)
    {
        [$bang, $khoa, $ten] = $this->cauHinh($loai);
        $request->validate(['tu_khoa' => 'nullable|string|max:255', 'trang_thai' => 'nullable|string|max:50', 'thung_rac' => 'nullable|boolean']);
        $query = DB::table($bang);
        $request->boolean('thung_rac') ? $query->whereNotNull('ngay_xoa') : $query->whereNull('ngay_xoa');
        if ($request->filled('tu_khoa')) {
            $query->where($ten, 'like', '%'.$request->string('tu_khoa')->trim().'%');
        }
        if ($request->filled('trang_thai')) {
            $query->where('trang_thai', $request->input('trang_thai'));
        }

        return response()->json(['data' => $query->orderByDesc($khoa)->get()]);
    }

    public function show(string $loai, int $ma)
    {
        [$bang, $khoa] = $this->cauHinh($loai);
        $dong = DB::table($bang)->where($khoa, $ma)->first();
        abort_if(! $dong, 404);

        return response()->json(['data' => $dong]);
    }

    public function store(Request $request, string $loai)
    {
        abort_if($loai === 'lien-he', 405);

        return $this->luu($request, $loai);
    }

    public function update(Request $request, string $loai, int $ma)
    {
        return $this->luu($request, $loai, $ma);
    }

    private function luu(Request $request, string $loai, ?int $ma = null)
    {
        [$bang, $khoa, , $cotAnh] = $this->cauHinh($loai);
        $cu = $ma ? DB::table($bang)->where($khoa, $ma)->whereNull('ngay_xoa')->first() : null;
        abort_if($ma && ! $cu, 404);
        if (in_array($loai, ['bai-viet', 'trang-don'], true) && ! $request->filled('duong_dan')) {
            $request->merge(['duong_dan' => Str::slug($request->input('tieu_de', ''))]);
        }
        $quyTac = match ($loai) {
            'bai-viet' => [
                'tieu_de' => 'required|string|max:255',
                'duong_dan' => ['required', 'string', 'max:250', Rule::unique($bang, 'duong_dan')->ignore($ma, $khoa)],
                'tom_tat' => 'nullable|string|max:5000', 'noi_dung' => 'required|string',
                'anh_dai_dien' => 'nullable|string|max:255', 'trang_thai' => ['required', Rule::in(['an', 'hien_thi'])],
            ],
            'trang-don' => [
                'tieu_de' => 'required|string|max:255',
                'duong_dan' => ['required', 'string', 'max:250', Rule::unique($bang, 'duong_dan')->ignore($ma, $khoa)],
                'noi_dung' => 'required|string', 'trang_thai' => ['required', Rule::in(['an', 'hien_thi'])],
            ],
            'anh-quang-cao' => [
                'tieu_de' => 'nullable|string|max:255', 'hinh_anh' => 'nullable|string|max:255',
                'vi_tri' => ['required', Rule::in(['trang_chu', 'sidebar', 'danh_muc'])],
                'duong_dan' => 'nullable|string|max:255', 'thu_tu_hien_thi' => 'required|integer|min:0|max:1000000',
                'trang_thai' => ['required', Rule::in(['hoat_dong', 'tam_ngung'])],
            ],
            'thanh-dieu-huong' => [
                'ten_hien_thi' => 'required|string|max:255',
                'duong_dan' => ['required', 'string', 'max:250', Rule::unique($bang, 'duong_dan')->ignore($ma, $khoa)],
                'ma_thanh_dieu_huong_cha' => ['nullable', 'integer', Rule::exists($bang, $khoa)->whereNull('ngay_xoa')],
                'thu_tu_hien_thi' => 'required|integer|min:0|max:1000000',
                'trang_thai' => ['required', Rule::in(['hoat_dong', 'tam_ngung'])],
            ],
            'lien-he' => [
                'phan_hoi' => 'nullable|string|max:20000',
                'trang_thai' => ['required', Rule::in(['chua_xu_ly', 'dang_xu_ly', 'da_xu_ly', 'da_phan_hoi'])],
            ],
        };
        $quyTac['tep_anh'] = 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048';
        $data = $request->validate($quyTac, [
            '*.required' => 'Vui lòng điền đầy đủ thông tin bắt buộc.',
            'duong_dan.unique' => 'Đường dẫn đã tồn tại, kể cả trong thùng rác.',
            'tep_anh.max' => 'Ảnh không được lớn hơn 2 MB.',
            'tep_anh.image' => 'Vui lòng chọn tệp hình ảnh hợp lệ.',
        ]);
        unset($data['tep_anh']);
        if ($loai === 'thanh-dieu-huong') {
            $cha = $data['ma_thanh_dieu_huong_cha'] ?? null;
            $daXem = [];
            while ($cha !== null) {
                if ((int) $cha === $ma || isset($daXem[$cha])) {
                    throw ValidationException::withMessages(['ma_thanh_dieu_huong_cha' => 'Mục cha không được tạo thành vòng lặp.']);
                }
                $daXem[$cha] = true;
                $cha = DB::table($bang)->where($khoa, $cha)->value('ma_thanh_dieu_huong_cha');
            }
            if (! preg_match('~^(?:/(?!/)|https?://)~i', $data['duong_dan'])) {
                throw ValidationException::withMessages(['duong_dan' => 'Liên kết phải bắt đầu bằng /, http:// hoặc https://.']);
            }
        }
        if ($loai === 'lien-he') {
            if ($data['trang_thai'] === 'da_phan_hoi' && empty($data['phan_hoi'])) {
                throw ValidationException::withMessages(['phan_hoi' => 'Vui lòng nhập nội dung phản hồi.']);
            }
            if (! empty($data['phan_hoi']) && ($data['phan_hoi'] !== $cu->phan_hoi)) {
                $data['thoi_gian_phan_hoi'] = now();
            }
        }
        $tepMoi = null;
        if ($cotAnh && $request->hasFile('tep_anh')) {
            $tepMoi = $request->file('tep_anh')->store('admin/'.$loai, 'public');
            $data[$cotAnh] = url(Storage::url($tepMoi));
        }
        if ($loai === 'anh-quang-cao' && empty($data['hinh_anh'])) {
            throw ValidationException::withMessages(['hinh_anh' => 'Vui lòng chọn ảnh quảng cáo hoặc nhập đường dẫn ảnh.']);
        }
        $data['ngay_cap_nhat'] = now();
        try {
            if ($cu) {
                DB::table($bang)->where($khoa, $ma)->update($data);
            } else {
                $data['ngay_tao'] = now();
                if (in_array($loai, ['bai-viet', 'trang-don'], true)) {
                    $data['ma_nguoi_dung'] = $request->user()->getKey();
                }
                $ma = DB::table($bang)->insertGetId($data, $khoa);
            }
        } catch (\Throwable $loi) {
            if ($tepMoi) {
                Storage::disk('public')->delete($tepMoi);
            }
            throw $loi;
        }
        if ($tepMoi && $cu) {
            $this->xoaAnh($cu->{$cotAnh}, $loai);
        }

        return response()->json(['message' => 'Lưu dữ liệu thành công.', 'data' => DB::table($bang)->where($khoa, $ma)->first()], $cu ? 200 : 201);
    }

    public function destroy(string $loai, int $ma)
    {
        [$bang, $khoa] = $this->cauHinh($loai);
        abort_unless(DB::table($bang)->where($khoa, $ma)->whereNull('ngay_xoa')->exists(), 404);
        $this->kiemTraCon($loai, $ma, false);
        DB::table($bang)->where($khoa, $ma)->update(['ngay_xoa' => now(), 'ngay_cap_nhat' => now()]);

        return response()->json(['message' => 'Đã chuyển vào thùng rác.']);
    }

    public function khoiPhuc(string $loai, int $ma)
    {
        [$bang, $khoa] = $this->cauHinh($loai);
        $dong = DB::table($bang)->where($khoa, $ma)->whereNotNull('ngay_xoa')->first();
        abort_if(! $dong, 404);
        if ($loai === 'thanh-dieu-huong' && $dong->ma_thanh_dieu_huong_cha && DB::table($bang)->where($khoa, $dong->ma_thanh_dieu_huong_cha)->whereNotNull('ngay_xoa')->exists()) {
            throw ValidationException::withMessages(['ma_thanh_dieu_huong_cha' => 'Hãy khôi phục mục cha trước.']);
        }
        DB::table($bang)->where($khoa, $ma)->update(['ngay_xoa' => null, 'ngay_cap_nhat' => now()]);

        return response()->json(['message' => 'Khôi phục thành công.']);
    }

    public function xoaVinhVien(string $loai, int $ma)
    {
        [$bang, $khoa, , $cotAnh] = $this->cauHinh($loai);
        $dong = DB::table($bang)->where($khoa, $ma)->whereNotNull('ngay_xoa')->first();
        abort_if(! $dong, 404);
        $this->kiemTraCon($loai, $ma, true);
        DB::table($bang)->where($khoa, $ma)->delete();
        if ($cotAnh) {
            $this->xoaAnh($dong->{$cotAnh}, $loai);
        }

        return response()->json(['message' => 'Đã xóa vĩnh viễn.']);
    }

    private function kiemTraCon(string $loai, int $ma, bool $tatCa): void
    {
        if ($loai !== 'thanh-dieu-huong') {
            return;
        }
        $query = DB::table('thanh_dieu_huong')->where('ma_thanh_dieu_huong_cha', $ma);
        if (! $tatCa) {
            $query->whereNull('ngay_xoa');
        }
        if ($query->exists()) {
            throw ValidationException::withMessages(['ma_thanh_dieu_huong_cha' => 'Hãy xử lý các mục con trước khi xóa mục cha.']);
        }
    }

    private function xoaAnh(?string $url, string $loai): void
    {
        $path = $url ? parse_url($url, PHP_URL_PATH) : null;
        if (is_string($path) && str_starts_with($path, '/storage/admin/'.$loai.'/') && ! str_contains($path, '..')) {
            Storage::disk('public')->delete(substr($path, strlen('/storage/')));
        }
    }
}
