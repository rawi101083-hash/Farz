const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const optSpan = '<span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>';

// 1. التخصصات المستهدفة
code = code.replace(
  /<label([^>]*)>التخصصات المستهدفة<\/label>/g,
  `<label$1>التخصصات المستهدفة ${optSpan}</label>`
);

// 2. Add native title tooltips directly on textareas to ensure hover over the "box" works.

// Nabdha (description/jobDescription)
code = code.replace(
  /(<textarea[^>]*value=\{description\}[^>]*)(\/?>)/g,
  (match, p1, p2) => {
    if (p1.includes('title=')) return match;
    return `${p1} title="ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي"${p2}`;
  }
);
code = code.replace(
  /(<textarea[^>]*value=\{jobDescription\}[^>]*)(\/?>)/g,
  (match, p1, p2) => {
    if (p1.includes('title=')) return match;
    return `${p1} title="ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي"${p2}`;
  }
);

// Responsibilities
code = code.replace(
  /(<textarea[^>]*value=\{responsibilities\}[^>]*)(\/?>)/g,
  (match, p1, p2) => {
    if (p1.includes('title=')) return match;
    return `${p1} title="يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة محرك الفرز"${p2}`;
  }
);

// aiInstructions
code = code.replace(
  /(<textarea[^>]*value=\{aiInstructions\}[^>]*)(\/?>)/g,
  (match, p1, p2) => {
    if (p1.includes('title=')) return match;
    return `${p1} title="نظام الفرز يقوم بتحليل السير الذاتية... استخدم هذا الحقل للتركيز على مهارة نادرة..."${p2}`;
  }
);


fs.writeFileSync('src/App.tsx', code, 'utf8');
