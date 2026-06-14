const fs = require('fs');

function convertToDarkSidebar(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Change main background
  content = content.replace(/bg-white dark:bg-\[\#121358\]/g, 'bg-[#232F72] dark:bg-[#121358]');

  // Header border
  content = content.replace(/border-slate-200 dark:border-\[\#2F578A\]/g, 'border-[#2F578A]/50');

  // Texts
  content = content.replace(/text-\[\#232F72\] dark:text-\[\#FFFFFF\]/g, 'text-[#FFFFFF]');
  content = content.replace(/text-\[\#2F578A\] dark:text-\[\#36ADA3\]/g, 'text-[#36ADA3]');
  content = content.replace(/text-slate-400 dark:text-\[\#F1F5F9\]\/50/g, 'text-[#F1F5F9]/50');
  content = content.replace(/text-slate-400 dark:text-\[\#F1F5F9\]\/70/g, 'text-[#F1F5F9]/70');
  
  // Profile card bg
  content = content.replace(/bg-slate-50\/50 dark:bg-\[\#232F72\]\/30/g, 'bg-[#121358]/30');
  
  // Active links
  // Currently: isActive ? "bg-[#232F72] dark:bg-[#232F72] text-[#FFFFFF] shadow-md"
  // Needs to be: "bg-[#121358] text-[#FFFFFF] shadow-md"
  content = content.replace(/bg-\[\#232F72\] dark:bg-\[\#232F72\] text-\[\#FFFFFF\] shadow-md/g, 'bg-[#121358] text-[#FFFFFF] shadow-md');
  // Second case (if dark:bg was swapped to #121358 already)
  content = content.replace(/bg-\[\#232F72\] dark:bg-\[\#121358\] text-\[\#FFFFFF\] shadow-md/g, 'bg-[#121358] text-[#FFFFFF] shadow-md');

  // Inactive links
  content = content.replace(/text-\[\#2F578A\] dark:text-\[\#F1F5F9\]\/70/g, 'text-[#F1F5F9]/70');
  content = content.replace(/hover:bg-slate-100 dark:hover:bg-\[\#121358\]\/50/g, 'hover:bg-[#121358]/50');
  content = content.replace(/hover:text-\[\#232F72\] dark:hover:text-\[\#FFFFFF\]/g, 'hover:text-[#FFFFFF]');

  // Close button
  content = content.replace(/hover:bg-slate-100 dark:hover:bg-\[\#121358\]/g, 'hover:bg-[#121358]');

  // Teal leftovers if any
  content = content.replace(/text-\[\#36ADA3\]/g, 'text-[#36ADA3]'); // Brand text accent stays Teal

  // Fix up arrow icon
  content = content.replace(/ArrowLeftIcon/g, 'ArrowLeftIcon');

  fs.writeFileSync(file, content);
  console.log('Sidebar updated to Dark Primary pattern:', file);
}

convertToDarkSidebar('C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\components\\mentor-sidebar.tsx');
convertToDarkSidebar('C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\components\\mahasiswa-sidebar.tsx');
