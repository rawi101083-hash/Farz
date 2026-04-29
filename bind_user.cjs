const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. App state for userProfile
if (!code.includes('const [userProfile, setUserProfile] = useState')) {
    code = code.replace('export default function App() {', `export default function App() {
  const [userProfile, setUserProfile] = useState({
    name: "أحمد المدير",
    title: "مدير التوظيف",
    avatar: "https://picsum.photos/seed/admin/100/100",
    companyLogo: ""
  });`);
}

// 2. Add userProfile to Dashboard definition
if (!code.includes('userProfile, setUserProfile}: {')) {
    code = code.replace(/darkMode,\n  setDarkMode,\n}: {/g, 'darkMode,\n  setDarkMode,\n  userProfile,\n  setUserProfile\n}: {');
    // Also extend the type
    code = code.replace(/setDarkMode: \(val: boolean\) => void;\n}/g, 'setDarkMode: (val: boolean) => void;\n  userProfile: any;\n  setUserProfile: any;\n}');
}

// 3. Add userProfile to Dashboard usage
code = code.replace(/setDarkMode={setDarkMode}\n              \/>/g, 'setDarkMode={setDarkMode}\n                userProfile={userProfile}\n                setUserProfile={setUserProfile}\n              />');

// 4. Update Sidebar in Dashboard to use userProfile
code = code.replace(/<img\s+src="https:\/\/picsum\.photos\/seed\/admin\/100\/100"\s+alt="Admin"\s+referrerPolicy="no-referrer"\s+\/>/g, 
  `<img src={userProfile.avatar} alt="Admin" referrerPolicy="no-referrer" />`);
code = code.replace(/<p className="text-sm font-bold truncate text-white">\s+أحمد المدير\s+<\/p>/g,
  `<p className="text-sm font-bold truncate text-white">{userProfile.name}</p>`);
code = code.replace(/<p className="text-xs text-slate-300 dark:text-slate-400 truncate">\s+مدير التوظيف\s+<\/p>/g,
  `<p className="text-xs text-slate-300 dark:text-slate-400 truncate">{userProfile.title}</p>`);

// 5. Add userProfile to SettingsPage definition
if (!code.includes('const SettingsPage = ({')) {
   // Already there, just add props
}
code = code.replace(/const SettingsPage = \({([\s\S]*?)darkMode,([\s\S]*?)setDarkMode,([\s\S]*?)}: {([\s\S]*?)darkMode: boolean;([\s\S]*?)setDarkMode: \(val: boolean\) => void;([\s\S]*?)}\) => {/g,
  `const SettingsPage = ({\n  darkMode,\n  setDarkMode,\n  userProfile,\n  setUserProfile\n}: {\n  darkMode: boolean;\n  setDarkMode: (val: boolean) => void;\n  userProfile: any;\n  setUserProfile: any;\n}) => {`);

// Update SettingsPage usage in Dashboard
code = code.replace(/<SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} \/>/g,
  `<SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} userProfile={userProfile} setUserProfile={setUserProfile} />`);

fs.writeFileSync('src/App.tsx', code);
console.log('done binding');
