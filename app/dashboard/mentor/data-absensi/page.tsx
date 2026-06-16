import { Metadata } from "next";
import MentorAttendancePage from "./client";

export const metadata: Metadata = {
  title: "Data Absensi - Mentor | InternFlow",
  description: "Halaman Data Absensi - Mentor untuk sistem manajemen magang InternFlow",
};

export default function Page() {
  // Pattern: Server Component untuk SEO, Client Component untuk actions & hooks (Data fetching)
  return <MentorAttendancePage />;
}
