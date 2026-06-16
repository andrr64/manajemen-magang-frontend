import { Metadata } from "next";
import MentorReferenceLetterPage from "./client";

export const metadata: Metadata = {
  title: "Surat Keterangan - Mentor | InternFlow",
  description: "Halaman Surat Keterangan - Mentor untuk sistem manajemen magang InternFlow",
};

export default function Page() {
  // Pattern: Server Component untuk SEO, Client Component untuk actions & hooks (Data fetching)
  return <MentorReferenceLetterPage />;
}
