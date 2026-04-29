const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'src/App_test_1256.tsx');
const destPath = path.join(__dirname, 'src/Shared.tsx');

let sourceCode = fs.readFileSync(sourcePath, 'utf8');
let destCode = fs.readFileSync(destPath, 'utf8');

const marker = '// RESTORED COMPONENTS';
const markerIndex = destCode.indexOf(marker);

if (markerIndex !== -1) {
  destCode = destCode.substring(0, markerIndex);
}

const components = ['SettingsPage', 'ActiveJobs', 'FastScreening'];
let addedCode = '\n\n// RESTORED COMPONENTS\n';

for (const comp of components) {
  const declaration = `const ${comp} = `;
  const startIndex = sourceCode.indexOf(declaration);
  
  if (startIndex !== -1) {
    let nextCompIndex = sourceCode.length;
    const substr = sourceCode.substring(startIndex + declaration.length);
    // Find next top-level const or export default
    const match = substr.match(/\nconst [A-Z]|\nexport default|\nexport const/);
    if (match && match.index) {
      nextCompIndex = startIndex + declaration.length + match.index;
    }
    
    let compCode = sourceCode.substring(startIndex, nextCompIndex);
    compCode = compCode.replace(`const ${comp} = `, `export const ${comp} = `);
    addedCode += compCode + '\n';
    console.log(`Successfully added ${comp}`);
  }
}

fs.writeFileSync(destPath, destCode + addedCode, 'utf8');
console.log('Fixed Shared.tsx!');
