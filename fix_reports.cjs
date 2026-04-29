const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Shared.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace the computation block
const computationBlockRegex = /\/\/ Rejection reasons[\s\S]*?const rejectionChartHeight = Math\.max\(120, rejectionReasonsData\.length \* 50 \+ 50\);/;

const newComputationBlock = `// Candidate Quality Index
  const highQualityCount = relevantApplicants.filter(a => { const r = a.rating || a.match_percentage || 0; return r >= 80; }).length;
  const mediumQualityCount = relevantApplicants.filter(a => { const r = a.rating || a.match_percentage || 0; return r >= 50 && r < 80; }).length;
  const lowQualityCount = relevantApplicants.filter(a => { const r = a.rating || a.match_percentage || 0; return r < 50; }).length;

  const qualityIndexData = [
    { name: "كفاءة عالية (80%+)", value: highQualityCount, fill: "#22c55e", stroke: "#166534" },
    { name: "متوسطة (50-79%)", value: mediumQualityCount, fill: "#eab308", stroke: "#854d0e" },
    { name: "ضعيفة (<50%)", value: lowQualityCount, fill: "#ef4444", stroke: "#991b1b" }
  ].filter(d => d.value > 0);`;

content = content.replace(computationBlockRegex, newComputationBlock);

// 2. Replace the UI block
const uiBlockRegex = /\{\/\* Bottom Row: Full Width Bar Chart for Rejection Reasons \*\/\}[\s\S]*?(?=\{\/\* End of Reports Component \*\/\}|<\/div>\s*<\/div>\s*\);|\s*return\s*\()/;
// Wait, regex might overshoot. The UI block for rejection reasons starts at { /* Bottom Row: Full Width Bar Chart for Rejection Reasons */ }
// and ends after the ResponsiveContainer and its parent divs.
// Let's use a simpler string replacement for the UI block.

const oldUiStart = '{/* Bottom Row: Full Width Bar Chart for Rejection Reasons */}';
const startIndex = content.indexOf(oldUiStart);
if (startIndex !== -1) {
  // Find the end of the div containing the rejection reasons chart.
  // It's followed by a div closing the main space-y-6 container.
  // Let's just find the last </ResponsiveContainer> </div> </div> and replace up to there.
  
  // We can construct the new UI block.
  const newUIBlock = `{/* Bottom Row: Full Width Bar Chart for Candidate Quality Index */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-navy dark:text-white">
              مؤشر جودة المتقدمين (Candidate Quality Index)
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1">
              تحليل مستويات كفاءة المتقدمين بناءً على نسب المطابقة مع متطلبات الوظائف.
            </p>
          </div>
          <BarChartIcon className="text-slate-300" size={20} />
        </div>
        <div className="w-full h-80 transition-all duration-300" dir="ltr">
          {qualityIndexData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={qualityIndexData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 140, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                  strokeOpacity={0.2}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 500 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 13, fontWeight: "bold" }}
                  width={130}
                  tickMargin={10}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 min-w-[140px] text-right" dir="rtl">
                          <p className="font-bold text-slate-500 dark:text-slate-400 mb-2 text-xs">{label}</p>
                          <p className="text-slate-600 dark:text-slate-300 font-black text-sm mb-2">{payload[0].value} متقدم</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  wrapperStyle={{ pointerEvents: 'auto' }}
                />
                <Bar
                  dataKey="value"
                  radius={12}
                  barSize={40}
                >
                  <LabelList position="right" fill="#64748b" stroke="none" dataKey="value" fontSize={14} fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">لا توجد بيانات كافية لعرض المؤشر</div>
          )}
        </div>
      </div>`;

  const uiRegex = /\{\/\* Bottom Row: Full Width Bar Chart for Rejection Reasons \*\/\}[\s\S]*?<\/ResponsiveContainer>\s*<\/div>\s*<\/div>/;
  content = content.replace(uiRegex, newUIBlock);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done modifying Shared.tsx');
