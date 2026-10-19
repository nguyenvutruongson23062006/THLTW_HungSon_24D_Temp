# Bổ sung danh mục xe

Chạy từ thư mục `backend`:

```powershell
php artisan db:seed --class=ExpandedCatalogSeeder
php artisan db:seed --class=PublicProductImagesSeeder
```

Seeder bổ sung 20 phiên bản xe (5 tay ga, 5 xe số, 5 côn tay, 5 mô tô phân khối lớn) và 4 biến thể màu mũ LS2 FF808 Stream II, size M. Giữ nguyên sản phẩm cũ, đơn hàng, giá và tồn kho đã chỉnh. Chạy lại không tạo bản ghi trùng; không khôi phục sản phẩm đã xóa mềm.

`products.json` lưu nguồn ảnh và trang giá tham khảo được kiểm tra ngày 19/10/2026. Giá hãng có thể thay đổi; đây không phải báo giá của cửa hàng. Tồn kho khởi tạo 1–10 theo yêu cầu phục vụ đồ án. Không tạo năm sản xuất, dung tích động cơ hoặc khuyến mãi khi chưa xác minh được cho từng phiên bản.

Ảnh sản phẩm thật được lưu trong `frontend/public/products/catalog`. Ảnh Daytona do người dùng cung cấp. Một số mẫu có thêm ảnh ngang trong bảng `hinh_anh_san_pham`.

Trước khi ghi, seeder lưu bản sao ba bảng liên quan tại `backend/storage/app/private/catalog-backups/`. Toàn bộ thao tác thêm dữ liệu nằm trong một transaction.

Không dùng `migrate:fresh` để cập nhật database đang có dữ liệu.

`PublicProductImagesSeeder` gắn ảnh có sẵn trong `public/products` cho 13 sản phẩm tương ứng, bổ sung ảnh màu vào thư viện và thay ảnh mẫu bị thiếu. Không thêm sản phẩm hoặc sửa giá, tồn kho. Những ảnh Honda CB650R, CBR650R, Kawasaki Z650, Ninja 650 và Suzuki GSX-8R chưa được gắn vì database chưa có sản phẩm tương ứng; không gán chúng sang mẫu xe khác.
