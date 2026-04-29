const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/^(\s*)isSalaryHidden,\r?$/gm, '$1isSalaryHidden,\n$1askExpectedSalary,');

// Handle the ternary ones: isSalaryHidden: activeRole?.isSalaryHidden ?? job.isSalaryHidden,
c = c.replace(/^(\s*)isSalaryHidden: (.*?),\r?$/gm, (match, p1, p2) => {
    // If it's a condition like `activeRole?.isSalaryHidden ?? job.isSalaryHidden`
    // We can map it to askExpectedSalary automatically by replacing the strings
    let askP2 = p2.replace(/isSalaryHidden/g, 'askExpectedSalary');
    return `${p1}isSalaryHidden: ${p2},\n${p1}askExpectedSalary: ${askP2},`;
});

fs.writeFileSync('src/App.tsx', c);
