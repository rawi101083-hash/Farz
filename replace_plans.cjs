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
            <div className="space-y-12 max-w-5xl mx-auto pb-10">
              
              {/* Modern Header & Current Plan */}
              <div className="text-center space-y-4 mb-12">
                <h3 className="text-3xl font-black text-navy dark:text-white">باقات فرز للتوظيف الذكي</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                  اختر الباقة التي تناسب حجم أعمالك وابدأ في توظيف أفضل الكفاءات باستخدام الذكاء الاصطناعي.
                </p>
                
                {userProfile.subscription_tier !== 'free' && (
                  <div className="inline-flex items-center gap-4 bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 dark:border-primary/30 px-6 py-3 rounded-full mt-6 shadow-sm">
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

              {/* Corporate Plans - Pricing Table Style */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Growth */}
                <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
                  <div className="mb-6">
                    <h5 className="text-xl font-bold text-navy dark:text-white mb-2">انطلاق</h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400">للشركات الناشئة في طور التوسع.</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl font-black text-navy dark:text-white">499</span>
                      <span className="text-sm font-bold text-slate-400 mb-1">ريال / شهرياً</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400">أو 4,990 ريال سنوياً (وفر 16%)</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">3 وظائف نشطة متزامنة</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">رصيد 1,000 سيرة ذاتية للفرز</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">دعم فني عبر البريد الإلكتروني</span>
                    </li>
                  </ul>
                  <button onClick={() => { setUserProfile({...userProfile, subscription_tier: 'growth'}); alert('تم الترقية إلى باقة انطلاق بنجاح (وضع المحاكاة).'); }} className="w-full bg-slate-50 hover:bg-primary text-navy hover:text-white dark:bg-slate-700 dark:text-white dark:hover:bg-primary py-4 rounded-xl font-bold transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-600 hover:border-transparent dark:hover:border-transparent">
                    {userProfile.subscription_tier === 'growth' ? 'باقتك الحالية' : 'اختيار الباقة'}
                  </button>
                </div>

                {/* Business */}
                <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-primary shadow-xl flex flex-col transform md:-translate-y-4">
                  <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                    <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">الأكثر شيوعاً</span>
                  </div>
                  <div className="mb-6 mt-2">
                    <h5 className="text-xl font-bold text-primary mb-2">أعمال</h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400">للشركات المتوسطة والاحتياج المستمر.</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl font-black text-navy dark:text-white">1,499</span>
                      <span className="text-sm font-bold text-slate-400 mb-1">ريال / شهرياً</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400">أو 14,990 ريال سنوياً (وفر 16%)</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">10 وظائف نشطة متزامنة</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">رصيد 5,000 سيرة ذاتية للفرز</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">دعم فني ذو أولوية</span>
                    </li>
                  </ul>
                  <button onClick={() => { setUserProfile({...userProfile, subscription_tier: 'business'}); alert('تم الترقية إلى باقة أعمال بنجاح (وضع المحاكاة).'); }} className="w-full bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 py-4 rounded-xl font-bold transition-all duration-300 active:scale-95">
                    {userProfile.subscription_tier === 'business' ? 'باقتك الحالية' : 'اختيار الباقة'}
                  </button>
                </div>

                {/* Enterprise */}
                <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
                  <div className="mb-6">
                    <h5 className="text-xl font-bold text-navy dark:text-white mb-2">احترافية</h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400">للشركات الكبرى والتوظيف المكثف.</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl font-black text-navy dark:text-white">3,499</span>
                      <span className="text-sm font-bold text-slate-400 mb-1">ريال / شهرياً</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400">أو 34,990 ريال سنوياً (وفر 16%)</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">عدد لامحدود من الوظائف النشطة</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">رصيد 15,000 سيرة ذاتية للفرز</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">مدير حساب مخصص</span>
                    </li>
                  </ul>
                  <button onClick={() => { setUserProfile({...userProfile, subscription_tier: 'enterprise'}); alert('تم الترقية إلى الباقة الاحترافية بنجاح (وضع المحاكاة).'); }} className="w-full bg-slate-50 hover:bg-primary text-navy hover:text-white dark:bg-slate-700 dark:text-white dark:hover:bg-primary py-4 rounded-xl font-bold transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-600 hover:border-transparent dark:hover:border-transparent">
                    {userProfile.subscription_tier === 'enterprise' ? 'باقتك الحالية' : 'اختيار الباقة'}
                  </button>
                </div>
              </div>

              {/* Separator / OR */}
              <div className="flex items-center gap-4 py-8">
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                <span className="text-slate-400 font-bold text-sm bg-slate-50 dark:bg-slate-900 px-4 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">أو</span>
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
              </div>

              {/* One-Time Plan Banner */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-right">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner border border-white/10">
                      <Zap size={36} className="text-amber-400" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-2xl font-black text-white mb-3">باقة الإعلان الواحد <span className="text-primary text-lg font-bold ml-2">(الاحتياج الفوري)</span></h4>
                      <p className="text-slate-300 leading-relaxed text-sm font-medium">
                        ليس لديك احتياج مستمر؟ يمكنك نشر إعلان وظيفي واحد يظل نشطاً لمدة 30 يوماً متواصلة، مع رصيد ذكاء اصطناعي لفرز ما يصل إلى 500 سيرة ذاتية بشكل آلي.
                      </p>
                    </div>

                    <div className="flex flex-col items-center shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 md:border-r border-white/10 md:pr-8">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">تدفع لمرة واحدة</span>
                      <div className="flex items-end gap-1 mb-6">
                        <span className="text-4xl font-black text-white">199</span>
                        <span className="text-sm font-bold text-slate-400 mb-1">ريال</span>
                      </div>
                      <button onClick={() => { setUserProfile({...userProfile, subscription_tier: 'one-time'}); alert('تم الاشتراك في باقة الإعلان الواحد بنجاح (وضع المحاكاة).'); }} className="w-full bg-white text-navy hover:bg-slate-100 hover:-translate-y-1 transition-all duration-300 py-3.5 px-8 rounded-xl font-bold shadow-xl active:scale-95">
                        {userProfile.subscription_tier === 'one-time' ? 'باقتك الحالية' : 'شراء الإعلان'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
`.split('\\n');

// Since we define newLines with backticks containing literal newlines, we can just split by \n.
// Wait, actually newLines is defined correctly.
const fullNewContent = before.join('\\n') + '\\n' + newLines.join('\\n') + '\\n' + after.join('\\n');
fs.writeFileSync('src/Shared.tsx', fullNewContent, 'utf8');
console.log('Successfully replaced plans UI.');
