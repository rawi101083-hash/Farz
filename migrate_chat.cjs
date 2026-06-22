const fs = require('fs');
let code = fs.readFileSync('src/components/CreateJob.tsx', 'utf8');

// 1. Add state variable for the Modal
if (!code.includes('isChatModalOpen')) {
  code = code.replace(
    'const [currentStep, setCurrentStep] = useState(1);',
    'const [currentStep, setCurrentStep] = useState(1);\n  const [isChatModalOpen, setIsChatModalOpen] = useState(false);'
  );
}

// 2. Locate the Chat UI Panel and extract it into a Modal
const chatPanelStart = '        {/* Chat UI Panel */}';
const mainFormContentStart = '        {/* Main Form Content */}';
if (code.includes(chatPanelStart)) {
  const chatPanelJSX = code.substring(code.indexOf(chatPanelStart), code.indexOf(mainFormContentStart));

  const modalJSX = `
      {/* Smart Assistant Modal */}
      <AnimatePresence>
        {isChatModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[80vh] max-h-[700px]"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                 <div>
                   <h3 className="font-bold text-navy dark:text-white flex items-center gap-2">
                     <Sparkles className="text-primary" size={18}/> مستشار التوظيف الذكي
                   </h3>
                   <p className="text-xs text-slate-500 mt-1">يساعدك في صياغة الإعلان و استخراج التفاصيل</p>
                 </div>
                 <button type="button" onClick={() => setIsChatModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                   <X size={20} />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatScrollRef}>
                {chatMessages.map((msg, i) => (
                  <div key={i} className={\`flex flex-col \${msg.role === 'user' ? 'items-start' : 'items-end'}\`} dir="ltr">
                    <div dir="rtl" className={\`p-3 rounded-2xl max-w-[90%] text-sm leading-relaxed \${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-700 text-navy dark:text-white rounded-tl-sm'}\`}>
                      {msg.content.split('\\n').map((line, idx) => <React.Fragment key={idx}>{line}<br/></React.Fragment>)}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex items-start" dir="ltr">
                    <div dir="rtl" className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700 rounded-tl-sm flex gap-1 items-center">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: "0.4s"}}></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => {
                      setChatInput(e.target.value);
                      if (chatError) setChatError(null);
                    }} 
                    onKeyDown={(e) => { if (e.key === 'Enter' && !chatError) handleSendChatMessage(); }}
                    placeholder="اكتب رسالتك هنا..." 
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary dark:text-white"
                    disabled={isChatLoading || isApplyingAi}
                    maxLength={4000}
                  />
                  <button type="button" onClick={handleSendChatMessage} disabled={!chatInput.trim() || isChatLoading || isApplyingAi || !!chatError} className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 disabled:opacity-50 transition-opacity">
                     <ArrowLeft size={18} className="rotate-180" />
                  </button>
                </div>
                {chatError && (
                  <div className="mb-3 px-2 flex items-start gap-1.5 text-orange-600 dark:text-orange-400">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <p className="text-xs font-bold">{chatError}</p>
                  </div>
                )}
                <button 
                  type="button" 
                  onClick={async () => { await handleApplyChatToForm(); setIsChatModalOpen(false); }} 
                  disabled={chatMessages.length < 2 || isApplyingAi || isChatLoading}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-navy font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity shadow-md"
                >
                  {isApplyingAi ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Download size={16} />}
                  تطبيق التفاصيل على النموذج 📥
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
`;

  // Replace the old layout:
  code = code.replace('<div className="max-w-[1400px] mx-auto pb-32 flex flex-col xl:flex-row gap-6 px-4 xl:px-8">', '<div className="max-w-[900px] mx-auto pb-32 flex flex-col gap-6 px-4">');
  code = code.replace(chatPanelJSX, modalJSX);
  code = code.replace('<div className="flex-1 xl:max-w-4xl order-2 xl:order-1 min-w-0">', '<div className="flex-1 min-w-0">');
}

// 3. Add the Smart Assistant Button to Step 1
const roleSummaryLabelSearch = '<label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">\n                              نبذة عن الدور';
if (code.includes(roleSummaryLabelSearch) && !code.includes('استخدام المستشار الذكي')) {
  const smartAssistantButtonJSX = `
                      <div className="mt-8 mb-8 p-6 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-navy dark:text-white flex items-center gap-2 text-lg">
                            <Sparkles className="text-primary animate-pulse" size={24}/> مستشار التوظيف الذكي
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">هل ترغب في توليد الوصف الوظيفي والمهام باستخدام الذكاء الاصطناعي؟</p>
                        </div>
                        <button type="button" onClick={() => setIsChatModalOpen(true)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 whitespace-nowrap">
                          <Sparkles size={18} />
                          استخدام المستشار الذكي
                        </button>
                      </div>

                      `;
  code = code.replace(roleSummaryLabelSearch, smartAssistantButtonJSX + roleSummaryLabelSearch);
} else {
  console.log("Could not find roleSummaryLabel to inject button");
}

fs.writeFileSync('src/components/CreateJob.tsx', code);
console.log('Chat converted to Modal successfully.');
