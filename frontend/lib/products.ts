export type ProductCategory = "moto" | "accessories" | "oil" | "gear";

export type MotoType = "sport" | "naked";

export type Product = {
  id: number;
  ten: string;
  gia: number;
  giaKhuyenMai: number;
  image: string;
  category: ProductCategory;
  motoType?: MotoType;
  brand: string;
  tonKho: number;
  moTa: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

type BackendProduct = {
  ma_san_pham: number;
  ten_san_pham: string;
  gia_ban: number;
  anh_dai_dien?: string | null;

  gia_khuyen_mai?: number | null;
  ten_thuong_hieu?: string | null;
  so_luong_ton?: number | null;
  mo_ta?: string | null;
  loai_san_pham?: string | null;
};

function mapProduct(product: BackendProduct): Product {
  return {
    id: product.ma_san_pham,
    ten: product.ten_san_pham,
    gia: Number(product.gia_ban),

    giaKhuyenMai: Number(product.gia_khuyen_mai ?? product.gia_ban),

    image: product.anh_dai_dien ?? "/products/default.jpg",

    category: "moto",

    brand: product.ten_thuong_hieu ?? "",

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
    throw new Error("Không thể tải danh sách sản phẩm");
  }

  const data = await response.json();

  const items = Array.isArray(data) ? data : (data.data ?? data.products ?? []);

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
    throw new Error("Không thể tải sản phẩm");
  }

  const data = await response.json();

  return mapProduct(data.data ?? data);
}
