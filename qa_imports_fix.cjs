const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
if (!c.includes('import * as pdfjsLib')) {
  c = 'import * as pdfjsLib from "pdfjs-dist";\nimport { supabase } from "./lib/supabaseClient";\n' + c;
  fs.writeFileSync('src/App.tsx', c);
  console.log('Imports added!');
} else {
  console.log('Imports already exist');
}
