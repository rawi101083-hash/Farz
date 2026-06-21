const fs = require('fs');
let p = 'src/components/Dashboard.tsx';
let data = fs.readFileSync(p, 'utf8');

const searchStr = `                    <motion.div
                      key={idx}
                      whileHover={{ y: -3, scale: 1.01 }}
                      className={\`p-5 rounded-2xl border \${stat.borderColor} shadow-sm \${stat.bgClass} flex items-center justify-between relative overflow-hidden group\`}
                    >
                      {/* Decorative Background Blur */}
                      <div className="absolute -left-6 -top-6 w-20 h-20 bg-emerald-400/20 dark:bg-emerald-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={\`w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200/50 dark:from-emerald-900/60 dark:to-emerald-800/40 rounded-lg flex items-center justify-center shadow-inner\`}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold mb-0.5">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">`;

const replaceStr = `                    <motion.div
                      key={idx}
                      whileHover={{ y: -3, scale: 1.01 }}
                      className={\`p-5 rounded-2xl border \${stat.borderColor} shadow-sm \${stat.bgClass} flex items-center justify-between relative overflow-hidden group\`}
                    >
                      {/* Decorative Background Blur */}
                      <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/40 dark:bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={\`w-12 h-12 \${stat.iconBg} rounded-xl flex items-center justify-center shadow-inner\`}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">`;

if (data.includes(searchStr)) {
  data = data.replace(searchStr, replaceStr);
  fs.writeFileSync(p, data, 'utf8');
  console.log("Success");
} else {
  console.log("Not found");
}
