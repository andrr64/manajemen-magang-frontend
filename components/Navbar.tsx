"use client";

import { useState, useEffect } from "react";
import { Menu, X, GraduationCap, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 glass-card shadow-lg bg-white/80 dark:bg-slate-950/80"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Intern<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#beranda"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Beranda
            </a>
            <a
              href="#fitur"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Fitur
            </a>
            <a
              href="#peran"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Peran
            </a>
            <a
              href="#alur"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Alur Magang
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/login"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-4 py-2"
            >
              Masuk
            </a>
            <a
              href="#daftar"
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/25 px-5 py-2.5 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Registrasi
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[76px] transition-all duration-300 ease-in-out border-b border-slate-200 dark:border-slate-800 ${
          isOpen
            ? "opacity-100 translate-y-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xl visible"
            : "opacity-0 -translate-y-4 invisible pointer-events-none"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <a
            href="#beranda"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Beranda
          </a>
          <a
            href="#fitur"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Fitur
          </a>
          <a
            href="#peran"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Peran
          </a>
          <a
            href="#alur"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Alur Magang
          </a>
          <a
            href="#faq"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            FAQ
          </a>
          <div className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-900 flex flex-col gap-3 px-4">
            <a
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex justify-center items-center w-full py-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              Masuk
            </a>
            <a
              href="#daftar"
              onClick={() => setIsOpen(false)}
              className="flex justify-center items-center gap-1.5 w-full py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 transition-all shadow-md shadow-indigo-500/10"
            >
              Registrasi
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
