import { Metadata } from "next";
import MentorActivitiesPage from "./client";

export const metadata: Metadata = {
  title: "Data Kegiatan - Mentor | InternFlow",
  description: "Halaman Data Kegiatan - Mentor untuk sistem manajemen magang InternFlow",
};

export default function Page() {
  // Pattern: Server Component untuk SEO, Client Component untuk actions & hooks (Data fetching)
  return <MentorActivitiesPage />;
}
