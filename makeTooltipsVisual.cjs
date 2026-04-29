const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The replacement logic:
// We want to find: `<Info size={14} className="text-slate-400 hover:text-primary transition-colors cursor-help inline-block mr-2" title="TEXT" />`
// And replace it with a custom tailwind tooltip wrapper.

const infoRegex = /<Info size=\{14\} className="text-slate-400 hover:text-primary transition-colors cursor-help inline-block mr-2" title="([^"]+)" \/>/g;

code = code.replace(infoRegex, (match, tooltipText) => {
  return `<span className="relative group inline-flex items-center ml-1">
      <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
      <div className="absolute right-0 bottom-full mb-2 w-64 p-2.5 bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-normal leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
        ${tooltipText}
        <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
      </div>
    </span>`;
});

// Write it back
fs.writeFileSync('src/App.tsx', code, 'utf8');
