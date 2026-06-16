import { Metadata } from "next";
import MentorProfilePage from "./client";

export const metadata: Metadata = {
  title: "Profil - Mentor | InternFlow",
  description: "Halaman Profil - Mentor untuk sistem manajemen magang InternFlow",
};

export default function Page() {
  // Pattern: Server Component untuk SEO, Client Component untuk actions & hooks (Data fetching)
  return <MentorProfilePage />;
}
