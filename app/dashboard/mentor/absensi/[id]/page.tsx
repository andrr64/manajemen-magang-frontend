import { Metadata } from "next";
import DetailAbsensiClient from "./client";

export const metadata: Metadata = {
  title: "Detail Absensi Mahasiswa | InternFlow",
  description: "Detail riwayat dan statistik absensi mahasiswa.",
};

export default async function DetailAbsensiPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params; // Next.js 15+ async params
  return <DetailAbsensiClient mahasiswaId={resolvedParams.id} />;
}
