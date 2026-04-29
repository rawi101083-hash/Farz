const txt = require('fs').readFileSync('src/App.tsx', 'utf8').split('\n');

for (let i = 0; i < txt.length; i++) {
  const L = txt[i];
  
  // Table badges
  if (L.includes('bg-slate-100 text-slate-700') || L.includes('bg-slate-100') || L.includes('text-slate-700')) {
    if (L.includes('كاشير') || L.includes('مبيعات') || L.includes('فوري') || L.includes('status')) {
       // We'll just dump instances of bg-slate-100 to catch these badges
       console.log('BADGE at', i+1, L.trim());
    }
  }

  // Table Headers
  if (L.includes('اسم المتقدم') || L.includes('المسمى الوظيفي')) {
       console.log('HEADER at', i+1, L.trim());
  }

  // Talent Pool tabs
  if (L.includes('التقييم') || L.includes('المهارة')) {
       console.log('TAB at', i+1, L.trim());
  }

  // Alert texts
  if (L.includes('text-employer-green') || (L.includes('text-green') && L.includes('dark:'))) {
       console.log('ALERT/GREEN at', i+1, L.trim());
  }
}
