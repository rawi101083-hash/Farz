const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(`<button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent("showToast", { detail: "تم التحديث بنجاح" }));
                          setTimeout(() => {
                            handleSubmit(e as unknown as React.FormEvent);
                          }, 1000);
                        }}`, `<button
                        type="submit"`);

c = c.replace(`<button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent("showToast", { detail: "تم التحديث بنجاح" }));
                          setTimeout(() => {
                            handleSubmit(e as unknown as React.FormEvent);
                          }, 1000);
                        }}`, `<button
                        type="submit"`);

// Sometimes the text inside the toast differs, so let's use a regex replacement to catch them:

c = c.replace(/<button[\s\S]*?onClick=\{\(e\) => \{[\s\S]*?e\.preventDefault\(\);[\s\S]*?window\.dispatchEvent\(new CustomEvent\("showToast"[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?onSubmit\(baseJobData as any, initialData\?\.id\);[\s\S]*?\}, 1000\);[\s\S]*?\}\}[\s\S]*? className="(w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary\/90 hover:shadow-lg hover:-translate-y-0\.5 transition-all flex items-center justify-center gap-2)"\s*>\s*نشر الإعلان الآن\s*<\/button>/g,
  `<button
                        type="submit"
                        className="$1"
                      >
                        نشر الإعلان الآن
                      </button>`);

c = c.replace(/<button[\s\S]*?onClick=\{\(e\) => \{[\s\S]*?e\.preventDefault\(\);[\s\S]*?window\.dispatchEvent\(new CustomEvent\("showToast"[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?handleSubmit\(e as unknown as React\.FormEvent\);[\s\S]*?\}, 1000\);[\s\S]*?\}\}[\s\S]*? className="(w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary\/90 hover:shadow-lg hover:-translate-y-0\.5 transition-all flex items-center justify-center gap-2)"\s*>\s*حفظ التعديلات\s*<\/button>/g,
  `<button
                        type="submit"
                        className="$1"
                      >
                        حفظ التعديلات
                      </button>`);


c = c.replace(/<button\s*type="submit"\s*onClick=\{\(e\) => \{\s*if \(adType !== "single"\) \{\s*if \(initialData\?\.status === "مسودة" \|\| !initialData\) \{\s*window\.dispatchEvent\(new CustomEvent\("showToast", \{ detail: "تم نشر الإعلان بنجاح، هو الآن متاح للمتقدمين" \}\)\);\s*\} else \{\s*window\.dispatchEvent\(new CustomEvent\("showToast", \{ detail: "تم تحديث بيانات الإعلان بنجاح" \}\)\);\s*\}\s*\}\s*\}\}\s*className="(w-full md:w-auto px-10 bg-primary text-white py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:-translate-y-0\.5 transition-all)"\s*>\s*نشر الإعلان الوظيفي\s*<\/button>/g,
  `<button
                    type="submit"
                    className="$1"
                  >
                    نشر الإعلان الوظيفي
                  </button>`);


fs.writeFileSync('src/App.tsx', c);
console.log("Publish action fixed.");
