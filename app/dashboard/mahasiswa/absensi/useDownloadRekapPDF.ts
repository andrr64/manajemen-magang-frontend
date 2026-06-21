"use client";

import { useState, useCallback } from "react";

// ─── tipe lokal ───────────────────────────────────────────────────────

type AbsensiStatus = "Hadir" | "Izin" | "Sakit" | "Alpha";

import { Student } from "@/modules/data_mahasiswa/types";
import { AttendanceLog } from "@/modules/data_absensi/types";

// ─── helpers ─────────────────────────────────────────────────────────

function formatTanggalPanjang(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatPeriode(dari?: string | null, sampai?: string | null): string {
  if (!dari || !sampai) return "-";
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  const d = new Date(dari   + "T00:00:00").toLocaleDateString("id-ID", opts);
  const s = new Date(sampai + "T00:00:00").toLocaleDateString("id-ID", opts);
  return `${d} – ${s}`;
}

const STATUS_WARNA_HEX: Record<AbsensiStatus, string> = {
  Hadir: "#059669",
  Izin:  "#2563eb",
  Sakit: "#0284c7",
  Alpha: "#e11d48",
};

const STATUS_LABEL: Record<AbsensiStatus, string> = {
  Hadir: "Hadir", Izin: "Izin", Sakit: "Sakit", Alpha: "Tidak Hadir",
};

// ─── HOOK ────────────────────────────────────────────────────────────

export function useDownloadRekapPDF(
  profile: Student | null,
  absensi: AttendanceLog[],
  ttdBase64: string | null,
) {
  const [isGenerating, setIsGenerating] = useState(false);

  const download = useCallback(async () => {
    setIsGenerating(true);
    try {
      const { default: jsPDF } = await import("jspdf");

      const doc  = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pw   = 210;
      const ph   = 297;
      const ml   = 18;
      const mr   = 18;
      const mt   = 18;
      const cw   = pw - ml - mr;
      let   y    = mt;

      const navyR = 35,  navyG = 47,  navyB = 114;
      const tealR = 54,  tealG = 173, tealB = 163;

      // Judul
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(navyR, navyG, navyB);
      doc.text("REKAPITULASI ABSENSI MAGANG", pw / 2, y, { align: "center" });
      y += 6;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 100);
      doc.text("DIREKTORAT WILAYAH 1", pw / 2, y, { align: "center" });
      y += 5;

      doc.setDrawColor(tealR, tealG, tealB);
      doc.setLineWidth(0.8);
      doc.line(ml, y, pw - mr, y);
      y += 1;
      doc.setLineWidth(0.3);
      doc.line(ml, y, pw - mr, y);
      y += 7;

      // Info mahasiswa
      const labelX = ml;
      const sepX   = ml + 32;
      const valX   = ml + 34;

      const infoRows: [string, string][] = [
        ["Nama",           profile?.name || "Budi Santoso"],
        ["NIM",            profile?.nim || "2021001234"],
        ["Instansi / PT",  profile?.university || "Universitas Negeri Jakarta"],
        ["Periode Magang", formatPeriode(profile?.tanggalMulai, profile?.tanggalBerakhir)],
      ];

      doc.setFontSize(9.5);
      for (const [label, nilai] of infoRows) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(navyR, navyG, navyB);
        doc.text(label, labelX, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 40, 60);
        doc.text(":", sepX, y);
        doc.text(nilai, valX, y);
        y += 5.5;
      }

      y += 3;

      // Tabel
      const colWidths = [12, cw - 12 - 38, 38];
      const rowH      = 7;
      const headerH   = 8;

      doc.setFillColor(navyR, navyG, navyB);
      doc.rect(ml, y, cw, headerH, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);

      const hCols = ["No.", "Tanggal", "Status Kehadiran"];
      let cx = ml;
      for (let i = 0; i < 3; i++) {
        const tx = i === 0 ? cx + colWidths[i] / 2
                 : i === 2 ? cx + colWidths[i] / 2
                 : cx + 2;
        doc.text(hCols[i], tx, y + headerH / 2 + 1, { align: i === 1 ? "left" : "center" });
        cx += colWidths[i];
      }
      y += headerH;

      doc.setFontSize(8.5);
      for (let idx = 0; idx < absensi.length; idx++) {
        const row    = absensi[idx];
        const isEven = idx % 2 === 0;

        if (row.type === "Alpha")   doc.setFillColor(255, 241, 242);
        else if (isEven)            doc.setFillColor(255, 255, 255);
        else                        doc.setFillColor(248, 250, 252);
        doc.rect(ml, y, cw, rowH, "F");

        doc.setDrawColor(220, 220, 235);
        doc.setLineWidth(0.2);
        doc.line(ml, y + rowH, ml + cw, y + rowH);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(160, 160, 180);
        doc.text(String(idx + 1), ml + colWidths[0] / 2, y + rowH / 2 + 1, { align: "center" });

        doc.setTextColor(30, 30, 60);
        doc.text(formatTanggalPanjang(row.tanggalISO!), ml + colWidths[0] + 2, y + rowH / 2 + 1);

        const [sR, sG, sB] = hexToRgb(STATUS_WARNA_HEX[row.type as AbsensiStatus] || "#000000");
        doc.setTextColor(sR, sG, sB);
        doc.setFont("helvetica", "bold");
        doc.text(
          STATUS_LABEL[row.type as AbsensiStatus] || row.type,
          ml + colWidths[0] + colWidths[1] + colWidths[2] / 2,
          y + rowH / 2 + 1,
          { align: "center" },
        );

        y += rowH;

        if (y > ph - 60 && idx < absensi.length - 1) {
          doc.addPage();
          y = mt;
        }
      }

      y += 8;

      // Ringkasan
      const hadir      = absensi.filter(r => r.type === "Hadir").length;
      const izin       = absensi.filter(r => r.type === "Izin").length;
      const sakit      = absensi.filter(r => r.type === "Sakit").length;
      const tidakHadir = absensi.filter(r => r.type === "Alpha").length;
      const total      = absensi.length;

      const summaryX = pw - mr - 60;
      doc.setDrawColor(200, 200, 220);
      doc.setLineWidth(0.3);
      doc.line(summaryX - 4, y - 2, pw - mr, y - 2);
      y += 2;

      const summaryRows: [string, number, string][] = [
        ["Total Hadir",       hadir,      "#059669"],
        ["Total Izin",        izin,       "#2563eb"],
        ["Total Sakit",       sakit,      "#0284c7"],
        ["Total Tidak Hadir", tidakHadir, "#e11d48"],
      ];

      doc.setFontSize(8.5);
      for (const [label, nilai, hex] of summaryRows) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 110);
        doc.text(label, summaryX, y);
        const [sR, sG, sB] = hexToRgb(hex);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(sR, sG, sB);
        doc.text(`${nilai} hari`, pw - mr, y, { align: "right" });
        y += 5;
      }

      doc.setDrawColor(navyR, navyG, navyB);
      doc.setLineWidth(0.3);
      doc.line(summaryX - 4, y, pw - mr, y);
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(navyR, navyG, navyB);
      doc.text("Total Hari", summaryX, y);
      doc.text(`${total} hari`, pw - mr, y, { align: "right" });
      y += 12;

      // Tanda tangan
      const now = new Date();
      const tgl = now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 90);
      doc.text(`Jakarta, ${tgl}`, pw - mr, y, { align: "right" });
      y += 5;

      if (ttdBase64) {
        const props = doc.getImageProperties(ttdBase64);
        const imgW = 42;
        const imgH = (props.height * imgW) / props.width;
        doc.addImage(ttdBase64, "PNG", pw - mr - imgW, y, imgW, imgH);
        y += imgH + 2;
      } else {
        y += 28;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(navyR, navyG, navyB);
      doc.text("Agus Joko Saptono", pw - mr, y, { align: "right" });
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 110);
      doc.text("(Direktur Wilayah 1)", pw - mr, y, { align: "right" });

      const nim = profile?.nim || "2021001234";
      const filename = `rekap-absensi-${nim}-${now.getFullYear()}.pdf`;
      doc.save(filename);
    } finally {
      setIsGenerating(false);
    }
  }, [profile, absensi, ttdBase64]);

  return { download, isGenerating };
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}
