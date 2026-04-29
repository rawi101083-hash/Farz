const fs = require('fs');
let txt = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add 'mixed_file' to CustomAttachment types
txt = txt.replace(
  /attachment_type: "file" \| "link"( \| "image" \| "video" \| "document")?;/g,
  `attachment_type: "file" | "link" | "image" | "video" | "document" | "mixed_file";`
);

txt = txt.replace(
  /useState<"file" \| "link"( \| "image" \| "video" \| "document")?>\(\n?.*?\s*"file",?\n?\s*\);/g,
  `useState<"file" | "link" | "image" | "video" | "document" | "mixed_file">("mixed_file");`
);

// 2. Add 'mixed_file' option to CreateJob dropdown
txt = txt.replace(
  /setNewAttachmentType\(e\.target\.value as [^)]+\)/,
  'setNewAttachmentType(e.target.value as "file" | "link" | "image" | "video" | "document" | "mixed_file")'
);

txt = txt.replace(
  /<option value="file">ملف PDF<\/option>/,
  `<option value="file">ملف PDF</option>\n                      <option value="mixed_file">مستند أو صورة (PDF / JPG / PNG)</option>`
);

txt = txt.replace(
  /att\.attachment_type === "file"\s*\?\s*"ملف PDF"/,
  `att.attachment_type === "file" ? "ملف PDF" : att.attachment_type === "mixed_file" ? "مستند أو صورة (PDF/JPG)"`
);


// 3. Render 'mixed_file' in ApplicantForm
const applicantMixedFileJsx = `
                  ) : att.attachment_type === "mixed_file" ? (
                    <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-primary hover:bg-slate-50 dark:bg-slate-800/50 transition-all cursor-pointer group">
                      <input
                        required
                        type="file"
                        name={\`customAttachment_\${idx}\`}
                        accept=".pdf,image/jpeg,image/png,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:bg-primary/10 flex items-center justify-center transition-all">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm font-bold text-navy dark:text-white">
                         اختر مستند أو صورة
                      </p>
                    </div>`;

txt = txt.replace(/(\) : att\.attachment_type === "link" \? \()/, applicantMixedFileJsx + '\n$1');

// Wait, the user already added "image", "video", "document". If I inject this before "link", it's fine.
// Actually, earlier in ApplicantForm:
// `att.attachment_type === "link" ? ( ... ) : (<div fallback file...>)`
// Let's replace the ApplicantForm fallback exactly by tracking the logic.
// Find the mapping in ApplicantForm for customAttachments
// <label>{att.attachment_name} <span class red>*</label>
// {att.attachment_type === "link" ? ( <input url /> ) : att.attachment_type === "image" ? ... : ( <div file /> )}
// Since we want `mixed_file` handled:

// 4. Force "رابط معرض أعمال/Portfolio" to be optional.
// The user already tried to add: `{requiredAttachments.includes('رابط معرض أعمال/Portfolio') && <span className="text-red-500 mr-1">*</span>}`
// We will replace that with always optional!
txt = txt.replace(
  /\{requiredAttachments\.includes\('رابط معرض أعمال\/Portfolio'\)\s*&&\s*<span className="text-red-500 mr-1">\*<\/span>\}/g,
  ''
);
txt = txt.replace(
   /\{!requiredAttachments\.includes\('رابط معرض أعمال\/Portfolio'\)\s*&&\s*<span className="text-slate-400 text-xs font-normal"> \(اختياري\)<\/span>\}/g,
   '<span className="text-slate-400 dark:text-slate-500 text-xs font-normal"> (اختياري)</span>'
);
txt = txt.replace(
  /required=\{requiredAttachments\.includes\('رابط معرض أعمال\/Portfolio'\)\}/g,
  'required={false}'
);

fs.writeFileSync('src/App.tsx', txt, 'utf8');
