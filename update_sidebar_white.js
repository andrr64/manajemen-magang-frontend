const fs = require('fs');

function revertToWhiteSidebar(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Change main background
  content = content.replace(/bg-\[\#232F72\] dark:bg-\[\#121358\]/g, 'bg-white dark:bg-[#121358]');

  // Header border
  content = content.replace(/border-\[\#2F578A\]\/50/g, 'border-slate-200 dark:border-[#2F578A]');

  // Inactive links
  content = content.replace(/text-\[\#F1F5F9\]\/70 hover:bg-\[\#121358\]\/50 hover:text-\[\#FFFFFF\]/g, 'text-[#2F578A] dark:text-[#F1F5F9]/70 hover:bg-slate-100 dark:hover:bg-[#121358]/50 hover:text-[#232F72] dark:hover:text-[#FFFFFF]');

  // Active links ("bubble")
  // Make sure it uses #232F72 (Primary)
  content = content.replace(/bg-\[\#121358\] text-\[\#FFFFFF\] shadow-md/g, 'bg-[#232F72] text-[#FFFFFF] shadow-md');

  // Profile card bg
  content = content.replace(/bg-\[\#121358\]\/30/g, 'bg-slate-50/50 dark:bg-[#232F72]/30');

  // Specific Texts
  content = content.replace(/text-\[\#FFFFFF\] truncate/g, 'text-[#232F72] dark:text-[#FFFFFF] truncate');
  content = content.replace(/text-\[\#36ADA3\] font-semibold truncate/g, 'text-[#2F578A] dark:text-[#36ADA3] font-semibold truncate');
  content = content.replace(/text-\[\#F1F5F9\]\/50 truncate/g, 'text-slate-400 dark:text-[#F1F5F9]/50 truncate');
  
  // Brand Header
  content = content.replace(/text-\[\#FFFFFF\]\n            Intern<span className="text-\[\#36ADA3\]">Flow/g, 'text-[#232F72] dark:text-[#FFFFFF]\n            Intern<span className="text-[#36ADA3]">Flow');
  
  // Mobile close button
  content = content.replace(/text-\[\#F1F5F9\]\/70 hover:bg-\[\#121358\] md:hidden/g, 'text-slate-400 dark:text-[#F1F5F9]/70 hover:bg-slate-100 dark:hover:bg-[#121358] md:hidden');

  // Bottom Actions
  content = content.replace(/text-\[\#F1F5F9\]\/70 hover:bg-\[\#121358\]\/50 hover:text-\[\#FFFFFF\] transition-colors/g, 'text-[#2F578A] dark:text-[#F1F5F9]/70 hover:bg-slate-100 dark:hover:bg-[#121358]/50 hover:text-[#232F72] dark:hover:text-[#FFFFFF] transition-colors');

  fs.writeFileSync(file, content);
  console.log('Sidebar updated to White Primary pattern:', file);
}

revertToWhiteSidebar('C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\components\\mentor-sidebar.tsx');
revertToWhiteSidebar('C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\components\\mahasiswa-sidebar.tsx');
