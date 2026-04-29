const fs = require('fs');
let content = fs.readFileSync('src/components/JobApplication.tsx', 'utf-8');

// Fix birth date
const bdRegex = /<label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">\s*تاريخ الميلاد <span className="text-red-500">\*<\/span>\s*<\/label>\s*<input\s*required\s*name="birthDate"\s*type="date"\s*lang="en-US"\s*dir="ltr"/;

if (bdRegex.test(content)) {
  content = content.replace(bdRegex, `<label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  تاريخ الميلاد <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="birthDate"
                  type="date"`);
  console.log('Fixed birthDate');
} else {
  if (content.includes('name="birthDate"') && !content.includes('lang="en-US"')) {
    console.log('birthDate already fixed');
  } else {
    console.log('FAILED to fix birthDate');
  }
}

// Remove text-left from birthDate
content = content.replace(/className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800\/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary\/10 focus:border-primary outline-none transition-all font-medium text-left"\s*\/>\s*<\/div>\s*<div className="space-y-3">\s*<label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">\s*الجنس/, `className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  الجنس`);

const expectTarget = `{(activeRole?.askExpectedSalary === "open" || activeRole?.askExpectedSalary === "ranges" || (!activeRole?.askExpectedSalary && (job?.askExpectedSalary === "open" || job?.askExpectedSalary === "ranges"))) && (`

const availabilityHTML = `
              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  مدة الانضمام / الجاهزية للعمل <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="availability"
                  type="text"
                  value={(formDataState as any).availability || ""}
                  onChange={handleInputChange}
                  placeholder="مثال: فوري، أسبوعين، شهر"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                />
              </div>

              `;

if (!content.includes('name="availability"')) {
  if (content.includes(expectTarget)) {
    content = content.replace(expectTarget, availabilityHTML + expectTarget);
    console.log('Added availability');
  } else {
    console.log('Could not add availability');
  }
} else {
  console.log('Availability already exists');
}

fs.writeFileSync('src/components/JobApplication.tsx', content);
