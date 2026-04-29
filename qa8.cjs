const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Textareas onPaste magic for description and responsibilities
const textFormatHelper = `
  const formatPastedText = (e: React.ClipboardEvent<HTMLTextAreaElement>, currentVal: string, setter: (val: string) => void) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    if (!paste) return;
    const formatted = paste.split('\\n').map(line => {
      const trimmed = line.trim();
      if ((trimmed.startsWith('-') || trimmed.startsWith('*')) && !trimmed.startsWith('**')) {
        return '• ' + trimmed.substring(1).trim();
      }
      return line;
    }).join('\\n');
    
    // Check if the field is empty to just set it, else append. A simple approach used here:
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const newVal = currentVal.substring(0, start) + formatted + currentVal.substring(end);
    setter(newVal);
  };
`;

if (!code.includes('const formatPastedText')) {
  code = code.replace(
    'const [isReactivating, setIsReactivating] = useState(false);',
    `const [isReactivating, setIsReactivating] = useState(false);\n${textFormatHelper}`
  );
}

// Add onPaste to description textarea
code = code.replace(
  /<textarea rows=\{6\} value=\{description\} onChange=\{\(e\) => setDescription\(e\.target\.value\)\} placeholder=/g,
  '<textarea onPaste={(e) => formatPastedText(e, description, setDescription)} rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder='
);

// Add onPaste to responsibilities textarea
code = code.replace(
  /<textarea\s*rows=\{4\}\s*value=\{responsibilities\}\s*onChange=\{\(e\) => setResponsibilities\(e\.target\.value\)\}/g,
  '<textarea\n                    onPaste={(e) => formatPastedText(e, responsibilities, setResponsibilities)}\n                    rows={4}\n                    value={responsibilities}\n                    onChange={(e) => setResponsibilities(e.target.value)}'
);

// Add Expected Salary to Applicant interface
code = code.replace(
  /decision\?: "accepted" \| "rejected" \| "pending";/g,
  `decision?: "accepted" | "rejected" | "pending";\n  expectedSalary?: number;`
);

// Initialize expectedSalary in ApplicantForm state
if (!code.includes('expectedSalary: "",')) {
  code = code.replace(
    /linkedin: "",\s*source: "",/,
    'linkedin: "",\n    expectedSalary: "",\n    source: "",'
  );
}

// Add expectedSalary input field to ApplicantForm UI
const salaryInputUI = `
            {/* Expected Salary Input */}
            {!(activeRole?.isSalaryHidden ?? job?.isSalaryHidden) && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  ما هو الراتب المتوقع (بالريال السعودي)؟ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">ر.س</span>
                  <input
                    required
                    type="number"
                    name="expectedSalary"
                    min="0"
                    placeholder="مثال: 5000"
                    value={formDataState.expectedSalary}
                    onChange={handleInputChange}
                    className="w-full pr-12 pl-5 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-navy dark:text-white"
                  />
                </div>
              </div>
            )}
`;

if (!code.includes('expectedSalary"')) {
  code = code.replace(
    /<\/div>\s*\{shouldShowPhotoUpload && \(/,
    `</div>\n${salaryInputUI}\n              {shouldShowPhotoUpload && (`
  );
}

// Delete expectedSalary from submitData before sending to Webhook
if (!code.includes('delete submitData.expectedSalary;')) {
  code = code.replace(
    /delete submitData\.linkedin;\s*delete submitData\.source;/,
    'delete submitData.linkedin;\n    delete submitData.source;\n    delete submitData.expectedSalary;'
  );
}

// Add Expected Salary Badge to Match Analysis View
const salaryBadgeUI = `
                  {/* Expected Salary Badge */}
                  {applicant.expectedSalary && (
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 mb-0 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                      <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">
                        💰 <span className="text-slate-500 dark:text-slate-400">ملاحظة مالية: الراتب المتوقع للمتقدم</span> ({applicant.expectedSalary} ريال) {activeRole?.salaryMin ? \` - نطاق الوظيفة (\${activeRole.salaryMin} إلى \${activeRole.salaryMax || 'غير محدد'} ريال)\` : ''}
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700">`;

if (!code.includes('ملاحظة مالية: الراتب المتوقع للمتقدم')) {
  code = code.replace(
    /<div className="bg-slate-50 dark:bg-slate-800\/50 p-6 rounded-\[32px\] border border-slate-100 dark:border-slate-700">/g,
    salaryBadgeUI
  );
}


fs.writeFileSync('src/App.tsx', code, 'utf8');
