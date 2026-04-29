const fs = require('fs');

let code = fs.readFileSync('src/Shared.tsx', 'utf8');

// Replace left card pill
code = code.replace(
  '<div className="bg-emerald-100 text-[#0f766e] text-[10px] font-black px-3 py-1.5 rounded-full mb-8 border border-emerald-200">\n                      شهرين مجاناً بالدفع السنوي\n                    </div>',
  '<div className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full mb-8">\n                      شهرين مجاناً بالدفع السنوي\n                    </div>'
);

// Replace center card pill
code = code.replace(
  '<div className="bg-emerald-100 text-[#0f766e] text-[11px] font-black px-4 py-2 rounded-full mb-8 border border-emerald-200 shadow-sm">\n                      شهرين مجاناً بالدفع السنوي\n                    </div>',
  '<div className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full mb-8">\n                      شهرين مجاناً بالدفع السنوي\n                    </div>'
);

// Replace right card pill
code = code.replace(
  '<div className="bg-emerald-100 text-[#0f766e] text-[10px] font-black px-3 py-1.5 rounded-full mb-8 border border-emerald-200">\n                      شهرين مجاناً بالدفع السنوي\n                    </div>',
  '<div className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full mb-8">\n                      شهرين مجاناً بالدفع السنوي\n                    </div>'
);

// Replace invisible pill
code = code.replace(
  '<div className="bg-emerald-100 text-[#0f766e] text-[11px] font-black px-4 py-2 rounded-full mb-8 opacity-0 pointer-events-none">\n                      شهرين مجاناً\n                    </div>',
  '<div className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full mb-8 opacity-0 pointer-events-none">\n                      شهرين مجاناً\n                    </div>'
);

fs.writeFileSync('src/Shared.tsx', code, 'utf8');
console.log('Successfully reverted pills.');
