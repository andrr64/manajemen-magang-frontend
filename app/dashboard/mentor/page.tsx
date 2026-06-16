import { Metadata } from "next";
import DashboardHome from "./client";

export const metadata: Metadata = {
  title: "Dashboard Mentor | InternFlow",
  description: "Halaman Dashboard Mentor untuk sistem manajemen magang InternFlow",
};

export default function Page() {
  // Pattern: Server Component untuk SEO, Client Component untuk actions & hooks (Data fetching)
  return <DashboardHome />;
}
