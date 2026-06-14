const fs = require('fs');

['C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\components\\mentor-sidebar.tsx', 
 'C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\components\\mahasiswa-sidebar.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-\[\#FFFFFF\]\">\s*Intern<span className="text-\[\#36ADA3\]">Flow/g, 'text-[#232F72] dark:text-[#FFFFFF]">\n            Intern<span className="text-[#36ADA3]">Flow');
  fs.writeFileSync(file, content);
  console.log('Fixed header text in ' + file);
});
