const fs = require('fs');

function fixApp() {
  const filePath = 'src/App.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Normalize everything to \n first for easy searching, then write back with original platform newlines just in case (though git will handle it)
  content = content.replace(/\r\n/g, '\n');

  // Helper log function
  const applyPatch = (name, searchStr, replaceStr) => {
    if (content.includes(searchStr)) {
      content = content.replace(searchStr, replaceStr);
      console.log(`[OK] Applied: \${name}`);
    } else {
      console.log(`[FAIL] Could not find string for: \${name}`);
    }
  };

  const search15b = `  onDeactivateJob,
  onPreviewJob,`;
  const replace15b = `  onDeactivateJob,
  onReactivateJob,
  onPreviewJob,`;
  applyPatch('1.5b. Add onReactivateJob destructure', search15b, replace15b);

  // 2. Pass handleReactivateJob to Dashboard
  const search2 = `                onDeactivateJob={handleDeactivateJob}
                onPreviewJob={(job) => setPreviewJobState(job)}`;
  const replace2 = `                onDeactivateJob={handleDeactivateJob}
                onReactivateJob={handleReactivateJob}
                onPreviewJob={(job) => setPreviewJobState(job)}`;
  applyPatch('2. Pass to Dashboard', search2, replace2);

  // 3. Add onReactivate to ActiveJobs props
  const search3 = `  onDeactivate,
  onPreview,
}: {`;
  const replace3 = `  onDeactivate,
  onPreview,
  onReactivate,
}: {`;
  applyPatch('3. Add onReactivate to ActiveJobs', search3, replace3);

  // 4. Pass down onReactivate from Dashboard to ActiveJobs
  const search4 = `              onDeactivate={subTab === "active" ? onDeactivateJob : undefined}
            />`;
  const replace4 = `              onDeactivate={subTab === "active" ? onDeactivateJob : undefined}
              onReactivate={subTab === "inactive" ? onReactivateJob : undefined}
            />`;
  applyPatch('4. Pass down onReactivate to ActiveJobs', search4, replace4);

  // 5. Add button in ActiveJobs menu
  const search5 = `                          <Ban size={16} /> نقل إلى غير النشطة {" "}
                        </button>
                      )}{" "}
                    </div>`;
  const replace5 = `                          <Ban size={16} /> نقل إلى غير النشطة {" "}
                        </button>
                      )}{" "}
                      {expired && onReactivate && (
                        <button
                          onClick={() => {
                            onReactivate(job);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-right px-4 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center gap-3 border-t border-slate-50 dark:border-slate-700 mt-1"
                        >
                          {" "}
                          <RotateCcw size={16} /> إعادة تنشيط الوظيفة{" "}
                        </button>
                      )}
                    </div>`;
  applyPatch('5. Add button in ActiveJobs menu', search5, replace5);

  // 6.b Pass `onAutoSaveDraft` to `<CreateJob>`
  const search6b = `                onSubmit={handleCreateJob}
                userProfile={userProfile}`;
  const replace6b = `                onSubmit={handleCreateJob}
                onAutoSaveDraft={handleAutoSaveDraft}
                userProfile={userProfile}`;
  applyPatch('6b. Pass onAutoSaveDraft', search6b, replace6b);

  const search6c2 = `  onSubmit,
  userProfile,`;
  const replace6c2 = `  onSubmit,
  onAutoSaveDraft,
  userProfile,`;
  applyPatch('6c2. Destructure onAutoSaveDraft', search6c2, replace6c2);

  fs.writeFileSync(filePath, content, 'utf8');
}

fixApp();
