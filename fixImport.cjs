const fs = require('fs');

function fixImport(path) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/Linkedin,\r?\n} from "lucide-react";/, 'Linkedin,\n  Info,\n} from "lucide-react";');
  fs.writeFileSync(path, content, 'utf8');
}

fixImport('src/components/CreateJob.tsx');
console.log('Fixed CreateJob import!');
