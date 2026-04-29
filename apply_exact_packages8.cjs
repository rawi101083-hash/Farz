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
            <div className="space-y-8 pb-8 flex flex-col items-center">
              
              {/* Header Toggles & Pill */}
              <div className="flex flex-col items-center gap-5 mb-4">
                {/* Pulsing Pill (Kept pill shaped as in image) */}
                <div className="border border-[#0D9488] text-[#0D9488] px-8 py-2.5 rounded-full text-sm font-black flex items-center gap-3 bg-white shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0D9488] animate-pulse"></div>
                  باقتك الحالية: {userProfile?.subscription_tier === 'startup' ? 'انطلاق' : userProfile?.subscription_tier === 'business' ? 'أعمال' : userProfile?.subscription_tier === 'enterprise' ? 'احترافية' : 'لا يوجد'}
                </div>
                
                {/* Toggle Wrapper - Rectangular */}
                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1 shadow-inner">
                  <button
                    onClick={() => setBillingCycle('subscription')}
                    className={\`px-6 py-2.5 rounded-xl text-sm font-black transition-all \${billingCycle === 'subscription' ? 'bg-[#0D9488] text-white shadow-md transform scale-105' : 'text-slate-500 hover:text-navy dark:hover:text-white'}\`}
                  >
                    اشتراكات مستمرة
                  </button>
                  <button
                    onClick={() => setBillingCycle('one-time')}
                    className={\`px-6 py-2.5 rounded-xl text-sm font-black transition-all \${billingCycle === 'one-time' ? 'bg-[#0D9488] text-white shadow-md transform scale-105' : 'text-slate-500 hover:text-navy dark:hover:text-white'}\`}
                  >
                    توظيف لمرة واحدة
                  </button>
                </div>
              </div>

              {billingCycle === 'subscription' && (
                <div className="flex flex-col md:flex-row justify-center gap-5 items-center w-full max-w-5xl mx-auto mt-2">
                  
                  {/* احترافية (Left) */}
                  <div className="w-full max-w-[260px] bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 flex flex-col items-center transition-transform hover:-translate-y-2 duration-300">
                    <h3 className="text-2xl font-black text-navy dark:text-white mb-2">احترافية</h3>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-6 text-center leading-relaxed">للشركات الكبرى والتوظيف المكثف.</p>
                    
                    <div className="flex flex-col items-center mb-3">
                      <span className="text-4xl font-black text-navy dark:text-white mb-1">3,499</span>
                      <span className="text-slate-500 font-bold text-[10px]">ريال / شهر</span>
                    </div>
                    
                    {/* Rectangular badge */}
                    <div className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-4 py-1.5 rounded-lg mb-8 w-fit text-center">
                      شهرين مجاناً بالدفع السنوي
                    </div>
                    
                    <ul className="space-y-4 mb-8 w-full px-1">
                      {[
                        "وظائف غير محدودة", "15,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[13px] font-black text-slate-700 dark:text-slate-200">
                          <CheckCircle size={16} className="text-[#0D9488] shrink-0" strokeWidth={3} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-3 rounded-xl text-[13px] font-black bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all mt-auto shadow-sm">
                      اختيار الباقة
                    </button>
                  </div>

                  {/* أعمال (Center) */}
                  <div className="w-full max-w-[280px] bg-white dark:bg-slate-800 rounded-[2rem] p-8 border-2 border-[#0D9488] shadow-2xl shadow-[#0D9488]/20 flex flex-col items-center transform md:-translate-y-4 relative z-10 transition-transform hover:-translate-y-6 duration-300 bg-gradient-to-b from-white to-emerald-50/30 dark:from-slate-800 dark:to-slate-800">
                    <h3 className="text-3xl font-black text-[#0D9488] mb-2">أعمال</h3>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-6 text-center leading-relaxed">للشركات المتوسطة والاحتياج المستمر.</p>
                    
                    <div className="flex flex-col items-center mb-3">
                      <span className="text-5xl leading-none font-black text-navy dark:text-white mb-1">1,499</span>
                      <span className="text-slate-500 font-bold text-[10px]">ريال / شهر</span>
                    </div>
                    
                    {/* Rectangular badge */}
                    <div className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-4 py-1.5 rounded-lg mb-8 w-fit text-center">
                      شهرين مجاناً بالدفع السنوي
                    </div>
                    
                    <ul className="space-y-4 mb-8 w-full px-1">
                      {[
                        "10 وظائف متزامنة", "5,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[14px] font-black text-slate-800 dark:text-slate-100">
                          <CheckCircle size={18} className="text-[#0D9488] shrink-0" strokeWidth={3} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-3.5 rounded-xl text-[14px] font-black bg-[#0D9488] text-white hover:bg-[#0b7a70] transition-all shadow-xl shadow-[#0D9488]/40 mt-auto hover:scale-105 active:scale-95">
                      اختيار الباقة
                    </button>
                  </div>

                  {/* انطلاق (Right) */}
                  <div className="w-full max-w-[260px] bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 flex flex-col items-center transition-transform hover:-translate-y-2 duration-300">
                    <h3 className="text-2xl font-black text-navy dark:text-white mb-2">انطلاق</h3>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-6 text-center leading-relaxed">للشركات الناشئة في طور التوسع.</p>
                    
                    <div className="flex flex-col items-center mb-3">
                      <span className="text-4xl font-black text-navy dark:text-white mb-1">499</span>
                      <span className="text-slate-500 font-bold text-[10px]">ريال / شهر</span>
                    </div>
                    
                    {/* Rectangular badge */}
                    <div className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-4 py-1.5 rounded-lg mb-8 w-fit text-center">
                      شهرين مجاناً بالدفع السنوي
                    </div>
                    
                    <ul className="space-y-4 mb-8 w-full px-1">
                      {[
                        "3 وظائف متزامنة", "1,000 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[13px] font-black text-slate-700 dark:text-slate-200">
                          <CheckCircle size={16} className="text-[#0D9488] shrink-0" strokeWidth={3} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-3 rounded-xl text-[13px] font-black bg-slate-50 text-slate-500 border border-slate-200 cursor-not-allowed mt-auto">
                      باقتك الحالية
                    </button>
                  </div>

                </div>
              )}

              {billingCycle === 'one-time' && (
                <div className="flex justify-center w-full mt-2">
                  {/* إعلان لمرة واحدة */}
                  <div className="w-full max-w-[280px] bg-white dark:bg-slate-800 rounded-[2rem] p-8 border-2 border-[#0D9488] shadow-2xl shadow-[#0D9488]/20 flex flex-col items-center transition-transform hover:-translate-y-2 duration-300 bg-gradient-to-b from-white to-emerald-50/30 dark:from-slate-800 dark:to-slate-800">
                    <h3 className="text-3xl font-black text-[#0D9488] mb-2">إعلان لمرة واحدة</h3>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-6 text-center leading-relaxed">مثالية لاحتياج فوري لمنصب واحد.</p>
                    
                    <div className="flex flex-col items-center mb-3">
                      <span className="text-5xl leading-none font-black text-navy dark:text-white mb-1">199</span>
                      <span className="text-slate-500 font-bold text-[10px]">ريال / إعلان</span>
                    </div>
                    
                    <div className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-4 py-1.5 rounded-lg mb-8 opacity-0 pointer-events-none w-fit text-center">
                      شهرين مجاناً
                    </div>
                    
                    <ul className="space-y-4 mb-8 w-full px-1">
                      {[
                        "نشر إعلان وظيفي واحد", "50 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "دعم فني"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[14px] font-black text-slate-800 dark:text-slate-100">
                          <CheckCircle size={18} className="text-[#0D9488] shrink-0" strokeWidth={3} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-3.5 rounded-xl text-[14px] font-black bg-[#0D9488] text-white hover:bg-[#0b7a70] transition-all shadow-xl shadow-[#0D9488]/40 mt-auto hover:scale-105 active:scale-95">
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
console.log('Successfully made toggles and badges rectangular.');
