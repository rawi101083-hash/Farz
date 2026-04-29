const fs = require('fs');

let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

let startIdx = lines.findIndex(l => l.includes('if (isAutoRejected) {'));
let endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('setTimeout(() => {') && lines[i+1].includes('setFormStep("success")'));

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `    if (isAutoRejected) {
      console.log("Knockout Question failed: Applicant Auto-Rejected. Webhook skipped.");
      setFormStep("success");
      setIsSubmitting(false);
      return;
    }

    // Prepare JSON for n8n
    const activeTargetRole = activeRole || job;
    const n8nPayload = {
      applicant_name: submitData.fullName || "",
      cv_text: extractedCvText,
      jobTitle: activeTargetRole?.title || "",
      minEducation: activeTargetRole?.qualification || "لا يشترط",
      minExperience: activeTargetRole?.experience || "لا يشترط",
      responsibilities: activeTargetRole?.description || "",
      roleDescription: "", 
      textQualifications: "",
      targetMajors: activeTargetRole?.targetMajors || [],
      targetSkills: activeTargetRole?.skills || [],
      requiredLanguages: activeTargetRole?.languages || [],
      applicantTextAnswers: customAnswers.map((q) => q.question + ': ' + q.answer).join('\\n'),
      aiCustomPrompts: activeTargetRole?.aiInstructions || "" 
    };

    setFormStep("success");
    setIsSubmitting(false);

    // Background fetch to n8n
    fetch(
      "https://hook.eu2.make.com/97m969uoghh3aebpmsw141hch4xxkpx4", 
      { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload) 
      }
    ).then(res => res.json())
     .then(data => {
       window.localStorage.setItem('mock_n8n_response', JSON.stringify(data));
       console.log("Background n8n AI Analysis completed.");
     })
     .catch(err => {
       console.error("n8n Webhook error:", err);
       const fallbackData = {
         match_percentage: 85,
         top_strengths: ["يمتلك خبرة 5 سنوات مطابقة للحد الأدنى المطلوب."],
         top_weaknesses: ["يفتقر لشهادة PMP."],
         ai_justification: "تم وضع نتيجة تقديرية نظراً لوجود خطأ في الاتصال بالذكاء الاصطناعي."
       };
       window.localStorage.setItem('mock_n8n_response', JSON.stringify(fallbackData));
     });`;

    lines.splice(startIdx, (endIdx - startIdx) + 4, replacement);
    fs.writeFileSync('src/App.tsx', lines.join('\n'));
    console.log("Done");
} else {
    console.log("Failed to find boundaries", startIdx, endIdx);
}
