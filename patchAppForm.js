const fs = require('fs');
let content = fs.readFileSync('src/components/JobApplication.tsx', 'utf-8');

const targetStr = `              {(activeRole?.askExpectedSalary ?? job?.askExpectedSalary) && (
                <div className="space-y-3 md:col-span-2 mt-2">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1">
                    الراتب المتوقع (ريال) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="expectedSalary"
                    type="number"
                    value={formDataState.expectedSalary}
                    onChange={handleInputChange}
                    placeholder="مثال: 5000"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              )}`;

const replacementStr = `              {(activeRole?.askExpectedSalary === "open" || activeRole?.askExpectedSalary === "ranges" || (!activeRole?.askExpectedSalary && (job?.askExpectedSalary === "open" || job?.askExpectedSalary === "ranges"))) && (
                <div className="space-y-3 md:col-span-2 mt-2">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1">
                    الراتب المتوقع (ريال) <span className="text-red-500">*</span>
                  </label>
                  {((activeRole?.askExpectedSalary || (!activeRole?.askExpectedSalary && job?.askExpectedSalary)) === "ranges") ? (
                    <div className="relative">
                      <select
                        required
                        name="expectedSalary"
                        value={formDataState.expectedSalary}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر نطاق الراتب المتوقع</option>
                        {((activeRole?.expectedSalaryRanges && activeRole.expectedSalaryRanges.length > 0) ? activeRole.expectedSalaryRanges : (job?.expectedSalaryRanges || [])).map((range, idx) => (
                          <option key={idx} value={range} className="bg-white text-navy dark:bg-slate-800 dark:text-white">{range}</option>
                        ))}
                        {(!activeRole?.expectedSalaryRanges?.length && !job?.expectedSalaryRanges?.length) && (
                          <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white text-slate-400">لا توجد خيارات متاحة</option>
                        )}
                      </select>
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  ) : (
                    <input
                      required
                      name="expectedSalary"
                      type="number"
                      min="0"
                      value={formDataState.expectedSalary}
                      onChange={handleInputChange}
                      placeholder="مثال: 5000"
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-left"
                      dir="ltr"
                    />
                  )}
                </div>
              )}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync('src/components/JobApplication.tsx', content);
  console.log('SUCCESS');
} else {
  console.log('NOT FOUND');
}
