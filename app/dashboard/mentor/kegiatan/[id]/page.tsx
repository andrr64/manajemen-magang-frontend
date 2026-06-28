import { Metadata } from "next";
import DetailKegiatanClient from "./client";

export const metadata: Metadata = {
  title: "Detail Rekap Kegiatan Mahasiswa | InternFlow",
  description: "Detail rekapitulasi kegiatan magang mahasiswa.",
};

export default async function DetailKegiatanPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  return <DetailKegiatanClient mahasiswaId={resolvedParams.id} />;
}
