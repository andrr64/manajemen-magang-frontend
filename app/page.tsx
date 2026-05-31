import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Roles from "@/components/Roles";
import Timeline from "@/components/Timeline";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "InternFlow - Sistem Informasi Manajemen Magang Terintegrasi",
  description: "Platform digital untuk mempermudah pendaftaran, logbook harian, bimbingan online, dan evaluasi nilai magang mahasiswa dengan mitra industri resmi.",
  keywords: ["magang", "manajemen magang", "internship", "logbook magang", "portofolio magang", "bimbingan online"],
  authors: [{ name: "InternFlow Team" }],
  openGraph: {
    title: "InternFlow - Sistem Informasi Manajemen Magang Terintegrasi",
    description: "Platform digital untuk mempermudah pendaftaran, logbook harian, bimbingan online, dan evaluasi nilai magang mahasiswa.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Layout */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Core Features Section */}
        <Features />

        {/* 3. Role Showcase Section */}
        <Roles />

        {/* 4. Timeline Process Section */}
        <Timeline />

        {/* 5. Frequently Asked Questions Section */}
        <Faq />
      </main>

      {/* Unified Footer */}
      <Footer />
    </div>
  );
}
