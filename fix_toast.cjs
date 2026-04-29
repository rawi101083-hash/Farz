const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update the state type
content = content.replace(
  'const [undoAction, setUndoAction] = useState<{ id: string | string[], prevDecision: string, timeoutId: NodeJS.Timeout | null } | null>(null);',
  'const [undoAction, setUndoAction] = useState<{ id: string | string[], prevDecision: string, targetDecision: string, timeoutId: NodeJS.Timeout | null } | null>(null);'
);

// 2. Update setUndoAction in handleDecision
// Find setUndoAction({ id, prevDecision, timeoutId });
content = content.replace(
  'setUndoAction({ id, prevDecision, timeoutId });',
  'setUndoAction({ id, prevDecision, targetDecision, timeoutId });'
);

// 3. Update setUndoAction in handleBulkFilterOut
// Find setUndoAction({ id: idsToFilter, prevDecision: "pending", timeoutId });
content = content.replace(
  'setUndoAction({ id: idsToFilter, prevDecision: "pending", timeoutId });',
  'setUndoAction({ id: idsToFilter, prevDecision: "pending", targetDecision: "filtered", timeoutId });'
);

// 4. Update the Toast UI Block at the end of the file
const oldToastUI = `<div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-primary" />
                <span>تم تحديث حالة {Array.isArray(undoAction.id) ? "المتقدمين المحددين" : "المتقدم"} بنجاح</span>
              </div>`;
const newToastUI = `<div className="flex items-center gap-3">
                {undoAction.targetDecision === "accepted" ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : undoAction.targetDecision === "filtered" || undoAction.targetDecision === "rejected" ? (
                  <X size={20} className="text-red-500" />
                ) : undoAction.targetDecision === "interview" ? (
                  <Calendar size={20} className="text-yellow-500" />
                ) : (
                  <CheckCircle size={20} className="text-primary" />
                )}
                <span>
                  {undoAction.targetDecision === "accepted" ? (Array.isArray(undoAction.id) ? "تم قبول المتقدمين المحددين بنجاح" : "تم قبول المتقدم بنجاح") :
                   undoAction.targetDecision === "filtered" || undoAction.targetDecision === "rejected" ? (Array.isArray(undoAction.id) ? "تم رفض وتصفية المتقدمين بنجاح" : "تم رفض المتقدم بنجاح") :
                   undoAction.targetDecision === "interview" ? "تم تحديد مقابلة للمتقدم بنجاح" :
                   "تم تحديث حالة المتقدم بنجاح"}
                </span>
              </div>`;
content = content.replace(oldToastUI, newToastUI);

// 5. Update "عرض المفضلين فقط" to "عرض المفضلين"
content = content.replace(/>\s*عرض المفضلين فقط\s*<\/button>/g, '> عرض المفضلين </button>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Toast and Favorite button');
