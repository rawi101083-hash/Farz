const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const corruptHead = `<th className="px-2 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-right whitespace-nowrap">
                            title="لوحة التحكم بانتظارك! لم تقم بإنشاء أي شواغر وظيفية حتى الآن."
                            actionLabel="أنشئ إعلان وظيفي الآن"
                            onAction={onCreateJob}
                          />{" "}
                        </td>{" "}
                      </tr>
                    ) : visibleApplicants.length === 0 ? (`;

const correctHead = `<th className="px-2 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-right whitespace-nowrap">المرشح</th>
                      <th className="px-2 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-right whitespace-nowrap">الوظيفة</th>
                      <th className="px-2 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-right whitespace-nowrap">التقييم الآلي</th>
                      <th className="px-2 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-right whitespace-nowrap">القرار</th>
                      <th className="px-2 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-center whitespace-nowrap">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleApplicants.length === 0 ? (`;

if (content.includes(corruptHead)) {
    content = content.replace(corruptHead, correctHead);
    console.log("Fixed corrupted header");
} else {
    // try removing spaces
    const regex1 = /<th className="px-2 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-right whitespace-nowrap">\s*title="لوحة التحكم بانتظارك! لم تقم بإنشاء أي شواغر وظيفية حتى الآن."\s*actionLabel="أنشئ إعلان وظيفي الآن"\s*onAction={onCreateJob}\s*\/>\{" "\}\s*<\/td>\{" "\}\s*<\/tr>\s*\) : visibleApplicants.length === 0 \? \(/g;
    
    if (regex1.test(content)) {
        content = content.replace(regex1, correctHead);
        console.log("Fixed corrupted header using regex");
    } else {
        console.log("Could not find corrupted header");
    }
}

const corruptIifeEnd = `                                  </AnimatePresence>
                                      );
                                    })()}
                                </div>
                              </div>{" "}
                            </td>{" "}
                          </motion.tr>`;

const correctIifeEnd = `                                  </AnimatePresence>
                                      );
                                    })()}
                                </div>
                              </div>
                            </td>
                          </motion.tr>`;
                          
if (content.includes(corruptIifeEnd)) {
    content = content.replace(corruptIifeEnd, correctIifeEnd);
}

fs.writeFileSync('src/components/Dashboard.tsx', content);
