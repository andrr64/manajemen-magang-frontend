"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIam } from "@/modules/iam/hooks";
import { Loader2 } from "lucide-react";

export default function DashboardRootDispatcher() {
  const { user, isAuthenticated, isLoading } = useIam();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Jika belum login, tendang ke halaman login
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    // Jika sudah login, arahkan ke dashboard spesifik masing-masing role
    switch (user.role.toLowerCase()) {
      case "mahasiswa":
        router.replace("/dashboard/mahasiswa");
        break;
      case "mentor":
        router.replace("/dashboard/mentor");
        break;
      case "super-admin":
      case "admin":
        router.replace("/dashboard/super-admin");
        break;
      default:
        // Fallback jika role tidak diketahui
        router.replace("/login");
        break;
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Sembari menunggu hook mendeteksi session atau proses redirect berjalan,
  // kita tampilkan spinner agar layar tidak terkesan blank/error.
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-neutral-950">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-neutral-400 animate-pulse text-sm font-medium">Mengarahkan ke Dashboard...</p>
      </div>
    </div>
  );
}
