const fs = require('fs');
let content = fs.readFileSync('src/Shared.tsx', 'utf8');

const oldBlockStart = '{activeTab === "»«ﬁ… «·«‘ —«ﬂ" && (';
const oldBlockEndPattern = /<span dir="ltr">1,240 \/ 5,000<\/span>[\s\S]*?<\/div>\s*\}\)\}\{\" \"\}\s*<\/div>\{\" \"\}\s*<\/div>\s*\)\}\{\" \"\}/;

const match = content.match(oldBlockEndPattern);
if (!match) {
    console.error('Could not find the end pattern');
    process.exit(1);
}

const oldBlockEndIndex = match.index + match[0].length;
const startIndex = content.indexOf(oldBlockStart);

if (startIndex === -1) {
    console.error('Could not find the start pattern');
    process.exit(1);
}

const newBlock = \{activeTab === "»«ﬁ«  ›—“" && (
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-black text-navy dark:text-white">»«ﬁ«  «·«‘ —«ﬂ</h2>
                <p className="text-slate-500 font-medium">«Œ — «·»«ﬁ… «· Ì  ‰«”» ÕÃ„ √⁄„«·ﬂ Ê«Õ Ì«Ãﬂ «·ÊŸÌ›Ì</p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <span className={\\\	ext-sm font-bold \\\\}>‘Â—Ì</span>
                  <button 
                    onClick={() => setIsYearly(!isYearly)}
                    className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors"
                  >
                    <div className={\\\bsolute top-1 w-6 h-6 rounded-full bg-primary transition-all \\\\} />
                  </button>
                  <span className={\\\	ext-sm font-bold \\\\}>”‰ÊÌ <span className="text-emerald-500 text-xs ml-1">(Ê›— ﬁÌ„… ‘Â—Ì‰)</span></span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-6 items-center">
                {/* 1. «‰ÿ·«ﬁ */}
                <div className="w-full max-w-[340px] bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20">
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-2">«‰ÿ·«ﬁ</h3>
                  <p className="text-sm text-slate-500 mb-6">··‘—ﬂ«  «·‰«‘∆… Ê«·’€Ì—…</p>
                  <div className="mb-6">
                    <span className="text-4xl font-black text-navy dark:text-white">{isYearly ? "4,990" : "499"}</span>
                    <span className="text-slate-400 font-bold ml-1">—Ì«· / {isYearly ? "”‰ÊÌ«" : "‘Â—Ì«"}</span>
                  </div>
                  {isYearly && <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-lg w-fit mb-6">Ê›— ﬁÌ„… ‘Â—Ì‰!</div>}
                  <ul className="space-y-4 mb-8">
                    {[
                      "·ÊÕ…  Õﬂ„ „ ﬂ«„·…", " ﬁ«—Ì— ›—“ œﬁÌﬁ…", "√—‘›… »Ì«‰«  «·„ ﬁœ„Ì‰", "‰‘— ÊŸÌ› Ì‰ ‰‘ÿ…", "›—“ 500 ”Ì—… –« Ì…"
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shrink-0"><CheckCircle size={12} /></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 rounded-2xl font-bold bg-slate-50 text-navy hover:bg-slate-100 transition-colors border border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    {userProfile?.subscription_tier === 'startup' ? '»«ﬁ ﬂ «·Õ«·Ì…' : '«‘ —ﬂ «·¬‰'}
                  </button>
                </div>

                {/* 2. √⁄„«· */}
                <div className="w-full max-w-[360px] bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-primary shadow-2xl shadow-primary/20 relative transform md:-translate-y-4">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">«·√ﬂÀ— ‘ÌÊ⁄«</div>
                  <h3 className="text-2xl font-black text-navy dark:text-white mb-2">√⁄„«·</h3>
                  <p className="text-sm text-slate-500 mb-6">··‘—ﬂ«  «·„ Ê”ÿ… Ê«·„ ‰«„Ì…</p>
                  <div className="mb-6">
                    <span className="text-5xl font-black text-primary">{isYearly ? "14,990" : "1,499"}</span>
                    <span className="text-slate-400 font-bold ml-1">—Ì«· / {isYearly ? "”‰ÊÌ«" : "‘Â—Ì«"}</span>
                  </div>
                  {isYearly && <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-lg w-fit mb-6">Ê›— 2,990 —Ì«·!</div>}
                  <ul className="space-y-4 mb-8">
                    {[
                      "·ÊÕ…  Õﬂ„ „ ﬂ«„·…", " ﬁ«—Ì— ›—“ œﬁÌﬁ…", "√—‘›… »Ì«‰«  «·„ ﬁœ„Ì‰", "‰‘— 10 ÊŸ«∆› ‰‘ÿ…", "›—“ 5,000 ”Ì—… –« Ì…", " ’œÌ— «·»Ì«‰« ", "œ⁄„ ›‰Ì √Ê·ÊÌ…"
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><CheckCircle size={12} /></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 rounded-2xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    {userProfile?.subscription_tier === 'business' ? '»«ﬁ ﬂ «·Õ«·Ì…' : '«‘ —ﬂ «·¬‰'}
                  </button>
                </div>

                {/* 3. ‘—ﬂ«  ﬂ»—Ï */}
                <div className="w-full max-w-[340px] bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20">
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-2">«Õ —«›Ì…</h3>
                  <p className="text-sm text-slate-500 mb-6">··„‰Ÿ„«  –«  «· ÊŸÌ› «·ﬂÀÌ›</p>
                  <div className="mb-6">
                    <span className="text-4xl font-black text-navy dark:text-white">{isYearly ? "34,990" : "3,499"}</span>
                    <span className="text-slate-400 font-bold ml-1">—Ì«· / {isYearly ? "”‰ÊÌ«" : "‘Â—Ì«"}</span>
                  </div>
                  {isYearly && <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-lg w-fit mb-6">Ê›— ﬁÌ„… ‘Â—Ì‰!</div>}
                  <ul className="space-y-4 mb-8">
                    {[
                      "·ÊÕ…  Õﬂ„ „ ﬂ«„·…", " ﬁ«—Ì— ›—“ œﬁÌﬁ…", "√—‘›… »Ì«‰«  «·„ ﬁœ„Ì‰", "‰‘— ÊŸ«∆› €Ì— „ÕœÊœ", "›—“ ”Ì— –« Ì… €Ì— „ÕœÊœ", "Ê«ÃÂ… »—„Ã…  ÿ»Ìﬁ«  API", "„œÌ— Õ”«» „Œ’’"
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shrink-0"><CheckCircle size={12} /></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 rounded-2xl font-bold bg-slate-50 text-navy hover:bg-slate-100 transition-colors border border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    {userProfile?.subscription_tier === 'enterprise' ? '»«ﬁ ﬂ «·Õ«·Ì…' : ' Ê«’· „⁄‰«'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center py-6">
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-1/4"></div>
                <span className="px-4 text-slate-400 text-sm font-bold">√Ê</span>
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-1/4"></div>
              </div>

              {/* One-Time Plan Banner */}
              <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-navy text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="z-10 relative">
                  <div className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold w-fit mb-3 border border-white/20">«·œ›⁄ ·„—… Ê«Õœ…</div>
                  <h3 className="text-2xl font-black mb-2">»«ﬁ… «·≈⁄·«‰ «·Ê«Õœ</h3>
                  <p className="text-slate-300 text-sm max-w-sm">„À«·Ì… ≈–« ﬂ«‰ ·œÌﬂ «Õ Ì«Ã ›Ê—Ì · ÊŸÌ› „‰’» Ê«Õœ Ê·«  —€» »«·«· “«„ »«‘ —«ﬂ ‘Â—Ì.   ÷„‰ ›—“ 50 ”Ì—… –« Ì….</p>
                </div>
                <div className="flex flex-col items-center md:items-end z-10 relative shrink-0">
                  <div className="mb-4 text-center md:text-right">
                    <span className="text-4xl font-black">199</span>
                    <span className="text-slate-300 font-bold ml-1">—Ì«· / ··≈⁄·«‰</span>
                  </div>
                  <button className="px-8 py-3 rounded-2xl font-bold bg-white text-navy hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" /> ‘—«¡ «·≈⁄·«‰
                  </button>
                </div>
              </div>

            </div>
          )}{" "}\;

content = content.substring(0, startIndex) + newBlock + content.substring(oldBlockEndIndex);
fs.writeFileSync('src/Shared.tsx', content);
console.log('Successfully replaced content!');
