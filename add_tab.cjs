const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update initial tab
code = code.replace(/useState\("ملف الشركة"\);/, 'useState("الملف الشخصي");');

// Update tabs array
code = code.replace(/\{\["ملف الشركة", "باقة الاشتراك", "المظهر"\]/g, '{["الملف الشخصي", "ملف الشركة", "باقة الاشتراك", "المظهر"]');

// Replace Company Logo Upload Div with actionable Label
const oldCompanyLogoDiv = `<div
                  className={\`w-24 h-24 rounded-3xl bg-slate-100 border-slate-200 dark:bg-slate-700 dark:border-slate-600 flex items-center justify-center border-2 border-dashed\`}
                >
                  {" "}
                  <Upload size={32} className="text-slate-300" />{" "}
                </div>`;
const newCompanyLogoLabel = `<label className="cursor-pointer relative overflow-hidden w-24 h-24 rounded-3xl bg-slate-100 border-slate-200 dark:bg-slate-700 dark:border-slate-600 flex items-center justify-center border-2 border-dashed group hover:border-primary/50 transition-colors">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                          setUserProfile({...userProfile, companyLogo: URL.createObjectURL(e.target.files[0])});
                      }
                  }} />
                  {userProfile.companyLogo ? (
                      <img src={userProfile.companyLogo} className="w-full h-full object-cover" alt="Company Logo" />
                  ) : (
                      <Upload size={32} className="text-slate-300 group-hover:text-primary transition-colors" />
                  )}
                </label>`;
code = code.replace(oldCompanyLogoDiv, newCompanyLogoLabel);

// Inject Personal Profile Tab
const personalTab = `{activeTab === "الملف الشخصي" && (
            <div className="max-w-2xl space-y-8">
              <div className="flex items-center gap-8 mb-10">
                <label className="cursor-pointer relative overflow-hidden w-24 h-24 rounded-3xl bg-slate-100 border-slate-200 dark:bg-slate-700 dark:border-slate-600 flex items-center justify-center border-2 border-dashed group hover:border-primary/50 transition-colors">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                          setUserProfile({...userProfile, avatar: URL.createObjectURL(e.target.files[0])});
                      }
                  }} />
                  {userProfile.avatar ? (
                      <img src={userProfile.avatar} className="w-full h-full object-cover" alt="User Avatar" />
                  ) : (
                      <Upload size={32} className="text-slate-300 group-hover:text-primary transition-colors" />
                  )}
                </label>
                <div>
                  <h4 className="font-bold text-navy dark:text-white mb-1">الصورة الشخصية</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">يفضل استخدام صورة مربعة واضحة المعالم</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-navy dark:text-slate-300">الاسم بالكامل</label>
                  <input type="text" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-navy dark:text-slate-300">المسمى الوظيفي</label>
                  <input type="text" value={userProfile.title} onChange={(e) => setUserProfile({...userProfile, title: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                </div>
              </div>
            </div>
          )}
          `;
code = code.replace(/\{activeTab === "ملف الشركة" && \(/, personalTab + '\n          {activeTab === "ملف الشركة" && (\n');

fs.writeFileSync('src/App.tsx', code);
console.log('done personal tab');
