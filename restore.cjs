const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'src/App_test_1256.tsx');
const destPath = path.join(__dirname, 'src/Shared.tsx');

const sourceCode = fs.readFileSync(sourcePath, 'utf8');
let destCode = fs.readFileSync(destPath, 'utf8');

const componentsToExtract = [
  'ImageLightbox',
  'EmptyState',
  'LogoIcon',
  'TalentPoolModal',
  'TalentPool',
  'GlobalJobSelector',
  'SettingsPage',
  'ActiveJobs',
  'FastScreening'
];

let addedCode = '\n\n// RESTORED COMPONENTS\n';

for (const comp of componentsToExtract) {
  const declaration = `const ${comp} = `;
  let startIndex = sourceCode.indexOf(declaration);
  if (startIndex === -1) {
    console.log(`Could not find ${comp}`);
    continue;
  }
  
  // Find the end of the component
  // It should be a matching brace or parenthesis.
  // We will find the first '{' or '(' after the declaration, then match brackets until it returns to 0.
  let openBrackets = 0;
  let started = false;
  let endIndex = -1;
  
  for (let i = startIndex; i < sourceCode.length; i++) {
    const char = sourceCode[i];
    if (char === '{' || char === '(') {
      openBrackets++;
      started = true;
    } else if (char === '}' || char === ')') {
      openBrackets--;
    }
    
    if (started && openBrackets === 0) {
      endIndex = i;
      break;
    }
  }
  
  if (endIndex !== -1) {
    let compCode = sourceCode.substring(startIndex, endIndex + 1);
    // some components have a semi-colon after them
    if (sourceCode[endIndex + 1] === ';') {
      compCode += ';';
    }
    // Change 'const ' to 'export const '
    compCode = compCode.replace(`const ${comp} = `, `export const ${comp} = `);
    addedCode += compCode + '\n\n';
    console.log(`Extracted ${comp}`);
  }
}

// Append to Shared.tsx
fs.writeFileSync(destPath, destCode + addedCode, 'utf8');
console.log('Restoration complete!');
