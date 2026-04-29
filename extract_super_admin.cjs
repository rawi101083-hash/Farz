const fs = require('fs');

const appTsxPath = 'src/App.tsx';
let content = fs.readFileSync(appTsxPath, 'utf8');

// Find start and end of SuperAdminDashboard
const startIdx = content.indexOf('const SuperAdminDashboard = () => {');
if (startIdx === -1) {
    console.error('SuperAdminDashboard not found!');
    process.exit(1);
}

const stopIdx = content.indexOf('const LogoIcon = () => (');
if (stopIdx === -1) {
    console.error('LogoIcon not found!');
    process.exit(1);
}

const textBeforeNext = content.substring(startIdx, stopIdx);
const lastClosingBrace = textBeforeNext.lastIndexOf('};');
const extracted = textBeforeNext.substring(0, lastClosingBrace + 2);

// imports
const imports = `import React, { useState } from "react";
import {
  PieChart as PieChartIcon,
  LayoutDashboard,
  Briefcase,
  Users,
  CreditCard,
  Settings,
  Search,
  CheckCircle,
  Clock,
  MoreVertical,
  LogOut,
  Bell,
  TrendingUp,
  Ban,
  Shield,
  Zap,
} from "lucide-react";
import { LogoIcon } from '../Shared';

`;

const componentContent = imports + extracted + '\n\nconst SuperAdmin = SuperAdminDashboard;\nexport default SuperAdmin;\n';

fs.writeFileSync('src/components/SuperAdmin.tsx', componentContent);
console.log('Successfully wrote src/components/SuperAdmin.tsx');

// Modify App.tsx
// 1. Remove SuperAdminDashboard
let newContent = content.substring(0, startIdx) + content.substring(startIdx + lastClosingBrace + 2);

// 2. Replace <SuperAdminDashboard /> with <SuperAdmin />
newContent = newContent.replace(/<SuperAdminDashboard\s*\/>/g, '<SuperAdmin />');
newContent = newContent.replace(/<SuperAdminDashboard\s*([^>]+)\/>/g, '<SuperAdmin $1/>');

// 3. Add import
const importLine = `import SuperAdmin from './components/SuperAdmin';\n`;
const importStartIdx = newContent.indexOf('import JobApplication from');
if (importStartIdx !== -1) {
    newContent = newContent.substring(0, importStartIdx) + importLine + newContent.substring(importStartIdx);
} else {
    newContent = importLine + newContent;
}

// 4. Remove unused imports
// A simple RegEx to find destructuring imports: import { A, B, C } from "X";
const regex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
newContent = newContent.replace(regex, (match, importsStr, fromStr) => {
    // splits by comma, trims, and filters empty
    const importsArr = importsStr.split(',').map(i => i.trim()).filter(i => !!i);
    const usedImports = [];
    
    // For each imported variable, check if it appears anywhere else in the file
    for (const imp of importsArr) {
        // Handle "PieChart as PieChartIcon"
        let varName = imp;
        if (imp.includes(' as ')) {
            varName = imp.split(' as ')[1].trim();
        }
        
        // Find occurrences of varName in the rest of the text
        // (Use a simple token check - alphanumeric boundaries)
        const tokenRegex = new RegExp('\\b' + varName + '\\b', 'g');
        const count = (newContent.match(tokenRegex) || []).length;
        
        // If it's used more than 1 time (the 1 time is this import statement itself)
        // Wait, the newContent match will match the import statement. 
        // We actually only want to keep it if count > 1
        // But what if it's imported but never used? count = 1.
        if (count > 1) {
            usedImports.push(imp);
        }
    }
    
    if (usedImports.length === 0) return '';
    return `import { ${usedImports.join(', ')} } from "${fromStr}"`;
});

fs.writeFileSync(appTsxPath, newContent);
console.log('Successfully updated App.tsx and cleaned imports');
