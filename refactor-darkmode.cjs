const fs = require('fs');
const path = './src/App.tsx';

let content = fs.readFileSync(path, 'utf-8');

// Function to convert class list to dark: prefixed class list
const toDark = (str) => {
  return str.split(' ').filter(Boolean).map(c => 'dark:' + c).join(' ');
};

// 1. Replace `${darkMode ? 'A' : 'B'}`
content = content.replace(/\$\{darkMode \? '([^']+)' : '([^']+)'\}/g, (match, darkClasses, lightClasses) => {
  return `${lightClasses} ${toDark(darkClasses)}`;
});

// 2. Replace `${darkMode ? "A" : "B"}`
content = content.replace(/\$\{darkMode \? "([^"]+)" : "([^"]+)"\}/g, (match, darkClasses, lightClasses) => {
  return `${lightClasses} ${toDark(darkClasses)}`;
});

// 3. Replace `${darkMode ? 'A' : ""}`
content = content.replace(/\$\{darkMode \? '([^']+)' : ""\}/g, (match, darkClasses) => {
  return `${toDark(darkClasses)}`;
});

// Replace remaining single darkMode props being passed if necessary? Wait, no, we might still need the darkMode state for some logic, e.g. toggle button.
// And of course, the dark mode hook needs useEffect

const useEffectHook = `
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
`;

if (!content.includes("document.documentElement.classList.add('dark')")) {
  content = content.replace(/const \[darkMode, setDarkMode\] = useState\(false\);/, 
    "const [darkMode, setDarkMode] = useState(false);\n" + useEffectHook);
}

// Add useEffect to React imports if not present
if (!content.includes('useEffect')) {
  content = content.replace(/import React, \{ useState \} from 'react';/, "import React, { useState, useEffect } from 'react';");
}

// Also replace the root div min-h-screen class in App.tsx
// From: className={`min-h-screen transition-colors duration-500 \${darkMode ? 'bg-[#0F172A]' : 'bg-[#F1F5F9]'} selection:bg-primary/20 selection:text-primary`}
// To: className="min-h-screen transition-colors duration-500 bg-bg dark:bg-navy selection:bg-primary/20 selection:text-primary"
// Because `#0F172A` is navy and `#F1F5F9` is bg

content = content.replace(
  /className=\{`min-h-screen transition-colors duration-500 \$\{darkMode \? 'bg-\[\#0F172A\]' : 'bg-\[\#F1F5F9\]'\} selection:bg-primary\/20 selection:text-primary`\}/,
  'className="min-h-screen transition-colors duration-500 bg-[#F1F5F9] dark:bg-[#0F172A] selection:bg-primary/20 selection:text-primary"'
);

// We need to also clean up passing 'darkMode' as a prop if we want, but doing so might be risky since components might expect it.
// We'll leave the prop passing intact since it doesn't break anything. 

fs.writeFileSync(path, content, 'utf-8');
console.log('App.tsx refactored successfully.');
