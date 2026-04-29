const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// --- Replace Placeholders first ---

// 1. نبذة عن الدور -> "(اكتب نبذة مختصرة عن الوظيفة...)"
code = code.replace(
  /placeholder="\(\s*ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي\s*\)"/g, 
  'placeholder="(اكتب نبذة مختصرة عن الوظيفة...)"'
);

// 2. المهام والمسؤوليات -> "(اكتب المهام في شكل نقاط...)"
code = code.replace(
  /placeholder="\(\s*يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة محرك الفرز\s*\)"/g, 
  'placeholder="(اكتب المهام في شكل نقاط...)"'
);

// 3. المميزات -> "(مثال: تأمين طبي، عمولات، مكافآت...)"
code = code.replace(
  /placeholder="\(\s*أدخل المميزات الإضافية للوظيفة كالتأمين أو العمولات\.\.\.\s*\)"/g, 
  'placeholder="(مثال: تأمين طبي، عمولات، مكافآت...)"'
);

// 4. توجيهات إضافية -> "(اكتب توجيهاتك لمحرك الفرز هنا...)"
code = code.replace(
  /placeholder="\(\s*هنا يمكنك توجيه محرك الفرز للتركيز على خبرات أو شروط معينة خارج الوصف المعتاد\s*\)"/g, 
  'placeholder="(اكتب توجيهاتك لمحرك الفرز هنا...)"'
);

// --- Inject Info icons in labels ---

const infoStyle = 'size={14} className="text-slate-400 hover:text-primary transition-colors cursor-help inline-block mr-2"';

// 1. نبذة عن الدور
const tooltipDesc = 'title="ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي"';
code = code.replace(
  />نبذة عن الدور \(اختياري\)<\/label>/g, 
  `>نبذة عن الدور (اختياري) <Info ${infoStyle} ${tooltipDesc} /></label>`
);

// 2. المهام والمسؤوليات
const tooltipResp = 'title="يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة محرك الفرز"';
code = code.replace(
  />المهام والمسؤوليات \(اختياري\)<\/label>/g, 
  `>المهام والمسؤوليات (اختياري) <Info ${infoStyle} ${tooltipResp} /></label>`
);

// 3. توجيهات إضافية
const tooltipAi = 'title="هنا يمكنك توجيه محرك الفرز للتركيز على خبرات أو شروط معينة خارج الوصف المعتاد"';
code = code.replace(
  />توجيهات إضافية لمحرك الفرز \(اختياري\)<\/label>/g, 
  `>توجيهات إضافية لمحرك الفرز (اختياري) <Info ${infoStyle} ${tooltipAi} /></label>`
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
