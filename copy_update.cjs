const fs = require('fs');
const files = ['src/App.tsx', 'src/create_job_replacement.tsx'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');
        
        // Copywriting changes
        code = code.replace(/ملخص الذكاء الاصطناعي/g, "التحليل الوظيفي");
        code = code.replace(/تقييم AI/g, "مؤشر المطابقة");
        code = code.replace(/المقابلة الصوتية بالذكاء الاصطناعي/g, "التقييم الصوتي الآلي");
        code = code.replace(/تحليل AI/g, "الهدف التحليلي");
        code = code.replace(/بالذكاء الاصطناعي/g, "آلياً بذكاء");
        
        // Dropdown option styling
        code = code.replace(/<option([^>]*)>/g, (match, p1) => {
            if (!p1.includes('className')) {
                 return `<option${p1} className="bg-white text-navy dark:bg-slate-800 dark:text-white">`;
            }
            if (!p1.includes('dark:bg-slate-800')) {
                 return match.replace(/className="/, 'className="bg-white text-navy dark:bg-slate-800 dark:text-white ');
            }
            return match;
        });

        fs.writeFileSync(file, code);
        console.log(`Updated ${file}`);
    }
});
