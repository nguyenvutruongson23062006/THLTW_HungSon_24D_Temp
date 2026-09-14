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

export const products: Product[] = [
  {
    id: 1,
    ten: "Yamaha YZF-R7",
    gia: 269000000,
    giaKhuyenMai: 259000000,
    image: "/products/yamaha-yzf-r7.jpg",
    category: "moto",
    motoType: "sport",
    brand: "Yamaha",
    tonKho: 5,
    moTa: "Mẫu sportbike 2 xi-lanh với thiết kế thể thao và khả năng vận hành linh hoạt.",
  },
  {
    id: 2,
    ten: "Yamaha MT-07",
    gia: 189000000,
    giaKhuyenMai: 179000000,
    image: "/products/yamaha-mt07.jpg",
    category: "moto",
    motoType: "naked",
    brand: "Yamaha",
    tonKho: 8,
    moTa: "Naked bike nhỏ gọn, linh hoạt và phù hợp sử dụng trên đường phố.",
  },
  {
    id: 3,
    ten: "Honda CBR650R",
    gia: 254000000,
    giaKhuyenMai: 244000000,
    image: "/products/honda-cbr650r.jpg",
    category: "moto",
    motoType: "sport",
    brand: "Honda",
    tonKho: 4,
    moTa: "Sportbike 4 xi-lanh mang đến khả năng vận hành mạnh mẽ và âm thanh đặc trưng.",
  },
  {
    id: 4,
    ten: "Honda CB650R",
    gia: 249000000,
    giaKhuyenMai: 239000000,
    image: "/products/honda-cb650r.jpg",
    category: "moto",
    motoType: "naked",
    brand: "Honda",
    tonKho: 6,
    moTa: "Naked bike cân bằng giữa hiệu năng, thiết kế và khả năng sử dụng hằng ngày.",
  },
  {
    id: 5,
    ten: "Kawasaki Ninja 650",
    gia: 209000000,
    giaKhuyenMai: 199000000,
    image: "/products/kawasaki-ninja-650.jpg",
    category: "moto",
    motoType: "sport",
    brand: "Kawasaki",
    tonKho: 7,
    moTa: "Sportbike thực dụng với tư thế lái cân bằng và khả năng vận hành linh hoạt.",
  },
  {
    id: 6,
    ten: "Kawasaki Z650",
    gia: 194000000,
    giaKhuyenMai: 184000000,
    image: "/products/kawasaki-z650.jpg",
    category: "moto",
    motoType: "naked",
    brand: "Kawasaki",
    tonKho: 9,
    moTa: "Naked bike linh hoạt, phù hợp di chuyển trong đô thị và các chuyến đi ngắn.",
  },
  {
    id: 7,
    ten: "Suzuki GSX-8R",
    gia: 285000000,
    giaKhuyenMai: 275000000,
    image: "/products/suzuki-gsx-8r.jpg",
    category: "moto",
    motoType: "sport",
    brand: "Suzuki",
    tonKho: 3,
    moTa: "Mẫu sportbike hiện đại với thiết kế khí động học và động cơ mạnh mẽ.",
  },
  {
    id: 8,
    ten: "Triumph Daytona 660",
    gia: 299000000,
    giaKhuyenMai: 289000000,
    image: "/products/triumph-daytona-660.jpg",
    category: "moto",
    motoType: "sport",
    brand: "Triumph",
    tonKho: 4,
    moTa: "Sportbike 3 xi-lanh với thiết kế thể thao và khả năng vận hành mạnh mẽ.",
  },
];
