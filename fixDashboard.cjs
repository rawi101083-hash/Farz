const fs = require('fs');

const dashboardPath = './src/components/Dashboard.tsx';
let content = fs.readFileSync(dashboardPath, 'utf8');

const tbodyIndex = content.indexOf('<tbody>');

if (tbodyIndex === -1) {
  console.log('Could not find <tbody>');
  process.exit(1);
}

const corruptedStart = content.indexOf('if (selectedApplicantIds.includes(row.id)) {', tbodyIndex);

if (corruptedStart === -1) {
  console.log('Could not find corrupted start');
  process.exit(1);
}

const correctCode = `                  <tbody>
                    {jobs.length === 0 ? (
                      <tr>
                        <td colSpan={isSelectionMode ? 7 : 6} className="p-0">
                          <EmptyState
                            title="لوحة التحكم بانتظارك! لم تقم بإنشاء أي شواغر وظيفية حتى الآن."
                            actionLabel="أنشئ إعلان وظيفي الآن"
                            onAction={onCreateJob}
                          />
                        </td>
                      </tr>
                    ) : isLoadingApplicants && applicants.length === 0 ? (
                      <tr>
                        <td colSpan={isSelectionMode ? 7 : 6} className="p-8">
                          <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white dark:bg-slate-800/50">
                            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                            <h3 className="text-xl font-bold text-navy dark:text-white mb-2">
                              جاري جلب بيانات المرشحين...
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                              يرجى الانتظار قليلاً بينما نقوم بتجهيز قائمة المتقدمين.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : visibleApplicants.length === 0 ? (
                      <tr>
                        <td colSpan={isSelectionMode ? 7 : 6} className="p-0">
                          <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white dark:bg-slate-800/50">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner-3d">
                              <Search size={32} className="text-slate-300 dark:text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-navy dark:text-white mb-2">
                              {decisionFilter === "accepted" ? "لا يوجد مرشحين مقبولين حالياً" : decisionFilter === "rejected" ? "لا يوجد مرشحين مرفوضين حالياً" : "لا يوجد مرشحين قيد المراجعة في الوقت الحالي"}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                              لم يتم العثور على أي مرشح مطابق لخيارات التصفية الحالية.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {" "}
                        {visibleApplicants.map((row, index) => (
                          <motion.tr
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={row.id}
                            className="hover:bg-slate-50 dark:bg-slate-800/80 transition-colors group"
                          >
                            {" "}
                            {isSelectionMode && (
                              <td className="px-3 py-4 w-10">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    `;

const part1 = content.substring(0, tbodyIndex);
const part2 = content.substring(corruptedStart);

const newContent = part1 + correctCode + part2;

fs.writeFileSync(dashboardPath, newContent);
console.log('Fixed successfully');
