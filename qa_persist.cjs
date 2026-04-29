const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. handleSaveRole (map block)
c = c.replace(/        isSalaryHidden,\n        knockoutQuestions,/g, 
`        isSalaryHidden,
        askExpectedSalary,
        knockoutQuestions,`);

// 2. handleSaveRole (push block)
c = c.replace(/          isSalaryHidden,\n          knockoutQuestions,/g,
`          isSalaryHidden,
          askExpectedSalary,
          knockoutQuestions,`);

// 3. handleSave (add job map block)
c = c.replace(/        isSalaryHidden: createJobType === "quick_link" \? false : isSalaryHidden,\n        knockoutQuestions,/g,
`        isSalaryHidden: createJobType === "quick_link" ? false : isSalaryHidden,
        askExpectedSalary: createJobType === "quick_link" ? false : askExpectedSalary,
        knockoutQuestions,`);

// 4. handleSave (update job map block)
c = c.replace(/          isSalaryHidden,\n          knockoutQuestions,/g,
`          isSalaryHidden,
          askExpectedSalary,
          knockoutQuestions,`);

// 5. handleSave (campaign job record)
c = c.replace(/      isSalaryHidden,\n      recordType: adType,/g,
`      isSalaryHidden,
      askExpectedSalary,
      recordType: adType,`);
      
// 6. role mapper
c = c.replace(/              isSalaryHidden,\n              knockoutQuestions/g,
`              isSalaryHidden,
              askExpectedSalary,
              knockoutQuestions`);

// 7. AutoSave job block
c = c.replace(/      isSalaryHidden,\n      type,/g,
`      isSalaryHidden,
      askExpectedSalary,
      type,`);

// 8. EditJob modal setup
c = c.replace(/const \[isSalaryHidden, setIsSalaryHidden\] = useState\(job\.isSalaryHidden \|\| false\);/g, 
`const [isSalaryHidden, setIsSalaryHidden] = useState(job.isSalaryHidden || false);
  const [askExpectedSalary, setAskExpectedSalary] = useState(job.askExpectedSalary || false);`);

// 9. EditJob modal save
c = c.replace(/          isSalaryHidden,\n          recordType:/g,
`          isSalaryHidden,
          askExpectedSalary,
          recordType:`);

// 10. EditJob modal UI inject
const editJobTarget = `<span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء الراتب عن المتقدمين (يُستخدم للفرز الآلي فقط)</span>
                      </label>
                    </div>
                  </div>`;
const editJobInject = `<span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء الراتب عن المتقدمين (يُستخدم للفرز الآلي فقط)</span>
                      </label>
                    </div>
                    <div className="relative mt-3 flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input type="checkbox" className="sr-only peer" checked={askExpectedSalary} onChange={(e) => setAskExpectedSalary(e.target.checked)} />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                        <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">سؤال المتقدم عن راتبه المتوقع (يُظهر قائمة خيارات في نموذج التقديم)</span>
                      </label>
                    </div>
                  </div>`;

c = c.replace(editJobTarget, editJobInject);

fs.writeFileSync('src/App.tsx', c);
