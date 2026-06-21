const fs = require('fs');
let p = 'src/components/Dashboard.tsx';
let data = fs.readFileSync(p, 'utf8');

// Restore parsedAnswers logic
const search1 = `            return {
              id: raw.id,
              name: raw.full_name || "متقدم جديد",
              job: actualJobTitle,
              rating: raw.match_score || raw.match_percentage || 0,
              status: (Array.isArray(raw.custom_answers) ? raw.custom_answers.find((a: any) => a.question === "مدة الانضمام / الجاهزية للعمل")?.answer : null) || raw.availability || raw.status || "غير محدد",`;

const replace1 = `            const parsedAnswers = (() => {
              const val = raw.custom_answers;
              if (!val) return [];
              if (Array.isArray(val)) return val;
              if (typeof val === 'string') {
                try { return JSON.parse(val); } catch (e) { return []; }
              }
              return [];
            })();

            return {
              id: raw.id,
              name: raw.full_name || "متقدم جديد",
              job: actualJobTitle,
              rating: raw.match_score || raw.match_percentage || 0,
              status: parsedAnswers.find((a: any) => a.question === "مدة الانضمام / الجاهزية للعمل")?.answer || raw.availability || raw.status || "غير محدد",`;

// Restore city logic
const search2 = `              voiceEvalUrl: raw.voice_eval || raw.voice_eval_url || "",
              customAnswers: raw.custom_answers,
              decision: (raw.decision === 'evaluated' ? 'pending' : raw.decision) || latestDecisions[raw.id] || "pending",`;

const replace2 = `              voiceEvalUrl: raw.voice_eval || raw.voice_eval_url || "",
              customAnswers: parsedAnswers,
              city: parsedAnswers.find((a: any) => a.question === "المدينة")?.answer || "",
              decision: (raw.decision === 'evaluated' ? 'pending' : raw.decision) || latestDecisions[raw.id] || "pending",`;

// Restore Sidebar padding
const search3 = `          <nav className="space-y-3 flex-1 pb-6">
            {[
              { name: "الحساب", icon: <User size={22} /> },
              FEATURE_FLAGS.enable_fast_sorting ? { name: "الفرز السريع", icon: <Zap size={22} /> } : null,
              { name: "المتقدمين", icon: <Users size={22} /> },
              { name: "مساحة العمل", icon: <LayoutDashboard size={22} /> },
              { name: "المقابلات", icon: <Video size={22} /> },
            ].filter(Boolean).map((item: any) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={\`w-full flex items-center \${isSidebarOpen ? "gap-4 px-5 py-4 justify-start" : "justify-center p-4"} rounded-2xl transition-all font-semibold \${activeTab === item.name ? "bg-mint text-employer-green shadow-xl shadow-mint/30" : "text-slate-400 dark:text-slate-500 hover:text-slate-200 hover:bg-slate-700/50"}\`}
              >
                <div className={\`transition-transform duration-300 \${isSidebarOpen ? "" : "scale-110"}\`}>{item.icon}</div> {isSidebarOpen && <span>{item.name}</span>}{" "}
              </button>
            ))}
          </nav>`;

const replace3 = `          <nav className="space-y-1.5 flex-1 pb-2">
            {[
              { name: "الحساب", icon: <User size={22} /> },
              FEATURE_FLAGS.enable_fast_sorting ? { name: "الفرز السريع", icon: <Zap size={22} /> } : null,
              { name: "المتقدمين", icon: <Users size={22} /> },
              { name: "مساحة العمل", icon: <LayoutDashboard size={22} /> },
              { name: "المقابلات", icon: <Video size={22} /> },
            ].filter(Boolean).map((item: any) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={\`w-full flex items-center \${isSidebarOpen ? "gap-4 px-5 py-2.5 justify-start" : "justify-center p-3"} rounded-2xl transition-all font-semibold \${activeTab === item.name ? "bg-mint text-employer-green shadow-xl shadow-mint/30" : "text-slate-400 dark:text-slate-500 hover:text-slate-200 hover:bg-slate-700/50"}\`}
              >
                <div className={\`transition-transform duration-300 \${isSidebarOpen ? "" : "scale-110"}\`}>{item.icon}</div> {isSidebarOpen && <span>{item.name}</span>}{" "}
              </button>
            ))}
          </nav>`;

let changed = false;

if (data.includes(search1)) { data = data.replace(search1, replace1); changed = true; console.log("Fix 1 applied"); } else { console.log("Fix 1 missed"); }
if (data.includes(search2)) { data = data.replace(search2, replace2); changed = true; console.log("Fix 2 applied"); } else { console.log("Fix 2 missed"); }
if (data.includes(search3)) { data = data.replace(search3, replace3); changed = true; console.log("Fix 3 applied"); } else { console.log("Fix 3 missed"); }

if (changed) {
  fs.writeFileSync(p, data, 'utf8');
}
