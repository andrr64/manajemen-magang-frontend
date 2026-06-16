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

  if (!content.includes('import { notifier }')) {
    content = 'import { notifier } from "@/modules/notifier";\n' + content;
    changed = true;
  }

  // Regex to find catch blocks that have setError
  // catch (err: any) {\n      setError(err.message || "Something");\n    }
  const catchRegex = /catch\s*\(([^)]+)\)\s*\{\s*(?:console\.error[^;]*;\s*)?setError\(([^)]+)\);/g;
  
  content = content.replace(catchRegex, (match, errName, setErrArg) => {
    changed = true;
    return `catch (${errName}) {
      const errMsg = ${setErrArg};
      notifier.error(errMsg);
      setError(errMsg);`;
  });

  // Also replace some catch blocks that just throw but do set error
  // catch (err: any) {\n      const msg = err.message || "X";\n      setError(msg);\n      throw new Error(msg);\n    }
  const catchThrowRegex = /catch\s*\(([^)]+)\)\s*\{([\s\S]*?)setError\(([^)]+)\);([\s\S]*?)throw\s+new\s+Error\(([^)]+)\);/g;
  content = content.replace(catchThrowRegex, (match, errName, beforeSet, setErrArg, beforeThrow, throwArg) => {
    if (match.includes('notifier.error')) return match; // already injected
    changed = true;
    return `catch (${errName}) {${beforeSet}notifier.error(${setErrArg});
      setError(${setErrArg});${beforeThrow}throw new Error(${throwArg});`;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
});
