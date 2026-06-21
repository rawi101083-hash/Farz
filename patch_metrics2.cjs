const fs = require('fs');
let p = 'src/components/Dashboard.tsx';
let data = fs.readFileSync(p, 'utf8');

const replacementStr = `                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                  {[
                    {
                      label: "إجمالي المتقدمين",
                      value: totalCount.toString(),
                      change: \`+\${totalCount}\`,
                      icon: <Users size={18} className="text-emerald-600 dark:text-emerald-400" />,
                      bgClass: "bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-emerald-900/20",
                      iconBg: "bg-gradient-to-br from-emerald-100 to-emerald-200/50 dark:from-emerald-900/60 dark:to-emerald-800/40",
                      borderColor: "border-emerald-100/60 dark:border-emerald-800/40",
                      shadowClass: "shadow-[0_4px_12px_rgba(16,185,129,0.15),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(16,185,129,0.2),inset_0_2px_4px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.3)]",
                      blurClass: "bg-emerald-400/20 dark:bg-emerald-400/10",
                      badgeClass: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/30"
                    },
                    {
                      label: "قيد المراجعة",
                      value: pendingCount.toString(),
                      change: pendingCount > 0 ? "اتخاذ قرار" : "مكتمل",
                      icon: <Clock size={18} className="text-orange-500 dark:text-orange-400" />,
                      bgClass: "bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-800 dark:to-orange-900/20",
                      iconBg: "bg-gradient-to-br from-orange-100 to-orange-200/50 dark:from-orange-900/60 dark:to-orange-800/40",
                      borderColor: "border-orange-100/60 dark:border-orange-800/40",
                      shadowClass: "shadow-[0_4px_12px_rgba(249,115,22,0.15),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(249,115,22,0.2),inset_0_2px_4px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.3)]",
                      blurClass: "bg-orange-400/20 dark:bg-orange-400/10",
                      badgeClass: "bg-orange-100/80 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border border-orange-200/50 dark:border-orange-700/30"
                    },
                    {
                      label: "تم قبولهم",
                      value: acceptedCount.toString(),
                      change: \`+\${acceptedCount} مرشحين\`,
                      icon: <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" />,
                      bgClass: "bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-emerald-900/20",
                      iconBg: "bg-gradient-to-br from-emerald-100 to-emerald-200/50 dark:from-emerald-900/60 dark:to-emerald-800/40",
                      borderColor: "border-emerald-100/60 dark:border-emerald-800/40",
                      shadowClass: "shadow-[0_4px_12px_rgba(16,185,129,0.15),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(16,185,129,0.2),inset_0_2px_4px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.3)]",
                      blurClass: "bg-emerald-400/20 dark:bg-emerald-400/10",
                      badgeClass: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/30"
                    },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3, scale: 1.02 }}
                      className={\`p-4 rounded-xl border \${stat.borderColor} \${stat.shadowClass} \${stat.bgClass} flex items-center justify-between relative overflow-hidden group\`}
                    >
                      {/* Decorative Background Blur */}
                      <div className={\`absolute -left-6 -top-6 w-20 h-20 \${stat.blurClass} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700\`} />
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={\`w-10 h-10 \${stat.iconBg} rounded-lg flex items-center justify-center shadow-inner\`}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold mb-0.5">
                            {stat.label}
                          </p>
                          <p className="text-xl font-black text-slate-800 dark:text-white leading-none drop-shadow-sm">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative z-10">
                        <span className={\`inline-flex items-center justify-center px-2 py-1 rounded-md text-[9px] font-bold shadow-sm \${stat.badgeClass}\`}>
                          {stat.change}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>`;

let startIdx = data.indexOf('<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">');
let endStr = '                </div>';
// Find the first closing div of this block, which is right before `              );`
let closingDivIdx = data.indexOf('                </div>', startIdx);

if (startIdx !== -1 && closingDivIdx !== -1) {
  data = data.slice(0, startIdx) + replacementStr + data.slice(closingDivIdx + endStr.length);
  fs.writeFileSync(p, data, 'utf8');
  console.log("Success with slice");
} else {
  console.log("Failed to slice", startIdx, closingDivIdx);
}
