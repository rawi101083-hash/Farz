const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /if \(firstRole\.salaryMin\) setSalaryMin\(firstRole\.salaryMin\);\s*if \(firstRole\.salaryMax\) setSalaryMax\(firstRole\.salaryMax\);\s*if \(firstRole\.isSalaryHidden !== undefined\) setIsSalaryHidden\(firstRole\.isSalaryHidden\);/;

code = code.replace(regex1, 'setSalaryMin(firstRole.salaryMin || "");\\n      setSalaryMax(firstRole.salaryMax || "");\\n      setIsSalaryHidden(firstRole.isSalaryHidden ?? false);\\n      setAskExpectedSalary(firstRole.askExpectedSalary ?? false);'.replace(/\\\\n/g, '\\n'));


const regex2 = /if \(role\.salaryMin\) setSalaryMin\(role\.salaryMin\);\s*if \(role\.salaryMax\) setSalaryMax\(role\.salaryMax\);\s*if \(role\.isSalaryHidden !== undefined\) setIsSalaryHidden\(role\.isSalaryHidden\);/;

code = code.replace(regex2, 'setSalaryMin(role.salaryMin || "");\\n    setSalaryMax(role.salaryMax || "");\\n    setIsSalaryHidden(role.isSalaryHidden ?? false);\\n    setAskExpectedSalary(role.askExpectedSalary ?? false);'.replace(/\\\\n/g, '\\n'));


fs.writeFileSync('src/App.tsx', code);
console.log("Fixed!");
