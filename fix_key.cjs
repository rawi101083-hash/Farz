const fs = require('fs');
const jsonPath = 'c:/Users/rawi1/Downloads/pilgrim-servis-addebf5a2431.json';
const keyFile = 'c:/Users/rawi1/Downloads/التوظيف-الذكي-_-smart-recruitment/key_n8n.txt';

try {
  const fileContent = fs.readFileSync(jsonPath, 'utf8');
  const json = JSON.parse(fileContent);
  const privateKey = json.private_key;
  
  fs.writeFileSync(keyFile, privateKey);
  console.log("تم استخراج المفتاح بنجاح وتنسيقه في ملف: " + keyFile);
} catch(e) {
  console.log(e);
}
