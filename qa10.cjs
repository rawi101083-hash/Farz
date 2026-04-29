const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace('التفاصيل الوظيفية (منهجية ATS)', 'التفاصيل الوظيفية');
c = c.replace('نطاق الراتب المتوقع (ريال)', 'ميزانية الوظيفة / الراتب');
c = c.replace('<span className="text-xs text-slate-500 font-bold block">الراتب الأساسي</span>', '<span className="text-xs text-slate-500 font-bold block">الحد الأدنى للراتب</span>');
c = c.replace('<span className="text-xs text-slate-500 font-bold block">الحد الأعلى <span className="text-slate-400 font-normal ml-1">(اختياري للرواتب المتفاوتة)</span></span>', '<span className="text-xs text-slate-500 font-bold block">الحد الأعلى للراتب - اختياري</span>');

fs.writeFileSync('src/App.tsx', c);
