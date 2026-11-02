<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class DatLaiMatKhauMail extends Mailable
{
    public function __construct(public string $duongDan) {}

    public function build()
    {
        return $this->subject('Đặt lại mật khẩu MOTOCYCLELEGEND')->html(
            '<p>Bạn đã yêu cầu đặt lại mật khẩu.</p><p><a href="'.e($this->duongDan).'">Đặt lại mật khẩu</a></p><p>Liên kết có hiệu lực trong 60 phút và chỉ sử dụng một lần. Nếu không yêu cầu, bạn có thể bỏ qua email này.</p>'
        );
    }
}
