const fs = require('fs');
const file = 'C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\components\\mahasiswa-sidebar.tsx';
if (!fs.existsSync(file)) {
  console.log('File does not exist');
  process.exit(0);
}
let content = fs.readFileSync(file, 'utf8');

// Base Palette Replacements
content = content.replace(/dark:bg-\[\#070e24\]\/40/g, 'dark:bg-[#232F72]/40 dark:backdrop-blur-md');
content = content.replace(/dark:bg-\[\#070e24\]/g, 'dark:bg-[#232F72]');

content = content.replace(/dark:border-slate-800\/80/g, 'dark:border-[#2F578A]');
content = content.replace(/dark:border-slate-800\/60/g, 'dark:border-[#2F578A]/80');
content = content.replace(/dark:border-slate-800/g, 'dark:border-[#2F578A]');
content = content.replace(/border-slate-200\/50/g, 'border-[#2F578A]/30');
content = content.replace(/border-slate-200\/60/g, 'border-[#2F578A]/30');
content = content.replace(/border-slate-200/g, 'border-[#2F578A]/50');
content = content.replace(/dark:divide-slate-800\/60/g, 'dark:divide-[#2F578A]/50');
content = content.replace(/divide-slate-100/g, 'divide-[#2F578A]/30');
content = content.replace(/border-slate-100/g, 'border-[#2F578A]/30');

// Use Primary color #232F72 instead of #121358 for light text based on new rule
content = content.replace(/text-slate-900 dark:text-white/g, 'text-[#232F72] dark:text-[#FFFFFF]');
content = content.replace(/text-slate-800 dark:text-white/g, 'text-[#232F72] dark:text-[#FFFFFF]');
content = content.replace(/text-slate-800 dark:text-slate-200/g, 'text-[#232F72] dark:text-[#F1F5F9]');
content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-[#2F578A] dark:text-[#F1F5F9]/70');
content = content.replace(/text-slate-400 dark:text-slate-500/g, 'text-[#2F578A]/80 dark:text-[#F1F5F9]/50');
content = content.replace(/text-slate-600 dark:text-slate-400/g, 'text-[#2F578A] dark:text-[#F1F5F9]/80');
content = content.replace(/text-slate-700 dark:text-slate-300/g, 'text-[#232F72]/80 dark:text-[#F1F5F9]');
content = content.replace(/text-slate-400/g, 'text-[#2F578A]/80 dark:text-[#F1F5F9]/50');
content = content.replace(/text-slate-600/g, 'text-[#2F578A]');
content = content.replace(/text-slate-500/g, 'text-[#2F578A]');
content = content.replace(/text-slate-800/g, 'text-[#232F72]');

content = content.replace(/bg-slate-50 dark:bg-slate-900\/60/g, 'bg-[#F1F5F9] dark:bg-[#121358]');
content = content.replace(/bg-slate-50 dark:bg-slate-900\/70/g, 'bg-[#F1F5F9] dark:bg-[#121358]');
content = content.replace(/bg-slate-50 dark:bg-slate-900\/40/g, 'bg-[#F1F5F9] dark:bg-[#121358]/80');
content = content.replace(/bg-slate-50 dark:bg-slate-900/g, 'bg-[#F8FAFC] dark:bg-[#121358]');
content = content.replace(/bg-slate-100 dark:bg-slate-900/g, 'bg-[#F1F5F9] dark:bg-[#121358]');
content = content.replace(/bg-slate-100 dark:bg-slate-800/g, 'bg-[#F1F5F9] dark:bg-[#121358]');
content = content.replace(/bg-slate-100\/50 dark:bg-slate-800\/50/g, 'bg-[#F1F5F9]/50 dark:bg-[#121358]/50');
content = content.replace(/bg-slate-800\/50/g, 'bg-[#121358]/50');
content = content.replace(/hover:bg-slate-50\/70 dark:hover:bg-slate-900\/30/g, 'hover:bg-[#F8FAFC]/50 dark:hover:bg-[#121358]/50');
content = content.replace(/hover:bg-slate-50 dark:hover:bg-slate-900/g, 'hover:bg-[#F8FAFC] dark:hover:bg-[#121358]');
content = content.replace(/bg-slate-100/g, 'bg-[#F1F5F9]');
content = content.replace(/hover:bg-slate-100/g, 'hover:bg-[#F1F5F9]');
content = content.replace(/hover:bg-slate-200/g, 'hover:bg-[#E2E8F0]');
content = content.replace(/bg-slate-900\/60 dark:bg-slate-950\/80/g, 'bg-[#121358]/60 dark:bg-[#121358]/80');
content = content.replace(/bg-slate-900\/60/g, 'bg-[#121358]/60');

// Indigo to Primary
content = content.replace(/text-indigo-600 dark:text-indigo-400/g, 'text-[#232F72] dark:text-[#FFFFFF]');
content = content.replace(/text-indigo-600/g, 'text-[#232F72] dark:text-[#FFFFFF]');
content = content.replace(/text-indigo-500 dark:text-indigo-400/g, 'text-[#232F72] dark:text-[#FFFFFF]');
content = content.replace(/text-indigo-500/g, 'text-[#232F72] dark:text-[#FFFFFF]');
content = content.replace(/bg-indigo-50 dark:bg-indigo-950\/40/g, 'bg-[#F8FAFC] dark:bg-[#121358]');
content = content.replace(/bg-indigo-50 dark:bg-indigo-950\/30/g, 'bg-[#F8FAFC] dark:bg-[#121358]');
content = content.replace(/bg-indigo-50 dark:bg-indigo-950/g, 'bg-[#F8FAFC] dark:bg-[#121358]');
content = content.replace(/border-indigo-200\/35/g, 'border-[#2F578A]/30');
content = content.replace(/border-indigo-200\/50 dark:border-indigo-900\/40/g, 'border-[#2F578A]/30');
content = content.replace(/border-indigo-200\/50 dark:border-indigo-900\/50/g, 'border-[#2F578A]/30');
content = content.replace(/border-indigo-200\/40 dark:border-indigo-900\/40/g, 'border-[#2F578A]/30');
content = content.replace(/border-indigo-200\/30 dark:border-indigo-900\/30/g, 'border-[#2F578A]/30');

content = content.replace(/focus:border-indigo-500/g, 'focus:border-[#232F72]');
content = content.replace(/hover:border-indigo-500/g, 'hover:border-[#232F72]');
content = content.replace(/bg-indigo-600 hover:bg-indigo-550/g, 'bg-[#232F72] dark:bg-[#121358] hover:opacity-90 shadow-md');
content = content.replace(/bg-indigo-600 hover:bg-indigo-500/g, 'bg-[#232F72] dark:bg-[#121358] hover:opacity-90 shadow-md');
content = content.replace(/bg-indigo-600 text-white/g, 'bg-[#232F72] dark:bg-[#121358] text-[#FFFFFF]');
content = content.replace(/border-indigo-600/g, 'border-[#232F72] dark:border-[#121358]');
content = content.replace(/bg-indigo-600/g, 'bg-[#232F72] dark:bg-[#121358]');
content = content.replace(/bg-indigo-50/g, 'bg-[#F1F5F9]');
content = content.replace(/dark:bg-indigo-950\/40/g, 'dark:bg-[#121358]/40');
content = content.replace(/dark:bg-indigo-950\/30/g, 'dark:bg-[#121358]/30');
content = content.replace(/dark:bg-indigo-950/g, 'dark:bg-[#121358]');
content = content.replace(/bg-indigo-500\/10/g, 'bg-[#232F72]/10');

content = content.replace(/hover:text-indigo-600 dark:hover:text-indigo-400/g, 'hover:text-[#232F72] dark:hover:text-[#FFFFFF]');
content = content.replace(/hover:text-indigo-600/g, 'hover:text-[#232F72]');
content = content.replace(/group-hover:text-indigo-600 dark:group-hover:text-indigo-400/g, 'group-hover:text-[#232F72] dark:group-hover:text-[#FFFFFF]');
content = content.replace(/dark:group-hover:text-indigo-400/g, 'dark:group-hover:text-[#FFFFFF]');
content = content.replace(/shadow-indigo-600\/10/g, 'shadow-md');
content = content.replace(/shadow-indigo-600\/20/g, 'shadow-md');
content = content.replace(/shadow-indigo-500\/10/g, 'shadow-sm');
content = content.replace(/disabled:bg-indigo-500\/70/g, 'disabled:bg-[#232F72]/70');
content = content.replace(/hover:bg-indigo-600 dark:hover:bg-indigo-500/g, 'hover:bg-[#232F72] dark:hover:bg-[#121358]');
content = content.replace(/hover:bg-indigo-600/g, 'hover:bg-[#232F72]');
content = content.replace(/hover:bg-indigo-100 dark:hover:bg-indigo-900/g, 'hover:bg-[#F1F5F9] dark:hover:bg-[#232F72]');
content = content.replace(/hover:bg-indigo-100/g, 'hover:bg-[#F1F5F9]');
content = content.replace(/dark:hover:bg-indigo-950/g, 'dark:hover:bg-[#121358]');
content = content.replace(/from-indigo-600/g, 'from-[#2F578A]');
content = content.replace(/to-indigo-500/g, 'to-[#232F72]');
content = content.replace(/from-indigo-500/g, 'from-[#2F578A]');
content = content.replace(/to-indigo-400/g, 'to-[#232F72]');
content = content.replace(/from-indigo-400/g, 'from-[#232F72]');

// For Sidebar Active state (Make it full primary as previously requested)
content = content.replace(/bg-\[\#36ADA3\] text-\[\#FFFFFF\] shadow-\[0_0_15px_rgba\(54,173,163,0\.3\)\]/g, 'bg-[#232F72] dark:bg-[#121358] text-[#FFFFFF] shadow-md');

fs.writeFileSync(file, content);
console.log('done mahasiswa sidebar update');
