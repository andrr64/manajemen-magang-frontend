import fs from 'fs';
import path from 'path';

const modulesDir = path.join(process.cwd(), 'modules');

function traverseDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(traverseDir(file));
    } else if (file.endsWith('hooks.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = traverseDir(modulesDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // We look for patterns like: set...(res.data); \n return res.data;
  // Or just before the `return` or `finally` in an async block that has setIsSubmitting(true)

  const successReplacements = [
    // data_absensi
    { find: /setHistory\(prev => prev.map\(item => item.id === id \? res.data : item\)\);\n\s*return res.data;/g, 
      replace: 'setHistory(prev => prev.map(item => item.id === id ? res.data : item));\n      notifier.success("Verifikasi berhasil.");\n      return res.data;' },
    { find: /setHistory\(prev => prev.filter\(item => item.id !== id\)\);/g, 
      replace: 'setHistory(prev => prev.filter(item => item.id !== id));\n      notifier.success("Berhasil dihapus.");' },
    { find: /setResult\(res\.data\);\n\s*return res\.data;/g, 
      replace: 'setResult(res.data);\n      notifier.success("Absensi berhasil disubmit.");\n      return res.data;' },
    { find: /setHistory\(prev => \[res\.data, \.\.\.prev\]\);\n\s*return res\.data;/g, 
      replace: 'setHistory(prev => [res.data, ...prev]);\n      notifier.success("Check-in berhasil.");\n      return res.data;' },
    { find: /setHistory\(prev => prev\.map\(item => item\.date === res\.data\.date \? res\.data : item\)\);\n\s*return res\.data;/g, 
      replace: 'setHistory(prev => prev.map(item => item.date === res.data.date ? res.data : item));\n      notifier.success("Check-out berhasil.");\n      return res.data;' },

    // data_kegiatan
    { find: /setKegiatan\(res\.data\);\n\s*return res\.data;/g, 
      replace: 'setKegiatan(res.data);\n      notifier.success("Kegiatan berhasil.");\n      return res.data;' },
    { find: /setHistory\(prev => prev\.filter\(item => item\.id !== id\)\);/g, 
      replace: 'setHistory(prev => prev.filter(item => item.id !== id));\n      notifier.success("Berhasil dihapus.");' },
    { find: /setKegiatan\(prev => prev\.filter\(item => item\.id !== id\)\);/g, 
      replace: 'setKegiatan(prev => prev.filter(item => item.id !== id));\n      notifier.success("Berhasil dihapus.");' },
    { find: /const res = await kegiatanAPI\.verifyKegiatan\(id, status, feedback\);\n\s*return res\.data;/g, 
      replace: 'const res = await kegiatanAPI.verifyKegiatan(id, status, feedback);\n      notifier.success("Berhasil diverifikasi.");\n      return res.data;' },

    // data_mahasiswa
    { find: /const res = await mahasiswaAPI\.addStudent\(payload\);\n\s*setMahasiswa\(prev => \[\.\.\.prev, res\.data\]\);/g, 
      replace: 'const res = await mahasiswaAPI.addStudent(payload);\n      setMahasiswa(prev => [...prev, res.data]);\n      notifier.success("Mahasiswa berhasil ditambahkan.");' },
    { find: /setMahasiswa\(prev => prev\.map\(m => String\(m\.id\) === String\(id\) \? res\.data : m\)\);/g, 
      replace: 'setMahasiswa(prev => prev.map(m => String(m.id) === String(id) ? res.data : m));\n      notifier.success("Mahasiswa berhasil diperbarui.");' },
    { find: /setMahasiswa\(prev => prev\.filter\(m => String\(m\.id\) !== String\(id\)\)\);/g, 
      replace: 'setMahasiswa(prev => prev.filter(m => String(m.id) !== String(id)));\n      notifier.success("Berhasil dihapus.");' },

    // sertifikat
    { find: /const res = await sertifikatAPI\.submitSertifikat\(payload\);\n\s*setSertifikat\(prev => \[\.\.\.prev, res\.data\]\);\n\s*return res\.data;/g, 
      replace: 'const res = await sertifikatAPI.submitSertifikat(payload);\n      setSertifikat(prev => [...prev, res.data]);\n      notifier.success("Sertifikat berhasil disubmit.");\n      return res.data;' },
    { find: /const res = await sertifikatAPI\.verifySertifikat\(id, status, nilai, feedback\);\n\s*setSertifikat\(prev => prev\.map\(item => item\.id === id \? res\.data : item\)\);\n\s*return res\.data;/g, 
      replace: 'const res = await sertifikatAPI.verifySertifikat(id, status, nilai, feedback);\n      setSertifikat(prev => prev.map(item => item.id === id ? res.data : item));\n      notifier.success("Sertifikat berhasil diverifikasi.");\n      return res.data;' },

    // mentor
    { find: /const res = await mentorAPI\.addMentor\(payload\);\n\s*setMentors\(prev => \[\.\.\.prev, res\.data\]\);/g, 
      replace: 'const res = await mentorAPI.addMentor(payload);\n      setMentors(prev => [...prev, res.data]);\n      notifier.success("Mentor berhasil ditambahkan.");' },
    { find: /setMentors\(prev => prev\.filter\(m => String\(m\.id\) !== String\(id\)\)\);/g, 
      replace: 'setMentors(prev => prev.filter(m => String(m.id) !== String(id)));\n      notifier.success("Mentor berhasil dihapus.");' },
    { find: /setMentors\(prev => prev\.map\(m => String\(m\.id\) === String\(id\) \? res\.data : m\)\);/g, 
      replace: 'setMentors(prev => prev.map(m => String(m.id) === String(id) ? res.data : m));\n      notifier.success("Mentor berhasil diperbarui.");' },

    // penilaian
    { find: /const res = await penilaianAPI\.submitPenilaian\(payload\);\n\s*setHistory\(prev => \[\.\.\.prev, res\.data\]\);\n\s*return res\.data;/g, 
      replace: 'const res = await penilaianAPI.submitPenilaian(payload);\n      setHistory(prev => [...prev, res.data]);\n      notifier.success("Penilaian berhasil disubmit.");\n      return res.data;' },
    { find: /const res = await penilaianAPI\.updatePenilaian\(id, payload\);\n\s*setHistory\(prev => prev\.map\(item => String\(item\.id\) === String\(id\) \? res\.data : item\)\);\n\s*return res\.data;/g, 
      replace: 'const res = await penilaianAPI.updatePenilaian(id, payload);\n      setHistory(prev => prev.map(item => String(item.id) === String(id) ? res.data : item));\n      notifier.success("Penilaian berhasil diperbarui.");\n      return res.data;' }
  ];

  successReplacements.forEach(rep => {
    if (content.match(rep.find)) {
      content = content.replace(rep.find, rep.replace);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated success logic in ${file}`);
  }
});
