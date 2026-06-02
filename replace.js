const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      // Exclude node_modules, .git, .next
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      // Only text files
      if (
        file.endsWith('.ts') ||
        file.endsWith('.tsx') ||
        file.endsWith('.json') ||
        file.endsWith('.md') ||
        file.endsWith('.env')
      ) {
        results.push(file);
      }
    }
  });
  return results;
};

const replaceInFiles = () => {
  const files = walk(path.join(__dirname, 'src')).concat([
    path.join(__dirname, 'package.json'),
    path.join(__dirname, 'README.md'),
    path.join(__dirname, 'components.json')
  ]);

  files.forEach((file) => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace domains first
    content = content.replace(/auiso\.tv/g, 'aiuiso.site');
    content = content.replace(/auiso\.com/g, 'aiuiso.site');
    
    // Replace names (case-sensitive to match properly)
    content = content.replace(/Auiso/g, 'Aiuiso');
    content = content.replace(/auiso/g, 'aiuiso');
    content = content.replace(/AUISO/g, 'AIUISO');

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated: ${file}`);
    }
  });
};

replaceInFiles();
console.log("Done.");
