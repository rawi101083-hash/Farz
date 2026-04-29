const fs = require('fs');

function fixFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Helper template for tooltip
  const getTooltip = (text) => `<span className="relative group inline-flex items-center ml-1">
                          <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                          <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                            ${text}
                            <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                          </div>
                        </span>`;

  // 1. التخصصات المستهدفة in CreateJob.tsx
  content = content.replace(
    /<label className="text-sm font-bold text-navy dark:text-white mr-1 block">التخصصات المستهدفة<\/label>/g,
    `<label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">التخصصات المستهدفة <span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>
                        ${getTooltip('اترك هذا الحقل فارغاً إذا كانت الوظيفة تقبل جميع التخصصات لتوسيع نطاق المتقدمين في نظام الفرز الآلي.')}
                      </label>`
  );
  
  // Remove the old hint for التخصصات المستهدفة
  content = content.replace(/<p className="text-xs text-slate-400 mt-2">التلميح: 💡 اترك الحقل فارغاً إذا كانت الوظيفة تقبل جميع التخصصات\.<\/p>/g, '');

  // 2. نبذة عن الدور in CreateJob.tsx
  content = content.replace(
    /<label className="text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1">\s*نبذة عن الدور <span className="text-slate-400 font-normal text-xs ml-1">\(اختياري\)<\/span>\s*<\/label>/g,
    `<label className="text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1">
                        نبذة عن الدور <span className="text-slate-400 font-normal text-xs ml-1">(اختياري)</span>
                        ${getTooltip('ترك هذا الحقل فارغاً سيجعل محرك نظام الفرز يعتمد على المعايير القياسية للمسمى الوظيفي. لتقييم أدق، أضف نبذة مختصرة.')}
                      </label>`
  );
  content = content.replace(/<p className="text-xs text-slate-400 mt-2">التلميح: 💡 ترك هذا الحقل فارغاً سيجعل الذكاء الاصطناعي يعتمد على المعايير القياسية للمسمى الوظيفي\. لتقييم أدق، أضف نبذة مختصرة\.<\/p>/g, '');

  // 3. المهام والمسؤوليات in CreateJob.tsx
  content = content.replace(
    /<label className="text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1">\s*المهام والمسؤوليات <span className="text-slate-400 font-normal text-xs ml-1">\(اختياري\)<\/span>\s*<\/label>/g,
    `<label className="text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1">
                      المهام والمسؤوليات <span className="text-slate-400 font-normal text-xs ml-1">(اختياري)</span>
                      ${getTooltip('يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة نظام الفرز الآلي.')}
                    </label>`
  );
  content = content.replace(/<p className="text-xs text-slate-400 mt-2">التلميح: 💡 يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة الذكاء الاصطناعي\.<\/p>/g, '');

  // 4. المؤهلات والمتطلبات in CreateJob.tsx
  content = content.replace(
    /<label className="text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1">\s*المؤهلات والمتطلبات <span className="text-red-500">\*<\/span>\s*<\/label>/g,
    `<label className="text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1">
                      المؤهلات والمتطلبات <span className="text-slate-400 font-normal text-xs ml-1">(اختياري)</span>
                      ${getTooltip('أضف المؤهلات الأساسية المطلوبة ليتم أخذها بعين الاعتبار في نظام الفرز الآلي.')}
                    </label>`
  );
  content = content.replace(
    /required=\{createJobType === "single" \|\| createJobType === "quick_link"\}/g,
    ""
  );

  // 5. المهارات المستهدفة in CreateJob.tsx
  content = content.replace(
    /<label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">\s*المهارات المستهدفة\s*<\/label>/g,
    `<label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">
                        المهارات المستهدفة <span className="text-slate-400 font-normal text-xs ml-1">(اختياري)</span>
                        ${getTooltip('تحديد المهارات التقنية الدقيقة يجعل نظام الفرز الآلي أكثر صرامة ودقة.')}
                      </label>`
  );
  content = content.replace(/<p className="text-xs text-slate-400 mt-2">التلميح: 💡 تحديد المهارات التقنية الدقيقة يجعل الفرز الآلي أكثر صرامة ودقة\.<\/p>/g, '');

  
  // App.tsx Replacements:
  
  // 6. نبذة عن الدور in App.tsx
  content = content.replace(
    /<label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">نبذة عن الدور <span className="text-slate-400 font-normal text-xs ml-1">\(اختياري\)<\/span><\/label>/g,
    `<label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">
                        نبذة عن الدور <span className="text-slate-400 font-normal text-xs ml-1">(اختياري)</span>
                        ${getTooltip('ترك هذا الحقل فارغاً سيجعل محرك نظام الفرز يعتمد على المعايير القياسية للمسمى الوظيفي. لتقييم أدق، أضف نبذة مختصرة.')}
                      </label>`
  );

  // 7. المهام والمسؤوليات in App.tsx
  content = content.replace(
    /<label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">المهام والمسؤوليات <span className="text-slate-400 font-normal text-xs ml-1">\(اختياري\)<\/span><\/label>/g,
    `<label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">
                        المهام والمسؤوليات <span className="text-slate-400 font-normal text-xs ml-1">(اختياري)</span>
                        ${getTooltip('يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة نظام الفرز الآلي.')}
                      </label>`
  );

  // 8. التخصصات المستهدفة in App.tsx
  content = content.replace(
    /<label className="text-sm font-bold text-navy dark:text-white block mr-1">التخصصات المستهدفة<\/label>/g,
    `<label className="text-sm font-bold text-navy dark:text-white flex items-center gap-1 mb-2">
                        التخصصات المستهدفة <span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>
                        ${getTooltip('اترك الحقل فارغاً إذا كانت الوظيفة تقبل جميع التخصصات لتوسيع نطاق المتقدمين في نظام الفرز الآلي.')}
                      </label>`
  );
  
  content = content.replace(
    /<label className="text-sm font-bold text-navy dark:text-white block">التخصصات المستهدفة <span className="text-slate-400 font-normal ml-1">\(اختياري\)<\/span><\/label>/g,
    `<label className="text-sm font-bold text-navy dark:text-white flex items-center gap-1 mb-2">
                        التخصصات المستهدفة <span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>
                        ${getTooltip('اترك الحقل فارغاً إذا كانت الوظيفة تقبل جميع التخصصات لتوسيع نطاق المتقدمين في نظام الفرز الآلي.')}
                      </label>`
  );

  content = content.replace(
    /<label className="text-sm font-bold text-navy dark:text-white mr-1 block">التخصصات المستهدفة <span className="text-slate-400 font-normal text-xs ml-1">\(اختياري\)<\/span><\/label>/g,
    `<label className="text-sm font-bold text-navy dark:text-white flex items-center gap-1 mb-2">
                        التخصصات المستهدفة <span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>
                        ${getTooltip('اترك الحقل فارغاً إذا كانت الوظيفة تقبل جميع التخصصات لتوسيع نطاق المتقدمين في نظام الفرز الآلي.')}
                      </label>`
  );
  
  // 9. المهارات والتفضيلات in App.tsx
  content = content.replace(
    /<label className="text-sm font-bold text-navy dark:text-white mr-1 block">المهارات والتفضيلات<\/label>/g,
    `<label className="text-sm font-bold text-navy dark:text-white flex items-center gap-1 mb-2">
                        المهارات والتفضيلات <span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>
                        ${getTooltip('تحديد المهارات التقنية الدقيقة يجعل نظام الفرز الآلي أكثر صرامة ودقة.')}
                      </label>`
  );

  // Remove the old hints from App.tsx as well!
  content = content.replace(/<p className="text-xs text-slate-400 mt-2">التلميح: 💡 ترك هذا الحقل فارغاً سيجعل الذكاء الاصطناعي يعتمد على المعايير القياسية للمسمى الوظيفي\. لتقييم أدق، أضف نبذة مختصرة\.<\/p>/g, '');
  content = content.replace(/<p className="text-xs text-slate-400 mt-2">التلميح: 💡 يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة الذكاء الاصطناعي\.<\/p>/g, '');
  content = content.replace(/<p className="text-xs text-slate-400 mt-2">التلميح: 💡 اترك الحقل فارغاً إذا كانت الوظيفة تقبل جميع التخصصات\.<\/p>/g, '');
  content = content.replace(/<p className="text-xs text-slate-400 mt-2">التلميح: 💡 تحديد المهارات التقنية الدقيقة يجعل الفرز الآلي أكثر صرامة ودقة\.<\/p>/g, '');

  fs.writeFileSync(path, content, 'utf8');
}

fixFile('src/components/CreateJob.tsx');
fixFile('src/App.tsx');
console.log('Fixed tooltips!');

