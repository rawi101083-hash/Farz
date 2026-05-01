const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove Testimonials Link
code = code.replace(
  /\{\s*id:\s*"testimonials",\s*label:\s*"شركاء النجاح"\s*\},\s*/,
  ""
);

// 2. Hero Subtitle Update
code = code.replace(
  /منصة ترتب لك عمليات التوظيف، تفرز السير الذاتية، وتطلع لك الخلاصة عشان\s*تختار الأنسب لفريقك بدون حوسة وتعب\./,
  "منصة تعتمد على الذكاء الاصطناعي لأتمتة عمليات التوظيف؛ نفرز آلاف السير الذاتية ونستخرج أفضل الكفاءات المطابقة لمعاييرك بدقة."
);

// 3. Remove "المقابلات الصوتية" feature
code = code.replace(
  /\{\s*title:\s*"مقابلات صوتية مدمجة",[\s\S]*?color:\s*"bg-primary\/10",\s*\},\s*/,
  ""
);

// 4. Update "شركاء النجاح" section to Proof of Value
code = code.replace(
  /\{\/\*\s*Testimonials\s*\*\/\}\s*<section[\s\S]*?id="testimonials"[\s\S]*?<\/section>/,
  `{/* Proof of Value */}
      <section className="max-w-7xl mx-auto mb-40 bg-navy rounded-[40px] p-12 md:p-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">الفرز اليدوي انتهى. لغة الأرقام تتحدث.</h2>
          <p className="text-slate-400 text-xl font-medium mb-16 max-w-3xl mx-auto">نظام (فرز) ليس مجرد أداة، بل هو ترقية كاملة لقسم الموارد البشرية لديك.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[32px] p-10 text-center hover:bg-white/10 transition-colors">
              <div className="text-6xl mb-6">⏱️</div>
              <h3 className="text-2xl font-bold text-white mb-3">3 ثوانٍ فقط</h3>
              <p className="text-slate-400">لتحليل السيرة واستخراج البيانات.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[32px] p-10 text-center hover:bg-white/10 transition-colors">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-3">99% دقة مطابقة</h3>
              <p className="text-slate-400">خوارزميات ترشح الكفاءات بدون تحيز.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[32px] p-10 text-center hover:bg-white/10 transition-colors">
              <div className="text-6xl mb-6">💰</div>
              <h3 className="text-2xl font-bold text-white mb-3">القضاء على الهدر</h3>
              <p className="text-slate-400">وفر ميزانيتك المهدرة في الفرز اليدوي.</p>
            </div>
          </div>
        </div>
      </section>`
);

// 5. Replace Contact Form with Calendly button CTA
code = code.replace(
  /<form[\s\S]*?<\/form>/,
  `<div className="flex flex-col items-center justify-center mt-10">
            <a href="https://calendly.com/farz-demo" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-primary text-white px-16 py-6 rounded-[24px] text-2xl font-bold hover:shadow-[0_20px_50px_rgba(13,148,136,0.3)] transition-all hover:-translate-y-1.5 active:scale-95 flex items-center justify-center gap-3">
              احجز عرضاً توضيحياً (Demo)
            </a>
          </div>`
);

// 6. Update Video Modal with Placeholder Video/GIF box
code = code.replace(
  /<div className="text-center">[\s\S]*?مكان عرض فيديو شرح المنصة \(Video Player\)[\s\S]*?<\/p>\s*<\/div>/,
  `<div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-8">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Play size={32} className="text-slate-500 ml-2" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">شاهد كيف نعمل</h3>
                <p className="text-slate-400 text-lg text-center max-w-sm">(مساحة مخصصة لعرض فيديو توضيحي قصير أو صورة متحركة GIF مدتها 10-12 ثانية)</p>
              </div>`
);

// 7. Add WhatsApp Widget right before closing </div>
code = code.replace(
  /<\/AnimatePresence>[\s]*<\/div>[\s]*\);[\s]*};[\s]*const MOCK_EXPIRATION_TIME/,
  `</AnimatePresence>
      <a 
        href="https://wa.me/message/IAOWRM4I5MJAL1" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 left-6 z-[9999] bg-[#25D366] text-white py-3.5 px-6 rounded-full no-underline font-bold shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-[#1ebd5a] hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2 text-base"
      >
        💬 للاستفسارات السريعة
      </a>
    </div>
  );
};

const MOCK_EXPIRATION_TIME`
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('UI Updates successfully applied to App.tsx');
