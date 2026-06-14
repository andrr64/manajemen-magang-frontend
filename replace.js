const fs = require('fs');
const file = 'C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\app\\dashboard\\mentor\\layout.tsx';
let content = fs.readFileSync(file, 'utf8');

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

content = content.replace(/text-slate-900 dark:text-white/g, 'text-[#121358] dark:text-[#FFFFFF]');
content = content.replace(/text-slate-800 dark:text-white/g, 'text-[#121358] dark:text-[#FFFFFF]');
content = content.replace(/text-slate-800 dark:text-slate-200/g, 'text-[#121358] dark:text-[#F1F5F9]');
content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-[#2F578A] dark:text-[#F1F5F9]/70');
content = content.replace(/text-slate-400 dark:text-slate-500/g, 'text-[#2F578A]/80 dark:text-[#F1F5F9]/50');
content = content.replace(/text-slate-600 dark:text-slate-400/g, 'text-[#2F578A] dark:text-[#F1F5F9]/80');
content = content.replace(/text-slate-700 dark:text-slate-300/g, 'text-[#121358]/80 dark:text-[#F1F5F9]');
content = content.replace(/text-slate-400/g, 'text-[#2F578A]/80 dark:text-[#F1F5F9]/50');
content = content.replace(/text-slate-600/g, 'text-[#2F578A]');

content = content.replace(/bg-slate-50 dark:bg-slate-900\/60/g, 'bg-[#F1F5F9] dark:bg-[#121358]');
content = content.replace(/bg-slate-50 dark:bg-slate-900\/70/g, 'bg-[#F1F5F9] dark:bg-[#121358]');
content = content.replace(/bg-slate-50 dark:bg-slate-900\/40/g, 'bg-[#F1F5F9] dark:bg-[#121358]/80');
content = content.replace(/bg-slate-50 dark:bg-slate-900/g, 'bg-[#F8FAFC] dark:bg-[#121358]');
content = content.replace(/bg-slate-100 dark:bg-slate-900/g, 'bg-[#F1F5F9] dark:bg-[#121358]');
content = content.replace(/bg-slate-100 dark:bg-slate-800/g, 'bg-[#F1F5F9] dark:bg-[#121358]');
content = content.replace(/hover:bg-slate-50\/70 dark:hover:bg-slate-900\/30/g, 'hover:bg-[#F8FAFC]/50 dark:hover:bg-[#121358]/50');
content = content.replace(/hover:bg-slate-50 dark:hover:bg-slate-900/g, 'hover:bg-[#F8FAFC] dark:hover:bg-[#121358]');
content = content.replace(/bg-slate-100/g, 'bg-[#F1F5F9]');
content = content.replace(/hover:bg-slate-200/g, 'hover:bg-[#E2E8F0]');
content = content.replace(/bg-slate-900\/60 dark:bg-slate-950\/80/g, 'bg-slate-900/60 dark:bg-[#121358]/80');

content = content.replace(/text-indigo-600 dark:text-indigo-400/g, 'text-[#36ADA3]');
content = content.replace(/text-indigo-600/g, 'text-[#36ADA3]');
content = content.replace(/text-indigo-500 dark:text-indigo-400/g, 'text-[#36ADA3]');
content = content.replace(/text-indigo-500/g, 'text-[#36ADA3]');
content = content.replace(/bg-indigo-50 dark:bg-indigo-950\/40/g, 'bg-[#F8FAFC] dark:bg-[#121358]');
content = content.replace(/bg-indigo-50 dark:bg-indigo-950\/30/g, 'bg-[#F8FAFC] dark:bg-[#121358]');
content = content.replace(/bg-indigo-50 dark:bg-indigo-950/g, 'bg-[#F8FAFC] dark:bg-[#121358]');
content = content.replace(/border-indigo-200\/35/g, 'border-[#2F578A]/30');
content = content.replace(/border-indigo-200\/50 dark:border-indigo-900\/40/g, 'border-[#2F578A]/30');
content = content.replace(/border-indigo-200\/50 dark:border-indigo-900\/50/g, 'border-[#2F578A]/30');
content = content.replace(/border-indigo-200\/40 dark:border-indigo-900\/40/g, 'border-[#2F578A]/30');
content = content.replace(/border-indigo-200\/30 dark:border-indigo-900\/30/g, 'border-[#2F578A]/30');

content = content.replace(/focus:border-indigo-500/g, 'focus:border-[#36ADA3]');
content = content.replace(/hover:border-indigo-500/g, 'hover:border-[#36ADA3]');
content = content.replace(/bg-indigo-600 hover:bg-indigo-550/g, 'bg-[#36ADA3] hover:brightness-110 shadow-[0_0_15px_rgba(54,173,163,0.3)]');
content = content.replace(/bg-indigo-600 hover:bg-indigo-500/g, 'bg-[#36ADA3] hover:brightness-110 shadow-[0_0_15px_rgba(54,173,163,0.3)]');
content = content.replace(/bg-indigo-600 text-white/g, 'bg-[#36ADA3] text-[#FFFFFF]');
content = content.replace(/border-indigo-600/g, 'border-[#36ADA3]');
content = content.replace(/bg-indigo-600/g, 'bg-[#36ADA3]');
content = content.replace(/bg-indigo-50/g, 'bg-[#F1F5F9]');
content = content.replace(/dark:bg-indigo-950\/40/g, 'dark:bg-[#121358]/40');
content = content.replace(/dark:bg-indigo-950\/30/g, 'dark:bg-[#121358]/30');
content = content.replace(/dark:bg-indigo-950/g, 'dark:bg-[#121358]');
content = content.replace(/bg-indigo-500\/10/g, 'bg-[#36ADA3]/10');

content = content.replace(/hover:text-indigo-600 dark:hover:text-indigo-400/g, 'hover:text-[#36ADA3] dark:hover:text-[#36ADA3]');
content = content.replace(/hover:text-indigo-600/g, 'hover:text-[#36ADA3]');
content = content.replace(/group-hover:text-indigo-600 dark:group-hover:text-indigo-400/g, 'group-hover:text-[#36ADA3] dark:group-hover:text-[#36ADA3]');
content = content.replace(/shadow-indigo-600\/10/g, 'shadow-[#36ADA3]/20');
content = content.replace(/shadow-indigo-600\/20/g, 'shadow-[#36ADA3]/30');
content = content.replace(/shadow-indigo-500\/10/g, 'shadow-[#36ADA3]/10');
content = content.replace(/disabled:bg-indigo-500\/70/g, 'disabled:bg-[#36ADA3]/70');
content = content.replace(/hover:bg-indigo-600 dark:hover:bg-indigo-500/g, 'hover:bg-[#36ADA3] dark:hover:bg-[#36ADA3]');
content = content.replace(/hover:bg-indigo-600/g, 'hover:bg-[#36ADA3]');
content = content.replace(/hover:bg-indigo-100 dark:hover:bg-indigo-900/g, 'hover:bg-[#F1F5F9] dark:hover:bg-[#232F72]');
content = content.replace(/hover:bg-indigo-100/g, 'hover:bg-[#F1F5F9]');
content = content.replace(/dark:hover:bg-indigo-950/g, 'dark:hover:bg-[#121358]');

fs.writeFileSync(file, content);
console.log('done layout update');
