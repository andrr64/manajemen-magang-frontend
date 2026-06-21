import { useState, useCallback } from "react";
import { AssessmentItem, PenilaianResponse } from "@/modules/penilaian/types";
import { Student } from "@/modules/data_mahasiswa/types";

// ─── helpers ─────────────────────────────────────────────────────────

function formatPeriode(dari?: string | null, sampai?: string | null): string {
  if (!dari || !sampai) return "-";
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  const d = new Date(dari + "T00:00:00").toLocaleDateString("id-ID", opts);
  const s = new Date(sampai + "T00:00:00").toLocaleDateString("id-ID", opts);
  return `${d} – ${s}`;
}

function gradeInfo(avg: number) {
  if (avg >= 85) return { grade: "A", status: "Sangat Memuaskan" };
  if (avg >= 75) return { grade: "B", status: "Memuaskan" };
  return          { grade: "C", status: "Cukup" };
}

function scoreBadgeColor(score: number): [number, number, number] {
  if (score >= 85) return [5, 150, 105]; // emerald-600
  if (score >= 75) return [37, 99, 235]; // blue-600
  return [217, 119, 6]; // amber-600
}

// ─── HOOK ────────────────────────────────────────────────────────────

export function useDownloadPenilaianPDF(
  profile: Student | null,
  penilaian: PenilaianResponse | null,
  assessments: AssessmentItem[],
  ttdBase64: string | null,
) {
  const [isGenerating, setIsGenerating] = useState(false);

  const download = useCallback(async () => {
    if (!penilaian) return;
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

      // Info mahasiswa
      const labelX = ml;
      const sepX   = ml + 32;
      const valX   = ml + 34;

      const nama = profile?.name || "Budi Santoso";
      const nim = profile?.nim || "2021001234";
      const uni = profile?.university || "Universitas Negeri Jakarta";

      const infoRows: [string, string][] = [
        ["Nama",           nama],
        ["NIM",            nim],
        ["Instansi / PT",  uni],
        ["Periode Magang", formatPeriode(penilaian.tanggalMulai, penilaian.tanggalBerakhir)],
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
      const colWidths = [12, cw - 12 - 38 - 38, 38, 38]; // No, Kriteria, Nilai, Capaian
      const rowH      = 8;
      const headerH   = 8;

      doc.setFillColor(navyR, navyG, navyB);
      doc.rect(ml, y, cw, headerH, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);

      const hCols = ["No.", "Kriteria", "Nilai", "Capaian"];
      let cx = ml;
      for (let i = 0; i < 4; i++) {
        const tx = (i === 0 || i >= 2) ? cx + colWidths[i] / 2 : cx + 2;
        doc.text(hCols[i], tx, y + headerH / 2 + 1, { align: (i === 0 || i >= 2) ? "center" : "left" });
        cx += colWidths[i];
      }
      y += headerH;

      doc.setFontSize(8.5);
      for (let idx = 0; idx < assessments.length; idx++) {
        const row    = assessments[idx];
        const isEven = idx % 2 === 0;

        if (isEven) doc.setFillColor(255, 255, 255);
        else        doc.setFillColor(248, 250, 252);
        doc.rect(ml, y, cw, rowH, "F");

        doc.setDrawColor(220, 220, 235);
        doc.setLineWidth(0.2);
        doc.line(ml, y + rowH, ml + cw, y + rowH);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(160, 160, 180);
        doc.text(String(idx + 1), ml + colWidths[0] / 2, y + rowH / 2 + 1, { align: "center" });

        doc.setTextColor(30, 30, 60);
        doc.text(row.name, ml + colWidths[0] + 2, y + rowH / 2 + 1);

        const [sR, sG, sB] = scoreBadgeColor(row.score);
        doc.setTextColor(sR, sG, sB);
        doc.setFont("helvetica", "bold");
        doc.text(
          row.score.toFixed(1),
          ml + colWidths[0] + colWidths[1] + colWidths[2] / 2,
          y + rowH / 2 + 1,
          { align: "center" },
        );

        const capaian = row.score >= 85 ? "Sangat Baik" : row.score >= 75 ? "Baik" : "Cukup";
        doc.text(
          capaian,
          ml + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2,
          y + rowH / 2 + 1,
          { align: "center" },
        );

        y += rowH;

        if (y > ph - 60 && idx < assessments.length - 1) {
          doc.addPage();
          y = mt;
        }
      }

      y += 8;

      // Ringkasan
      const avg = Number(penilaian.nilaiTotal ?? 0);
      const { grade, status } = gradeInfo(avg);
      const [avgR, avgG, avgB] = scoreBadgeColor(avg);

      const summaryX = pw - mr - 65;
      doc.setDrawColor(200, 200, 220);
      doc.setLineWidth(0.3);
      doc.line(summaryX - 4, y - 2, pw - mr, y - 2);
      y += 2;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(navyR, navyG, navyB);
      doc.text("NILAI TOTAL", summaryX, y + 2);
      
      doc.setFontSize(12);
      doc.setTextColor(avgR, avgG, avgB);
      doc.text(avg.toFixed(2), pw - mr, y + 2, { align: "right" });
      y += 8;

      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 120);
      doc.text("Grade / Capaian:", summaryX, y);
      
      doc.setTextColor(avgR, avgG, avgB);
      doc.text(`${grade} — ${status}`, pw - mr, y, { align: "right" });
      
      y += 8;

      // Catatan Mentor (Left side)
      if (penilaian.catatan && penilaian.catatan !== "-") {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(tealR, tealG, tealB);
        doc.text("Catatan Mentor:", ml, y - 10);
        
        doc.setFont("helvetica", "italic");
        doc.setTextColor(60, 60, 90);
        const splitText = doc.splitTextToSize(`"${penilaian.catatan}"`, cw - 80);
        doc.text(splitText, ml, y - 5);
      }

      y += 10;

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

      const filename = `rekap-penilaian-${nim}-${now.getFullYear()}.pdf`;
      doc.save(filename);
    } finally {
      setIsGenerating(false);
    }
  }, [profile, penilaian, assessments, ttdBase64]);

  return { download, isGenerating };
}
