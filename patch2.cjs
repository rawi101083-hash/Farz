const fs = require('fs');
let p = 'src/components/Dashboard.tsx';
let data = fs.readFileSync(p, 'utf8');

const searchStr = 'text-blue-600 dark:blue-300';
const replaceStr = 'text-blue-600 dark:text-blue-300';

if (data.includes(searchStr)) {
  data = data.replace(searchStr, replaceStr);
  fs.writeFileSync(p, data, 'utf8');
  console.log("Success");
} else {
  console.log("Not found");
}
