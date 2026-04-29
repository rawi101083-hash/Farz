const fs = require('fs');
let content = fs.readFileSync('src/components/JobApplication.tsx', 'utf-8');

// Update formDataState
const formStateOriginal = `    neighborhood: "",
    linkedin: "",
    source: "",
    knockoutAnswers: {} as Record<string, string>,
  });`;
const formStateNew = `    neighborhood: "",
    linkedin: "",
    source: "",
    availability: "",
    expectedSalary: "",
    knockoutAnswers: {} as Record<string, string>,
  });`;
content = content.replace(formStateOriginal, formStateNew);

// Insert to DB payload
const dbInsertOriginal = `.insert([{
            job_id: job?.id || null,
            full_name: (submitData.fullName || submitData.name || submitData.firstName || "متقدم").toString(),
            email: (submitData.email || "").toString(),
            phone: (submitData.phone || "").toString(),
            cv_file_url: cv_file_url || null,
          }])`;
const dbInsertNew = `.insert([{
            job_id: job?.id || null,
            full_name: (submitData.fullName || submitData.name || submitData.firstName || "متقدم").toString(),
            email: (submitData.email || "").toString(),
            phone: (submitData.phone || "").toString(),
            cv_file_url: cv_file_url || null,
            availability: submitData.availability || "",
            expected_salary: submitData.expectedSalary || "",
          }])`;
content = content.replace(dbInsertOriginal, dbInsertNew);

// Insert to n8n payload
const n8nPayloadOriginal = `const n8nPayload = {
        applicant_db_id: applicant_db_id,
        applicant_name: (submitData.fullName || submitData.name || submitData.firstName || "متقدم").toString(),`;
const n8nPayloadNew = `const n8nPayload = {
        availability: submitData.availability || "",
        expectedSalary: submitData.expectedSalary || "",
        applicant_db_id: applicant_db_id,
        applicant_name: (submitData.fullName || submitData.name || submitData.firstName || "متقدم").toString(),`;
content = content.replace(n8nPayloadOriginal, n8nPayloadNew);

// Add the fields in UI
const uiOriginal = `              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  المدينة <span className="text-red-500">*</span>
                </label>`;
const uiNew = `              {(activeRole?.askExpectedSalary === "open" || activeRole?.askExpectedSalary === "ranges" || (activeRole?.askExpectedSalary === undefined && (job?.askExpectedSalary === "open" || job?.askExpectedSalary === "ranges"))) && (
                <div className="space-y-3">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                    الراتب المتوقع <span className="text-red-500">*</span>
                  </label>
                  {((activeRole?.askExpectedSalary || job?.askExpectedSalary) === "ranges") ? (
                    <div className="relative">
                      <select
                        required
                        name="expectedSalary"
                        value={formDataState.expectedSalary}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر نطاق الراتب المتوقع</option>
                        <option value="أقل من 4000" className="bg-white text-navy dark:bg-slate-800 dark:text-white">أقل من 4000 ريال</option>
                        <option value="4000 - 6000" className="bg-white text-navy dark:bg-slate-800 dark:text-white">4000 - 6000 ريال</option>
                        <option value="6000 - 8000" className="bg-white text-navy dark:bg-slate-800 dark:text-white">6000 - 8000 ريال</option>
                        <option value="أعلى من 8000" className="bg-white text-navy dark:bg-slate-800 dark:text-white">أعلى من 8000 ريال</option>
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
              )}

              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  متى يمكنك المباشرة بالعمل؟ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    name="availability"
                    value={formDataState.availability}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر خياراً</option>
                    <option value="فوري" className="bg-white text-navy dark:bg-slate-800 dark:text-white">فوري</option>
                    <option value="بعد أسبوع إلى أسبوعين" className="bg-white text-navy dark:bg-slate-800 dark:text-white">بعد أسبوع إلى أسبوعين</option>
                    <option value="بعد شهر" className="bg-white text-navy dark:bg-slate-800 dark:text-white">بعد شهر</option>
                    <option value="أكثر من شهر" className="bg-white text-navy dark:bg-slate-800 dark:text-white">أكثر من شهر</option>
                  </select>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  المدينة <span className="text-red-500">*</span>
                </label>`;
content = content.replace(uiOriginal, uiNew);

fs.writeFileSync('src/components/JobApplication.tsx', content);
console.log('JobApplication.tsx updated successfully');
