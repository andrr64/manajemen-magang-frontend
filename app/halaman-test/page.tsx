import type { Metadata } from "next";
import TestPlayground from "./TestPlayground";

export const metadata: Metadata = {
  title: "Interactive Component Lab - InternFlow",
  description: "Sistem Informasi Manajemen Magang - Laboratorium Uji Coba Komponen Premium dan Interaktif.",
};

export default function TestPage() {
  return <TestPlayground />;
}

