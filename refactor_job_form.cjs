const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Expand the width:
code = code.replace(/<div className="max-w-3xl mx-auto">/, '<div className="max-w-5xl mx-auto pb-32">');
// Change form wrapper to remove the giant white background, and let it be transparent to hold separate cards.
// Or just let it be. Let's keep the motion.div but give it transparent bg if possible, or just keep it white and use border/padding for sections.
// Wait, the prompt says "انزع أزرار (حفظ / نشر / إلغاء) من أسفل النموذج، وضعها في شريط عائم".
// Let's rip out the submit buttons at the bottom.

const submitRegex = /<div className="pt-10 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 mt-12">[\s\S]*?(?=<\/form>)/;
const match = code.match(submitRegex);
let submitBlock = "";
if (match) {
    submitBlock = match[0];
    code = code.replace(submitRegex, ""); // remove it from bottom of form
}

// 2. Add Sticky Footer after the main motion.div wrapper
// Look for where motion.div ends, but wait, there are many. We can find the end of `CreateJob` by looking for `</main>` or similar if we are in App? No, `CreateJob` is a component, it returns `<div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8 pt-24 lg:pt-10">` then `<AnimatePresence>` then `<div className="max-w-5xl mx-auto pb-32">...<motion.div>...</motion.div></div></div>`

// 3. Convert single columns into Grids.
// Location & Work Type
code = code.replace(
/<div className="space-y-4">[\s]*<label className="font-bold text-navy dark:text-white text-lg">[\s]*مقر العمل[\s]*<\/label>[\s\S]*?<\/div>[\s]*<div className="space-y-4">[\s]*<label className="font-bold text-navy dark:text-white text-lg">[\s]*نوع العمل[\s]*<\/label>[\s\S]*?<\/div>/,
(match) => {
    return `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">\n${match}\n</div>`;
});

// Start Date & End Date
code = code.replace(
/<div className="space-y-4">[\s]*<label className="font-bold text-navy dark:text-white text-lg">[\s]*تاريخ و وقت تفعيل الإعلان[\s]*<\/label>[\s\S]*?<\/div>[\s]*<div className="space-y-4">[\s]*<div className="flex items-center justify-between">[\s]*<label className="font-bold text-navy dark:text-white text-lg">[\s]*تاريخ و وقت إيقاف الإعلان[\s]*<\/label>[\s\S]*?<\/div>[\s]*<div className="relative">[\s\S]*?<\/div>[\s]*<\/div>/,
(match) => {
    return `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">\n${match}\n</div>`;
});

// Experience & Qualification
code = code.replace(
/<div className="space-y-4">[\s]*<label className="font-bold text-navy dark:text-white text-lg">[\s]*سنوات الخبرة المطلوبة <span className="text-red-500">\*<\/span><\/label>[\s\S]*?<\/div>[\s]*<div className="space-y-4">[\s]*<label className="font-bold text-navy dark:text-white text-lg">[\s]*الحد الأدنى للمؤهل <span className="text-red-500">\*<\/span><\/label>[\s\S]*?<\/div>/,
(match) => {
    return `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">\n${match}\n</div>`;
});

// Salary Min & Max
code = code.replace(
/<div>[\s]*<label className="font-bold text-navy dark:text-white text-lg">[\s]*الحد الأدنى للراتب[\s\S]*?<\/div>[\s]*<div>[\s]*<label className="font-bold text-navy dark:text-white text-lg">[\s]*الحد الأعلى[\s\S]*?<\/div>/,
(match) => {
    return `<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">\n${match}\n</div>`;
});

// Visual Chunking into Cards:
// The user wants clear sections.
// E.g., we can replace `bg-white dark:bg-slate-800 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white dark:border-slate-700 overflow-hidden` with just nothing (or transparent bg, no shadow), and wrap sections in `bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700`.
// Let's modify the `motion.div` class:
code = code.replace(
  /className="bg-white dark:bg-slate-800 rounded-\[40px\] shadow-xl shadow-slate-200\/50 border border-white dark:border-slate-700 overflow-hidden"/,
  `className="bg-transparent"` // Remove giant white background
);
// Make the header card:
code = code.replace(
  /<div className="p-10 border-b border-slate-50 bg-slate-50 dark:bg-slate-800\/50">/,
  `<div className="p-10 mb-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">`
);

// We need to carefully wrap the "Advanced Settings" in an Accordion. 
// "الإعدادات المتقدمة" is already in a container:
code = code.replace(
  /<div className="bg-white dark:bg-slate-800 rounded-\[32px\] border border-slate-200 dark:border-slate-700 shadow-sm p-8 mt-6 mb-6">([\s\S]*?)<\/div>[\s]*<\/div>[\s]*<\/>[\s]*\)}/m,
  `<details className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm mt-6 mb-6 group cursor-pointer">
<summary className="p-8 text-xl font-bold text-navy dark:text-white flex items-center gap-3 select-none outline-none">
  <Settings size={22} className="text-primary" />
  الإعدادات المتقدمة (التقييم الصوتي، الصور، المرفقات المباشرة)
  <ChevronDown size={20} className="ml-auto text-slate-400 group-open:rotate-180 transition-transform" />
</summary>
<div className="px-8 pb-8 pt-2 border-t border-slate-100 dark:border-slate-700 cursor-default">
  $1
</div>
</details>
    </div>
    </>
  )}`
);

// We need to inject the Sticky Footer we removed `submitBlock`.
// Inside the `CreateJob` return, at the very end of the component wrapper:
code = code.replace(
  /<\/div>[\s]*<\/div>[\s]*\);[\s]*};/m,
  `</div>
      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-[100] px-4 md:px-8 py-4 transition-all">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium hidden md:block">
            يرجى مراجعة كافة البيانات قبل تأكيد الحفظ والانتقال للخطوة التالية.
          </div>
          <div className="flex w-full md:w-auto items-center gap-4">
             // Buttons will be refined
          </div>
        </div>
      </div>
    </div>
  );
};`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Script executed. Check App.tsx');
