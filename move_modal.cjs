const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const unsavedModalBlock = `
        {showUnsavedModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-black text-navy dark:text-white text-center mb-2">
                تغييرات غير محفوظة!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium leading-relaxed">
                لقد قمت بإجراء تغييرات. إذا غادرت الآن، سيتم فقدان جميع البيانات التي أدخلتها.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setShowUnsavedModal(false)}
                  className="w-full px-4 py-3.5 rounded-xl font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-600"
                >
                  البقاء في الصفحة
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (typeof onBack === "function") onBack();
                  }}
                  className="w-full px-4 py-3.5 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  مغادرة وتجاهل التغييرات
                </button>
              </div>
            </motion.div>
          </div>
        )}`;

// I'll insert this after: <h2 className="text-2xl font-black text-navy dark:text-white text-center mb-4">\n                تأكيد النشر\n              </h2>
// But wait, there is a whole block for showConfirmModal.
// Let's replace the end of it:
code = code.replace(
  /تأكيد النشر\s*<\/button>\s*<\/div>\s*<\/motion.div>\s*<\/div>\s*\)\}/,
  (match) => match + '\n' + unsavedModalBlock
);

fs.writeFileSync('src/App.tsx', code);
console.log("Moved modal!");
