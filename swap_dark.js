const fs = require('fs');
const path = require('path');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile() && filePath.endsWith('.tsx')) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // We want to SWAP #121358 and #232F72 ONLY IN DARK MODE BACKGROUNDS.
    // Wait, the easiest way to swap two strings without collision is a temporary placeholder.
    
    content = content.replace(/dark:bg-\[\#121358\]/g, 'dark:bg-TEMP_PRIMARY');
    content = content.replace(/dark:bg-\[\#232F72\]/g, 'dark:bg-TEMP_SECONDARY');
    
    content = content.replace(/dark:bg-TEMP_PRIMARY/g, 'dark:bg-[#232F72]');
    content = content.replace(/dark:bg-TEMP_SECONDARY/g, 'dark:bg-[#121358]');

    // Also swap border and text if any use #121358 vs #232F72 in dark mode?
    // Actually, buttons are currently bg-[#232F72] in dark mode or bg-[#121358].
    // Let's just swap the exact bg colors for dark mode since that fixes the layout hierarchy.
    
    if (original !== content) {
        fs.writeFileSync(filePath, content);
        console.log('Swapped dark mode bg in ' + filePath);
    }
}

// Process layout.tsx
processFile('C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\app\\layout.tsx');

// Process all dashboard files
walkSync('C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\app\\dashboard', processFile);

// Process sidebars
processFile('C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\components\\mentor-sidebar.tsx');
processFile('C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\components\\mahasiswa-sidebar.tsx');

console.log('Global dark mode bg swap completed');
