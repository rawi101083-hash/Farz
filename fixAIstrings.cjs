const fs = require('fs');

function fixSystemWords(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');

  // App.tsx specific UI text replacements to remove "الذكاء الاصطناعي"
  content = content.replace(/التقييم الآلي للذكاء الاصطناعي/g, 'تم تقييم نظام الفرز الآلي');
  content = content.replace(/دقة التقييم الآلي للذكاء الاصطناعي/g, 'دقة نتائج نظام الفرز الآلي');
  content = content.replace(/لمرشح الذكاء الاصطناعي/g, 'لنظام الفرز الآلي');
  
  // Also any stray ones in warnings
  content = content.replace(/للذكاء الاصطناعي/g, 'لنظام الفرز الآلي');

  fs.writeFileSync(path, content, 'utf8');
}

fixSystemWords('src/App.tsx');
fixSystemWords('src/components/CreateJob.tsx');
console.log('Fixed extra instances of AI strings in forms!');
