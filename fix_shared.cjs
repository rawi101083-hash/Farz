const fs = require('fs');
let content = fs.readFileSync('src/Shared.tsx', 'utf8');

// 1. Replace the generatePaymentForm html Content with programmatic form submission
content = content.replace(/const htmlContent = `[\s\S]*?setPaymentHtml\(htmlContent\);/g, 
`      // Create a hidden form in the document body and submit it
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.paymentUrl;
      form.target = '_self'; // Redirect the whole window
      form.style.display = 'none';

      const addInput = (name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addInput('id', data.id);
      addInput('trandata', data.trandata);
      addInput('errorURL', data.errorURL);
      addInput('responseURL', data.responseURL);

      document.body.appendChild(form);
      form.submit();
      
      // Cleanup after submit
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        setShowPaymentModal(false);
      }, 2000);`);

// 2. Replace the iframe with a loader
content = content.replace(/<iframe[\s\S]*?<\/iframe>/g, 
`<div className="text-center flex flex-col items-center justify-center w-full h-full">
  <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">جاري تحويلك لبوابة الدفع...</h3>
</div>`);

// 3. Fix the DOM Nesting error in SettingsPage (div inside p)
content = content.replace(/<p\s+className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">\s*<div\s+className="w-2 h-2/g, 
`<div className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">\n                <div className="w-2 h-2`);
content = content.replace(/Neoleap[\s\S]*?<\/p>/g, match => match.replace('</p>', '</div>'));

// 4. Fix DOM nesting whitespace around <tr>
content = content.replace(/<tr>\s*\{\s*"\s*"\s*\}\s*<td>/g, '<tr>\n<td>');

fs.writeFileSync('src/Shared.tsx', content, 'utf8');
console.log('Shared.tsx updated.');
