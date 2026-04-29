const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

const tStart = c.indexOf('{activeTab === "audio" && (');
const tEnd = c.indexOf('{activeTab === "questions" && (');

if (tStart === -1 || tEnd === -1) {
  console.log("Could not find blocks!");
  process.exit(1);
}

const originalBlock = c.substring(tStart, tEnd);

const newBlock = `{activeTab === "audio" && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-6">
                  {candidate?.voiceEvalUrl ? (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex flex-col gap-3 mb-5">
                         <div className="flex items-start justify-between gap-4">
                           <h4 className="text-sm font-bold text-navy dark:text-white leading-relaxed">
                             الإجابة الصوتية للمتقدم
                           </h4>
                           <span className="px-3 py-1.5 rounded-full font-bold shrink-0 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-[10px]">
                             ملف مسجل
                           </span>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <audio 
                          src={candidate.voiceEvalUrl} 
                          controls
                          className="w-full"
                          preload="metadata"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 text-center text-slate-500">
                      لا يوجد تسجيل صوتي متاح لهذا المتقدم.
                    </div>
                  )}
                </motion.div>
              )}

              `;

c = c.slice(0, tStart) + newBlock + c.slice(tEnd);

fs.writeFileSync('src/App.tsx', c);
console.log("Audio UI natively updated!");
