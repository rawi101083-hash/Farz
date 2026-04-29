const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/  const isLocked = status === "نشط" && job\.applicants > 0;\n/g, '');
code = code.replace(/(const \[status, setStatus\] = useState[^;]+;)/, '$1\n  const isLocked = status === "نشط" && job.applicants > 0;');
fs.writeFileSync('src/App.tsx', code, 'utf8');
