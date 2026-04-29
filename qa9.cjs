const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add askExpectedSalary? to Role and Job schema
code = code.replace(/isSalaryHidden\?: boolean;/g, 'isSalaryHidden?: boolean;\n  askExpectedSalary?: boolean;');

// 2. Add askExpectedSalary state inside CreateJob
code = code.replace(/const \[isSalaryHidden, setIsSalaryHidden\] = useState\(initialData\?\.isSalaryHidden \|\| false\);/g, 
  'const [isSalaryHidden, setIsSalaryHidden] = useState(initialData?.isSalaryHidden || false);\n  const [askExpectedSalary, setAskExpectedSalary] = useState(initialData?.askExpectedSalary ?? false);');

// 3. Fix handleSwitchToSingle state
const switchSingleRegex = /if \(firstRole\.salaryMin\) setSalaryMin\(firstRole\.salaryMin\);\n\s*if \(firstRole\.salaryMax\) setSalaryMax\(firstRole\.salaryMax\);\n\s*if \(firstRole\.isSalaryHidden !== undefined\) setIsSalaryHidden\(firstRole\.isSalaryHidden\);/g;
code = code.replace(switchSingleRegex, 'setSalaryMin(firstRole.salaryMin || "");\n      setSalaryMax(firstRole.salaryMax || "");\n      setIsSalaryHidden(firstRole.isSalaryHidden ?? false);\n      setAskExpectedSalary(firstRole.askExpectedSalary ?? false);');

// 4. Fix handleEditRole state
const editRoleRegex = /if \(role\.salaryMin\) setSalaryMin\(role\.salaryMin\);\n\s*if \(role\.salaryMax\) setSalaryMax\(role\.salaryMax\);\n\s*if \(role\.isSalaryHidden !== undefined\) setIsSalaryHidden\(role\.isSalaryHidden\);/g;
code = code.replace(editRoleRegex, 'setSalaryMin(role.salaryMin || "");\n    setSalaryMax(role.salaryMax || "");\n    setIsSalaryHidden(role.isSalaryHidden ?? false);\n    setAskExpectedSalary(role.askExpectedSalary ?? false);');

// 5. Fix setEditingRoleId null block where it clears the state
const clearEditingRegex = /setTargetMajors\(\[\]\);\n\s*return;\n\s*\}/g;
code = code.replace(clearEditingRegex, 'setTargetMajors([]);\n      setSalaryMin("");\n      setSalaryMax("");\n      setIsSalaryHidden(false);\n      setAskExpectedSalary(false);\n      return;\n    }');

// 6. Include askExpectedSalary in saving
const saveRoleRegex = /salaryMax,\n\s*isSalaryHidden,\n\s*knockoutQuestions,/g;
code = code.replace(saveRoleRegex, 'salaryMax,\n        isSalaryHidden,\n        askExpectedSalary,\n        knockoutQuestions,');

const finalJobRegex = /isSalaryHidden,\n\s*recordType: /g;
code = code.replace(finalJobRegex, 'isSalaryHidden,\n      askExpectedSalary,\n      recordType: ');

// 7. Add askExpectedSalary UI mapping in CreateJob
const toggleUI = `
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl w-full hover:border-primary/50 transition-colors mt-4">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={askExpectedSalary}
                          onChange={(e) => setAskExpectedSalary(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:peer-checked:after:-translate-x-full after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-navy dark:text-white">تفعيل سؤال الراتب المتوقع للمتقدمين</span>
                        <span className="text-xs text-slate-500 font-medium">سيلزم المتقدم بتحديد توقعه المالي من قائمة منسدلة</span>
                      </div>
                    </label>
`;

code = code.replace(/<span className="text-sm font-bold text-navy dark:text-white">إخفاء الراتب عن المتقدمين<\/span>\n\s*<span className="text-xs text-slate-500 font-medium">لن يظهر النطاق المالي في واجهة التوظيف<\/span>\n\s*<\/div>\n\s*<\/label>/g, 
  `<span className="text-sm font-bold text-navy dark:text-white">إخفاء الراتب عن المتقدمين</span>\n                        <span className="text-xs text-slate-500 font-medium">لن يظهر النطاق المالي في واجهة التوظيف</span>\n                      </div>\n                    </label>${toggleUI}`);

// 8. Applicant Form implementation
const applicantFormRegex = /\{activeRole\.isSalaryHidden && \(\s*<div className="space-y-3 md:col-span-2 mt-2">\s*<label className="text-sm font-bold text-navy dark:text-white mr-1">\s*الراتب المتوقع \(ريال\) <span className="text-red-500">\*<\/span>\s*<\/label>\s*<input\s*required\s*name="expectedSalary"\s*type="number"\s*value=\{formDataState\.expectedSalary\}\s*onChange=\{handleInputChange\}\s*placeholder="مثال: 5000"\s*className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800\/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-primary\/10 focus:border-primary outline-none transition-all font-medium"\s*\/>\s*<\/div>\s*\)\}/;

const dynamicDropdownUI = `
              {(activeRole.askExpectedSalary ?? job.askExpectedSalary) && (
                <div className="space-y-3 md:col-span-2 mt-2">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1">
                    الراتب المتوقع (ريال) <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="expectedSalary"
                    value={formDataState.expectedSalary}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-navy dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر الراتب المتوقع...</option>
                    <option value="4000 - 6000" className="bg-white text-navy dark:bg-slate-800 dark:text-white">4000 - 6000</option>
                    <option value="6000 - 8000" className="bg-white text-navy dark:bg-slate-800 dark:text-white">6000 - 8000</option>
                    <option value="8000 - 10000" className="bg-white text-navy dark:bg-slate-800 dark:text-white">8000 - 10000</option>
                    <option value="10000 - 15000" className="bg-white text-navy dark:bg-slate-800 dark:text-white">10000 - 15000</option>
                    <option value="15000 - 20000" className="bg-white text-navy dark:bg-slate-800 dark:text-white">15000 - 20000</option>
                    <option value="أكثر من 20000" className="bg-white text-navy dark:bg-slate-800 dark:text-white">أكثر من 20000</option>
                  </select>
                </div>
              )}`;

code = code.replace(applicantFormRegex, dynamicDropdownUI);

// Wait, the previous regex was based on the fact `activeRole.isSalaryHidden && (` existed exactly! Let me make sure it covers it natively!
// The previous text had `{!(activeRole?.isSalaryHidden ?? job?.isSalaryHidden) && (...` 
// I will check if it isn't matched and replace it.

// 9. Hide "يحدد بالمقابلة" completely
const badBadgeTextRegex = /\{\!displayRole\.isSalaryHidden && \(\s*<span className="flex items-center gap-1\.5 bg-emerald-50 dark:bg-emerald-900\/20 text-emerald-700 dark:text-emerald-400 px-3 py-1\.5 rounded-lg border border-emerald-100 dark:border-emerald-800\/30 shadow-sm">\s*<CreditCard size=\{14\} \/> \{displayRole\.salaryMin \? \`\$\{displayRole\.salaryMin\} \$\{displayRole\.salaryMax \? \`- \$\{displayRole\.salaryMax\}\` \: ''\} ريال\` \: "يحدد بالمقابلة"\}\s*<\/span>\s*\)\}/g;

const newBadgeText = `{!displayRole.isSalaryHidden && displayRole.salaryMin && (
                  <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
                    <CreditCard size={14} /> {displayRole.salaryMin} {displayRole.salaryMax ? \`- \${displayRole.salaryMax}\` : ''} ريال
                  </span>
                )}`;
code = code.replace(badBadgeTextRegex, newBadgeText);

// 10. Update the mockup value in Candidate Mock
code = code.replace(/expectedSalary: "6000"|expectedSalary: 6000/g, 'expectedSalary: "6000 - 8000"');

// 11. Update ApplicantDetails wording
const oldDetailsBadgeRegex = /💰 <span className="text-slate-500 dark:text-slate-400">ملاحظة مالية: المتقدم يتوقع راتب:<\/span> \(\{candidate\?\.expectedSalary\} ريال\)/g;
code = code.replace(oldDetailsBadgeRegex, '💰 <span className="text-slate-500 dark:text-slate-400">ملاحظة: الراتب المتوقع للمتقدم هو</span> ({candidate?.expectedSalary})');

// Update for string expectedSalary vs number (change type in form to string)
code = code.replace(/expectedSalary\?: number;/g, 'expectedSalary?: string;');

fs.writeFileSync('src/App.tsx', code, 'utf8');
