const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

const t = `<p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      (يُقبل ملفات PDF و DOCX فقط)
                    </p>`;

const r = `<p className="text-xs text-red-500 font-extrabold mb-2 bg-red-500/10 inline-block px-3 py-1 rounded-lg border border-red-500/20">
                      (يُقبل ملفات PDF و DOCX فقط)
                    </p>`;

if (c.includes(t)) {
  c = c.replace(t, r);
  fs.writeFileSync('src/App.tsx', c);
  console.log("Visual text updated successfully.");
} else {
  console.log("Could not find the text!");
}
