import { Metadata } from "next";
import MentorPenilaianPage from "./client";

export const metadata: Metadata = {
  title: "Penilaian - Mentor | InternFlow",
  description: "Halaman Penilaian - Mentor untuk sistem manajemen magang InternFlow",
};

export default function Page() {
  // Pattern: Server Component untuk SEO, Client Component untuk actions & hooks (Data fetching)
  return <MentorPenilaianPage />;
}
