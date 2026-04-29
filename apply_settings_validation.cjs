const fs = require('fs');

let code = fs.readFileSync('src/Shared.tsx', 'utf8');

// 1. Update SettingsPage Props
code = code.replace(
  /export const SettingsPage = \(\{[\s\S]*?\}\) => \{/,
  `export const SettingsPage = ({
  darkMode,
  setDarkMode,
  userProfile,
  setUserProfile,
  userEmail
}: {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userProfile: any;
  setUserProfile: any;
  userEmail?: string;
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    if (userProfile.entityType === 'company') {
      if (userProfile.commercialRegistration && !/^\\d{10}$/.test(userProfile.commercialRegistration)) {
        newErrors.cr = "يجب أن يتكون السجل التجاري من 10 أرقام بالضبط";
      }
      if (userProfile.taxNumber && !/^\\d{15}$/.test(userProfile.taxNumber)) {
        newErrors.tax = "يجب أن يتكون الرقم الضريبي من 15 رقماً بالضبط";
      }
    } else if (userProfile.entityType === 'freelance') {
      if (userProfile.freelanceDocument && !/^[A-Za-z0-9\\-]{6,15}$/.test(userProfile.freelanceDocument)) {
        newErrors.freelance = "يجب أن تتكون الوثيقة من 6 إلى 15 خانة (أحرف إنجليزية وأرقام وشرطة فقط)";
      }
    }
    setErrors(newErrors);
  }, [userProfile.commercialRegistration, userProfile.taxNumber, userProfile.freelanceDocument, userProfile.entityType]);`
);

// 2. Add Email field to Profile tab
code = code.replace(
  /(\<div className="space-y-2 md:col-span-2"\>\s*\<label.*?المسمى الوظيفي\<\/label\>\s*\<input.*?\/ \>\s*\<\/div\>)/,
  `$1
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-navy dark:text-slate-300">البريد الإلكتروني</label>
                  <input type="email" value={userEmail || ""} disabled className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-slate-400 text-slate-500 border rounded-2xl cursor-not-allowed outline-none font-medium" />
                </div>`
);

// 3. Add Validation messages to Company tab
code = code.replace(
  /(\<input\s*type="text"\s*value=\{userProfile\.commercialRegistration \|\| ""\}[\s\S]*?dir="ltr"\s*\/\>)/,
  `$1
                    {errors.cr && <p className="text-red-500 text-xs mt-1 font-bold">{errors.cr}</p>}`
);

code = code.replace(
  /(\<input\s*type="text"\s*value=\{userProfile\.freelanceDocument \|\| ""\}[\s\S]*?dir="ltr"\s*\/\>)/,
  `$1
                    {errors.freelance && <p className="text-red-500 text-xs mt-1 font-bold">{errors.freelance}</p>}`
);

code = code.replace(
  /(\<input\s*type="text"\s*value=\{userProfile\.taxNumber \|\| ""\}[\s\S]*?dir="ltr"\s*\/\>\s*\<\/div\>)/,
  `$1
                  {errors.tax && <p className="text-red-500 text-xs mt-1 font-bold">{errors.tax}</p>}`
);

// 4. Update Save button
code = code.replace(
  /\<button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-primary\/30 transition-all active:scale-95"\>\s*حفظ التغييرات\s*\<\/button\>/,
  `<button 
                disabled={Object.keys(errors).length > 0}
                className={\`px-10 py-4 rounded-2xl font-bold transition-all active:scale-95 \${Object.keys(errors).length > 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500' : 'bg-primary text-white hover:shadow-lg hover:shadow-primary/30'}\`}
              >
                حفظ التغييرات
              </button>`
);

fs.writeFileSync('src/Shared.tsx', code, 'utf8');
console.log('Settings validation applied.');
