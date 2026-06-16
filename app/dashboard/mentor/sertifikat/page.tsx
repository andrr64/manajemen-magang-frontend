import { Metadata } from "next";
import MentorCertificatePage from "./client";

export const metadata: Metadata = {
  title: "Sertifikat - Mentor | InternFlow",
  description: "Halaman Sertifikat - Mentor untuk sistem manajemen magang InternFlow",
};

export default function Page() {
  // Pattern: Server Component untuk SEO, Client Component untuk actions & hooks (Data fetching)
  return <MentorCertificatePage />;
}
