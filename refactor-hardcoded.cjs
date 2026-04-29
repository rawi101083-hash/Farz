const fs = require('fs');
const path = './src/App.tsx';

let content = fs.readFileSync(path, 'utf-8');

// Helper to safely append dark mode variant if it doesn't already exist for that property
function appendDarkVariant(text, regex, replacement) {
  // Regex should match the class exactly as a word boundary
  const globalRegex = new RegExp(`\\b${regex}\\b(?!\\s+dark:)`, 'g');
  return text.replace(globalRegex, `${regex} ${replacement}`);
}

// Safely append dark classes
content = appendDarkVariant(content, 'bg-white', 'dark:bg-slate-800');
content = appendDarkVariant(content, 'bg-slate-50', 'dark:bg-slate-800/50');
content = appendDarkVariant(content, 'text-navy', 'dark:text-white');
content = appendDarkVariant(content, 'text-slate-600', 'dark:text-slate-300');
content = appendDarkVariant(content, 'text-slate-500', 'dark:text-slate-400');
content = appendDarkVariant(content, 'text-slate-400', 'dark:text-slate-500');
content = appendDarkVariant(content, 'border-slate-100', 'dark:border-slate-700/50');
content = appendDarkVariant(content, 'border-slate-200', 'dark:border-slate-700');
content = appendDarkVariant(content, 'border-white', 'dark:border-slate-700');

// Fix input fields explicitly
content = appendDarkVariant(content, 'bg-transparent', 'dark:bg-transparent dark:text-white');

// Cleanup double spaces inside template literals and quotes
content = content.replace(/\s{2,}/g, ' ');

// Fix specific overlaps if any were caused
content = content.replace(/dark:bg-slate-800 dark:bg-slate-[0-9]+/g, 'dark:bg-slate-800');
content = content.replace(/dark:text-white dark:text-[a-z-]+/g, 'dark:text-white');
content = content.replace(/dark:border-slate-[0-9]+ dark:border-slate-[0-9]+/g, 'dark:border-slate-700');

fs.writeFileSync(path, content, 'utf-8');
console.log('Hardcoded colors refactored for Dark Mode successfully.');
