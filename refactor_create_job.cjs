const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the form layout
const oldFormStart = `<form className="p-10 space-y-8" onSubmit={handleSubmit}>`;

// In order to avoid dealing with replacing massive chunks of React code safely using plain string replace,
// I'll define precise targets to inject the Card wrappers.

// Wrap 1: Basic Info
// Starts after <form>
// Ends before {createJobType === "campaign" && (
code = code.replace(
  /<form className="p-10 space-y-8" onSubmit=\{handleSubmit\}>[\s]*<div className="grid grid-cols-1 md:grid-cols-2 gap-8">/,
  `<form className="p-8 space-y-8" onSubmit={handleSubmit}>
            {/* Card 1: Basic Info */}
            <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[32px] border border-slate-200 dark:border-slate-700/50 space-y-6">
              <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-3 mb-6">
                <Briefcase className="text-primary" size={24} /> المعلومات الأساسية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">`
);

// We need to close Basic Info card. It typically ends after campaign conditionally or just before startDate.
// Let's do a more robust string replacement strategy: read file, find 'CreateJob', and replace the form block manually.
// Actually, using TS AST or just replacing by known strings is better.

code = code.replace(
  /\{\/\* Dates \*\/\}/,
  `</div>\n\n            {/* Card 2: Dates and Schedule */}\n            <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[32px] border border-slate-200 dark:border-slate-700/50 space-y-6">\n              <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-3 mb-6">\n                <Calendar className="text-primary" size={24} /> التواريخ والجدولة\n              </h3>`
);

code = code.replace(
  /\{\/\* Role Details \*\/\}[\s]*<div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-700">/,
  `</div>\n\n            {/* Card 3: Requirements and Roles */}\n            <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[32px] border border-slate-200 dark:border-slate-700/50 space-y-6">\n              <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-3 mb-6">\n                <Users className="text-primary" size={24} /> تفاصيل الأدوار والمتطلبات\n              </h3>\n              <div>`
);

code = code.replace(
  /\{\/\* Custom Questions \*\/\}/,
  `</div>\n\n            {/* Card 4: Evaluation Settings */}\n            <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[32px] border border-slate-200 dark:border-slate-700/50 space-y-6">\n              <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-3 mb-6">\n                <Settings className="text-primary" size={24} /> إعدادات التقييم والفرز\n              </h3>`
);

code = code.replace(
  /\{\/\* Submit \*\/\}/,
  `</div>\n\n            {/* Submit */}`
);

fs.writeFileSync('src/App.tsx', code);
console.log('done CreateJob refactor');
