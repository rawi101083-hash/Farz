const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
const replacement = fs.readFileSync('replacement.txt', 'utf-8');

const startIndex = content.indexOf('            ) : (\n              <>\n                {job.recordType !== "campaign"');
const endIndex = content.indexOf('              </>\n            )}\n          </div>\n        </motion.div>');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex + 19); 
  fs.writeFileSync('src/App.tsx', content);
  console.log('Replaced successfully');
} else {
  console.log('Indexes not found', startIndex, endIndex);
}
