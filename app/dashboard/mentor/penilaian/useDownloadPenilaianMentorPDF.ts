"use client";

import { useState, useCallback } from "react";
import { PenilaianResponse } from "@/modules/penilaian/types";

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function useDownloadPenilaianMentorPDF(
  rekapList: { nama: string; penilaian: PenilaianResponse | null }[],
  ttdBase64: string | null
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
      doc.text("REKAPITULASI PENILAIAN MAGANG", pw / 2, y, { align: "center" });
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

      // Tabel header
      const colWidths = [12, 60, cw - 12 - 60 - 20, 20]; // No, Nama, Kriteria, Nilai
      const rowH      = 6;
      const headerH   = 8;

      doc.setFillColor(navyR, navyG, navyB);
      doc.rect(ml, y, cw, headerH, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);

      const hCols = ["No.", "Nama Mahasiswa", "Kriteria Penilaian", "Nilai"];
      let cx = ml;
      for (let i = 0; i < 4; i++) {
        const align = i === 1 || i === 2 ? "left" : "center";
        const tx = align === "left" ? cx + 2 : cx + colWidths[i] / 2;
        doc.text(hCols[i], tx, y + headerH / 2 + 1, { align });
        cx += colWidths[i];
      }
      y += headerH;

      doc.setFontSize(8.5);
      for (let idx = 0; idx < rekapList.length; idx++) {
        const item = rekapList[idx];
        const isEven = idx % 2 === 0;
        const p = item.penilaian;

        let numRows = p ? 9 : 1;
        let blockHeight = numRows * rowH;

        if (y + blockHeight > ph - 40) {
          doc.addPage();
          y = mt;
        }

        if (isEven) doc.setFillColor(255, 255, 255);
        else        doc.setFillColor(248, 250, 252);
        
        doc.rect(ml, y, cw, blockHeight, "F");
        doc.setDrawColor(220, 220, 235);
        doc.setLineWidth(0.2);
        doc.line(ml, y + blockHeight, ml + cw, y + blockHeight);

        // draw No and Name (vertically centered in their block, or just at the top)
        doc.setFont("helvetica", "normal");
        doc.setTextColor(160, 160, 180);
        doc.text(String(idx + 1), ml + colWidths[0] / 2, y + rowH / 2 + 1, { align: "center" });
        doc.setTextColor(30, 30, 60);
        doc.setFont("helvetica", "bold");
        doc.text(item.nama || "-", ml + colWidths[0] + 2, y + rowH / 2 + 1);
        doc.setFont("helvetica", "normal");

        if (!p) {
          doc.text("Belum di nilai", ml + colWidths[0] + colWidths[1] + 2, y + rowH / 2 + 1);
          doc.text("-", ml + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, y + rowH / 2 + 1, { align: "center" });
          y += blockHeight;
        } else {
          const kriteria = [
            { label: "Kinerja Pekerjaan", value: p.kinerja },
            { label: "Kedisiplinan", value: p.kedisiplinan },
            { label: "Tanggung Jawab", value: p.tanggungJawab },
            { label: "Komunikasi", value: p.komunikasi },
            { label: "Sikap & Etika Kerja", value: p.sikap },
            { label: "Kerapihan", value: p.kerapihan },
            { label: "Kehadiran", value: p.absensi },
            { label: "Kerjasama Tim", value: p.kerjasama },
            { label: "Catatan: " + (p.catatan || "-"), value: " " }
          ];

          let cy = y;
          for (let i = 0; i < kriteria.length; i++) {
            doc.setTextColor(60, 60, 80);
            doc.text(kriteria[i].label, ml + colWidths[0] + colWidths[1] + 2, cy + rowH / 2 + 1);
            doc.text(String(kriteria[i].value), ml + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, cy + rowH / 2 + 1, { align: "center" });
            cy += rowH;
          }
          y += blockHeight;
        }
      }

      y += 8;

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

      const filename = `rekap-penilaian-mentor-${now.toISOString().split("T")[0]}.pdf`;
      doc.save(filename);
    } finally {
      setIsGenerating(false);
    }
  }, [rekapList, ttdBase64]);

  return { download, isGenerating };
}
