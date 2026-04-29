const fs = require('fs');

const content = fs.readFileSync('src/Shared.tsx', 'utf8');
const lines = content.split(/\r?\n/);
let start = lines.findIndex(l => l.includes('activeTab === "باقات فرز"'));
let end = lines.findIndex((l, i) => i > start && l.includes('activeTab === "المظهر"'));

if (start === -1 || end === -1) {
  console.log('Could not find start or end bounds.');
  process.exit(1);
}

const before = lines.slice(0, start);
const after = lines.slice(end);

const newLines = `          {activeTab === "باقات فرز" && (
            <div className="space-y-12 max-w-6xl mx-auto pb-10">
              
              {/* Modern Header & Current Plan */}
              <div className="text-center space-y-4 mb-2">
                {userProfile.subscription_tier !== 'free' && (
                  <div className="inline-flex items-center gap-4 bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 dark:border-primary/30 px-6 py-3 rounded-full shadow-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <span className="font-bold">
                      باقتك الحالية: {userProfile.subscription_tier === 'one-time' ? 'الإعلان الواحد' : userProfile.subscription_tier === 'growth' ? 'انطلاق' : userProfile.subscription_tier === 'business' ? 'أعمال' : 'احترافية'}
                    </span>
                  </div>
                )}
              </div>

              {/* Toggle Switch */}
              <div className="flex justify-center mb-14">
                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl inline-flex items-center relative border border-slate-200 dark:border-slate-700 shadow-inner">
                  <button
                    onClick={() => setBillingCycle('subscription')}
                    className={\`relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 \${billingCycle === 'subscription' ? 'text-white' : 'text-slate-500 hover:text-navy dark:hover:text-white'}\`}
                  >
                    اشتراكات مستمرة
                  </button>
                  <button
                    onClick={() => setBillingCycle('one-time')}
                    className={\`relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 \${billingCycle === 'one-time' ? 'text-white' : 'text-slate-500 hover:text-navy dark:hover:text-white'}\`}
                  >
                    توظيف لمرة واحدة
                  </button>
                  
                  {/* Sliding Background */}
                  <div 
                    className="absolute inset-y-1.5 w-[calc(50%-0.375rem)] bg-primary rounded-xl shadow-md transition-transform duration-500 ease-out"
                    style={{ transform: billingCycle === 'subscription' ? 'translateX(0)' : 'translateX(-100%)', right: '0.375rem' }}
                  />
                </div>
              </div>

              {/* Corporate Plans - Pricing Table Style */}
              {billingCycle === 'subscription' && (
                <div className="flex flex-wrap justify-center gap-8 lg:gap-10 items-center">
                  {/* Growth */}
                  <div className="relative bg-white dark:bg-slate-800 w-full max-w-[340px] rounded-[2rem] p-10 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 flex flex-col group hover:-translate-y-2">
                    <div className="mb-8 text-center">
                      <h5 className="text-2xl font-black text-navy dark:text-white mb-2">انطلاق</h5>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">للشركات الناشئة في طور التوسع.</p>
                    </div>
                    <div className="mb-8 border-b border-slate-100 dark:border-slate-700/50 pb-8 text-center flex flex-col items-center">
                      <div className="flex items-end gap-1 mb-3 justify-center">
                        <span className="text-6xl font-black text-navy dark:text-white tracking-tight">499</span>
                        <span className="text-sm font-bold text-slate-400 mb-2">ريال/شهر</span>
                      </div>
                      <span className="text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 px-4 py-1.5 rounded-full tracking-wider inline-block">
                        وفر قيمة شهرين مجاناً
                      </span>
                    </div>
                    <ul className="space-y-5 mb-10 flex-1">
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">3 وظائف نشطة متزامنة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">رصيد 1,000 سيرة ذاتية للفرز</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">لوحة تحكم متكاملة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">تقارير فرز دقيقة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">أرشفة بيانات المتقدمين</span>
                      </li>
                    </ul>
                    <button onClick={() => { setUserProfile({...userProfile, subscription_tier: 'growth'}); alert('تم الترقية إلى باقة انطلاق بنجاح.'); }} className="w-full bg-slate-50 hover:bg-navy text-navy hover:text-white dark:bg-slate-700 dark:text-white dark:hover:bg-primary py-4 rounded-xl font-bold transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-600 hover:border-transparent dark:hover:border-transparent text-sm tracking-wide">
                      {userProfile.subscription_tier === 'growth' ? 'باقتك الحالية' : 'اختيار الباقة'}
                    </button>
                  </div>

                  {/* Business */}
                  <div className="relative bg-white dark:bg-slate-800 w-full max-w-[360px] rounded-[2rem] p-10 border-2 border-primary shadow-2xl shadow-primary/20 dark:shadow-none flex flex-col transform md:scale-105 hover:-translate-y-2 transition-all duration-300 z-10">
                    <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                      <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">الأكثر شيوعاً</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-[2rem] pointer-events-none"></div>
                    <div className="mb-8 relative z-10 text-center mt-2">
                      <h5 className="text-2xl font-black text-primary mb-2">أعمال</h5>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">للشركات المتوسطة والاحتياج المستمر.</p>
                    </div>
                    <div className="mb-8 border-b border-primary/10 pb-8 relative z-10 text-center flex flex-col items-center">
                      <div className="flex items-end gap-1 mb-3 justify-center">
                        <span className="text-6xl font-black text-navy dark:text-white tracking-tight">1,499</span>
                        <span className="text-sm font-bold text-slate-400 mb-2">ريال/شهر</span>
                      </div>
                      <span className="text-xs font-black bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light px-4 py-1.5 rounded-full tracking-wider inline-block">
                        وفر 2,990 ريال مجاناً
                      </span>
                    </div>
                    <ul className="space-y-5 mb-10 flex-1 relative z-10">
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">10 وظائف نشطة متزامنة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">رصيد 5,000 سيرة ذاتية للفرز</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">لوحة تحكم متكاملة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">تقارير فرز دقيقة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">أرشفة بيانات المتقدمين</span>
                      </li>
                    </ul>
                    <button onClick={() => { setUserProfile({...userProfile, subscription_tier: 'business'}); alert('تم الترقية إلى باقة أعمال بنجاح.'); }} className="w-full bg-primary hover:bg-primary-dark text-white shadow-xl shadow-primary/40 py-4 rounded-xl font-bold transition-all duration-300 active:scale-95 text-sm tracking-wide relative z-10">
                      {userProfile.subscription_tier === 'business' ? 'باقتك الحالية' : 'اختيار الباقة'}
                    </button>
                  </div>

                  {/* Enterprise */}
                  <div className="relative bg-white dark:bg-slate-800 w-full max-w-[340px] rounded-[2rem] p-10 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 flex flex-col group hover:-translate-y-2">
                    <div className="mb-8 text-center">
                      <h5 className="text-2xl font-black text-navy dark:text-white mb-2">احترافية</h5>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">للشركات الكبرى والتوظيف المكثف.</p>
                    </div>
                    <div className="mb-8 border-b border-slate-100 dark:border-slate-700/50 pb-8 text-center flex flex-col items-center">
                      <div className="flex items-end gap-1 mb-3 justify-center">
                        <span className="text-6xl font-black text-navy dark:text-white tracking-tight">3,499</span>
                        <span className="text-sm font-bold text-slate-400 mb-2">ريال/شهر</span>
                      </div>
                      <span className="text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 px-4 py-1.5 rounded-full tracking-wider inline-block">
                        وفر قيمة شهرين مجاناً
                      </span>
                    </div>
                    <ul className="space-y-5 mb-10 flex-1">
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">عدد لامحدود من الوظائف النشطة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">رصيد 15,000 سيرة ذاتية للفرز</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">لوحة تحكم متكاملة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">تقارير فرز دقيقة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">أرشفة بيانات المتقدمين</span>
                      </li>
                    </ul>
                    <button onClick={() => { setUserProfile({...userProfile, subscription_tier: 'enterprise'}); alert('تم الترقية إلى الباقة الاحترافية بنجاح.'); }} className="w-full bg-slate-50 hover:bg-navy text-navy hover:text-white dark:bg-slate-700 dark:text-white dark:hover:bg-primary py-4 rounded-xl font-bold transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-600 hover:border-transparent dark:hover:border-transparent text-sm tracking-wide">
                      {userProfile.subscription_tier === 'enterprise' ? 'باقتك الحالية' : 'اختيار الباقة'}
                    </button>
                  </div>
                </div>
              )}

              {/* One-Time Plan */}
              {billingCycle === 'one-time' && (
                <div className="max-w-[380px] mx-auto">
                  <div className="relative bg-white dark:bg-slate-800 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl shadow-slate-200/50 dark:shadow-none flex flex-col hover:-translate-y-2 transition-all duration-300">
                    <div className="mb-8 text-center">
                      <h5 className="text-2xl font-black text-primary mb-2">الإعلان الواحد</h5>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">مثالية للاحتياج الفوري. انشر إعلاناً وظيفياً واحداً بصلاحية 30 يوماً، مع فرز آلي لـ 500 سيرة ذاتية.</p>
                    </div>
                    <div className="mb-8 border-b border-slate-100 dark:border-slate-700/50 pb-8 text-center flex flex-col items-center">
                      <div className="flex items-end gap-1 mb-3 justify-center">
                        <span className="text-6xl font-black text-navy dark:text-white tracking-tight">199</span>
                        <span className="text-sm font-bold text-slate-400 mb-2">ريال</span>
                      </div>
                      <span className="text-xs font-black bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300 px-4 py-1.5 rounded-full tracking-wider uppercase inline-block">
                        تدفع لمرة واحدة
                      </span>
                    </div>
                    <ul className="space-y-5 mb-10 flex-1">
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">وظيفة واحدة نشطة بصلاحية 30 يوماً</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">رصيد 500 سيرة ذاتية للفرز الآلي</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">لوحة تحكم متكاملة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">تقارير فرز دقيقة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">أرشفة بيانات المتقدمين</span>
                      </li>
                    </ul>
                    <button onClick={() => { setUserProfile({...userProfile, subscription_tier: 'one-time'}); alert('تم الاشتراك في باقة الإعلان الواحد بنجاح.'); }} className="w-full bg-primary hover:bg-primary-dark text-white shadow-xl shadow-primary/30 py-4 rounded-xl font-bold transition-all duration-300 active:scale-95 text-sm tracking-wide">
                      {userProfile.subscription_tier === 'one-time' ? 'باقتك الحالية' : 'شراء الإعلان'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
`.split('\n');

const fullNewContent = before.join('\n') + '\n' + newLines.join('\n') + '\n' + after.join('\n');
fs.writeFileSync('src/Shared.tsx', fullNewContent, 'utf8');
console.log('Successfully applied premium UI touches.');
