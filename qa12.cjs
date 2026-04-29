const fs = require('fs');

let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// 1. Change "تفعيل هذه الواجهة" -> "تفعيل الواجهة"
const welcomeIdx = lines.findIndex(l => l.includes('تفعيل هذه الواجهة'));
if (welcomeIdx !== -1) {
    lines[welcomeIdx] = lines[welcomeIdx].replace('تفعيل هذه الواجهة', 'تفعيل الواجهة');
}

// 2. Inject toggles precisely after the div closure
const salaryToggleIdx = lines.findIndex(l => l.includes('إخفاء الراتب عن المتقدمين (يُستخدم للفرز الآلي فقط)'));
if (salaryToggleIdx !== -1) {
    // Expected structure:
    // lines[salaryToggleIdx] = span
    // lines[salaryToggleIdx + 1] = </label>
    // lines[salaryToggleIdx + 2] = </div>
    // Insert after salaryToggleIdx + 2
    
    const newToggle = `                <div className="relative mt-4 flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" className="sr-only peer" checked={askExpectedSalary} onChange={(e) => setAskExpectedSalary(e.target.checked)} />
                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                    <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">سؤال المتقدم عن راتبه المتوقع (يُظهر قائمة خيارات في نموذج التقديم)</span>
                  </label>
                </div>`;
                
    // let's check if the injection already exists just in case
    const checkIdx = lines.findIndex(l => l.includes('سؤال المتقدم عن راتبه المتوقع'));
    if (checkIdx === -1) {
        lines.splice(salaryToggleIdx + 3, 0, newToggle);
        console.log("Injected toggle successfully!");
    } else {
        console.log("Toggle already exists!");
    }
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
