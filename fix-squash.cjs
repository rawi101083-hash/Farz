const fs = require('fs');
const path = './src/App.tsx';

let text = fs.readFileSync(path, 'utf8');

// Replace standard comments ending in space followed by keyword
text = text.replace(/(\/\/ --- Components ---) (const)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Campaign Meta) (const)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Common) (const)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Profile Data Mock) (const)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Role Form) (const)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Clear active if we are at the very top \(Hero section\)) (if)/g, '\n$1\n$2');
text = text.replace(/(\/\/ far future fallback) (const)/g, '\n$1\n$2');
text = text.replace(/(\/\/ For AI Score e\.g\. 95) (status)/g, '\n$1\n$2');
text = text.replace(/(\/\/ e\.g\. ".+?") (color)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Preparing CSV content including all standard and hidden fields) (const)/g, '\n$1\n$2');

// Fix the types section
text = text.replace(/(\/\/ --- Types ---)(\s+)?(type|interface)/g, '\n$1\n$3');
text = text.replace(/(\/\/ Legacy or default fields fallback) (title)/g, '\n$1\n$2');

// Fix right column / left column comments
text = text.replace(/(\/\/ Right Side - Dark Green) (<div)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Decorative background elements) (<div)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Left Side - Form) (<div)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Right Column - AI Analysis & Audio \([0-9] columns\)) (<div)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Left Column - CV Viewer \([0-9] columns\)) (<div)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Sidebar - Dark Mode) (<aside)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Main Content) (<main)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Companies Table) (<div)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Custom Attachments Section) (<div)/g, '\n$1\n$2');
text = text.replace(/(\/\/ Sidebar) (<aside)/g, '\n$1\n$2');
text = text.replace(/(\/\/ --- Header ---)/g, '\n$1\n');

text = text.replace(/(\/\*.*?\*\/)/g, '\n$1\n');

fs.writeFileSync(path, text, 'utf8');
console.log('Fixed squash');
