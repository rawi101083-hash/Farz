import sys

path = 'src/components/CreateJob.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def find_line(pattern, start=0):
    for i in range(start, len(lines)):
        if pattern in lines[i]:
            return i
    print(f"Could not find: {pattern}")
    sys.exit(1)

# 1. Stepper UI
form_start_idx = find_line('id="createJobForm"')

# 2. Step 1 Open
card1_start_idx = find_line('{/* Card 1: Basic Info */}')
fragment_open_idx = find_line('<>', card1_start_idx)

# 3. Step 1 Close & Step 2 Open
roles_start_idx = find_line('{showRoleForm && (')
fragment_close_idx = -1
for i in range(roles_start_idx - 1, 0, -1):
    if '</>' in lines[i]:
        fragment_close_idx = i
        break

# 4. Step 2 Close & Step 3 Open
schedule_start_idx = find_line('{/* Card: Schedule */}')

# 5. Step 3 Close
buttons_idx = find_line('className="flex flex-col md:flex-row items-center justify-end gap-3 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800"')

print(f"Form Start: {form_start_idx}")
print(f"Fragment Open: {fragment_open_idx}")
print(f"Fragment Close: {fragment_close_idx}")
print(f"Schedule Start: {schedule_start_idx}")
print(f"Buttons Start: {buttons_idx}")

stepper_ui = """            {/* --- STEPPER UI START --- */}
            {createJobType !== "quick_link" && (
            <div className="mb-12 w-full max-w-3xl mx-auto px-4 mt-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-slate-200 dark:bg-slate-700 z-0 rounded-full transform -translate-y-1/2 shadow-inner" />
                <div className="absolute top-1/2 right-8 h-1.5 bg-gradient-to-l from-primary via-emerald-400 to-emerald-500 z-0 rounded-full transition-all duration-700 transform -translate-y-1/2" style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }} />
                
                <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => setCurrentStep(1)}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 ${currentStep === 1 ? 'bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 border-white/50' : currentStep > 1 ? 'bg-primary text-white border-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                    {currentStep > 1 ? <CheckCircle size={24} className="animate-in zoom-in" /> : "1"}
                  </div>
                  <span className={`text-sm font-black mt-1 transition-colors ${currentStep === 1 ? 'text-primary drop-shadow-sm' : currentStep > 1 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>المعلومات الأساسية</span>
                </div>

                <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => { if (currentStep >= 1) setCurrentStep(2) }}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 ${currentStep === 2 ? 'bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 border-white/50' : currentStep > 2 ? 'bg-primary text-white border-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                    {currentStep > 2 ? <CheckCircle size={24} className="animate-in zoom-in" /> : "2"}
                  </div>
                  <span className={`text-sm font-black mt-1 transition-colors ${currentStep === 2 ? 'text-primary drop-shadow-sm' : currentStep > 2 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>متطلبات التقديم</span>
                </div>

                <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => { if (currentStep >= 2) setCurrentStep(3) }}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 ${currentStep === 3 ? 'bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 border-white/50' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                    3
                  </div>
                  <span className={`text-sm font-black mt-1 transition-colors ${currentStep === 3 ? 'text-primary drop-shadow-sm' : 'text-slate-400'}`}>الإعدادات والتاريخ</span>
                </div>
              </div>
            </div>
            )}
            {/* --- STEPPER UI END --- */}
"""

# Replace Fragment Open
lines[fragment_open_idx] = '              <div className={currentStep === 1 ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>\n'

# Replace Fragment Close
lines[fragment_close_idx] = '              </div>\n'

step1_nav_and_step2_open = """
            {createJobType !== "quick_link" && currentStep === 1 && (
              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">التالي <ArrowLeft size={18} className="rotate-180"/></button>
              </div>
            )}
            <div className={currentStep === 2 ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
"""

step2_nav_and_step3_open = """
            </div>
            
            {createJobType !== "quick_link" && currentStep === 2 && (
              <div className="mt-8 flex justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mb-8">
                <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><ArrowLeft size={18}/> السابق</button>
                <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">التالي <ArrowLeft size={18} className="rotate-180"/></button>
              </div>
            )}

            <div className={currentStep === 3 ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
"""

step3_nav = """
            </div>

            {createJobType !== "quick_link" && currentStep === 3 && (
              <div className="mt-8 flex justify-start gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mb-8">
                <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><ArrowLeft size={18}/> السابق</button>
              </div>
            )}
"""

# Insert backwards to avoid index shifting!
lines.insert(buttons_idx, step3_nav)
lines.insert(schedule_start_idx, step2_nav_and_step3_open)
lines.insert(roles_start_idx, step1_nav_and_step2_open)
lines.insert(form_start_idx + 1, stepper_ui)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Layout successfully applied!")
