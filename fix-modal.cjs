const fs = require('fs');

const path = 'C:/Users/rawi1/Downloads/التوظيف-الذكي-_-smart-recruitment/src/components/CreateJob.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/\\r\\n/g, '\\n');

const startMarker = '{/* Chat UI Panel */}';
const startIdx = content.indexOf(startMarker);

const endMarker = '{/* Main Form Content */}';
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error("Markers not found.");
  process.exit(1);
}

let chatPanelCode = content.substring(startIdx, endIdx);

// First, let's locate the EXACT opening div string:
const oldDivStart = '<div className="w-full xl:w-[380px] shrink-0 order-1 xl:order-2 flex flex-col h-[600px] xl:h-[calc(100vh-120px)] xl:sticky top-24 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">';
const newMotionProps = `                className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[80vh]"\\n              >`;

// Replace the old div start with the motion.div props and the closing >
let modifiedChatPanel = chatPanelCode.replace(oldDivStart, newMotionProps);

// Also remove the `{/* Chat UI Panel */}` comment
modifiedChatPanel = modifiedChatPanel.replace('        {/* Chat UI Panel */}\\n        ', '');


// Add shrink-0 and Close button
modifiedChatPanel = modifiedChatPanel.replace(
  'className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center"',
  'className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center shrink-0"'
);

modifiedChatPanel = modifiedChatPanel.replace(
  '             </div>\\n          </div>',
  `             </div>
             <button
               type="button"
               onClick={() => setIsAiModalOpen(false)}
               className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500"
             >
               <span className="sr-only">إغلاق</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
             </button>
          </div>`
);

let finalModalCode = `        {/* Chat UI Modal */}
        <AnimatePresence>
          {isAiModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
`;

finalModalCode += modifiedChatPanel;
finalModalCode += `              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>\\n\\n`;

content = content.replace(chatPanelCode, finalModalCode);

content = content.replace(
  'const [isAddingRole, setIsAddingRole] = useState(false);',
  'const [isAddingRole, setIsAddingRole] = useState(false);\\n  const [currentStep, setCurrentStep] = useState(1);\\n  const [isAiModalOpen, setIsAiModalOpen] = useState(false);'
);

content = content.replace(
  '<div className="max-w-[1400px] mx-auto pb-32 flex flex-col xl:flex-row gap-6 px-4 xl:px-8">',
  '<div className="max-w-[1000px] mx-auto pb-32 flex flex-col gap-6 px-4 xl:px-8">'
);

content = content.replace(
  '<div className="flex-1 xl:max-w-4xl order-2 xl:order-1 min-w-0">',
  '<div className="flex-1 flex flex-col min-w-0 w-full">'
);

fs.writeFileSync(path, content, 'utf8');
console.log("SUCCESS!");
