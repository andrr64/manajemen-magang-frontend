import { Metadata } from "next";
import MentorDataMahasiswaPage from "./client";

export const metadata: Metadata = {
  title: "Data Mahasiswa - Mentor | InternFlow",
  description: "Halaman Data Mahasiswa - Mentor untuk sistem manajemen magang InternFlow",
};

export default function Page() {
  // Pattern: Server Component untuk SEO, Client Component untuk actions & hooks (Data fetching)
  return <MentorDataMahasiswaPage />;
}
