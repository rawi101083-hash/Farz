const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace('commercialRegistration: "",', 'commercialRegistration: "1010123456",');

fs.writeFileSync('src/App.tsx', c);
console.log('Fixed');
