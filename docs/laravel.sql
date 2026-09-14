-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th9 10, 2026 lúc 12:12 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `laravel`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `anh_quang_cao`
--

CREATE TABLE `anh_quang_cao` (
  `ma_anh_quang_cao` bigint(20) UNSIGNED NOT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `hinh_anh` varchar(255) NOT NULL,
  `vi_tri` varchar(255) NOT NULL DEFAULT 'trang_chu',
  `duong_dan` varchar(255) DEFAULT NULL,
  `thu_tu_hien_thi` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'hoat_dong',
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `anh_quang_cao`
--

INSERT INTO `anh_quang_cao` (`ma_anh_quang_cao`, `tieu_de`, `hinh_anh`, `vi_tri`, `duong_dan`, `thu_tu_hien_thi`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 'Ưu đãi xe tay ga cuối tuần', '/images/banners/banner-xe-tay-ga.jpg', 'trang_chu', '/san-pham/xe-tay-ga', 1, 'hoat_dong', '2026-09-05 03:11:29', '2026-09-09 03:11:29', NULL),
(2, 'Trả góp xe côn tay lãi suất 0%', '/images/banners/banner-tra-gop.jpg', 'sidebar', '/khuyen-mai', 2, 'hoat_dong', '2026-09-06 03:11:29', '2026-09-09 03:11:29', NULL),
(3, 'Combo mũ bảo hiểm và thùng xe', '/images/banners/banner-phu-kien-tour.jpg', 'danh_muc', '/san-pham/phu-kien-touring', 3, 'hoat_dong', '2026-09-07 03:11:29', '2026-09-09 03:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bai_viet`
--

CREATE TABLE `bai_viet` (
  `ma_bai_viet` bigint(20) UNSIGNED NOT NULL,
  `ma_nguoi_dung` bigint(20) UNSIGNED DEFAULT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `duong_dan` varchar(250) NOT NULL,
  `anh_dai_dien` varchar(255) DEFAULT NULL,
  `tom_tat` text DEFAULT NULL,
  `noi_dung` longtext NOT NULL,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'an',
  `luot_xem` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bai_viet`
--

INSERT INTO `bai_viet` (`ma_bai_viet`, `ma_nguoi_dung`, `tieu_de`, `duong_dan`, `anh_dai_dien`, `tom_tat`, `noi_dung`, `trang_thai`, `luot_xem`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 2, '5 mẫu xe tay ga đáng mua cho đô thị năm 2026', '/bai-viet/5-mau-xe-tay-ga-dang-mua-cho-do-thi-nam-2026', '/images/posts/xe-tay-ga-2026.jpg', 'Gợi ý những mẫu xe tay ga phù hợp cho người thường xuyên di chuyển trong thành phố.', 'Xe tay ga luôn là lựa chọn thực dụng cho người dùng đô thị nhờ khả năng vận hành dễ dàng, cốp rộng và tư thế ngồi thoải mái. Trong năm 2026, nhóm khách hàng trẻ thường ưu tiên các mẫu có thiết kế hiện đại, tiết kiệm nhiên liệu và hỗ trợ kết nối thông minh.', 'hien_thi', 1240, '2026-09-02 03:11:29', '2026-09-09 03:11:29', NULL),
(2, 2, 'So sánh Honda SH Mode và Piaggio Liberty S 125', '/bai-viet/so-sanh-honda-sh-mode-va-piaggio-liberty-s-125', '/images/posts/so-sanh-sh-mode-liberty.jpg', 'Bài viết so sánh hai mẫu xe tay ga phổ biến để giúp bạn chọn xe phù hợp hơn.', 'Honda SH Mode ghi điểm ở sự gọn gàng, tiết kiệm và dễ sử dụng, trong khi Piaggio Liberty S 125 tạo ấn tượng bởi phong cách châu Âu và cảm giác lái đầm hơn. Nếu bạn đi phố hàng ngày, SH Mode là phương án an toàn; còn nếu thích cá tính và thiết kế khác biệt, Liberty S 125 rất đáng cân nhắc.', 'hien_thi', 980, '2026-09-03 03:11:29', '2026-09-09 03:11:29', NULL),
(3, 2, 'Kinh nghiệm bảo dưỡng xe máy sau mỗi 2.000 km', '/bai-viet/kinh-nghiem-bao-duong-xe-may-sau-moi-2000-km', '/images/posts/bao-duong-xe-may.jpg', 'Một số hạng mục nên kiểm tra định kỳ để xe vận hành ổn định và an toàn.', 'Sau mỗi 2.000 km, người dùng nên kiểm tra dầu máy, áp suất lốp, hệ thống phanh, nhông sên dĩa và các chi tiết hao mòn nhanh. Việc bảo dưỡng định kỳ giúp kéo dài tuổi thọ xe, giảm rủi ro hỏng vặt và giữ cảm giác lái ổn định hơn khi di chuyển xa.', 'an', 420, '2026-09-04 03:11:29', '2026-09-09 03:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_don_hang`
--

CREATE TABLE `chi_tiet_don_hang` (
  `ma_chi_tiet_don_hang` bigint(20) UNSIGNED NOT NULL,
  `ma_don_hang` bigint(20) UNSIGNED NOT NULL,
  `ma_san_pham` bigint(20) UNSIGNED DEFAULT NULL,
  `ten_san_pham` varchar(255) NOT NULL,
  `so_luong` int(10) UNSIGNED NOT NULL,
  `don_gia` decimal(15,2) NOT NULL,
  `thanh_tien` decimal(15,2) NOT NULL,
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chi_tiet_don_hang`
--

INSERT INTO `chi_tiet_don_hang` (`ma_chi_tiet_don_hang`, `ma_don_hang`, `ma_san_pham`, `ten_san_pham`, `so_luong`, `don_gia`, `thanh_tien`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 1, 1, 'Honda SH Mode 125i 2025', 1, 52900000.00, 52900000.00, '2026-09-08 03:11:29', '2026-09-08 03:11:29', NULL),
(2, 1, 7, 'LS2 FF800 Storm II', 2, 3790000.00, 7580000.00, '2026-09-08 03:11:29', '2026-09-08 03:11:29', NULL),
(3, 2, 5, 'Kawasaki Ninja 500 2025', 1, 189900000.00, 189900000.00, '2026-09-09 03:11:29', '2026-09-09 03:11:29', NULL),
(4, 2, 7, 'LS2 FF800 Storm II', 1, 3790000.00, 3790000.00, '2026-09-09 03:11:29', '2026-09-09 03:11:29', NULL),
(5, 2, 8, 'Motul 5100 10W40 1L', 2, 289000.00, 578000.00, '2026-09-09 03:11:29', '2026-09-09 03:11:29', NULL),
(6, 3, 3, 'Honda Wave Alpha 110 2025', 2, 17900000.00, 35800000.00, '2026-09-09 09:11:29', '2026-09-09 21:11:29', NULL),
(7, 3, 9, 'Givi B32N', 1, 2490000.00, 2490000.00, '2026-09-09 09:11:29', '2026-09-09 21:11:29', NULL),
(8, 3, 8, 'Motul 5100 10W40 1L', 4, 289000.00, 1156000.00, '2026-09-09 09:11:29', '2026-09-09 21:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_phieu_nhap`
--

CREATE TABLE `chi_tiet_phieu_nhap` (
  `ma_chi_tiet_phieu_nhap` bigint(20) UNSIGNED NOT NULL,
  `ma_phieu_nhap` bigint(20) UNSIGNED NOT NULL,
  `ma_san_pham` bigint(20) UNSIGNED DEFAULT NULL,
  `so_luong` int(10) UNSIGNED NOT NULL,
  `don_gia` decimal(15,2) NOT NULL,
  `thanh_tien` decimal(15,2) NOT NULL,
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chi_tiet_phieu_nhap`
--

INSERT INTO `chi_tiet_phieu_nhap` (`ma_chi_tiet_phieu_nhap`, `ma_phieu_nhap`, `ma_san_pham`, `so_luong`, `don_gia`, `thanh_tien`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 1, 1, 5, 51000000.00, 255000000.00, '2026-09-06 03:11:29', '2026-09-06 03:11:29', NULL),
(2, 1, 3, 30, 15000000.00, 450000000.00, '2026-09-06 03:11:29', '2026-09-06 03:11:29', NULL),
(3, 2, 2, 8, 47000000.00, 376000000.00, '2026-09-07 03:11:29', '2026-09-07 03:11:29', NULL),
(4, 2, 4, 10, 41000000.00, 410000000.00, '2026-09-07 03:11:29', '2026-09-07 03:11:29', NULL),
(5, 2, 6, 4, 53000000.00, 212000000.00, '2026-09-07 03:11:29', '2026-09-07 03:11:29', NULL),
(6, 2, 7, 40, 2100000.00, 84000000.00, '2026-09-07 03:11:29', '2026-09-07 03:11:29', NULL),
(7, 2, 10, 20, 1000000.00, 20000000.00, '2026-09-07 03:11:29', '2026-09-07 03:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_phieu_xuat`
--

CREATE TABLE `chi_tiet_phieu_xuat` (
  `ma_chi_tiet_phieu_xuat` bigint(20) UNSIGNED NOT NULL,
  `ma_phieu_xuat` bigint(20) UNSIGNED NOT NULL,
  `ma_san_pham` bigint(20) UNSIGNED DEFAULT NULL,
  `so_luong` int(10) UNSIGNED NOT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chi_tiet_phieu_xuat`
--

INSERT INTO `chi_tiet_phieu_xuat` (`ma_chi_tiet_phieu_xuat`, `ma_phieu_xuat`, `ma_san_pham`, `so_luong`, `ghi_chu`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 1, 1, 2, 'Xuất phục vụ đơn đặt cọc.', '2026-09-09 03:11:29', '2026-09-09 03:11:29', NULL),
(2, 1, 3, 4, 'Xuất giao khách mua xe số.', '2026-09-09 03:11:29', '2026-09-09 03:11:29', NULL),
(3, 1, 7, 8, 'Xuất mũ bảo hiểm kèm xe.', '2026-09-09 03:11:29', '2026-09-09 03:11:29', NULL),
(4, 2, 5, 1, 'Xe trưng bày khu mô tô PKL.', '2026-09-09 07:11:29', '2026-09-09 07:11:29', NULL),
(5, 2, 9, 2, 'Thùng xe cho chương trình tour.', '2026-09-09 07:11:29', '2026-09-09 07:11:29', NULL),
(6, 2, 10, 2, 'Kính chắn gió cho xe lái thử.', '2026-09-09 07:11:29', '2026-09-09 07:11:29', NULL),
(7, 2, 8, 10, 'Dùng cho quà tặng và khuyến mãi dịch vụ.', '2026-09-09 07:11:29', '2026-09-09 07:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_muc`
--

CREATE TABLE `danh_muc` (
  `ma_danh_muc` bigint(20) UNSIGNED NOT NULL,
  `ten_danh_muc` varchar(255) NOT NULL,
  `duong_dan` varchar(250) NOT NULL,
  `ma_danh_muc_cha` bigint(20) UNSIGNED DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `anh_dai_dien` varchar(255) DEFAULT 'anh-danh-muc-mac-dinh.jpg',
  `trang_thai` varchar(255) NOT NULL DEFAULT 'hoat_dong',
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `danh_muc`
--

INSERT INTO `danh_muc` (`ma_danh_muc`, `ten_danh_muc`, `duong_dan`, `ma_danh_muc_cha`, `mo_ta`, `anh_dai_dien`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 'Xe tay ga', '/danh-muc/xe-tay-ga', NULL, 'Các mẫu xe tay ga phù hợp đi làm, đi học và di chuyển trong phố.', '/images/categories/xe-tay-ga.jpg', 'hoat_dong', '2026-08-27 03:11:29', '2026-09-08 03:11:29', NULL),
(2, 'Xe số', '/danh-muc/xe-so', NULL, 'Dòng xe tiết kiệm nhiên liệu, bền bỉ và dễ sử dụng.', '/images/categories/xe-so.jpg', 'hoat_dong', '2026-08-28 03:11:29', '2026-09-08 03:11:29', NULL),
(3, 'Xe côn tay', '/danh-muc/xe-con-tay', NULL, 'Mẫu xe dành cho người thích cảm giác lái mạnh và thể thao.', '/images/categories/xe-con-tay.jpg', 'hoat_dong', '2026-08-29 03:11:29', '2026-09-08 03:11:29', NULL),
(4, 'Mô tô phân khối lớn', '/danh-muc/mo-to-phan-khoi-lon', NULL, 'Xe mô tô cho nhu cầu trải nghiệm, tốc độ và đi tour dài.', '/images/categories/mo-to-phan-khoi-lon.jpg', 'hoat_dong', '2026-08-30 03:11:29', '2026-09-09 03:11:29', NULL),
(5, 'Mũ bảo hiểm', '/danh-muc/mu-bao-hiem', NULL, 'Mũ bảo hiểm fullface, 3/4 và nửa đầu cho biker.', '/images/categories/mu-bao-hiem.jpg', 'hoat_dong', '2026-08-31 03:11:29', '2026-09-09 03:11:29', NULL),
(6, 'Dầu nhớt', '/danh-muc/dau-nhot', NULL, 'Dầu nhớt và dung dịch chăm sóc xe máy.', '/images/categories/dau-nhot.jpg', 'hoat_dong', '2026-09-01 03:11:29', '2026-09-09 03:11:29', NULL),
(7, 'Phụ kiện touring', '/danh-muc/phu-kien-touring', NULL, 'Phụ kiện phục vụ đi tour, chở đồ và nâng trải nghiệm lái xe.', '/images/categories/phu-kien-touring.jpg', 'hoat_dong', '2026-09-02 03:11:29', '2026-09-09 03:11:29', NULL),
(8, 'Phụ tùng', '/danh-muc/phu-tung', NULL, 'Phụ tùng thay thế và linh kiện cho xe máy.', '/images/categories/phu-tung.jpg', 'hoat_dong', '2026-09-03 03:11:29', '2026-09-09 03:11:29', NULL),
(9, 'Thùng xe', '/danh-muc/thung-xe', 7, 'Thùng giữa, thùng sau và giải pháp chở đồ cho xe touring.', '/images/categories/thung-xe.jpg', 'hoat_dong', '2026-09-04 03:11:29', '2026-09-09 03:11:29', NULL),
(10, 'Kính chắn gió', '/danh-muc/kinh-chan-gio', 7, 'Kính chắn gió hỗ trợ đi xa, giảm gió và tăng sự thoải mái.', '/images/categories/kinh-chan-gio.jpg', 'hoat_dong', '2026-09-05 03:11:29', '2026-09-09 03:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `don_hang`
--

CREATE TABLE `don_hang` (
  `ma_don_hang` bigint(20) UNSIGNED NOT NULL,
  `ma_nguoi_dung` bigint(20) UNSIGNED DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `dia_chi_email` varchar(255) DEFAULT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `dia_chi_giao_hang` text NOT NULL,
  `phuong_thuc_thanh_toan` varchar(255) NOT NULL DEFAULT 'tien_mat',
  `ma_giao_dich` varchar(255) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `tam_tinh` decimal(15,2) NOT NULL DEFAULT 0.00,
  `giam_gia` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tong_tien` decimal(15,2) NOT NULL DEFAULT 0.00,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'cho_xac_nhan',
  `trang_thai_thanh_toan` varchar(255) NOT NULL DEFAULT 'chua_thanh_toan',
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `don_hang`
--

INSERT INTO `don_hang` (`ma_don_hang`, `ma_nguoi_dung`, `ho_ten`, `dia_chi_email`, `so_dien_thoai`, `dia_chi_giao_hang`, `phuong_thuc_thanh_toan`, `ma_giao_dich`, `ghi_chu`, `tam_tinh`, `giam_gia`, `tong_tien`, `trang_thai`, `trang_thai_thanh_toan`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 3, 'Nguyễn Văn Sơn', 'son@motohub.vn', '0909000003', '88 Trần Hưng Đạo, Phường 6, Quận 5, TP.HCM', 'tra_gop', NULL, 'Cần hỗ trợ hồ sơ trả góp khi nhận xe.', 60480000.00, 480000.00, 60000000.00, 'cho_xac_nhan', 'chua_thanh_toan', '2026-09-08 03:11:29', '2026-09-08 03:11:29', NULL),
(2, NULL, 'Trần Thị Mai', 'mai.tran@example.com', '0911222333', '45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', 'chuyen_khoan', 'VNPAY2609080001', 'Giao xe vào buổi chiều, gọi trước khi đến.', 194268000.00, 268000.00, 194000000.00, 'dang_xu_ly', 'da_thanh_toan', '2026-09-09 03:11:29', '2026-09-09 03:11:29', NULL),
(3, 3, 'Nguyễn Văn Sơn', 'son@motohub.vn', '0909000003', '88 Trần Hưng Đạo, Phường 6, Quận 5, TP.HCM', 'tien_mat', NULL, 'Gắn sẵn thùng Givi khi giao xe.', 39446000.00, 446000.00, 39000000.00, 'da_giao', 'da_thanh_toan', '2026-09-09 09:11:29', '2026-09-09 21:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hinh_anh_san_pham`
--

CREATE TABLE `hinh_anh_san_pham` (
  `ma_hinh_anh` bigint(20) UNSIGNED NOT NULL,
  `ma_san_pham` bigint(20) UNSIGNED NOT NULL,
  `duong_dan` varchar(255) NOT NULL,
  `la_anh_dai_dien` tinyint(1) NOT NULL DEFAULT 0,
  `thu_tu_hien_thi` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hinh_anh_san_pham`
--

INSERT INTO `hinh_anh_san_pham` (`ma_hinh_anh`, `ma_san_pham`, `duong_dan`, `la_anh_dai_dien`, `thu_tu_hien_thi`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 1, '/images/products/honda-sh-mode-125i-2025-1.jpg', 1, 1, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(2, 1, '/images/products/honda-sh-mode-125i-2025-2.jpg', 0, 2, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(3, 2, '/images/products/yamaha-exciter-155-vva-2025-1.jpg', 1, 1, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(4, 2, '/images/products/yamaha-exciter-155-vva-2025-2.jpg', 0, 2, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(5, 3, '/images/products/honda-wave-alpha-110-2025-1.jpg', 1, 1, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(6, 3, '/images/products/honda-wave-alpha-110-2025-2.jpg', 0, 2, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(7, 4, '/images/products/suzuki-raider-r150-2025-1.jpg', 1, 1, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(8, 4, '/images/products/suzuki-raider-r150-2025-2.jpg', 0, 2, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(9, 5, '/images/products/kawasaki-ninja-500-2025-1.jpg', 1, 1, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(10, 5, '/images/products/kawasaki-ninja-500-2025-2.jpg', 0, 2, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(11, 6, '/images/products/piaggio-liberty-s-125-2025-1.jpg', 1, 1, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(12, 6, '/images/products/piaggio-liberty-s-125-2025-2.jpg', 0, 2, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(13, 7, '/images/products/ls2-ff800-storm-ii-1.jpg', 1, 1, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(14, 7, '/images/products/ls2-ff800-storm-ii-2.jpg', 0, 2, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(15, 8, '/images/products/motul-5100-10w40-1l-1.jpg', 1, 1, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(16, 8, '/images/products/motul-5100-10w40-1l-2.jpg', 0, 2, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(17, 9, '/images/products/givi-b32n-1.jpg', 1, 1, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(18, 9, '/images/products/givi-b32n-2.jpg', 0, 2, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(19, 10, '/images/products/givi-airflow-1.jpg', 1, 1, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL),
(20, 10, '/images/products/givi-airflow-2.jpg', 0, 2, '2026-09-06 03:11:29', '2026-09-08 03:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lien_he`
--

CREATE TABLE `lien_he` (
  `ma_lien_he` bigint(20) UNSIGNED NOT NULL,
  `ma_nguoi_dung` bigint(20) UNSIGNED DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `dia_chi_email` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `noi_dung` text NOT NULL,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'chua_xu_ly',
  `phan_hoi` text DEFAULT NULL,
  `thoi_gian_phan_hoi` timestamp NULL DEFAULT NULL,
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `lien_he`
--

INSERT INTO `lien_he` (`ma_lien_he`, `ma_nguoi_dung`, `ho_ten`, `dia_chi_email`, `so_dien_thoai`, `tieu_de`, `noi_dung`, `trang_thai`, `phan_hoi`, `thoi_gian_phan_hoi`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 3, 'Nguyễn Văn Sơn', 'son@motohub.vn', '0909000003', 'Tư vấn mua SH Mode trả góp', 'Tôi muốn hỏi về khoản trả trước, lãi suất và hồ sơ cần chuẩn bị để mua Honda SH Mode 125i.', 'chua_xu_ly', NULL, NULL, '2026-09-08 03:11:29', '2026-09-08 03:11:29', NULL),
(2, NULL, 'Trần Thị Mai', 'mai.tran@example.com', '0911222333', 'Xin báo giá thùng Givi B32N', 'Cửa hàng có hỗ trợ lắp thùng Givi B32N cho xe tay ga và xe touring không? Tôi muốn biết giá trọn gói.', 'da_xu_ly', 'MotoHub đã gửi báo giá thùng, phụ kiện lắp đặt và thời gian giao hàng dự kiến cho khách.', '2026-09-09 03:11:29', '2026-09-07 03:11:29', '2026-09-09 03:11:29', NULL),
(3, 3, 'Nguyễn Văn Sơn', 'son@motohub.vn', '0909000003', 'Hỏi lịch bảo dưỡng xe côn tay', 'Tôi đang chạy Yamaha Exciter 155 VVA, cho hỏi lịch bảo dưỡng định kỳ và thay dầu thế nào cho hợp lý?', 'dang_xu_ly', NULL, NULL, '2026-09-09 03:11:29', '2026-09-09 03:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2026_09_08_001535_create_nguoi_dung_table', 1),
(2, '2026_09_08_115856_create_thuong_hieu_table', 1),
(3, '2026_09_08_121110_create_danh_muc_table', 1),
(4, '2026_09_08_124100_create_san_pham_table', 1),
(5, '2026_09_08_124834_create_hinh_anh_san_pham_table', 1),
(6, '2026_09_08_125450_create_don_hang_table', 1),
(7, '2026_09_08_130757_create_chi_tiet_don_hang_table', 1),
(8, '2026_09_08_132303_create_bai_viet_table', 1),
(9, '2026_09_08_134224_create_anh_quang_cao_table', 1),
(10, '2026_09_08_134454_create_thanh_dieu_huong_table', 1),
(11, '2026_09_08_140330_create_trang_don_table', 1),
(12, '2026_09_08_141258_create_lien_he_table', 1),
(13, '2026_09_08_141533_create_phieu_nhap_table', 1),
(14, '2026_09_08_141628_create_chi_tiet_phieu_nhap_table', 1),
(15, '2026_09_08_144336_create_phieu_xuat_table', 1),
(16, '2026_09_08_144556_create_chi_tiet_phieu_xuat_table', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `ma_nguoi_dung` bigint(20) UNSIGNED NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `ten_dang_nhap` varchar(255) NOT NULL,
  `dia_chi_email` varchar(255) NOT NULL,
  `anh_dai_dien` varchar(255) DEFAULT 'anh-dai-dien-mac-dinh.jpg',
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `dia_chi` text DEFAULT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `ma_nho_dang_nhap` varchar(255) DEFAULT NULL,
  `ma_dat_lai_mat_khau` varchar(255) DEFAULT NULL,
  `thoi_gian_dat_lai_mat_khau` timestamp NULL DEFAULT NULL,
  `thoi_gian_xac_thuc` timestamp NULL DEFAULT NULL,
  `vai_tro` varchar(255) NOT NULL DEFAULT 'thanh_vien',
  `trang_thai` varchar(255) NOT NULL DEFAULT 'hoat_dong',
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`ma_nguoi_dung`, `ho_ten`, `ten_dang_nhap`, `dia_chi_email`, `anh_dai_dien`, `so_dien_thoai`, `dia_chi`, `mat_khau`, `ma_nho_dang_nhap`, `ma_dat_lai_mat_khau`, `thoi_gian_dat_lai_mat_khau`, `thoi_gian_xac_thuc`, `vai_tro`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 'Lê Minh An', 'admin', 'admin@motohub.vn', '/images/users/admin.jpg', '0909000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', '$2y$12$D3SCzr2cFsGU4LTtpd0CD.e.spes261WsZ/rK57O9FEPFLIkoIkAm', NULL, NULL, NULL, '2026-08-11 03:11:28', 'quan_tri_vien', 'hoat_dong', '2026-08-11 03:11:28', '2026-09-08 03:11:28', NULL),
(2, 'Trần Thu Hà', 'staff.ha', 'ha@motohub.vn', '/images/users/staff-ha.jpg', '0909000002', '45 Lý Tự Trọng, Quận 1, TP.HCM', '$2y$12$UByj8PoF5HdSHbAyrhe.rub12sEZuM6eUa/eMWVnS4cg8q.KPj.Bm', NULL, NULL, NULL, '2026-08-21 03:11:28', 'nhan_vien', 'hoat_dong', '2026-08-21 03:11:28', '2026-09-09 03:11:28', NULL),
(3, 'Nguyễn Văn Sơn', 'son.nguyen', 'son@motohub.vn', '/images/users/customer-son.jpg', '0909000003', '88 Trần Hưng Đạo, Quận 5, TP.HCM', '$2y$12$Z.gsc/kJSud/55ZtcgCM4.SAV8xH.VtfuVL08oIIZ/dhdV0TkQSdO', NULL, NULL, NULL, '2026-08-31 03:11:28', 'thanh_vien', 'hoat_dong', '2026-08-31 03:11:28', '2026-09-09 03:11:28', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieu_nhap`
--

CREATE TABLE `phieu_nhap` (
  `ma_phieu_nhap` bigint(20) UNSIGNED NOT NULL,
  `ma_nguoi_dung` bigint(20) UNSIGNED DEFAULT NULL,
  `so_phieu_nhap` varchar(255) NOT NULL,
  `nha_cung_cap` varchar(255) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `tong_tien` decimal(15,2) NOT NULL DEFAULT 0.00,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'hoan_tat',
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieu_nhap`
--

INSERT INTO `phieu_nhap` (`ma_phieu_nhap`, `ma_nguoi_dung`, `so_phieu_nhap`, `nha_cung_cap`, `ghi_chu`, `tong_tien`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 1, 'PN-MOTO-2026-0908-001', 'Công ty Honda Việt Nam', 'Nhập xe tay ga và xe số cho đợt bán đầu tháng 9.', 705000000.00, 'hoan_tat', '2026-09-06 03:11:29', '2026-09-06 03:11:29', NULL),
(2, 2, 'PN-MOTO-2026-0908-002', 'Tổng kho xe máy Sài Gòn', 'Bổ sung xe côn tay, xe tay ga và phụ kiện touring.', 1102000000.00, 'hoan_tat', '2026-09-07 03:11:29', '2026-09-07 03:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieu_xuat`
--

CREATE TABLE `phieu_xuat` (
  `ma_phieu_xuat` bigint(20) UNSIGNED NOT NULL,
  `ma_nguoi_dung` bigint(20) UNSIGNED DEFAULT NULL,
  `so_phieu_xuat` varchar(255) NOT NULL,
  `ly_do_xuat` varchar(255) NOT NULL DEFAULT 'khac',
  `ghi_chu` text DEFAULT NULL,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'hoan_tat',
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieu_xuat`
--

INSERT INTO `phieu_xuat` (`ma_phieu_xuat`, `ma_nguoi_dung`, `so_phieu_xuat`, `ly_do_xuat`, `ghi_chu`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 2, 'PX-MOTO-2026-0908-001', 'ban_hang', 'Xuất xe giao khách trong ngày.', 'hoan_tat', '2026-09-09 03:11:29', '2026-09-09 03:11:29', NULL),
(2, 1, 'PX-MOTO-2026-0908-002', 'trung_bay', 'Trưng bày showroom và xe lái thử cuối tuần.', 'hoan_tat', '2026-09-09 07:11:29', '2026-09-09 07:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `san_pham`
--

CREATE TABLE `san_pham` (
  `ma_san_pham` bigint(20) UNSIGNED NOT NULL,
  `ten_san_pham` varchar(255) NOT NULL,
  `ma_danh_muc` bigint(20) UNSIGNED NOT NULL,
  `ma_thuong_hieu` bigint(20) UNSIGNED NOT NULL,
  `duong_dan` varchar(250) NOT NULL,
  `gia_ban` decimal(15,2) NOT NULL,
  `gia_khuyen_mai` decimal(15,2) DEFAULT NULL,
  `so_luong_ton` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `dung_tich_dong_co` int(10) UNSIGNED DEFAULT NULL,
  `nam_san_xuat` smallint(5) UNSIGNED DEFAULT NULL,
  `mau_sac` varchar(255) DEFAULT NULL,
  `anh_dai_dien` varchar(255) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'hoat_dong',
  `luot_xem` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `san_pham`
--

INSERT INTO `san_pham` (`ma_san_pham`, `ten_san_pham`, `ma_danh_muc`, `ma_thuong_hieu`, `duong_dan`, `gia_ban`, `gia_khuyen_mai`, `so_luong_ton`, `dung_tich_dong_co`, `nam_san_xuat`, `mau_sac`, `anh_dai_dien`, `mo_ta`, `trang_thai`, `luot_xem`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 'Honda SH Mode 125i 2025', 1, 1, '/honda-sh-mode-125i-2025', 54900000.00, 52900000.00, 6, 125, 2025, 'Đỏ đô', '/images/products/honda-sh-mode-125i-2025-1.jpg', 'Mẫu xe tay ga cao cấp phù hợp di chuyển trong phố, thiết kế sang và vận hành êm ái.', 'hoat_dong', 214, '2026-08-27 03:11:29', '2026-09-08 03:11:29', NULL),
(2, 'Yamaha Exciter 155 VVA 2025', 3, 2, '/yamaha-exciter-155-vva-2025', 54900000.00, 52900000.00, 8, 155, 2025, 'Xanh GP', '/images/products/yamaha-exciter-155-vva-2025-1.jpg', 'Xe côn tay thể thao, tăng tốc tốt và phù hợp người thích cảm giác lái mạnh.', 'hoat_dong', 186, '2026-08-28 03:11:29', '2026-09-08 03:11:29', NULL),
(3, 'Honda Wave Alpha 110 2025', 2, 1, '/honda-wave-alpha-110-2025', 18500000.00, 17900000.00, 20, 110, 2025, 'Đỏ', '/images/products/honda-wave-alpha-110-2025-1.jpg', 'Xe số tiết kiệm nhiên liệu, bền bỉ và dễ sử dụng cho nhu cầu đi lại hằng ngày.', 'hoat_dong', 149, '2026-08-29 03:11:29', '2026-09-09 03:11:29', NULL),
(4, 'Suzuki Raider R150 2025', 3, 3, '/suzuki-raider-r150-2025', 49900000.00, 47900000.00, 10, 150, 2025, 'Đen đỏ', '/images/products/suzuki-raider-r150-2025-1.jpg', 'Mẫu xe underbone thiên về tốc độ, nhẹ và linh hoạt trong đô thị.', 'hoat_dong', 122, '2026-08-30 03:11:29', '2026-09-09 03:11:29', NULL),
(5, 'Kawasaki Ninja 500 2025', 4, 4, '/kawasaki-ninja-500-2025', 194900000.00, 189900000.00, 2, 451, 2025, 'Xanh lá', '/images/products/kawasaki-ninja-500-2025-1.jpg', 'Mẫu mô tô phân khối lớn cho người chơi xe, thiết kế mạnh mẽ và phù hợp đi tour.', 'hoat_dong', 231, '2026-08-31 03:11:29', '2026-09-09 03:11:29', NULL),
(6, 'Piaggio Liberty S 125 2025', 1, 5, '/piaggio-liberty-s-125-2025', 59900000.00, 57900000.00, 5, 125, 2025, 'Trắng', '/images/products/piaggio-liberty-s-125-2025-1.jpg', 'Xe tay ga phong cách châu Âu, gọn và phù hợp di chuyển trong thành phố.', 'hoat_dong', 167, '2026-09-01 03:11:29', '2026-09-09 03:11:29', NULL),
(7, 'LS2 FF800 Storm II', 5, 6, '/ls2-ff800-storm-ii', 4200000.00, 3790000.00, 35, NULL, 2025, 'Đen mờ', '/images/products/ls2-ff800-storm-ii-1.jpg', 'Mũ bảo hiểm fullface cho nhu cầu đi phố lẫn đi tour dài ngày.', 'hoat_dong', 98, '2026-09-02 03:11:29', '2026-09-09 03:11:29', NULL),
(8, 'Motul 5100 10W40 1L', 6, 7, '/motul-5100-10w40-1l', 320000.00, 289000.00, 120, NULL, 2025, NULL, '/images/products/motul-5100-10w40-1l-1.jpg', 'Dầu nhớt bán tổng hợp cho xe số, xe côn tay và xe tay ga.', 'hoat_dong', 76, '2026-09-03 03:11:29', '2026-09-09 03:11:29', NULL),
(9, 'Givi B32N', 9, 8, '/givi-b32n', 2850000.00, 2490000.00, 18, NULL, 2024, 'Đen', '/images/products/givi-b32n-1.jpg', 'Thùng xe dung tích gọn, phù hợp đi làm hằng ngày và chở đồ an toàn.', 'hoat_dong', 142, '2026-09-04 03:11:29', '2026-09-09 03:11:29', NULL),
(10, 'Givi Airflow', 10, 8, '/givi-airflow', 1450000.00, 1290000.00, 14, NULL, 2024, 'Trong suốt', '/images/products/givi-airflow-1.jpg', 'Kính chắn gió giúp giảm gió tạt, tăng sự thoải mái khi đi xa.', 'hoat_dong', 88, '2026-09-05 03:11:29', '2026-09-09 03:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thanh_dieu_huong`
--

CREATE TABLE `thanh_dieu_huong` (
  `ma_thanh_dieu_huong` bigint(20) UNSIGNED NOT NULL,
  `ten_hien_thi` varchar(255) NOT NULL,
  `duong_dan` varchar(250) NOT NULL,
  `ma_thanh_dieu_huong_cha` bigint(20) UNSIGNED DEFAULT NULL,
  `thu_tu_hien_thi` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'hoat_dong',
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thanh_dieu_huong`
--

INSERT INTO `thanh_dieu_huong` (`ma_thanh_dieu_huong`, `ten_hien_thi`, `duong_dan`, `ma_thanh_dieu_huong_cha`, `thu_tu_hien_thi`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 'Trang chủ', '/', NULL, 1, 'hoat_dong', '2026-08-27 03:11:29', '2026-09-08 03:11:29', NULL),
(2, 'Xe máy', '/san-pham', NULL, 2, 'hoat_dong', '2026-08-28 03:11:29', '2026-09-08 03:11:29', NULL),
(3, 'Xe tay ga', '/san-pham/xe-tay-ga', 2, 3, 'hoat_dong', '2026-08-29 03:11:29', '2026-09-09 03:11:29', NULL),
(4, 'Xe số', '/san-pham/xe-so', 2, 4, 'hoat_dong', '2026-08-30 03:11:29', '2026-09-09 03:11:29', NULL),
(5, 'Xe côn tay', '/san-pham/xe-con-tay', 2, 5, 'hoat_dong', '2026-08-31 03:11:29', '2026-09-09 03:11:29', NULL),
(6, 'Mô tô PKL', '/san-pham/mo-to-phan-khoi-lon', 2, 6, 'hoat_dong', '2026-09-01 03:11:29', '2026-09-09 03:11:29', NULL),
(7, 'Phụ kiện', '/san-pham/phu-kien-touring', 2, 7, 'hoat_dong', '2026-09-02 03:11:29', '2026-09-09 03:11:29', NULL),
(8, 'Tin tức', '/bai-viet', NULL, 8, 'hoat_dong', '2026-09-02 03:11:29', '2026-09-09 03:11:29', NULL),
(9, 'Khuyến mãi', '/khuyen-mai', NULL, 9, 'hoat_dong', '2026-09-03 03:11:29', '2026-09-09 03:11:29', NULL),
(10, 'Liên hệ', '/lien-he', NULL, 10, 'hoat_dong', '2026-09-04 03:11:29', '2026-09-09 03:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thuong_hieu`
--

CREATE TABLE `thuong_hieu` (
  `ma_thuong_hieu` bigint(20) UNSIGNED NOT NULL,
  `ten_thuong_hieu` varchar(255) NOT NULL,
  `duong_dan` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'hoat_dong',
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thuong_hieu`
--

INSERT INTO `thuong_hieu` (`ma_thuong_hieu`, `ten_thuong_hieu`, `duong_dan`, `logo`, `mo_ta`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 'Honda', '/thuong-hieu/honda', '/images/brands/honda.png', 'Thương hiệu xe máy phổ biến tại Việt Nam, nổi bật với độ bền và tính thực dụng.', 'hoat_dong', '2026-08-27 03:11:29', '2026-09-08 03:11:29', NULL),
(2, 'Yamaha', '/thuong-hieu/yamaha', '/images/brands/yamaha.png', 'Các dòng xe máy thể thao, trẻ trung và dễ vận hành.', 'hoat_dong', '2026-08-28 03:11:29', '2026-09-08 03:11:29', NULL),
(3, 'Suzuki', '/thuong-hieu/suzuki', '/images/brands/suzuki.png', 'Xe máy bền bỉ, phù hợp nhu cầu đi lại và thể thao đường phố.', 'hoat_dong', '2026-08-29 03:11:29', '2026-09-08 03:11:29', NULL),
(4, 'Kawasaki', '/thuong-hieu/kawasaki', '/images/brands/kawasaki.png', 'Mô tô phân khối lớn với hiệu năng mạnh và thiết kế đặc trưng.', 'hoat_dong', '2026-08-30 03:11:29', '2026-09-09 03:11:29', NULL),
(5, 'Piaggio', '/thuong-hieu/piaggio', '/images/brands/piaggio.png', 'Xe tay ga phong cách châu Âu, phù hợp di chuyển đô thị.', 'hoat_dong', '2026-08-31 03:11:29', '2026-09-09 03:11:29', NULL),
(6, 'LS2', '/thuong-hieu/ls2', '/images/brands/ls2.png', 'Thương hiệu mũ bảo hiểm được ưa chuộng cho đi phố và đi tour.', 'hoat_dong', '2026-09-01 03:11:29', '2026-09-09 03:11:29', NULL),
(7, 'Motul', '/thuong-hieu/motul', '/images/brands/motul.png', 'Dầu nhớt và dung dịch bảo dưỡng cho xe máy chất lượng cao.', 'hoat_dong', '2026-09-02 03:11:29', '2026-09-09 03:11:29', NULL),
(8, 'Givi', '/thuong-hieu/givi', '/images/brands/givi.png', 'Phụ kiện touring, thùng xe và trang bị tiện ích cho biker.', 'hoat_dong', '2026-09-03 03:11:29', '2026-09-09 03:11:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `trang_don`
--

CREATE TABLE `trang_don` (
  `ma_trang_don` bigint(20) UNSIGNED NOT NULL,
  `ma_nguoi_dung` bigint(20) UNSIGNED DEFAULT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `duong_dan` varchar(250) NOT NULL,
  `noi_dung` longtext NOT NULL,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'hien_thi',
  `ngay_tao` timestamp NULL DEFAULT NULL,
  `ngay_cap_nhat` timestamp NULL DEFAULT NULL,
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `trang_don`
--

INSERT INTO `trang_don` (`ma_trang_don`, `ma_nguoi_dung`, `tieu_de`, `duong_dan`, `noi_dung`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 1, 'Giới thiệu MotoHub', '/gioi-thieu', 'MotoHub là showroom chuyên xe máy và phụ kiện, tập trung vào xe tay ga, xe số, xe côn tay, mô tô phân khối lớn và các giải pháp đi tour. Chúng tôi ưu tiên trải nghiệm mua sắm rõ ràng, hỗ trợ trả góp linh hoạt và dịch vụ hậu mãi đáng tin cậy.', 'hien_thi', '2026-08-27 03:11:29', '2026-09-08 03:11:29', NULL),
(2, 1, 'Chính sách bảo hành xe máy', '/chinh-sach-bao-hanh', 'Tất cả xe và phụ kiện tại MotoHub đều được tiếp nhận theo chính sách bảo hành của hãng hoặc nhà phân phối. Khách hàng có thể liên hệ hotline, gửi hình ảnh hoặc mang xe đến cửa hàng để được kiểm tra và hỗ trợ nhanh chóng.', 'hien_thi', '2026-08-28 03:11:29', '2026-09-08 03:11:29', NULL),
(3, 2, 'Chính sách đổi trả và thu xe cũ', '/chinh-sach-doi-tra', 'MotoHub hỗ trợ đổi trả trong trường hợp sản phẩm lỗi do nhà sản xuất hoặc không đúng mô tả. Với khách hàng muốn lên đời xe mới, chúng tôi cũng hỗ trợ thu xe cũ và tư vấn phương án bù chênh lệch phù hợp.', 'hien_thi', '2026-08-29 03:11:29', '2026-09-09 03:11:29', NULL),
(4, 1, 'Hướng dẫn trả góp xe máy', '/huong-dan-tra-gop', 'Để mua xe trả góp, khách hàng cần chuẩn bị giấy tờ tùy thân, hồ sơ chứng minh tài chính theo yêu cầu của đối tác cho vay và lựa chọn kỳ hạn phù hợp. MotoHub luôn hỗ trợ tư vấn lãi suất, số tiền trả trước và phương án thanh toán minh bạch.', 'hien_thi', '2026-08-30 03:11:29', '2026-09-09 03:11:29', NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `anh_quang_cao`
--
ALTER TABLE `anh_quang_cao`
  ADD PRIMARY KEY (`ma_anh_quang_cao`),
  ADD KEY `anh_quang_cao_trang_thai_index` (`trang_thai`);

--
-- Chỉ mục cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD PRIMARY KEY (`ma_bai_viet`),
  ADD UNIQUE KEY `bai_viet_duong_dan_unique` (`duong_dan`),
  ADD KEY `bai_viet_ma_nguoi_dung_foreign` (`ma_nguoi_dung`),
  ADD KEY `bai_viet_trang_thai_index` (`trang_thai`);

--
-- Chỉ mục cho bảng `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD PRIMARY KEY (`ma_chi_tiet_don_hang`),
  ADD KEY `chi_tiet_don_hang_ma_don_hang_foreign` (`ma_don_hang`),
  ADD KEY `chi_tiet_don_hang_ma_san_pham_foreign` (`ma_san_pham`);

--
-- Chỉ mục cho bảng `chi_tiet_phieu_nhap`
--
ALTER TABLE `chi_tiet_phieu_nhap`
  ADD PRIMARY KEY (`ma_chi_tiet_phieu_nhap`),
  ADD KEY `chi_tiet_phieu_nhap_ma_phieu_nhap_foreign` (`ma_phieu_nhap`),
  ADD KEY `chi_tiet_phieu_nhap_ma_san_pham_foreign` (`ma_san_pham`);

--
-- Chỉ mục cho bảng `chi_tiet_phieu_xuat`
--
ALTER TABLE `chi_tiet_phieu_xuat`
  ADD PRIMARY KEY (`ma_chi_tiet_phieu_xuat`),
  ADD KEY `chi_tiet_phieu_xuat_ma_phieu_xuat_foreign` (`ma_phieu_xuat`),
  ADD KEY `chi_tiet_phieu_xuat_ma_san_pham_foreign` (`ma_san_pham`);

--
-- Chỉ mục cho bảng `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD PRIMARY KEY (`ma_danh_muc`),
  ADD UNIQUE KEY `danh_muc_ten_danh_muc_unique` (`ten_danh_muc`),
  ADD UNIQUE KEY `danh_muc_duong_dan_unique` (`duong_dan`),
  ADD KEY `danh_muc_ma_danh_muc_cha_foreign` (`ma_danh_muc_cha`),
  ADD KEY `danh_muc_trang_thai_index` (`trang_thai`);

--
-- Chỉ mục cho bảng `don_hang`
--
ALTER TABLE `don_hang`
  ADD PRIMARY KEY (`ma_don_hang`),
  ADD KEY `don_hang_ma_nguoi_dung_foreign` (`ma_nguoi_dung`),
  ADD KEY `don_hang_trang_thai_index` (`trang_thai`),
  ADD KEY `don_hang_trang_thai_thanh_toan_index` (`trang_thai_thanh_toan`);

--
-- Chỉ mục cho bảng `hinh_anh_san_pham`
--
ALTER TABLE `hinh_anh_san_pham`
  ADD PRIMARY KEY (`ma_hinh_anh`),
  ADD KEY `hinh_anh_san_pham_ma_san_pham_foreign` (`ma_san_pham`);

--
-- Chỉ mục cho bảng `lien_he`
--
ALTER TABLE `lien_he`
  ADD PRIMARY KEY (`ma_lien_he`),
  ADD KEY `lien_he_ma_nguoi_dung_foreign` (`ma_nguoi_dung`),
  ADD KEY `lien_he_trang_thai_index` (`trang_thai`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`ma_nguoi_dung`),
  ADD UNIQUE KEY `nguoi_dung_ten_dang_nhap_unique` (`ten_dang_nhap`),
  ADD UNIQUE KEY `nguoi_dung_dia_chi_email_unique` (`dia_chi_email`),
  ADD KEY `nguoi_dung_vai_tro_index` (`vai_tro`),
  ADD KEY `nguoi_dung_trang_thai_index` (`trang_thai`);

--
-- Chỉ mục cho bảng `phieu_nhap`
--
ALTER TABLE `phieu_nhap`
  ADD PRIMARY KEY (`ma_phieu_nhap`),
  ADD UNIQUE KEY `phieu_nhap_so_phieu_nhap_unique` (`so_phieu_nhap`),
  ADD KEY `phieu_nhap_ma_nguoi_dung_foreign` (`ma_nguoi_dung`),
  ADD KEY `phieu_nhap_trang_thai_index` (`trang_thai`);

--
-- Chỉ mục cho bảng `phieu_xuat`
--
ALTER TABLE `phieu_xuat`
  ADD PRIMARY KEY (`ma_phieu_xuat`),
  ADD UNIQUE KEY `phieu_xuat_so_phieu_xuat_unique` (`so_phieu_xuat`),
  ADD KEY `phieu_xuat_ma_nguoi_dung_foreign` (`ma_nguoi_dung`),
  ADD KEY `phieu_xuat_trang_thai_index` (`trang_thai`);

--
-- Chỉ mục cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  ADD PRIMARY KEY (`ma_san_pham`),
  ADD UNIQUE KEY `san_pham_duong_dan_unique` (`duong_dan`),
  ADD KEY `san_pham_ma_danh_muc_foreign` (`ma_danh_muc`),
  ADD KEY `san_pham_ma_thuong_hieu_foreign` (`ma_thuong_hieu`),
  ADD KEY `san_pham_trang_thai_index` (`trang_thai`);

--
-- Chỉ mục cho bảng `thanh_dieu_huong`
--
ALTER TABLE `thanh_dieu_huong`
  ADD PRIMARY KEY (`ma_thanh_dieu_huong`),
  ADD UNIQUE KEY `thanh_dieu_huong_duong_dan_unique` (`duong_dan`),
  ADD KEY `thanh_dieu_huong_ma_thanh_dieu_huong_cha_foreign` (`ma_thanh_dieu_huong_cha`),
  ADD KEY `thanh_dieu_huong_thu_tu_hien_thi_index` (`thu_tu_hien_thi`),
  ADD KEY `thanh_dieu_huong_trang_thai_index` (`trang_thai`);

--
-- Chỉ mục cho bảng `thuong_hieu`
--
ALTER TABLE `thuong_hieu`
  ADD PRIMARY KEY (`ma_thuong_hieu`),
  ADD UNIQUE KEY `thuong_hieu_ten_thuong_hieu_unique` (`ten_thuong_hieu`),
  ADD UNIQUE KEY `thuong_hieu_duong_dan_unique` (`duong_dan`),
  ADD KEY `thuong_hieu_trang_thai_index` (`trang_thai`);

--
-- Chỉ mục cho bảng `trang_don`
--
ALTER TABLE `trang_don`
  ADD PRIMARY KEY (`ma_trang_don`),
  ADD UNIQUE KEY `trang_don_duong_dan_unique` (`duong_dan`),
  ADD KEY `trang_don_ma_nguoi_dung_foreign` (`ma_nguoi_dung`),
  ADD KEY `trang_don_trang_thai_index` (`trang_thai`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `anh_quang_cao`
--
ALTER TABLE `anh_quang_cao`
  MODIFY `ma_anh_quang_cao` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  MODIFY `ma_bai_viet` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  MODIFY `ma_chi_tiet_don_hang` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `chi_tiet_phieu_nhap`
--
ALTER TABLE `chi_tiet_phieu_nhap`
  MODIFY `ma_chi_tiet_phieu_nhap` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `chi_tiet_phieu_xuat`
--
ALTER TABLE `chi_tiet_phieu_xuat`
  MODIFY `ma_chi_tiet_phieu_xuat` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `danh_muc`
--
ALTER TABLE `danh_muc`
  MODIFY `ma_danh_muc` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `don_hang`
--
ALTER TABLE `don_hang`
  MODIFY `ma_don_hang` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `hinh_anh_san_pham`
--
ALTER TABLE `hinh_anh_san_pham`
  MODIFY `ma_hinh_anh` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `lien_he`
--
ALTER TABLE `lien_he`
  MODIFY `ma_lien_he` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `ma_nguoi_dung` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `phieu_nhap`
--
ALTER TABLE `phieu_nhap`
  MODIFY `ma_phieu_nhap` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `phieu_xuat`
--
ALTER TABLE `phieu_xuat`
  MODIFY `ma_phieu_xuat` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  MODIFY `ma_san_pham` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `thanh_dieu_huong`
--
ALTER TABLE `thanh_dieu_huong`
  MODIFY `ma_thanh_dieu_huong` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `thuong_hieu`
--
ALTER TABLE `thuong_hieu`
  MODIFY `ma_thuong_hieu` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `trang_don`
--
ALTER TABLE `trang_don`
  MODIFY `ma_trang_don` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD CONSTRAINT `bai_viet_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD CONSTRAINT `chi_tiet_don_hang_ma_don_hang_foreign` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang` (`ma_don_hang`) ON DELETE CASCADE,
  ADD CONSTRAINT `chi_tiet_don_hang_ma_san_pham_foreign` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `chi_tiet_phieu_nhap`
--
ALTER TABLE `chi_tiet_phieu_nhap`
  ADD CONSTRAINT `chi_tiet_phieu_nhap_ma_phieu_nhap_foreign` FOREIGN KEY (`ma_phieu_nhap`) REFERENCES `phieu_nhap` (`ma_phieu_nhap`) ON DELETE CASCADE,
  ADD CONSTRAINT `chi_tiet_phieu_nhap_ma_san_pham_foreign` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `chi_tiet_phieu_xuat`
--
ALTER TABLE `chi_tiet_phieu_xuat`
  ADD CONSTRAINT `chi_tiet_phieu_xuat_ma_phieu_xuat_foreign` FOREIGN KEY (`ma_phieu_xuat`) REFERENCES `phieu_xuat` (`ma_phieu_xuat`) ON DELETE CASCADE,
  ADD CONSTRAINT `chi_tiet_phieu_xuat_ma_san_pham_foreign` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD CONSTRAINT `danh_muc_ma_danh_muc_cha_foreign` FOREIGN KEY (`ma_danh_muc_cha`) REFERENCES `danh_muc` (`ma_danh_muc`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `don_hang`
--
ALTER TABLE `don_hang`
  ADD CONSTRAINT `don_hang_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `hinh_anh_san_pham`
--
ALTER TABLE `hinh_anh_san_pham`
  ADD CONSTRAINT `hinh_anh_san_pham_ma_san_pham_foreign` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `lien_he`
--
ALTER TABLE `lien_he`
  ADD CONSTRAINT `lien_he_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `phieu_nhap`
--
ALTER TABLE `phieu_nhap`
  ADD CONSTRAINT `phieu_nhap_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `phieu_xuat`
--
ALTER TABLE `phieu_xuat`
  ADD CONSTRAINT `phieu_xuat_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  ADD CONSTRAINT `san_pham_ma_danh_muc_foreign` FOREIGN KEY (`ma_danh_muc`) REFERENCES `danh_muc` (`ma_danh_muc`),
  ADD CONSTRAINT `san_pham_ma_thuong_hieu_foreign` FOREIGN KEY (`ma_thuong_hieu`) REFERENCES `thuong_hieu` (`ma_thuong_hieu`);

--
-- Các ràng buộc cho bảng `thanh_dieu_huong`
--
ALTER TABLE `thanh_dieu_huong`
  ADD CONSTRAINT `thanh_dieu_huong_ma_thanh_dieu_huong_cha_foreign` FOREIGN KEY (`ma_thanh_dieu_huong_cha`) REFERENCES `thanh_dieu_huong` (`ma_thanh_dieu_huong`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `trang_don`
--
ALTER TABLE `trang_don`
  ADD CONSTRAINT `trang_don_ma_nguoi_dung_foreign` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
