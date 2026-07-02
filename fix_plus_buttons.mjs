import fs from 'fs';
let content = fs.readFileSync('src/components/CreateJob.tsx', 'utf8');

const rep1 = 'className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all"';
const new1 = 'className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm transition-all"';

const rep2 = 'className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"';
const new2 = 'className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm transition-all"';

const rep3 = 'className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary transition-all"';
const new3 = 'className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-500 dark:bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm transition-all"';

const rep4 = 'className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-800/30 text-slate-400 rounded-xl flex items-center justify-center hover:text-indigo-600 transition-all"';
const new4 = 'className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-500 dark:bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm transition-all"';

const rep5 = 'className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary transition-all"';
const new5 = 'className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-500 dark:bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm transition-all"';

content = content.split(rep1).join(new1);
content = content.split(rep2).join(new2);
content = content.split(rep3).join(new3);
content = content.split(rep4).join(new4);
content = content.split(rep5).join(new5);

// Add the safety check in executePublishJob
const pubSearch = `  const executePublishJob = async () => {
    setShowConfirmModal(false);`;
const pubReplace = `  const executePublishJob = async () => {
    const hasUnsavedTags = (typeof newMajorInput !== 'undefined' && newMajorInput.trim()) || 
                           (typeof customSkill !== 'undefined' && customSkill.trim()) || 
                           (typeof aiCustomMajor !== 'undefined' && aiCustomMajor.trim()) || 
                           (typeof aiCustomSkill !== 'undefined' && aiCustomSkill.trim());
    if (hasUnsavedTags) {
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى الضغط على زر (+) لإضافة الكلمة التي كتبتها (التخصصات أو المهارات) قبل المتابعة.", type: "error" } }));
      return;
    }
    setShowConfirmModal(false);`;

content = content.split(pubSearch).join(pubReplace);

// Add the safety check in handleSaveRole (for Campaign mode)
const addSearch = `  const handleSaveRole = () => {
    if (!editingRoleId && roles.length >= remainingJobs) {`;
const addReplace = `  const handleSaveRole = () => {
    const hasUnsavedTags = (typeof newMajorInput !== 'undefined' && newMajorInput.trim()) || 
                           (typeof customSkill !== 'undefined' && customSkill.trim()) || 
                           (typeof aiCustomMajor !== 'undefined' && aiCustomMajor.trim()) || 
                           (typeof aiCustomSkill !== 'undefined' && aiCustomSkill.trim());
    if (hasUnsavedTags) {
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى الضغط على زر (+) لإضافة الكلمة التي كتبتها (التخصصات أو المهارات) قبل المتابعة.", type: "error" } }));
      return;
    }
    if (!editingRoleId && roles.length >= remainingJobs) {`;

content = content.split(addSearch).join(addReplace);

fs.writeFileSync('src/components/CreateJob.tsx', content, 'utf8');
console.log('Fixed plus buttons and added safety checks!');
