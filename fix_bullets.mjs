import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const repsPattern = /<ul className="space-y-3 list-disc list-inside px-2">\s*\{\(activeRole\?.responsibilities \|\| job\.responsibilities \|\| ''\)\.split\('\\n'\)\.filter\(\(r: string\) => r\.trim\(\)\)\.map\(\(res: string, i: number\) => \(\s*<li key=\{i\} className="text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">\s*\{res\.trim\(\)\}\s*<\/li>\s*\)\)\}\s*<\/ul>/;

const repsReplace = `<ul className="space-y-3 list-none px-2">
                        {(activeRole?.responsibilities || job.responsibilities || '').split('\\n').filter((r: string) => r.trim()).map((res: string, i: number) => {
                          const cleanLine = res.trim();
                          const hasBullet = /^[-•*]/.test(cleanLine) || /^\\d+\\./.test(cleanLine);
                          return (
                            <li key={i} className="flex gap-3 items-start text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">
                              {!hasBullet && <span className="mt-2 text-[0.4rem] text-slate-400 shrink-0">{"\\u25CF"}</span>}
                              <span>{cleanLine}</span>
                            </li>
                          );
                        })}
                      </ul>`;

const qualsPattern = /<ul className="space-y-3 list-disc list-inside px-2">\s*\{\(activeRole\?.qualifications \|\| job\.qualifications \|\| ''\)\.split\('\\n'\)\.filter\(\(q: string\) => q\.trim\(\)\)\.map\(\(qual: string, i: number\) => \(\s*<li key=\{i\} className="text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">\s*\{qual\.trim\(\)\}\s*<\/li>\s*\)\)\}\s*<\/ul>/;

const qualsReplace = `<ul className="space-y-3 list-none px-2">
                        {(activeRole?.qualifications || job.qualifications || '').split('\\n').filter((q: string) => q.trim()).map((qual: string, i: number) => {
                          const cleanLine = qual.trim();
                          const hasBullet = /^[-•*]/.test(cleanLine) || /^\\d+\\./.test(cleanLine);
                          return (
                            <li key={i} className="flex gap-3 items-start text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">
                              {!hasBullet && <span className="mt-2 text-[0.4rem] text-slate-400 shrink-0">{"\\u25CF"}</span>}
                              <span>{cleanLine}</span>
                            </li>
                          );
                        })}
                      </ul>`;

const benPattern = /<ul className="space-y-3 list-disc list-inside px-2">\s*\{\(activeRole\?.benefits \|\| job\.benefits \|\| ''\)\.split\('\\n'\)\.filter\(\(b: string\) => b\.trim\(\)\)\.map\(\(ben: string, i: number\) => \(\s*<li key=\{i\} className="text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">\s*\{ben\.replace\(\/\\\(اختياري\\\)\/g, ''\)\.trim\(\)\}\s*<\/li>\s*\)\)\}\s*<\/ul>/;

const benReplace = `<ul className="space-y-3 list-none px-2">
                        {(activeRole?.benefits || job.benefits || '').split('\\n').filter((b: string) => b.trim()).map((ben: string, i: number) => {
                          const cleanLine = ben.replace(/\\(اختياري\\)/g, '').trim();
                          const hasBullet = /^[-•*]/.test(cleanLine) || /^\\d+\\./.test(cleanLine);
                          return (
                            <li key={i} className="flex gap-3 items-start text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">
                              {!hasBullet && <span className="mt-2 text-[0.4rem] text-slate-400 shrink-0">{"\\u25CF"}</span>}
                              <span>{cleanLine}</span>
                            </li>
                          );
                        })}
                      </ul>`;

if (!repsPattern.test(content)) console.error('Failed to match responsibilities');
if (!qualsPattern.test(content)) console.error('Failed to match qualifications');
if (!benPattern.test(content)) console.error('Failed to match benefits');

content = content.replace(repsPattern, repsReplace);
content = content.replace(qualsPattern, qualsReplace);
content = content.replace(benPattern, benReplace);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated successfully.');
