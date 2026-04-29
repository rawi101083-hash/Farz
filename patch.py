import os

file_path = r"c:\Users\rawi1\Downloads\التوظيف-الذكي-_-smart-recruitment\src\components\ApplicantDetails.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add states
states_target = """  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");"""

states_replacement = """  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [interviewTime, setInterviewTime] = useState("10:00");
  const [interviewText, setInterviewText] = useState("");"""

content = content.replace(states_target, states_replacement)

# 2. Add useEffect for interviewText
effect_target = """  useEffect(() => {
    setOfferText(`السلام عليكم الأستاذ/ ${actualName}،\\n\\nيسعدنا إبلاغك بقبولك المبدئي لوظيفة ${actualJob} في ${companyName}، براتب شهري قدره ${applicant?.expectedSalary || "يُحدد لاحقاً"}.\\n\\nنأمل تأكيد المباشرة في تاريخ: ${startDate}.\\n\\nمع أطيب التحيات،\\nإدارة الموارد البشرية`);
  }, [startDate, actualName, actualJob, applicant?.expectedSalary, companyName]);"""

effect_replacement = effect_target + """\n\n  useEffect(() => {
    setInterviewText(`السلام عليكم الأستاذ/ ${actualName}،\\n\\nيسعدنا إبلاغك بترشيحك للمقابلة الشخصية لوظيفة ${actualJob} في ${companyName}.\\n\\nتم تحديد موعد المقابلة يوم ${interviewDate} الساعة ${interviewTime}.\\nنأمل منك تأكيد الحضور.\\n\\nمع أطيب التحيات،\\nإدارة الموارد البشرية`);
  }, [interviewDate, interviewTime, actualName, actualJob, companyName]);"""

content = content.replace(effect_target, effect_replacement)

# 3. Add Interview Button
button_target = """          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (applicant) {
                  setShowAcceptOptions(true);
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <CheckCircle size={16} /> قبول
            </button>"""

button_replacement = """          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (applicant) {
                  setShowInterviewModal(true);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Calendar size={16} /> المقابلة
            </button>
            <button
              onClick={() => {
                if (applicant) {
                  setShowAcceptOptions(true);
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <CheckCircle size={16} /> قبول
            </button>"""

content = content.replace(button_target, button_replacement)

# 4. Add Interview Modal at the end
modal_target = """            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicantDetails;"""

modal_replacement = """            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInterviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-2">
                  <Calendar size={24} className="text-blue-500" /> تحديد موعد مقابلة
                </h3>
                <button
                  onClick={() => setShowInterviewModal(false)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تاريخ المقابلة</label>
                    <input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الوقت</label>
                    <input
                      type="time"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نص الدعوة (قابل للتعديل)</label>
                  <textarea
                    value={interviewText}
                    onChange={(e) => setInterviewText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-medium resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${candidate.whatsapp.replace(/\D/g, '')}&text=${encodeURIComponent(interviewText)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => { handleUpdateDecision("interviewing"); setShowInterviewModal(false); }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-md"
                  >
                    <MessageCircle size={20} /> دعوة عبر WhatsApp
                  </a>
                  <a
                    href={`mailto:${candidate.email}?subject=${encodeURIComponent("دعوة للمقابلة الشخصية: " + actualJob)}&body=${encodeURIComponent(interviewText)}`}
                    onClick={() => { handleUpdateDecision("interviewing"); setShowInterviewModal(false); }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-md"
                  >
                    <Mail size={20} /> دعوة عبر الإيميل
                  </a>
                </div>
                <button
                  onClick={() => {
                    handleUpdateDecision("interviewing");
                    setShowInterviewModal(false);
                  }}
                  className="w-full py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all flex justify-center items-center gap-2"
                >
                  <CheckCircle size={18} /> حفظ كمرشح للمقابلة فقط
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicantDetails;"""

content = content.replace(modal_target, modal_replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File successfully patched.")
