<?php

return [
    'vnpay' => [
        'enabled' => env('VNPAY_ENABLED', false),
        'sandbox' => env('VNPAY_SANDBOX', true),
        'tmn_code' => env('VNPAY_TMN_CODE', ''),
        'hash_secret' => env('VNPAY_HASH_SECRET', ''),
        'return_url' => env('VNPAY_RETURN_URL', 'http://127.0.0.1:8000/api/thanh-toan/vnpay/return'),
    ],
];
