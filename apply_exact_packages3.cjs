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
            <div className="space-y-8 pb-10 flex flex-col items-center">
              
              {/* Header Toggles & Pill */}
              <div className="flex flex-col items-center gap-5 mb-4">
                {/* Pulsing Pill */}
                <div className="border border-teal-600 text-teal-700 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2 bg-white shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></div>
                  باقتك الحالية: {userProfile?.subscription_tier === 'startup' ? 'انطلاق' : userProfile?.subscription_tier === 'business' ? 'أعمال' : userProfile?.subscription_tier === 'enterprise' ? 'احترافية' : 'لا يوجد'}
                </div>
                
                {/* Toggle Wrapper */}
                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-[14px] flex gap-1 shadow-inner">
                  <button
                    onClick={() => setBillingCycle('subscription')}
                    className={\`px-6 py-2 rounded-xl text-xs font-bold transition-all \${billingCycle === 'subscription' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:text-navy dark:hover:text-white'}\`}
                  >
                    اشتراكات مستمرة
                  </button>
                  <button
                    onClick={() => setBillingCycle('one-time')}
                    className={\`px-6 py-2 rounded-xl text-xs font-bold transition-all \${billingCycle === 'one-time' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:text-navy dark:hover:text-white'}\`}
                  >
                    توظيف لمرة واحدة
                  </button>
                </div>
              </div>

              {billingCycle === 'subscription' && (
                <div className="flex flex-col md:flex-row justify-center gap-4 items-center w-full max-w-5xl mx-auto">
                  
                  {/* احترافية (Left) */}
                  <div className="w-full max-w-[260px] bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40 flex flex-col items-center">
                    <h3 className="text-xl font-black text-navy dark:text-white mb-1">احترافية</h3>
                    <p className="text-[10px] text-slate-500 mb-5 text-center">للشركات الكبرى والتوظيف المكثف.</p>
                    
                    <div className="flex flex-col items-center mb-2">
                      <span className="text-4xl font-black text-navy dark:text-white">3,499</span>
                      <span className="text-slate-400 font-bold text-[10px] mt-1">ريال / شهر</span>
                    </div>
                    
                    <div className="bg-emerald-50 text-teal-700 text-[9px] font-bold px-2 py-1 rounded-full mb-6">
                      شهرين مجاناً بالدفع السنوي
                    </div>
                    
                    <ul className="space-y-3 mb-6 w-full">
                      {[
                        "وظائف غير محدودة", "15,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          <CheckCircle size={14} className="text-teal-600 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-3 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors mt-auto">
                      اختيار الباقة
                    </button>
                  </div>

                  {/* أعمال (Center) */}
                  <div className="w-full max-w-[280px] bg-white dark:bg-slate-800 rounded-3xl p-7 border-2 border-teal-600 shadow-2xl shadow-teal-600/20 flex flex-col items-center transform md:-translate-y-3 relative z-10">
                    <h3 className="text-2xl font-black text-teal-600 mb-1">أعمال</h3>
                    <p className="text-[11px] text-slate-500 mb-5 text-center">للشركات المتوسطة والاحتياج المستمر.</p>
                    
                    <div className="flex flex-col items-center mb-2">
                      <span className="text-5xl leading-none font-black text-navy dark:text-white mb-1">1,499</span>
                      <span className="text-slate-400 font-bold text-[10px]">ريال / شهر</span>
                    </div>
                    
                    <div className="bg-emerald-50 text-teal-700 text-[9px] font-bold px-2 py-1 rounded-full mb-6">
                      شهرين مجاناً بالدفع السنوي
                    </div>
                    
                    <ul className="space-y-3 mb-6 w-full">
                      {[
                        "10 وظائف متزامنة", "5,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                          <CheckCircle size={16} className="text-teal-600 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-3 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/30 mt-auto">
                      اختيار الباقة
                    </button>
                  </div>

                  {/* انطلاق (Right) */}
                  <div className="w-full max-w-[260px] bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40 flex flex-col items-center">
                    <h3 className="text-xl font-black text-navy dark:text-white mb-1">انطلاق</h3>
                    <p className="text-[10px] text-slate-500 mb-5 text-center">للشركات الناشئة في طور التوسع.</p>
                    
                    <div className="flex flex-col items-center mb-2">
                      <span className="text-4xl font-black text-navy dark:text-white">499</span>
                      <span className="text-slate-400 font-bold text-[10px] mt-1">ريال / شهر</span>
                    </div>
                    
                    <div className="bg-emerald-50 text-teal-700 text-[9px] font-bold px-2 py-1 rounded-full mb-6">
                      شهرين مجاناً بالدفع السنوي
                    </div>
                    
                    <ul className="space-y-3 mb-6 w-full">
                      {[
                        "3 وظائف متزامنة", "1,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          <CheckCircle size={14} className="text-teal-600 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-3 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors mt-auto">
                      باقتك الحالية
                    </button>
                  </div>

                </div>
              )}

              {billingCycle === 'one-time' && (
                <div className="flex justify-center w-full">
                  {/* إعلان لمرة واحدة */}
                  <div className="w-full max-w-[280px] bg-white dark:bg-slate-800 rounded-3xl p-7 border-2 border-teal-600 shadow-2xl shadow-teal-600/20 flex flex-col items-center">
                    <h3 className="text-2xl font-black text-teal-600 mb-1">إعلان لمرة واحدة</h3>
                    <p className="text-[11px] text-slate-500 mb-5 text-center">مثالية لاحتياج فوري لمنصب واحد.</p>
                    
                    <div className="flex flex-col items-center mb-2">
                      <span className="text-5xl leading-none font-black text-navy dark:text-white mb-1">199</span>
                      <span className="text-slate-400 font-bold text-[10px]">ريال / إعلان</span>
                    </div>
                    
                    <div className="bg-emerald-50 text-teal-700 text-[9px] font-bold px-2 py-1 rounded-full mb-6 opacity-0 pointer-events-none">
                      شهرين مجاناً
                    </div>
                    
                    <ul className="space-y-3 mb-6 w-full">
                      {[
                        "نشر إعلان وظيفي واحد", "50 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "دعم فني"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                          <CheckCircle size={16} className="text-teal-600 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-3 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/30 mt-auto">
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
console.log('Successfully restored the exact requested design (small and dark teal).');
