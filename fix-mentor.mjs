import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const files = walkSync(path.join(__dirname, 'app', 'dashboard', 'mentor'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix .name.split
  content = content.replace(/([a-zA-Z0-9_]+)\.name\.split\(" "\)/g, "($1?.name || \"U\").split(\" \")");
  
  // Fix .studentName.split
  content = content.replace(/([a-zA-Z0-9_]+)\.studentName\.split\(" "\)/g, "($1?.studentName || \"U\").split(\" \")");
  
  // Fix .phone.replace
  content = content.replace(/([a-zA-Z0-9_]+)\.phone\.replace\(\/\[\^0-9\+\]\/g, ''\)/g, "($1?.phone || \"\").replace(/[^0-9+]/g, '')");

  // Fix .map iterations
  // Replaces: arrayName.map -> arrayName?.map
  const arrayNames = [
    "filteredStudents", "studentsList", "dummyLogbooks", "attendanceLogs", "filteredLogs",
    "activities", "filteredActivities", "certificates", "filteredCertificates", 
    "letters", "filteredLetters", "comments", "assessmentCriteria", "uniqueUniversities",
    "pagedStudents", "universitasList", "filteredPeriods"
  ];
  
  for (const arr of arrayNames) {
    const regex = new RegExp(`\\b${arr}\\.map\\(`, "g");
    content = content.replace(regex, `${arr}?.map(`);
  }

  // Fix attendance properties
  const attendanceProps = ["present", "sick", "leave", "absent"];
  for (const prop of attendanceProps) {
    const regex = new RegExp(`student\\.attendance\\.${prop}`, "g");
    content = content.replace(regex, `(student?.attendance?.${prop} || 0)`);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed: ${file}`);
  }
}
