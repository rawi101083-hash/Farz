const fs = require('fs');

let c = fs.readFileSync('src/App.tmp.tsx', 'utf8');

const targetWebhook = `    if (isAutoRejected) {
      finalFormData.append("matchScore", "0");
      finalFormData.append("status", "مستبعد آلياً / غير مطابق");
      finalFormData.append("skipAI", "true");
      console.log("Knockout Question failed: Applicant Auto-Rejected. Appended skipAI=true to avoid API costs.");
    }

    try {
      if (!isAutoRejected) {
        await fetch(
          "https://circular-struggle-ethical-membership.trycloudflare.com/webhook-test/2489027f-d077-4af4-9d3d-fc0dd9f38953",
          { method: "POST", body: finalFormData },
        );
      } else {
        // Mock webhook hit for auto-reject (usually would point to a faster, non-AI DB webhook route)
        console.log("Mocking instant webhook save for auto-rejected applicant.");
      }
    } catch (error) {
      console.error("Webhook error:", error);
    }
    setTimeout(() => {
      setFormStep("success");
    }, 1500);`;

const replacementWebhook = `    if (isAutoRejected) {
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
      roleDescription: "", // Optional additional description
      textQualifications: "",
      targetMajors: activeTargetRole?.targetMajors || [],
      targetSkills: activeTargetRole?.skills || [],
      requiredLanguages: activeTargetRole?.languages || [],
      applicantTextAnswers: customAnswers.map((q: any) => \`\${q.question}: \${q.answer}\`).join('\\n'),
      aiCustomPrompts: activeTargetRole?.aiInstructions || "" 
    };

    // Transition to success IMMEDIATELY
    setFormStep("success");
    setIsSubmitting(false);

    // Background fetch to n8n
    fetch(
      "https://hook.eu2.make.com/97m969uoghh3aebpmsw141hch4xxkpx4", // Using existing webhook or if we change it later
      { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload) 
      }
    ).then(res => res.json())
     .then(data => {
       // Mock appending to HR DB later
       // data.match_percentage, data.top_strengths, data.top_weaknesses, data.ai_justification
       window.localStorage.setItem('mock_n8n_response', JSON.stringify(data));
       console.log("Background n8n AI Analysis completed.");
     })
     .catch(err => {
       console.error("n8n Webhook error:", err);
       // Mock fallback
       const fallbackData = {
         match_percentage: 85,
         top_strengths: ["يمتلك خبرة 5 سنوات مطابقة للحد الأدنى المطلوب."],
         top_weaknesses: ["يفتقر لشهادة PMP."],
         ai_justification: "تم وضع نتيجة تقديرية نظراً لوجود خطأ في الاتصال بالذكاء الاصطناعي."
       };
       window.localStorage.setItem('mock_n8n_response', JSON.stringify(fallbackData));
     });`;

c = c.replace(targetWebhook, replacementWebhook);

fs.writeFileSync('src/App.tmp.tsx', c);
