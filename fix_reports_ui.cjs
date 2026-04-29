const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Shared.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldStart = '{/* Bottom Row: Full Width Bar Chart for Rejection Reasons */}';
const startIndex = content.indexOf(oldStart);

if (startIndex !== -1) {
  // Find the end of this block. It ends with </ResponsiveContainer> </div> </div>
  // Let's find the third </div> after oldStart.
  const endPattern = '</ResponsiveContainer> \n          </div> \n        </div> \n      </div>';
  
  // To be safe, let's just find the exact next section or the end of the return statement.
  // We know it's the last element before the end of the component which is `</div> \n  );`
  
  const endOfComponent = '    </div>\n  );\n};';
  const endIndex = content.lastIndexOf(endOfComponent);
  
  if (endIndex !== -1 && startIndex < endIndex) {
    const newUI = `{/* Bottom Row: Full Width Bar Chart for Candidate Quality Index */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-navy dark:text-white">
              مؤشر جودة المتقدمين
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1">
              تحليل مستويات كفاءة المتقدمين بناءً على نسب المطابقة.
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
             <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">لا توجد بيانات كافية</div>
          )}
        </div>
      </div>
`;
    content = content.substring(0, startIndex) + newUI + content.substring(endIndex);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('UI Block Replaced!');
  } else {
    console.log('Could not find endIndex');
  }
} else {
  console.log('Could not find startIndex');
}
