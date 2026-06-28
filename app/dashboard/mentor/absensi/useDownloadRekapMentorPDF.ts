"use client";

import { useState, useCallback } from "react";

// ─── helpers ─────────────────────────────────────────────────────────

function formatTanggalPanjang(iso: string): string {
  if (!iso || typeof iso !== "string") return "-";
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

const STATUS_WARNA_HEX: Record<string, string> = {
  hadir: "#059669",
  izin:  "#2563eb",
  sakit: "#0284c7",
  alpha: "#e11d48",
};

const STATUS_LABEL: Record<string, string> = {
  hadir: "Hadir", izin: "Izin", sakit: "Sakit", alpha: "Tidak Hadir",
};

// ─── HOOK ────────────────────────────────────────────────────────────

export function useDownloadRekapMentorPDF(
  rekapData: [string, string, string][],
  filterLabel: string,
  ttdBase64: string | null,
  stats: { hadir: number; izin: number; sakit: number; alpha: number; total: number }
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

      // Info filter
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(navyR, navyG, navyB);
      doc.text("Periode Laporan", ml, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 60);
      doc.text(":", ml + 32, y);
      doc.text(filterLabel, ml + 34, y);
      y += 8;

      // Tabel
      const colWidths = [12, 60, cw - 12 - 60 - 38, 38];
      const rowH      = 7;
      const headerH   = 8;

      doc.setFillColor(navyR, navyG, navyB);
      doc.rect(ml, y, cw, headerH, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);

      const hCols = ["No.", "Nama Mahasiswa", "Tanggal", "Status"];
      let cx = ml;
      for (let i = 0; i < 4; i++) {
        const align = i === 1 || i === 2 ? "left" : "center";
        const tx = align === "left" ? cx + 2 : cx + colWidths[i] / 2;
        doc.text(hCols[i], tx, y + headerH / 2 + 1, { align });
        cx += colWidths[i];
      }
      y += headerH;

      doc.setFontSize(8.5);
      for (let idx = 0; idx < rekapData.length; idx++) {
        const row    = rekapData[idx]; // [nama, tanggal, status]
        const statusRaw = (row[2] || "").toLowerCase();
        const statusType = statusRaw === "alfa" ? "alpha" : statusRaw;
        const isEven = idx % 2 === 0;

        if (statusType === "alpha") doc.setFillColor(255, 241, 242);
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
        doc.text(row[0] || "-", ml + colWidths[0] + 2, y + rowH / 2 + 1);
        doc.text(formatTanggalPanjang(row[1]), ml + colWidths[0] + colWidths[1] + 2, y + rowH / 2 + 1);

        const [sR, sG, sB] = hexToRgb(STATUS_WARNA_HEX[statusType] || "#000000");
        doc.setTextColor(sR, sG, sB);
        doc.setFont("helvetica", "bold");
        doc.text(
          STATUS_LABEL[statusType] || row[2],
          ml + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2,
          y + rowH / 2 + 1,
          { align: "center" },
        );

        y += rowH;

        if (y > ph - 60 && idx < rekapData.length - 1) {
          doc.addPage();
          y = mt;
        }
      }

      y += 8;

      // Ringkasan
      const summaryX = pw - mr - 60;
      doc.setDrawColor(200, 200, 220);
      doc.setLineWidth(0.3);
      doc.line(summaryX - 4, y - 2, pw - mr, y - 2);
      y += 2;

      const summaryRows: [string, number, string][] = [
        ["Total Hadir",       stats.hadir,      "#059669"],
        ["Total Izin",        stats.izin,       "#2563eb"],
        ["Total Sakit",       stats.sakit,      "#0284c7"],
        ["Total Tidak Hadir", stats.alpha,      "#e11d48"],
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
      doc.text("Total Catatan", summaryX, y);
      doc.text(`${stats.total} record`, pw - mr, y, { align: "right" });
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

      const filename = `rekap-absensi-mentor-${filterLabel.replace(" ", "-").toLowerCase()}-${now.getFullYear()}.pdf`;
      doc.save(filename);
    } finally {
      setIsGenerating(false);
    }
  }, [rekapData, filterLabel, ttdBase64, stats]);

  return { download, isGenerating };
}
