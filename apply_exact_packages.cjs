const fs = require('fs');

let code = fs.readFileSync('src/Shared.tsx', 'utf8');

// 1. Replace state
code = code.replace(
  'const [isYearly, setIsYearly] = useState(false);',
  "const [billingCycle, setBillingCycle] = useState<'subscription' | 'one-time'>('subscription');"
);

// 2. Extract block between activeTab === "باقات فرز" && ( and activeTab === "المظهر" && (
const startStr = '{activeTab === "باقات فرز" && (';
const endStr = '          {activeTab === "المظهر" && (';

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.log('Bounds not found');
  process.exit(1);
}

const replacement = `{activeTab === "باقات فرز" && (
            <div className="space-y-10">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 mb-6 border border-emerald-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  باقتك الحالية: {userProfile?.subscription_tier === 'startup' ? 'انطلاق' : userProfile?.subscription_tier === 'business' ? 'أعمال' : userProfile?.subscription_tier === 'enterprise' ? 'احترافية' : 'لا يوجد'}
                </div>
                
                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1 shadow-inner">
                  <button
                    onClick={() => setBillingCycle('subscription')}
                    className={\`px-8 py-3 rounded-xl text-sm font-bold transition-all \${billingCycle === 'subscription' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-navy dark:hover:text-white'}\`}
                  >
                    اشتراكات مستمرة
                  </button>
                  <button
                    onClick={() => setBillingCycle('one-time')}
                    className={\`px-8 py-3 rounded-xl text-sm font-bold transition-all \${billingCycle === 'one-time' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-navy dark:hover:text-white'}\`}
                  >
                    توظيف لمرة واحدة
                  </button>
                </div>
              </div>

              {billingCycle === 'subscription' && (
                <div className="flex flex-col md:flex-row justify-center gap-6 items-stretch">
                  {/* 3. احترافية */}
                  <div className="w-full max-w-[320px] bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 flex flex-col">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-black text-navy dark:text-white mb-2">احترافية</h3>
                      <p className="text-sm text-slate-500">للشركات الكبرى والتوظيف المكثف.</p>
                    </div>
                    <div className="text-center mb-4">
                      <span className="text-5xl font-black text-navy dark:text-white">3,499</span>
                    </div>
                    <div className="text-center text-slate-400 font-bold text-sm mb-4">
                      ريال / شهر
                    </div>
                    <div className="flex justify-center mb-8">
                      <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full w-fit">شهرين مجاناً بالدفع السنوي</div>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {[
                        "وظائف غير محدودة", "15,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shrink-0"><CheckCircle size={12} /></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-4 rounded-2xl font-bold bg-white text-navy border border-slate-200 hover:bg-slate-50 transition-colors">
                      اختيار الباقة
                    </button>
                  </div>

                  {/* 2. أعمال */}
                  <div className="w-full max-w-[340px] bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-primary shadow-2xl shadow-primary/20 flex flex-col transform md:-translate-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-black text-primary mb-2">أعمال</h3>
                      <p className="text-sm text-slate-500">للشركات المتوسطة والاحتياج المستمر.</p>
                    </div>
                    <div className="text-center mb-4">
                      <span className="text-6xl font-black text-navy dark:text-white">1,499</span>
                    </div>
                    <div className="text-center text-slate-400 font-bold text-sm mb-4">
                      ريال / شهر
                    </div>
                    <div className="flex justify-center mb-8">
                      <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full w-fit">شهرين مجاناً بالدفع السنوي</div>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {[
                        "10 وظائف متزامنة", "5,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><CheckCircle size={12} /></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-4 rounded-2xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                      اختيار الباقة
                    </button>
                  </div>

                  {/* 1. انطلاق */}
                  <div className="w-full max-w-[320px] bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 flex flex-col">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-black text-navy dark:text-white mb-2">انطلاق</h3>
                      <p className="text-sm text-slate-500">للشركات الناشئة في طور التوسع.</p>
                    </div>
                    <div className="text-center mb-4">
                      <span className="text-5xl font-black text-navy dark:text-white">499</span>
                    </div>
                    <div className="text-center text-slate-400 font-bold text-sm mb-4">
                      ريال / شهر
                    </div>
                    <div className="flex justify-center mb-8">
                      <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full w-fit">شهرين مجاناً بالدفع السنوي</div>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {[
                        "3 وظائف متزامنة", "1,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shrink-0"><CheckCircle size={12} /></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-4 rounded-2xl font-bold bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed">
                      باقتك الحالية
                    </button>
                  </div>

                </div>
              )}

              {billingCycle === 'one-time' && (
                <div className="flex justify-center">
                  <div className="w-full max-w-[340px] bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 flex flex-col">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-black text-navy dark:text-white mb-2">إعلان واحد</h3>
                      <p className="text-sm text-slate-500">مثالية للتوظيف الفوري لمرة واحدة.</p>
                    </div>
                    <div className="text-center mb-4">
                      <span className="text-6xl font-black text-navy dark:text-white">199</span>
                    </div>
                    <div className="text-center text-slate-400 font-bold text-sm mb-8">
                      ريال / إعلان
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {[
                        "نشر إعلان وظيفي واحد", "50 سيرة ذاتية للفرز", "تقارير فرز دقيقة", "دعم فني"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shrink-0"><CheckCircle size={12} /></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-4 rounded-2xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                      شراء الإعلان
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}{\n`;

const newCode = code.substring(0, startIndex) + replacement + code.substring(endIndex);
fs.writeFileSync('src/Shared.tsx', newCode, 'utf8');
console.log('Successfully restored the exact requested design.');
