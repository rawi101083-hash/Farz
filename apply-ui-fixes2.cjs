const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = 'const showRoleForm = createJobType === "single" || createJobType === "quick_link" || isAddingRole || editingRoleId !== null || roles.length === 0;';
const replaceStr = 'const showRoleForm = adType === "single" || createJobType === "quick_link" || isAddingRole || editingRoleId !== null || roles.length === 0;';

if(content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Success");
} else {
    console.log("Target string not found");
}
