const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/<ManageJob([\s\S]*?)onDelete=\{([\s\S]*?)\}\s*\/>/m, `<ManageJob$1onDelete={$2}
                  onDuplicate={(job) => {
                    startJobCreation(job.recordType || "single", job);
                  }}
                />`);
fs.writeFileSync('src/App.tsx', code, 'utf8');
