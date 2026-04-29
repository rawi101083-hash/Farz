const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `<span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء الراتب عن المتقدمين (يُستخدم للفرز الآلي فقط)</span>
                  </label>
                </div>
              </div>`;

const injection = `<span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء الراتب عن المتقدمين (يُستخدم للفرز الآلي فقط)</span>
                  </label>
                </div>
                <div className="relative mt-4 flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" className="sr-only peer" checked={askExpectedSalary} onChange={(e) => setAskExpectedSalary(e.target.checked)} />
                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                    <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">سؤال المتقدم عن راتبه المتوقع (يُظهر قائمة خيارات في نموذج التقديم)</span>
                  </label>
                </div>
              </div>`;

c = c.replace(target1, injection);

// Let's also check if the old toggleUI is floating around from my `qa9.cjs` and delete it if it is, 
// wait, the old one was: `<span className="text-sm font-bold text-navy dark:text-white">تفعيل سؤال الراتب المتوقع للمتقدمين</span>`
// It probably never injected since `إخفاء الراتب عن المتقدمين` in qa9.cjs regex was completely different.
// So this is safe.

fs.writeFileSync('src/App.tsx', c);
