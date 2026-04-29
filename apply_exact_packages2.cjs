const fs = require('fs');

let code = fs.readFileSync('src/Shared.tsx', 'utf8');

const startStr = '{activeTab === "باقات فرز" && (';
const endStr = '          {activeTab === "المظهر" && (';

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.log('Bounds not found');
  process.exit(1);
}

const replacement = `{activeTab === "باقات فرز" && (
            <div className="space-y-12 pb-10">
              
              {/* Header Toggles & Pill */}
              <div className="flex flex-col items-center gap-6 mb-8">
                {/* Pulsing Pill */}
                <div className="border border-teal-500 text-teal-600 px-5 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 bg-white shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></div>
                  باقتك الحالية: {userProfile?.subscription_tier === 'startup' ? 'انطلاق' : userProfile?.subscription_tier === 'business' ? 'أعمال' : userProfile?.subscription_tier === 'enterprise' ? 'احترافية' : 'لا يوجد'}
                </div>
                
                {/* Toggle Wrapper */}
                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1 shadow-inner">
                  <button
                    onClick={() => setBillingCycle('subscription')}
                    className={\`px-8 py-3 rounded-xl text-sm font-bold transition-all \${billingCycle === 'subscription' ? 'bg-teal-500 text-white shadow-md' : 'text-slate-500 hover:text-navy dark:hover:text-white'}\`}
                  >
                    اشتراكات مستمرة
                  </button>
                  <button
                    onClick={() => setBillingCycle('one-time')}
                    className={\`px-8 py-3 rounded-xl text-sm font-bold transition-all \${billingCycle === 'one-time' ? 'bg-teal-500 text-white shadow-md' : 'text-slate-500 hover:text-navy dark:hover:text-white'}\`}
                  >
                    توظيف لمرة واحدة
                  </button>
                </div>
              </div>

              {billingCycle === 'subscription' && (
                <div className="flex flex-col md:flex-row justify-center gap-6 items-center">
                  
                  {/* انطلاق (Right) */}
                  <div className="w-full max-w-[300px] bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40 flex flex-col items-center">
                    <h3 className="text-2xl font-black text-navy dark:text-white mb-2">انطلاق</h3>
                    <p className="text-xs text-slate-500 mb-6 text-center">للشركات الناشئة في طور التوسع.</p>
                    
                    <div className="flex flex-col items-center mb-2">
                      <span className="text-[3rem] font-black text-navy dark:text-white">499</span>
                      <span className="text-slate-400 font-bold text-xs mt-1">ريال / شهر</span>
                    </div>
                    
                    <div className="bg-emerald-50 text-teal-600 text-[10px] font-bold px-3 py-1 rounded-full mb-8">
                      شهرين مجاناً بالدفع السنوي
                    </div>
                    
                    <ul className="space-y-4 mb-8 w-full">
                      {[
                        "3 وظائف متزامنة", "1,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <CheckCircle size={14} className="text-teal-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-3.5 rounded-xl text-sm font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors mt-auto">
                      باقتك الحالية
                    </button>
                  </div>

                  {/* أعمال (Center) */}
                  <div className="w-full max-w-[340px] bg-white dark:bg-slate-800 rounded-[2rem] p-8 border-2 border-teal-500 shadow-2xl shadow-teal-500/20 flex flex-col items-center transform md:-translate-y-4 relative z-10">
                    <h3 className="text-3xl font-black text-teal-500 mb-2">أعمال</h3>
                    <p className="text-sm text-slate-500 mb-6 text-center">للشركات المتوسطة والاحتياج المستمر.</p>
                    
                    <div className="flex flex-col items-center mb-2">
                      <span className="text-[4rem] leading-none font-black text-navy dark:text-white mb-2">1,499</span>
                      <span className="text-slate-400 font-bold text-xs">ريال / شهر</span>
                    </div>
                    
                    <div className="bg-emerald-50 text-teal-600 text-[10px] font-bold px-3 py-1 rounded-full mb-8">
                      شهرين مجاناً بالدفع السنوي
                    </div>
                    
                    <ul className="space-y-4 mb-8 w-full">
                      {[
                        "10 وظائف متزامنة", "5,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                          <CheckCircle size={16} className="text-teal-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-4 rounded-xl text-sm font-bold bg-teal-500 text-white hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/30 mt-auto">
                      اختيار الباقة
                    </button>
                  </div>

                  {/* احترافية (Left) */}
                  <div className="w-full max-w-[300px] bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40 flex flex-col items-center">
                    <h3 className="text-2xl font-black text-navy dark:text-white mb-2">احترافية</h3>
                    <p className="text-xs text-slate-500 mb-6 text-center">للشركات الكبرى والتوظيف المكثف.</p>
                    
                    <div className="flex flex-col items-center mb-2">
                      <span className="text-[3rem] font-black text-navy dark:text-white">3,499</span>
                      <span className="text-slate-400 font-bold text-xs mt-1">ريال / شهر</span>
                    </div>
                    
                    <div className="bg-emerald-50 text-teal-600 text-[10px] font-bold px-3 py-1 rounded-full mb-8">
                      شهرين مجاناً بالدفع السنوي
                    </div>
                    
                    <ul className="space-y-4 mb-8 w-full">
                      {[
                        "وظائف غير محدودة", "15,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <CheckCircle size={14} className="text-teal-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-3.5 rounded-xl text-sm font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors mt-auto">
                      اختيار الباقة
                    </button>
                  </div>

                </div>
              )}

              {billingCycle === 'one-time' && (
                <div className="flex justify-center">
                  {/* إعلان لمرة واحدة */}
                  <div className="w-full max-w-[340px] bg-white dark:bg-slate-800 rounded-[2rem] p-8 border-2 border-teal-500 shadow-2xl shadow-teal-500/20 flex flex-col items-center">
                    <h3 className="text-3xl font-black text-teal-500 mb-2">إعلان لمرة واحدة</h3>
                    <p className="text-sm text-slate-500 mb-6 text-center">مثالية لاحتياج فوري لمنصب واحد.</p>
                    
                    <div className="flex flex-col items-center mb-2">
                      <span className="text-[4rem] leading-none font-black text-navy dark:text-white mb-2">199</span>
                      <span className="text-slate-400 font-bold text-xs">ريال / إعلان</span>
                    </div>
                    
                    <div className="bg-emerald-50 text-teal-600 text-[10px] font-bold px-3 py-1 rounded-full mb-8 opacity-0 pointer-events-none">
                      شهرين مجاناً
                    </div>
                    
                    <ul className="space-y-4 mb-8 w-full">
                      {[
                        "نشر إعلان وظيفي واحد", "50 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "دعم فني"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                          <CheckCircle size={16} className="text-teal-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-4 rounded-xl text-sm font-bold bg-teal-500 text-white hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/30 mt-auto">
                      شراء الإعلان
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
`;

const newCode = code.substring(0, startIndex) + replacement + code.substring(endIndex);
fs.writeFileSync('src/Shared.tsx', newCode, 'utf8');
console.log('Successfully restored the exact requested design.');
