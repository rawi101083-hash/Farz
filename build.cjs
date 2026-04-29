const fs = require('fs');
let code = fs.readFileSync('src/ManageJob.tsx.tmp', 'utf8');

// 1. Add onDuplicate to ManageJob props
code = code.replace(/onDelete,\n\}(\s*): \{/g, 'onDelete,\n  onDuplicate,\n}: {\n  onDuplicate?: (job: Job) => void;');

// 2. Add activeTab, isLocked, new states
const stateInjection = `
  const [activeTab, setActiveTab] = useState<"details" | "filters" | "settings">("details");
  const [targetMajors, setTargetMajors] = useState<string[]>(job.targetMajors || []);
  const [newMajorInput, setNewMajorInput] = useState("");
  const [knockoutQuestions, setKnockoutQuestions] = useState<any[]>(job.knockoutQuestions || []);
  const [newKqText, setNewKqText] = useState("");
  const [newKqType, setNewKqType] = useState<"yes_no" | "options">("yes_no");
  const [newKqOptions, setNewKqOptions] = useState<string[]>(["نعم", "لا"]);

  const isLocked = status === "نشط" && job.applicants > 0;
`;
code = code.replace(/const \[title, setTitle\] = useState/, stateInjection + '\n  const [title, setTitle] = useState');

// 3. Update updatedJob object
code = code.replace(/skills: selectedSkills,/g, 'skills: selectedSkills,\n      targetMajors,\n      knockoutQuestions,');

// 4. Update Header Buttons to include onDuplicate
const headerButtons = `
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onBack(); }}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary font-bold transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 flex items-center justify-center group-hover:border-primary transition-all">
              <ArrowLeft size={18} className="rotate-180" />
            </div>
            العودة للوحة التحكم
          </button>
          {onDuplicate && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onDuplicate(job); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:border-primary/30 hover:text-primary transition-all group shadow-sm hover:shadow-md"
            >
              <Copy size={18} className="group-hover:scale-110 transition-transform" /> تكرار الوظيفة
            </button>
          )}
`;
code = code.replace(/<button[\s\S]*?العودة للوحة التحكم \{""\}\s*<\/button>/, headerButtons);

// 5. Rewrite the Form into Tabs
const formStartRegex = /<form onSubmit=\{handleUpdate\} className="space-y-6">([\s\S]*?)<button\s+type="submit"/;
const formMatch = code.match(formStartRegex);
if(formMatch) {
  let formBody = formMatch[1];
  
  // Extract sections
  const divRegex = /<div[\s\S]*?(?=<div className="grid|<div className="space-[y]-|<div className="flex)/g;
  
  // Actually, rewriting the form with tabs natively is cleaner:
  const newFormBody = `
                <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl mb-8">
                  <button type="button" onClick={() => setActiveTab("details")} className={\`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all \${activeTab === "details" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:bg-white/50"}\`}>التفاصيل</button>
                  <button type="button" onClick={() => setActiveTab("filters")} className={\`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all \${activeTab === "filters" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:bg-white/50"}\`}>متطلبات الفرز {isLocked && <span title="مقفل" className="ml-1 inline-flex text-orange-500"><Lock size={14}/></span>}</button>
                  <button type="button" onClick={() => setActiveTab("settings")} className={\`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all \${activeTab === "settings" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:bg-white/50"}\`}>الإعدادات</button>
                </div>

                <div className={activeTab !== "details" ? "hidden" : "space-y-6"}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">المسمى الوظيفي <span className="text-red-500">*</span></label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">الشركة / الفرع <span className="text-red-500">*</span></label>
                      <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">نوع العمل <span className="text-red-500">*</span></label>
                      <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer">
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دوام كامل</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دوام جزئي</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">عن بعد</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">تدريب</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">مقر العمل / المدينة <span className="text-red-500">*</span></label>
                      <SearchableSelect options={SAUDI_CITIES} value={location} onChange={setLocation} placeholder="اختر مقر العمل" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">وصف الوظيفة والمتطلبات <span className="text-red-500">*</span></label>
                    <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="اكتب وصفاً مفصلاً للوظيفة والمهارات المطلوبة..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none min-h-[100px]" />
                  </div>
                </div>

                <div className={activeTab !== "filters" ? "hidden" : "space-y-6"}>
                  {isLocked && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-2xl border border-orange-200 dark:border-orange-900/50">
                      <Lock size={20} className="shrink-0" />
                      <p className="text-sm font-bold leading-relaxed">(تم قفل التعديل لوجود متقدمين، وذلك للحفاظ على دقة التقييم الآلي)</p>
                    </div>
                  )}
                  <div className={"grid grid-cols-1 md:grid-cols-2 gap-6 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">سنوات الخبرة المطلوبة <span className="text-red-500">*</span></label>
                      <select disabled={isLocked} value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer">
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">بدون خبرة</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">1-3 سنوات</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">3-5 سنوات</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">5+ سنوات</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">الحد الأدنى للمؤهل <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>
                      <select disabled={isLocked} value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer">
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ثانوي</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دبلوم</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">بكالوريوس</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ماجستير</option>
                      </select>
                    </div>
                  </div>
                  <div className={"space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <label className="text-sm font-bold text-navy dark:text-white block">التخصصات المستهدفة <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>
                    <div className="relative">
                      <input type="text" disabled={isLocked} value={newMajorInput} onChange={(e) => setNewMajorInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newMajorInput.trim() && !targetMajors.includes(newMajorInput.trim())) { setTargetMajors([...targetMajors, newMajorInput.trim()]); setNewMajorInput(""); } } }} placeholder="أضف تخصصاً..." className="w-full pr-4 pl-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:border-primary transition-all font-medium" />
                      <button type="button" disabled={isLocked} onClick={() => { if (newMajorInput.trim() && !targetMajors.includes(newMajorInput.trim())) { setTargetMajors([...targetMajors, newMajorInput.trim()]); setNewMajorInput(""); } }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all"><Plus size={18} /></button>
                    </div>
                    {targetMajors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {targetMajors.map((major) => (
                          <span key={major} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold border border-blue-200 dark:border-blue-800/50 shadow-sm">{major}
                            <button type="button" disabled={isLocked} onClick={() => setTargetMajors(targetMajors.filter(m => m !== major))} className="hover:text-red-500"><X size={14} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={"space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <label className="text-sm font-bold text-navy dark:text-white block">المهارات والتفضيلات <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>
                    <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl">
                      {selectedSkills.length === 0 && <span className="text-sm text-slate-400 dark:text-slate-500 py-2">لم يتم اختيار مهارات بعد...</span>}
                      {selectedSkills.map((skill) => (
                        <button key={skill} type="button" disabled={isLocked} onClick={() => toggleSkill(skill)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all">{skill} <X size={14} /></button>
                      ))}
                    </div>
                    <div className="relative">
                      <input type="text" disabled={isLocked} value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(e); } }} placeholder="أضف مهارة..." className="w-full pr-6 pl-14 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                      <button type="button" disabled={isLocked} onClick={addCustomSkill} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary transition-all"><Plus size={20} /></button>
                    </div>
                  </div>
                  <div className={"space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <label className="text-sm font-bold text-navy dark:text-white block">اللغات المطلوبة <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedLanguages.map((lang) => (
                        <span key={lang} className="bg-primary text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">{lang}
                          <button type="button" disabled={isLocked} onClick={() => setSelectedLanguages(selectedLanguages.filter(l => l !== lang))}><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <select disabled={isLocked} value="" onChange={(e) => { const val = e.target.value; if (val && !selectedLanguages.includes(val)) setSelectedLanguages([...selectedLanguages, val]); }} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary transition-all font-medium appearance-none cursor-pointer">
                        <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر لغة لإضافتها...</option>
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="العربية">العربية</option>
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الإنجليزية">الإنجليزية</option>
                      </select>
                    </div>
                  </div>

                  {/* Knockout Questions inside Filter Tab */}
                  <div className={"space-y-4 pt-6 mt-6 border-t font-medium border-slate-200 dark:border-slate-700 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                     <label className="text-sm font-bold text-navy dark:text-white flex items-center gap-2">
                       الأسئلة التقييمية التلقائية (Knockout Questions)
                     </label>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-2xl">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                            <div className="md:col-span-6">
                              <label className="text-xs font-bold text-slate-500 mb-1 block">نص السؤال</label>
                              <input type="text" disabled={isLocked} value={newKqText} onChange={(e) => setNewKqText(e.target.value)} placeholder="مثال: هل تمتلك رخصة قيادة سارية؟" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm" />
                            </div>
                            <div className="md:col-span-4">
                              <label className="text-xs font-bold text-slate-500 mb-1 block">نوع الإجابة</label>
                              <select disabled={isLocked} value={newKqType} onChange={(e) => setNewKqType(e.target.value as any)} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm appearance-none cursor-pointer">
                                <option value="yes_no">نعم / لا</option>
                                <option value="options">خيارات متعددة</option>
                              </select>
                            </div>
                            <div className="md:col-span-2 flex items-end">
                              <button type="button" disabled={isLocked} onClick={(e) => { e.preventDefault(); if (!newKqText.trim()) { alert("يرجى إدخال نص السؤال!"); return; } setKnockoutQuestions([...knockoutQuestions, { text: newKqText.trim(), type: newKqType, options: newKqType === "options" ? newKqOptions : undefined, requiredAnswer: newKqType === "yes_no" ? "نعم" : newKqOptions[0] }]); setNewKqText(""); }} className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white transition-all font-bold py-3 px-4 rounded-xl text-sm h-[46px] flex items-center justify-center gap-2">
                                <Plus size={16}/> أضف
                              </button>
                            </div>
                          </div>
                          {knockoutQuestions.length > 0 && (
                            <div className="space-y-3 mt-6">
                              {knockoutQuestions.map((q, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                  <div><p className="font-bold text-navy dark:text-white text-sm mb-1">{q.text}</p>
                                  <p className="text-xs text-slate-500">{q.type === "yes_no" ? "نعم/لا" : "خيارات متعددة"} - الإجابة المطلوبة: <span className="font-bold text-primary">{q.requiredAnswer}</span></p></div>
                                  <button type="button" disabled={isLocked} onClick={() => setKnockoutQuestions(knockoutQuestions.filter((_, i) => i !== idx))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><Trash2 size={16} /></button>
                                </div>
                              ))}
                            </div>
                          )}
                     </div>
                  </div>
                </div>

                <div className={activeTab !== "settings" ? "hidden" : "space-y-6"}>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 block">نطاق الراتب المتوقع (ريال) <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>
                    <div className="flex items-center gap-4">
                      <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="من..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                      <span className="text-slate-400 font-bold">-</span>
                      <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="إلى..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                    </div>
                    <div className="relative mt-3 flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input type="checkbox" className="sr-only peer" checked={isSalaryHidden} onChange={(e) => setIsSalaryHidden(e.target.checked)} />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                        <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء الراتب عن المتقدمين (يُستخدم للفرز الآلي فقط)</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="md:col-span-2 flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-navy dark:text-white flex items-center gap-2"><Calendar className="text-primary" size={16} /> التواريخ والجدولة</label>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <span className="ml-3 font-bold text-sm text-navy dark:text-white">إعلان مستمر (مفتوح دائماً)</span>
                        <input type="checkbox" className="sr-only peer" checked={isOpenEnded} onChange={(e) => setIsOpenEnded(e.target.checked)} />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2">بدء التقديم</label>
                      <input required type="datetime-local" lang="en" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-left" dir="ltr" />
                    </div>
                    {!isOpenEnded && (
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy dark:text-white mr-2">انتهاء التقديم</label>
                        <input required type="datetime-local" lang="en" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-left" dir="ltr" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center transition-all \${status === "نشط" ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-400 dark:text-slate-500"}\`}><CheckCircle size={20} /></div>
                      <div>
                        <p className="font-bold text-navy dark:text-white">حالة الوظيفة: {status}</p><p className="text-xs text-slate-500 font-medium">تحويل الحالة إلى {status === "نشط" ? "مغلق" : "نشط"}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setStatus(status === "نشط" ? "مغلق" : "نشط")} className={\`w-14 h-8 rounded-full relative transition-all \${status === "نشط" ? "bg-green-500" : "bg-slate-300"}\`}>
                      <div className={\`absolute top-1 w-6 h-6 bg-white dark:bg-slate-800 rounded-full transition-all \${status === "نشط" ? "left-1" : "left-7"}\`} />
                    </button>
                  </div>
                </div>
`;
  code = code.replace(formStartRegex, `<form onSubmit={handleUpdate} className="space-y-6">${newFormBody}               <button type="submit"`);
}

// 6. Sticky Sidebar
code = code.replace(/<div className="space-y-8">\s+<div className="bg-white/g, '<div className="space-y-8 sticky top-24">\n            <div className="bg-white');

fs.writeFileSync('src/ManageJob.tsx.new', code, 'utf8');
