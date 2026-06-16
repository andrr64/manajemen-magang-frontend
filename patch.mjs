import fs from 'fs';
import path from 'path';

// 1. Put back the Toaster to app/layout.tsx
const layoutPath = 'app/layout.tsx';
let layoutCode = fs.readFileSync(layoutPath, 'utf8');
if (!layoutCode.includes('react-hot-toast')) {
  layoutCode = layoutCode.replace(
    'import "./globals.css";',
    'import { Toaster } from "react-hot-toast";\nimport "./globals.css";'
  );
  layoutCode = layoutCode.replace(
    '{children}',
    '<Toaster />\n        {children}'
  );
  fs.writeFileSync(layoutPath, layoutCode, 'utf8');
}

// 2. Process all other hooks
const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    } else {
      if (file === 'hooks.ts') {
        filelist.push(dir + '/' + file);
      }
    }
  });
  return filelist;
};

const hookFiles = walkSync('modules', []);

for (const file of hookFiles) {
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes('notifier')) continue;

  let hasChanges = false;

  // Add import
  const importStatement = 'import { notifier } from "@/modules/notifier";\n';
  code = importStatement + code;

  // Just blindly insert notifier.error before setError(errMsg);
  // Actually, we can just search for `setError(` and if it's inside a catch block, we can add notifier.error
  // Let's just do a simple replace: `setError(errMsg);` -> `notifier.error(errMsg); setError(errMsg);`
  // But the variable name might be `err.message || ...`
  // Let's find: `setError(err.message || "` and `setError(errMsg);`
  code = code.replace(/setError\((.*?)\);/g, (match, p1) => {
    // skip null resets
    if (p1 === 'null') return match;
    hasChanges = true;
    return "notifier.error(" + p1 + ");\n      " + match;
  });

  // Success injections for mutations (rough heuristics)
  code = code.replace(/setStudents\(prev => \[response\.data, \.\.\.prev\]\);/g, 
    'setStudents(prev => [response.data, ...prev]);\n      notifier.success("Data berhasil ditambahkan!");');
  code = code.replace(/setStudents\(prev => prev\.map\(s => String\(s\.id\) === String\(id\) \? response\.data : s\)\);/g, 
    'setStudents(prev => prev.map(s => String(s.id) === String(id) ? response.data : s));\n      notifier.success("Data berhasil diperbarui!");');
  code = code.replace(/setActivities\(prev => \[response\.data, \.\.\.prev\]\);/g,
    'setActivities(prev => [response.data, ...prev]);\n      notifier.success("Kegiatan berhasil ditambahkan!");');
  code = code.replace(/setActivities\(prev => prev\.filter\(a => String\(a\.id\) !== String\(activityId\)\)\);/g,
    'setActivities(prev => prev.filter(a => String(a.id) !== String(activityId)));\n      notifier.success("Kegiatan berhasil dihapus!");');

  // specific for iam
  if (file.includes('iam')) {
    code = code.replace(/store\.setUser\(response\.data\);/g, 'store.setUser(response.data);\n      notifier.success("Berhasil!");');
    code = code.replace(/await iamAPI\.logout\(\);/g, 'await iamAPI.logout();\n      notifier.success("Berhasil logout!");');
  }

  fs.writeFileSync(file, code, 'utf8');
}
console.log("Hooks patched.");
