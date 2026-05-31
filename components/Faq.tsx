"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Bagaimana cara mahasiswa mendaftar program magang?",
      answer: "Mahasiswa dapat masuk ke portal, melengkapi data profil, lalu menjelajahi menu 'Lowongan Magang' untuk melihat posisi yang tersedia dari mitra industri resmi perguruan tinggi. Klik tombol 'Lamar', unggah CV & berkas pendukung, kemudian pantau status lamaran di dashboard.",
    },
    {
      question: "Apakah dosen pembimbing bisa memantau logbook setiap hari?",
      answer: "Ya, benar. Dosen pembimbing akademik memiliki akses khusus ke portal untuk melihat daftar mahasiswa bimbingan secara real-time. Dosen dapat memantau entri logbook harian, berkas lampiran pendukung, catatan kehadiran, serta memberikan catatan komentar bimbingan langsung.",
    },
    {
      question: "Bagaimana mitra industri mengunggah lowongan magang?",
      answer: "Mitra industri resmi dapat masuk melalui portal mitra, mengakses menu 'Kelola Lowongan', kemudian menambahkan posisi magang baru dengan menyertakan deskripsi pekerjaan, kualifikasi, jumlah kuota mahasiswa yang dicari, serta jangka waktu pelaksanaan program.",
    },
    {
      question: "Bagaimana proses penilaian akhir magang dilakukan?",
      answer: "Penilaian akhir bersifat kolaboratif dan transparan. Terdiri dari akumulasi nilai performa kerja di lapangan yang diisi oleh mentor instansi mitra (bobot 60%) dan nilai laporan akhir magang serta ujian bimbingan oleh dosen pembimbing akademis (bobot 40%).",
    },
    {
      question: "Apakah sertifikat magang diterbitkan secara otomatis setelah selesai?",
      answer: "Ya. Setelah mahasiswa dinyatakan menyelesaikan program magang, mengunggah laporan akhir yang telah disetujui dosen, serta mendapatkan penilaian akhir lengkap dari dosen dan mitra, sistem akan menerbitkan Sertifikat Kelulusan Magang digital yang ditandatangani secara elektronik.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">
            Tanya Jawab
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Pertanyaan Yang Sering Diajukan
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
            Temukan jawaban cepat untuk pertanyaan umum mengenai penggunaan sistem informasi manajemen magang.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/80 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Smooth Answer Slide Down */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[300px] border-t border-slate-100 dark:border-slate-900/60" : "max-h-0"
                  } overflow-hidden`}
                >
                  <div className="p-6 bg-slate-50/50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
