import fs from 'fs';

const filePath = 'c:\\Users\\rawi1\\Downloads\\التوظيف-الذكي-_-smart-recruitment\\src\\Shared.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `              {/* View details button at the bottom */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-50 dark:border-slate-700/50 w-full">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                  {talent.source === 'quick_screening' ? 'فرز سريع' : 'طلب تقديم'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(talent);
                  }}
                  className="text-[10.5px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  التفاصيل <ArrowLeft size={12} />
                </button>
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetails(talent); }}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                <FileText size={18} /> عرض الملف{" "}
              </button>{" "}
            </div>{" "}
          </motion.div>`;

const replacementStr = `              {/* View details button at the bottom */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-50 dark:border-slate-700/50 w-full">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                  {talent.source === 'quick_screening' ? 'فرز سريع' : 'طلب تقديم'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(talent);
                  }}
                  className="text-[10.5px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  التفاصيل <ArrowLeft size={12} />
                </button>
              </div>
            </div>
          </motion.div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully patched Shared.tsx!");
} else {
  console.error("Could not find the target string in Shared.tsx!");
  // Let's try searching with slightly normalized whitespaces
  const normalizedTarget = targetStr.replace(/\s+/g, ' ');
  const normalizedContent = content.replace(/\s+/g, ' ');
  if (normalizedContent.includes(normalizedTarget)) {
    console.log("Found matching normalized content, performing fuzzy replacement...");
    // Let's do a regex replacement that is whitespace insensitive
    const regexPattern = new RegExp(targetStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+'), 'g');
    content = content.replace(regexPattern, replacementStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Successfully patched Shared.tsx via regex!");
  } else {
    console.error("No matches found even with normalization!");
  }
}
