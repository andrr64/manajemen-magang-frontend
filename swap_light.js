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

walkSync('C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\app\\dashboard\\mentor', function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace light mode texts and bgs
    content = content.replace(/text-\[\#121358\]/g, 'text-[#232F72]');
    
    if (original !== content) {
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + filePath);
    }
});

// Also update sidebar
const sidebar = 'C:\\Users\\LENOVO1\\Documents\\PROJECT SKRIPSI\\manajemen-magang\\components\\mentor-sidebar.tsx';
if (fs.existsSync(sidebar)) {
    let content = fs.readFileSync(sidebar, 'utf8');
    content = content.replace(/text-\[\#121358\]/g, 'text-[#232F72]');
    fs.writeFileSync(sidebar, content);
    console.log('Updated sidebar');
}

console.log('Done swapping light mode texts');
