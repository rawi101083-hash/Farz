const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/ApplicantDetails.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Props
content = content.replace(
  'const ApplicantDetails = ({ onBack, applicant }: { onBack: () => void, applicant?: any }) => {',
  'const ApplicantDetails = ({ onBack, applicant, onStatusUpdate }: { onBack: () => void, applicant?: any, onStatusUpdate?: (id: string, decision: string, isOffer?: boolean) => void }) => {'
);

// 2. Add proposedSalary state after startDate
content = content.replace(
  '  const [startDate, setStartDate] = useState(() => {',
  '  const [proposedSalary, setProposedSalary] = useState(applicant?.expectedSalary || "يُحدد لاحقاً");\n  const [startDate, setStartDate] = useState(() => {'
);

// 3. Update the handleReject and handleSilentAccept functions
const newHandlers = `
  const handleSilentAccept = async () => {
    if (!applicant) return;
    try {
      await supabase.from('applicants').update({ decision: 'accepted' }).eq('id', applicant.id);
      if (onStatusUpdate) onStatusUpdate(applicant.id, 'accepted', false);
      onBack();
    } catch (err) { console.error(err); }
  };

  const handleReject = async () => {
    if (!applicant) return;
    try {
      await supabase.from('applicants').update({ decision: 'filtered', rejection_reason: 'استبعاد يدوي من الإدارة' }).eq('id', applicant.id);
      if (onStatusUpdate) onStatusUpdate(applicant.id, 'filtered', false);
      onBack();
    } catch (err) { console.error(err); }
  };

  const handleSendOfferDB = async () => {
    if (!applicant) return;
    try {
      await supabase.from('job_offers').insert([{
        applicant_id: applicant.id,
        offer_message: offerText,
        proposed_salary: Number(proposedSalary.replace(/\\D/g, '')) || 0,
        start_date: startDate,
        status: 'pending'
      }]);
      await supabase.from('applicants').update({ decision: 'accepted' }).eq('id', applicant.id);
      if (onStatusUpdate) onStatusUpdate(applicant.id, 'accepted', true);
      onBack();
    } catch (err) { console.error(err); }
  };
`;
content = content.replace('const [toastMessage, setToastMessage] = useState<string | null>(null);', 'const [toastMessage, setToastMessage] = useState<string | null>(null);\n' + newHandlers);

// 4. Update top buttons
const oldButtonsRegex = /<button[\s\S]*?onClick=\{\(\) => \{\s*if \(applicant\) \{\s*setShowAcceptOptions\(true\);\s*\}\s*\}\}[\s\S]*?<CheckCircle size=\{16\} \/> قبول\s*<\/button>\s*<button[\s\S]*?onClick=\{\(\) => \{\s*if \(applicant\) \{\s*setShowRejectModal\(true\);\s*\}\s*\}\}[\s\S]*?<X size=\{16\} \/> رفض\s*<\/button>/;

const newButtons = `<button
              onClick={handleSilentAccept}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <CheckCircle size={16} /> قبول صامت 🟢
            </button>
            <button
              onClick={() => { if (applicant) setShowOfferModal(true); }}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Send size={16} /> قبول وإرسال عرض 🚀
            </button>
            <button
              onClick={handleReject}
              className="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 border border-red-100 dark:border-red-900/50 hover:border-transparent"
            >
              <X size={16} /> رفض
            </button>`;

content = content.replace(oldButtonsRegex, newButtons);

// 5. Update OfferModal inputs and buttons
content = content.replace(
  '<div>\n                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تاريخ المباشرة المتوقع</label>',
  `<div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الراتب المقترح</label>
                  <input
                    type="text"
                    value={proposedSalary}
                    onChange={(e) => setProposedSalary(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary font-medium mb-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تاريخ المباشرة المتوقع</label>`
);

content = content.replace(
  /<div className="flex gap-3">\s*<a\s*href=\{`https:\/\/api\.whatsapp\.com[\s\S]*?<\/a>\s*<a\s*href=\{`mailto:[\s\S]*?<\/a>\s*<\/div>/,
  `<div className="flex gap-3">
                <button
                  onClick={handleSendOfferDB}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-md"
                >
                  <Send size={20} /> إرسال العرض وحفظه
                </button>
              </div>`
);

// 6. Delete showAcceptOptions and showRejectModal blocks (To keep it clean, we'll just let them be orphaned, they won't render if states are false, but let's delete them).
const regexDeleteModals = /<AnimatePresence>\s*\{showAcceptOptions[\s\S]*?<\/AnimatePresence>\s*<AnimatePresence>\s*\{showRejectModal[\s\S]*?<\/AnimatePresence>/;
content = content.replace(regexDeleteModals, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('ApplicantDetails refactored successfully.');
