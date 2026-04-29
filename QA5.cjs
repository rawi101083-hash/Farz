const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const optSpan = '<span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>';

function tooltipHtml(text) {
  return `<span className="relative group inline-flex items-center ml-1">
      <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
      <div className="absolute right-0 bottom-full mb-2 w-64 p-2.5 bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-normal leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
        ${text}
        <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
      </div>
    </span>`;
}

// 1. نبذة عن الدور
code = code.replace(
  new RegExp(`نبذة عن الدور ${optSpan.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&')}<\/label>`, 'g'),
  `نبذة عن الدور ${optSpan} ${tooltipHtml('ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي')}</label>`
);

// 2. المهام والمسؤوليات
code = code.replace(
  new RegExp(`المهام والمسؤوليات ${optSpan.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&')}<\/label>`, 'g'),
  `المهام والمسؤوليات ${optSpan} ${tooltipHtml('يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة محرك الفرز')}</label>`
);

// 3. المؤهلات والمتطلبات
code = code.replace(
  new RegExp(`المؤهلات والمتطلبات ${optSpan.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&')}<\/label>`, 'g'),
  `المؤهلات والمتطلبات ${optSpan} ${tooltipHtml('اكتب المؤهلات التقنية والأكاديمية المهمة لضمان مطابقة الذكاء الاصطناعي بدقة')}</label>`
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
