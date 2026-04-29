const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const startIdx = content.indexOf('const ApplicantDetails = ({ onBack }: { onBack: () => void }) => {');

let endIdx = content.indexOf('const SuperAdminDashboard = () => {');
// Backtrack to previous closing brace or newline
const textBeforeNextComponent = content.substring(startIdx, endIdx);
const lastClosingBrace = textBeforeNextComponent.lastIndexOf('};');

const extracted = textBeforeNextComponent.substring(0, lastClosingBrace + 2);

const imports = `import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Sparkles, CheckCircle, Zap, Play, MessageCircle, FileText, Linkedin, Mail, Phone } from "lucide-react";

`;

fs.writeFileSync('src/components/ApplicantDetails.tsx', imports + extracted + '\n\nexport default ApplicantDetails;\n');
console.log('Successfully wrote src/components/ApplicantDetails.tsx');

// Now remove it from App.tsx
const newContent = content.substring(0, startIdx) + content.substring(startIdx + lastClosingBrace + 2);
fs.writeFileSync('src/App.tsx', newContent);
console.log('Successfully removed ApplicantDetails from App.tsx');

// Insert import in App.tsx
const importLine = `import ApplicantDetails from './components/ApplicantDetails';\n`;
const importStartIdx = newContent.indexOf('import Dashboard from');
if (importStartIdx !== -1) {
    const finalContent = newContent.substring(0, importStartIdx) + importLine + newContent.substring(importStartIdx);
    fs.writeFileSync('src/App.tsx', finalContent);
    console.log('Successfully added import to App.tsx');
} else {
    console.log('Could not find where to insert import.');
}
