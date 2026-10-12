export type ProductCategory =
  | "scooter"
  | "underbone"
  | "manual"
  | "bigbike"
  | "helmet"
  | "oil"
  | "touring"
  | "parts";

export type Product = {
  id: number;
  ten: string;
  gia: number;
  giaKhuyenMai: number;
  image: string;
  category: ProductCategory;
  categoryId: number;
  categoryName: string;
  brand: string;
  brandId: number;
  tonKho: number;
  moTa: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

type BackendProduct = {
  ma_san_pham: number;
  ten_san_pham: string;
  ma_danh_muc: number;
  ma_thuong_hieu: number;
  gia_ban: string | number;
  gia_khuyen_mai?: string | number | null;
  so_luong_ton?: number | null;
  anh_dai_dien?: string | null;
  mo_ta?: string | null;

  danh_muc?: {
    ma_danh_muc: number;
    ten_danh_muc: string;
  } | null;

  thuong_hieu?: {
    ma_thuong_hieu: number;
    ten_thuong_hieu: string;
  } | null;
};

function mapCategory(categoryId: number): ProductCategory {
  switch (categoryId) {
    case 1:
      return "scooter";

    case 2:
      return "underbone";

    case 3:
      return "manual";

    case 4:
      return "bigbike";

    case 5:
      return "helmet";

    case 6:
      return "oil";

    case 7:
      return "touring";

    case 8:
      return "parts";

    default:
      return "parts";
  }
}

function mapProduct(product: BackendProduct): Product {
  return {
    id: product.ma_san_pham,

    ten: product.ten_san_pham,

    gia: Number(product.gia_ban),

    giaKhuyenMai: Number(product.gia_khuyen_mai ?? product.gia_ban),

    image: product.anh_dai_dien ?? "/products/default.jpg",

    category: mapCategory(product.ma_danh_muc),

    categoryId: product.ma_danh_muc,

    categoryName: product.danh_muc?.ten_danh_muc ?? "",

    brand: product.thuong_hieu?.ten_thuong_hieu ?? "",

    brandId: product.ma_thuong_hieu,

    tonKho: Number(product.so_luong_ton ?? 0),

    moTa: product.mo_ta ?? "",
  };
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/sanpham`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`API /sanpham lỗi ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  const items: BackendProduct[] = Array.isArray(data)
    ? data
    : (data.data ?? data.products ?? []);

  return items.map(mapProduct);
}

export async function getProductById(id: number): Promise<Product | null> {
  const response = await fetch(`${API_URL}/sanpham/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`API /sanpham/${id} lỗi ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  return mapProduct(data.data ?? data);
}
