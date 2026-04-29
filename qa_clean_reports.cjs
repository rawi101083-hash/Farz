const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/value: filterId === "all" \? 45 : 12/g, 'value: 0');
c = c.replace(/value: filterId === "all" \? 30 : 8/g, 'value: 0');
c = c.replace(/value: filterId === "all" \? 15 : 5/g, 'value: 0');
c = c.replace(/value: filterId === "all" \? 10 : 2/g, 'value: 0');

c = c.replace(/value: filterId === "all" \? 1200 : 350/g, 'value: 0');
c = c.replace(/value: filterId === "all" \? 400 : 120/g, 'value: 0');
c = c.replace(/value: filterId === "all" \? 150 : 45/g, 'value: 0');
c = c.replace(/value: filterId === "all" \? 40 : 12/g, 'value: 0');

c = c.replace(/value: filterId === "all" \? 300 : 85/g, 'value: 0');
c = c.replace(/value: filterId === "all" \? 250 : 70/g, 'value: 0');
c = c.replace(/value: filterId === "all" \? 200 : 60/g, 'value: 0');
c = c.replace(/value: filterId === "all" \? 50 : 15/g, 'value: 0');

c = c.replace('value: "2,840"', 'value: "0"');
c = c.replace('value: "24"', 'value: "0"');
c = c.replace('value: "12 يوم"', 'value: "0 يوم"');

c = c.replace('subtitle: "✨ تم استبعاد 70% آلياً."', 'subtitle: "لا توجد بيانات."');

fs.writeFileSync('src/App.tsx', c);
console.log("Reports data scrubbed.");
