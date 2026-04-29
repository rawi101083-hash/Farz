const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'src/App_test_1256.tsx');
const destPath = path.join(__dirname, 'src/Shared.tsx');

const sourceCode = fs.readFileSync(sourcePath, 'utf8');
let destCode = fs.readFileSync(destPath, 'utf8');

// First remove the broken "// RESTORED COMPONENTS" block
const restoreMarker = '// RESTORED COMPONENTS';
const markerIndex = destCode.indexOf(restoreMarker);
if (markerIndex !== -1) {
  destCode = destCode.substring(0, markerIndex);
}

const componentsToExtract = [
  'EmptyState',
  'TalentPoolModal',
  'TalentPool',
  'GlobalJobSelector',
  'SettingsPage',
  'ActiveJobs',
  'FastScreening'
];

let addedCode = '\n\n// RESTORED COMPONENTS\n';

for (const comp of componentsToExtract) {
  // if it's already in destCode, skip
  if (destCode.includes(`export const ${comp} =`)) {
    console.log(`${comp} already exists`);
    continue;
  }
  
  const declaration = `const ${comp} = `;
  let startIndex = sourceCode.indexOf(declaration);
  if (startIndex === -1) {
    console.log(`Could not find ${comp}`);
    continue;
  }
  
  // Find the end of the component.
  // Instead of simple bracket matching which fails on `=> (`,
  // let's look for the START of the next component.
  // We can search for `\nconst [A-Z]` or `export default`
  
  let nextCompIndex = sourceCode.length;
  const match = sourceCode.substring(startIndex + declaration.length).match(/\nconst [A-Z]|\nexport default|\nexport const/);
  if (match && match.index) {
    nextCompIndex = startIndex + declaration.length + match.index;
  }
  
  let compCode = sourceCode.substring(startIndex, nextCompIndex);
  
  // Change 'const ' to 'export const '
  compCode = compCode.replace(`const ${comp} = `, `export const ${comp} = `);
  addedCode += compCode + '\n';
  console.log(`Extracted ${comp}`);
}

fs.writeFileSync(destPath, destCode + addedCode, 'utf8');
console.log('Restoration complete v2!');
