"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { NguoiDung } from "@/types/admin";
import { LoiShop, shopApi, tokenShop, xoaTaiKhoan } from "./api";

export function useTaiKhoan(batBuoc = false) {
  const [user, setUser] = useState<NguoiDung | null>(null);
  const [tai, setTai] = useState(true);
  const [loi, setLoi] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    let huy = false;
    function taiTaiKhoan() {
      const request = tokenShop()
        ? shopApi<{ user: NguoiDung }>("/me")
        : Promise.resolve(null);
      request
        .then((data) => {
          if (huy) return;
          setUser(data?.user ?? null);
          setLoi("");
          if (!data && batBuoc)
            router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        })
        .catch((error) => {
          if (huy) return;
          if (error instanceof LoiShop && [401, 403].includes(error.status)) {
            setUser(null);
            // API đã phát sự kiện khi 401; chỉ xóa thêm nếu vẫn còn token (403).
            if (tokenShop()) xoaTaiKhoan();
            if (batBuoc)
              router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          }
          setLoi(
            error instanceof Error ? error.message : "Không thể tải tài khoản.",
          );
        })
        .finally(() => {
          if (!huy) setTai(false);
        });
    }
    taiTaiKhoan();
    window.addEventListener("shop-auth", taiTaiKhoan);
    return () => {
      huy = true;
      window.removeEventListener("shop-auth", taiTaiKhoan);
    };
  }, [batBuoc, pathname, router]);
  return { user, tai, loi };
}
