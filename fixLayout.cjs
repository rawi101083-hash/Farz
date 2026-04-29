const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const startIndex = content.indexOf('            ) : (\n              <>\n                {job.recordType !== "campaign"');
const endIndex = content.indexOf('              </>\n            )}\n          </div>\n        </motion.div>');

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  {job.recordType !== "campaign" && job.campaignDescription && (
                    <div className="bg-primary/5 border border-primary/20 rounded-[28px] p-8 -mt-4 mb-8 text-center shadow-sm">
                      <p className="text-navy dark:text-white font-medium text-lg leading-relaxed"><Sparkles className="inline-block mr-2 -mt-1 text-primary" size={24} /> {job.campaignDescription}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-primary rounded-full" /> نبذة عن الدور
                    </h3>
                    <div className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap text-base">
                      {activeRole?.roleSummary || job.roleSummary || activeRole?.description || job.description}
                    </div>
                  </div>

                  {((activeRole?.targetMajors?.length ?? 0) > 0 || (job.targetMajors?.length ?? 0) > 0) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> التخصصات المطلوبة
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(activeRole?.targetMajors || job.targetMajors || []).map((major, i) => (
                          <span key={i} className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-100/50 dark:border-blue-800/20 shadow-sm transition-all hover:-translate-y-0.5">
                            {major}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(activeRole?.responsibilities || job.responsibilities) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المهام والمسؤوليات
                      </h3>
                      <ul className="space-y-4 list-none">
                        {(activeRole?.responsibilities || job.responsibilities || '').split('\\n').filter(r => r.trim()).map((res, i) => (
                          <li key={i} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-base">
                            <div className="mt-1 shrink-0 bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                               <CheckCircle size={16} strokeWidth={2.5} />
                            </div>
                            <span className="leading-relaxed pt-0.5">{res.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(activeRole?.qualifications || job.qualifications) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المؤهلات العلمية والعملية
                      </h3>
                      <ul className="space-y-4 list-none">
                        {(activeRole?.qualifications || job.qualifications || '').split('\\n').filter(q => q.trim()).map((qual, i) => (
                          <li key={i} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-base">
                            <div className="mt-1 shrink-0 bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-full text-blue-600 dark:text-blue-400">
                               <GraduationCap size={16} strokeWidth={2.5} />
                            </div>
                            <span className="leading-relaxed pt-0.5">{qual.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(activeRole?.benefits || job.benefits) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المميزات
                      </h3>
                      <ul className="space-y-4 list-none">
                        {(activeRole?.benefits || job.benefits || '').split('\\n').filter(b => b.trim()).map((ben, i) => (
                          <li key={i} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-base">
                            <div className="mt-1 shrink-0 bg-amber-50 dark:bg-amber-900/30 p-1.5 rounded-full text-amber-600 dark:text-amber-400">
                               <Sparkles size={16} strokeWidth={2.5} />
                            </div>
                            <span className="leading-relaxed pt-0.5">{ben.replace(/\\(اختياري\\)/g, '').trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-[28px] border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none sticky top-8 space-y-8">
                    <button onClick={onApply} className="w-full bg-primary text-white py-4 rounded-2xl text-lg font-bold hover:bg-teal-600 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-3">
                      التقديم على هذه الوظيفة
                    </button>
                    
                    {(activeRole?.skills?.length || job.skills?.length || activeRole?.languages?.length || job.languages?.length) ? (
                      <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="text-lg font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><CheckCircle size={20} /></div> المهارات واللغات
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(activeRole?.skills || job.skills || []).map((skill) => (
                            <span key={skill} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-600 shadow-sm">
                              {skill}
                            </span>
                          ))}
                          {(activeRole?.languages || job.languages || []).map((lang) => (
                            <span key={lang} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl text-sm font-bold border border-blue-200 dark:border-blue-800 shadow-sm">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="text-lg font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Briefcase size={20} /></div> تفاصيل العمل
                        </h4>
                        <div className="space-y-4">
                          {((activeRole?.locations?.length ? activeRole.locations : job.locations?.length ? job.locations : (activeRole?.location || job.location) ? [activeRole?.location || job.location] : [])).map((loc, idx) => (
                            <div key={idx} className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary shadow-sm shrink-0"><MapPin size={14} /></div>
                              <span className="pt-0.5">{loc}</span>
                            </div>
                          ))}
                          {(activeRole?.type || job.type) && (
                            <div className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary shadow-sm shrink-0"><Clock size={14} /></div>
                              <span className="pt-0.5">{activeRole?.type || job.type}</span>
                            </div>
                          )}
                          {!(activeRole?.isSalaryHidden ?? job.isSalaryHidden) && (activeRole?.salaryMin || job.salaryMin) && (
                            <div className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary shadow-sm shrink-0"><CreditCard size={14} /></div>
                              <span className="pt-0.5">{activeRole?.salaryMin || job.salaryMin} {(activeRole?.salaryMax || job.salaryMax) ? \`- ${activeRole?.salaryMax || job.salaryMax}\` : ''} ريال</span>
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>`;
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex + 19); 
  fs.writeFileSync('src/App.tsx', content);
  console.log('Replaced successfully');
} else {
  console.log('Indexes not found', startIndex, endIndex);
}
