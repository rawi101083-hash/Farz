const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Revert the wrong injection in JobSuccess
code = code.replace(
`          </button>{""}

          {onDuplicate && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onDuplicate(job); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:border-primary/30 hover:text-primary transition-all group shadow-sm hover:shadow-md"
            >
              <Copy size={18} className="group-hover:scale-110 transition-transform" /> استنساخ الوظيفة
            </button>
          )}`,
`          </button>{" "}`
);

// Add onDuplicate to ManageJob definition
const findManage = `const ManageJob = ({
  job,
  onBack,
  onUpdate,
  onDelete,
}: {
  job: Job;
  onBack: () => void;
  onUpdate: (job: Job) => void;
  onDelete: (id: string) => void;
}) => {`;
const replaceManage = `const ManageJob = ({
  job,
  onBack,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  job: Job;
  onBack: () => void;
  onUpdate: (job: Job) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (job: Job) => void;
}) => {`;
code = code.replace(findManage, replaceManage);

// Inject duplicate button correctly inside ManageJob
const findManageBtn = `            العودة للوحة التحكم{" "}
          </button>{" "}`;
const replManageBtn = `            العودة للوحة التحكم{" "}
          </button>{" "}
          {onDuplicate && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onDuplicate(job); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:border-primary/30 hover:text-primary transition-all group shadow-sm hover:shadow-md"
            >
              <Copy size={18} className="group-hover:scale-110 transition-transform" /> استنساخ الوظيفة
            </button>
          )}`;

// We must replace the ONE inside ManageJob, not JobSuccess
// Find index of ManageJob 
const manageIndex = code.indexOf(replaceManage);
if(manageIndex !== -1) {
    const afterManage = code.indexOf('العودة للوحة التحكم{" "}', manageIndex);
    if(afterManage !== -1) {
        // the button is exactly there
        const sectionStart = afterManage - 100;
        const sectionEnd = afterManage + 200;
        const slice = code.slice(sectionStart, sectionEnd);
        const replacedSlice = slice.replace(findManageBtn, replManageBtn);
        code = code.slice(0, sectionStart) + replacedSlice + code.slice(sectionEnd);
    }
}

fs.writeFileSync('src/App.tsx', code, 'utf8');
